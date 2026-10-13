/* ========================================================
   ✏️  SETTINGS — the only things you normally need to change
   ======================================================== */

// The anniversary date she must type to get in (day, month, year).
const ANNIVERSARY = { day: 14, month: 10, year: 2025 };

// How many photos are in the images/ folder (moment1.jpg ... momentN.jpg).
const TOTAL_PHOTOS = 43;

// How many photos float in the background at the same time.
const FLOATING_AT_ONCE = 10;


/* ========================================================
   THE GATE
   ======================================================== */

const body = document.body;
const welcomeStep = document.querySelector("#welcomeStep");
const dateStep = document.querySelector("#dateStep");
const dateForm = document.querySelector("#dateForm");
const dateInput = document.querySelector("#dateInput");
const message = document.querySelector("#message");
const story = document.querySelector("#story");

document.querySelector("#enterButton").addEventListener("click", function () {
    welcomeStep.classList.add("hidden");
    setTimeout(function () {
        dateStep.classList.remove("hidden");
        dateInput.focus();
    }, 500);
});

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun",
                "jul", "aug", "sep", "oct", "nov", "dec"];

// Accepts 14/10/2025, 14-10-25, 14.10.2025, 2025-10-14, 14 October 2025, 14 Oct 2025 ...
function readDate(text) {
    const t = text.toLowerCase().trim();
    let day, month, year;

    const named = t.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s*)?([a-z]+)\s*,?\s*(\d{2,4})/);
    const iso = t.match(/^(\d{4})\D+(\d{1,2})\D+(\d{1,2})$/);
    const dmy = t.match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{2,4})$/);
    const packed = t.match(/^(\d{2})(\d{2})(\d{4})$/);

    if (named) {
        day = +named[1];
        month = MONTHS.indexOf(named[2].slice(0, 3)) + 1;
        year = +named[3];
    } else if (iso) {
        [year, month, day] = [+iso[1], +iso[2], +iso[3]];
    } else if (dmy) {
        [day, month, year] = [+dmy[1], +dmy[2], +dmy[3]];
    } else if (packed) {
        [day, month, year] = [+packed[1], +packed[2], +packed[3]];
    } else {
        return null;
    }
    if (year < 100) year += 2000;
    return { day, month, year };
}

dateForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const d = readDate(dateInput.value);
    const right = d && d.day === ANNIVERSARY.day &&
                  d.month === ANNIVERSARY.month && d.year === ANNIVERSARY.year;

    if (right) {
        message.textContent = "You remembered. ❤️";
        dateStep.classList.add("success");
        heartBurst();
        setTimeout(openStory, 1400);
    } else {
        message.textContent = "Hmm… that's not quite it. Try again ❤️";
        dateStep.classList.remove("shake");
        void dateStep.offsetWidth;
        dateStep.classList.add("shake");
    }
});

function openStory() {
    body.classList.remove("locked");
    body.classList.add("unlocked");
    story.setAttribute("aria-hidden", "false");
    window.scrollTo(0, 0);
    startFloatingPhotos();
}


/* ========================================================
   DAYS TOGETHER + "HAPPY 1ST ANNIVERSARY"
   ======================================================== */

(function () {
    const start = new Date(ANNIVERSARY.year, ANNIVERSARY.month - 1, ANNIVERSARY.day);
    const now = new Date();
    const days = Math.max(0, Math.floor((now - start) / 86400000));
    document.querySelector("#daysTogether").textContent = days.toLocaleString();

    let years = now.getFullYear() - ANNIVERSARY.year;
    const beforeThisYears = now < new Date(now.getFullYear(), ANNIVERSARY.month - 1, ANNIVERSARY.day);
    if (beforeThisYears) years -= 1;
    if (years >= 1) {
        const s = ["th", "st", "nd", "rd"], v = years % 100;
        const suffix = s[(v - 20) % 10] || s[v] || s[0];
        document.querySelector("#anniversaryLine").textContent =
            "Happy " + years + suffix + " Anniversary";
    }
})();


/* ========================================================
   DRIFTING HEARTS
   ======================================================== */

const heartsLayer = document.querySelector("#hearts");

