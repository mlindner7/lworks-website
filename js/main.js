// =============================================
// LWORKS CONFIG
// =============================================
const CONFIG = {
  emailjs: {
    publicKey: 'ojcDVPCld5mc6jCXf',
    serviceId: 'service_6ethcqb',
    templateId: 'template_xzp8oj7'
  },
  calendly: {
    base: 'https://calendly.com/mlindner7-lworksservices/',
    routes: {
      exterior: 'exterior-cleaning-services',
      lawn: 'lawn-care-services',
      auto: 'auto-service-appointment',
      additional: 'additional-services',
      multi: 'multi-service-appointment'
    }
  },
  cloudinary: {
    cloudName: 'ddqjlpl9l',
    uploadPreset: 'vc9tktd9'
  },
  facebook: 'https://www.facebook.com/profile.php?id=61588819520954'
};

// =============================================
// SERVICE CATALOG
// =============================================
const SERVICES = {
  exterior: {
    label: 'Exterior Cleaning',
    icon: 'window',
    color: '#29a9e0',
    items: [
      { id: 'win', name: 'Window Cleaning', desc: 'Exterior glass, frames & sills', low: { sm:80, md:120, lg:180, xl:280 }, high: { sm:140, md:200, lg:300, xl:420 } },
      { id: 'scr', name: 'Screen Cleaning', desc: 'All screens removed, washed, reinstalled', low: { sm:40, md:60, lg:90, xl:130 }, high: { sm:70, md:100, lg:150, xl:200 } },
      { id: 'gut', name: 'Gutter Cleaning', desc: 'Clear debris, flush downspouts', low: { sm:80, md:120, lg:180, xl:260 }, high: { sm:140, md:200, lg:300, xl:400 } },
      { id: 'prs', name: 'Pressure Washing', desc: 'Driveway, siding, deck, patio', low: { sm:80, md:140, lg:220, xl:340 }, high: { sm:150, md:250, lg:380, xl:580 } }
    ]
  },
  lawn: {
    label: 'Lawn Care',
    icon: '🌿',
    items: [
      { id: 'mow', name: 'Mowing (Trim & Blow)', desc: 'Full mow, edge trim, blowout', low: { sm:40, md:60, lg:90, xl:140 }, high: { sm:70, md:110, lg:160, xl:240 } },
      { id: 'prn', name: 'Pruning & Tree Trimming', desc: 'Shrubs, hedges, small trees', low: { sm:60, md:100, lg:160, xl:240 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'cln', name: 'Property Cleanup', desc: 'Leaf removal, debris hauling', low: { sm:60, md:100, lg:160, xl:260 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'wat', name: 'Plant Watering', desc: 'Garden beds, containers, planters', low: { sm:30, md:50, lg:70, xl:100 }, high: { sm:60, md:90, lg:130, xl:180 } }
    ]
  },
  auto: {
    label: 'Auto Services',
    icon: '🔧',
    items: [
      { id: 'oil', name: 'Oil Change', desc: 'Done in your driveway · parts billed separately', low: { sm:60, md:60, lg:60, xl:60 }, high: { sm:110, md:110, lg:110, xl:110 } },
      { id: 'brk', name: 'Disc Brake Service', desc: 'Done in your driveway · parts billed separately', low: { sm:120, md:120, lg:120, xl:120 }, high: { sm:280, md:280, lg:280, xl:280 } },
      { id: 'det', name: 'Light Interior Detailing', desc: 'Vacuum, wipe-down, interior windows & mats', low: { sm:80, md:100, lg:100, xl:100 }, high: { sm:180, md:200, lg:200, xl:200 } }
    ]
  },
  additional: {
    label: 'Additional Services',
    icon: '⚡',
    items: [
      { id: 'carp', name: 'Carpet Cleaning', desc: 'Interior rooms, quoted by room count', low: { sm:60, md:100, lg:160, xl:260 }, high: { sm:130, md:220, lg:360, xl:560 } },
      { id: 'haul', name: 'Local Hauling', desc: 'Junk removal, furniture, debris', low: { sm:75, md:100, lg:140, xl:200 }, high: { sm:150, md:220, lg:320, xl:500 } },
      { id: 'seas', name: 'Seasonal / Winter Services', desc: 'Snow removal, seasonal prep & cleanup', low: { sm:60, md:80, lg:120, xl:180 }, high: { sm:130, md:180, lg:280, xl:420 } },
      { id: 'other', name: 'Other / Custom Request', desc: "Describe what you need — we'll include it in your estimate", low: { sm:50, md:50, lg:50, xl:50 }, high: { sm:50, md:50, lg:50, xl:50 }, custom: true }
    ]
  }
};

// =============================================
// STATE
// =============================================
let selectedItems = {};
let propSize = 'md';
let propType = 'single';
let propStories = '1';
let carpetRooms = '2';
let haulLoad = 'partial';
let vehicleInfo = '';
let userData = {};
let photoFile = null;

// =============================================
// NAV
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelectorAll('#navLinks a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  buildCategoryBlocks();

  // Photo input is in static step 1 HTML — wire once on load
  const photoInput = document.getElementById('fphoto');
  if (photoInput) photoInput.addEventListener('change', handlePhotoUpload);
});

// =============================================
// STEP NAVIGATION
// =============================================
function goStep(n) {
  document.querySelectorAll('.sp').forEach((p, i) => p.classList.toggle('active', i + 1 === n));
  ['si1','si2','si3','si4'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('done','active','inactive');
    if (i + 1 < n) el.classList.add('done');
    else if (i + 1 === n) el.classList.add('active');
    else el.classList.add('inactive');
  });
  ['ln1','ln2','ln3'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.background = i + 1 < n ? '#2db54b' : '#e8ecf4';
  });
  window.scrollTo({ top: document.getElementById('estimate').offsetTop - 80, behavior: 'smooth' });
}

