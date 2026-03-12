const PREFIX = 'hackathon_portal_';

/**
 * Get an item from localStorage, automatically parsing JSON.
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The parsed value or default
 */
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

/**
 * Set an item in localStorage, automatically stringifying to JSON.
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Remove an item from localStorage.
 * @param {string} key - The storage key
 */
export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

/**
 * Clear all portal-related items from localStorage.
 */
export function clearAll() {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}
