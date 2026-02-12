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
    const g = document.getElementById('greeting').value.trim();
    const p1 = document.getElementById('p1').value.trim();
    const p2 = document.getElementById('p2').value.trim();
    const a = document.getElementById('audio').value.trim();
    const m = document.getElementById('messages').value.split('\n').map(l => l.trim()).filter(l => l !== '');

    // 1. Update Preview
    document.getElementById('live-greeting-preview').textContent = g || DEFAULTS.greeting;

    // 2. Build URL
    const url = new URL('index.html', window.location.href);
    url.search = ''; // Clear existing params

    // Only add if NOT default
    if (g && g !== DEFAULTS.greeting) url.searchParams.set('g', g);
    if (p1 && p1 !== DEFAULTS.p1) url.searchParams.set('p1', p1);
    if (p2 && p2 !== DEFAULTS.p2) url.searchParams.set('p2', p2);
    if (a && a !== DEFAULTS.audio && a !== "") url.searchParams.set('a', a);

    const mIsDefault = m.length === DEFAULTS.messages.length && m.every((v, i) => v === DEFAULTS.messages[i]);
    if (!mIsDefault && m.length > 0) {
        url.searchParams.set('m', btoa(unescape(encodeURIComponent(JSON.stringify(m)))));
    }

    const shareLink = url.href;
    document.getElementById('share-link').value = shareLink;
    document.getElementById('preview-btn').href = shareLink + (shareLink.includes('?') ? '&' : '?') + 't=' + Date.now();
}

['input', 'change', 'keyup'].forEach(ev => {
    ['greeting', 'p1', 'p2', 'audio', 'messages'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(ev, updateLink);
    });
});

updateLink();

document.getElementById('copy-btn').onclick = () => {
    updateLink();
    const el = document.getElementById('share-link');
    el.select();
    navigator.clipboard.writeText(el.value);
    const btn = document.getElementById('copy-btn');
    const old = btn.innerHTML;
    btn.innerHTML = 'Copied! ✅';
    setTimeout(() => { btn.innerHTML = old; }, 2000);
};
