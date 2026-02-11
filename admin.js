function updateLink() {
    const config = {
        greeting: document.getElementById('greeting').value,
        p1: document.getElementById('p1').value,
        p2: document.getElementById('p2').value,
        audio: document.getElementById('audio').value,
        messages: document.getElementById('messages').value.split('\n').filter(m => m.trim() !== '')
    };

    const json = JSON.stringify(config);
    // Robust Base64 encode for Unicode/UTF-8
    const b64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }));

    // Get base URL correctly whether local or hosted
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1) + 'index.html';
    const shareLink = `${baseUrl}?cfg=${b64}`;

    document.getElementById('share-link').value = shareLink;
    document.getElementById('preview-btn').href = shareLink;

    // Visual feedback that link updated
    const linkBox = document.querySelector('.link-box');
    linkBox.style.borderColor = '#f48fb1';
    setTimeout(() => { linkBox.style.borderColor = '#f8bbd0'; }, 300);
}

// Initial update
updateLink();

// Listen for input changes with debouncing
let timeout;
const inputs = ['greeting', 'p1', 'p2', 'audio', 'messages'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateLink, 300);
    });
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const linkInput = document.getElementById('share-link');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile

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
