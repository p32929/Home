import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: { port: 4000 },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  base: "",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        popup: path.resolve(__dirname, "popup.html"),
      },
    },
  },
})
