# Home

A minimal new-tab / homepage browser extension — your own links on a clean page instead of whatever the browser puts there. Built with React, TypeScript, Vite and shadcn/ui.

Works in Chrome and Firefox.

https://github.com/p32929/Home/assets/6418354/c28d4011-e72a-46ba-a816-ae8d60681758

## Install

Grab `dist.zip` from the [latest release](https://github.com/p32929/Home/releases/latest), or build it yourself:

```bash
git clone https://github.com/p32929/Home.git
cd Home
npm install
npm run build      # output lands in dist/
```

Then load it:

**Chrome**
1. Open `chrome://extensions` and turn on **Developer mode**
2. Click **Load unpacked** and select the `dist` folder

**Firefox**
1. Compress the `dist` folder into a ZIP
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on** and select the ZIP

## Develop

```bash
npm run dev        # vite dev server
```

## Build failing?

Delete `node_modules` and your lockfile (`yarn.lock` / `package-lock.json`), then install again:

```bash
rm -rf node_modules package-lock.json yarn.lock
npm install
```

## License

MIT License — see [LICENSE](LICENSE) for the full text.

## Contributing

Contributions are warmly welcomed and greatly appreciated! Whether it's a bug fix, new feature, or improvement, your input helps make this project better for everyone.

Before submitting a pull request, please:

1. Create an issue describing the feature or bug fix you'd like to work on
2. Wait for discussion and approval to ensure alignment with project goals
3. Fork the repository and create your feature branch
4. Submit your pull request with a clear description of changes

This approach helps avoid duplicate efforts and ensures smooth collaboration. Thank you for considering contributing!

## Share

Sharing this repository with your friends is just one click away from here

[![facebook](https://user-images.githubusercontent.com/6418354/179013321-ac1d1452-0689-493f-9066-940cf2302b6e.png)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/p32929/Home/)
[![twitter](https://user-images.githubusercontent.com/6418354/179013351-7d8d6d1c-4ce2-46ab-bef8-4c4765a1b888.png)](https://twitter.com/intent/tweet?url=https://github.com/p32929/Home/)
[![tumblr](https://user-images.githubusercontent.com/6418354/179013343-3111f55a-3b90-40c7-8487-9777348672b0.png)](https://www.tumblr.com/share?v=3&u=https://github.com/p32929/Home/)
[![pocket](https://user-images.githubusercontent.com/6418354/179013334-b095c45f-becf-49f4-9ee1-5a731a9b1f85.png)](https://getpocket.com/save?url=https://github.com/p32929/Home/)
[![pinterest](https://user-images.githubusercontent.com/6418354/179013331-44cd9206-11b1-4b65-becb-5863b61c828f.png)](https://pinterest.com/pin/create/button/?url=https://github.com/p32929/Home/)
[![reddit](https://user-images.githubusercontent.com/6418354/179013338-7416ae3f-73ba-4522-86e1-1374d7082d22.png)](https://www.reddit.com/submit?url=https://github.com/p32929/Home/)
[![linkedin](https://user-images.githubusercontent.com/6418354/179013327-ca7b7102-1da8-4b1c-858f-1a6e5f21bd70.png)](https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/p32929/Home/)
[![whatsapp](https://user-images.githubusercontent.com/6418354/179013353-f477fa0b-3e6f-4138-a357-c9991b23ff88.png)](https://api.whatsapp.com/send?text=https://github.com/p32929/Home/)
