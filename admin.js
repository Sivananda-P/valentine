function updateLink() {
    const config = {
        greeting: document.getElementById('greeting').value,
        p1: document.getElementById('p1').value,
        p2: document.getElementById('p2').value,
        audio: document.getElementById('audio').value,
        messages: document.getElementById('messages').value.split('\n').filter(m => m.trim() !== '')
    };

    // Update Live Preview instantly
    const previewEl = document.getElementById('live-greeting-preview');
    if (previewEl) {
        previewEl.textContent = config.greeting || "Dear Love,";
    }

    const json = JSON.stringify(config);
    // Universal UTF-8 Base64 encode
    const b64 = btoa(unescape(encodeURIComponent(json)));

    // Get base URL correctly
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + 'index.html';

    // Add a small timestamp to "bust" the cache so the browser is forced to refresh
    const cacheBuster = "t=" + new Date().getTime();
    const shareLink = `${baseUrl}?cfg=${b64}&${cacheBuster}`;

    document.getElementById('share-link').value = shareLink;
    document.getElementById('preview-btn').href = shareLink;

    // Subtle visual feedback
    const box = document.querySelector('.preview-box');
    if (box) {
        box.style.background = 'rgba(255, 107, 157, 0.05)';
        setTimeout(() => { box.style.background = ''; }, 200);
    }
}

// Initial update
updateLink();

// Listen for ALL input changes INSTANTLY for the greeting
const inputs = ['greeting', 'p1', 'p2', 'audio', 'messages'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateLink);
});

document.getElementById('copy-btn').addEventListener('click', () => {
    // Force one last update before copying
    updateLink();

    const linkInput = document.getElementById('share-link');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(linkInput.value);
    } catch (err) {
        document.execCommand('copy');
    }

    const originalText = document.getElementById('copy-btn').innerHTML;
    document.getElementById('copy-btn').innerHTML = 'Copied! ✅';
    setTimeout(() => {
        document.getElementById('copy-btn').innerHTML = originalText;
    }, 2000);
});
