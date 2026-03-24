export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const ls = (globalThis as any).localStorage;
    
    // Check if localStorage exists but is "poisoned" (missing standard methods like getItem)
    // This happens in some Node 22/25 environments or when a partial shim is present.
    if (typeof ls !== 'undefined' && typeof ls.getItem !== 'function') {
      const noop = () => null;
      (globalThis as any).localStorage = {
        getItem: noop,
        setItem: noop,
        removeItem: noop,
        clear: noop,
        key: noop,
        length: 0,
      };
    } else if (typeof ls === 'undefined') {
      // In case it's completely missing, provide a full noop shim
      (globalThis as any).localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      };
    }
  }
}
