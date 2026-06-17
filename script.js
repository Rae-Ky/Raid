// Sistema de estado interactivo
let musicPlaying = false;
const bgMusic = document.getElementById('bg-music');
const readCards = new Set();
let totalCards = 4;
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1516929646187249724/ibeJCmRKX-V5iWeAFMJGSLe__PP7tiVdUdYqs5geHU6mE3ysToekXFb0V4mroi5Ar5CT";
const heartContainer = document.getElementById('heart-container');
const heartIcons = ['fa-heart', 'fa-heart-circle-check', 'fa-heart-circle-bolt', 'fa-spa'];

function createFloatingHearts() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('i');
            const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
            heart.className = `fa-solid ${randomIcon} heart-bg`;
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDelay = `${Math.random() * 5}s`;
            heart.style.animationDuration = `${5 + Math.random() * 5}s`;
            heart.style.fontSize = `${16 + Math.random() * 20}px`;
            heartContainer.appendChild(heart);
        }, i * 300);
    }
}
createFloatingHearts();
function toggleMusic() {
    const musicIcon = document.querySelector('.id-music-icon');
    const musicText = document.getElementById('music-text');
    const musicIndicator = document.getElementById('music-indicator');

    if (!musicPlaying) {
        bgMusic.play().then(() => {
            musicPlaying = true;
            musicText.textContent = "Sonando melodía de amor...";
            musicIcon.className = "fa-solid id-music-icon fa-volume-high animate-pulse text-rose-600";
            musicIndicator.firstElementChild.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75";
        }).catch(err => {
            console.log("Auto-play restringido por el navegador.");
        });
    } else {
        bgMusic.pause();
        musicPlaying = false;
        musicText.textContent = "Música pausada. Toca para reproducir";
        musicIcon.className = "fa-solid id-music-icon fa-volume-xmark";
        musicIndicator.firstElementChild.className = "absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75";
    }
}
function openEnvelope() {
    if (!musicPlaying) toggleMusic();

    const envelope = document.getElementById('envelope-element');
    const seal = document.getElementById('heart-seal');
    
    seal.classList.add('scale-0', 'opacity-0');
    envelope.classList.add('open');

    setTimeout(() => {
        document.getElementById('screen-welcome').classList.add('scale-95', 'opacity-0', 'transition-all', 'duration-700');
        setTimeout(() => {
            document.getElementById('screen-welcome').classList.add('hidden');
            const mainContent = document.getElementById('screen-content');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('animate-fade-in');
        }, 700);
    }, 1200);
}

// Girar Fichas e ir contando las leídas
function flipCard(cardElement, cardId) {
    cardElement.classList.toggle('flipped');

    if (!readCards.has(cardId)) {
        readCards.add(cardId);
        updateReadProgress();
    }
}
function updateReadProgress() {
    const readCounter = document.getElementById('read-counter');
    const readDot = document.getElementById('read-dot');
    const readDotPulse = document.getElementById('read-dot-pulse');
    
    readCounter.textContent = `Has leído ${readCards.size} de ${totalCards} fichas especiales`;

    if (readCards.size === totalCards) {
        readCounter.textContent = "¡Perfecto! Has leído todo, abre el Botón Secreto ✨";
        readCounter.className = "text-emerald-600 font-bold transition-colors";
        readDot.className = "relative inline-flex rounded-full h-3 w-3 bg-emerald-500";
        readDotPulse.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
    }
}
function triggerSecretProposal() {
    if (readCards.size < totalCards) {
        alert("¡Epa! Sin hacer trampa... Lee todas las tarjetitas primero 💖");
        return;
    }

    const modal = document.getElementById('modal-proposal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.firstElementChild.classList.remove('scale-90');
        modal.firstElementChild.classList.add('scale-100');
    }, 10);
}

// Función mágica que manda la opción elegida por Webhook directamente a tu Discord (MD/Canal)
function mandarRespuestaADiscord(opcion) {
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes("TU_WEBHOOK")) {
        console.warn("Falta configurar la URL del Webhook de Discord en el script.js");
        return;
    }
                        
    const payload = {
        username: "Notisss",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/3616/3616934.png",
        embeds: [{
            title: "Respuesta Recibida",
            description: `Tu quedante ha respondido a la pregunta sobre ser novios desde la página web de regalo.`,
            color: opcion === 'SÍ' ? 1752220 : 15158332, // Verde si es SÍ, Rojo si es NO
            fields: [
                {
                    name: "Decisión Final:",
                    value: `**¡Dijo que ${opcion}!** ${opcion === 'SÍ' ? ' 😍 ' : '💔 😢'}`,
                    inline: false
                },
                {
                    name: "Fecha y Hora:",
                    value: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }) + " (Centro MX)",
                    inline: true
                }
            ],
            footer: {
                text: "lol bro"
            }
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => console.log("Respuesta enviada a Discord correctamente."))
    .catch(err => console.error("Error al despachar el webhook:", err));
}

// Al dar clic en SÍ o NO
function selectOption(opcion) {
    const modal = document.getElementById('modal-proposal');
    modal.classList.add('hidden');
    document.getElementById('screen-content').classList.add('hidden');
    mandarRespuestaADiscord(opcion);

    if (opcion === 'SÍ') {
        const successScreen = document.getElementById('screen-success');
        successScreen.removeAttribs || successScreen.classList.remove('hidden');
            setInterval(() => {
            const heart = document.createElement('i');
            heart.className = `fa-solid fa-heart heart-bg text-rose-500`;
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.animationDuration = `${1.5 + Math.random() * 2}s`;
            heart.style.fontSize = `${20 + Math.random() * 30}px`;
            heartContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 3500);
        }, 150);
    } else {
            document.getElementById('screen-sad').classList.remove('hidden');
    }
}