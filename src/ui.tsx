import { ReactNode, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { faviconUrl } from "@/lib/data"

export type Theme = "light" | "dark" | "system"
const THEME_KEY = "vite-ui-theme" // same key as the old version

export function getTheme(): Theme {
  const t = localStorage.getItem(THEME_KEY)
  return t === "light" || t === "dark" || t === "system" ? t : "system"
}

export function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getTheme)
  useEffect(() => {
    applyTheme(theme)
    if (theme !== "system") return
    const mq = matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])
  const setTheme = (t: Theme) => {
    localStorage.setItem(THEME_KEY, t)
    setThemeState(t)
  }
  return [theme, setTheme] as const
}

/** Native <dialog>, so focus trapping and Escape come for free. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="w-[min(92vw,28rem)] rounded-2xl border bg-card p-0 text-foreground shadow-2xl"
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button className="btn-ghost -mr-2 p-1.5" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  )
}

function hue(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}

/** A custom image, a #color, the site's favicon, or the first letter as a last resort. */
export function SiteIcon({ title, link, icon, size = 40 }: { title: string; link: string; icon?: string; size?: number }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [link, icon])
  const box = { width: size, height: size }
  if (icon?.startsWith("#")) return <div className="rounded-xl" style={{ ...box, background: icon }} />
  const src = icon || faviconUrl(link)
  if (src && !failed)
    return (
      <div className="grid place-items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5" style={box}>
        <img src={src} alt="" width={size * 0.6} height={size * 0.6} className="rounded" onError={() => setFailed(true)} />
      </div>
    )
  return (
    <div
      className="grid place-items-center rounded-xl text-lg font-semibold text-white"
      style={{ ...box, background: `hsl(${hue(link)} 55% 50%)` }}
    >
      {(title.trim()[0] ?? "?").toUpperCase()}
    </div>
  )
}
