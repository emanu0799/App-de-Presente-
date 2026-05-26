const defaultSettings = {
  ownerName: "Emanuel",
  initials: "EG",
  brandLabel: "Lista de Presentes",
  heroTitle: "Lista de presentes do Emanuel",
  heroText:
    "Veja as sugestoes, reserve o presente que combinou com voce e entre no clima com pequenas surpresas pelo caminho.",
  whatsappNumber: "5547999999999",
  heroImage:
    "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80",
};

const defaultGifts = [
  {
    id: "jogo-toalhas",
    title: "Jogo de toalhas macias",
    category: "Casa",
    price: "R$ 129",
    description: "Um conjunto bonito para deixar o dia a dia mais confortavel.",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
    url: "https://www.google.com/search?q=jogo+de+toalhas+macias",
  },
  {
    id: "cafeteira",
    title: "Cafeteira especial",
    category: "Cozinha",
    price: "R$ 219",
    description: "Para comecar a manha com cafe fresco e aquele cheirinho bom.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    url: "https://www.google.com/search?q=cafeteira+eletrica",
  },
  {
    id: "luminaria",
    title: "Luminaria aconchegante",
    category: "Decoracao",
    price: "R$ 159",
    description: "Luz quentinha para deixar qualquer cantinho mais acolhedor.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    url: "https://www.google.com/search?q=luminaria+decorativa",
  },
  {
    id: "kit-jantar",
    title: "Kit jantar para receber",
    category: "Cozinha",
    price: "R$ 189",
    description: "Uma ajuda charmosa para encontros, conversas e mesa cheia.",
    image:
      "https://images.unsplash.com/photo-1484659619207-9165d119dafe?auto=format&fit=crop&w=900&q=80",
    url: "https://www.google.com/search?q=kit+jantar+aparelho+de+jantar",
  },
  {
    id: "vale-experiencia",
    title: "Vale experiencia",
    category: "Experiencia",
    price: "Livre",
    description: "Um passeio, jantar ou momento especial escolhido por voce.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/5547999999999?text=Quero%20combinar%20um%20vale%20experiencia%20de%20presente",
  },
  {
    id: "pix-carinho",
    title: "Pix de carinho",
    category: "Experiencia",
    price: "Voce escolhe",
    description: "Para contribuir com um sonho e deixar uma mensagem especial.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    url: "https://wa.me/5547999999999?text=Oi!%20Quero%20pedir%20a%20chave%20Pix%20da%20lista%20de%20presentes.",
  },
];

const storageKey = "lista-presentes-reservas-v1";
const catalogStorageKey = "lista-presentes-catalogo-v1";
const apiStorageKey = "lista-presentes-api-url-v1";
const settingsStorageKey = "lista-presentes-config-v1";
let settings = loadSettings();
let gifts = loadGiftCatalog();
let giftApiUrl =
  localStorage.getItem(apiStorageKey) ||
  (location.hostname.includes("vercel.app") ? "/api/gifts" : "");
let activeFilter = "Todos";
let activeGift = null;
let editingGiftId = null;
let audioEnabled = false;
let audioContext = null;

