# OMAR CENTER — عمر سنتر

Self-contained static PS4 host. Upload the contents of this directory to the root
of omarcenter/omarcenter.github.io (main branch). Pages: main / root.
Launch stays in the portal through a same-origin visible iframe. Loader navigation stays inside it. No external loader redirects.
The package includes the selected upstream scripts, patch files, and payload.

Upstream: https://github.com/GamerHack/GamerHack.github.io
Pinned source: d290adc45e15d2ce06bd6d0fa5388b5de868c4d2
Payload: goldhen_2.4b18.12.bin
Firmware allowlist: 9.00, 9.03, 9.04, 9.50, 9.51, 9.60, 10.00, 10.01, 10.50, 10.70, 10.71, 11.00, 11.02, 11.50, 11.52, 12.00, 12.02, 12.50, 12.52, 13.00, 13.02, 13.04, 13.50, 13.52

Changes: shop branding, exact firmware gates, local paths, cache UI and manifests,
disabled unsupported telemetry POSTs. Exploit primitives and binary bytes were
not changed. Upstream copyright notices retained; PSFree is AGPL-3.0-or-later.
Other upstream components retain their respective terms; no new blanket license.
Full source is provided in this package and intended public repository.

Validation: static dependency and manifest resolution, firmware routing with
stubbed DOM (no exploit execution), ZIP integrity. Not tested on actual PS4.
Hardware operation and offline-cache behavior still require a console test.
Do not update console firmware to match this site.

## 2026-11-03 integration

14.00 uses host/ps4-14 from well0nez/afterglow-web at b16964133d47f838817980b7c0c5f35e1f1b6208.
Only exact 14.00 is routed there; the older firmware routes are preserved.
The landing page is localized and waits for AppCache, then launches GoldHEN in the embedded frame.
Kernel scripts, firmware offsets and binary payloads remain byte-identical to upstream.
UPSTREAM.json records provenance and original SHA256 values.
GitHub Pages controls HTTP headers; the versioned manifest must be bumped when files change.
Hardware launch, stability, and offline browser behavior require a real PS4 test.

## Unified PS4 offline cache (2026-11-04)
The portal and all PS4 runner HTML pages share /offline.appcache. The cache includes
the root URL, index.html, artwork, local modules, workers, exact query variants and
payloads. No PS5 files are included. A complete initial online download is required.
The portal reports actual AppCache progress and blocks launch during cache checks,
downloads and pending updates. New cached versions require reloading before launch.
Bump offline.appcache when any cached file changes. Console testing remains required.
