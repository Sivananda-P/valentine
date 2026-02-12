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

    // Update Preview Area (Gratings and Data-Text)
    const gEl = document.getElementById('live-greeting-preview');
    const p1El = document.getElementById('live-p1-preview');
    const p2El = document.getElementById('live-p2-preview');

    if (gEl) gEl.textContent = g || DEFAULTS.greeting;
    if (p1El) p1El.setAttribute('data-text', p1 || DEFAULTS.p1);
    if (p2El) p2El.setAttribute('data-text', p2 || DEFAULTS.p2);

    // Initial non-animating state
    if (!envelope.classList.contains('open')) {
        p1El.textContent = (p1 || DEFAULTS.p1).substring(0, 50) + "...";
        p2El.textContent = "";
    }
}

// Typewriter logic from script.js
function typeWriter(element, delay = 0, hidePenAfter = false) {
    return new Promise((resolve) => {
        const text = element.getAttribute('data-text');
        if (!text) { resolve(); return; }

        const pen = document.querySelector('.pen-cursor');
        element.textContent = '';
        element.classList.add('typing');

        const cursor = document.createElement('span');
        cursor.className = 'inline-cursor';
        cursor.style.display = 'inline';
        cursor.style.visibility = 'hidden';
        cursor.textContent = '|';

        let i = 0;
        setTimeout(() => {
            if (pen && !pen.classList.contains('active')) {
                pen.classList.add('active');
                pen.style.opacity = '0.9';
            }

            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    element.appendChild(cursor);
                    if (pen) {
                        const cursorRect = cursor.getBoundingClientRect();
                        const letterContentRect = element.closest('.letter-content').getBoundingClientRect();
                        pen.style.left = (cursorRect.left - letterContentRect.left - 5) + 'px';
                        pen.style.top = (cursorRect.top - letterContentRect.top - 10) + 'px';
                    }
                    cursor.remove();
                    i++;
                    setTimeout(type, Math.random() * 50 + 30); // Faster for preview
                } else {
                    element.classList.remove('typing');
                    cursor.remove();
                    if (hidePenAfter && pen) {
                        setTimeout(() => {
                            pen.classList.remove('active');
                            pen.style.opacity = '0';
                        }, 500);
                    }
                    setTimeout(() => resolve(), 400);
                }
            }
            type();
        }, delay);
    });
}

// 2. Interactive Preview Logic
const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('open-btn');
const resetBtn = document.getElementById('reset-preview');

if (openBtn && envelope) {
    openBtn.addEventListener('click', async () => {
        if (envelope.classList.contains('open')) return;

        envelope.classList.add('open');
        resetBtn.classList.remove('hidden');
        document.querySelector('.preview-hint').classList.add('hidden');

        // Typing Sequence
        await new Promise(r => setTimeout(r, 1000));
        await typeWriter(document.getElementById('live-p1-preview'), 500, false);
        await typeWriter(document.getElementById('live-p2-preview'), 500, true);

        // Transition to Question
        await new Promise(r => setTimeout(r, 1500));
        envelope.style.opacity = '0';
        envelope.style.transform = 'translateY(-20px) scale(0.9)';

        setTimeout(() => {
            envelope.classList.add('hidden');
            const question = document.getElementById('preview-question');
            question.classList.remove('hidden');
            setTimeout(() => question.classList.add('visible'), 50);
        }, 800);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        envelope.classList.remove('open');
        envelope.classList.remove('hidden');
        envelope.style.opacity = '1';
        envelope.style.transform = '';

        document.getElementById('preview-question').classList.add('hidden');
        document.getElementById('preview-question').classList.remove('visible');

        resetBtn.classList.add('hidden');
        document.querySelector('.preview-hint').classList.remove('hidden');

        // Reset text
        updateLink();
    });
}

// Attach listeners for live updates
if (document.getElementById('greeting')) {
    document.getElementById('greeting').addEventListener('input', updateLink);
}
if (document.getElementById('p1')) {
    document.getElementById('p1').addEventListener('input', updateLink);
}
if (document.getElementById('p2')) {
    document.getElementById('p2').addEventListener('input', updateLink);
}

// Run once to initialize
document.addEventListener('DOMContentLoaded', updateLink);