function makeHeart(burst) {
    const h = document.createElement("span");
    h.className = "heart" + (burst ? " burst" : "");
    h.textContent = Math.random() < 0.5 ? "♥" : "♡";
    h.style.left = (burst ? 35 + Math.random() * 30 : Math.random() * 100) + "vw";
    h.style.fontSize = (10 + Math.random() * 18) + "px";
    h.style.animationDuration = (burst ? 2 + Math.random() * 2 : 9 + Math.random() * 9) + "s";
    h.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
    heartsLayer.appendChild(h);
    h.addEventListener("animationend", function () { h.remove(); });
}

setInterval(function () { makeHeart(false); }, 900);
for (let i = 0; i < 8; i++) setTimeout(function () { makeHeart(false); }, i * 300);

function heartBurst() {
    for (let i = 0; i < 28; i++) setTimeout(function () { makeHeart(true); }, i * 40);
}


/* ========================================================
   FLOATING PHOTOS
   Uses every photo NOT already shown in a moment, so when
   you swap photos in index.html this list updates by itself.
   ======================================================== */

const floatLayer = document.querySelector("#floatingPhotos");

function startFloatingPhotos() {
    const used = new Set();
    document.querySelectorAll("#story img").forEach(function (img) {
        const m = img.getAttribute("src").match(/moment(\d+)\./);
        if (m) used.add(+m[1]);
    });

    let pool = [];
    for (let n = 1; n <= TOTAL_PHOTOS; n++) if (!used.has(n)) pool.push(n);
    pool.sort(function () { return Math.random() - 0.5; });
    if (!pool.length) return;

    let next = 0;
    let lane = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function launch() {
        const n = pool[next++ % pool.length];
        const fig = document.createElement("div");
        fig.className = "float-photo";
        // Alternate left and right edges so photos never sit on top of the text
        const side = lane++ % 2 === 0;
        fig.style.left = side ? (Math.random() * 18 - 4) + "vw" : (78 + Math.random() * 18) + "vw";
        fig.style.setProperty("--tilt", (Math.random() * 16 - 8) + "deg");
        fig.style.setProperty("--size", (90 + Math.random() * 70) + "px");
        fig.style.animationDuration = (22 + Math.random() * 14) + "s";
        const img = new Image();
        img.alt = "";
        img.decoding = "async";
        img.src = "images/moment" + n + ".jpg";
        fig.appendChild(img);
        img.onload = function () { floatLayer.appendChild(fig); };
        fig.addEventListener("animationend", function () { fig.remove(); launch(); });
    }

    if (reduceMotion) return;
    for (let i = 0; i < FLOATING_AT_ONCE; i++) setTimeout(launch, i * 2600);
}


/* ========================================================
   REVEAL ON SCROLL
   ======================================================== */

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(function (el) { observer.observe(el); });


/* ========================================================
   MUSIC
   - music/song.mp3 is the song of the whole website. It starts
     when she taps Enter.
   - A video with data-song="music/songN.mp3" in index.html plays
     with no sound of its own; its song plays instead, then the
     main song comes back when the video stops.
   - A video without data-song plays its own sound and the music
     waits for it.
   - Every song fades in and out, it never cuts off.
   ======================================================== */

const MAIN_SONG = "music/song.mp3";
const MUSIC_VOLUME = 0.7;
const FADE_IN_MS = 1500;
const FADE_OUT_MS = 1200;

const musicToggle = document.querySelector("#musicToggle");
const videos = document.querySelectorAll("video");
const tracks = {};          // one player per song file
let current = null;         // the track that is (or should be) heard
let musicOn = true;         // false once she turns the music off
let audioCtx = null;        // only used where volume can't be changed (iPhone)

// iPhones ignore audio.volume, so fades there go through Web Audio instead.
const volumeWorks = (function () {
    const a = document.createElement("audio");
    a.volume = 0.5;
    return a.volume === 0.5;
})();
const useWebAudio = !volumeWorks && location.protocol.indexOf("http") === 0;

function getTrack(src) {
    if (tracks[src]) return tracks[src];
    const el = new Audio();
    el.src = src;
    el.loop = true;
    el.preload = src === MAIN_SONG ? "auto" : "none";
    const t = { src: src, el: el, level: 0, missing: false, anim: null, gain: null };
    el.addEventListener("error", function () {
        t.missing = true;
        if (current === t && src !== MAIN_SONG) switchTo(MAIN_SONG);
    });
    tracks[src] = t;
    return t;
}

