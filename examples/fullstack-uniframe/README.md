# Fullstack Uniframe Example

Bu ornek tek proje icinde API, web, desktop ve Android hedeflerini nasil gelistirecegini gosterir.

## Komutlar

```bash
npm --workspace fullstack-uniframe run dev
npm --workspace fullstack-uniframe run dev:api
npm --workspace fullstack-uniframe run dev:web
npm --workspace fullstack-uniframe run dev:desktop
npm --workspace fullstack-uniframe run build
```

## Android

Android hedefi Capacitor ile ayni web uygulamasini native Android projesine tasir.

```bash
npm --workspace fullstack-uniframe run android:add
npm --workspace fullstack-uniframe run android:sync
npm --workspace fullstack-uniframe run android:open
```

`android:add` komutu native Android klasorunu uretir. Bu klasor Android Studio/SDK gerektirir ve CI icinde otomatik build edilmez.

## Dosya Yapisi

```txt
apps/
  api/       Express API
  web/       Vue + Vite web uygulamasi
  desktop/   Electron wrapper
capacitor.config.ts
```
