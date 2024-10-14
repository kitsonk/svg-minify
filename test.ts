import { assert } from "jsr:@std/assert@~1/assert";
import { assertEquals } from "jsr:@std/assert@~1/equals";
import { resolve } from "jsr:@std/path@~1/resolve";

import svgMinify from "./mod.ts";

Deno.test({
  name: "able to instantiate the plugin",
  fn() {
    const plugin = svgMinify();
    assertEquals(plugin.name, "svg-minify");
    assertEquals(typeof plugin.buildStart, "function");
  },
});

Deno.test({
  name: "able to instantiate the plugin with options",
  fn() {
    const plugin = svgMinify({
      input: "./test.svg",
      output: "./test.min.svg",
      multipass: false,
    });
    assertEquals(plugin.name, "svg-minify");
    assertEquals(typeof plugin.buildStart, "function");
  },
});

Deno.test({
  name: "plugin produces expected output",
  async fn() {
    const plugin = svgMinify({
      input: "./_fixtures/input.svg",
      output: "./actual.svg",
      multipass: false,
      silent: true,
    });
    assert(plugin.buildStart);
    await plugin.buildStart({
      build: {
        outDir: resolve(Deno.cwd(), "./_fixtures"),
      },
    });
    const actual = await Deno.readTextFile("./_fixtures/actual.svg");
    const expected = await Deno.readTextFile("./_fixtures/expected.svg");
    assertEquals(actual, expected);
  },
});
