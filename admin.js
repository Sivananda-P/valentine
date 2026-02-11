function updateLink() {
    const config = {
        greeting: document.getElementById('greeting').value,
        p1: document.getElementById('p1').value,
        p2: document.getElementById('p2').value,
        audio: document.getElementById('audio').value,
        messages: document.getElementById('messages').value.split('\n').filter(m => m.trim() !== '')
    };

    const json = JSON.stringify(config);
    // Base64 encode for safer URL handling
    const b64 = btoa(unescape(encodeURIComponent(json)));

    const baseUrl = window.location.href.split('admin.html')[0] + 'index.html';
    const shareLink = `${baseUrl}?cfg=${b64}`;

    document.getElementById('share-link').value = shareLink;
    document.getElementById('preview-btn').href = `index.html?cfg=${b64}`;
}

// Initial update
updateLink();

// Listen for input changes
const inputs = ['greeting', 'p1', 'p2', 'audio', 'messages'];
inputs.forEach(id => {
    document.getElementById(id).addEventListener('input', updateLink);
});

document.getElementById('copy-btn').addEventListener('click', () => {
    const linkInput = document.getElementById('share-link');
    linkInput.select();
    document.execCommand('copy');

    const originalText = document.getElementById('copy-btn').innerHTML;
    document.getElementById('copy-btn').innerHTML = 'Copied! ✅';
    setTimeout(() => {
        document.getElementById('copy-btn').innerHTML = originalText;
    }, 2000);
});
