# Platform Matrix

Uniframe'in platform yapisi `@capacitor + electron + react + vite + vue + node` stack'ini tek metadata paketinde toplar.

## Paket

```ts
import { formatPlatformMatrix, platformMatrix } from "@uniframe/platforms";
```

`packages/platforms/src` altindaki adapter dosyalari hedefleri ayrik ama ayni sozlesmeyle tanimlar:

- `adapters/capacitor.ts`: `@capacitor + React + Vite` mobile hedefi.
- `adapters/electron.ts`: React ve Vue desktop renderer hedefleri.
- `adapters/vite.ts`: React, Vue ve vanilla TypeScript web hedefleri.
- `adapters/node.ts`: Node + Express API hedefi.

## CLI

```bash
npm run platforms
```

Bu komut her hedef icin runtime, UI tipi ve calistirma komutunu yazdirir.

## Root Native Mobile

```bash
npm run build:mobile
npm run mobile:add:android
npm run mobile:sync
npm run mobile:open:android
```

`capacitor.config.ts` root seviyesinde durur ve `playground/mobile-react/dist` ciktisini native Android projesine baglar.

## Hedef Ozeti

```txt
api-node-express          Node + Express API
web-vite-react           Vite + React web
web-vite-vue             Vite + Vue web
web-vite-vanilla         Vite + vanilla TypeScript web
desktop-electron-react   Electron + React desktop
desktop-electron-vue     Electron + Vue desktop
mobile-capacitor-react   @capacitor + React mobile
```
