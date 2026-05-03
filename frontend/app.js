/* ═══════════════════════════════════════════════
   Kisan Mitra — Frontend JavaScript
   Full SPA logic: API calls, state management,
   UI rendering for all pages
   ═══════════════════════════════════════════════ */

const API = 'http://localhost:8000';

// ── App State ─────────────────────────────────────────────────────────────
const state = {
  farmer: null,          // registered farmer object
  farmerId: null,
  language: 'en',
  schemes: [],
  eligibilityResult: null,
  pendingPrefill: null,  // { farmerId, schemeId, schemeData }
};

// ── Init ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Load stored docs
  loadDocsFromStorage();

  // Restore session
  const saved = localStorage.getItem('kisan_farmer');
  if (saved) {
    try {
      state.farmer = JSON.parse(saved);
      state.farmerId = state.farmer.id;
      renderProfile();
      updateDashboardGreeting();
      showPage('dashboard');   // always land on dashboard if logged in
      loadSchemes();
      loadNotifications();
      setTimeout(() => loadMyApplications(), 500);
    } catch { showPage('register'); }
  } else {
    showPage('register');
  }

  const savedLang = localStorage.getItem('kisan_lang') || 'en';
  setLang(savedLang, false);
});

// ── Navigation ────────────────────────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const page = document.getElementById(`page-${pageId}`);
  if (page) page.classList.add('active');
  const navBtn = document.getElementById(`nav-${pageId}`);
  if (navBtn) navBtn.classList.add('active');

  // Lazy load data per page
  if (pageId === 'schemes') loadSchemes();
  if (pageId === 'notifications') loadNotifications();
  if (pageId === 'applications') loadMyApplications();
  if (pageId === 'dashboard' && state.farmerId) updateDashboardStats();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Language ──────────────────────────────────────────────────────────────
function setLang(lang, save = true) {
  state.language = lang;
  if (save) localStorage.setItem('kisan_lang', lang);
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-kn').classList.toggle('active', lang === 'kn');
  const chatLang = document.getElementById('chat-lang');
  if (chatLang) chatLang.value = lang;
}

function updateChatLang() {
  state.language = document.getElementById('chat-lang').value;
  document.getElementById('lang-en').classList.toggle('active', state.language === 'en');
  document.getElementById('lang-kn').classList.toggle('active', state.language === 'kn');
}

// ── API Helper ────────────────────────────────────────────────────────────
async function api(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || JSON.stringify(data));
  return data;
}

// ── REGISTER ──────────────────────────────────────────────────────────────
async function registerFarmer(e) {
  e.preventDefault();
  const btn = document.getElementById('reg-submit-btn');
  const errEl = document.getElementById('reg-error');
  errEl.classList.add('hidden');
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  const payload = {
    full_name: v('reg-name'),
    phone: v('reg-phone'),
    email: v('reg-email') || null,
    date_of_birth: v('reg-dob') || null,
    gender: v('reg-gender') || null,
    state: v('reg-state'),
    district: v('reg-district'),
    taluk: v('reg-taluk') || null,
    village: v('reg-village') || null,
    pincode: v('reg-pincode') || null,
    land_size_hectares: parseFloat(v('reg-land')),
    primary_crop: v('reg-crop'),
    annual_income: v('reg-income') ? parseFloat(v('reg-income')) : null,
    irrigation_type: v('reg-irrigation') || null,
    bank_account_number: v('reg-account') || null,
    ifsc_code: v('reg-ifsc') ? v('reg-ifsc').toUpperCase() : null,
    preferred_language: v('reg-lang'),
  };

  try {
    const farmer = await api('POST', '/api/farmers/register', payload);
    // Persist uploaded docs
    saveDocsToStorage();
    afterLogin(farmer);
  } catch (err) {
    errEl.textContent = '❌ ' + err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  }
}

function v(id) { return document.getElementById(id)?.value?.trim() || ''; }

// ── LOGIN ─────────────────────────────────────────────────────────────────
async function loginFarmer(e) {
  e.preventDefault();
  const btn   = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');
  const phone = document.getElementById('login-phone').value.trim();
  errEl.classList.add('hidden');
  btn.querySelector('.btn-text').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  try {
    const farmer = await api('POST', '/api/farmers/login', { phone });
    afterLogin(farmer);
  } catch (err) {
    errEl.textContent = '❌ ' + err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.querySelector('.btn-text').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
  }
}

