'use strict';

const operatorList = [
  { name: 'D-Wolf', role: 'Assault', note: 'บุกแนวหน้าและเคลื่อนที่เร็ว' },
  { name: 'Vyron', role: 'Assault', note: 'โจมตีและเข้าประชิด' },
  { name: 'Nox', role: 'Assault', note: 'จู่โจมแนวหน้า' },
  { name: 'Tempest', role: 'Assault', note: 'บุกและกดดันศัตรู' },
  { name: 'Stinger', role: 'Support', note: 'แพทย์สนามและช่วยทีม' },
  { name: 'Toxik', role: 'Support', note: 'สนับสนุนและควบคุมพื้นที่' },
  { name: 'Vlinder', role: 'Support', note: 'สนับสนุนเพื่อนร่วมทีม' },
  { name: 'Shepherd', role: 'Engineer', note: 'วิศวกรรมสนามรบ' },
  { name: 'Uluru', role: 'Engineer', note: 'อุปกรณ์และอาวุธยุทธวิธี' },
  { name: 'Sineva', role: 'Engineer', note: 'ป้องกันและบุก' },
  { name: 'Gizmo', role: 'Engineer', note: 'อุปกรณ์เทคนิค' },
  { name: 'Luna', role: 'Recon', note: 'สอดแนมและตรวจจับ' },
  { name: 'Hackclaw', role: 'Recon', note: 'ลอบเร้นและเข้าประชิด' },
  { name: 'Raptor', role: 'Recon', note: 'ตรวจจับเป้าหมาย' },
  { name: 'Morse', role: 'Recon', note: 'ลาดตระเวน' }
];

const weaponList = [
  ['AKS-74','Assault Rifle'], ['CAR-15','Assault Rifle'], ['QBZ95-1','Assault Rifle'],
  ['M4A1','Assault Rifle'], ['M16A4','Assault Rifle'], ['SG 552','Assault Rifle'],
  ['AK-12','Assault Rifle'], ['PTR-32','Assault Rifle'], ['AKM','Assault Rifle'],
  ['AS Val','Assault Rifle'], ['CI-19','Assault Rifle'], ['K416','Assault Rifle'],
  ['AUG','Assault Rifle'], ['K437','Assault Rifle'], ['KC17','Assault Rifle'],
  ['G3','Battle Rifle'], ['SCAR-H','Battle Rifle'], ['Ash-12','Battle Rifle'],
  ['M7','Battle Rifle'], ['MK47','Battle Rifle'], ['RCX-Spear','Battle Rifle'],
  ['UZI','SMG'], ['Bizon','SMG'], ['SMG-45','SMG'], ['MP5','SMG'],
  ['Vector','SMG'], ['MP7','SMG'], ['P90','SMG'], ['SR-3M','SMG'],
  ['Vityaz','SMG'], ['QCQ171','SMG'], ['K15','SMG'],
  ['M1014','Shotgun'], ['S12K','Shotgun'], ['M870','Shotgun'], ['725','Shotgun'],
  ['M249','LMG'], ['QJB 201','LMG'], ['PKM','LMG'], ['M250','LMG'],
  ['Mini-14','Marksman Rifle'], ['VSS','Marksman Rifle'], ['PSG-1','Marksman Rifle'],
  ['SVD','Marksman Rifle'], ['SR-25','Marksman Rifle'], ['SKS','Marksman Rifle'],
  ['M14','Marksman Rifle'], ['SR9','Marksman Rifle'],
  ['SV-98','Sniper Rifle'], ['R93','Sniper Rifle'], ['M700','Sniper Rifle'], ['AWM','Sniper Rifle'],
  ['G17','Pistol'], ['QSZ-92G','Pistol'], ['93R','Pistol'], ['Desert Eagle','Pistol'],
  ['G18','Pistol'], ['.357 Revolver','Pistol'], ['M1911','Pistol'],
  ['Compound Bow','Special']
];
const tierList = ['ขาว', 'เขียว', 'ฟ้า', 'ม่วง', 'ทอง', 'แดง'];
const budgetList = ['50k', '100k', '150k', '200k', '300k', '400k', '500k', '800k', '1M'];

