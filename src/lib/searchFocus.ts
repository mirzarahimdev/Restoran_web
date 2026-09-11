export const HERO_SEARCH_FOCUS_EVENT = 'fooduz:focus-hero-search'

export function focusHeroSearch() {
  window.dispatchEvent(new CustomEvent(HERO_SEARCH_FOCUS_EVENT))
}
