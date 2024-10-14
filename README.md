# svg-minify

A Fresh plugin that minifies SVG using SVGO as part of the build process.

It specifically is designed to minify an SVG file of sprites, but can be used to
minify any SVG file.

The plugin will read the SVG file, minify it using SVGO, and write the minified
SVG file to the build output directory. It defaults to reading
`./static/sprites.svg` and writing to `./static/sprites.svg` in the build path
(which defaults to `./_fresh` in Fresh), but these can be configured via the
options.

## Minify an SVG file of sprites.

```ts
import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import svgMinify from "jsr:@kitsonk/svg-minify";

export default defineConfig({
  plugins: [tailwind(), svgMinify()],
});
```

---

Copyright 2024 Kitson P. Kelly. All rights reserved. MIT License.
