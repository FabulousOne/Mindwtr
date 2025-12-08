console.log('[Shim] Beginning initialization...');

try {
    // Skip polyfills in web environment
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
        if (typeof SharedArrayBuffer === 'undefined') {
            console.log('[Shim] Polyfilling SharedArrayBuffer');
            global.SharedArrayBuffer = ArrayBuffer;
        } else {
            console.log('[Shim] SharedArrayBuffer already exists');
        }

        if (typeof Buffer === 'undefined') {
            console.log('[Shim] Polyfilling Buffer');
            global.Buffer = require('buffer').Buffer;
        }

        // Polyfill URL for React Native (always override)
        console.log('[Shim] Polyfilling URL');

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

        global.URL = URLPolyfill;
        if (typeof window !== 'undefined') {
            window.URL = URLPolyfill;
        }

        // Polyfill URLSearchParams for React Native (always override)
        console.log('[Shim] Polyfilling URLSearchParams');

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

        global.URLSearchParams = URLSearchParamsPolyfill;
        if (typeof window !== 'undefined') {
            window.URLSearchParams = URLSearchParamsPolyfill;
        }

        // Aggressively set on all potential global objects
        if (typeof window !== 'undefined') window.SharedArrayBuffer = global.SharedArrayBuffer;
        if (typeof self !== 'undefined') self.SharedArrayBuffer = global.SharedArrayBuffer;
    } else {
        console.log('[Shim] Web environment detected, skipping React Native polyfills');
    }

} catch (e) {
    console.error('[Shim] Error applying polyfills:', e);
}

console.log('[Shim] Initialization complete');
