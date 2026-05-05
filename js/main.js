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
      { id: 'win', name: 'Window Cleaning',    desc: 'Interior & exterior glass',               low: { sm:80,  md:120, lg:180, xl:280 }, high: { sm:140, md:200, lg:300, xl:420 } },
      { id: 'scr', name: 'Screen Cleaning',    desc: 'Removed, washed & reinstalled',           low: { sm:40,  md:60,  lg:90,  xl:130 }, high: { sm:70,  md:100, lg:150, xl:200 } },
      { id: 'gut', name: 'Gutter Cleaning',    desc: 'Clear debris, flush downspouts',          low: { sm:80,  md:120, lg:180, xl:260 }, high: { sm:140, md:200, lg:300, xl:400 } },
      { id: 'prs', name: 'Pressure Washing',   desc: 'Driveway, siding, deck or patio',        low: { sm:80,  md:140, lg:220, xl:340 }, high: { sm:150, md:250, lg:380, xl:580 } }
    ]
  },
  lawn: {
    label: 'Lawn Care',
    icon: '🌿',
    items: [
      { id: 'mow', name: 'Mowing',              desc: 'Full mow, edge trim & blowout',          low: { sm:40,  md:60,  lg:90,  xl:140 }, high: { sm:70,  md:110, lg:160, xl:240 } },
      { id: 'prn', name: 'Pruning & Trimming',  desc: 'Shrubs, hedges & small trees',           low: { sm:60,  md:100, lg:160, xl:240 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'cln', name: 'Property Cleanup',    desc: 'Leaf removal & debris hauling',          low: { sm:60,  md:100, lg:160, xl:260 }, high: { sm:120, md:200, lg:320, xl:480 } },
      { id: 'wat', name: 'Plant Watering',       desc: 'Garden beds, containers & planters',    low: { sm:30,  md:50,  lg:70,  xl:100 }, high: { sm:60,  md:90,  lg:130, xl:180 } }
    ]
  },
  auto: {
    label: 'Auto Services',
    icon: '🔧',
    items: [
      { id: 'oil', name: 'Oil Change',          desc: 'Conventional or synthetic, in your driveway', low: { sm:60,  md:60,  lg:60,  xl:60  }, high: { sm:110, md:110, lg:110, xl:110 } },
      { id: 'brk', name: 'Disc Brake Service', desc: 'Pads & rotors — parts quoted separately',      low: { sm:120, md:120, lg:120, xl:120 }, high: { sm:280, md:280, lg:280, xl:280 } },
      { id: 'det', name: 'Interior Detailing', desc: 'Vacuum, wipe-down, windows & mats',           low: { sm:80,  md:100, lg:100, xl:100 }, high: { sm:180, md:200, lg:200, xl:200 } }
    ]
  },
  additional: {
    label: 'Additional Services',
    icon: '⚡',
    items: [
      { id: 'carp', name: 'Carpet Cleaning',   desc: 'Rooms quoted by area',                   low: { sm:60,  md:100, lg:160, xl:260 }, high: { sm:130, md:220, lg:360, xl:560 } },
      { id: 'haul', name: 'Local Hauling',     desc: 'Junk removal, furniture & debris',       low: { sm:75,  md:100, lg:140, xl:200 }, high: { sm:150, md:220, lg:320, xl:500 } },
      { id: 'seas', name: 'Seasonal & Winter', desc: 'Snow removal & seasonal prep',           low: { sm:60,  md:80,  lg:120, xl:180 }, high: { sm:130, md:180, lg:280, xl:420 } },
      { id: 'othr', name: 'Other',             desc: 'Something else? Tell us what you need',  low: { sm:0,   md:0,   lg:0,   xl:0   }, high: { sm:0,   md:0,   lg:0,   xl:0   }, isOther: true }
    ]
  }
};

// =============================================
// STATE
// =============================================
let selectedItems = {};
let propSize = 'md';
let propType = 'single';
let userData = {};
let photoBase64 = null;
let otherServiceText = '';