// =============================================
// STEP 1 — Service selection
// =============================================
function nextStep1() {
  if (Object.keys(selectedItems).length === 0) {
    alert('Please select at least one service to continue.');
    return;
  }
  buildStep2();
  goStep(2);
}

// =============================================
// STEP 2 — Dynamic property questions
// =============================================
function buildStep2() {
  const p2 = document.getElementById('p2');
  const cats = new Set(Object.values(selectedItems).map(v => v.catKey));
  const ids = new Set(Object.keys(selectedItems));

  const hasExterior = cats.has('exterior');
  const hasLawn = cats.has('lawn');
  const hasAuto = cats.has('auto');
  const hasCarp = ids.has('carp');
  const hasHaul = ids.has('haul');
  const hasSeas = ids.has('seas');
  const needsLot = hasExterior || hasLawn || hasSeas || hasCarp || hasHaul;

  let html = `
    <div class="ft">Tell us about your property</div>
    <div class="fh">Helps us give you the most accurate estimate.</div>`;

  if (needsLot) {
    html += `
    <div class="prop-lbl">Property / Lot Size</div>
    <div class="po" id="po-size">
      <div class="popt ${propSize==='sm'?'sel':''}" onclick="selProp(this,'size')" data-val="sm">Small<br><span style="font-size:10px;font-weight:400">Under ¼ acre</span></div>
      <div class="popt ${propSize==='md'?'sel':''}" onclick="selProp(this,'size')" data-val="md">Medium<br><span style="font-size:10px;font-weight:400">¼–½ acre</span></div>
      <div class="popt ${propSize==='lg'?'sel':''}" onclick="selProp(this,'size')" data-val="lg">Large<br><span style="font-size:10px;font-weight:400">½–1 acre</span></div>
      <div class="popt ${propSize==='xl'?'sel':''}" onclick="selProp(this,'size')" data-val="xl">Extra Large<br><span style="font-size:10px;font-weight:400">1+ acre</span></div>
    </div>

    <div class="prop-lbl">Home Type</div>
    <div class="po" id="po-type">
      <div class="popt ${propType==='single'?'sel':''}" onclick="selProp(this,'type')" data-val="single">Single Family</div>
      <div class="popt ${propType==='multi'?'sel':''}" onclick="selProp(this,'type')" data-val="multi">Multi-Family</div>
      <div class="popt ${propType==='condo'?'sel':''}" onclick="selProp(this,'type')" data-val="condo">Condo / Townhome</div>
      <div class="popt ${propType==='commercial'?'sel':''}" onclick="selProp(this,'type')" data-val="commercial">Commercial</div>
    </div>`;
  }

  if (hasExterior) {
    html += `
    <div class="prop-lbl">Number of Stories</div>
    <div class="po" id="po-stories">
      <div class="popt ${propStories==='1'?'sel':''}" onclick="selProp(this,'stories')" data-val="1">1 Story</div>
      <div class="popt ${propStories==='2'?'sel':''}" onclick="selProp(this,'stories')" data-val="2">2 Stories</div>
      <div class="popt ${propStories==='3'?'sel':''}" onclick="selProp(this,'stories')" data-val="3">3+ Stories</div>
    </div>`;
  }

  if (hasCarp) {
    html += `
    <div class="prop-lbl">How many rooms need carpet cleaning?</div>
    <div class="po" id="po-carpet">
      <div class="popt ${carpetRooms==='1'?'sel':''}" onclick="selProp(this,'carpet')" data-val="1">1 Room</div>
      <div class="popt ${carpetRooms==='2'?'sel':''}" onclick="selProp(this,'carpet')" data-val="2">2 Rooms</div>
      <div class="popt ${carpetRooms==='3'?'sel':''}" onclick="selProp(this,'carpet')" data-val="3">3 Rooms</div>
      <div class="popt ${carpetRooms==='4'?'sel':''}" onclick="selProp(this,'carpet')" data-val="4">4+ Rooms</div>
    </div>`;
  }

  if (hasHaul) {
    html += `
    <div class="prop-lbl">Haul Load Size</div>
    <div class="po" id="po-haul">
      <div class="popt ${haulLoad==='single'?'sel':''}" onclick="selProp(this,'haul')" data-val="single">Single Item<br><span style="font-size:10px;font-weight:400">Couch, appliance, etc.</span></div>
      <div class="popt ${haulLoad==='partial'?'sel':''}" onclick="selProp(this,'haul')" data-val="partial">Partial Load<br><span style="font-size:10px;font-weight:400">A few items</span></div>
      <div class="popt ${haulLoad==='full'?'sel':''}" onclick="selProp(this,'haul')" data-val="full">Full Load<br><span style="font-size:10px;font-weight:400">Van/truck full</span></div>
    </div>`;
  }

  if (hasAuto) {
    html += `
    <div class="prop-lbl">Vehicle(s) Being Serviced</div>
    <div class="form-group" style="margin-bottom:14px;">
      <input type="text" id="vehicleInput" placeholder="e.g. 2019 Honda Accord, 2021 Ford F-150" value="${vehicleInfo}" style="background:#fff;border:1.5px solid #d1d9e6;border-radius:8px;padding:10px 14px;color:var(--dk);font-size:13px;font-family:var(--fn);width:100%;" oninput="vehicleInfo=this.value"/>
    </div>`;
  }

  html += `
    <label class="prop-lbl" style="display:block;margin-top:16px;">Anything else we should know? <span style="font-weight:400;color:var(--mid)">(optional)</span></label>
    <textarea id="fnotes" placeholder="e.g. gate code, preferred timing, access notes…" style="margin-top:6px;"></textarea>

    <div class="fa">
      <button class="btn-back" onclick="goStep(1)">← Back</button>
      <button class="btn-primary" onclick="buildEstimate()">Get My Estimate →</button>
    </div>`;

  p2.innerHTML = html;
}

