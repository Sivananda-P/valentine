const celebrationMusic = document.getElementById('celebration-music');
const muteBtn = document.getElementById('mute-btn');

let hasStarted = false;
let noClickCount = 0;

// Default configuration
let config = {
    greeting: "Dear Love,",
    p1: "You make every day feel like Valentine's Day. Since the moment we met, my world has been brighter, warmer, and full of love.",
    p2: "I wanted to give you something as special as you are...",
    audio: ".agent/WhatsApp Audio 2026-02-11 at 11.39.04 AM.mpeg",
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

// Load configuration from URL if present
const urlParams = new URLSearchParams(window.location.search);
const cfgParam = urlParams.get('cfg');
if (cfgParam) {
    try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(cfgParam))));
        config = { ...config, ...decoded };

        // Update DOM elements with new config
        const greetingEl = document.querySelector('.letter-content h1');
        const p1El = document.getElementById('letter-p1');
        const p2El = document.getElementById('letter-p2');
        const audioSource = celebrationMusic.querySelector('source');

        if (greetingEl) greetingEl.textContent = config.greeting;
        if (p1El) p1El.setAttribute('data-text', config.p1);
        if (p2El) p2El.setAttribute('data-text', config.p2);
        if (audioSource && config.audio) {
            audioSource.src = config.audio;
            celebrationMusic.load();
        }
    } catch (e) {
        console.error('Failed to parse config:', e);
    }
}

const persuasionMessages = config.messages;

// Mute button toggle
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (celebrationMusic.paused) {
            celebrationMusic.play();
            muteBtn.textContent = '🔊';
            muteBtn.classList.remove('muted');
        } else {
            celebrationMusic.pause();
            muteBtn.textContent = '🔇';
            muteBtn.classList.add('muted');
        }
    });
}

// Slower typewriter with smooth pen tracking
function typeWriter(element, delay = 0, hidePenAfter = false) {
    return new Promise((resolve) => {
        const text = element.getAttribute('data-text');
        if (!text) {
            resolve();
            return;
        }

        const pen = document.querySelector('.pen-cursor');
        element.textContent = '';
        element.classList.add('typing');

        // Inline cursor for accurate positioning
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

                    // Smooth pen positioning
                    if (pen) {
                        const cursorRect = cursor.getBoundingClientRect();
                        const letterContentRect = element.closest('.letter-content').getBoundingClientRect();

                        // Position pen right where text is appearing - touching the line
                        pen.style.left = (cursorRect.left - letterContentRect.left - 5) + 'px';
                        pen.style.top = (cursorRect.top - letterContentRect.top - 10) + 'px';
                    }

                    cursor.remove();

                    i++;
                    // Much slower typing - realistic handwriting speed (80-150ms per character)
                    const speed = Math.random() * 70 + 80;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                    cursor.remove();

                    if (hidePenAfter && pen) {
                        setTimeout(() => {
                            pen.classList.remove('active');
                            pen.style.opacity = '0';
                        }, 500);
                    }

                    setTimeout(() => resolve(), 600);
                }
            }
            type();
        }, delay);
    });
}

// Open envelope with slow realistic typing
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open') && !hasStarted) {
        hasStarted = true;
        envelope.classList.add('open');

        setTimeout(async () => {
            const p1 = document.getElementById('letter-p1');
            const p2 = document.getElementById('letter-p2');

            if (p1) {
                await typeWriter(p1, 500, false);
            }

            if (p2) {
                await typeWriter(p2, 500, true);
            }
        }, 800);

        // Extended to 25 seconds for slower, realistic typing
        setTimeout(() => {
            envelope.style.transition = 'opacity 1s ease, transform 1s ease';
            envelope.style.opacity = '0';
            envelope.style.transform = 'translateY(-50px) scale(0.8)';
            setTimeout(() => {
                envelope.classList.add('hidden');
                questionContainer.classList.remove('hidden');
                setTimeout(() => {
                    questionContainer.classList.add('visible');
                }, 100);
            }, 1000);
        }, 25000);
    }
});

const persuasionMessages = [
    "I knew you couldn't say no! 😉",
    "Are you sure? Your smile is too precious to lose! ❤️",
    "A world with you is the only world I want to live in...",
    "A soul as beautiful as yours deserves the purest love. Please say Yes? ✨",
    "I'll make every day a celebration of YOU, I promise.",
    "Look how good 'Yes' looks! Just one little click...",
    "I promise to love you, cherish you, and hold you close forever. Please say Yes? 💍❤️"
];

noBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const teaseText = document.getElementById('tease-text');

    noBtn.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        noBtn.style.animation = '';
    }, 500);

    if (noClickCount < persuasionMessages.length) {
        teaseText.style.opacity = '0';
        setTimeout(() => {
            teaseText.innerText = persuasionMessages[noClickCount];
            teaseText.classList.add('visible');
            teaseText.style.opacity = '1';
            noClickCount++;

            if (noClickCount === persuasionMessages.length) {
                setTimeout(() => {
                    noBtn.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    noBtn.style.opacity = '0';
                    noBtn.style.transform = 'scale(0)';
                    noBtn.style.pointerEvents = 'none';
                }, 1500);
            }
        }, 150);
    }
});

const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px) rotate(-5deg); }
    75% { transform: translateX(10px) rotate(5deg); }
}
`;
document.head.appendChild(style);

yesBtn.addEventListener('click', () => {
    questionContainer.classList.remove('visible');
    setTimeout(() => {
        questionContainer.classList.add('hidden');
        celebration.classList.remove('hidden');
        startCelebration();
    }, 500);
});

function startCelebration() {
    if (celebrationMusic) {
        celebrationMusic.play().catch(e => console.log('Music blocked:', e));
    }

    startHearts();
    startRosePetals();
    startConfetti();

    setTimeout(() => {
        finalMessage.classList.remove('hidden');
    }, 4000);

    setTimeout(() => {
        replayBtn.classList.remove('hidden');
    }, 6000);
}

function startHearts() {
    const heartCount = 100;
    const body = document.body;

    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = '100vh';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.zIndex = '101';
            heart.style.pointerEvents = 'none';
            heart.style.transition = `transform ${Math.random() * 3 + 2}s linear, opacity ${Math.random() * 3 + 2}s linear`;

            body.appendChild(heart);

            requestAnimationFrame(() => {
                heart.style.transform = `translateY(-120vh) rotate(${Math.random() * 360}deg)`;
                heart.style.opacity = '0';
            });

            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 50);
    }
}

function startRosePetals() {
    const petalCount = 50;
    const petals = ['🌸', '🌺', '🌹'];
    const body = document.body;

    for (let i = 0; i < petalCount; i++) {
        setTimeout(() => {
            const petal = document.createElement('div');
            petal.className = 'rose-petal';
            petal.innerHTML = petals[Math.floor(Math.random() * petals.length)];
            petal.style.left = Math.random() * 100 + 'vw';
            petal.style.top = '-50px';
            petal.style.animationDuration = (Math.random() * 2 + 3) + 's';
            petal.style.animationDelay = Math.random() + 's';

            body.appendChild(petal);

            setTimeout(() => {
                petal.remove();
            }, 6000);
        }, i * 60);
    }
}

function startConfetti() {
    const confettiCount = 100;
    const colors = ['#ff6b9d', '#c21e56', '#ffd1dc', '#d4af37', '#ffccd5'];
    const body = document.body;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() + 's';

            body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 30);
    }
}

replayBtn.addEventListener('click', () => {
    location.reload();
});