const grid = document.querySelector("#giftGrid");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll("[data-filter]");
const modal = document.querySelector("#giftModal");
const modalImage = document.querySelector("#modalImage");
const modalCategory = document.querySelector("#modalCategory");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalPrice = document.querySelector("#modalPrice");
const modalBadge = document.querySelector("#modalBadge");
const buyLink = document.querySelector("#buyLink");
const guestName = document.querySelector("#guestName");
const reserveButton = document.querySelector("#reserveButton");
const toast = document.querySelector("#toast");
const soundToggle = document.querySelector("#soundToggle");
const surpriseButton = document.querySelector("#surpriseButton");
const whatsappLink = document.querySelector("#whatsappLink");
const reservedCount = document.querySelector("#reservedCount");
const availableCount = document.querySelector("#availableCount");
const favoriteCategory = document.querySelector("#favoriteCategory");
const confettiCanvas = document.querySelector("#confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
const giftForm = document.querySelector("#giftForm");
const giftUrl = document.querySelector("#giftUrl");
const giftTitle = document.querySelector("#giftTitle");
const giftPrice = document.querySelector("#giftPrice");
const giftCategory = document.querySelector("#giftCategory");
const giftImage = document.querySelector("#giftImage");
const giftPhoto = document.querySelector("#giftPhoto");
const giftDescription = document.querySelector("#giftDescription");
const previewImage = document.querySelector("#previewImage");
const previewCategory = document.querySelector("#previewCategory");
const previewTitle = document.querySelector("#previewTitle");
const previewDescription = document.querySelector("#previewDescription");
const previewPrice = document.querySelector("#previewPrice");
const clearFormButton = document.querySelector("#clearFormButton");
const saveGiftButton = document.querySelector("#saveGiftButton");
const resetCatalogButton = document.querySelector("#resetCatalogButton");
const exportButton = document.querySelector("#exportButton");
const importData = document.querySelector("#importData");
const importButton = document.querySelector("#importButton");
const apiUrl = document.querySelector("#apiUrl");
const saveApiButton = document.querySelector("#saveApiButton");
const editorPanel = document.querySelector("#editor");
const editorLinks = document.querySelectorAll("[data-editor-link]");
const settingsForm = document.querySelector("#settingsForm");
const settingName = document.querySelector("#settingName");
const settingInitials = document.querySelector("#settingInitials");
const settingTitle = document.querySelector("#settingTitle");
const settingText = document.querySelector("#settingText");
const settingWhatsapp = document.querySelector("#settingWhatsapp");
const settingHeroImage = document.querySelector("#settingHeroImage");
const brandMark = document.querySelector("#brandMark");
const brandLabel = document.querySelector("#brandLabel");
const heroTitle = document.querySelector("#heroTitle");
const heroText = document.querySelector("#heroText");
const heroImage = document.querySelector("#heroImage");

const reservations = new Map(Object.entries(JSON.parse(localStorage.getItem(storageKey) || "{}")));
const editorEnabled = new URLSearchParams(window.location.search).get("editar") === "1";

function loadSettings() {
  try {
    return { ...defaultSettings, ...JSON.parse(localStorage.getItem(settingsStorageKey) || "{}") };
  } catch {
    return { ...defaultSettings };
  }
}

function loadGiftCatalog() {
  try {
    const saved = JSON.parse(localStorage.getItem(catalogStorageKey) || "null");
    return Array.isArray(saved) && saved.length ? saved : [...defaultGifts];
  } catch {
    return [...defaultGifts];
  }
}

function saveReservations() {
  localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(reservations)));
}

function saveGiftCatalog() {
  localStorage.setItem(catalogStorageKey, JSON.stringify(gifts));
}

