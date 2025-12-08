// Cross-platform UUID generator
// Works in Node.js, browsers, and React Native

export function generateUUID(): string {
    // Try to use crypto.randomUUID if available (modern browsers and Node 19+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback: Generate UUID v4 manually
    // Based on RFC 4122
    const hex = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4'; // Version 4
        } else if (i === 19) {
            uuid += hex[(Math.random() * 4 | 8)]; // Variant bits
        } else {
            uuid += hex[Math.random() * 16 | 0];
        }
    }

    return uuid;
}

// Alias for compatibility
export const v4 = generateUUID;
