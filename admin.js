const DEFAULTS = {
    greeting: "Dear Love,",
    p1: "You make every day feel like Valentine's Day. Since the moment we met, my world has been brighter, warmer, and full of love.",
    p2: "I wanted to give you something as special as you are...",
    audio: "assets/celebration.mp3",
    messages: [
        "I knew you couldn't say no! 😉",
        "Are you sure? Your smile is too precious to lose! ❤️",
        "A world with you is the only world I want to live in...",
        "A soul as beautiful as yours deserves the purest love. Please say Yes? ✨",
        "I'll make every day a celebration of YOU, I promise.",
        "Look how good 'Yes' looks! Just one little click...",
        "I promise to love you, cherish you, and hold you close forever. Please say Yes? 💍❤️"
    ]
};

function updateLink() {
    const rawConfig = {
        greeting: document.getElementById('greeting').value,
        p1: document.getElementById('p1').value,
        p2: document.getElementById('p2').value,
        audio: document.getElementById('audio').value,
        messages: document.getElementById('messages').value.split('\n').filter(m => m.trim() !== '')
    };

    // Update Live Preview instantly
    const previewEl = document.getElementById('live-greeting-preview');
    if (previewEl) {
        previewEl.textContent = rawConfig.greeting || "Dear Love,";
    }

    // Only include values that differ from defaults to minimize URL length
    const compactConfig = {};
    if (rawConfig.greeting !== DEFAULTS.greeting) compactConfig.g = rawConfig.greeting;
    if (rawConfig.p1 !== DEFAULTS.p1) compactConfig.p1 = rawConfig.p1;
    if (rawConfig.p2 !== DEFAULTS.p2) compactConfig.p2 = rawConfig.p2;
    if (rawConfig.audio !== DEFAULTS.audio && rawConfig.audio !== "") compactConfig.a = rawConfig.audio;

    // Compare messages array
    const isDefaultMessages = JSON.stringify(rawConfig.messages) === JSON.stringify(DEFAULTS.messages);
    if (!isDefaultMessages) compactConfig.m = rawConfig.messages;

    const json = JSON.stringify(compactConfig);
    // Universal UTF-8 Base64 encode
    const b64 = btoa(unescape(encodeURIComponent(json)));

    // Get base URL correctly
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + 'index.html';

    // shareLink for the input (cleaner)
    const shareLink = `${baseUrl}?cfg=${encodeURIComponent(b64)}`;
    // previewLink with cache buster to force refresh for the creator
    const previewLink = `${shareLink}&t=${new Date().getTime()}`;

    document.getElementById('share-link').value = shareLink;
    document.getElementById('preview-btn').href = previewLink;

    // Subtle visual feedback
    const box = document.querySelector('.preview-box');
    if (box) {
        box.style.background = 'rgba(255, 107, 157, 0.05)';
        setTimeout(() => { box.style.background = ''; }, 200);
    }
}

// Initial update
updateLink();

// Listen for ALL input changes INSTANTLY
const inputs = ['greeting', 'p1', 'p2', 'audio', 'messages'];
inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateLink);
        el.addEventListener('change', updateLink);
    }
});

document.getElementById('copy-btn').addEventListener('click', () => {
    updateLink();
    const linkInput = document.getElementById('share-link');
    linkInput.select();

    try {
        navigator.clipboard.writeText(linkInput.value);
    } catch (err) {
        document.execCommand('copy');
    }

    const btn = document.getElementById('copy-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Copied! ✅';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
});
