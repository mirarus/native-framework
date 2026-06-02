# Uniframe

Tek proje altinda `@capacitor`, Electron, React, Vite, Vue ve Node destekli profesyonel framework workspace'i.

Uniframe'in hedefi ayni domain modelini, contract'lari ve gelistirici deneyimini koruyarak bir urunu farkli platformlarda tek cati altinda calistirmaktir.

## Kurulum

Gereksinim: Node.js 22.12+ ve npm 10+.

Yeni proje:

```bash
npx create-uniframe my-app
cd my-app
npm install
npm run dev:web:react
```

Repo icinden ayni scaffold:

```bash
npm run create -- my-app
uniframe create my-app
```

```bash
npm install
npm run check
```

## TypeScript ve VS Code

- Core runtime `packages/core/src` altinda TypeScript ile yazilir.
- Adapter modeli `packages/adapters/src` altinda genisletilir.
- Vite entegrasyonu `packages/vite/src` altinda reusable library olarak bulunur.
- Platform matrisi `packages/platforms/src` altinda `@capacitor + electron + react + vite + vue + node` stack'ini tanimlar.
- React, mobile ve React desktop hedefleri `.tsx`, vanilla hedefi `.ts`, API hedefi `.ts` kullanir.
- Vue hedefi `.vue` single-file component ve `vue-tsc` typecheck kullanir.
- `@uniframe/core`, `@uniframe/adapters`, `@uniframe/platforms` ve `@uniframe/vite` alias'lari hazirdir.
- VS Code icin `.vscode/settings.json`, task ve extension onerileri eklenmistir.

## Kalite Kapisi

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run ci
```

## Gelistirme

```bash
npm run dev              # API + React web + Vue web + vanilla web
npm run dev:api          # http://localhost:4100
npm run dev:web:react    # http://localhost:5173
npm run dev:web:vanilla  # http://localhost:5174
npm run dev:web:vue      # http://localhost:5177
npm run dev:mobile       # http://localhost:5175
npm run dev:desktop      # Electron wrapper + React desktop
npm run dev:desktop:react
npm run dev:desktop:vue
npm run platforms       # @capacitor + electron + react + vite + vue + node matrix
npm run dev:example      # examples/hello-uniframe
npm run dev:example:fullstack
npm run dev:example:fullstack:desktop
```

## Bilgi ve Temizlik

```bash
npm run info             # Manifest, hedefler ve portlar
npm run clean            # Build ciktilarini temizler
```

## Build

```bash
npm run build:web -- --flavor react
npm run build:web -- --flavor vanilla
npm run build:web -- --flavor vue
npm run build:desktop:react
npm run build:desktop:vue
npm run build:mobile
npm run build:packages
npm run build:example
npm run build
```

## Native Mobile

```bash
npm run mobile:add:android
npm run mobile:sync
npm run mobile:open:android
```

Root Capacitor config `capacitor.config.ts` dosyasi `playground/mobile-react/dist` ciktisini Android native kabuguna baglar.

## Platform Matrix

```bash
npm run platforms
```

Bu komut framework stack'ini tek kayittan listeler:

- `@capacitor + React + Vite` mobile
- `Electron + React + Vite` desktop
- `Electron + Vue + Vite` desktop
- `Vite + React` web
- `Vite + Vue` web
- `Node + Express` API

## Mimari

```txt
capacitor.config.ts
playground/
  api/             TypeScript Express API
  web-react/       React + TypeScript web hedefi
  web-vue/         Vue + TypeScript web hedefi
  web-vanilla/     Vanilla TypeScript web hedefi
  mobile-react/    Mobile-first React + TypeScript hedefi
  desktop/
    main/          Electron main process
    preload/       Guvenli bridge
    renderer/      Vue desktop UI
    renderer-react/ React desktop UI
examples/
  hello-uniframe/  Framework paketlerini library gibi kullanan ornek proje
  fullstack-uniframe/
    apps/api/      Example Express API
    apps/web/      Example Vue web
    apps/desktop/  Example Electron main + React/Vue desktop renderer UI
    apps/android/  Android/Capacitor rehberi
packages/
  adapters/        Platform adapter ornekleri
  cli/             TypeScript kaynakli Uniframe komut satiri
  core/            Manifest, contract ve ortak runtime tipleri
  platforms/       @capacitor/electron/react/vite/vue/node matrix
  create-uniframe/ npx ile proje olusturan scaffold paketi
  vite/            Vite helper library
framework.config.js
```

Detaylar:

- [Mimari](docs/architecture.md)
- [Adapter Rehberi](docs/adapters.md)
- [Gelistirme Rehberi](docs/development.md)
- [Library Yapisi](docs/library.md)
- [Platform Matrix](docs/platforms.md)
- [Katki Rehberi](CONTRIBUTING.md)
- [Guvenlik](SECURITY.md)

## Framework fikri

Uniframe'in ana ilkesi tek cati, coklu hedef:

- UI React, Vue veya vanilla TypeScript ile yazilabilir.
- API ayni repo icinde yasayan Express route'lari ile calisir.
- Core contract dosyalari tum hedefler tarafindan import edilir.
- Desktop hedefi Electron ile kendi React veya Vue renderer UI alanini masaustune tasir.
- Mobile hedefi React + Vite olarak gelistirilir ve Capacitor ile Android native kabuguna senkronlanir.

Bu paket artik sadece MVP degil; CI, lint, typecheck, test, manifest, publish-ready library paketleri, ornek proje, dokumantasyon ve guvenlik hijyeni olan genisletilebilir bir framework temelidir.

## Fullstack Example

`examples/fullstack-uniframe` icinde ayni proje altinda hedefler ayridir:

```bash
npm --workspace fullstack-uniframe run dev:api
npm --workspace fullstack-uniframe run dev:web
npm --workspace fullstack-uniframe run dev:desktop
npm --workspace fullstack-uniframe run dev:desktop:react
npm --workspace fullstack-uniframe run dev:desktop:vue
npm --workspace fullstack-uniframe run build:desktop
npm --workspace fullstack-uniframe run build
```

Android icin:

```bash
npm --workspace fullstack-uniframe run android:add
npm --workspace fullstack-uniframe run android:sync
npm --workspace fullstack-uniframe run android:open
```

Android komutlari Android Studio ve Android SDK gerektirir.