// =============================================
// NAV
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('navHamburger');
  const links = document.getElementById('navLinks');
  if (hamburger && links) {
    hamburger.addEventListener('click', () => links.classList.toggle('open'));
    document.querySelectorAll('#navLinks a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  buildCategoryBlocks();
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
// STEP 1 — Contact info
// =============================================
function nextStep1() {
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('femail').value.trim();
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
    lastName:  lname,
    email:     email,
    phone:     document.getElementById('fphone').value.trim(),
    address:   address
  };
  goStep(2);
}

// =============================================
// STEP 2 — Category blocks
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

    const itemsHTML = cat.items.map(item => {
      if (item.isOther) {
        return `
          <div class="item-row" id="row-${item.id}" onclick="toggleItem('${catKey}','${item.id}')">
            <div class="item-cb" id="cb-${item.id}"></div>
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.desc}</div>
            </div>
            <div class="item-price" style="color:var(--lt);">custom</div>
          </div>
          <div class="other-input-wrap" id="other-input-wrap" style="display:none;padding:10px 18px 14px;background:#fafbfd;border-top:1px solid #f0f2f7;">
            <input type="text" id="otherServiceInput" placeholder="Describe what you need…"
              style="width:100%;background:#fff;border:1.5px solid #d1d9e6;border-radius:8px;padding:9px 13px;font-size:13px;font-family:var(--fn);color:var(--dk);"
              oninput="otherServiceText = this.value" onclick="event.stopPropagation()"/>
          </div>`;
      }
      return `
        <div class="item-row" id="row-${item.id}" onclick="toggleItem('${catKey}','${item.id}')">
          <div class="item-cb" id="cb-${item.id}"></div>
          <div class="item-info">
            <div class="item-name">${item.name}</div>
            <div class="item-desc">${item.desc}</div>
          </div>
          <div class="item-price">from $${item.low.md}</div>
        </div>`;
    }).join('');

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
      <div class="cat-items" id="items-${catKey}">${itemsHTML}</div>`;

    container.appendChild(block);
  });
}

function toggleCat(catKey) {
  document.getElementById(`cat-${catKey}`).classList.toggle('open');
}

function toggleItem(catKey, itemId) {
  const row = document.getElementById(`row-${itemId}`);
  const isSelected = row.classList.contains('sel');
  const item = SERVICES[catKey].items.find(i => i.id === itemId);

  if (isSelected) {
    row.classList.remove('sel');
    delete selectedItems[itemId];
    // Hide "Other" input if unchecking
    if (item.isOther) {
      const wrap = document.getElementById('other-input-wrap');
      if (wrap) wrap.style.display = 'none';
    }
  } else {
    row.classList.add('sel');
    selectedItems[itemId] = { catKey, item };
    // Show "Other" input if checking
    if (item.isOther) {
      const wrap = document.getElementById('other-input-wrap');
      if (wrap) wrap.style.display = 'block';
      setTimeout(() => document.getElementById('otherServiceInput')?.focus(), 50);
    }
  }

  // Update category count badge
  const catItems = Object.values(selectedItems).filter(v => v.catKey === catKey);
  const block = document.getElementById(`cat-${catKey}`);
  const countEl = document.getElementById(`count-${catKey}`);
  if (countEl) {
    countEl.textContent = `${catItems.length} selected`;
    block.classList.toggle('has-sel', catItems.length > 0);
  }

  // Bundle note
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
  goStep(3);
}

// =============================================
// STEP 3 — Property options
// =============================================
function selProp(el, group) {
  el.closest('.po').querySelectorAll('.popt').forEach(b => b.classList.remove('sel'));
  el.classList.add('sel');
  if (group === 'size') propSize = el.dataset.val;
  if (group === 'type') propType = el.dataset.val;
}

// =============================================
// STEP 4 — Build estimate + send emails
// =============================================
function buildEstimate() {
  const p4 = document.getElementById('p4');
  p4.innerHTML = `<div class="spin-wrap"><div class="spinner"></div><p style="color:var(--mid);font-size:13px;font-weight:600;margin-top:8px;">Building your estimate…</p></div>`;
  goStep(4);

  setTimeout(() => {
    const items      = Object.values(selectedItems);
    const catGroups  = {};
    let totalLow = 0, totalHigh = 0;
    const notes      = document.getElementById('fnotes')?.value.trim() || '';
    const hasOther   = !!selectedItems['othr'];

    items.forEach(({ catKey, item }) => {
      if (item.isOther) return; // exclude from pricing — it's quoted separately
      const lo = item.low[propSize]  || item.low.md;
      const hi = item.high[propSize] || item.high.md;
      totalLow  += lo;
      totalHigh += hi;
      if (!catGroups[catKey]) catGroups[catKey] = [];
      catGroups[catKey].push({ name: item.name, lo, hi });
    });

    // Bundle discount
    const catCount = Object.keys(catGroups).length;
    const pricedItemCount = items.filter(i => !i.item.isOther).length;
    let discountLow = 0, discountHigh = 0;
    if (catCount >= 2 || pricedItemCount >= 3) {
      const rate = catCount >= 3 ? 0.10 : 0.08;
      discountLow  = Math.round(totalLow  * rate);
      discountHigh = Math.round(totalHigh * rate);
      totalLow  -= discountLow;
      totalHigh -= discountHigh;
    }

    const sizeLabels = { sm: 'Small (under ¼ acre)', md: 'Medium (¼–½ acre)', lg: 'Large (½–1 acre)', xl: 'Extra large (1+ acre)' };
    const typeLabels = { single: 'Single Family', multi: 'Multi-Family', condo: 'Condo/Townhome', commercial: 'Commercial' };

    // Build breakdown HTML
    let breakdownRows = '';
    Object.entries(catGroups).forEach(([catKey, catItems]) => {
      breakdownRows += `<div class="ebd-cat">${SERVICES[catKey].label}</div>`;
      catItems.forEach(it => {
        breakdownRows += `<div class="el"><span class="el-name">${it.name}</span><span class="el-range">$${it.lo} – $${it.hi}</span></div>`;
      });
    });
    if (hasOther) {
      breakdownRows += `<div class="ebd-cat">Additional Services</div>`;
      breakdownRows += `<div class="el"><span class="el-name">Other: ${otherServiceText || 'Custom request'}</span><span class="el-range" style="color:var(--lt);">quoted separately</span></div>`;
    }
    if (discountLow > 0) {
      breakdownRows += `<div class="el"><span class="el-name el-discount">🎉 Bundle Discount</span><span class="el-range el-discount">–$${discountLow} – –$${discountHigh}</span></div>`;
    }

    const showRange = totalLow > 0;
    if (showRange) {
      breakdownRows += `<div class="el el-total"><span class="el-name">Estimated Total</span><span class="el-range">$${totalLow} – $${totalHigh}</span></div>`;
    } else {
      breakdownRows += `<div class="el el-total"><span class="el-name">Estimated Total</span><span class="el-range" style="color:var(--lt);">Custom quote — we'll follow up</span></div>`;
    }

    // Calendly routing
    const cats = Object.keys(catGroups);
    let calendlyRoute = CONFIG.calendly.base;
    if (cats.length > 1 || hasOther) {
      calendlyRoute += CONFIG.calendly.routes.multi;
    } else if (cats.length === 1) {
      calendlyRoute += CONFIG.calendly.routes[cats[0]] || CONFIG.calendly.routes.multi;
    } else {
      calendlyRoute += CONFIG.calendly.routes.additional; // "Other" only
    }

    // ---- Build email content ----
    const servicesList = items.map(({ item }) =>
      item.isOther
        ? `Other: ${otherServiceText || '(no description entered)'}`
        : item.name
    ).join(', ');

    const breakdownText = Object.entries(catGroups).map(([catKey, catItems]) =>
      `${SERVICES[catKey].label}:\n` + catItems.map(it => `  • ${it.name}: $${it.lo}–$${it.hi}`).join('\n')
    ).join('\n') + (hasOther ? `\nAdditional Services:\n  • Other: ${otherServiceText || 'Custom request'} (quoted separately)` : '');

    const photoNote = photoBase64
      ? '📷 Customer uploaded a photo — ask them to share it via reply or follow-up message.'
      : 'No photo uploaded.';

    // ---- Send owner email (full details) ----
    emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name:       `${userData.firstName} ${userData.lastName}`,
      from_email:      userData.email,
      phone:           userData.phone || 'Not provided',
      address:         userData.address,
      services:        servicesList,
      breakdown:       breakdownText,
      property_size:   sizeLabels[propSize],
      property_type:   typeLabels[propType],
      estimate_low:    showRange ? `$${totalLow}` : 'Custom quote',
      estimate_high:   showRange ? `$${totalHigh}` : 'Custom quote',
      bundle_discount: discountLow > 0 ? `–$${discountLow}–$${discountHigh}` : 'None',
      notes:           notes || 'None',
      photo_note:      photoNote
    }).catch(err => console.error('Owner email failed:', err));



    // ---- Render result ----
    const pricedCount = pricedItemCount + (hasOther ? 1 : 0);
    p4.innerHTML = `
      <div class="result">
        <div class="chk">✓</div>
        <p style="color:var(--mid);font-size:13px;font-weight:600;margin-bottom:4px;">Your Estimate Range</p>
        ${showRange
          ? `<div class="er grad">$${totalLow} – $${totalHigh}</div>`
          : `<div class="er grad" style="font-size:32px;">Custom Quote</div>`
        }
        <p style="color:var(--mid);font-size:12px;margin-top:4px;">${pricedCount} service${pricedCount !== 1 ? 's' : ''} · ${typeLabels[propType]} · ${sizeLabels[propSize]}</p>
        ${discountLow > 0 ? `<p style="color:#2db54b;font-size:12px;font-weight:700;margin-top:6px;">🎉 Bundle discount applied — saving $${discountLow}+</p>` : ''}

        <div class="est-breakdown">
          <div class="ebd-title">📋 Estimate Breakdown</div>
          ${breakdownRows}
        </div>

        <p class="en">This is a ballpark range based on your property details. Final price is confirmed before any work begins. <strong>No deposit required to book.</strong> A confirmation was sent to ${userData.email}.</p>

        <div class="ecta">
          <h3>Pick your date</h3>
          <p>Choose a time that works — we'll review your details and confirm everything before we show up.</p>
          <div class="ecta-btns">
            <a href="${calendlyRoute}" target="_blank" rel="noopener" class="btn-white">📅 Book My Appointment</a>
          </div>
        </div>

        <button onclick="resetTool()" style="background:none;border:none;color:var(--mid);font-size:13px;font-weight:700;cursor:pointer;padding:10px;margin-top:4px;">← Start Over</button>
      </div>`;
  }, 1400);
}

