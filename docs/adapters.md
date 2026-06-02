# Adapter Rehberi

Uniframe'de platform farklari adapter paketleriyle izole edilir. Yeni bir platform eklerken hedef, uygulama kodunu degil adapter katmanini degistirmektir.

## Mevcut Paketler

- `@uniframe/core`: Manifest, contract, platform tipleri ve ortak runtime yardimcilari.
- `@uniframe/adapters`: Browser ve Node adapter ornekleri.
- `@uniframe/vite`: Vite tabanli hedefler icin ortak config helper'i.

## Yeni Adapter Ekleme

1. `packages/adapters/src/<platform>.ts` dosyasi olusturun.
2. `RuntimeAdapter` interface'ini uygulayin.
3. `packages/adapters/src/index.ts` icinden export edin.
4. Gerekiyorsa `shared` degil, `packages/core/src` tiplerini kullanin.
5. Yeni hedef gerekiyorsa `packages/core/src/manifest.ts` ve `packages/cli/src/uniframe.ts` dosyalarini guncelleyin.

## Ornek

```ts
import type { RuntimeAdapter } from "@uniframe/adapters";

export const nativeAdapter: RuntimeAdapter = {
  name: "native",
  runtime: "native",
  storage(namespace) {
    return createNativeStorage(namespace);
  }
};
```
