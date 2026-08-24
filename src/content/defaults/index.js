import { site } from "./site.js";
import { home } from "./home.js";
import { falls } from "./falls.js";
import { xp } from "./xp.js";
import { stays } from "./stays.js";
import { beyond } from "./beyond.js";
import { visas } from "./visas.js";
import { about } from "./about.js";
import { social } from "./social.js";
import { ai } from "./ai.js";
import { plan } from "./plan.js";

export const defaults = {
  site,
  home,
  falls,
  xp,
  stays,
  beyond,
  visas,
  about,
  social,
  ai,
  plan
};

/** Document ids the Studio uses, one singleton per section. */
export const CONTENT_KEYS = Object.keys(defaults);
