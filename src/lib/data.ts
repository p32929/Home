import { useEffect, useState } from "react"

export interface Link {
  title: string
  link: string
  icon?: string // optional image URL or #color
  clicks?: number
}

export type SortOption = "Creation" | "Name" | "Clicks"

export interface Data {
  urls: Link[]
  sortOption: SortOption
}

// Same key the old version used in localStorage, so old data and old exports keep working.
const KEY = "STORAGE"
const hasChromeStorage = typeof chrome !== "undefined" && !!chrome.storage?.local

export function normalize(raw: unknown): Data {
  const obj = (Array.isArray(raw) ? { urls: raw } : raw ?? {}) as Partial<Data>
  const urls = Array.isArray(obj.urls)
    ? obj.urls
        .filter((u) => u && typeof u.title === "string" && typeof u.link === "string")
        .map((u) => ({ title: u.title, link: u.link, icon: u.icon || undefined, clicks: u.clicks || 0 }))
    : []
  const sortOption: SortOption = ["Creation", "Name", "Clicks"].includes(obj.sortOption as string)
    ? (obj.sortOption as SortOption)
    : "Creation"
  return { urls, sortOption }
}

function readLocal(): Data | null {
  try {
    const s = localStorage.getItem(KEY)
    return s ? normalize(JSON.parse(s)) : null
  } catch {
    return null
  }
}

export async function loadData(): Promise<Data> {
  if (!hasChromeStorage) return readLocal() ?? normalize(null)
  const stored = (await chrome.storage.local.get(KEY))[KEY]
  if (stored) return normalize(stored)
  // First run of 1.0: move links saved by the old version (page localStorage) into extension storage.
  // The old copy is left in place on purpose, as a backup.
  const old = readLocal()
  if (old) await chrome.storage.local.set({ [KEY]: old })
  return old ?? normalize(null)
}

export async function saveData(data: Data) {
  if (hasChromeStorage) await chrome.storage.local.set({ [KEY]: data })
  else localStorage.setItem(KEY, JSON.stringify(data))
}

/** Links state for the new-tab page; also picks up pages saved from the toolbar popup. */
export function useData() {
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    loadData().then(setData)
    if (!hasChromeStorage) return
    const onChange = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
      if (area === "local" && changes[KEY]) setData(normalize(changes[KEY].newValue))
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => chrome.storage.onChanged.removeListener(onChange)
  }, [])

  const update = (next: Data) => {
    setData(next)
    saveData(next)
  }
  return [data, update] as const
}

export function withScheme(url: string) {
  const u = url.trim()
  return /^[a-z][a-z0-9+.-]*:/i.test(u) ? u : `https://${u}`
}

export function isValidUrl(url: string) {
  try {
    new URL(withScheme(url))
    return true
  } catch {
    return false
  }
}

/** Looks like an address the user typed ("github.com", "localhost:3000"), not a search. */
export function looksLikeUrl(text: string) {
  const t = text.trim()
  if (/\s/.test(t)) return false
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(t) || /^localhost(:\d+)?(\/|$)/.test(t) || /^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(t)
}

// Chrome serves cached site icons to extensions (needs the "favicon" permission), so nothing goes over the network.
const isChromium = typeof chrome !== "undefined" && !!chrome.runtime?.getURL && !navigator.userAgent.includes("Firefox")
export function faviconUrl(link: string) {
  if (!isChromium) return ""
  return chrome.runtime.getURL(`/_favicon/?pageUrl=${encodeURIComponent(link)}&size=64`)
}

export function sorted(data: Data) {
  const withIndex = data.urls.map((u, index) => ({ ...u, index }))
  if (data.sortOption === "Name") withIndex.sort((a, b) => a.title.localeCompare(b.title))
  if (data.sortOption === "Clicks") withIndex.sort((a, b) => (b.clicks ?? 0) - (a.clicks ?? 0))
  return withIndex
}
