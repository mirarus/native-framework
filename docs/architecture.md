# Mimari

Uniframe, tek repo icinde birden fazla calisma hedefini ayni domain modeliyle yonetmek icin tasarlanmis bir starter/framework iskeletidir.

## Katmanlar

- `packages/core/src`: Tum hedeflerin import ettigi TypeScript contract, manifest ve platform tipleri.
- `packages/adapters/src`: Browser, Node ve yeni platform adapter'lari icin genisletme noktasi.
- `packages/vite/src`: Vite config helper'i ve tsconfig path entegrasyonu.
- `playground/api/src`: TypeScript Node/Express API runtime'i.
- `playground/web-react/src`: React + TypeScript web hedefi.
- `playground/web-vue/src`: Vue + TypeScript web hedefi.
- `playground/web-vanilla/src`: Framework kullanmadan vanilla TypeScript web hedefi.
- `playground/mobile-react/src`: Mobile-first React + TypeScript hedefi.
- `playground/desktop/`: Electron main, preload, Vue renderer ve React renderer UI alanlari.
- `packages/cli/src`: Tum hedefleri tek komut seti altinda toplayan TypeScript Uniframe CLI.

## Ilkeler

- Ortak business logic `packages/core/src` altinda yasar.
- Platform farklari adapter seviyesinde izole edilir.
- Her hedef bagimsiz calisabilir, ama ayni manifest ve contract setini kullanir.
- Paketler ESM, CJS ve `.d.ts` ciktilari ureten library formatinda build edilir.
- CI, lint, typecheck, test ve build komutlari tek `npm run ci` komutuyla dogrulanir.

## Genisletme Noktalari

- Yeni hedef eklemek icin `packages/core/src/manifest.ts`, `framework.config.js` ve `packages/cli/src/uniframe.ts` birlikte guncellenir.
- Runtime adapter'lari `packages/adapters/src` uzerinden ortak API ile disariya acilir.
- Yeni Vite tabanli hedefler `@uniframe/vite` helper'i ile ortak config desenini kullanir.
- Desktop paketleme icin Electron Forge veya electron-builder adapter'i CLI altina eklenebilir; renderer React veya Vue olarak secilebilir.
- Mobile native hedefi icin `playground/mobile-react` adapter/template yapisina tasinabilir; core contract yapisi degismez.
