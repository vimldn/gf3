# Can I Eat That? — gluten-free, less guesswork

A real Next.js 16 App Router / React 19 application. TypeScript, responsive CSS, Lucide icons and lazy-loaded ZXing camera/photo barcode decoding. No application database, LLM or paid API key.

## Run

- `npm install`
- `npm run dev`: Next.js development server with the read-only API adapter on port 3000.
- `npm run build`: real Next.js static export, then bundles export assets and the API handler into a Cloudflare-compatible Worker.
- `npm start`: runs that production bundle locally.
- `npm test`: conservative gluten status and barcode unit tests.
- `npm run typecheck`: TypeScript checks.

## Data flow

On explicit search/scan, the browser calls this site's fixed read-only API routes. `/api/search` queries Open Food Facts Search-a-licious (the older CGI endpoint was unavailable during testing). `/api/product` fetches the latest available Open Food Facts product record. `/api/prices` requests GBP Open Prices observations for an exact barcode. Only UK-located observations are displayed; latest observation per location, with explicit dates. APIs time out, expose useful failure states, and never fabricate product data or prices. Search results may lag the detailed product record; opening a result fetches the product again. Search/price APIs can have incomplete coverage and outages.

`worker/api.mjs` is the shared API adapter used in development and the Sites deployment; there are no Next server actions. `scripts/build-worker.mjs` embeds the Next static export for this hosting environment. The React/Next source remains editable and portable.

## Gluten evidence

Explicit `en:no-gluten` / `en:gluten-free` labels yield "Gluten-free label recorded", never "certified safe". Missing allergen data does not prove absence. Conflicting gluten/trace information is unresolved. Gluten-free-labelled wheat starch is not automatically rejected merely for containing wheat. No AI ingredient inference is used. Users are directed to the current pack or manufacturer. No medical diagnosis or recommendation is made.

## Price limitation

Open Prices supplies dated crowdsourced observations, not live supermarket offers or stock. Five independent retailer adapters are queried by `/api/shop`: Sainsbury’s, Just Natural, YesYouCan (buyglutenfree.co.uk), Carla Bakes and Marley’s Bakery. Sainsbury’s uses its website catalogue endpoint; the other four use Shopify's public predictive-search JSON API. These are not guaranteed partner feeds. Sainsbury’s worked locally but failed on the hosted environment; source-level status now exposes failures while preserving results from other shops. Each shop has a 15-second timeout. There is no bypass of retailer access restrictions. A shop selector and direct-shop links remain available. Search results are not gluten-free recommendations. Product details attach a current shop price only on exact zero-padded barcode equivalence. No paid retailer provider is connected. Other retailer links are searches, not confirmed listings. Store, location and availability may affect checkout prices.

## Privacy and attribution

Camera/photo decoding occurs on device. Only barcodes and search terms are sent to the data APIs through the site's adapter; product-name queries also reach Sainsbury's. Bookmarks and recent barcode history are stored in localStorage on this device (versioned keys); no cloud account/database is used. Data attribution is visible in the UI: Open Food Facts/Open Prices under ODbL, product images under CC BY-SA. Google Fonts is loaded for typography.

## Verification

Production build and TypeScript checks passed; data classification tests passed. Real search, barcode and UK price API calls succeeded. Built homepage and referenced JS/CSS assets were checked through the Worker fetch handler. No browser automation was available in the build environment: actual mobile camera permission/decoding and visual browser rendering still need a device check.

## Version 1.1 updates

- Larger type throughout desktop and mobile, with darker secondary text.
- Five shops queried independently; per-shop availability and direct search links.
- Shopify variant price ranges marked “From”; exact barcode matches use the matched variant price.
- API error bodies preserved instead of replaced with the same generic error.
- Regression tests for partial and complete retailer failures and barcode/variant price matching.
- Exported ZIP omits Git, credentials, dependencies and build output. Run `npm install`, then `npm run dev` (port 3000), or `npm run build && npm start`.

Hosted verification (v1.1): `/api/shop` returns HTTP 200 with independent source status. Just Natural, YesYouCan and Marley’s Bakery returned current prices; Carla Bakes responded with no available matches for the tested query. Sainsbury’s returns upstream HTTP 403 on this host and is explicitly marked unavailable, with a direct-shop link. No access restriction is bypassed. Text-query matches are filtered for meaningful product-name/tag terms so unrelated products do not fill a comparison.
