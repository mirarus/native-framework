# Mimari

Uniframe, tek repo icinde birden fazla calisma hedefini ayni domain modeliyle yonetmek icin tasarlanmis bir starter/framework iskeletidir.

## Katmanlar

- `shared/`: Tum hedeflerin import ettigi contract, manifest ve platform adapter kodlari.
- `apps/api/`: Node/Express API runtime'i.
- `apps/web-react/`: React tabanli web hedefi.
- `apps/web-vanilla/`: Framework kullanmadan vanilla JS web hedefi.
- `apps/mobile-react/`: Mobile-first React hedefi. Expo/React Native adapter'i icin korunmus giris noktasi.
- `apps/desktop/`: Electron wrapper.
- `packages/cli/`: Tum hedefleri tek komut seti altinda toplayan Uniframe CLI.

## Ilkeler

- Ortak business logic `shared/` altinda yasar.
- Platform farklari adapter seviyesinde izole edilir.
- Her hedef bagimsiz calisabilir, ama ayni manifest ve contract setini kullanir.
- CI, lint, typecheck, test ve build komutlari tek `npm run ci` komutuyla dogrulanir.

## Genisletme Noktalari

- Yeni hedef eklemek icin `shared/manifest.js`, `framework.config.js` ve `packages/cli/uniframe.js` birlikte guncellenir.
- Runtime adapter'lari `shared/platform.js` uzerinden ortak API ile disariya acilir.
- Desktop paketleme icin Electron Forge veya electron-builder adapter'i CLI altina eklenebilir.
- Mobile native hedefi icin `apps/mobile-react` Expo/React Native projesine tasinabilir; shared contract yapisi degismez.