function afterLogin(farmer) {
  state.farmer   = farmer;
  state.farmerId = farmer.id;
  localStorage.setItem('kisan_farmer', JSON.stringify(farmer));
  setLang(farmer.preferred_language);
  try { api('POST', '/api/schemes/seed'); } catch { /* ok */ }
  renderProfile();
  updateDashboardGreeting();
  loadSchemes();
  loadNotifications();
  loadMyApplications();
  showPage('dashboard');
  setTimeout(() => checkEligibility(), 600);
}


// ── SCHEMES ───────────────────────────────────────────────────────────────
async function loadSchemes() {
  try {
    // Seed first (idempotent)
    try { await api('POST', '/api/schemes/seed'); } catch { /* ok */ }
    const schemes = await api('GET', '/api/schemes/');
    state.schemes = schemes;
    renderSchemeList(schemes, 'scheme-list');
  } catch (err) {
    document.getElementById('scheme-list').innerHTML = `<p class="empty-state">⚠️ Backend not connected. Start the API server.</p>`;
  }
}

function filterSchemes() {
  const cat = document.getElementById('filter-category').value;
  const filtered = cat ? state.schemes.filter(s => s.category === cat) : state.schemes;
  renderSchemeList(filtered, 'scheme-list');
}

function renderSchemeList(schemes, containerId) {
  const el = document.getElementById(containerId);
  if (!schemes.length) { el.innerHTML = '<p class="empty-state">No schemes found.</p>'; return; }
  el.innerHTML = schemes.map(s => schemeCard(s, false)).join('');
}

function schemeCard(s, showScore = false, score = 0) {
  const catColor = { financial:'#22c55e', insurance:'#3b82f6', subsidy:'#f59e0b', loan:'#8b5cf6', equipment:'#ec4899' };
  const color = catColor[s.category] || '#22c55e';
  const displayName = (state.language === 'kn' && s.name_kn) ? s.name_kn : s.name;
  const displayDesc = (state.language === 'kn' && s.description_kn) ? s.description_kn : s.description;
  const displayBenefit = (state.language === 'kn' && s.benefits_kn) ? s.benefits_kn : s.benefits;

  const scoreBar = showScore ? `
    <div class="score-bar"><div class="score-fill" style="width:${Math.round(score*100)}%"></div></div>
    <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.5rem">Match: ${Math.round(score*100)}%</div>
  ` : '';

  const deadline = s.application_deadline
    ? `<div style="font-size:.78rem;color:#f87171;margin-bottom:.75rem">📅 Deadline: ${s.application_deadline}</div>` : '';
  const benefit = s.max_benefit_amount
    ? `<div class="scheme-benefit">💰 Up to ₹${s.max_benefit_amount.toLocaleString('en-IN')}</div>` : '';

  return `
    <div class="scheme-card">
      <div class="scheme-card-header">
        <span class="scheme-cat-badge" style="color:${color};background:${color}22">${s.category}</span>
        ${s.is_active ? '' : '<span style="color:#f87171;font-size:.75rem">Inactive</span>'}
      </div>
      <div class="scheme-name">${displayName}</div>
      <div class="scheme-desc">${displayDesc.substring(0, 120)}...</div>
      ${scoreBar}
      ${benefit}
      ${deadline}
      <div class="scheme-actions">
        <button class="btn-outline" onclick="viewSchemeDetails('${s.id}')">Details</button>
        ${state.farmerId ? `<button class="btn-primary" onclick="startPrefill('${s.id}')">Apply →</button>` : ''}
      </div>
    </div>`;
}

// ── ELIGIBILITY ───────────────────────────────────────────────────────────
async function checkEligibility() {
  if (!state.farmerId) { showPage('register-form'); return; }
  const el = document.getElementById('eligible-schemes');
  if (el) el.innerHTML = '<div class="loading-spinner">🔍 Checking eligibility...</div>';
  document.getElementById('eligible-section').classList.remove('hidden');

  try {
    const result = await api('GET', `/api/eligibility/${state.farmerId}`);
    state.eligibilityResult = result;
    renderEligibleSchemes(result);
    updateDashboardStats();
  } catch (err) {
    if (el) el.innerHTML = `<p class="empty-state">⚠️ ${err.message}</p>`;
  }
}