function setLevel(t, v) {
    t.level = v;
    if (t.gain) t.gain.gain.value = v;
    else t.el.volume = Math.max(0, Math.min(1, v));
}

function fade(t, target, ms, done) {
    cancelAnimationFrame(t.anim);
    const from = t.level;
    const start = performance.now();
    function step(now) {
        const k = Math.min(1, (now - start) / ms);
        const eased = k * k * (3 - 2 * k);
        setLevel(t, from + (target - from) * eased);
        if (k < 1) t.anim = requestAnimationFrame(step);
        else if (done) done();
    }
    t.anim = requestAnimationFrame(step);
}

function startTrack(t) {
    t.stopping = false;
    if (useWebAudio && audioCtx && !t.gain) {
        t.gain = audioCtx.createGain();
        audioCtx.createMediaElementSource(t.el).connect(t.gain).connect(audioCtx.destination);
    }
    setLevel(t, t.level);
    const p = t.el.play();
    if (p) p.then(function () {
        musicToggle.classList.remove("hidden");
        musicToggle.classList.add("playing");
    }).catch(function () {
        t.missing = true;
        if (current === t && t.src !== MAIN_SONG) switchTo(MAIN_SONG);
    });
    fade(t, MUSIC_VOLUME, FADE_IN_MS);
}

function stopTrack(t) {
    t.stopping = true;
    fade(t, 0, FADE_OUT_MS, function () {
        if (t.stopping) t.el.pause();
    });
}

// Fade out whatever is playing and fade in `src` (or nothing, if src is null).
function switchTo(src) {
    let next = src ? getTrack(src) : null;
    if (next && next.missing) next = src === MAIN_SONG ? null : getTrack(MAIN_SONG);
    if (next && next.missing) next = null;
    if (next === current && (!next || (!next.stopping && !next.el.paused))) return;
    if (current && current !== next) stopTrack(current);
    current = next;
    if (next && musicOn) startTrack(next);
}

// What should be heard right now?
function songForNow() {
    const playing = Array.prototype.find.call(videos, function (v) { return !v.paused && !v.ended; });
    if (!playing) return MAIN_SONG;
    return playing.dataset.song || null;   // null: the video has its own sound
}

document.querySelector("#enterButton").addEventListener("click", function () {
    if (useWebAudio && !audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    getTrack(MAIN_SONG).missing = false;
    switchTo(MAIN_SONG);
});

musicToggle.addEventListener("click", function () {
    musicOn = !musicOn;
    musicToggle.classList.toggle("muted", !musicOn);
    musicToggle.classList.toggle("playing", musicOn);
    musicToggle.setAttribute("aria-label", musicOn ? "Pause the music" : "Play the music");
    if (!musicOn) {
        if (current) stopTrack(current);
    } else {
        const want = songForNow();
        current = null;
        if (want) switchTo(want);
    }
});


/* ========================================================
   VIDEOS — one at a time, each one bringing its own song
   ======================================================== */

videos.forEach(function (v) {
    if (v.dataset.song) {
        v.muted = true;
        // Keep these videos silent even if the mute button on the video is pressed
        v.addEventListener("volumechange", function () { if (!v.muted) v.muted = true; });
        getTrack(v.dataset.song);
    }

    v.addEventListener("play", function () {
        videos.forEach(function (other) { if (other !== v) other.pause(); });
        // Starting the video from the beginning starts its song from the beginning too
        if (v.dataset.song && v.currentTime < 0.5) {
            const t = getTrack(v.dataset.song);
            if (t.el.paused) t.el.currentTime = 0;
        }
        switchTo(v.dataset.song || null);
    });

    function stopped() {
        setTimeout(function () {
            if (songForNow() === MAIN_SONG) switchTo(MAIN_SONG);
        }, 250);
    }
    v.addEventListener("pause", stopped);
    v.addEventListener("ended", stopped);
});


/* ========================================================
   TAP A PHOTO TO SEE IT BIG
   ======================================================== */

const lightbox = document.querySelector("#lightbox");
const lightboxImg = lightbox.querySelector("img");

document.querySelectorAll(".photo img").forEach(function (img) {
    img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightbox.classList.add("open");
    });
});
lightbox.addEventListener("click", function () { lightbox.classList.remove("open"); });

document.querySelector("#backToTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
