# Library Yapisi

Uniframe artik sadece bir uygulama starter'i degil, workspace icinde gelistirilen library paketlerinden olusan bir framework temelidir.

## Paketler

- `@uniframe/core`: Manifest, contract, platform tipleri, ortak storage ve health yardimcilari.
- `@uniframe/adapters`: Browser ve Node adapter ornekleri.
- `@uniframe/vite`: Vite config helper'i ve tsconfig path entegrasyonu.
- `@uniframe/cli`: Framework komut satiri paketi.

## Build

```bash
npm run build:packages
```

Bu komut `@uniframe/core`, `@uniframe/adapters` ve `@uniframe/vite` paketleri icin:

- ESM output
- CJS output
- Type declaration output

uretir.

## Tuketim

```ts
import { createGreeting } from "@uniframe/core";
import { defineUniframeViteConfig } from "@uniframe/vite";
```

## Ornek Proje

`examples/hello-uniframe` framework paketlerini minimal library ornegi olarak kullanir.
`examples/fullstack-uniframe` ise ayni paketleri API, web, React desktop, Vue desktop ve Android hedefleriyle tam proje gibi kullanir.

```bash
npm run build:example
npm run dev:example
npm run dev:example:fullstack
npm --workspace fullstack-uniframe run dev:desktop:react
npm --workspace fullstack-uniframe run dev:desktop:vue
```
