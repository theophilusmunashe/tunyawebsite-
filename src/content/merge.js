/**
 * Deep-merges CMS values over the local defaults.
 *
 * Rules that keep the site visually stable:
 *  - null, undefined and empty strings are ignored, so a blank CMS field
 *    never blanks out the page.
 *  - empty arrays are ignored; a populated array replaces the default wholesale
 *    so editors can reorder or remove list items.
 */
export function mergeContent(base, override) {
  if (override === null || override === undefined) return base;
  if (typeof override === "string" && override.trim() === "") return base;

  if (Array.isArray(base) || Array.isArray(override)) {
    if (!Array.isArray(override) || override.length === 0) return base;
    return override.map((item, i) => {
      const baseItem = Array.isArray(base) ? base[i] : undefined;
      return isPlainObject(item) && isPlainObject(baseItem) ? mergeContent(baseItem, item) : item;
    });
  }

  if (isPlainObject(base) && isPlainObject(override)) {
    const out = { ...base };
    for (const key of Object.keys(override)) {
      out[key] = key in base ? mergeContent(base[key], override[key]) : override[key];
    }
    return out;
  }

  return override;
}

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
