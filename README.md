# Uniframe Starter

Tek proje altinda API, React web, vanilla JS web, mobile-first hedef ve Electron desktop wrapper sunan framework baslangic paketi.

## Kurulum

```bash
npm install
npm run check
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

## Build

```bash
npm run build:web -- --flavor react
npm run build:web -- --flavor vanilla
npm run build
```

## Mimari

```txt
apps/
  api/             Express API
  web-react/       React web hedefi
  web-vanilla/     Vanilla JS web hedefi
  mobile-react/    Mobile-first React hedefi
  desktop/         Electron wrapper
packages/
  cli/             Uniframe komut satiri
shared/            Ortak contract ve platform adapter kodlari
framework.config.js
```

## Framework fikri

Uniframe'in ana ilkesi tek cati, coklu hedef:

- UI React veya vanilla JS ile yazilabilir.
- API ayni repo icinde yasayan Express route'lari ile calisir.
- Shared contract dosyalari tum hedefler tarafindan import edilir.
- Desktop hedefi Electron ile ayni web uygulamasini masaustune tasir.
- Mobile hedefi bugun mobile-first web/PWA olarak calisir; Expo/React Native adapter'i icin ayni CLI hedefi korunur.

Bu paket bir MVP iskeletidir: calisir, genisletilebilir ve adapter mimarisi icin sade bir temel verir.