// =============================================
// RESET
// =============================================
function resetTool() {
  selectedItems = {};
  propSize = 'md';
  propType = 'single';
  userData = {};
  photoBase64 = null;
  otherServiceText = '';

  ['fname','lname','femail','fphone','faddress'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.querySelectorAll('.item-row').forEach(r => r.classList.remove('sel'));
  document.querySelectorAll('.cat-block').forEach(b => b.classList.remove('has-sel','open'));
  document.querySelectorAll('.cat-sel-count').forEach(el => el.textContent = '0 selected');

  const otherWrap = document.getElementById('other-input-wrap');
  if (otherWrap) otherWrap.style.display = 'none';
  const otherInput = document.getElementById('otherServiceInput');
  if (otherInput) otherInput.value = '';

  document.querySelector('.popt[data-val="md"]')?.classList.add('sel');
  document.querySelector('.popt[data-val="single"]')?.classList.add('sel');
  document.querySelectorAll('.popt:not([data-val="md"]):not([data-val="single"])').forEach(el => el.classList.remove('sel'));

  clearPhoto();
  const bn = document.getElementById('bn');
  if (bn) bn.style.display = 'none';

  goStep(1);
}

// =============================================
// PHOTO UPLOAD
// =============================================
function handlePhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    photoBase64 = e.target.result;
    document.getElementById('photoThumb').src = e.target.result;
    document.getElementById('photoPreview').style.display = 'block';
    document.getElementById('photoLabel').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function clearPhoto() {
  photoBase64 = null;
  const input = document.getElementById('fphoto');
  if (input) input.value = '';
  const preview = document.getElementById('photoPreview');
  if (preview) preview.style.display = 'none';
  const label = document.getElementById('photoLabel');
  if (label) label.style.display = 'flex';
  const thumb = document.getElementById('photoThumb');
  if (thumb) thumb.src = '';
}