function saveSettings() {
  localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function normalizeGift(gift) {
  return {
    id: String(gift.id || makeGiftId(gift.title)),
    title: String(gift.title || ""),
    category: String(gift.category || "Casa"),
    price: String(gift.price || ""),
    description: String(gift.description || ""),
    image: String(gift.image || ""),
    url: String(gift.url || "#"),
  };
}

async function apiRequest(action, payload = {}) {
  if (!giftApiUrl) return null;

  const response = await fetch(giftApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) throw new Error("Falha na conexao online");
  return response.json();
}

async function syncCatalogFromCloud(showMessage = false) {
  if (!giftApiUrl) return;

  try {
    const response = await fetch(giftApiUrl);
    if (!response.ok) throw new Error("Falha ao ler lista online");

    const data = await response.json();
    if (Array.isArray(data?.gifts) && data.gifts.length) {
      gifts = data.gifts.map(normalizeGift);
      saveGiftCatalog();
    }

    if (data?.reservations && typeof data.reservations === "object") {
      reservations.clear();
      Object.entries(data.reservations).forEach(([id, name]) => reservations.set(id, String(name)));
      saveReservations();
    }

    updateStats();
    renderGifts();
    if (showMessage) showToast("Lista online sincronizada.");
  } catch {
    if (showMessage) showToast("Nao consegui conectar online. O app segue no modo local.");
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value, fallback = "#") {
  try {
    const url = new URL(value);
    return ["http:", "https:", "data:"].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function makeGiftId(title) {
  return `${title || "presente"}-${Date.now()}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatWhatsappMessage(giftTitle = "") {
  const text = giftTitle
    ? `Oi, ${settings.ownerName}! Quero falar sobre o presente: ${giftTitle}.`
    : `Oi, ${settings.ownerName}! Vi sua lista de presentes e quero mandar uma mensagem.`;
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function formatReservationMessage(guest, giftTitle) {
  const text = `Oi, ${settings.ownerName}! Sou ${guest} e quero reservar este presente: ${giftTitle}.`;
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function filteredGifts() {
  const term = searchInput.value.trim().toLowerCase();
  return gifts.filter((gift) => {
    const matchesFilter = activeFilter === "Todos" || gift.category === activeFilter;
    const matchesTerm = [gift.title, gift.category, gift.description].some((value) =>
      value.toLowerCase().includes(term),
    );
    return matchesFilter && matchesTerm;
  });
}

function renderGifts() {
  const visibleGifts = filteredGifts();

  if (!visibleGifts.length) {
    grid.innerHTML = '<div class="empty-state">Nenhum presente apareceu por aqui. Tente outro filtro.</div>';
    return;
  }

  grid.innerHTML = visibleGifts
    .map((gift) => {
      const reservedBy = reservations.get(gift.id);
      const status = reservedBy ? `Reservado por ${reservedBy}` : "Disponivel";
      const giftTitle = escapeHtml(gift.title);
      const giftCategory = escapeHtml(gift.category);
      const giftDescription = escapeHtml(gift.description);
      const giftPrice = escapeHtml(gift.price);
      const giftImage = safeUrl(gift.image);
      return `
        <article class="gift-card ${reservedBy ? "is-reserved" : ""}">
          <div class="gift-image">
            <img src="${giftImage}" alt="${giftTitle}" loading="lazy">
            <span class="tag">${giftCategory}</span>
          </div>
          <div class="card-body">
            <h3>${giftTitle}</h3>
            <p>${giftDescription}</p>
            <div class="card-meta">
              <span class="price">${giftPrice}</span>
              <span class="reserved-by">${escapeHtml(status)}</span>
            </div>
            <div class="card-actions">
              <button class="primary-button" type="button" data-open="${escapeHtml(gift.id)}">
                ${reservedBy ? "Ver detalhes" : "Reservar"}
              </button>
              <a class="small-button" href="${formatWhatsappMessage(gift.title)}" target="_blank" rel="noreferrer" aria-label="Enviar mensagem sobre ${giftTitle}">WA</a>
            </div>
            ${
              editorEnabled
                ? `<div class="admin-actions">
                    <button type="button" data-edit="${escapeHtml(gift.id)}">Editar</button>
                    <button type="button" data-delete="${escapeHtml(gift.id)}">Excluir</button>
                  </div>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");

  grid.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openGift(button.dataset.open));
  });
  grid.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => editGift(button.dataset.edit));
  });
  grid.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteGift(button.dataset.delete));
  });
}

function updateStats() {
  const reserved = reservations.size;
  reservedCount.textContent = reserved;
  availableCount.textContent = gifts.length - reserved;

  const categoryScores = gifts.reduce((scores, gift) => {
    scores[gift.category] = (scores[gift.category] || 0) + (reservations.has(gift.id) ? 2 : 1);
    return scores;
  }, {});
  favoriteCategory.textContent =
    Object.entries(categoryScores).sort((a, b) => b[1] - a[1])[0]?.[0] || "Casa";
}

function openGift(giftId) {
  activeGift = gifts.find((gift) => gift.id === giftId);
  if (!activeGift) return;

  const reservedBy = reservations.get(activeGift.id);
  modalImage.src = safeUrl(activeGift.image);
  modalImage.alt = activeGift.title;
  modalCategory.textContent = activeGift.category;
  modalTitle.textContent = activeGift.title;
  modalDescription.textContent = activeGift.description;
  modalPrice.textContent = activeGift.price;
  modalBadge.textContent = reservedBy ? `Reservado por ${reservedBy}` : "Ainda disponivel";
  buyLink.href = safeUrl(activeGift.url);
  guestName.value = reservedBy || "";
  guestName.disabled = Boolean(reservedBy);
  reserveButton.textContent = reservedBy ? "Presente reservado" : "Reservar presente";
  reserveButton.disabled = Boolean(reservedBy);
  document.body.classList.add("modal-open");
  modal.showModal();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function playChime() {
  if (!audioEnabled) return;
  audioContext ||= new AudioContext();
  const now = audioContext.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = freq;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, now + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.25);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + 0.28);
  });
}

async function reserveActiveGift() {
  if (!activeGift || reservations.has(activeGift.id)) return;

  const name = guestName.value.trim();
  if (!name) {
    showToast("Digite seu nome para reservar esse presente.");
    guestName.focus();
    return;
  }

  reservations.set(activeGift.id, name);
  saveReservations();
  try {
    await apiRequest("reserve", { giftId: activeGift.id, guest: name });
  } catch {
    showToast("Reservei neste aparelho, mas a sincronizacao online falhou.");
  }
  updateStats();
  renderGifts();
  modal.close();
  document.body.classList.remove("modal-open");
  burstConfetti();
  playChime();
  window.open(formatReservationMessage(name, activeGift.title), "_blank", "noopener");
  showToast(`${name}, ${activeGift.title} foi reservado. Confirme pelo WhatsApp!`);
}

function pickSurprise() {
  const available = gifts.filter((gift) => !reservations.has(gift.id));
  const pool = available.length ? available : gifts;
  const gift = pool[Math.floor(Math.random() * pool.length)];
  openGift(gift.id);
  burstConfetti(70);
}

function inferGiftFromLink() {
  if (!giftUrl.value || giftTitle.value.trim()) return;

  try {
    const url = new URL(giftUrl.value);
    const lastPart = url.pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_+]+/g, " ");
    const storeName = url.hostname.replace(/^www\./, "").split(".")[0];
    const inferredTitle = lastPart || `Presente da ${storeName}`;
    giftTitle.value = inferredTitle.replace(/\b\w/g, (letter) => letter.toUpperCase());

    if (!giftDescription.value.trim()) {
      giftDescription.value = `Um presente escolhido na ${storeName} para deixar esse momento ainda mais especial.`;
    }
  } catch {
    showToast("Esse link ainda nao parece valido.");
  }

  updatePreview();
}

function updatePreview() {
  const imageValue = giftImage.value.trim();
  previewImage.src = imageValue
    ? safeUrl(imageValue, previewImage.src)
    : "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80";
  previewCategory.textContent = giftCategory.value;
  previewTitle.textContent = giftTitle.value.trim() || "Seu presente aparece aqui";
  previewDescription.textContent =
    giftDescription.value.trim() || "Cole um link, escolha uma foto e escreva uma frase para montar um card lindo.";
  previewPrice.textContent = giftPrice.value.trim() || "R$ 0";
}

function clearGiftForm() {
  giftForm.reset();
  editingGiftId = null;
  saveGiftButton.textContent = "Adicionar a lista";
  updatePreview();
}

async function addGiftFromForm(event) {
  event.preventDefault();

  const title = giftTitle.value.trim();
  const price = giftPrice.value.trim();
  const description = giftDescription.value.trim();
  const url = giftUrl.value.trim() || formatWhatsappMessage(title);
  const image =
    giftImage.value.trim() ||
    "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80";

  if (!title || !price || !description) {
    showToast("Preencha nome, valor e mensagem para montar o presente.");
    return;
  }

  const newGift = {
    id: editingGiftId || makeGiftId(title),
    title,
    category: giftCategory.value,
    price,
    description,
    image,
    url,
  };

  gifts = editingGiftId
    ? gifts.map((gift) => (gift.id === editingGiftId ? newGift : gift))
    : [newGift, ...gifts];

  saveGiftCatalog();
  const wasEditing = Boolean(editingGiftId);
  try {
    await apiRequest("addGift", { gift: newGift });
  } catch {
    if (giftApiUrl) showToast("Presente salvo localmente, mas a sincronizacao online falhou.");
  }
  updateStats();
  renderGifts();
  clearGiftForm();
  burstConfetti(80);
  showToast(wasEditing ? "Presente atualizado." : "Presente adicionado com visual pronto.");
}

function editGift(giftId) {
  const gift = gifts.find((item) => item.id === giftId);
  if (!gift) return;

  editingGiftId = gift.id;
  giftUrl.value = gift.url || "";
  giftTitle.value = gift.title || "";
  giftPrice.value = gift.price || "";
  giftCategory.value = gift.category || "Casa";
  giftImage.value = gift.image || "";
  giftDescription.value = gift.description || "";
  saveGiftButton.textContent = "Salvar alteracoes";
  updatePreview();
  document.querySelector("#editor").scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Edite os campos e salve as alteracoes.");
}

async function deleteGift(giftId) {
  const gift = gifts.find((item) => item.id === giftId);
  if (!gift) return;

  const confirmed = window.confirm(`Excluir "${gift.title}" da lista?`);
  if (!confirmed) return;

  gifts = gifts.filter((item) => item.id !== giftId);
  reservations.delete(giftId);
  saveGiftCatalog();
  saveReservations();

  try {
    await apiRequest("deleteGift", { giftId });
  } catch {
    if (giftApiUrl) showToast("Removi localmente, mas a sincronizacao online falhou.");
  }

  updateStats();
  renderGifts();
  showToast("Presente excluido.");
}

function exportCatalog() {
  const payload = JSON.stringify(gifts, null, 2);
  importData.value = payload;

  navigator.clipboard
    ?.writeText(payload)
    .then(() => showToast("Lista copiada. Guarde esse texto para publicar ou importar depois."))
    .catch(() => showToast("Lista pronta no campo de importacao. Copie dali quando quiser."));
}

function importCatalog() {
  try {
    const imported = JSON.parse(importData.value);
    if (!Array.isArray(imported)) throw new Error("Formato invalido");

    gifts = imported
      .filter((gift) => gift.title && gift.price && gift.description)
      .map(normalizeGift);

    if (!gifts.length) throw new Error("Lista vazia");
    saveGiftCatalog();
    updateStats();
    renderGifts();
    showToast("Lista importada com sucesso.");
  } catch {
    showToast("Nao consegui importar. Confira se voce colou a lista copiada completa.");
  }
}

function resetCatalog() {
  gifts = [...defaultGifts];
  reservations.clear();
  localStorage.removeItem(catalogStorageKey);
  saveReservations();
  updateStats();
  renderGifts();
  showToast("A lista voltou aos exemplos iniciais.");
}

function saveApiUrl() {
  giftApiUrl = apiUrl.value.trim();
  if (giftApiUrl) {
    localStorage.setItem(apiStorageKey, giftApiUrl);
    showToast("Modo online conectado. Vou sincronizar agora.");
    syncCatalogFromCloud(true);
  } else {
    localStorage.removeItem(apiStorageKey);
    giftApiUrl = location.hostname.includes("vercel.app") ? "/api/gifts" : "";
    apiUrl.value = giftApiUrl;
    showToast("Modo online desligado. O app esta usando dados locais.");
  }
}

function loadPhotoFromFile() {
  const file = giftPhoto.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    giftImage.value = reader.result;
    updatePreview();
  });
  reader.readAsDataURL(file);
}

function applySettings() {
  document.title = `Lista de Presentes | ${settings.ownerName}`;
  brandMark.textContent = settings.initials || "LP";
  brandLabel.textContent = settings.brandLabel || "Lista de Presentes";
  heroTitle.textContent = settings.heroTitle;
  heroText.textContent = settings.heroText;
  heroImage.src = safeUrl(settings.heroImage, defaultSettings.heroImage);
  heroImage.alt = `Imagem principal da lista de ${settings.ownerName}`;
  whatsappLink.href = formatWhatsappMessage();

  settingName.value = settings.ownerName;
  settingInitials.value = settings.initials;
  settingTitle.value = settings.heroTitle;
  settingText.value = settings.heroText;
  settingWhatsapp.value = settings.whatsappNumber;
  settingHeroImage.value = settings.heroImage;
}

function saveSettingsFromForm(event) {
  event.preventDefault();

  settings = {
    ...settings,
    ownerName: settingName.value.trim() || defaultSettings.ownerName,
    initials: settingInitials.value.trim() || defaultSettings.initials,
    heroTitle: settingTitle.value.trim() || defaultSettings.heroTitle,
    heroText: settingText.value.trim() || defaultSettings.heroText,
    whatsappNumber: settingWhatsapp.value.replace(/\D/g, "") || defaultSettings.whatsappNumber,
    heroImage: settingHeroImage.value.trim() || defaultSettings.heroImage,
  };

  saveSettings();
  applySettings();
  renderGifts();
  showToast("Personalizacao salva.");
}

function setupEditorVisibility() {
  editorPanel.hidden = !editorEnabled;
  editorLinks.forEach((link) => {
    link.hidden = !editorEnabled;
  });

  if (editorEnabled) {
    showToast("Modo edicao ativado.");
  }
}

function sizeCanvas() {
  confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
  confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
}

function burstConfetti(amount = 120) {
  sizeCanvas();
  const pieces = Array.from({ length: amount }, () => ({
    x: confettiCanvas.width / 2,
    y: confettiCanvas.height * 0.2,
    size: 7 + Math.random() * 9,
    color: ["#006d77", "#d7a84b", "#e86f5b", "#14213d", "#58b8a7"][
      Math.floor(Math.random() * 5)
    ],
    vx: (Math.random() - 0.5) * 18,
    vy: Math.random() * -12 - 4,
    gravity: 0.42 + Math.random() * 0.18,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.24,
    life: 80 + Math.random() * 40,
  }));

  function frame() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += piece.gravity;
      piece.rotation += piece.spin;
      piece.life -= 1;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
      ctx.restore();
    });

    if (pieces.some((piece) => piece.life > 0 && piece.y < confettiCanvas.height + 40)) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  requestAnimationFrame(frame);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderGifts();
  });
});

searchInput.addEventListener("input", renderGifts);
reserveButton.addEventListener("click", reserveActiveGift);
surpriseButton.addEventListener("click", pickSurprise);
giftForm.addEventListener("submit", addGiftFromForm);
settingsForm.addEventListener("submit", saveSettingsFromForm);
giftUrl.addEventListener("blur", inferGiftFromLink);
giftPhoto.addEventListener("change", loadPhotoFromFile);
[giftUrl, giftTitle, giftPrice, giftCategory, giftImage, giftDescription].forEach((field) => {
  field.addEventListener("input", updatePreview);
});
clearFormButton.addEventListener("click", clearGiftForm);
exportButton.addEventListener("click", exportCatalog);
importButton.addEventListener("click", importCatalog);
resetCatalogButton.addEventListener("click", resetCatalog);
saveApiButton.addEventListener("click", saveApiUrl);
soundToggle.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  soundToggle.classList.toggle("is-on", audioEnabled);
  showToast(audioEnabled ? "Som ativado para as surpresas." : "Som desativado.");
  if (audioEnabled) playChime();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
window.addEventListener("resize", sizeCanvas);

apiUrl.value = giftApiUrl;
applySettings();
setupEditorVisibility();
updateStats();
renderGifts();
updatePreview();
if (giftApiUrl) syncCatalogFromCloud(false);