function renderEligibleSchemes(result) {
  const el = document.getElementById('eligible-schemes');
  if (!result.eligible_schemes.length) {
    el.innerHTML = '<p class="empty-state">No matching schemes found with current profile. Try updating your profile.</p>';
    return;
  }
  el.innerHTML = result.eligible_schemes.map(s => {
    const schemeObj = state.schemes.find(x => x.id === s.scheme_id) || {};
    const merged = { ...schemeObj, ...s, id: s.scheme_id, name: s.scheme_name, name_kn: s.scheme_name_kn };
    return schemeCard(merged, true, s.match_score);
  }).join('');
}

function updateDashboardStats() {
  if (!state.eligibilityResult) return;
  const r = state.eligibilityResult;
  document.getElementById('stat-eligible').textContent = r.eligible_schemes.length;
  const maxBenefit = r.eligible_schemes.reduce((sum, s) => sum + (s.max_benefit || 0), 0);
  document.getElementById('stat-benefit').textContent = maxBenefit > 0
    ? '₹' + maxBenefit.toLocaleString('en-IN') : '₹0';
}

function updateDashboardGreeting() {
  if (!state.farmer) return;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('dash-greeting').textContent = `${greet}, ${state.farmer.full_name.split(' ')[0]}! 👋`;
  document.getElementById('dash-subtitle').textContent = `Here's your personalised scheme dashboard`;
}

// ── FORM PREFILL ──────────────────────────────────────────────────────────
async function startPrefill(schemeId) {
  if (!state.farmerId) { showPage('register-form'); return; }
  const scheme = state.schemes.find(s => s.id === schemeId) || {};
  state.pendingPrefill = { farmerId: state.farmerId, schemeId, schemeName: scheme.name };

  try {
    const result = await api('POST', '/api/forms/prefill', {
      farmer_id: state.farmerId,
      scheme_id: schemeId,
    });
    showPrefillModal(result);
  } catch (err) {
    alert('⚠️ ' + err.message);
  }
}

