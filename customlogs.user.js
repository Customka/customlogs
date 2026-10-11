// ==UserScript==
// @name         CustomLogs — Rodina RP
// @namespace    customlogs.rodina
// @version      4.8.0
// @description  Пробив, Махинации, Вирты, огонёк дней, аккаунт, фон, кастомизация, обновления
// @match        https://rodina.logsparser.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js
// @downloadURL  https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js
// ==/UserScript==

(function () {
  'use strict';

  /* ================= НАСТРОЙКИ ================= */
  const VERSION = 'v4.8.0';
  const VERSION_NUM = '4.8.0';   // держи равным @version в заголовке
  const UPDATE_URL = 'https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js';
  const FIGURE = 'data:image/webp;base64,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';
  const LOGO = 'data:image/webp;base64,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';

  const IDLE_MS = 10 * 60 * 1000;        // сон Макимы после 10 минут бездействия
  const UPD_CHECK_MS = 30 * 60 * 1000;   // проверка обновлений раз в 30 минут
  const INACTIVE_DAYS = 30;              // предупреждение, если не заходил дольше
  const PROTECT_DAYS = 200;              // с огонька 200+ серия не сбрасывается
  const UPD_URGENT_DAYS = 1;             // через сколько дней обновление становится срочным
  const UPD_BLOCK_DAYS = 3;              // через сколько дней скрипт перестаёт работать
  const WARN_TEXT = 'Скрипт — неофициальное дополнение к сайту логов. Автор (Without Custom) не несёт ответственности за последствия его использования. Не злоупотребляй массовыми запросами, соблюдай правила сервера и не передавай свой аккаунт посторонним.';

  const MECH = {
    bigTransfer: 1000000,   // перевод от этой суммы (руб.)
    cheapCar: 100000,       // продажа транспорта ниже этой суммы (руб.)
    resourceSales: 15,      // продаж ресурсов за период у одного игрока
    barrels: 3,             // продаж бочек за период у одного игрока
  };

  const TIERS = [
    { d: 1, c: '#9ca3af', name: 'серый' },
    { d: 3, c: '#f97316', name: 'оранжевый' },
    { d: 10, c: '#ef4444', name: 'красно-оранжевый' },
    { d: 30, c: '#3b82f6', name: 'синий' },
    { d: 60, c: '#a855f7', name: 'фиолетовый' },
    { d: 100, c: '#f43f5e', name: 'розово-красный' },
    { d: 200, c: '#e2e8f0', name: 'серебряный' },
    { d: 365, c: '#94a3b8', name: 'стальной' },
    { d: 1000, c: 'inf', name: 'бесконечность' },
  ];

  const STOCK = [
    { n: 'Чёрный', c: '#000000' }, { n: 'Белый', c: '#ffffff' }, { n: 'Красный', c: '#ef4444' },
    { n: 'Синий', c: '#3b82f6' }, { n: 'Жёлтый', c: '#facc15' }, { n: 'Фиолетовый', c: '#8b5cf6' },
  ];

  const KEY = {
    btnPos: 'cl_btn_pos', panelPos: 'cl_panel_pos', bgUrl: 'cl_bg_url', bgOn: 'cl_bg_on',
    blur: 'cl_blur', theme: 'cl_theme', ipHide: 'cl_ip_hide', moneyHide: 'cl_money_hide',
    limit: 'cl_limit', limitOn: 'cl_limit_on', accounts: 'cl_accounts', session: 'cl_session',
    streak: 'cl_streak', avatar: 'cl_avatar', updRemote: 'cl_upd_remote',
    critical: 'cl_critical', outdated: 'cl_outdated',
  };
  const DEF = {
    btnPos: null, panelPos: null, bgUrl: '', bgOn: false, blur: 0, theme: {},
    ipHide: true, moneyHide: false, limit: 100, limitOn: false, accounts: {}, session: null,
    streak: { last: '', days: 0 }, avatar: '', updRemote: '', critical: false, outdated: null,
  };
  const THEME_DEF = { accent: '#8b5cf6', panel: '#0a0a0d', hover: '#8b5cf6' };
  const SERVERS = [
    ['501', 'Центральный'], ['502', 'Южный'], ['503', 'Северный'], ['504', 'Восточный'],
    ['505', 'Западный'], ['506', 'Приморский'], ['507', 'Федеральный'],
    ['601', 'Москва (Mobile)'], ['602', 'Санкт-Петербург (Mobile)'],
  ];
  const LIMITS = [100, 500, 1000];
  const MAX_DAYS = 62;
  const MAX_RENDER = 3000;
  const BTN_W = 56, BTN_H = 92;
  const DAY_MS = 86400000;
  const IP_ALL = /\b\d{1,3}(?:[.,]\d{1,3}){3}\b/g;
  const MONEY_DATA_RE = /I{1,2}:\s*[\d,]+(?:\s*\/\s*[\d,]+){3}/g;
  const MONEY_TXT_RE = /\d[\d ,]*\s*(?:руб\.?|денег)/g;

  const TRANSFER_RE = /(передал|перевел|отправил|перевод)/i;
  const SALE_RE = /(продал|продажа|продажу)/i;
  const CAR_RE = /(т\/с|транспорт|автомоб|машин|\bавто\b|ВАЗ|IVECO|Tesla|Ferrari|Porsche|Mitsubishi|BMW|Mercedes|Lada|Kia|Toyota|Nissan|Mazda|Hyundai|Audi)/i;
  const RES_RE = /(материал|камень|лён|укроп|руд|нефт|бочк|ресурс|дерев|металл|ткан|зерн|молок|мяс|рыб|золот|железо|уголь|бензин|топлив)/i;
  const BARREL_RE = /бочк/i;
  const EARN_RE = /(получил|заработал|выручк|продал|доход|выигрыш)/i;
  const SPEND_RE = /(потратил|оплатил|заплатил|штраф|купил|отдал|передал)/i;

  const MODES = {
    nick: { label: 'Ник игрока (Nick_Name)', ph: 'Kent_Dairo', ex: 'Пример: Kent_Dairo — все действия этого игрока за период' },
    kw: { label: 'Ключевое слово в строке', ph: 'PayPass', ex: 'Пример: PayPass — строки, где встречается это слово' },
    type: { label: 'Тип запроса из логов', ph: 'Получение приза PayPass', ex: 'Пример: начни писать и выбери тип из подсказок' },
  };
  /* ============================================ */

  /* Настройки читаем из Tampermonkey один раз и держим в памяти */
  const cache = {};
  const cfg = k => (k in cache ? cache[k] : (cache[k] = GM_getValue(KEY[k], DEF[k])));
  const setCfg = (k, v) => { cache[k] = v; GM_setValue(KEY[k], v); };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = n => String(n).padStart(2, '0');
  const fmtSite = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const toLocalInput = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayDiff = (a, b) => {
    const [y1, m1, d1] = a.split('-').map(Number);
    const [y2, m2, d2] = b.split('-').map(Number);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY_MS);
  };
  const serverName = n => (SERVERS.find(s => s[0] === n) || [])[1] || '';
  const getTheme = () => ({ ...THEME_DEF, ...cfg('theme') });
  const cmpVer = (a, b) => {
    const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d;
    }
    return 0;
  };
  const parseMoney = t => {
    const m = t.match(/(\d[\d ,]*)\s*(?:руб|денег)/i);
    return m ? Number(m[1].replace(/[ ,]/g, '')) || 0 : 0;
  };
  const whoOf = a => (a.match(/(?:Игрок|Игроку)\s+(\S+)/) || [])[1] || '?';
  const fmtPlain = v => `${Math.round(v).toLocaleString('ru-RU')} руб.`;
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hexLum = hex => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };

  /* Подсветка: никнеймы и суммы в результатах */
  function hl(text) {
    let s = esc(text);
    s = s.replace(/((?:Игрок|Игроку|Администратор)\s+)([^\s,.:;()\[\]<>]+)/g, (m, a, n) => `${a}<b class="nk">${n}</b>`);
    s = s.replace(/(\d[\d ,]*)(\s*(?:руб\.?|денег|AZ))/g, (m, a, b) => `<b class="mn">${a}${b}</b>`);
    return s;
  }
  const rowHtml = (date, html, cls = '') =>
    `<div class="r ${cls}"><span class="d">${esc(date)}</span><span class="t">${html}</span></div>`;
  const secHtml = (title, n) => `<div class="sec">${esc(title)}<i>${n}</i></div>`;
  const infoHtml = text => `<div class="info">${esc(text)}</div>`;
  const playerHtml = (who, text) =>
    `<div class="pl"><b class="nk">${esc(who)}</b><span>${esc(text)}</span></div>`;

  /* Огонёк */
  const tierOf = days => {
    let t = TIERS[0];
    for (const x of TIERS) if (days >= x.d) t = x;
    return t;
  };
  function touchStreak() {
    const today = dayKey(new Date());
    const st = cfg('streak') || {};
    if (st.last === today) return;
    let days = st.days || 0;
    if (!st.last) {
      days = 1;
    } else {
      const gap = dayDiff(st.last, today);
      if (gap === 1) days += 1;
      else if (days >= PROTECT_DAYS) days += 1;
      else days = 1;
    }
    setCfg('streak', { last: today, days });
  }
  function flameSvg(tier, size) {
    const id = 'fg' + tier.d;
    let fill = tier.c, defs = '', extra = '';
    if (tier.c === 'inf') {
      defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#60a5fa"/><stop offset=".5" stop-color="#f472b6"/>
        <stop offset="1" stop-color="#facc15"/></linearGradient></defs>`;
      fill = `url(#${id})`;
      extra = `<text x="12" y="15.5" font-size="8" font-weight="800" text-anchor="middle" fill="#fff">∞</text>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">${defs}
      <path fill="${fill}" d="M12 2c.6 3.4 5 5.7 5 11a5 5 0 0 1-10 0c0-2.3 1.1-3.9 2.3-5.1.2 1.7.9 2.8 2 3.4C11.2 7.6 11.4 4.7 12 2z"/>${extra}</svg>`;
  }

  /* Обновления */
  function updState() {
    const remote = cfg('updRemote');
    const outdated = !!remote && cmpVer(remote, VERSION_NUM) > 0;
    if (!outdated) return { remote, outdated: false, urgent: false, blocked: false, days: 0 };
    const rec = cfg('outdated');
    const days = rec && rec.ver === remote ? (Date.now() - rec.since) / DAY_MS : 0;
    const urgent = !!cfg('critical') || days >= UPD_URGENT_DAYS;
    const blocked = days >= UPD_BLOCK_DAYS;
    return { remote, outdated: true, urgent, blocked, days };
  }

  /* Аккаунт */
  function getAcc() {
    const k = cfg('session');
    const accs = cfg('accounts');
    return k && accs[k] ? { key: k, ...accs[k] } : null;
  }
  const isLogged = () => !!getAcc();
  const working = () => isLogged() && !updState().blocked;
  const saveAcc = (key, patch) => {
    const accs = cfg('accounts');
    accs[key] = { ...accs[key], ...patch };
    setCfg('accounts', accs);
  };
  const newSalt = () =>
    [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
  async function hashPass(pass, salt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pass));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const TAB_KEY = 'cl_tab_greeted';
  const tabGreeted = () => sessionStorage.getItem(TAB_KEY) === '1';
  const markGreeted = () => sessionStorage.setItem(TAB_KEY, '1');

  /* =========================================================
     САЙТ: оформление одним <style> и классами на body.
     ========================================================= */
  const siteStyle = document.createElement('style');
  siteStyle.id = 'cl-site';
  document.head.appendChild(siteStyle);

  function colIdx() {
    const row = document.querySelector('table tr');
    if (!row) return null;
    const ths = [...row.children];
    const find = test => {
      const i = ths.findIndex(c => test(c.textContent.replace(/\s+/g, ' ').trim().toLowerCase()));
      return i < 0 ? 0 : i + 1;
    };
    return {
      ip: find(t => /ip/.test(t) && /адрес/.test(t)),
      money: find(t => t.startsWith('данные')),
    };
  }

  function buildSiteCss(idx) {
    const blurShadow = '0 0 8px rgba(255,255,255,.9)';
    const fieldSelectors = [
      'form.filter input', 'form.filter select', 'form.filter textarea',
      'form.filter .form-control', 'form.filter .form-select',
      '.js_toolbar input', '.js_toolbar select', '.js_toolbar .form-select',
      '.select2-container', '.select2-container--default .select2-selection',
      '.select2-container--default .select2-selection--single',
      '.select2-container--default .select2-selection--multiple',
      '.select2-selection__rendered', '.select2-selection__arrow',
      '.select2-search__field',
    ].map(s => `body.cl-bg-on ${s}`).join(',\n');

    let css = `
      html:has(body.cl-bg-on), body.cl-bg-on, body.cl-bg-on html { background: transparent !important; }
      body.cl-bg-on :is(div,section,nav,main,table,thead,tbody,tr,td,th,.card,.card-body,
        .navbar,.app-sidebar,.app-content,.app-content-body,.app-nav,.dropdown-menu,.modal-content,
        .bg-white,.bg-dark,.bg-light,.shadow-sm) {
        background-color: transparent !important; background-image: none !important; box-shadow: none !important; }
      body.cl-bg-on :is(td,th,label,h1,h2,h3,h4,h5,p,.navbar,.navbar-brand,.nav-link,.dropdown-item,
        .app-nav-menu__item-link,.app-content-body-title,.table-description,.text-muted,span) { color: #fff !important; }

      ${fieldSelectors} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        color: #fff !important;
        -webkit-text-fill-color: #fff !important;
        border: 1px solid rgba(255,255,255,.35) !important;
        box-shadow: none !important;
        border-radius: 4px !important;
      }
      body.cl-bg-on .select2-container,
      body.cl-bg-on .select2-selection__rendered,
      body.cl-bg-on .select2-selection__arrow,
      body.cl-bg-on .select2-search__field {
        border: none !important;
        box-shadow: none !important;
      }
      body.cl-bg-on .select2-selection__placeholder { color: rgba(255,255,255,.65) !important; }
      body.cl-bg-on .select2-selection__choice {
        background: rgba(255,255,255,.18) !important; border: 1px solid rgba(255,255,255,.4) !important;
        color: #fff !important; }
      body.cl-bg-on .select2-selection__choice__remove { color: #fff !important; }
      body.cl-bg-on .select2-dropdown { background: #1b1530 !important; border-color: rgba(255,255,255,.3) !important; }
      body.cl-bg-on .select2-results__option { background: transparent !important; color: #fff !important; }
      body.cl-bg-on .select2-results__option--highlighted { background: rgba(255,255,255,.15) !important; }
      body.cl-bg-on .select2-container--default .select2-results__option[aria-selected=true] { background: rgba(255,255,255,.08) !important; }
      body.cl-bg-on .select2-search__field { color: #fff !important; }
      body.cl-bg-on form.filter ::placeholder { color: rgba(255,255,255,.6) !important; }
      body.cl-bg-on form.filter option, body.cl-bg-on select option { background: #1b1530 !important; color: #fff !important; }

      body.cl-bg-on .pagination .page-link,
      body.cl-bg-on .pagination .page-item > span,
      body.cl-bg-on .page-link {
        background: transparent !important; background-color: transparent !important;
        color: #fff !important; border: 1px solid rgba(255,255,255,.45) !important; box-shadow: none !important; }
      body.cl-bg-on .pagination .page-item.active .page-link,
      body.cl-bg-on .pagination .page-item.active > span {
        background-color: #c0392b !important; border-color: #c0392b !important; color: #fff !important; }
      body.cl-bg-on .pagination .page-item.disabled .page-link { color: rgba(255,255,255,.4) !important; }

      body.cl-ip-hide .table-ip, body.cl-ip-hide .table-ip * {
        color: transparent !important; text-shadow: ${blurShadow} !important; pointer-events: none !important; }`;
    if (idx && idx.ip) css += `
      body.cl-ip-hide table tr > :nth-child(${idx.ip}), body.cl-ip-hide table tr > :nth-child(${idx.ip}) * {
        color: transparent !important; text-shadow: ${blurShadow} !important;
        pointer-events: none !important; user-select: none !important; }`;
    if (idx && idx.money) css += `
      body.cl-money-hide table tr > :nth-child(${idx.money}) { display: none !important; }`;
    return css;
  }

  let lastIdx = null;
  function syncBody() {
    const on = working();
    document.body.classList.toggle('cl-bg-on', on && cfg('bgOn') && !!cfg('bgUrl'));
    document.body.classList.toggle('cl-ip-hide', on && cfg('ipHide'));
    document.body.classList.toggle('cl-money-hide', on && cfg('moneyHide'));
  }
  function syncSite(force) {
    syncBody();
    const idx = colIdx();
    const key = idx ? `${idx.ip}|${idx.money}` : '';
    if (force || key !== lastIdx) {
      lastIdx = key;
      siteStyle.textContent = buildSiteCss(idx);
    }
  }

  const bgHost = document.createElement('div');
  bgHost.id = 'cl-bg-host';
  bgHost.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;display:none';
  document.body.appendChild(bgHost);
  const bgRoot = bgHost.attachShadow({ mode: 'open' });
  bgRoot.innerHTML = `<div id="layer" style="position:fixed;inset:-20px;background-size:cover;
    background-position:center;background-repeat:no-repeat;will-change:filter"></div>`;

  function applyBg() {
    const url = cfg('bgUrl');
    const on = working() && cfg('bgOn') && !!url;
    const layer = bgRoot.getElementById('layer');
    layer.style.backgroundImage = on ? `url("${url}")` : 'none';
    layer.style.filter = cfg('blur') ? `blur(${cfg('blur')}px)` : 'none';
    bgHost.style.display = on ? 'block' : 'none';
    syncSite(true);
  }

  /* =========================================================
     ИНТЕРФЕЙС СКРИПТА: Shadow DOM
     ========================================================= */
  const uiHost = document.createElement('div');
  uiHost.id = 'cl-ui-host';
  uiHost.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483646';
  document.body.appendChild(uiHost);
  const ui = uiHost.attachShadow({ mode: 'open' });
  const q = s => ui.querySelector(s);
  const qa = (s, r = ui) => [...r.querySelectorAll(s)];

  let panel, btn, bubble;
  let busy = false;
  let pMode = 'nick';
  let typeOpts = [];
  let sayTimer = null;
  let pending = null;
  let sleeping = false;

  const CSS = `
  :host{--cl-accent:#8b5cf6;--cl-panel:#0a0a0d;--cl-hover:#8b5cf6;--cl-text:#ebe8f5;--cl-muted:#9b93b5;
    --cl-head:#ffffff;--cl-field-bg:rgba(0,0,0,.35);--cl-field-text:#f4f1fb;
    --cl-ok:#22c55e;--cl-off:#ef4444;--cl-warn:#f59e0b;--cl-ease:cubic-bezier(.16,1,.3,1);
    font:15px/1.6 'Segoe UI Variable Text','Segoe UI',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;
    letter-spacing:.1px}
  button,input,select,textarea{font:inherit;color:inherit}
  @keyframes clPane{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes clFade{from{opacity:0}to{opacity:1}}
  @keyframes clIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
  @keyframes clPulseOk{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.55)}50%{box-shadow:0 0 0 7px rgba(34,197,94,0)}}
  @keyframes clPulseOff{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
  @keyframes clPulseWarn{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.6)}50%{box-shadow:0 0 0 7px rgba(245,158,11,0)}}
  @keyframes clBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes clZ{0%{opacity:0;transform:translate(0,0) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translate(14px,-24px) scale(1)}}
  @keyframes clFall{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(560px) rotate(200deg)}}
  *{box-sizing:border-box}

  #cl-btn{position:fixed;top:120px;right:24px;width:${BTN_W}px;cursor:pointer;user-select:none;touch-action:none;transition:transform .35s var(--cl-ease)}
  #cl-btn:hover{transform:translateY(-2px)}
  #cl-btn img{display:block;width:${BTN_W}px;height:auto;pointer-events:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6));transition:filter .4s}
  #cl-btn.sleep img{animation:clBob 3s ease-in-out infinite;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)) brightness(.7)}
  #cl-btn.upd-yellow::after,#cl-btn.upd-red::after{content:'';position:absolute;top:0;right:0;width:14px;height:14px;border-radius:50%;
    box-shadow:0 0 0 2px #000;animation:clPulseWarn 2s infinite}
  #cl-btn.upd-yellow::after{background:var(--cl-warn)}
  #cl-btn.upd-red::after{background:var(--cl-off);animation:clPulseOff 2s infinite}
  #cl-btn.alt{cursor:move}
  #cl-btn.dragging{cursor:grabbing}
  .cl-zzz{position:absolute;left:44px;top:-6px;pointer-events:none;display:none;font:800 14px/1 'Segoe UI',sans-serif;color:#c4b5fd}
  .cl-zzz span{position:absolute;animation:clZ 2.4s ease-in infinite;opacity:0}
  .cl-zzz span:nth-child(2){animation-delay:.8s;font-size:11px}
  .cl-zzz span:nth-child(3){animation-delay:1.6s;font-size:9px}
  #cl-btn.sleep .cl-zzz{display:block}
  .cl-bubble{position:absolute;white-space:nowrap;pointer-events:none;display:flex;align-items:center;gap:9px;max-width:340px;
    padding:10px 14px;border-radius:12px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 55%,transparent);box-shadow:0 8px 24px rgba(0,0,0,.6);
    font-size:13px;font-weight:600;line-height:1.45;opacity:0;visibility:hidden;transform:translateY(4px);
    transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  .cl-bubble.show{opacity:1;visibility:visible;transform:none;transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}
  .cl-bubble[data-pos=top]{bottom:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=bottom]{top:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=left]{right:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  .cl-bubble[data-pos=right]{left:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  #cl-bubble-text{white-space:pre-line}
  .cl-dot{width:9px;height:9px;border-radius:50%;flex:0 0 9px}
  .cl-dot.ok{background:var(--cl-ok);animation:clPulseOk 2s infinite}
  .cl-dot.off{background:var(--cl-off);animation:clPulseOff 2s infinite}
  .cl-dot.warn{background:var(--cl-warn);animation:clPulseWarn 2s infinite}

  #cl-warn{position:fixed;inset:0;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.6);backdrop-filter:blur(3px);z-index:2147483647}
  #cl-warn.open{display:flex;animation:clFade .35s var(--cl-ease)}
  .cl-warn-box{width:min(460px,92vw);padding:28px;border-radius:18px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 50%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.8);
    text-align:center;animation:clIn .4s var(--cl-ease)}
  .cl-warn-ico{width:52px;height:52px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:26px;font-weight:800;background:color-mix(in srgb,var(--cl-warn) 22%,transparent);color:var(--cl-warn)}
  .cl-warn-box h3{margin:0 0 10px;color:var(--cl-head);font-size:19px}
  .cl-warn-box p{margin:0 0 18px;color:var(--cl-muted);font-size:14px;line-height:1.6}

  #cl-panel{position:fixed;width:min(1040px,96vw);height:min(580px,86vh);max-width:calc(100vw - 16px);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);background:var(--cl-panel);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);border-radius:20px;
    box-shadow:0 30px 80px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transform:translateY(14px) scale(.97);
    transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  #cl-panel.open{opacity:1;visibility:visible;transform:none;transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}

  .cl-head{display:flex;align-items:center;justify-content:space-between;padding:13px 22px;cursor:move;user-select:none;
    background:color-mix(in srgb,var(--cl-panel) 80%,#000);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .cl-title{display:flex;align-items:center;gap:10px}
  .cl-title b{font-size:16px;font-weight:700;color:var(--cl-head);letter-spacing:.3px}
  .cl-title > span{font-size:13px;color:var(--cl-muted)}
  .cl-beta{font:700 10px/1 'Segoe UI',sans-serif;letter-spacing:1px;padding:4px 7px;border-radius:6px;font-style:normal;background:var(--cl-accent);color:#fff}
  .cl-ver{font:600 12px/1 Consolas,monospace;color:var(--cl-muted);padding:4px 7px;border-radius:6px;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-x{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-muted);
    transition:background .3s,color .3s,transform .4s var(--cl-ease)}
  .cl-x:hover{background:color-mix(in srgb,var(--cl-hover) 30%,transparent);color:var(--cl-text);transform:rotate(90deg)}
  .cl-main{flex:1;display:flex;min-height:0}
  .cl-nav{width:200px;padding:14px 12px;display:flex;flex-direction:column;gap:6px;
    background:color-mix(in srgb,var(--cl-panel) 85%,#000);border-right:1px solid color-mix(in srgb,var(--cl-accent) 18%,transparent);overflow:auto}
  .cl-tab{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:11px;cursor:pointer;color:var(--cl-muted);font-weight:600;
    transition:background .35s var(--cl-ease),color .35s var(--cl-ease),transform .35s var(--cl-ease)}
  .cl-tab svg{width:18px;height:18px;flex:0 0 18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .cl-tab:hover{background:color-mix(in srgb,var(--cl-hover) 25%,transparent);color:var(--cl-text);transform:translateX(3px)}
  .cl-tab.act{background:color-mix(in srgb,var(--cl-accent) 22%,transparent);color:var(--cl-text);box-shadow:inset 3px 0 0 var(--cl-accent)}
  .cl-tab.upd::after{content:'NEW';margin-left:auto;font:700 10px/1 'Segoe UI',sans-serif;padding:3px 6px;border-radius:6px;background:var(--cl-warn);color:#111}
  .cl-body{flex:1;padding:20px 24px;overflow:auto;min-width:0;display:flex;flex-direction:column}
  .cl-pane{display:none}
  .cl-pane.act{display:block;animation:clPane .55s var(--cl-ease)}
  #cl-panel:not(.logged) .cl-nav{display:none}
  #cl-panel:not(.logged) .cl-pane{display:none!important}
  #cl-panel:not(.logged) .cl-pane[data-pane=auth]{display:block!important;animation:clPane .55s var(--cl-ease)}
  #cl-panel.logged .cl-pane[data-pane=auth]{display:none!important}
  #cl-panel.blocked .cl-tab:not([data-tab=update]){display:none}
  #cl-panel.blocked .cl-pane:not([data-pane=update]){display:none!important}

  .cl-pane.act.cl-home{display:flex;flex-direction:column;flex:1;min-height:0;position:relative;overflow:hidden}
  .cl-rain{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
  .cl-drop-logo{position:absolute;top:-50px;opacity:.4;animation-name:clFall;animation-timing-function:linear;animation-iteration-count:infinite}
  .cl-hero{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px}
  .cl-hero h2{margin:0 0 14px;font-size:36px;font-weight:800;line-height:1.2;color:var(--cl-head);letter-spacing:.2px}
  .cl-hero h2 em{font-style:normal;color:var(--cl-accent)}
  .cl-hero p{margin:0 0 26px;color:var(--cl-muted);font-size:17px}
  .cl-status{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;
    background:color-mix(in srgb,var(--cl-panel) 70%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);font-weight:600;font-size:14px}
  .cl-foot{position:relative;z-index:1;text-align:center;color:var(--cl-muted);font-size:13px;padding-top:14px;letter-spacing:.3px}

  .cl-prof{display:flex;align-items:center;gap:22px;padding:18px 22px;border-radius:18px;
    background:color-mix(in srgb,var(--cl-text) 4%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);margin-bottom:14px}
  .cl-avatar{width:96px;height:96px;border-radius:50%;overflow:hidden;flex:0 0 96px;
    border:2px solid color-mix(in srgb,var(--cl-accent) 60%,transparent);background:#050507}
  .cl-avatar img{width:100%;height:100%;object-fit:cover;display:block}
  .cl-pinfo{display:flex;flex-direction:column;gap:10px;min-width:0}
  .cl-nick{font-size:24px;font-weight:700;color:var(--cl-head);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cl-streak{display:flex;align-items:center;gap:14px}
  .cl-streak b{font-size:24px;color:var(--cl-head)}
  .cl-streak > div > span{color:var(--cl-muted);font-size:14px}
  .cl-tiername{color:var(--cl-text);font-size:13px;font-weight:600;margin-top:2px}
  .cl-next{color:var(--cl-muted);font-size:13px}
  .cl-srv{color:var(--cl-muted);font-size:14px}
  .cl-verbig{font-size:32px;font-weight:800;color:var(--cl-head);margin:4px 0 8px}

  .cl-card{background:color-mix(in srgb,var(--cl-text) 3%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);
    border-radius:16px;padding:14px 18px;margin-top:12px;transition:border-color .45s var(--cl-ease)}
  .cl-card:hover{border-color:color-mix(in srgb,var(--cl-accent) 40%,transparent)}
  .cl-sec{font-weight:700;color:var(--cl-head);margin-bottom:8px;font-size:14px;letter-spacing:.2px}
  .cl-lbl{display:block;margin:12px 0 6px;color:var(--cl-muted);font-size:13px}
  .cl-lbl:first-child{margin-top:0}
  .cl-in{width:100%;padding:10px 13px;border-radius:10px;border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);
    background:var(--cl-field-bg);color:var(--cl-field-text);outline:none;transition:border-color .35s,box-shadow .35s;font-size:15px}
  .cl-in:focus{border-color:var(--cl-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cl-accent) 22%,transparent)}
  .cl-in::placeholder{color:var(--cl-muted);opacity:.8}
  .cl-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 4px;cursor:pointer;color:var(--cl-text);font-size:15px}
  .cl-sw input{appearance:none;width:42px;height:23px;border-radius:999px;background:color-mix(in srgb,var(--cl-text) 18%,transparent);position:relative;cursor:pointer;transition:background .4s var(--cl-ease);flex:0 0 42px}
  .cl-sw input::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:left .4s var(--cl-ease)}
  .cl-sw input:checked{background:var(--cl-accent)}
  .cl-sw input:checked::after{left:22px}
  .cl-range{width:100%;accent-color:var(--cl-accent);margin:8px 0 2px}
  .cl-seg{display:flex;gap:8px;margin:8px 0 6px}
  .cl-seg label{flex:1;text-align:center;padding:10px 0;border-radius:11px;border:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent);
    background:var(--cl-field-bg);cursor:pointer;color:var(--cl-text);font-weight:600;transition:all .35s var(--cl-ease)}
  .cl-seg label:hover{background:color-mix(in srgb,var(--cl-hover) 28%,transparent);border-color:var(--cl-accent)}
  .cl-seg input{display:none}
  .cl-seg label:has(input:checked){background:var(--cl-accent);border-color:var(--cl-accent);color:#fff}

  .cl-btnp{width:100%;margin-top:10px;padding:11px 14px;border:1px solid transparent;border-radius:11px;cursor:pointer;color:#fff;font-weight:600;font-size:15px;
    background:var(--cl-accent);transition:background .35s var(--cl-ease),border-color .35s,color .35s,transform .3s var(--cl-ease),box-shadow .35s}
  .cl-btnp:hover{background:color-mix(in srgb,var(--cl-hover) 32%,transparent);border-color:var(--cl-accent);color:var(--cl-text);
    transform:translateY(-1px);box-shadow:0 6px 18px color-mix(in srgb,var(--cl-hover) 25%,transparent)}
  .cl-btnp:active{transform:scale(.98)}
  .cl-btnp:disabled{opacity:.5;cursor:default;transform:none}
  .cl-btnp.sec{background:color-mix(in srgb,var(--cl-text) 6%,transparent);border-color:color-mix(in srgb,var(--cl-accent) 35%,transparent);color:var(--cl-text)}
  .cl-btnp.small{width:auto;padding:9px 16px;margin-top:0}
  .cl-msg{margin-top:12px;color:var(--cl-accent);font-size:14px;min-height:18px;font-weight:600}
  .cl-auth{max-width:400px;margin:0 auto;padding-top:12px}
  .cl-auth h2{margin:0 0 4px;font-size:24px;color:var(--cl-head)}
  .cl-auth .cl-hint{margin:0 0 16px;color:var(--cl-muted);font-size:14px}
  .cl-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .cl-row .cl-btnp{margin-top:8px}
  .cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .cl-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
  .cl-hint2{color:var(--cl-muted);font-size:13px;margin-top:8px}

  .cl-drop{margin-top:10px;border:1.5px dashed color-mix(in srgb,var(--cl-accent) 55%,transparent);border-radius:14px;padding:18px;
    display:flex;align-items:center;gap:14px;cursor:pointer;outline:none;transition:all .35s var(--cl-ease);background:color-mix(in srgb,var(--cl-text) 2%,transparent)}
  .cl-drop:hover,.cl-drop:focus,.cl-drop.drag{border-style:solid;border-color:var(--cl-accent);background:color-mix(in srgb,var(--cl-hover) 22%,transparent);transform:translateY(-1px)}
  .cl-drop-ico{width:44px;height:44px;flex:0 0 44px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    background:color-mix(in srgb,var(--cl-accent) 22%,transparent);color:var(--cl-text);font-size:22px;font-weight:700}
  .cl-drop b{display:block;color:var(--cl-head);font-size:15px}
  .cl-drop span{display:block;color:var(--cl-muted);font-size:13px;margin-top:2px}
  .cl-urlrow{display:flex;gap:8px;margin-top:10px;align-items:stretch}
  .cl-urlrow .cl-in{flex:1}
  .cl-urlrow .cl-btnp{width:auto;margin-top:0;padding:10px 16px;white-space:nowrap}
  .cl-prev{width:100%;height:170px;border-radius:14px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;
    background:color-mix(in srgb,var(--cl-text) 4%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);
    background-size:cover;background-position:center}
  .cl-prev img{max-width:100%;max-height:100%;object-fit:contain}
  .cl-prev-empty{color:var(--cl-muted);font-size:14px}
  .cl-avprev{width:150px;height:150px;border-radius:50%;overflow:hidden;margin:0 auto 4px;border:2px solid color-mix(in srgb,var(--cl-accent) 55%,transparent)}
  .cl-avprev img{width:100%;height:100%;object-fit:cover;display:block}
  .cl-acc-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
  .cl-acc-title{font-size:20px;font-weight:700;color:var(--cl-head)}

  .cl-modes{display:flex;gap:8px;margin:12px 0 4px;flex-wrap:wrap}
  .cl-mode{flex:1;min-width:150px;text-align:center;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:600;color:var(--cl-muted);
    border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-mode:hover{background:color-mix(in srgb,var(--cl-hover) 28%,transparent);color:var(--cl-text);border-color:var(--cl-accent)}
  .cl-mode.act{background:var(--cl-accent);border-color:var(--cl-accent);color:#fff;box-shadow:0 6px 18px color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-subtabs{display:flex;gap:8px;margin-bottom:4px}
  .cl-subtab{flex:1;text-align:center;padding:12px 0;border-radius:13px;cursor:pointer;font-weight:700;color:var(--cl-muted);
    border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);transition:all .4s var(--cl-ease)}
  .cl-subtab:hover{background:color-mix(in srgb,var(--cl-hover) 28%,transparent);color:var(--cl-text);border-color:var(--cl-accent)}
  .cl-subtab.act{background:var(--cl-accent);border-color:var(--cl-accent);color:#fff;box-shadow:0 6px 18px color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-sub{display:none}
  .cl-sub.act{display:block;animation:clPane .45s var(--cl-ease)}

  .cl-swatches{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
  .cl-sw-c{width:38px;height:38px;border-radius:50%;cursor:pointer;position:relative;overflow:hidden;padding:0;
    border:2px solid color-mix(in srgb,var(--cl-text) 22%,transparent);transition:transform .3s var(--cl-ease),box-shadow .3s}
  .cl-sw-c:hover{transform:scale(1.12);box-shadow:0 0 0 4px color-mix(in srgb,var(--cl-hover) 35%,transparent)}
  .cl-sw-c.on{box-shadow:0 0 0 3px var(--cl-panel),0 0 0 5px var(--cl-accent)}
  .cl-sw-custom{background:conic-gradient(#ef4444,#facc15,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)}
  .cl-sw-custom input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0;padding:0}

  .cl-lock{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;min-height:300px}
  .cl-lock-ico{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;
    background:color-mix(in srgb,var(--cl-accent) 18%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 40%,transparent)}
  .cl-lock h2{margin:0;font-size:26px;color:var(--cl-head)}
  .cl-lock p{margin:0;color:var(--cl-muted);font-size:15px}

  .cl-offer h2{margin:0 0 6px;font-size:24px;color:var(--cl-head);text-align:center}
  .cl-offer .cl-hint{margin:0 0 14px;color:var(--cl-muted);font-size:15px;text-align:center}
  .cl-list{margin:0 auto 10px;padding-left:20px;color:var(--cl-text);max-width:420px;font-size:15px}
  .cl-list li{margin:6px 0}
  .cl-offer .cl-card{text-align:center}
  .cl-offer .cl-sec{text-align:center}
  .cl-contacts{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:10px}
  .cl-link{display:inline-block;min-width:300px;text-align:center;padding:11px 18px;border-radius:12px;text-decoration:none;
    color:var(--cl-text);font-weight:600;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);
    background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-link:hover{background:color-mix(in srgb,var(--cl-hover) 30%,transparent);border-color:var(--cl-accent);transform:translateY(-1px);
    box-shadow:0 6px 18px color-mix(in srgb,var(--cl-hover) 25%,transparent)}

  #cl-win{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.98);width:min(980px,92vw);height:min(640px,84vh);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);border-radius:18px;background:var(--cl-panel);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s .45s}
  #cl-win.open{opacity:1;visibility:visible;transform:translate(-50%,-50%);transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s}
  #cl-win .cl-head{cursor:default}
  .cl-wbody{overflow:auto;flex:1;padding:0 0 14px;font-size:15px;line-height:1.6;color:var(--cl-text)}
  .r{display:grid;grid-template-columns:178px 1fr;gap:16px;padding:10px 22px;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 12%,transparent);transition:background .25s}
  .r:hover{background:color-mix(in srgb,var(--cl-hover) 22%,transparent)}
  .d{color:var(--cl-muted);font:13px/1.8 Consolas,monospace;padding-top:1px}
  .t{word-break:break-word}
  .nk{color:color-mix(in srgb,var(--cl-accent) 55%,#fff);font-weight:700}
  .mn{color:#facc15;font-weight:700}
  .r.earn .t{color:var(--cl-text)}
  .plus{color:#4ade80;font-weight:700;margin-left:6px}
  .minus{color:#f87171;font-weight:700;margin-left:6px}
  .sec{position:sticky;top:0;z-index:1;display:flex;justify-content:space-between;align-items:center;padding:11px 22px;
    font-weight:700;color:var(--cl-head);background:var(--cl-panel);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .sec i{font-style:normal;color:var(--cl-muted);font-weight:600}
  .pl{display:flex;gap:12px;align-items:center;padding:10px 22px;background:color-mix(in srgb,var(--cl-accent) 10%,transparent);
    border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 12%,transparent)}
  .pl span{color:var(--cl-muted)}
  .info{padding:24px 22px;color:var(--cl-muted);text-align:center}
  .sum{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px 22px}
  .sum div{background:color-mix(in srgb,var(--cl-accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);border-radius:14px;padding:14px 16px}
  .sum span{display:block;color:var(--cl-muted);font-size:14px}
  .sum b{font-size:20px;color:var(--cl-head)}
  .sum .earn{color:#4ade80}
  .sum .spend{color:#f87171}
  `;

  const ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    look: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    brush: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>',
    gauge: '<svg viewBox="0 0 24 24"><path d="M3.3 17a9 9 0 1 1 17.4 0"/><path d="M12 14l4-4"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    upd: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
  };

  /* ---------- Тема ---------- */
  function applyTheme() {
    const t = getTheme();
    const light = hexLum(t.panel) > 0.6;
    const set = (k, v) => uiHost.style.setProperty(k, v);
    set('--cl-accent', t.accent);
    set('--cl-panel', t.panel);
    set('--cl-hover', t.hover);
    set('--cl-text', light ? '#14121c' : '#ebe8f5');
    set('--cl-muted', light ? '#5b5670' : '#9b93b5');
    set('--cl-head', light ? '#0b0a12' : '#ffffff');
    set('--cl-field-bg', light ? 'rgba(0,0,0,.05)' : 'rgba(0,0,0,.35)');
    set('--cl-field-text', light ? '#14121c' : '#f4f1fb');
  }
  function saveTheme(patch) {
    setCfg('theme', { ...getTheme(), ...patch });
    applyTheme();
  }

  /* ---------- Реплики Макимы ---------- */
  const DOT = { ok: 'ok', warn: 'warn', red: 'off' };
  function placeBubble() {
    const r = btn.getBoundingClientRect();
    const space = { top: r.top, bottom: innerHeight - r.bottom, left: r.left, right: innerWidth - r.right };
    bubble.dataset.pos = Object.keys(space).sort((a, b) => space[b] - space[a])[0];
  }
  function say(text, kind = 'ok', ms = 5000) {
    clearTimeout(sayTimer);
    q('#cl-bubble-text').textContent = text;
    q('#cl-bubble-dot').className = 'cl-dot ' + DOT[kind];
    placeBubble();
    bubble.classList.add('show');
    if (ms > 0) sayTimer = setTimeout(() => bubble.classList.remove('show'), ms);
  }
  function sayOrDefer(fn) {
    if (q('#cl-warn').classList.contains('open')) pending = fn;
    else fn();
  }
  const greetText = nick => `Охае, ${nick}!\nСкрипт запущен и готов к работе`;

  function goSleep() {
    if (sleeping) return;
    sleeping = true;
    btn.classList.add('sleep');
    say('Zzz… сплю, двигай мышкой, чтобы разбудить', 'red', 0);
  }
  function wakeUp() {
    if (!sleeping) return;
    sleeping = false;
    btn.classList.remove('sleep');
    say('Снова готова к работе!', 'ok', 4000);
  }

  /* ---------- Статусы и профиль ---------- */
  function renderStatus() {
    const s = updState();
    let kind = 'ok', text = 'Скрипт активирован готов к работе';
    if (s.blocked) { kind = 'red'; text = 'Скрипт остановлен, установи обновление'; }
    else if (!isLogged()) { kind = 'red'; text = 'Скрипт не активирован, войди в аккаунт'; }
    else if (s.urgent && s.outdated) { kind = 'red'; text = 'Срочно установи обновление'; }
    else if (s.outdated) { kind = 'warn'; text = 'Доступно обновление'; }
    q('#cl-status-dot').className = 'cl-dot ' + DOT[kind];
    q('#cl-status-text').textContent = text;
  }

  function renderProfile() {
    const days = (cfg('streak') || {}).days || 0;
    const t = tierOf(days);
    const nt = TIERS.find(x => x.d > days);
    q('#cl-flame').innerHTML = flameSvg(t, 54);
    q('#cl-days').textContent = days;
    q('#cl-tiername').textContent = `Огонёк: ${t.name}`;
    q('#cl-nexttier').textContent = nt ? `До следующего огонька: ${nt.d - days} дн.` : 'Максимальный огонёк';
  }

  function renderAvatar() {
    const src = cfg('avatar') || FIGURE;
    q('#cl-avimg').src = src;
    q('#cl-av-prev').src = src;
  }

  function renderBgPreview() {
    const u = cfg('bgUrl');
    const el = q('#cl-bg-prev');
    el.style.backgroundImage = u ? `url("${u}")` : 'none';
    q('#cl-bg-empty').style.display = u ? 'none' : 'block';
    q('#cl-bgon').checked = !!cfg('bgOn') && !!u;
  }

  function renderAuth() {
    const acc = getAcc();
    panel.classList.toggle('logged', !!acc);
    q('#cl-pnick').textContent = acc ? acc.nick : 'Гость';
    q('#cl-pserver').textContent = acc
      ? `Сервер ${acc.server} · ${serverName(acc.server)}`
      : 'Войди, чтобы пользоваться скриптом';
    if (acc) q('#cl-acc-server').value = acc.server;
    renderProfile();
    renderStatus();
    renderAvatar();
  }

  /* ---------- Обновления ---------- */
  function fetchRemote() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: UPDATE_URL + '?t=' + Date.now(),
        nocache: true,
        onload: r => (r.status === 200 ? resolve(r.responseText) : reject(new Error('HTTP ' + r.status))),
        onerror: () => reject(new Error('нет связи с GitHub')),
      });
    });
  }

  function announceUpdate(s) {
    if (!s.outdated) return;
    const level = s.blocked ? 'blocked' : s.urgent ? 'urgent' : 'yellow';
    const tag = `${s.remote}:${level}`;
    if (sessionStorage.getItem('cl_said') === tag) return;
    sessionStorage.setItem('cl_said', tag);
    const text = level === 'blocked'
      ? 'Скрипт остановлен. Нажми на меня и установи обновление'
      : level === 'urgent'
        ? 'Срочно установи обновление, без него работа скрипта будет остановлена'
        : 'Датебаешечки, у нас появилось обновки, зацени во вкладке «Обновление»';
    const kind = level === 'yellow' ? 'warn' : 'red';
    sayOrDefer(() => say(text, kind, 8000));
  }

  function refreshUpdate(announce) {
    const s = updState();
    btn.classList.toggle('upd-yellow', s.outdated && !s.urgent);
    btn.classList.toggle('upd-red', s.outdated && s.urgent);
    panel.classList.toggle('blocked', s.blocked);
    q('.cl-tab[data-tab="update"]').classList.toggle('upd', s.outdated);
    q('#cl-upd-remote').textContent = s.outdated
      ? `Доступная версия: v${s.remote} — ${s.blocked ? 'скрипт остановлен, установи обновление' : s.urgent ? 'срочное обновление' : 'есть обновление'}`
      : (s.remote ? `Доступная версия: v${s.remote} — у тебя актуальная` : 'Доступная версия: неизвестно');
    renderStatus();
    if (announce) announceUpdate(s);
  }

  async function checkUpdate(manual) {
    const msg = q('#cl-upd-msg');
    if (manual) msg.textContent = 'Проверяю…';
    try {
      const text = await fetchRemote();
      const m = text.match(/@version\s+([\d.]+)/);
      if (!m) throw new Error('версия не найдена в файле');
      const remote = m[1];
      setCfg('updRemote', remote);
      setCfg('critical', /@critical\b/.test(text.slice(0, 2000)));
      const rec = cfg('outdated');
      if (cmpVer(remote, VERSION_NUM) > 0) {
        if (!rec || rec.ver !== remote) setCfg('outdated', { ver: remote, since: Date.now() });
      } else if (rec) {
        setCfg('outdated', null);
      }
      refreshUpdate(true);
      if (manual) {
        msg.textContent = cmpVer(remote, VERSION_NUM) > 0
          ? `Есть обновление: ${VERSION_NUM} → ${remote}. Нажми «Установить обновление».`
          : `У тебя последняя версия (${VERSION_NUM}).`;
      }
    } catch (e) {
      if (manual) msg.textContent = 'Не удалось проверить: ' + e.message;
    }
  }

  /* ---------- Лимит строк ---------- */
  function applyLimit() {
    if (!working() || !cfg('limitOn')) return;
    const sel = document.querySelector('select[name="limit"]');
    if (!sel) return;
    const want = String(cfg('limit'));
    if (sel.value === want) { sessionStorage.removeItem('cl_lim_tries'); return; }
    const tries = +(sessionStorage.getItem('cl_lim_tries') || 0);
    if (tries >= 2) return;
    sessionStorage.setItem('cl_lim_tries', String(tries + 1));
    const url = new URL(location.href);
    url.searchParams.set('limit', want);
    location.href = url.toString();
  }

  /* ---------- Запросы к логам ---------- */
  function buildWindows(fromV, toV) {
    if (!fromV || !toV) return { err: 'Укажи период' };
    const from = new Date(fromV), to = new Date(toV);
    if (!(from < to)) return { err: 'Период «от» должен быть раньше «до»' };
    const w = [];
    for (let t = from.getTime(); t < to.getTime(); t += DAY_MS) {
      w.push([new Date(t), new Date(Math.min(t + DAY_MS - 1000, to.getTime()))]);
    }
    if (w.length > MAX_DAYS) return { err: `Максимум ${MAX_DAYS} дней за один запрос` };
    return { windows: w.reverse() };
  }

  async function fetchDay(acc, win, nick, type) {
    const p = new URLSearchParams();
    p.set('server_number', acc.server);
    p.set('min_period', fmtSite(win[0]));
    p.set('max_period', fmtSite(win[1]));
    p.set('limit', '1000');
    p.set('sort', 'desc');
    if (nick) p.set('player', nick);
    if (type) p.append('type[]', type);
    const res = await fetch(`${location.pathname}?${p.toString()}`, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    return [...doc.querySelectorAll('table tbody tr')]
      .map(tr => {
        const tds = [...tr.children];
        return {
          time: (tds[0] ? tds[0].textContent : '').replace(/\s+/g, ' ').trim(),
          action: (tds[1] ? tds[1].textContent : '').replace(/\s+/g, ' ').trim(),
          full: tr.textContent.replace(/\s+/g, ' ').trim(),
        };
      })
      .filter(r => r.full);
  }

  // Приватность применяется только в Пробиве (IP и деньги в тексте строки)
  function maskText(t) {
    let out = t;
    if (cfg('ipHide')) out = out.replace(IP_ALL, '•••.•••.•••.•••');
    if (cfg('moneyHide')) out = out.replace(MONEY_TXT_RE, 'скрыто');
    return out;
  }

  function gate() {
    if (!isLogged()) return 'Сначала войди в аккаунт';
    if (updState().blocked) return 'Скрипт остановлен: установи обновление во вкладке «Обновление»';
    return '';
  }

  function showResults(title, html) {
    const w = q('#cl-win');
    q('#cl-wtitle').textContent = title;
    q('.cl-wbody', w).innerHTML = html;
    w.classList.add('open');
  }

  /* ---------- Пробив ---------- */
  function setMode(m) {
    pMode = m;
    qa('.cl-mode').forEach(x => x.classList.toggle('act', x.dataset.mode === m));
    const c = MODES[m];
    q('#cl-p-qlabel').textContent = c.label;
    q('#cl-p-q').placeholder = c.ph;
    q('#cl-p-q').value = '';
    q('#cl-p-ex').textContent = c.ex;
    if (m === 'type') q('#cl-p-q').setAttribute('list', 'cl-p-types');
    else q('#cl-p-q').removeAttribute('list');
  }

  async function runProbiv() {
    const msg = s => { q('#cl-msg').textContent = s; };
    const g = gate(); if (g) return msg(g);
    if (busy) return;
    const acc = getAcc();
    const raw = q('#cl-p-q').value.trim();
    let typeCode = '';
    if (pMode === 'type') {
      const low = raw.toLowerCase();
      const opt = typeOpts.find(o => o.label.toLowerCase() === low)
        || typeOpts.find(o => low && o.label.toLowerCase().includes(low));
      if (!opt) return msg('Выбери тип из подсказок (начни писать и выбери из списка)');
      typeCode = opt.value;
    } else if (!raw) {
      return msg('Введи запрос');
    }
    const bw = buildWindows(q('#cl-p-from').value, q('#cl-p-to').value);
    if (bw.err) return msg(bw.err);

    const nickParam = pMode === 'nick' ? raw : '';
    const nickF = pMode === 'nick' ? raw.toLowerCase() : '';
    const kwF = pMode === 'kw' ? raw.toLowerCase() : '';

    busy = true;
    const blocks = [];
    let count = 0, capped = 0;
    try {
      for (let i = 0; i < bw.windows.length; i++) {
        msg(`Пробив: день ${i + 1} из ${bw.windows.length}, найдено: ${count}…`);
        const rows = await fetchDay(acc, bw.windows[i], nickParam, typeCode);
        if (rows.length >= 1000) capped++;
        for (const r of rows) {
          const low = r.full.toLowerCase();
          if (nickF && !low.includes(nickF)) continue;
          if (kwF && !low.includes(kwF)) continue;
          count++;
          if (count <= MAX_RENDER) blocks.push(rowHtml(r.time, hl(maskText(r.action))));
        }
      }
      msg(`Готово: найдено ${count} строк` + (capped ? `. Лимит 1000 достигнут в ${capped} дн., сузь период` : ''));
      showResults(`Пробив: найдено ${count}`, blocks.join('') || infoHtml('Ничего не найдено'));
    } catch (e) {
      msg('Ошибка загрузки: ' + e.message);
    } finally {
      busy = false;
    }
  }

  /* ---------- Махинации ---------- */
  async function runMechanic() {
    const msg = s => { q('#cl-msg').textContent = s; };
    const g = gate(); if (g) return msg(g);
    if (busy) return;
    const acc = getAcc();
    const bw = buildWindows(q('#cl-m-from').value, q('#cl-m-to').value);
    if (bw.err) return msg(bw.err);

    busy = true;
    const big = [], cheap = [];
    const stat = {};
    const st = who => (stat[who] ||= { sales: [], barrels: [] });
    try {
      for (let i = 0; i < bw.windows.length; i++) {
        msg(`Махинации: день ${i + 1} из ${bw.windows.length}…`);
        const rows = await fetchDay(acc, bw.windows[i], '', '');
        for (const r of rows) {
          const a = r.action;
          const who = whoOf(a);
          const amount = parseMoney(a);
          if (TRANSFER_RE.test(a) && amount >= MECH.bigTransfer) {
            big.push({ time: r.time, action: a });
          }
          if (SALE_RE.test(a) && CAR_RE.test(a) && amount > 0 && amount < MECH.cheapCar) {
            cheap.push({ time: r.time, action: a });
          }
          if (who !== '?') {
            if (SALE_RE.test(a) && RES_RE.test(a)) st(who).sales.push({ time: r.time, action: a });
            if (BARREL_RE.test(a)) st(who).barrels.push({ time: r.time, action: a });
          }
        }
      }
      const resP = Object.entries(stat)
        .filter(([, s]) => s.sales.length >= MECH.resourceSales)
        .sort((a, b) => b[1].sales.length - a[1].sales.length);
      const barP = Object.entries(stat)
        .filter(([, s]) => s.barrels.length >= MECH.barrels)
        .sort((a, b) => b[1].barrels.length - a[1].barrels.length);

      const blocks = [];
      blocks.push(secHtml('Большие переводы', big.length));
      big.forEach(x => blocks.push(rowHtml(x.time, hl(x.action))));
      blocks.push(secHtml('Дешёвая продажа транспорта', cheap.length));
      cheap.forEach(x => blocks.push(rowHtml(x.time, hl(x.action))));
      blocks.push(secHtml('Много продаж ресурсов', resP.length));
      resP.forEach(([who, s]) => {
        blocks.push(playerHtml(who, `продаж за период: ${s.sales.length}`));
        s.sales.forEach(x => blocks.push(rowHtml(x.time, hl(x.action))));
      });
      blocks.push(secHtml('Продажи бочек', barP.length));
      barP.forEach(([who, s]) => {
        blocks.push(playerHtml(who, `продано бочек: ${s.barrels.length}`));
        s.barrels.forEach(x => blocks.push(rowHtml(x.time, hl(x.action))));
      });

      const total = big.length + cheap.length + resP.length + barP.length;
      msg(`Махинации: готово, подозрительных: ${total}`);
      showResults(`Махинации: подозрительных ${total}`, blocks.join(''));
    } catch (e) {
      msg('Ошибка загрузки: ' + e.message);
    } finally {
      busy = false;
    }
  }

  /* ---------- Вирты ---------- */
  async function runVirt() {
    const msg = s => { q('#cl-msg').textContent = s; };
    const g = gate(); if (g) return msg(g);
    if (busy) return;
    const acc = getAcc();
    const nick = q('#cl-v-nick').value.trim();
    if (!nick) return msg('Укажи ник игрока');
    const bw = buildWindows(q('#cl-v-from').value, q('#cl-v-to').value);
    if (bw.err) return msg(bw.err);

    busy = true;
    let earned = 0, spent = 0;
    const ops = [];
    try {
      for (let i = 0; i < bw.windows.length; i++) {
        msg(`Вирты: день ${i + 1} из ${bw.windows.length}…`);
        const rows = await fetchDay(acc, bw.windows[i], nick, '');
        for (const r of rows) {
          const a = r.action;
          if (whoOf(a).toLowerCase() !== nick.toLowerCase()) continue;
          const amount = parseMoney(a);
          if (!amount) continue;
          if (SPEND_RE.test(a)) {
            spent += amount;
            ops.push({ time: r.time, action: a, amount, sign: '-' });
          } else if (EARN_RE.test(a)) {
            earned += amount;
            ops.push({ time: r.time, action: a, amount, sign: '+' });
          }
        }
      }
      ops.sort((x, y) => (x.time < y.time ? 1 : x.time > y.time ? -1 : 0));
      const blocks = [];
      blocks.push(`<div class="sum">
        <div><span>Заработал</span><b class="earn">${fmtPlain(earned)}</b></div>
        <div><span>Потратил</span><b class="spend">${fmtPlain(spent)}</b></div>
        <div><span>Разница</span><b>${fmtPlain(earned - spent)}</b></div></div>`);
      blocks.push(secHtml('Операции', ops.length));
      ops.forEach(o => blocks.push(rowHtml(o.time,
        `${hl(o.action)}<span class="${o.sign === '+' ? 'plus' : 'minus'}">${o.sign}${fmtPlain(o.amount)}</span>`)));
      msg('Вирты: готово');
      showResults('Вирты: ' + nick, blocks.join('') || infoHtml('Операций с деньгами за период не найдено'));
    } catch (e) {
      msg('Ошибка загрузки: ' + e.message);
    } finally {
      busy = false;
    }
  }

  /* ---------- Вкладки и панели ---------- */
  function placePanel() {
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const p = cfg('panelPos');
    const x = p ? clamp(p.x, 0, innerWidth - w) : (innerWidth - w) / 2;
    const y = p ? clamp(p.y, 0, innerHeight - h) : (innerHeight - h) / 2;
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  }

  function togglePanel(force) {
    const open = force ?? !panel.classList.contains('open');
    if (open) placePanel();
    panel.classList.toggle('open', open);
    if (open && updState().blocked) activateTab('update');
  }

  function activateTab(name) {
    if (updState().blocked) name = 'update';
    qa('.cl-tab').forEach(t => t.classList.toggle('act', t.dataset.tab === name));
    qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === name));
  }

  function openAccount() {
    if (updState().blocked) return activateTab('update');
    qa('.cl-tab').forEach(t => t.classList.toggle('act', t.dataset.tab === 'profile'));
    qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === 'account'));
  }

  /* ---------- Загрузка картинок: файл, перетаскивание, вставка, ссылка ---------- */
  function loadImageCheck(url) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(url);
      im.onerror = () => rej(new Error('не удалось загрузить картинку по ссылке'));
      im.src = url;
    });
  }

  function readFile(file, maxMB) {
    return new Promise((res, rej) => {
      if (!file.type.startsWith('image/')) return rej(new Error('это не картинка'));
      if (file.size > maxMB * 1024 * 1024) return rej(new Error(`файл больше ${maxMB} МБ`));
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = () => rej(new Error('не удалось прочитать файл'));
      fr.readAsDataURL(file);
    });
  }

  function bindUploader(o) {
    // o: { zone, input, urlInput, urlBtn, pasteBtn, status, maxMB, apply }
    const say2 = s => { o.status.textContent = s; };
    const finish = async src => {
      try {
        await o.apply(src);
        say2('Готово, применено');
      } catch (e) {
        say2('Ошибка: ' + e.message);
      }
    };
    const fromFile = async file => {
      try {
        say2('Читаю файл…');
        await finish(await readFile(file, o.maxMB));
      } catch (e) {
        say2('Ошибка: ' + e.message);
      }
    };
    const fromUrl = async u => {
      say2('Проверяю ссылку…');
      try {
        await loadImageCheck(u);
        await finish(u);
      } catch (e) {
        say2('Ошибка: ' + e.message);
      }
    };
    const fromDT = dt => {
      if (!dt) return false;
      const f = [...(dt.files || [])].find(x => x.type.startsWith('image/'));
      if (f) { fromFile(f); return true; }
      const txt = ((dt.getData && (dt.getData('text/uri-list') || dt.getData('text/plain'))) || '').trim();
      if (/^https?:\/\//i.test(txt)) { fromUrl(txt); return true; }
      const html = (dt.getData && dt.getData('text/html')) || '';
      const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && /^https?:\/\//i.test(m[1])) { fromUrl(m[1]); return true; }
      return false;
    };

    o.zone.addEventListener('click', () => o.input.click());
    o.zone.addEventListener('keydown', e => { if (e.key === 'Enter') o.input.click(); });
    o.input.addEventListener('change', () => {
      if (o.input.files[0]) fromFile(o.input.files[0]);
      o.input.value = '';
    });
    o.zone.addEventListener('dragover', e => { e.preventDefault(); o.zone.classList.add('drag'); });
    o.zone.addEventListener('dragleave', () => o.zone.classList.remove('drag'));
    o.zone.addEventListener('drop', e => {
      e.preventDefault();
      o.zone.classList.remove('drag');
      if (!fromDT(e.dataTransfer)) say2('Перетащи картинку или ссылку на неё');
    });
    o.zone.addEventListener('paste', e => {
      e.preventDefault();
      if (!fromDT(e.clipboardData)) say2('В буфере нет картинки или ссылки');
    });
    o.urlBtn.addEventListener('click', () => {
      const u = o.urlInput.value.trim();
      if (!/^https?:\/\//i.test(u)) return say2('Вставь ссылку, которая начинается с https://');
      fromUrl(u);
    });
    o.urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') o.urlBtn.click(); });
    o.pasteBtn.addEventListener('click', async () => {
      try {
        const items = await navigator.clipboard.read();
        for (const it of items) {
          const t = it.types.find(x => x.startsWith('image/'));
          if (t) return fromFile(new File([await it.getType(t)], 'clipboard', { type: t }));
        }
        const txt = (await navigator.clipboard.readText()).trim();
        if (/^https?:\/\//i.test(txt)) return fromUrl(txt);
        say2('В буфере нет картинки или ссылки');
      } catch (e) {
        say2('Нажми в область выше и затем Ctrl+V');
      }
    });
  }

  /* ---------- Аккаунт: ник, пароль, сервер ---------- */
  async function changeNick() {
    const m = q('#cl-acc-msg1'), say3 = s => { m.textContent = s; };
    const acc = getAcc();
    if (!acc) return;
    const nn = q('#cl-acc-nick').value.trim();
    const pass = q('#cl-acc-pass1').value;
    if (!/^[\w.\-]{3,24}$/.test(nn)) return say3('Ник: 3–24 символа, буквы, цифры, _ . -');
    const accs = cfg('accounts');
    const rec = accs[acc.key];
    if ((await hashPass(pass, rec.salt)) !== rec.hash) return say3('Неверный пароль');
    const nk = nn.toLowerCase();
    if (nk !== acc.key && accs[nk]) return say3('Такой ник уже занят');
    if (nk !== acc.key) delete accs[acc.key];
    accs[nk] = { ...rec, nick: nn };
    setCfg('accounts', accs);
    setCfg('session', nk);
    q('#cl-acc-nick').value = '';
    q('#cl-acc-pass1').value = '';
    renderAuth();
    say3('Ник изменён на ' + nn);
  }

  async function changePass() {
    const m = q('#cl-acc-msg2'), say3 = s => { m.textContent = s; };
    const acc = getAcc();
    if (!acc) return;
    const oldP = q('#cl-acc-oldp').value, newP = q('#cl-acc-newp').value;
    if (newP.length < 4) return say3('Новый пароль минимум 4 символа');
    const accs = cfg('accounts');
    const rec = accs[acc.key];
    if ((await hashPass(oldP, rec.salt)) !== rec.hash) return say3('Старый пароль неверный');
    const salt = newSalt();
    accs[acc.key] = { ...rec, salt, hash: await hashPass(newP, salt) };
    setCfg('accounts', accs);
    q('#cl-acc-oldp').value = '';
    q('#cl-acc-newp').value = '';
    say3('Пароль изменён');
  }

  function changeServer() {
    const acc = getAcc();
    if (!acc) return;
    saveAcc(acc.key, { server: q('#cl-acc-server').value });
    renderAuth();
    q('#cl-acc-msg1').textContent = 'Сервер сохранён';
  }

  function logout() {
    setCfg('session', null);
    renderAuth();
    applyBg();
    refreshUpdate(false);
    activateTab('home');
  }

  /* ---------- Кастомизация: круглые цвета ---------- */
  function renderSwatches() {
    const t = getTheme();
    qa('.cl-swatches').forEach(box => {
      const key = box.dataset.key;
      const cur = (t[key] || '').toLowerCase();
      box.innerHTML = STOCK.map(s =>
        `<button class="cl-sw-c${cur === s.c ? ' on' : ''}" style="background:${s.c}" title="${s.n}" data-c="${s.c}"></button>`).join('')
        + `<label class="cl-sw-c cl-sw-custom" title="Свой цвет"><input type="color" value="${cur}"></label>`;
      box.querySelectorAll('button').forEach(b => b.onclick = () => {
        saveTheme({ [key]: b.dataset.c });
        renderSwatches();
      });
      const inp = box.querySelector('input');
      inp.oninput = e => saveTheme({ [key]: e.target.value });
      inp.onchange = () => renderSwatches();
    });
  }

  /* ---------- Построение интерфейса ---------- */
  function buildUI() {
    const serverOpts = SERVERS.map(([n, name]) => `<option value="${n}">[${n}] ${name}</option>`).join('');
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fromVal = toLocalInput(startOfDay), toVal = toLocalInput(now);
    const limitVal = cfg('limit');
    const limitRadios = LIMITS.map(n =>
      `<label><input type="radio" name="cl-lim" value="${n}" ${n === limitVal ? 'checked' : ''}><span>${n}</span></label>`).join('');
    const blurVal = clamp(+cfg('blur'), 0, 20);
    const rainHtml = Array.from({ length: 12 }, () => {
      const left = Math.random() * 100;
      const size = 18 + Math.random() * 12;
      const dur = 10 + Math.random() * 6;
      const delay = -Math.random() * 16;
      return `<img class="cl-drop-logo" src="${LOGO}" alt="" style="left:${left}%;width:${size}px;animation-duration:${dur}s;animation-delay:${delay}s">`;
    }).join('');
    const typeOptsHtml = typeOpts.map(o => `<option value="${esc(o.label)}"></option>`).join('');

    ui.innerHTML = `
      <style>${CSS}</style>
      <div id="cl-btn" title="CustomLogs — клик: меню, Alt + тяни: перемещение">
        <img src="${FIGURE}" alt="">
        <div class="cl-zzz"><span>z</span><span>z</span><span>Z</span></div>
        <div class="cl-bubble"><span class="cl-dot ok" id="cl-bubble-dot"></span><span id="cl-bubble-text"></span></div>
      </div>

      <div id="cl-warn">
        <div class="cl-warn-box">
          <div class="cl-warn-ico">!</div>
          <h3>Предупреждение</h3>
          <p>${WARN_TEXT}</p>
          <button class="cl-btnp" id="cl-warn-ok">Понятно</button>
        </div>
      </div>

      <div id="cl-panel">
        <div class="cl-head">
          <div class="cl-title"><b>CustomLogs</b><span>Rodina RP</span><em class="cl-beta">BETA</em><span class="cl-ver">${VERSION}</span></div>
          <span class="cl-x" title="Закрыть">✕</span>
        </div>
        <div class="cl-main">
          <div class="cl-nav">
            <div class="cl-tab act" data-tab="home">${ICON.home}<span>Главная</span></div>
            <div class="cl-tab" data-tab="profile">${ICON.user}<span>Профиль</span></div>
            <div class="cl-tab" data-tab="search">${ICON.search}<span>Поиск</span></div>
            <div class="cl-tab" data-tab="look">${ICON.look}<span>Интерфейс</span></div>
            <div class="cl-tab" data-tab="custom">${ICON.brush}<span>Кастомизация</span></div>
            <div class="cl-tab" data-tab="optim">${ICON.gauge}<span>Оптимизация</span></div>
            <div class="cl-tab" data-tab="settings">${ICON.gear}<span>Настройки</span></div>
            <div class="cl-tab" data-tab="offer">${ICON.chat}<span>Предложения</span></div>
            <div class="cl-tab" data-tab="update">${ICON.upd}<span>Обновление</span></div>
          </div>
          <div class="cl-body">

            <div class="cl-pane" data-pane="auth">
              <div class="cl-auth">
                <h2>Вход в CustomLogs</h2>
                <p class="cl-hint">Без входа скрипт не работает. Профиль локальный, в этом браузере.</p>
                <div class="cl-card">
                  <label class="cl-lbl">Ник</label>
                  <input class="cl-in" id="cl-a-nick" placeholder="Nick_Name">
                  <label class="cl-lbl">Пароль (минимум 4 символа)</label>
                  <input class="cl-in" id="cl-a-pass" type="password">
                  <label class="cl-lbl">Сервер</label>
                  <select class="cl-in" id="cl-a-server">${serverOpts}</select>
                </div>
                <button class="cl-btnp" id="cl-a-login">Войти</button>
                <button class="cl-btnp sec" id="cl-a-reg">Создать аккаунт</button>
                <div class="cl-msg" id="cl-a-msg"></div>
              </div>
            </div>

            <div class="cl-pane act cl-home" data-pane="home">
              <div class="cl-rain">${rainHtml}</div>
              <div class="cl-hero">
                <h2>Добро Пожаловать в <em>Custom Logs!</em></h2>
                <p>Приятного проживания в логах</p>
                <div class="cl-status"><span class="cl-dot ok" id="cl-status-dot"></span><span id="cl-status-text"></span></div>
              </div>
              <div class="cl-foot">Разработчик - Without Custom</div>
            </div>

            <div class="cl-pane" data-pane="profile">
              <div class="cl-prof">
                <div class="cl-avatar"><img id="cl-avimg" alt=""></div>
                <div class="cl-pinfo">
                  <div class="cl-nick" id="cl-pnick">Гость</div>
                  <div class="cl-streak">
                    <span id="cl-flame"></span>
                    <div><b id="cl-days">0</b> <span>дней подряд со скриптом</span>
                      <div class="cl-tiername" id="cl-tiername"></div>
                      <div class="cl-next" id="cl-nexttier"></div>
                    </div>
                  </div>
                  <div class="cl-srv" id="cl-pserver"></div>
                </div>
              </div>
              <button class="cl-btnp" id="cl-goacc">Настройка аккаунта</button>
            </div>

            <div class="cl-pane" data-pane="account">
              <div class="cl-acc-head">
                <button class="cl-btnp small sec" id="cl-acc-back">← Назад</button>
                <div class="cl-acc-title">Настройка аккаунта</div>
              </div>
              <div class="cl-grid2">
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Аватарка</div>
                  <div class="cl-avprev"><img id="cl-av-prev" alt=""></div>
                  <div class="cl-drop" id="cl-av-zone" tabindex="0">
                    <div class="cl-drop-ico">⬆</div>
                    <div><b>Перетащи картинку или гифку</b><span>Нажми сюда, вставь Ctrl+V или выбери файл</span></div>
                  </div>
                  <input type="file" id="cl-av-file" accept="image/*" hidden>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-av-url" placeholder="Ссылка на картинку с любого сайта">
                    <button class="cl-btnp" id="cl-av-urlgo">Вставить</button>
                  </div>
                  <div class="cl-row">
                    <button class="cl-btnp small sec" id="cl-av-paste">Из буфера</button>
                    <button class="cl-btnp small sec" id="cl-av-reset">Сбросить аватарку</button>
                  </div>
                  <div class="cl-msg" id="cl-av-msg"></div>
                </div>
                <div>
                  <div class="cl-card" style="margin-top:0">
                    <div class="cl-sec">Ник и сервер</div>
                    <label class="cl-lbl">Новый ник (Nick_Name)</label>
                    <input class="cl-in" id="cl-acc-nick" placeholder="Новый ник">
                    <label class="cl-lbl">Пароль для подтверждения</label>
                    <input class="cl-in" id="cl-acc-pass1" type="password">
                    <button class="cl-btnp small" id="cl-acc-nickgo">Сменить ник</button>
                    <label class="cl-lbl">Сервер</label>
                    <select class="cl-in" id="cl-acc-server">${serverOpts}</select>
                    <button class="cl-btnp small" id="cl-acc-servergo">Сохранить сервер</button>
                    <div class="cl-msg" id="cl-acc-msg1"></div>
                  </div>
                  <div class="cl-card">
                    <div class="cl-sec">Пароль</div>
                    <label class="cl-lbl">Старый пароль</label>
                    <input class="cl-in" id="cl-acc-oldp" type="password">
                    <label class="cl-lbl">Новый пароль (минимум 4 символа)</label>
                    <input class="cl-in" id="cl-acc-newp" type="password">
                    <button class="cl-btnp small" id="cl-acc-passgo">Сменить пароль</button>
                    <div class="cl-msg" id="cl-acc-msg2"></div>
                  </div>
                  <button class="cl-btnp sec" id="cl-logout">Выйти из аккаунта</button>
                </div>
              </div>
            </div>

            <div class="cl-pane" data-pane="search">
              <div class="cl-subtabs">
                <div class="cl-subtab act" data-sub="probiv">Пробив</div>
                <div class="cl-subtab" data-sub="mech">Махинации</div>
                <div class="cl-subtab" data-sub="virt">Вирты</div>
              </div>

              <div class="cl-sub act" data-subpane="probiv">
                <div class="cl-modes">
                  <div class="cl-mode act" data-mode="nick">По нику</div>
                  <div class="cl-mode" data-mode="kw">По ключевому слову</div>
                  <div class="cl-mode" data-mode="type">По типу из логов</div>
                </div>
                <div class="cl-grid">
                  <div class="cl-card" style="margin-top:12px">
                    <label class="cl-lbl" id="cl-p-qlabel"></label>
                    <input class="cl-in" id="cl-p-q" autocomplete="off">
                    <datalist id="cl-p-types">${typeOptsHtml}</datalist>
                    <div class="cl-hint2" id="cl-p-ex"></div>
                  </div>
                  <div class="cl-card" style="margin-top:12px">
                    <label class="cl-lbl">Период от</label>
                    <input class="cl-in" type="datetime-local" id="cl-p-from" value="${fromVal}">
                    <label class="cl-lbl">Период до</label>
                    <input class="cl-in" type="datetime-local" id="cl-p-to" value="${toVal}">
                    <button class="cl-btnp" id="cl-p-go">Искать</button>
                  </div>
                </div>
              </div>

              <div class="cl-sub" data-subpane="mech">
                <div class="cl-card" style="margin-top:12px">
                  <label class="cl-lbl">Период от</label>
                  <input class="cl-in" type="datetime-local" id="cl-m-from" value="${fromVal}">
                  <label class="cl-lbl">Период до</label>
                  <input class="cl-in" type="datetime-local" id="cl-m-to" value="${toVal}">
                  <button class="cl-btnp" id="cl-m-go">Запустить Махинации</button>
                  <div class="cl-hint2">Ищет по всем игрокам за период: переводы от 1 000 000 руб., дешёвые продажи авто, большие продажи ресурсов и бочек. Выводит дату, ник и сумму каждой операции.</div>
                </div>
              </div>

              <div class="cl-sub" data-subpane="virt">
                <div class="cl-card" style="margin-top:12px">
                  <label class="cl-lbl">Ник игрока (Nick_Name)</label>
                  <input class="cl-in" id="cl-v-nick" placeholder="Kent_Dairo">
                  <label class="cl-lbl">Период от</label>
                  <input class="cl-in" type="datetime-local" id="cl-v-from" value="${fromVal}">
                  <label class="cl-lbl">Период до</label>
                  <input class="cl-in" type="datetime-local" id="cl-v-to" value="${toVal}">
                  <button class="cl-btnp" id="cl-v-go">Посчитать вирты</button>
                  <div class="cl-hint2">Сколько игрок заработал и потратил за период, со всеми операциями и датами.</div>
                </div>
              </div>

              <div class="cl-msg" id="cl-msg"></div>
            </div>

            <div class="cl-pane" data-pane="look">
              <div class="cl-card" style="margin-top:0">
                <label class="cl-sw"><span>Включить свой фон на весь сайт</span>
                  <input type="checkbox" id="cl-bgon"></label>
              </div>
              <div class="cl-grid2">
                <div class="cl-card" style="margin-top:12px">
                  <div class="cl-sec">Фон сайта</div>
                  <div class="cl-prev" id="cl-bg-prev"><span class="cl-prev-empty" id="cl-bg-empty">Фон не выбран</span></div>
                  <div class="cl-drop" id="cl-bg-zone" tabindex="0">
                    <div class="cl-drop-ico">⬆</div>
                    <div><b>Перетащи фото или гифку</b><span>Нажми сюда, вставь Ctrl+V или выбери файл</span></div>
                  </div>
                  <input type="file" id="cl-bg-file" accept="image/*" hidden>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-bg-url" placeholder="Ссылка на фото или гифку с любого сайта">
                    <button class="cl-btnp" id="cl-bg-urlgo">Вставить</button>
                  </div>
                  <div class="cl-row">
                    <button class="cl-btnp small sec" id="cl-bg-paste">Из буфера</button>
                    <button class="cl-btnp small sec" id="cl-bg-reset">Сбросить фон</button>
                  </div>
                  <div class="cl-msg" id="cl-bg-msg"></div>
                </div>
                <div class="cl-card" style="margin-top:12px">
                  <div class="cl-sec">Блюр фона: <span id="cl-blurv">${blurVal}</span> px</div>
                  <input class="cl-range" type="range" id="cl-blur" min="0" max="20" value="${blurVal}">
                  <div class="cl-hint2">Фото применяется сразу после выбора. Поддерживаются JPG, PNG, WEBP и GIF, файлы до 4 МБ.</div>
                </div>
              </div>
            </div>

            <div class="cl-pane" data-pane="custom">
              <div class="cl-card" style="margin-top:0">
                <div class="cl-sec">Акцент (кнопки, рамки, активные вкладки)</div>
                <div class="cl-swatches" data-key="accent"></div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Фон меню</div>
                <div class="cl-swatches" data-key="panel"></div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Наведение (вкладки и кнопки)</div>
                <div class="cl-swatches" data-key="hover"></div>
              </div>
              <button class="cl-btnp sec" id="cl-c-reset">Сбросить к стандартным цветам</button>
            </div>

            <div class="cl-pane" data-pane="optim">
              <div class="cl-lock">
                <div class="cl-lock-ico">🔒</div>
                <h2>В разработке</h2>
                <p>Этот раздел скоро появится</p>
              </div>
            </div>

            <div class="cl-pane" data-pane="settings">
              <div class="cl-grid">
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Приватность логов</div>
                  <label class="cl-sw"><span>Скрывать IP (столбец и адреса в Пробиве)</span>
                    <input type="checkbox" id="cl-ipb" ${cfg('ipHide') ? 'checked' : ''}></label>
                  <label class="cl-sw"><span>Скрывать деньги (столбец и суммы в Пробиве)</span>
                    <input type="checkbox" id="cl-moneyb" ${cfg('moneyHide') ? 'checked' : ''}></label>
                </div>
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Строк на странице логов</div>
                  <div class="cl-seg">${limitRadios}</div>
                  <label class="cl-sw"><span>Автоматически выставлять это значение</span>
                    <input type="checkbox" id="cl-limon" ${cfg('limitOn') ? 'checked' : ''}></label>
                </div>
              </div>
            </div>

            <div class="cl-pane cl-offer" data-pane="offer">
              <h2>Предложения</h2>
              <p class="cl-hint">По каким вопросам можно обращаться:</p>
              <ul class="cl-list">
                <li>Баг с скриптом?</li>
                <li>Нашли недоработку или обход систем?</li>
                <li>Хотите предложить улучшение?</li>
                <li>Хотите стать тестером?</li>
              </ul>
              <div class="cl-card">
                <div class="cl-sec">Если вы нашли свою причину, то обратитесь сюда:</div>
                <div class="cl-contacts">
                  <a class="cl-link" href="https://vk.ru/lugneer" target="_blank" rel="noopener noreferrer">VK · vk.ru/lugneer</a>
                  <a class="cl-link" href="https://t.me/customspb" target="_blank" rel="noopener noreferrer">Telegram · @customspb</a>
                </div>
              </div>
            </div>

            <div class="cl-pane" data-pane="update">
              <div class="cl-card" style="margin-top:0">
                <div class="cl-sec">Версия скрипта</div>
                <div class="cl-verbig">v${VERSION_NUM}</div>
                <div id="cl-upd-remote" style="color:var(--cl-muted);font-size:14px">Доступная версия: проверяю…</div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Обновление</div>
                <div class="cl-row">
                  <button class="cl-btnp small" id="cl-upd-check">Проверить обновления</button>
                  <button class="cl-btnp small sec" id="cl-upd-dl">Установить обновление</button>
                </div>
                <div class="cl-msg" id="cl-upd-msg"></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div id="cl-win">
        <div class="cl-head"><div class="cl-title"><b id="cl-wtitle"></b></div>
          <span class="cl-x" id="cl-wclose">✕</span></div>
        <div class="cl-wbody"></div>
      </div>`;

    btn = q('#cl-btn');
    bubble = q('.cl-bubble');
    panel = q('#cl-panel');

    qa('.cl-tab').forEach(tab => tab.onclick = () => activateTab(tab.dataset.tab));
    q('.cl-x').onclick = () => togglePanel(false);
    q('#cl-wclose').onclick = () => q('#cl-win').classList.remove('open');
    q('#cl-warn-ok').onclick = () => {
      q('#cl-warn').classList.remove('open');
      if (pending) { const f = pending; pending = null; f(); }
    };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });

    /* Подвкладки поиска и режимы Пробива */
    qa('.cl-subtab').forEach(s => s.onclick = () => {
      qa('.cl-subtab').forEach(x => x.classList.toggle('act', x === s));
      qa('.cl-sub').forEach(p => p.classList.toggle('act', p.dataset.subpane === s.dataset.sub));
    });
    qa('.cl-mode').forEach(m => m.onclick = () => setMode(m.dataset.mode));
    setMode(pMode);

    /* Перетаскивание меню за шапку */
    const head = q('.cl-head');
    let pDrag = false, px = 0, py = 0, plx = 0, ply = 0;
    head.addEventListener('pointerdown', e => {
      if (e.target.closest('.cl-x')) return;
      pDrag = true;
      px = e.clientX; py = e.clientY;
      const r = panel.getBoundingClientRect();
      plx = r.left; ply = r.top;
      head.setPointerCapture(e.pointerId);
    });
    head.addEventListener('pointermove', e => {
      if (!pDrag) return;
      panel.style.left = clamp(plx + e.clientX - px, 0, innerWidth - panel.offsetWidth) + 'px';
      panel.style.top = clamp(ply + e.clientY - py, 0, innerHeight - panel.offsetHeight) + 'px';
    });
    head.addEventListener('pointerup', () => {
      if (!pDrag) return;
      pDrag = false;
      const r = panel.getBoundingClientRect();
      setCfg('panelPos', { x: r.left, y: r.top });
    });

    /* Фигурка: перемещение только с Alt, клик без Alt — меню */
    const setBtnPos = (x, y) => {
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.style.right = 'auto';
    };
    let bDrag = false, bMoved = false, justMoved = false, sx = 0, sy = 0, bx = 0, by = 0;
    btn.addEventListener('pointerdown', e => {
      if (!e.altKey) return;
      e.preventDefault();
      bDrag = true; bMoved = false;
      sx = e.clientX; sy = e.clientY;
      const r = btn.getBoundingClientRect();
      bx = r.left; by = r.top;
      btn.setPointerCapture(e.pointerId);
      btn.classList.add('dragging');
    });
    btn.addEventListener('pointermove', e => {
      if (!bDrag) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!bMoved && Math.hypot(dx, dy) < 4) return;
      bMoved = true;
      setBtnPos(clamp(bx + dx, 0, innerWidth - BTN_W), clamp(by + dy, 0, innerHeight - BTN_H));
      placeBubble();
    });
    btn.addEventListener('pointerup', () => {
      if (!bDrag) return;
      bDrag = false;
      btn.classList.remove('dragging');
      if (bMoved) {
        justMoved = true;
        const r = btn.getBoundingClientRect();
        setCfg('btnPos', { x: r.left, y: r.top });
      }
    });
    btn.addEventListener('click', () => {
      if (justMoved) { justMoved = false; return; }
      togglePanel();
    });
    window.addEventListener('keydown', e => { if (e.key === 'Alt') btn.classList.add('alt'); });
    window.addEventListener('keyup', e => { if (e.key === 'Alt') btn.classList.remove('alt'); });
    window.addEventListener('resize', () => {
      const r = btn.getBoundingClientRect();
      setBtnPos(clamp(r.left, 0, innerWidth - BTN_W), clamp(r.top, 0, innerHeight - BTN_H));
      if (panel.classList.contains('open')) placePanel();
    });
    const saved = cfg('btnPos');
    if (saved) setBtnPos(clamp(saved.x, 0, innerWidth - BTN_W), clamp(saved.y, 0, innerHeight - BTN_H));

    /* Вход и регистрация */
    const authMsg = s => { q('#cl-a-msg').textContent = s; };
    async function authSubmit(mode) {
      const nick = q('#cl-a-nick').value.trim();
      const pass = q('#cl-a-pass').value;
      const server = q('#cl-a-server').value;
      if (!nick) return authMsg('Введи ник');
      if (pass.length < 4) return authMsg('Пароль минимум 4 символа');
      const key = nick.toLowerCase();
      const accs = cfg('accounts');
      if (mode === 'register') {
        if (accs[key]) return authMsg('Такой ник уже зарегистрирован, нажми «Войти»');
        const salt = newSalt();
        accs[key] = { nick, salt, hash: await hashPass(pass, salt), server };
        setCfg('accounts', accs);
      } else {
        const a = accs[key];
        if (!a) return authMsg('Аккаунт не найден, нажми «Создать аккаунт»');
        if ((await hashPass(pass, a.salt)) !== a.hash) return authMsg('Неверный пароль');
        saveAcc(key, { server });
      }
      setCfg('session', key);
      q('#cl-a-pass').value = '';
      authMsg('');
      renderAuth();
      applyBg();
      syncSite(true);
      refreshUpdate(false);
      const acc = getAcc();
      if (working()) {
        markGreeted();
        sayOrDefer(() => say(greetText(acc.nick), 'ok', 6000));
      }
      activateTab('home');
    }
    q('#cl-a-login').onclick = () => authSubmit('login');
    q('#cl-a-reg').onclick = () => authSubmit('register');

    /* Поиск */
    q('#cl-p-go').onclick = runProbiv;
    q('#cl-m-go').onclick = runMechanic;
    q('#cl-v-go').onclick = runVirt;

    /* Профиль */
    q('#cl-goacc').onclick = openAccount;
    q('#cl-acc-back').onclick = () => activateTab('profile');
    q('#cl-acc-nickgo').onclick = changeNick;
    q('#cl-acc-servergo').onclick = changeServer;
    q('#cl-acc-passgo').onclick = changePass;
    q('#cl-logout').onclick = logout;

    /* Аватарка: применяется сразу */
    bindUploader({
      zone: q('#cl-av-zone'),
      input: q('#cl-av-file'),
      urlInput: q('#cl-av-url'),
      urlBtn: q('#cl-av-urlgo'),
      pasteBtn: q('#cl-av-paste'),
      status: q('#cl-av-msg'),
      maxMB: 1.5,
      apply: async src => { setCfg('avatar', src); renderAvatar(); },
    });
    q('#cl-av-reset').onclick = () => {
      setCfg('avatar', '');
      renderAvatar();
      q('#cl-av-msg').textContent = 'Аватарка сброшена';
    };

    /* Интерфейс: фон применяется сразу */
    q('#cl-bgon').onchange = e => { setCfg('bgOn', e.target.checked); applyBg(); renderBgPreview(); };
    bindUploader({
      zone: q('#cl-bg-zone'),
      input: q('#cl-bg-file'),
      urlInput: q('#cl-bg-url'),
      urlBtn: q('#cl-bg-urlgo'),
      pasteBtn: q('#cl-bg-paste'),
      status: q('#cl-bg-msg'),
      maxMB: 4,
      apply: async src => {
        setCfg('bgUrl', src);
        setCfg('bgOn', true);
        applyBg();
        renderBgPreview();
      },
    });
    q('#cl-bg-reset').onclick = () => {
      setCfg('bgUrl', '');
      setCfg('bgOn', false);
      applyBg();
      renderBgPreview();
      q('#cl-bg-msg').textContent = 'Фон сброшен';
    };
    q('#cl-blur').oninput = e => {
      setCfg('blur', +e.target.value);
      q('#cl-blurv').textContent = e.target.value;
      applyBg();
    };

    /* Кастомизация */
    q('#cl-c-reset').onclick = () => {
      setCfg('theme', {});
      applyTheme();
      renderSwatches();
    };
    renderSwatches();

    /* Настройки */
    q('#cl-ipb').onchange = e => { setCfg('ipHide', e.target.checked); syncSite(true); };
    q('#cl-moneyb').onchange = e => { setCfg('moneyHide', e.target.checked); syncSite(true); };
    qa('input[name="cl-lim"]').forEach(r => r.onchange = () => {
      setCfg('limit', +r.value);
      applyLimit();
    });
    q('#cl-limon').onchange = e => { setCfg('limitOn', e.target.checked); applyLimit(); };

    /* Обновление */
    q('#cl-upd-check').onclick = () => checkUpdate(true);
    q('#cl-upd-dl').onclick = () => window.open(UPDATE_URL, '_blank');

    renderBgPreview();
    renderAuth();
  }

  /* ---------- Запуск ---------- */
  typeOpts = [...document.querySelectorAll('select[name="type[]"] option')]
    .filter(o => o.value)
    .map(o => ({ value: o.value, label: o.textContent.trim() }));

  const today = dayKey(new Date());
  const prevStreak = cfg('streak') || {};
  const inactive = !!prevStreak.last && dayDiff(prevStreak.last, today) > INACTIVE_DAYS;
  touchStreak();

  applyTheme();
  buildUI();
  applyBg();
  syncSite(true);
  applyLimit();
  refreshUpdate(true);

  // Предупреждение: для незарегистрированных и для тех, кто давно не заходил
  if (!isLogged() || inactive) setTimeout(showWarn, 600);

  function showWarn() {
    q('#cl-warn').classList.add('open');
  }

  // Приветствие: один раз на вкладку, если скрипт активен
  if (working() && !tabGreeted()) {
    markGreeted();
    const nick = getAcc().nick;
    setTimeout(() => sayOrDefer(() => say(greetText(nick), 'ok', 6000)), 1200);
  }

  // Бездействие: через 10 минут Макима засыпает, при активности просыпается
  let lastAct = Date.now();
  const onActivity = () => {
    lastAct = Date.now();
    if (sleeping) wakeUp();
  };
  ['pointerdown', 'keydown', 'mousemove', 'wheel'].forEach(ev =>
    document.addEventListener(ev, onActivity, { passive: true }));
  setInterval(() => {
    if (!sleeping && Date.now() - lastAct >= IDLE_MS) goSleep();
  }, 30000);

  // Проверка обновлений при запуске и потом раз в 30 минут
  setTimeout(() => checkUpdate(false), 3000);
  setInterval(() => checkUpdate(false), UPD_CHECK_MS);

  // Перестраиваем правила только когда таблица сайта действительно поменялась
  let syncTimer;
  new MutationObserver(() => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncSite(false), 300);
  }).observe(document.body, { childList: true, subtree: true });
})();
