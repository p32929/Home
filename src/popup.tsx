import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom/client"
import { Check } from "lucide-react"
import "./index.css"
import { loadData, saveData } from "./lib/data"
import { SiteIcon, applyTheme, getTheme } from "./ui"

function Popup() {
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [status, setStatus] = useState<"idle" | "saved" | "exists">("idle")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setTitle(tab?.title ?? "")
      setLink(tab?.url ?? "")
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await loadData()
    if (data.urls.some((u) => u.link === link)) setStatus("exists")
    else {
      await saveData({ ...data, urls: [...data.urls, { title: title.trim(), link }] })
      setStatus("saved")
    }
    setTimeout(() => window.close(), 1200)
  }

  if (status !== "idle")
    return (
      <div className="flex w-72 flex-col items-center gap-2 p-6 text-sm">
        <Check className="h-8 w-8 text-green-500" />
        {status === "saved" ? "Added to your Home page" : "Already on your Home page"}
      </div>
    )

  return (
    <form onSubmit={save} className="flex w-72 flex-col gap-3 p-4">
      <h1 className="font-semibold">Add this page to Home</h1>
      <div className="flex items-center gap-3">
        {link && <SiteIcon title={title || "?"} link={link} size={36} />}
        <span className="truncate text-xs text-muted-foreground">{link}</span>
      </div>
      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" className="btn-ghost" onClick={() => window.close()}>
          Cancel
        </button>
        <button className="btn-primary" disabled={!title.trim() || !link}>
          Add
        </button>
      </div>
    </form>
  )
}

applyTheme(getTheme())
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
