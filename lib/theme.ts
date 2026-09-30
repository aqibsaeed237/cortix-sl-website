export const THEME_STORAGE_KEY = "cortix-theme";

/**
 * Runs in <head> before first paint so there is no theme flash.
 * Dark is the default; a saved choice wins.
 */
export const themeInitScript = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}})();`;