const activeTimers = { operator: null, weapon: null, helmet: null, armor: null };
const isPressing = { operator: false, weapon: false, helmet: false, armor: false };
const spinning = { operator: false, weapon: false, helmet: false, armor: false };
const lastItems = { operator: null, weapon: null, helmet: null, armor: null };
const slotNames = { operator: 'Operator', weapon: 'ปืน', helmet: 'หมวก', armor: 'เกราะ' };

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}
function checkedValues(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`)).map(el => el.value);
}
function allowedItems(slot) {
  if (slot === 'operator') {
    const roles = checkedValues('operator-filters');
    return operatorList.filter(item => roles.includes(item.role));
  }
  if (slot === 'weapon') {
    const types = checkedValues('weapon-filters');
    return weaponList.filter(item => types.includes(item[1])).map(([name, type]) => ({ name, detail: type }));
  }
  const filterId = slot === 'helmet' ? 'helmet-filters' : 'armor-filters';
  return checkedValues(filterId).map(color => ({ name: color, detail: `ระดับ${color}` }));
}
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2100);
}
function colorForTier(tier) {
  return ({ 'ขาว': '#fffaf0', 'เขียว': '#a7f0b7', 'ฟ้า': '#a9e2ff', 'ม่วง': '#e1c2ff', 'ทอง': '#ffda79', 'แดง': '#ff9b9e' })[tier] || '';
}
function renderResult(slot, item) {
  lastItems[slot] = item;
  const name = document.getElementById(`${slot}-name`);
  const detail = document.getElementById(`${slot}-detail`);
  const status = document.querySelector(`[data-slot="${slot}"] .slot-status`);
  name.textContent = item.name;
  if (slot === 'operator') detail.textContent = `${item.role} · ${item.note}`;
  else detail.textContent = item.detail;
  if (slot === 'helmet' || slot === 'armor') {
    name.style.color = colorForTier(item.name);
    status.textContent = `TIER / ${item.name}`;
  } else {
    name.style.color = '';
    status.textContent = 'RESULT';
  }
}
function getPool(slot) {
  const pool = allowedItems(slot);
  if (!pool.length) {
    const message = slot === 'operator'
      ? 'เลือกสาย Operator อย่างน้อย 1 สายก่อน'
      : slot === 'weapon'
        ? 'เลือกประเภทปืนอย่างน้อย 1 ประเภทก่อน'
        : `เลือกระดับ${slot === 'helmet' ? 'หมวก' : 'เกราะ'}อย่างน้อย 1 สี`;
    showToast(message);
    return null;
  }
  return pool;
}
function oneSpin(slot) {
  const pool = getPool(slot);
  if (!pool) return;
  const card = document.querySelector(`[data-slot="${slot}"]`);
  card.classList.add('is-spinning');
  const button = document.querySelector(`[data-roll="${slot}"]`);
  button.disabled = true;
  let ticks = 0;
  const timer = setInterval(() => {
    renderResult(slot, pick(pool));
    ticks += 1;
    if (ticks >= 12) {
      clearInterval(timer);
      activeTimers[slot] = null;
      spinning[slot] = false;
      card.classList.remove('is-spinning');
      button.disabled = false;
      renderResult(slot, pick(pool));
    }
  }, 70);
  activeTimers[slot] = timer;
  spinning[slot] = true;
}
function stopHold(slot) {
  isPressing[slot] = false;
  if (activeTimers[slot]) {
    clearInterval(activeTimers[slot]);
    activeTimers[slot] = null;
  }
  spinning[slot] = false;
  const card = document.querySelector(`[data-slot="${slot}"]`);
  card.classList.remove('is-spinning');
  const button = document.querySelector(`[data-hold="${slot}"]`);
  button.classList.remove('is-pressing');
  button.setAttribute('aria-pressed', 'false');
  if (lastItems[slot]) {
    document.querySelector(`[data-slot="${slot}"] .slot-status`).textContent = 'RESULT';
  }
}
function startHold(slot, button) {
  if (isPressing[slot]) return;
  const pool = getPool(slot);
  if (!pool) return;
  isPressing[slot] = true;
  button.classList.add('is-pressing');
  button.setAttribute('aria-pressed', 'true');
  const card = document.querySelector(`[data-slot="${slot}"]`);
  card.classList.add('is-spinning');
  document.querySelector(`[data-slot="${slot}"] .slot-status`).textContent = 'ROLLING…';
  if (activeTimers[slot]) clearInterval(activeTimers[slot]);
  renderResult(slot, pick(pool));
  activeTimers[slot] = setInterval(() => {
    if (!isPressing[slot]) return;
    const latestPool = getPoolQuiet(slot);
    if (latestPool.length) renderResult(slot, pick(latestPool));
  }, 90);
}
function getPoolQuiet(slot) {
  if (slot === 'operator') {
    const roles = checkedValues('operator-filters');
    return operatorList.filter(item => roles.includes(item.role));
  }
  if (slot === 'weapon') {
    const types = checkedValues('weapon-filters');
    return weaponList.filter(item => types.includes(item[1])).map(([name, type]) => ({ name, detail: type }));
  }
  const id = slot === 'helmet' ? 'helmet-filters' : 'armor-filters';
  return checkedValues(id).map(color => ({ name: color, detail: `ระดับ${color}` }));
}
function spinAll() {
  let started = 0;
  ['operator', 'weapon', 'helmet', 'armor'].forEach(slot => {
    if (isPressing[slot]) return;
    if (activeTimers[slot]) {
      clearInterval(activeTimers[slot]);
      activeTimers[slot] = null;
    }
    spinning[slot] = false;
    oneSpin(slot);
    started += 1;
  });
  if (!started) showToast('กำลังกดค้างอยู่ทุกช่องแล้ว');
}

document.querySelectorAll('[data-roll]').forEach(button => {
  button.addEventListener('click', () => {
    const slot = button.dataset.roll;
    if (isPressing[slot]) return;
    if (activeTimers[slot]) return;
    oneSpin(slot);
  });
});
document.querySelectorAll('[data-hold]').forEach(button => {
  const slot = button.dataset.hold;
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    try { button.setPointerCapture(event.pointerId); } catch (_) {}
    startHold(slot, button);
  });
  button.addEventListener('pointerup', () => stopHold(slot));
  button.addEventListener('pointercancel', () => stopHold(slot));
  button.addEventListener('lostpointercapture', () => stopHold(slot));
  button.addEventListener('contextmenu', event => event.preventDefault());
});
document.querySelectorAll('[data-check-all]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll(`#${button.dataset.checkAll} input`).forEach(input => { input.checked = true; });
  });
});
document.querySelectorAll('[data-uncheck-all]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll(`#${button.dataset.uncheckAll} input`).forEach(input => { input.checked = false; });
  });
});
document.getElementById('spin-all').addEventListener('click', spinAll);
document.getElementById('roll-budget').addEventListener('click', () => {
  document.getElementById('budget').textContent = pick(budgetList);
});

// Allow the user to stop a hold if the pointer is released outside the button/window.
window.addEventListener('pointerup', () => {
  Object.keys(isPressing).forEach(slot => { if (isPressing[slot]) stopHold(slot); });
});
window.addEventListener('blur', () => {
  Object.keys(isPressing).forEach(slot => { if (isPressing[slot]) stopHold(slot); });
});
