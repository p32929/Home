import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Constants } from "@/lib/Constants";
import { IData, IUrlButton } from "@/lib/Models";
import { Check, X } from "lucide-react";

const Popup: React.FC = () => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<"idle" | "saved" | "error" | "exists">("idle");

  useEffect(() => {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab) {
        setTitle(tab.title || "");
        setLink(tab.url || "");
      }
    });
  }, []);

  const handleSave = () => {
    if (!title.trim() || !link.trim()) return;

    try {
      const stored = localStorage.getItem(Constants.STORAGE);
      const parsed = stored ? JSON.parse(stored) : {};
      const data: IData = {
        urls: Array.isArray(parsed.urls) ? parsed.urls : [],
        sortOption: parsed.sortOption ?? "Creation",
      };

      // Check if URL already exists
      const exists = data.urls.some((u) => u.link === link);
      if (exists) {
        setStatus("exists");
        setTimeout(() => window.close(), 1500);
        return;
      }

      const newUrl: IUrlButton = { title: title.trim(), link: link.trim() };
      data.urls.push(newUrl);
      localStorage.setItem(Constants.STORAGE, JSON.stringify(data));
      setStatus("saved");
      setTimeout(() => window.close(), 1000);
    } catch (e) {
      setStatus("error");
    }
  };

  const handleCancel = () => {
    window.close();
  };

  if (status === "saved") {
    return (
      <div className="w-72 p-4 flex flex-col items-center gap-2 bg-background text-foreground">
        <Check className="w-8 h-8 text-green-500" />
        <p className="text-sm">Saved!</p>
      </div>
    );
  }

  if (status === "exists") {
    return (
      <div className="w-72 p-4 flex flex-col items-center gap-2 bg-background text-foreground">
        <X className="w-8 h-8 text-yellow-500" />
        <p className="text-sm">URL already exists</p>
      </div>
    );
  }

  return (
    <div className="w-72 p-4 flex flex-col gap-3 bg-background text-foreground">
      <h2 className="text-sm font-semibold">Save this page</h2>

      <div className="flex flex-col gap-1">
        <Label htmlFor="title" className="text-xs">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="link" className="text-xs">
          URL
        </Label>
        <Input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="h-8 text-sm"
          readOnly
        />
      </div>

      <div className="flex gap-2 justify-end mt-1">
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave} disabled={!title.trim() || !link.trim()}>
          Save
        </Button>
      </div>

      {status === "error" && <p className="text-xs text-red-500">Failed to save</p>}
    </div>
  );
};

export default Popup;
