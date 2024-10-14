/**
 * A Fresh plugin that minifies SVG using SVGO as part of the build process.
 *
 * It specifically is designed to minify an SVG file of sprites, but can be
 * used to minify any SVG file.
 *
 * The plugin will read the SVG file, minify it using SVGO, and write the
 * minified SVG file to the build output directory. It defaults to reading
 * `./static/sprites.svg` and writing to `./static/sprites.svg` in the build
 * path (which defaults to `./_fresh` in Fresh), but these can be configured via
 * the options.
 *
 * @example Minify an SVG file of sprites.
 *
 * ```ts
 * import { defineConfig } from "$fresh/server.ts";
 * import tailwind from "$fresh/plugins/tailwind.ts";
 * import svgMinify from "jsr:@kitsonk/svg-minify";
 *
 * export default defineConfig({
 *   plugins: [tailwind(), svgMinify()],
 * });
 * ```
 *
 * @module svg-minify
 */
import { optimize } from "svgo";
import { resolve } from "@std/path";

import type { Plugin } from "./fresh_types.ts";

/**
 * Options which can be set when the plugin is instantiated.
 */
export interface SvgMinifyOptions {
  /**
   * The input file of SVG to minify. This is relative to the CWD of the build
   * script.
   *
   * @default "./static/sprites.svg"
   */
  input?: string;
  /**
   * The output file of the minified SVG. This is relative to the build output
   * directory.
   *
   * @default "./static/sprites.svg"
   */
  output?: string;
  /**
   * Enable or disable multipass optimization of the SVG.
   *
   * @default true
   */
  multipass?: boolean;
  /**
   * Determine if the plugin should be silent or not.
   *
   * @default false
   */
  silent?: boolean;
}

/**
 * Minify an SVG file using SVGO as part of the Fresh build process.
 *
 * @example Minify an SVG file of sprites.
 *
 * ```ts
 * import { defineConfig } from "$fresh/server.ts";
 * import tailwind from "$fresh/plugins/tailwind.ts";
 * import svgMinify from "jsr:@kitsonk/svg-minify";
 *
 * export default defineConfig({
 *   plugins: [tailwind(), svgMinify()],
 * });
 * ```
 *
 * @param options - Options to configure the plugin.
 * @returns A Fresh plugin.
 */
export default function svgMinify(options: SvgMinifyOptions = {}): Plugin {
  const {
    input: path = "./static/sprites.svg",
    output = "./static/sprites.svg",
    multipass = true,
    silent = false,
  } = options;
  return {
    name: "svg-minify",
    async buildStart(config) {
      const svgString = await Deno.readTextFile(path);
      const { data } = optimize(svgString, {
        path,
        multipass,
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeHiddenElems: false } },
          },
        ],
      });
      await Deno.writeTextFile(
        resolve(config.build.outDir, output),
        data,
      );
      if (!silent) {
        console.log(
          "%cSVG has been minified.",
          "color:green;font-weight:bold",
        );
      }
    },
  };
}
