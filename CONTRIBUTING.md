# Contributing

## Akis

1. Degisiklikleri kucuk ve odakli tutun.
2. Yeni hedef eklerken `packages/core/src/manifest.ts` dosyasini guncelleyin.
3. Yeni adapter eklerken `packages/adapters/src` altinda `RuntimeAdapter` uygulayin.
4. PR acmadan once `npm run ci` calistirin.

## Kod Stili

- TypeScript ve ESM module syntax kullanilir.
- UI hedefleri ortak contract'lari `@uniframe/core` alias'i ile import eder.
- Platforma ozel davranis adapter seviyesinde tutulur.