// 3. Payment & Encryption Flow
const payBtn = document.getElementById('pay-btn');
if (payBtn) {
    payBtn.addEventListener('click', async () => {
        const btnText = payBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        try {
            btnText.textContent = "Processing...";
            payBtn.disabled = true;

            // 1. Get current config
            const config = {
                g: document.getElementById('greeting').value.trim(),
                p1: document.getElementById('p1').value.trim(),
                p2: document.getElementById('p2').value.trim(),
                a: document.getElementById('audio').value.trim(),
                m: document.getElementById('messages').value.split('\n').map(l => l.trim()).filter(l => l !== '')
            };

            // 2. Encrypt data locally (Zero-Knowledge)
            const { encrypted, key } = await window.Privacy.encrypt(config);

            // 3. Create Razorpay Order
            const orderRes = await fetch('/api/create-order', { method: 'POST' });
            const order = await orderRes.json();

            // Fetch Public Key
            const keyRes = await fetch('/api/get-keys');
            const { razorpayKeyId } = await keyRes.json();

            if (!order.id || !razorpayKeyId) throw new Error("Initialization failed");

            // 4. Open Razorpay Checkout
            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: "Valentine Surprise",
                description: "Encrypted Permanent Link",
                order_id: order.id,
                handler: async function (response) {
                    // 5. Verify Payment & Store Data
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            encryptedData: encrypted
                        })
                    });

                    const result = await verifyRes.json();

                    if (result.success) {
                        // 6. Generate final encrypted link
                        const finalLink = `${window.location.origin}${window.location.pathname.replace('admin.html', 'index.html')}?id=${result.linkId}#key=${key}`;

                        // Save to LocalStorage for recovery
                        localStorage.setItem('val_last_paid_link', finalLink);
                        localStorage.setItem('val_last_paid_timestamp', new Date().toISOString());

                        document.getElementById('share-link').value = finalLink;
                        document.getElementById('link-display-area').classList.remove('hidden');
                        document.getElementById('payment-actions').classList.add('hidden');

                        alert("Success! Your private encrypted link is ready. ❤️");
                        document.getElementById('link-display-area').scrollIntoView({ behavior: 'smooth' });
                    }
                },
                prefill: {
                    name: config.g || "Valentine User"
                },
                theme: { color: "#ff4d8d" }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            btnText.textContent = originalText;
            payBtn.disabled = false;
        }
    });
}

// Copy functionality for the paid link
const finalCopyBtn = document.getElementById('final-copy-btn');
if (finalCopyBtn) {
    finalCopyBtn.addEventListener('click', () => {
        const el = document.getElementById('share-link');
        el.select();
        navigator.clipboard.writeText(el.value);

        const oldText = finalCopyBtn.innerHTML;
        finalCopyBtn.innerHTML = 'Copied! ✅';
        setTimeout(() => { finalCopyBtn.innerHTML = oldText; }, 2000);
    });
}

// 4. Recovery Logic
function checkRecovery() {
    const lastLink = localStorage.getItem('val_last_paid_link');
    const banner = document.getElementById('recovery-banner');
    const recoverBtn = document.getElementById('recover-btn');
    const dismissBtn = document.getElementById('dismiss-recovery');

    if (lastLink && banner) {
        banner.classList.remove('hidden');

        recoverBtn.addEventListener('click', () => {
            const shareLinkInput = document.getElementById('share-link');
            const linkDisplayArea = document.getElementById('link-display-area');
            const paymentActions = document.getElementById('payment-actions');

            if (shareLinkInput && linkDisplayArea && paymentActions) {
                shareLinkInput.value = lastLink;
                linkDisplayArea.classList.remove('hidden');
                paymentActions.classList.add('hidden');
                linkDisplayArea.scrollIntoView({ behavior: 'smooth' });
            }
            banner.classList.add('hidden');
        });

        dismissBtn.addEventListener('click', () => {
            if (confirm("Are you sure? Once dismissed, you can't recover this specific link here again.")) {
                localStorage.removeItem('val_last_paid_link');
                localStorage.removeItem('val_last_paid_timestamp');
                banner.classList.add('hidden');
            }
        });
    }
}

// Initial check
document.addEventListener('DOMContentLoaded', checkRecovery);
