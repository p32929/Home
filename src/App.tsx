import { useEffect, useRef, useState } from "react"
import { Download, Github, Monitor, Moon, MoreHorizontal, Pencil, Plus, Search, Sun, Trash2, Upload } from "lucide-react"
import { Data, Link, SortOption, isValidUrl, looksLikeUrl, normalize, sorted, useData, withScheme } from "@/lib/data"
import { Modal, SiteIcon, Theme, useTheme } from "@/ui"

const STARTERS: Link[] = [
  { title: "Google", link: "https://www.google.com" },
  { title: "YouTube", link: "https://www.youtube.com" },
  { title: "Gmail", link: "https://mail.google.com" },
  { title: "Wikipedia", link: "https://www.wikipedia.org" },
]

const SORTS: { value: SortOption; label: string }[] = [
  { value: "Creation", label: "My order" },
  { value: "Name", label: "Name" },
  { value: "Clicks", label: "Most used" },
]

function greeting(h: number) {
  if (h < 5) return "Good night"
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  if (h < 22) return "Good evening"
  return "Good night"
}

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-center">
      <div className="text-7xl font-light tracking-tight tabular-nums sm:text-8xl">
        {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </div>
      <div className="mt-2 text-muted-foreground">
        {greeting(now.getHours())} · {now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  )
}

function SearchBox() {
  const [q, setQ] = useState("")
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = q.trim()
    if (!text) return
    if (looksLikeUrl(text)) location.href = withScheme(text)
    else if (typeof chrome !== "undefined" && chrome.search?.query) chrome.search.query({ text, disposition: "CURRENT_TAB" })
    else location.href = `https://www.google.com/search?q=${encodeURIComponent(text)}`
  }
  return (
    <form onSubmit={submit} className="relative mx-auto w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the web or type an address"
        className="w-full rounded-full border bg-card py-3.5 pl-12 pr-5 text-base shadow-sm outline-none transition focus:ring-2 focus:ring-primary/40"
      />
    </form>
  )
}

/** Small popup menu at a screen position; closes on outside click, scroll or Escape. */
function useMenu<T>() {
  const [menu, setMenu] = useState<{ x: number; y: number; value: T } | null>(null)
  useEffect(() => {
    if (!menu) return
    const close = () => setMenu(null)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("click", close)
    window.addEventListener("scroll", close, true)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("keydown", onKey)
    }
  }, [menu])
  const open = (e: React.MouseEvent, value: T) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: Math.min(e.clientX, innerWidth - 200), y: Math.min(e.clientY, innerHeight - 200), value })
  }
  return { menu, open, close: () => setMenu(null) }
}

