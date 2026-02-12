/**
 * Privacy & Encryption Utilities (Zero-Knowledge)
 * Uses Web Crypto API (AES-GCM)
 */

const Privacy = {
    /**
     * Encrypts a JSON object into a Base64 string + Key
     * @param {Object} data 
     * @returns {Promise<{encrypted: string, key: string}>}
     */
    async encrypt(data) {
        const text = JSON.stringify(data);
        const encoded = new TextEncoder().encode(text);

        // Generate a random key
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encoded
        );

        // Export key as Base64
        const exportedKey = await window.crypto.subtle.exportKey("raw", key);
        const keyB64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

        // Combine IV and Encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv, 0);
        combined.set(new Uint8Array(encrypted), iv.length);

        const encryptedB64 = btoa(String.fromCharCode(...combined));

        return {
            encrypted: encryptedB64,
            key: keyB64
        };
    },

    /**
     * Decrypts a Base64 string using a Base64 key
     * @param {string} encryptedB64 
     * @param {string} keyB64 
     * @returns {Promise<Object>}
     */
    async decrypt(encryptedB64, keyB64) {
        try {
            const combined = new Uint8Array(atob(encryptedB64).split("").map(c => c.charCodeAt(0)));
            const keyData = new Uint8Array(atob(keyB64).split("").map(c => c.charCodeAt(0)));

            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const key = await window.crypto.subtle.importKey(
                "raw",
                keyData,
                "AES-GCM",
                false,
                ["decrypt"]
            );

            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch (e) {
            console.error("Decryption failed:", e);
            throw new Error("Invalid key or corrupted data");
        }
    }
};

window.Privacy = Privacy;
