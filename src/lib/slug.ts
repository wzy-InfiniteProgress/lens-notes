import { pinyin } from "pinyin-pro";

function transliterateChinese(value: string) {
  return pinyin(value, {
    toneType: "none",
    separator: " ",
    nonZh: "spaced",
    v: "v",
  });
}

export function slugify(value: string) {
  const transliterated = transliterateChinese(value);

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/['".,!?/\\()[\]{}]+/g, " ")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
