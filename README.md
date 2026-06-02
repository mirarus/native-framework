# Uniframe

Tek proje altinda TypeScript API, React web, vanilla TypeScript web, mobile-first hedef ve Electron desktop wrapper sunan profesyonel framework starter'i.

Uniframe'in hedefi ayni domain modelini, contract'lari ve gelistirici deneyimini koruyarak bir urunu farkli platformlarda tek cati altinda calistirmaktir.

## Kurulum

Gereksinim: Node.js 22.12+ ve npm 10+.

```bash
npm install
npm run check
```

## TypeScript ve VS Code

- Core runtime `packages/core/src` altinda TypeScript ile yazilir.
- Adapter modeli `packages/adapters/src` altinda genisletilir.
- React ve mobile hedefleri `.tsx`, vanilla hedefi `.ts`, API hedefi `.ts` kullanir.
- `@uniframe/core` ve `@uniframe/adapters` alias'lari tsconfig ve Vite tarafinda hazirdir.
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
npm run dev              # API + React web + vanilla web
npm run dev:api          # http://localhost:4100
npm run dev:web:react    # http://localhost:5173
npm run dev:web:vanilla  # http://localhost:5174
npm run dev:mobile       # http://localhost:5175
npm run dev:desktop      # Electron wrapper + React web
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
npm run build
```

## Mimari

```txt
apps/
  api/             TypeScript Express API
  web-react/       React + TypeScript web hedefi
  web-vanilla/     Vanilla TypeScript web hedefi
  mobile-react/    Mobile-first React + TypeScript hedefi
  desktop/         Electron wrapper
packages/
  adapters/        Platform adapter ornekleri
  cli/             TypeScript kaynakli Uniframe komut satiri
  core/            Manifest, contract ve ortak runtime tipleri
framework.config.js
```

Detaylar:

- [Mimari](docs/architecture.md)
- [Adapter Rehberi](docs/adapters.md)
- [Gelistirme Rehberi](docs/development.md)
- [Katki Rehberi](CONTRIBUTING.md)
- [Guvenlik](SECURITY.md)

## Framework fikri

Uniframe'in ana ilkesi tek cati, coklu hedef:

- UI React veya vanilla JS ile yazilabilir.
- API ayni repo icinde yasayan Express route'lari ile calisir.
- Core contract dosyalari tum hedefler tarafindan import edilir.
- Desktop hedefi Electron ile ayni web uygulamasini masaustune tasir.
- Mobile hedefi bugun mobile-first web/PWA olarak calisir; Expo/React Native adapter'i icin ayni CLI hedefi korunur.

Bu paket artik sadece MVP degil; CI, lint, typecheck, test, manifest, dokumantasyon ve guvenlik hijyeni olan genisletilebilir bir framework temelidir.