// =============================================
// STEP 3 — Build estimate
// =============================================
function buildCategoryBlocks() {
  const container = document.getElementById('catContainer');
  if (!container) return;

  Object.entries(SERVICES).forEach(([catKey, cat]) => {
    const block = document.createElement('div');
    block.className = 'cat-block';
    block.id = `cat-${catKey}`;

    const iconHTML = cat.icon === 'window'
      ? `<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="28" height="28" rx="3" stroke="#29a9e0" stroke-width="2.5"/>
          <line x1="16" y1="2" x2="16" y2="30" stroke="#29a9e0" stroke-width="2"/>
          <line x1="2" y1="16" x2="30" y2="16" stroke="#29a9e0" stroke-width="2"/>
          <path d="M9,9 L10.5,5.5 L12,9 L15.5,10.5 L12,12 L10.5,15.5 L9,12 L5.5,10.5 Z" fill="#29a9e0"/>
        </svg>`
      : `<span style="font-size:20px">${cat.icon}</span>`;

    block.innerHTML = `
      <div class="cat-header" onclick="toggleCat('${catKey}')">
        <div class="cat-icon">${iconHTML}</div>
        <div class="cat-title">
          <strong>${cat.label}</strong>
          <span>${cat.items.length} services available</span>
        </div>
        <span class="cat-sel-count" id="count-${catKey}">0 selected</span>
        <div class="cat-toggle">▼</div>
      </div>
      <div class="cat-items" id="items-${catKey}">
        ${cat.items.map(item => `
          <div class="item-row" id="row-${item.id}" onclick="toggleItem('${catKey}','${item.id}')">
            <div class="item-cb" id="cb-${item.id}"></div>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
              ${item.custom ? `<textarea id="custom-desc" onclick="event.stopPropagation()" placeholder="Briefly describe what you need…" style="margin-top:8px;width:100%;background:#f8f9fc;border:1.5px solid #d1d9e6;border-radius:8px;padding:8px 10px;font-size:12px;font-family:var(--fn);resize:vertical;min-height:52px;" rows="2"></textarea>` : ''}
            </div>
            <div class="item-price">${item.custom ? 'Custom' : 'from $' + item.low.md}</div>
          </div>
        `).join('')}
      </div>`;

    container.appendChild(block);
  });
}

