'use client';

/**
 * UI preferences — small per-browser choices that should survive a reload
 * but never need to sync anywhere. Deliberately separate from ProductData:
 * these are view state, not workspace content, and clearing demo data should
 * not reset which view a table was left in.
 */

export type TableViewMode = 'grid' | 'list';
export type Theme = 'light' | 'dark';

const KEYS = {
  sidebarCollapsed: 'prospectra:pref:sidebar-collapsed',
  tableView: 'prospectra:pref:table-view',
  tablesLayout: 'prospectra:pref:tables-layout', // 'grid' | 'list' for the directory
  theme: 'prospectra:pref:theme'
} as const;

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readBool(key: string, fallback: boolean): boolean {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : raw === 'true';
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    /* Nothing actionable. */
  }
}

function readString<T extends string>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return (raw as T) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeString(key: string, value: string) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* Nothing actionable. */
  }
}

// Theme has a subscriber list so components can read it with
// useSyncExternalStore — that's what lets the toggle button update the
// header instantly without a "setState in an effect" render cascade, and
// keeps the server/first-paint snapshot ('dark') consistent for hydration.
// Dark is the product default; light remains available as an explicit,
// user-chosen toggle — it must never be what a first-time visitor sees.
type Listener = () => void;
let themeListeners: Listener[] = [];

function notifyThemeChange() {
  themeListeners.forEach((l) => l());
}

export const preferences = {
  getSidebarCollapsed: () => readBool(KEYS.sidebarCollapsed, false),
  setSidebarCollapsed: (v: boolean) => writeBool(KEYS.sidebarCollapsed, v),

  getTableView: () => readString<TableViewMode>(KEYS.tableView, 'grid'),
  setTableView: (v: TableViewMode) => writeString(KEYS.tableView, v),

  getTablesLayout: () => readString<TableViewMode>(KEYS.tablesLayout, 'grid'),
  setTablesLayout: (v: TableViewMode) => writeString(KEYS.tablesLayout, v),

  getTheme: () => readString<Theme>(KEYS.theme, 'dark'),
  getThemeServerSnapshot: (): Theme => 'dark',
  setTheme: (v: Theme) => {
    writeString(KEYS.theme, v);
    notifyThemeChange();
  },
  subscribeTheme: (cb: Listener) => {
    themeListeners.push(cb);
    return () => {
      themeListeners = themeListeners.filter((l) => l !== cb);
    };
  }
};
