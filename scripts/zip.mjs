// Makes release/Home.zip that unzips to one "Home" folder with manifest.json right inside,
// which is the folder you pick in chrome://extensions > Load unpacked.
import { execFileSync } from "node:child_process"
import { cpSync, mkdirSync, rmSync } from "node:fs"

rmSync("release", { recursive: true, force: true })
mkdirSync("release")
cpSync("dist", "release/Home", { recursive: true })
execFileSync("zip", ["-qr", "-X", "Home.zip", "Home"], { cwd: "release" })
rmSync("release/Home", { recursive: true })
console.log("Made release/Home.zip")