function toggleCat(catKey) {
  document.getElementById(`cat-${catKey}`).classList.toggle('open');
}

function toggleItem(catKey, itemId) {
  const row = document.getElementById(`row-${itemId}`);
  const isSelected = row.classList.contains('sel');

  if (isSelected) {
    row.classList.remove('sel');
    delete selectedItems[itemId];
  } else {
    row.classList.add('sel');
    const item = SERVICES[catKey].items.find(i => i.id === itemId);
    selectedItems[itemId] = { catKey, item };
  }

  const catItems = Object.values(selectedItems).filter(v => v.catKey === catKey);
  const block = document.getElementById(`cat-${catKey}`);
  const countEl = document.getElementById(`count-${catKey}`);
  if (countEl) {
    countEl.textContent = `${catItems.length} selected`;
    block.classList.toggle('has-sel', catItems.length > 0);
  }

  const catCount = new Set(Object.values(selectedItems).map(v => v.catKey)).size;
  const bn = document.getElementById('bn');
  if (bn) bn.style.display = catCount >= 2 ? 'flex' : 'none';

  updateSelSummary();
}

function updateSelSummary() {
  const total = Object.keys(selectedItems).length;
  const summaryEl = document.getElementById('selSummary');
  if (summaryEl) {
    summaryEl.innerHTML = total > 0
      ? `<strong>${total} service${total > 1 ? 's' : ''}</strong> selected`
      : 'Select at least one service below';
  }
}

function nextStep2() {
  if (Object.keys(selectedItems).length === 0) {
    alert('Please select at least one service to continue.');
    return;
  }
  buildStep2();
  goStep(2);
}

