/**
 * Safe LocalStorage Utility
 * Provides error-safe localStorage operations with fallbacks
 */

class SafeStorage {
    constructor() {
        this.isAvailable = this.checkAvailability();
        this.memoryFallback = new Map();
    }

    checkAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage is not available, using memory fallback:', e);
            return false;
        }
    }

    getItem(key, defaultValue = null) {
        try {
            if (this.isAvailable) {
                const item = localStorage.getItem(key);
                return item !== null ? item : defaultValue;
            } else {
                return this.memoryFallback.get(key) || defaultValue;
            }
        } catch (e) {
            console.error(`Failed to get item "${key}" from storage:`, e);
            return defaultValue;
        }
    }

    setItem(key, value) {
        try {
            if (this.isAvailable) {
                localStorage.setItem(key, value);
                return true;
            } else {
                this.memoryFallback.set(key, value);
                return true;
            }
        } catch (e) {
            console.error(`Failed to set item "${key}" in storage:`, e);
            // Try fallback to memory
            try {
                this.memoryFallback.set(key, value);
                return true;
            } catch (fallbackError) {
                console.error(`Memory fallback also failed for "${key}":`, fallbackError);
                return false;
            }
        }
    }

    removeItem(key) {
        try {
            if (this.isAvailable) {
                localStorage.removeItem(key);
            } else {
                this.memoryFallback.delete(key);
            }
            return true;
        } catch (e) {
            console.error(`Failed to remove item "${key}" from storage:`, e);
            return false;
        }
    }

    clear() {
        try {
            if (this.isAvailable) {
                localStorage.clear();
            } else {
                this.memoryFallback.clear();
            }
            return true;
        } catch (e) {
            console.error('Failed to clear storage:', e);
            return false;
        }
    }

    // JSON-specific methods with validation
    getJSON(key, defaultValue = null) {
        try {
            const item = this.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            console.error(`Failed to parse JSON for key "${key}":`, e);
            return defaultValue;
        }
    }

    setJSON(key, value) {
        try {
            const jsonString = JSON.stringify(value);
            return this.setItem(key, jsonString);
        } catch (e) {
            console.error(`Failed to stringify value for key "${key}":`, e);
            return false;
        }
    }

    // Validate and get JSON with schema checking
    getValidatedJSON(key, validator, defaultValue = null) {
        try {
            const data = this.getJSON(key, defaultValue);
            if (data === null || data === defaultValue) {
                return defaultValue;
            }

            if (validator && typeof validator === 'function') {
                if (validator(data)) {
                    return data;
                } else {
                    console.warn(`Data validation failed for key "${key}"`);
                    return defaultValue;
                }
            }

            return data;
        } catch (e) {
            console.error(`Failed to get validated JSON for key "${key}":`, e);
            return defaultValue;
        }
    }

    // Get all keys (cross-compatible)
    keys() {
        try {
            if (this.isAvailable) {
                return Object.keys(localStorage);
            } else {
                return Array.from(this.memoryFallback.keys());
            }
        } catch (e) {
            console.error('Failed to get storage keys:', e);
            return [];
        }
    }

    // Check if key exists
    hasItem(key) {
        try {
            if (this.isAvailable) {
                return localStorage.getItem(key) !== null;
            } else {
                return this.memoryFallback.has(key);
            }
        } catch (e) {
            console.error(`Failed to check if key "${key}" exists:`, e);
            return false;
        }
    }
}

// Create global instance
const safeStorage = new SafeStorage();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SafeStorage, safeStorage };
}