function LinkDialog({ initial, onSave, onClose }: { initial: Link | null; onSave: (l: Link) => void; onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [icon, setIcon] = useState("")
  useEffect(() => {
    setTitle(initial?.title ?? "")
    setLink(initial?.link ?? "")
    setIcon(initial?.icon ?? "")
  }, [initial])
  const iconOk = !icon || /^#[0-9a-f]{6}$/i.test(icon) || /^https?:\/\//i.test(icon) || icon.startsWith("data:image/")
  const ok = title.trim() && isValidUrl(link) && iconOk
  const isNew = !initial?.link
  return (
    <Modal open={!!initial} onClose={onClose} title={isNew ? "Add a link" : "Edit link"}>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (ok) onSave({ ...initial, title: title.trim(), link: withScheme(link), icon: icon.trim() || undefined })
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm">
          Name
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="YouTube" autoFocus />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Address
          <input className="input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="youtube.com" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span>
            Icon <span className="text-muted-foreground">(optional: an image link or a color like #4f46e5)</span>
          </span>
          <input className="input" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Leave empty to use the site's icon" />
        </label>
        {title && isValidUrl(link) && iconOk && (
          <div className="flex items-center gap-3 rounded-lg bg-accent p-3 text-sm">
            <SiteIcon title={title} link={withScheme(link)} icon={icon || undefined} size={32} />
            {title}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={!ok}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ImportDialog({ open, onImport, onClose }: { open: boolean; onImport: (d: Data) => void; onClose: () => void }) {
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const file = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setText("")
    setError("")
  }, [open])
  const parse = async (raw: string) => {
    try {
      const t = raw.trim()
      const json = /^https?:\/\//i.test(t) ? await (await fetch(t)).json() : JSON.parse(t)
      const data = normalize(json)
      if (!data.urls.length) throw new Error()
      onImport(data)
    } catch {
      setError("That doesn't look like a Home export. Check the text and try again.")
    }
  }
  return (
    <Modal open={open} onClose={onClose} title="Import links">
      <p className="mb-3 text-sm text-muted-foreground">
        Choose an exported file, or paste the exported text (or a link to it). This replaces your current links.
      </p>
      <input
        ref={file}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (f) parse(await f.text())
          e.target.value = ""
        }}
      />
      <button className="btn-ghost mb-3 w-full border" onClick={() => file.current?.click()}>
        <Upload className="h-4 w-4" /> Choose a file
      </button>
      <textarea className="input h-28 font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} placeholder='{"urls": [...]}' />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-primary" disabled={!text.trim()} onClick={() => parse(text)}>
          Import
        </button>
      </div>
    </Modal>
  )
}

function exportFile(data: Data) {
  const clean = { ...data, urls: data.urls.map(({ title, link, icon }) => ({ title, link, icon })) }
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" }))
  a.download = `home-links-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export default function App() {
  const [data, setData] = useData()
  const [theme, setTheme] = useTheme()
  const [editing, setEditing] = useState<{ index: number; link: Link } | null>(null)
  const [importing, setImporting] = useState(false)
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const tileMenu = useMenu<number>()
  const mainMenu = useMenu<null>()

  if (!data) return null
  const items = sorted(data)
  const canReorder = data.sortOption === "Creation"
  const urls = data.urls

  const save = (l: Link) => {
    const next = [...urls]
    if (editing && editing.index >= 0) next[editing.index] = l
    else next.push(l)
    setData({ ...data, urls: next })
    setEditing(null)
  }
  const remove = (i: number) => setData({ ...data, urls: urls.filter((_, j) => j !== i) })
  const move = (from: number, to: number) => {
    const next = [...urls]
    next.splice(to, 0, next.splice(from, 1)[0])
    setData({ ...data, urls: next })
  }
  const count = (i: number) => setData({ ...data, urls: urls.map((u, j) => (j === i ? { ...u, clicks: (u.clicks ?? 0) + 1 } : u)) })
  const ThemeIcon = THEMES.find((t) => t.value === theme)!.icon

  return (
    <div className="min-h-screen">
      <div className="fixed right-4 top-4 flex gap-1">
        <button
          className="btn-ghost p-2.5"
          title={`Theme: ${theme}`}
          aria-label="Change theme"
          onClick={() => setTheme(THEMES[(THEMES.findIndex((t) => t.value === theme) + 1) % THEMES.length].value)}
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
        <button className="btn-ghost p-2.5" title="More" aria-label="More options" onClick={(e) => mainMenu.open(e, null)}>
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-[12vh]">
        <Clock />
        <SearchBox />

        {urls.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 text-center">
            <h2 className="text-lg font-semibold">Your links live here</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add the sites you open every day. Tap one to start:</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {STARTERS.map((s) => (
                <button key={s.link} className="btn-ghost justify-start border" onClick={() => setData({ ...data, urls: [...urls, s] })}>
                  <SiteIcon title={s.title} link={s.link} size={24} /> {s.title}
                </button>
              ))}
            </div>
            <button className="btn-primary mt-3 w-full" onClick={() => setEditing({ index: -1, link: { title: "", link: "" } })}>
              <Plus className="h-4 w-4" /> Add your own link
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2">
            {items.map((u) => (
              <a
                key={u.index}
                href={u.link}
                draggable={canReorder}
                onDragStart={() => setDragFrom(u.index)}
                onDragOver={(e) => canReorder && dragFrom !== null && e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  if (dragFrom !== null && dragFrom !== u.index) move(dragFrom, u.index)
                  setDragFrom(null)
                }}
                onDragEnd={() => setDragFrom(null)}
                onClick={() => count(u.index)}
                onAuxClick={(e) => e.button === 1 && count(u.index)}
                onContextMenu={(e) => tileMenu.open(e, u.index)}
                title={u.link}
                className={`group relative flex w-28 flex-col items-center gap-2 rounded-2xl p-3 pt-4 text-center transition hover:bg-card hover:shadow-sm ${
                  dragFrom === u.index ? "opacity-40" : ""
                }`}
              >
                <SiteIcon title={u.title} link={u.link} icon={u.icon} size={52} />
                <span className="w-full truncate text-sm">{u.title}</span>
                <button
                  className="absolute right-1 top-1 rounded-lg p-1 text-muted-foreground opacity-0 hover:bg-accent group-hover:opacity-100 focus:opacity-100"
                  aria-label={`Options for ${u.title}`}
                  onClick={(e) => tileMenu.open(e, u.index)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </a>
            ))}
            <button
              onClick={() => setEditing({ index: -1, link: { title: "", link: "" } })}
              className="flex w-28 flex-col items-center gap-2 rounded-2xl p-3 pt-4 text-sm text-muted-foreground transition hover:bg-card hover:text-foreground hover:shadow-sm"
            >
              <span className="grid h-[52px] w-[52px] place-items-center rounded-xl border-2 border-dashed">
                <Plus className="h-5 w-5" />
              </span>
              Add link
            </button>
          </div>
        )}

        {urls.length > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Right-click a link to edit it{canReorder ? " · drag to reorder" : ""} · Ctrl or ⌘ click opens in a new tab
          </p>
        )}
      </main>

      {tileMenu.menu && (
        <div className="menu fixed z-50" style={{ left: tileMenu.menu.x, top: tileMenu.menu.y }} onClick={(e) => e.stopPropagation()}>
          <button
            className="menu-item"
            onClick={() => {
              const i = tileMenu.menu!.value
              setEditing({ index: i, link: urls[i] })
              tileMenu.close()
            }}
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            className="menu-item text-red-500"
            onClick={() => {
              remove(tileMenu.menu!.value)
              tileMenu.close()
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}

      {mainMenu.menu && (
        <div className="menu fixed right-4 top-16 z-50" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">Sort links by</div>
          {SORTS.map((s) => (
            <button key={s.value} className="menu-item" onClick={() => setData({ ...data, sortOption: s.value })}>
              <span className={`h-2 w-2 rounded-full ${data.sortOption === s.value ? "bg-primary" : "bg-transparent"}`} />
              {s.label}
            </button>
          ))}
          <div className="my-1 border-t" />
          <button
            className="menu-item"
            onClick={() => {
              setEditing({ index: -1, link: { title: "", link: "" } })
              mainMenu.close()
            }}
          >
            <Plus className="h-4 w-4" /> Add link
          </button>
          <button
            className="menu-item"
            onClick={() => {
              exportFile(data)
              mainMenu.close()
            }}
          >
            <Download className="h-4 w-4" /> Export links
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setImporting(true)
              mainMenu.close()
            }}
          >
            <Upload className="h-4 w-4" /> Import links
          </button>
          <div className="my-1 border-t" />
          <a className="menu-item" href="https://github.com/p32929/Home" target="_blank" rel="noreferrer">
            <Github className="h-4 w-4" /> Source code
          </a>
        </div>
      )}

      <LinkDialog initial={editing?.link ?? null} onSave={save} onClose={() => setEditing(null)} />
      <ImportDialog
        open={importing}
        onClose={() => setImporting(false)}
        onImport={(d) => {
          setData(d)
          setImporting(false)
        }}
      />
    </div>
  )
}