function showPrefillModal(data) {
  document.getElementById('modal-title').textContent = `📋 Form Preview: ${data.scheme_name}`;
  const container = document.getElementById('prefill-fields');
  container.innerHTML = data.prefilled_fields.map(f => `
    <div class="prefill-field">
      <span class="prefill-label">${f.field_label}</span>
      <input class="prefill-value" data-key="${f.field_key}" value="${f.value}" />
    </div>
  `).join('');

  document.getElementById('modal-error').classList.add('hidden');
  document.getElementById('modal-success').classList.add('hidden');
  document.getElementById('prefill-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('prefill-modal').classList.add('hidden');
  state.pendingPrefill = null;
}

async function confirmApplication() {
  if (!state.pendingPrefill) return;
  const inputs = document.querySelectorAll('#prefill-fields input');
  const confirmedData = {};
  inputs.forEach(inp => { confirmedData[inp.dataset.key] = inp.value; });

  const errEl = document.getElementById('modal-error');
  const okEl = document.getElementById('modal-success');
  errEl.classList.add('hidden'); okEl.classList.add('hidden');

  try {
    const res = await api('POST', '/api/forms/confirm', {
      farmer_id: state.pendingPrefill.farmerId,
      scheme_id: state.pendingPrefill.schemeId,
      confirmed_data: confirmedData,
    });
    okEl.textContent = '✅ ' + res.message;
    okEl.classList.remove('hidden');
    state.pendingPrefill = null;
    // Update applied count
    const applied = parseInt(document.getElementById('stat-applied').textContent || '0');
    document.getElementById('stat-applied').textContent = applied + 1;
    setTimeout(() => closeModal(), 4000);
  } catch (err) {
    errEl.textContent = '❌ ' + err.message;
    errEl.classList.remove('hidden');
  }
}

// ── SCHEME DETAILS ────────────────────────────────────────────────────────
async function viewSchemeDetails(schemeId) {
  try {
    const s = await api('GET', `/api/schemes/${schemeId}`);
    const name = (state.language === 'kn' && s.name_kn) ? s.name_kn : s.name;
    const desc = (state.language === 'kn' && s.description_kn) ? s.description_kn : s.description;
    const benefits = (state.language === 'kn' && s.benefits_kn) ? s.benefits_kn : s.benefits;
    const docs = (s.required_documents || []).map(d => `• ${d}`).join('\n');

    document.getElementById('modal-title').textContent = name;
    document.getElementById('prefill-fields').innerHTML = `
      <div style="line-height:1.8;color:var(--text-muted)">
        <p style="margin-bottom:1rem;color:var(--text)">${desc}</p>
        <strong style="color:var(--accent)">Benefits:</strong>
        <p style="margin-bottom:1rem">${benefits}</p>
        ${docs ? `<strong style="color:var(--accent)">Required Documents:</strong><pre style="font-family:var(--font);white-space:pre-line;margin-top:.5rem">${docs}</pre>` : ''}
        ${s.application_deadline ? `<p style="margin-top:.5rem;color:#f87171">📅 Deadline: ${s.application_deadline}</p>` : ''}
        ${s.issuing_authority ? `<p style="margin-top:.5rem;color:var(--text-muted)">🏛️ ${s.issuing_authority}</p>` : ''}
      </div>`;
    document.getElementById('modal-error').classList.add('hidden');
    document.getElementById('modal-success').classList.add('hidden');
    document.querySelector('.modal-actions').innerHTML = `
      <button class="btn-outline" onclick="closeModal()">Close</button>
      ${state.farmerId ? `<button class="btn-primary" onclick="closeModal();startPrefill('${s.id}')">Apply for this Scheme →</button>` : ''}
    `;
    document.getElementById('prefill-modal').classList.remove('hidden');
  } catch (err) {
    alert('Error: ' + err.message);
  }
}

// ── CHATBOT ───────────────────────────────────────────────────────────────
async function sendChatMessage() {
  const inp = document.getElementById('chat-input');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  appendBubble(msg, 'user');
  appendBubble('...', 'bot', 'typing-indicator');

  try {
    const res = await api('POST', '/api/chat/', {
      message: msg,
      language: state.language,
      farmer_id: state.farmerId || null,
    });
    removeBubble('typing-indicator');
    const botBubble = appendBubble(res.reply, 'bot');
    if (res.suggestions?.length) {
      const chips = document.createElement('div');
      chips.className = 'chat-suggestions';
      chips.innerHTML = res.suggestions.map(s =>
        `<button class="suggestion-chip" onclick="sendSuggestion('${s}')">${s}</button>`
      ).join('');
      botBubble.appendChild(chips);
    }
  } catch (err) {
    removeBubble('typing-indicator');
    appendBubble('⚠️ Cannot connect to AI server. Please start the backend.', 'bot');
  }
}

function sendSuggestion(text) {
  document.getElementById('chat-input').value = text;
  sendChatMessage();
}

function appendBubble(text, type, id = null) {
  const container = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  if (id) bubble.id = id;
  const content = document.createElement('div');
  content.className = 'bubble-content';
  content.textContent = text;
  bubble.appendChild(content);
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function removeBubble(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── PROFILE RENDER ────────────────────────────────────────────────────────
function renderProfile() {
  const f = state.farmer;
  if (!f) return;
  // Show edit/logout buttons
  const hdr = document.getElementById('profile-header-actions');
  if (hdr) hdr.style.display = 'flex';

  const el = document.getElementById('profile-details');
  const docsSummary = buildDocsSummary();
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--card-border)">
      <div style="font-size:3rem;background:var(--bg3);border-radius:50%;width:64px;height:64px;display:flex;align-items:center;justify-content:center">👨‍🌾</div>
      <div>
        <div style="font-size:1.3rem;font-weight:700">${f.full_name}</div>
        <div style="color:var(--text-muted);font-size:.9rem">${f.phone}</div>
        <span class="farmer-type-badge">${f.farmer_type} Farmer</span>
      </div>
    </div>
    <div class="profile-grid">
      <div class="profile-field"><span class="pf-label">State</span><span class="pf-val">${f.state}</span></div>
      <div class="profile-field"><span class="pf-label">District</span><span class="pf-val">${f.district}</span></div>
      <div class="profile-field"><span class="pf-label">Land Size</span><span class="pf-val">${f.land_size_hectares} Hectares</span></div>
      <div class="profile-field"><span class="pf-label">Primary Crop</span><span class="pf-val">${f.primary_crop}</span></div>
      ${f.annual_income ? `<div class="profile-field"><span class="pf-label">Annual Income</span><span class="pf-val">₹${f.annual_income.toLocaleString('en-IN')}</span></div>` : ''}
      ${f.email ? `<div class="profile-field"><span class="pf-label">Email</span><span class="pf-val">${f.email}</span></div>` : ''}
    </div>
    ${docsSummary}`;
}

function buildDocsSummary() {
  const docs = state.documents || {};
  const labels = { aadhaar:'Aadhaar Card', land:'Land Record', bank:'Bank Passbook', electricity:'Electricity Bill' };
  const icons  = { aadhaar:'🪪', land:'🗺️', bank:'🏦', electricity:'⚡' };
  const items = Object.keys(labels).map(k => {
    const uploaded = !!docs[k];
    return `<div class="profile-doc-chip ${uploaded ? 'uploaded' : 'missing'}">${icons[k]} ${labels[k]} ${uploaded ? '✅' : '—'}</div>`;
  }).join('');
  return `<div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--card-border)">
    <div style="font-size:.85rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.75rem">📄 Uploaded Documents</div>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem">${items}</div>
    <button class="btn-outline" onclick="showPage('documents')" style="margin-top:1rem;font-size:.82rem;padding:.4rem .9rem">Manage Documents →</button>
  </div>`;
}

async function loadFarmerApplications() {
  if (!state.farmerId) return;
  try {
    const res = await api('GET', `/api/forms/applications/${state.farmerId}`);
    document.getElementById('stat-applied').textContent = res.total;
  } catch { /* ok */ }
}

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────
async function loadNotifications() {
  if (!state.farmerId) return;
  try {
    const notifs = await api('GET', `/api/notifications/${state.farmerId}`);
    const el = document.getElementById('notif-list');
    const badge = document.getElementById('notif-count');
    const bell = document.getElementById('notif-bell');
    const unread = notifs.filter(n => !n.is_read).length;

    document.getElementById('stat-notifs').textContent = unread;

    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove('hidden');
      bell.classList.add('has-notif');
    }

    if (!notifs.length) { el.innerHTML = '<p class="empty-state">No notifications yet. Check back after schemes are updated!</p>'; return; }
    el.innerHTML = notifs.map(n => `
      <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="markRead('${n.id}', this)">
        <div class="notif-title">${(state.language === 'kn' && n.title_kn) ? n.title_kn : n.title}</div>
        <div class="notif-msg">${(state.language === 'kn' && n.message_kn) ? n.message_kn : n.message}</div>
        <div class="notif-time">${new Date(n.created_at).toLocaleString('en-IN')}</div>
      </div>`).join('');
  } catch { /* backend not connected */ }
}

async function markRead(id, el) {
  el.classList.remove('unread');
  try { await api('PUT', `/api/notifications/${id}/read`); } catch { /* ok */ }
}

// ── MY APPLICATIONS PAGE ──────────────────────────────────────────────────
async function loadMyApplications() {
  if (!state.farmerId) return;   // silently do nothing — never redirect
  const loading = document.getElementById('apps-loading');
  const list    = document.getElementById('apps-list');
  const empty   = document.getElementById('apps-empty');
  if (loading) loading.classList.remove('hidden');
  if (list)    list.innerHTML = '';
  if (empty)   empty.classList.add('hidden');
  try {
    const res = await api('GET', `/api/forms/applications/${state.farmerId}`);
    if (loading) loading.classList.add('hidden');
    const statEl = document.getElementById('stat-applied');
    if (statEl) statEl.textContent = res.total;
    const totalEl = document.getElementById('apps-total');
    if (totalEl) totalEl.textContent = res.total;
    const prefilled = res.applications.filter(a => a.status === 'prefilled').length;
    const submitted = res.applications.filter(a => a.status === 'submitted').length;
    const prEl = document.getElementById('apps-prefilled');
    const suEl = document.getElementById('apps-submitted');
    if (prEl) prEl.textContent = prefilled;
    if (suEl) suEl.textContent = submitted;
    if (!res.total && empty) { empty.classList.remove('hidden'); return; }
    if (list) list.innerHTML = res.applications.map(a => `
      <div class="app-card-full">
        <div class="app-card-left">
          <div class="app-scheme-name">${a.scheme_name}</div>
          <div class="app-date">Applied: ${new Date(a.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</div>
        </div>
        <div class="app-card-right">
          <span class="app-status ${a.status}">${a.status.toUpperCase()}</span>
        </div>
      </div>`).join('');
  } catch (err) {
    if (loading) loading.classList.add('hidden');
    if (list) list.innerHTML = `<p class="empty-state">⚠️ Could not load applications.</p>`;
  }
}

// ── DOCUMENT UPLOAD (Registration form inline) ────────────────────────────
const regDocStore = {}; // { aadhaar: dataURL, land: dataURL, ... }

function handleRegDoc(docKey, input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    regDocStore[docKey] = e.target.result;
    // update to central store too
    if (!state.documents) state.documents = {};
    state.documents[docKey] = e.target.result;
    saveDocsToStorage();

    const status  = document.getElementById(`rdoc-status-${docKey}`);
    const preview = document.getElementById(`rdoc-preview-${docKey}`);
    const thumb   = document.getElementById(`rdoc-thumb-${docKey}`);
    const card    = document.getElementById(`rdoc-card-${docKey}`);
    if (status)  status.textContent  = '✅ ' + file.name.substring(0,20);
    if (card)    card.classList.add('uploaded');
    if (preview) preview.classList.remove('hidden');
    if (thumb && file.type.startsWith('image/')) thumb.src = e.target.result;
    else if (thumb) thumb.src = '';
    updateRegDocProgress();
  };
  reader.readAsDataURL(file);
}

function removeRegDoc(docKey) {
  delete regDocStore[docKey];
  if (state.documents) delete state.documents[docKey];
  saveDocsToStorage();
  const status  = document.getElementById(`rdoc-status-${docKey}`);
  const preview = document.getElementById(`rdoc-preview-${docKey}`);
  const card    = document.getElementById(`rdoc-card-${docKey}`);
  const input   = document.getElementById(`rdoc-${docKey}`);
  if (status)  status.textContent = 'Tap to upload';
  if (preview) preview.classList.add('hidden');
  if (card)    card.classList.remove('uploaded');
  if (input)   input.value = '';
  updateRegDocProgress();
}

function updateRegDocProgress() {
  const keys = ['aadhaar','land','bank','electricity'];
  const count = keys.filter(k => !!regDocStore[k]).length;
  const fill  = document.getElementById('rdoc-bar-fill');
  const label = document.getElementById('rdoc-bar-label');
  if (fill)  fill.style.width = (count / 4 * 100) + '%';
  if (label) label.textContent = `${count} of 4 documents uploaded (optional)`;
}

function saveDocsToStorage() {
  try { localStorage.setItem('kisan_docs', JSON.stringify(state.documents || {})); } catch { /* quota */ }
}

function loadDocsFromStorage() {
  try {
    const d = localStorage.getItem('kisan_docs');
    if (d) state.documents = JSON.parse(d);
  } catch { state.documents = {}; }
}

// ── EDIT PROFILE ──────────────────────────────────────────────────────────
function openEditProfile() {
  const f = state.farmer;
  if (!f) return;
  document.getElementById('edit-name').value   = f.full_name  || '';
  document.getElementById('edit-email').value  = f.email      || '';
  document.getElementById('edit-income').value = f.annual_income || '';
  document.getElementById('edit-land').value   = f.land_size_hectares || '';
  document.getElementById('edit-crop').value   = f.primary_crop || 'mixed';
  document.getElementById('edit-lang').value   = f.preferred_language || 'en';
  document.getElementById('edit-profile-msg').classList.add('hidden');
  document.getElementById('edit-profile-err').classList.add('hidden');
  document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfile() {
  document.getElementById('edit-profile-modal').classList.add('hidden');
}

function saveEditProfile() {
  // Save locally (no backend update endpoint, stored in localStorage)
  const f = state.farmer;
  if (!f) return;
  f.full_name          = document.getElementById('edit-name').value.trim()  || f.full_name;
  f.email              = document.getElementById('edit-email').value.trim() || f.email;
  f.annual_income      = parseFloat(document.getElementById('edit-income').value) || f.annual_income;
  f.land_size_hectares = parseFloat(document.getElementById('edit-land').value)   || f.land_size_hectares;
  f.primary_crop       = document.getElementById('edit-crop').value || f.primary_crop;
  f.preferred_language = document.getElementById('edit-lang').value || f.preferred_language;
  state.farmer = f;
  localStorage.setItem('kisan_farmer', JSON.stringify(f));
  setLang(f.preferred_language);
  renderProfile();
  updateDashboardGreeting();
  const msg = document.getElementById('edit-profile-msg');
  msg.textContent = '✅ Profile updated successfully!';
  msg.classList.remove('hidden');
  setTimeout(() => closeEditProfile(), 1800);
}

// ── LOGOUT ────────────────────────────────────────────────────────────────
function logoutFarmer() {
  if (!confirm('Are you sure you want to logout?')) return;
  localStorage.removeItem('kisan_farmer');
  localStorage.removeItem('kisan_docs');
  state.farmer = null;
  state.farmerId = null;
  state.documents = {};
  state.eligibilityResult = null;
  // Reset profile header actions
  const hdr = document.getElementById('profile-header-actions');
  if (hdr) hdr.style.display = 'none';
  showPage('register');
}

// ── VOICE CHAT (STT + TTS) ────────────────────────────────────────────────
let recognition = null;
let ttsEnabled  = true;
let isListening = false;

function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  document.getElementById('tts-label').textContent = ttsEnabled ? 'Voice ON' : 'Voice OFF';
  const btn = document.getElementById('tts-toggle');
  btn.style.opacity = ttsEnabled ? '1' : '0.45';
}

function toggleVoiceInput() {
  if (isListening) { stopVoiceInput(); return; }
  startVoiceInput();
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input is not supported in this browser. Please use Chrome.');
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = state.language === 'kn' ? 'kn-IN' : 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    isListening = true;
    document.getElementById('mic-btn').classList.add('mic-active');
    document.getElementById('voice-status').classList.remove('hidden');
    document.getElementById('voice-status-text').textContent = 'Listening... speak now';
  };

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    document.getElementById('chat-input').value = transcript;
    document.getElementById('voice-status-text').textContent = `Heard: "${transcript}"`;
    setTimeout(() => { sendChatMessage(); stopVoiceInput(); }, 400);
  };

  recognition.onerror = err => {
    document.getElementById('voice-status-text').textContent = `Error: ${err.error}. Try again.`;
    setTimeout(stopVoiceInput, 1500);
  };

  recognition.onend = () => stopVoiceInput();
  recognition.start();
}

function stopVoiceInput() {
  isListening = false;
  if (recognition) { try { recognition.stop(); } catch { } recognition = null; }
  const btn = document.getElementById('mic-btn');
  if (btn) btn.classList.remove('mic-active');
  const vs = document.getElementById('voice-status');
  if (vs) vs.classList.add('hidden');
}

function speakText(text) {
  if (!ttsEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = state.language === 'kn' ? 'kn-IN' : 'en-IN';
  utter.rate = 0.95;
  window.speechSynthesis.speak(utter);
}

// Patch sendChatMessage to call speakText on bot reply
const _origSendChat = sendChatMessage;
window.sendChatMessage = async function() {
  const inp = document.getElementById('chat-input');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  appendBubble(msg, 'user');
  appendBubble('...', 'bot', 'typing-indicator');
  try {
    const res = await api('POST', '/api/chat/', {
      message: msg,
      language: state.language,
      farmer_id: state.farmerId || null,
    });
    removeBubble('typing-indicator');
    const botBubble = appendBubble(res.reply, 'bot');
    speakText(res.reply);
    if (res.suggestions?.length) {
      const chips = document.createElement('div');
      chips.className = 'chat-suggestions';
      chips.innerHTML = res.suggestions.map(s =>
        `<button class="suggestion-chip" onclick="sendSuggestion('${s}')">${s}</button>`
      ).join('');
      botBubble.appendChild(chips);
    }
  } catch (err) {
    removeBubble('typing-indicator');
    appendBubble('⚠️ Cannot connect to AI server. Please start the backend.', 'bot');
  }
};

// end of app.js
