"use strict";

console.log('[Mock] Loading whatwg-url-mock.js with built-in polyfills');

// Define URL polyfill directly in this module
class URLPolyfill {
    constructor(url, base) {
        this.href = url;

        // Simple URL parser
        const match = url.match(/^(?:([a-z0-9.+-]+:))?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/i);

        this.protocol = match?.[1] || '';
        this.host = match?.[2] || '';
        this.hostname = this.host.split(':')[0];
        this.port = this.host.split(':')[1] || '';
        this.pathname = match?.[3] || '/';
        this.search = match?.[4] ? '?' + match[4] : '';
        this.hash = match?.[5] ? '#' + match[5] : '';
        this.origin = this.protocol + '//' + this.host;
    }

    toString() {
        return this.href;
    }
}

// Define URLSearchParams polyfill directly in this module
class URLSearchParamsPolyfill {
    constructor(init) {
        this.params = new Map();
        if (typeof init === 'string') {
            const pairs = init.replace(/^\?/, '').split('&').filter(Boolean);
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) {
                    this.params.set(
                        decodeURIComponent(key),
                        decodeURIComponent(value || '')
                    );
                }
            });
        } else if (init && typeof init === 'object') {
            Object.keys(init).forEach(key => {
                this.params.set(key, String(init[key]));
            });
        }
    }

    get(name) {
        return this.params.get(name) || null;
    }

    set(name, value) {
        this.params.set(name, value);
    }

    has(name) {
        return this.params.has(name);
    }

    delete(name) {
        this.params.delete(name);
    }

    append(name, value) {
        this.params.set(name, value);
    }

    toString() {
        const parts = [];
        this.params.forEach((value, key) => {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        });
        return parts.join('&');
    }

    forEach(callback, thisArg) {
        this.params.forEach((value, key) => {
            callback.call(thisArg, value, key, this);
        });
    }
}

// Use native implementations if available and working, otherwise use polyfills
const FinalURL = (() => {
    try {
        if (typeof URL !== 'undefined') {
            new URL('http://test.com');
            return URL;
        }
    } catch (e) {
        console.log('[Mock] Native URL broken, using polyfill');
    }
    return URLPolyfill;
})();

const FinalURLSearchParams = (() => {
    try {
        if (typeof URLSearchParams !== 'undefined') {
            new URLSearchParams('test=1');
            return URLSearchParams;
        }
    } catch (e) {
        console.log('[Mock] Native URLSearchParams broken, using polyfill');
    }
    return URLSearchParamsPolyfill;
})();

console.log('[Mock] Using URL:', FinalURL.name, 'URLSearchParams:', FinalURLSearchParams.name);

// Export the implementations
const exports = {
    URL: FinalURL,
    URLSearchParams: FinalURLSearchParams,
    parseURL: () => null,
    basicURLParse: () => null,
    serializeURL: () => null,
    serializeHost: () => null,
    serializeInteger: () => null,
    serializeURLOrigin: () => null,
    setTheUsername: () => null,
    setThePassword: () => null,
    cannotHaveAUsernamePasswordPort: () => null,
    percentDecode: () => null
};

module.exports = exports;
module.exports.default = exports;

// Also set as globals for good measure
if (typeof global !== 'undefined') {
    global.URL = FinalURL;
    global.URLSearchParams = FinalURLSearchParams;
}
