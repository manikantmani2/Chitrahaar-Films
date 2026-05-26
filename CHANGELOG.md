# Changelog

## Unreleased

- UI: Cinematic theme polish — responsive hero, header blur, glass cards.
- Gallery: Masonry layout and hover video previews; removed `data-strip-*` attributes from source.
- Featured Films: Horizontal slider with keyboard nav, arrows, dots, and snap behavior.
- Services: Kept inline for stability; planned extraction to `src/components/Services.tsx`.
- Performance: Added `loading="lazy"` to many images and `priority` for hero background image.
- Accessibility: Improved focus-visible styles, ARIA attributes on slider dots, keyboard support.
- Build: Fixed Tailwind utility mismatch (`duration-400` -> `duration-300`) and validated production build.

Next steps:
- Extract `Services` to a standalone component and export it safely.
- Finalize framer-motion timing consistency across all sections.
- Mobile polish and performance pass (image placeholders, video encoding recommendations).
- QA: full page screenshots, Lighthouse audit, and create a release commit.
 
Additional recent changes:

- Added BackgroundShowcase component that cycles highlight videos and images.
- Added three SVG placeholder highlight images to `public/gallery`.
- Background showcases use local portfolio images where available.
- Background showcase now desktop-only; a mobile fallback image is used.
- Added smooth scrolling for navigation and hero CTAs.
- Added background audio toggle to enable/disable showcase audio.
- Added image conversion script and ran it to generate optimized formats (no raster images found to convert).
- Rebuilt and verified the production build.