function selProp(el, group) {
  const poId = { size: 'po-size', type: 'po-type', stories: 'po-stories', carpet: 'po-carpet', haul: 'po-haul' }[group];
  const container = document.getElementById(poId) || el.closest('.po');
  if (container) container.querySelectorAll('.popt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  if (group === 'size') propSize = el.dataset.val;
  if (group === 'type') propType = el.dataset.val;
  if (group === 'stories') propStories = el.dataset.val;
  if (group === 'carpet') carpetRooms = el.dataset.val;
  if (group === 'haul') haulLoad = el.dataset.val;
}

// =============================================
// STEP 4 — Build estimate
// =============================================
function buildEstimate() {
  const p3 = document.getElementById('p3');
  p3.innerHTML = `<div class="spin-wrap"><div class="spinner"></div><p style="color:var(--mid);font-size:13px;font-weight:600;margin-top:8px;">Building your estimate…</p></div>`;
  goStep(3);

  setTimeout(() => {
    const items = Object.values(selectedItems);
    const catGroups = {};
    let totalLow = 0, totalHigh = 0;

    const storiesMultiplier = { '1': 1, '2': 1.45, '3': 1.85 }[propStories] || 1;

    items.forEach(({ catKey, item }) => {
      let lo = item.low[propSize] || item.low.md;
      let hi = item.high[propSize] || item.high.md;

      if (catKey === 'exterior' && propStories !== '1') {
        lo = Math.round(lo * storiesMultiplier);
        hi = Math.round(hi * storiesMultiplier);
      }

      if (item.id === 'carp') {
        const roomFactor = { '1': 0.6, '2': 1, '3': 1.45, '4': 1.85 }[carpetRooms] || 1;
        lo = Math.round(lo * roomFactor);
        hi = Math.round(hi * roomFactor);
      }

      if (item.id === 'haul') {
        const haulFactor = { single: 0.7, partial: 1, full: 1.6 }[haulLoad] || 1;
        lo = Math.round(lo * haulFactor);
        hi = Math.round(hi * haulFactor);
      }

      totalLow += lo;
      totalHigh += hi;
      if (!catGroups[catKey]) catGroups[catKey] = [];
      catGroups[catKey].push({ name: item.name, lo, hi });
    });

    const catCount = Object.keys(catGroups).length;
    const itemCount = items.length;
    let discountLow = 0, discountHigh = 0;
    if (catCount >= 2 || itemCount >= 3) {
      const rate = catCount >= 3 ? 0.10 : 0.08;
      discountLow = Math.round(totalLow * rate);
      discountHigh = Math.round(totalHigh * rate);
      totalLow -= discountLow;
      totalHigh -= discountHigh;
    }

    const sizeLabels = { sm: 'Small lot (under ¼ acre)', md: 'Medium lot (¼–½ acre)', lg: 'Large lot (½–1 acre)', xl: 'Extra large (1+ acre)' };
    const typeLabels = { single: 'Single Family', multi: 'Multi-Family', condo: 'Condo/Townhome', commercial: 'Commercial' };

    const servicesText = items.map(i => i.item.name).join(', ');
    let breakdownRows = '';
    Object.entries(catGroups).forEach(([catKey, catItems]) => {
      breakdownRows += `<div class="ebd-cat">${SERVICES[catKey].label}</div>`;
      catItems.forEach(it => {
        breakdownRows += `<div class="el"><span class="el-name">${it.name}</span><span class="el-range">$${it.lo} – $${it.hi}</span></div>`;
      });
    });
    if (discountLow > 0) {
      breakdownRows += `<div class="el"><span class="el-name el-discount">🎉 Bundle & Save Discount</span><span class="el-range el-discount">-$${discountLow} – -$${discountHigh}</span></div>`;
    }
    breakdownRows += `<div class="el el-total"><span class="el-name">Estimated Total</span><span class="el-range">$${totalLow} – $${totalHigh}</span></div>`;

    const cats = Object.keys(catGroups);
    let calendlyRoute = CONFIG.calendly.base;
    calendlyRoute += cats.length > 1 ? CONFIG.calendly.routes.multi : (CONFIG.calendly.routes[cats[0]] || CONFIG.calendly.routes.multi);

    const customDesc = document.getElementById('custom-desc');
    const customText = customDesc ? customDesc.value.trim() : '';

    // Store estimate data for use in step 4
    window._estimateData = { calendlyRoute, servicesText, totalLow, totalHigh, discountLow, discountHigh, customText };

    p3.innerHTML = `
      <div class="result">
        <div class="chk">✓</div>
        <p style="color:var(--mid);font-size:13px;font-weight:600;margin-bottom:4px;">Your Estimate Range</p>
        <div class="er grad">$${totalLow} – $${totalHigh}</div>
        <p style="color:var(--mid);font-size:12px;margin-top:4px;">${items.length} service${items.length > 1 ? 's' : ''} · ${typeLabels[propType] || ''} · ${sizeLabels[propSize] || ''}</p>
        ${discountLow > 0 ? `<p style="color:#2db54b;font-size:12px;font-weight:700;margin-top:6px;">🎉 Bundle discount applied — saving $${discountLow}+</p>` : ''}

        <div class="est-breakdown">
          <div class="ebd-title">📋 Detailed Estimate Breakdown</div>
          ${breakdownRows}
        </div>

        <p class="en">This is a ballpark range — final price may vary based on property condition and exact scope. We'll confirm before any work begins. <strong>No deposit required to book.</strong></p>

        <div class="ecta">
          <h3>Like what you see?</h3>
          <p>Enter your info and we'll confirm the details and get you booked.</p>
          <div class="ecta-btns" style="margin-top:12px;">
            <button class="btn-white" onclick="goStep(4)">✅ Book This — Enter My Info →</button>
          </div>
        </div>

        <button onclick="resetTool()" style="background:none;border:none;color:var(--mid);font-size:13px;font-weight:700;cursor:pointer;padding:10px;margin-top:4px;">← Start Over</button>
      </div>`;
  }, 1800);
}

// =============================================
// STEP 4 — Collect info then fire EmailJS + Cloudinary
// =============================================
function selContactChip(el) {
  document.querySelectorAll('.contact-chip').forEach(c => {
    c.style.background = 'transparent';
    c.style.borderColor = 'var(--br)';
    c.style.color = 'var(--mid)';
    c.removeAttribute('data-selected');
  });
  el.style.background = 'rgba(91,47,201,.08)';
  el.style.borderColor = 'var(--p)';
  el.style.color = 'var(--p)';
  el.setAttribute('data-selected', 'true');
}

async function submitInfo() {
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const address = document.getElementById('faddress').value.trim();

  if (!fname || !lname || !email || !address) {
    alert('Please fill in your name, email, and service address to continue.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  userData = {
    firstName: fname,
    lastName: lname,
    email,
    phone: document.getElementById('fphone').value.trim(),
    address
  };

  const btn = document.getElementById('submitInfoBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const { calendlyRoute, servicesText, totalLow, totalHigh, discountLow, discountHigh, customText } = window._estimateData || {};
  const sizeLabels = { sm: 'Small lot (under ¼ acre)', md: 'Medium lot (¼–½ acre)', lg: 'Large lot (½–1 acre)', xl: 'Extra large (1+ acre)' };
  const typeLabels = { single: 'Single Family', multi: 'Multi-Family', condo: 'Condo/Townhome', commercial: 'Commercial' };
  const notes = document.getElementById('fnotes') ? document.getElementById('fnotes').value.trim() : '';

  // --- Cloudinary photo upload ---
  let photoUrl = 'No photo provided';
  if (photoFile) {
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('upload_preset', CONFIG.cloudinary.uploadPreset);
      formData.append('public_id', 'lworks_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.cloudinary.cloudName}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      photoUrl = data.secure_url || 'Upload failed';
    } catch (err) {
      console.error('Cloudinary error:', err);
      photoUrl = 'Upload error';
    }
  }

  // --- EmailJS send ---
  try {
    await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name: `${userData.firstName} ${userData.lastName}`,
      from_email: userData.email,
      phone: userData.phone || 'Not provided',
      address: userData.address,
      services: servicesText + (customText ? ` | Custom: ${customText}` : ''),
      property_size: sizeLabels[propSize] || 'N/A',
      property_type: typeLabels[propType] || 'N/A',
      stories: propStories ? `${propStories} story` : 'N/A',
      estimate_low: totalLow,
      estimate_high: totalHigh,
      bundle_discount: discountLow > 0 ? `$${discountLow}–$${discountHigh}` : 'None',
      contact_preference: document.querySelector('.contact-chip[data-selected]')?.dataset?.val || 'No preference',
      photo_url: photoUrl,
      carpet_rooms: carpetRooms ? `${carpetRooms} room(s)` : 'N/A',
      haul_load: haulLoad || 'N/A',
      vehicle: vehicleInfo || 'N/A',
      notes: notes
    });
  } catch (e) {
    console.error('EmailJS error:', e);
  }

  // Show success + Calendly link
  document.getElementById('p4').innerHTML = `
    <div class="result" style="text-align:center;padding:16px 0;">
      <div class="chk">✓</div>
      <div class="ft" style="margin-bottom:8px;">You're all set, ${userData.firstName}!</div>
      <p style="color:var(--mid);font-size:13px;margin-bottom:24px;">Your estimate has been sent to ${userData.email}. Pick a time below and we'll confirm everything before the job.</p>
      <a href="${calendlyRoute}" target="_blank" rel="noopener" class="btn-primary" style="margin-bottom:16px;">📅 Book My Appointment</a>
      <br/><br/>
      <button onclick="resetTool()" style="background:none;border:none;color:var(--mid);font-size:13px;font-weight:700;cursor:pointer;padding:10px;">← Start Over</button>
    </div>`;
}

// =============================================
// SPARKLE CLEANING LEAD FORM
// =============================================
function toggleSparkleForm() {
  const f = document.getElementById('sparkleForm');
  if (f) {
    f.classList.toggle('open');
    if (f.classList.contains('open')) f.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function submitSparkleLead() {
  const name = document.getElementById('spname').value.trim();
  const phone = document.getElementById('spphone').value.trim();
  const email = document.getElementById('spemail').value.trim();
  const address = document.getElementById('spaddress').value.trim();
  const notes = document.getElementById('spnotes').value.trim();
  const resultEl = document.getElementById('sparkleResult');

  if (!name || (!phone && !email) || !address) {
    resultEl.innerHTML = '<p style="color:#c0392b;font-size:12px;margin-top:10px;">Please enter your name, address, and at least a phone or email.</p>';
    return;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    resultEl.innerHTML = '<p style="color:#c0392b;font-size:12px;margin-top:10px;">Please enter a valid email address.</p>';
    return;
  }

  const btn = document.getElementById('sparkleSubmitBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name: name,
      from_email: email || 'Not provided',
      phone: phone || 'Not provided',
      address: address,
      services: 'Sparkle Cleaning — Free Walkthrough Requested',
      property_size: 'N/A',
      property_type: 'N/A',
      stories: 'N/A',
      estimate_low: 'TBD after walkthrough',
      estimate_high: 'TBD after walkthrough',
      bundle_discount: 'N/A',
      contact_preference: phone ? 'Phone' : 'Email',
      photo_url: 'N/A',
      carpet_rooms: 'N/A',
      haul_load: 'N/A',
      vehicle: 'N/A',
      notes: notes || 'No additional notes'
    });
    resultEl.innerHTML = '<p style="color:var(--g);font-size:12px;margin-top:10px;font-weight:700;">✓ Request sent! We\'ll reach out soon to schedule your free walkthrough.</p>';
    ['spname','spphone','spemail','spaddress','spnotes'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  } catch (e) {
    console.error('EmailJS error:', e);
    resultEl.innerHTML = '<p style="color:#c0392b;font-size:12px;margin-top:10px;">Something went wrong — please call/text us at (262) 225-1191 instead.</p>';
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Send My Request →'; }
}

// =============================================
// RESET
// =============================================
function resetTool() {
  selectedItems = {};
  propSize = 'md';
  propType = 'single';
  propStories = '1';
  carpetRooms = '2';
  haulLoad = 'partial';
  vehicleInfo = '';
  photoFile = null;
  userData = {};
  window._estimateData = null;

  document.querySelectorAll('.item-row').forEach(r => r.classList.remove('sel'));
  document.querySelectorAll('.cat-block').forEach(b => b.classList.remove('has-sel','open'));
  document.querySelectorAll('.cat-sel-count').forEach(el => el.textContent = '0 selected');

  const bn = document.getElementById('bn');
  if (bn) bn.style.display = 'none';

  const selSummary = document.getElementById('selSummary');
  if (selSummary) selSummary.innerHTML = 'Select at least one service below';

  // Clear step 4 inputs
  ['fname','lname','femail','fphone','faddress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Re-enable submit button if it was disabled
  const submitBtn = document.getElementById('submitInfoBtn');
  if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send My Estimate & Book →'; }

  goStep(1);
}

// =============================================
// PHOTO UPLOAD — stored in photoFile, never wiped
// =============================================
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  photoFile = file;

  const preview = document.getElementById('photoPreview');
  const thumb = document.getElementById('photoThumb');
  const label = document.getElementById('photoLabel');

  const reader = new FileReader();
  reader.onload = ev => {
    thumb.src = ev.target.result;
    preview.style.display = 'block';
    if (label) label.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function clearPhoto() {
  photoFile = null;
  const input = document.getElementById('fphoto');
  if (input) input.value = '';
  const preview = document.getElementById('photoPreview');
  if (preview) preview.style.display = 'none';
  const label = document.getElementById('photoLabel');
  if (label) label.style.display = 'flex';
  const thumb = document.getElementById('photoThumb');
  if (thumb) thumb.src = '';
}
