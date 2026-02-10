/**********************
 * CONFIGURATION
 **********************/
const CONFIG = {
    path: "scans/",        // dossier des images (PAS un zip)
    ext: ".jpeg",           // extension (.jpg, .png, .webp…)
    totalPages: 52,        // ⚠️ nombre EXACT d’images
    pad: 3                 // 001, 002, 003 → mettre 2 pour 01, 02
};

/**********************
 * VARIABLES
 **********************/
let currentPage = 0;
let zoomLevel = 1;
let pages = [];

const img = document.getElementById("page");
const counter = document.getElementById("counter");
const viewer = document.getElementById("viewer");

/**********************
 * INITIALISATION
 **********************/
function initPages() {
    pages = [];
    for (let i = 1; i <= CONFIG.totalPages; i++) {
        const num = String(i).padStart(CONFIG.pad, "0");
        pages.push(`${CONFIG.path}${num}${CONFIG.ext}`);
    }
}

function showPage() {
    img.src = pages[currentPage];
    img.style.transform = `scale(${zoomLevel})`;
    counter.textContent = `${currentPage + 1} / ${pages.length}`;
}

/**********************
 * NAVIGATION
 **********************/
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        resetZoom();
        showPage();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        resetZoom();
        showPage();
    }
}

/**********************
 * ZOOM
 **********************/
function zoomIn() {
    zoomLevel += 0.2;
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(1, zoomLevel - 0.2);
    applyZoom();
}

function resetZoom() {
    zoomLevel = 1;
    applyZoom();
}

function applyZoom() {
    img.style.transform = `scale(${zoomLevel})`;
}

/**********************
 * MODE NUIT / JOUR
 **********************/
function toggleMode() {
    document.body.classList.toggle("light");
}

/**********************
 * CLICK / TAP (MANGA STYLE)
 **********************/
viewer.addEventListener("click", (e) => {
    const middle = window.innerWidth / 2;
    if (e.clientX > middle) nextPage();
    else prevPage();
});

/**********************
 * SWIPE MOBILE
 **********************/
let touchStartX = 0;

viewer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

viewer.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;

    if (diff < -50) nextPage();
    if (diff > 50) prevPage();
});

/**********************
 * ERREUR IMAGE
 **********************/
img.onerror = () => {
    img.alt = "Image introuvable";
    console.error("Image introuvable :", pages[currentPage]);
};

/**********************
 * CLAVIER (PC)
 **********************/
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextPage();
    if (e.key === "ArrowLeft") prevPage();
    if (e.key === "+") zoomIn();
    if (e.key === "-") zoomOut();
});

/**********************
 * LANCEMENT
 **********************/
initPages();
showPage();

/**********************
 * EXPORT POUR BOUTONS HTML
 **********************/
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.toggleMode = toggleMode;

