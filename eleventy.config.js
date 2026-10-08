import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import markdownIt from "markdown-it";

const md = markdownIt({ html: true, typographer: true });

// Where the old site kept its images and files. Anything not yet copied into
// src/assets/ is loaded from here, so the site works before you move every file.
const OLD_SITE = "https://www.columbia.edu/~as1038/img/";

export default function (eleventyConfig) {
  // Content lives in YAML files in src/_data/
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addFilter("md", (text = "") => md.render(text));

  // {{ "senghas.jpg" | img }} -> local copy if it exists, otherwise the old site's copy
  const resolve = (folder) => (name) => {
    if (!name) return "";
    if (/^https?:\/\//.test(name) || name.startsWith("/")) return name;
    const local = path.join("src/assets", folder, name);
    if (fs.existsSync(local)) return `/assets/${folder}/${encodeURI(name)}`;
    return OLD_SITE + encodeURI(name);
  };
  eleventyConfig.addFilter("img", resolve("img"));
  eleventyConfig.addFilter("file", resolve("files"));

  eleventyConfig.addFilter("initials", (name = "") =>
    name.replace(/,.*$/, "").split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("")
  );
  eleventyConfig.addFilter("where", (arr = [], key, val) => arr.filter((x) => x[key] === val));
  eleventyConfig.addFilter("whereNot", (arr = [], key, val) => arr.filter((x) => x[key] !== val));
  eleventyConfig.addFilter("limit", (arr = [], n) => arr.slice(0, n));
  eleventyConfig.addFilter("byYearDesc", (arr = []) =>
    [...arr].sort((a, b) => (parseInt(b.year) || 9999) - (parseInt(a.year) || 9999))
  );
  eleventyConfig.addFilter("groupByYear", (arr = []) => {
    const groups = new Map();
    for (const item of arr) {
      const y = String(item.year);
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(item);
    }
    return [...groups.entries()]
      .sort((a, b) => (parseInt(b[0]) || 9999) - (parseInt(a[0]) || 9999))
      .map(([year, items]) => ({ year, items }));
  });
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());

  // Rewrite root-relative links ("/people/") to relative ones ("../people/") so the
  // site works at any address: username.github.io/repo/, a custom domain, or a
  // Barnard server. PREVIEW=1 also adds index.html for hosts without folder indexes.
  eleventyConfig.addTransform("relative-links", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const depth = this.page.url.split("/").filter(Boolean).length;
    const prefix = depth ? "../".repeat(depth) : "./";
    const preview = process.env.PREVIEW === "1";
    return content.replace(/(href|src)="\/(?!\/)([^"]*)"/g, (m, attr, rest) => {
      let url = prefix + rest;
      if (preview && attr === "href" && (rest === "" || rest.endsWith("/"))) url += "index.html";
      if (url === "./" ) url = preview ? "./index.html" : "./";
      return `${attr}="${url}"`;
    });
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
