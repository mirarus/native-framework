# Gelistirme Rehberi

## Gunluk Komutlar

```bash
npm install
npm run check
npm run dev
```

## Kalite Kapisi

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run ci
```

## Hedefler

```bash
npm run dev:api
npm run dev:web:react
npm run dev:web:vue
npm run dev:web:vanilla
npm run dev:mobile
npm run dev:desktop
npm run dev:example
npm run dev:example:fullstack
npm run dev:example:fullstack:desktop
```

## Dosya Yapisi

```txt
playground/
  api/src/api-server.ts
  web-react/src/main.tsx
  web-react/src/app/app-root.tsx
  web-vue/src/main.ts
  web-vue/src/app/app-root.vue
  web-vanilla/src/main.ts
  mobile-react/src/main.tsx
  mobile-react/src/app/app-root.tsx
  desktop/main/desktop-main.cjs
  desktop/preload/desktop-preload.cjs
  desktop/renderer/src/main.ts
examples/
  hello-uniframe
  fullstack-uniframe
    apps/api
    apps/web
    apps/desktop
    apps/desktop/renderer
    apps/android
packages/
  core/src
  adapters/src
  vite/src
  cli/src
```

## Notlar

- Node.js 22.12+ gerekir.
- Playground build ciktilari `playground/*/dist` altina gider ve git'e alinmaz.
- `npm run clean` build ciktilarini temizler.
- `npm run info` framework manifest ve port bilgisini yazdirir.
- VS Code task'lari `.vscode/tasks.json` icinde hazirdir.
- `npm run build:packages` library paketlerini ESM, CJS ve type declaration formatinda uretir.
- `examples/fullstack-uniframe` API, web, desktop ve Android akisini tek proje icinde gosterir.
