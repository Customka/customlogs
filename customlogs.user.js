// ==UserScript==
// @name         CustomLogs — Rodina RP
// @namespace    customlogs.rodina
// @version      4.4.0
// @description  Вход, профиль, поиск по всем логам, фон с блюром, кастомизация, приватность, автолимит строк
// @match        https://rodina.logsparser.info/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js
// @downloadURL  https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js
// ==/UserScript==

(function () {
  'use strict';

  /* ================= НАСТРОЙКИ ================= */
  const VERSION = 'v4.4.0';
  const FIGURE = 'data:image/webp;base64,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';

  const KEY = {
    btnPos: 'cl_btn_pos', panelPos: 'cl_panel_pos', bgUrl: 'cl_bg_url', bgOn: 'cl_bg_on',
    blur: 'cl_blur', theme: 'cl_theme', ipHide: 'cl_ip_hide', moneyHide: 'cl_money_hide',
    limit: 'cl_limit', limitOn: 'cl_limit_on', accounts: 'cl_accounts', session: 'cl_session',
    first: 'cl_first', avatar: 'cl_avatar', paused: 'cl_paused',
  };
  const DEF = {
    btnPos: null, panelPos: null, bgUrl: '', bgOn: false, blur: 0, theme: {},
    ipHide: true, moneyHide: false, limit: 100, limitOn: false, accounts: {}, session: null,
    first: 0, avatar: '', paused: false,
  };
  const THEME_DEF = { accent: '#8b5cf6', panel: '#0a0a0d', hover: '#2a1f40' };
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
  const MONEY_RE = /I{1,2}:\s*[\d,]+(?:\s*\/\s*[\d,]+){3}/g;
  /* ============================================ */

  /* Настройки читаем из Tampermonkey один раз и держим в памяти */
  const cache = {};
  const cfg = k => (k in cache ? cache[k] : (cache[k] = GM_getValue(KEY[k], DEF[k])));
  const setCfg = (k, v) => { cache[k] = v; GM_setValue(KEY[k], v); };
  const isActive = () => !cfg('paused');

  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = n => String(n).padStart(2, '0');
  const fmtSite = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const toLocalInput = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const serverName = n => (SERVERS.find(s => s[0] === n) || [])[1] || '';
  const getTheme = () => ({ ...THEME_DEF, ...cfg('theme') });
  const daysWithScript = () => (cfg('first') ? Math.floor((Date.now() - cfg('first')) / DAY_MS) + 1 : 0);

  /* ---------- Аккаунт (локальный) ---------- */
  const getAcc = () => {
    const k = cfg('session');
    const accs = cfg('accounts');
    return k && accs[k] ? { key: k, ...accs[k] } : null;
  };
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

  /* =========================================================
     САЙТ: оформление одним <style> и классами на body.
     Никаких проходов по элементам страницы.
     ========================================================= */
  const siteStyle = document.createElement('style');
  siteStyle.id = 'cl-site';
  document.head.appendChild(siteStyle);

  // Номера столбцов IP и «Данные» по заголовку таблицы
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

    // Все поля фильтров: обычные инпуты и select2 (Сервер, Тип, Сортировка)
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

      /* Поля фильтров: прозрачная заливка и тонкая рамка только у самого поля */
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

      /* Пагинация: прозрачные кнопки, белые цифры, активная страница красная */
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
    const active = isActive();
    document.body.classList.toggle('cl-bg-on', active && cfg('bgOn') && !!cfg('bgUrl'));
    document.body.classList.toggle('cl-ip-hide', active && cfg('ipHide'));
    document.body.classList.toggle('cl-money-hide', active && cfg('moneyHide'));
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

  /* ---------- Слой фона: отдельный shadow-хост позади страницы ---------- */
  const bgHost = document.createElement('div');
  bgHost.id = 'cl-bg-host';
  bgHost.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;display:none';
  document.body.appendChild(bgHost);
  const bgRoot = bgHost.attachShadow({ mode: 'open' });
  bgRoot.innerHTML = `<div id="layer" style="position:fixed;inset:-20px;background-size:cover;
    background-position:center;background-repeat:no-repeat;will-change:filter"></div>`;

  function applyBg() {
    const url = cfg('bgUrl');
    const on = isActive() && cfg('bgOn') && !!url;
    const layer = bgRoot.getElementById('layer');
    layer.style.backgroundImage = on ? `url("${url}")` : 'none';
    layer.style.filter = cfg('blur') ? `blur(${cfg('blur')}px)` : 'none';
    bgHost.style.display = on ? 'block' : 'none';
    syncSite(true);
  }

  /* =========================================================
     ИНТЕРФЕЙС СКРИПТА: в Shadow DOM, чтобы стили сайта
     не влияли на меню и наоборот.
     ========================================================= */
  const uiHost = document.createElement('div');
  uiHost.id = 'cl-ui-host';
  uiHost.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483646';
  document.body.appendChild(uiHost);
  const ui = uiHost.attachShadow({ mode: 'open' });
  const q = s => ui.querySelector(s);
  const qa = (s, r = ui) => [...r.querySelectorAll(s)];

  const CSS = `
  :host{--cl-accent:#8b5cf6;--cl-panel:#0a0a0d;--cl-hover:#2a1f40;--cl-text:#e9e6f2;--cl-muted:#8e84a6;
    --cl-ok:#22c55e;--cl-off:#ef4444;--cl-ease:cubic-bezier(.16,1,.3,1)}
  @keyframes clPane{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes clPulseOk{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.55)}50%{box-shadow:0 0 0 7px rgba(34,197,94,0)}}
  @keyframes clPulseOff{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
  *{box-sizing:border-box}

  #cl-btn{position:fixed;top:120px;right:24px;width:${BTN_W}px;cursor:pointer;user-select:none;touch-action:none;transition:transform .35s var(--cl-ease)}
  #cl-btn:hover{transform:translateY(-2px)}
  #cl-btn img{display:block;width:${BTN_W}px;height:auto;pointer-events:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6))}
  #cl-btn.alt{cursor:move}
  #cl-btn.dragging{cursor:grabbing}
  .cl-bubble{position:absolute;white-space:nowrap;pointer-events:none;display:flex;align-items:center;gap:8px;
    padding:8px 12px;border-radius:10px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 55%,transparent);box-shadow:0 8px 24px rgba(0,0,0,.6);
    font:600 12px/1.2 'Segoe UI',Tahoma,sans-serif;opacity:0;visibility:hidden;transform:translateY(4px);
    transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  .cl-bubble.show{opacity:1;visibility:visible;transform:none;transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}
  .cl-bubble[data-pos=top]{bottom:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=bottom]{top:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=left]{right:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  .cl-bubble[data-pos=right]{left:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  .cl-dot{width:9px;height:9px;border-radius:50%;flex:0 0 9px}
  .cl-dot.ok{background:var(--cl-ok);animation:clPulseOk 2s infinite}
  .cl-dot.off{background:var(--cl-off);animation:clPulseOff 2s infinite}

  #cl-panel{position:fixed;width:min(780px,94vw);height:min(600px,86vh);max-width:calc(100vw - 16px);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);background:var(--cl-panel);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);border-radius:18px;
    box-shadow:0 30px 80px rgba(0,0,0,.75);font:14px/1.5 'Segoe UI',Tahoma,system-ui,sans-serif;
    opacity:0;visibility:hidden;transform:translateY(14px) scale(.97);
    transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  #cl-panel.open{opacity:1;visibility:visible;transform:none;transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}

  .cl-head{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;cursor:move;user-select:none;
    background:color-mix(in srgb,var(--cl-panel) 75%,#000);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .cl-title{display:flex;align-items:center;gap:10px}
  .cl-title b{font-size:15px;font-weight:700;color:color-mix(in srgb,var(--cl-accent) 35%,#fff);letter-spacing:.4px}
  .cl-title > span{font-size:12px;color:var(--cl-muted)}
  .cl-beta{font:700 10px/1 'Segoe UI',sans-serif;letter-spacing:1px;padding:4px 7px;border-radius:6px;font-style:normal;background:var(--cl-accent);color:#fff}
  .cl-ver{font:600 11px/1 Consolas,monospace;color:var(--cl-muted);padding:4px 6px;border-radius:6px;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-x{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-muted);transition:background .3s,color .3s,transform .4s var(--cl-ease)}
  .cl-x:hover{background:var(--cl-hover);color:#fff;transform:rotate(90deg)}
  .cl-main{flex:1;display:flex;min-height:0}
  .cl-nav{width:190px;padding:14px 10px;display:flex;flex-direction:column;gap:6px;background:color-mix(in srgb,var(--cl-panel) 80%,#000);border-right:1px solid color-mix(in srgb,var(--cl-accent) 18%,transparent)}
  .cl-tab{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;color:var(--cl-muted);font-weight:600;transition:background .4s var(--cl-ease),color .4s var(--cl-ease),transform .4s var(--cl-ease)}
  .cl-tab svg{width:17px;height:17px;flex:0 0 17px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .cl-tab:hover{background:var(--cl-hover);color:#fff;transform:translateX(3px)}
  .cl-tab.act{background:color-mix(in srgb,var(--cl-accent) 22%,transparent);color:#fff;box-shadow:inset 3px 0 0 var(--cl-accent)}
  .cl-body{flex:1;padding:22px 24px;overflow:auto;min-width:0;display:flex;flex-direction:column}
  .cl-pane{display:none}
  .cl-pane.act{display:block;animation:clPane .55s var(--cl-ease)}
  #cl-panel:not(.logged) .cl-nav{display:none}
  #cl-panel:not(.logged) .cl-pane{display:none!important}
  #cl-panel:not(.logged) .cl-pane[data-pane=auth]{display:block!important;animation:clPane .55s var(--cl-ease)}
  #cl-panel.logged .cl-pane[data-pane=auth]{display:none!important}

  /* Главная: всё по центру, подпись внизу */
  .cl-pane.act.cl-home{display:flex;flex-direction:column;flex:1;min-height:0}
  .cl-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px}
  .cl-hero h2{margin:0 0 14px;font-size:34px;font-weight:800;line-height:1.2;color:#fff}
  .cl-hero h2 em{font-style:normal;color:var(--cl-accent)}
  .cl-hero p{margin:0 0 26px;color:var(--cl-muted);font-size:16px}
  .cl-status{display:inline-flex;align-items:center;gap:10px;padding:9px 16px;border-radius:999px;
    background:rgba(255,255,255,.04);border:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent);font-weight:600;font-size:13px}
  .cl-foot{text-align:center;color:var(--cl-muted);font-size:12px;padding-top:14px;letter-spacing:.3px}

  /* Профиль */
  .cl-prof{display:flex;align-items:center;gap:20px;padding:18px 20px;border-radius:16px;
    background:rgba(255,255,255,.025);border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent)}
  .cl-avatar{width:92px;height:92px;border-radius:50%;overflow:hidden;flex:0 0 92px;
    border:2px solid color-mix(in srgb,var(--cl-accent) 60%,transparent);background:#050507}
  .cl-avatar img{width:100%;height:100%;object-fit:cover;display:block}
  .cl-pinfo{display:flex;flex-direction:column;gap:10px;min-width:0}
  .cl-nick{font-size:22px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cl-days{display:inline-flex;align-items:center;gap:8px;padding:6px 12px;border-radius:9px;width:max-content;
    background:color-mix(in srgb,var(--cl-accent) 15%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);color:#fff;font-weight:700}
  .cl-days svg{width:16px;height:16px;fill:#60a5fa}
  .cl-days span{font-weight:500;color:var(--cl-muted);font-size:12px}

  .cl-card{background:rgba(255,255,255,.025);border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);border-radius:14px;padding:14px 16px;margin-top:14px;transition:border-color .45s var(--cl-ease)}
  .cl-card:hover{border-color:color-mix(in srgb,var(--cl-accent) 40%,transparent)}
  .cl-sec{font-weight:700;color:color-mix(in srgb,var(--cl-accent) 35%,#fff);margin-bottom:6px;font-size:13px;letter-spacing:.3px}
  .cl-lbl{display:block;margin:10px 0 5px;color:var(--cl-muted);font-size:12px}
  .cl-lbl:first-child{margin-top:0}
  .cl-in{width:100%;padding:9px 11px;border-radius:9px;border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);background:rgba(0,0,0,.35);color:#f4f1fb;outline:none;font:inherit;transition:border-color .35s,box-shadow .35s}
  .cl-in:focus{border-color:var(--cl-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cl-accent) 22%,transparent)}
  .cl-sw{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 2px;cursor:pointer;color:#dcd6ea}
  .cl-sw input{appearance:none;width:40px;height:22px;border-radius:999px;background:#2a2238;position:relative;cursor:pointer;transition:background .4s var(--cl-ease);flex:0 0 40px}
  .cl-sw input::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#e9e6f2;transition:left .4s var(--cl-ease)}
  .cl-sw input:checked{background:var(--cl-accent)}
  .cl-sw input:checked::after{left:21px}
  .cl-range{width:100%;accent-color:var(--cl-accent);margin:6px 0 2px}
  .cl-seg{display:flex;gap:8px;margin:8px 0 6px}
  .cl-seg label{flex:1;text-align:center;padding:9px 0;border-radius:10px;border:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent);background:rgba(0,0,0,.35);cursor:pointer;color:color-mix(in srgb,var(--cl-accent) 40%,#fff);font-weight:600;transition:background .4s var(--cl-ease),color .4s}
  .cl-seg label:hover{background:var(--cl-hover)}
  .cl-seg input{display:none}
  .cl-seg label:has(input:checked){background:var(--cl-accent);border-color:var(--cl-accent);color:#fff}
  .cl-color{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 2px;color:#dcd6ea}
  .cl-color input[type=color]{-webkit-appearance:none;appearance:none;width:52px;height:30px;border:1px solid rgba(255,255,255,.15);border-radius:8px;background:none;padding:0;cursor:pointer;transition:transform .35s var(--cl-ease)}
  .cl-color input[type=color]:hover{transform:scale(1.06)}
  .cl-color input[type=color]::-webkit-color-swatch-wrapper{padding:2px}
  .cl-color input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}
  .cl-btnp{width:100%;margin-top:10px;padding:10px;border:0;border-radius:10px;cursor:pointer;color:#fff;font:600 14px/1.2 inherit;background:var(--cl-accent);transition:filter .35s,transform .3s var(--cl-ease),box-shadow .35s}
  .cl-btnp:hover{filter:brightness(1.15);box-shadow:0 6px 18px color-mix(in srgb,var(--cl-accent) 35%,transparent);transform:translateY(-1px)}
  .cl-btnp:active{transform:scale(.98)}
  .cl-btnp.sec{background:var(--cl-hover);border:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .cl-btnp.sec:hover{filter:brightness(1.2)}
  .cl-btnp.small{width:auto;padding:8px 14px;margin-top:0}
  .cl-msg{margin-top:12px;color:color-mix(in srgb,var(--cl-accent) 45%,#fff);font-size:12px;min-height:16px}
  .cl-auth{max-width:370px;margin:0 auto;padding-top:10px}
  .cl-auth h2{margin:0 0 4px;font-size:22px;color:#fff}
  .cl-auth .cl-hint{margin:0 0 16px;color:var(--cl-muted);font-size:13px}
  .cl-row{display:flex;gap:8px;flex-wrap:wrap}

  /* Предложения */
  .cl-offer h2{margin:0 0 6px;font-size:22px;color:#fff}
  .cl-offer .cl-hint{margin:0 0 14px;color:var(--cl-muted);font-size:13px}
  .cl-list{margin:0 0 6px;padding-left:20px;color:#dcd6ea}
  .cl-list li{margin:6px 0}
  .cl-contact{display:flex;flex-direction:column;gap:8px;color:#dcd6ea}
  .cl-contact a{color:color-mix(in srgb,var(--cl-accent) 40%,#fff);text-decoration:none;font-weight:600;transition:color .3s}
  .cl-contact a:hover{color:#fff;text-decoration:underline}

  #cl-win{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.98);width:min(920px,92vw);height:min(620px,84vh);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);border-radius:16px;background:var(--cl-panel);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s .45s}
  #cl-win.open{opacity:1;visibility:visible;transform:translate(-50%,-50%);transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s}
  #cl-win .cl-head{cursor:default}
  .cl-wbody{overflow:auto;padding:6px 0;font:12px/1.55 Consolas,monospace;color:#fff}
  .cl-wbody div{padding:7px 20px;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 10%,transparent);transition:background .25s}
  .cl-wbody div:nth-child(even){background:rgba(255,255,255,.02)}
  .cl-wbody div:hover{background:var(--cl-hover)}
  `;

  const ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    look: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    brush: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    drop: '<svg viewBox="0 0 24 24"><path d="M12 2s7 7.5 7 12.5A7 7 0 0 1 5 14.5C5 9.5 12 2 12 2z"/></svg>',
  };

  function applyTheme() {
    const t = getTheme();
    uiHost.style.setProperty('--cl-accent', t.accent);
    uiHost.style.setProperty('--cl-panel', t.panel);
    uiHost.style.setProperty('--cl-hover', t.hover);
  }

  /* ---------- Статус скрипта на главной и в пузыре ---------- */
  function renderStatus() {
    const on = isActive();
    q('#cl-status-dot').className = 'cl-dot ' + (on ? 'ok' : 'off');
    q('#cl-status-text').textContent = on ? 'Скрипт работает' : 'Скрипт выключен';
    q('#cl-bubble-text').textContent = on ? 'CustomLogs запущен и готов к работе' : 'CustomLogs выключен';
    q('#cl-bubble-dot').className = 'cl-dot ' + (on ? 'ok' : 'off');
  }

  /* ---------- Лимит строк ---------- */
  function applyLimit() {
    if (!isActive() || !cfg('limitOn')) return;
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

  /* ---------- Поиск по всем дням периода ---------- */
  let busy = false;

  async function fetchRows(params) {
    const res = await fetch(`${location.pathname}?${params.toString()}`, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    return [...doc.querySelectorAll('table tbody tr')]
      .map(tr => tr.textContent.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  }

  function maskPrivate(txt) {
    let out = txt;
    if (cfg('ipHide')) out = out.replace(IP_ALL, '•••.•••.•••.•••');
    if (cfg('moneyHide')) out = out.replace(MONEY_RE, 'I: скрыто');
    return out;
  }

  async function runSearch() {
    const msg = s => { q('#cl-msg').textContent = s; };
    if (!isActive()) return msg('Скрипт выключен в настройках');
    const acc = getAcc();
    if (!acc || busy) return;

    const nick = q('#cl-nick').value.trim();
    const kw = q('#cl-kw').value.trim().toLowerCase();
    const type = q('#cl-type').value;
    const fromV = q('#cl-from').value, toV = q('#cl-to').value;
    if (!fromV || !toV) return msg('Укажи период');
    const from = new Date(fromV), to = new Date(toV);
    if (!(from < to)) return msg('Период «от» должен быть раньше «до»');

    const windows = [];
    for (let t = from.getTime(); t < to.getTime(); t += DAY_MS) {
      windows.push([new Date(t), new Date(Math.min(t + DAY_MS - 1000, to.getTime()))]);
    }
    if (windows.length > MAX_DAYS) return msg(`Максимум ${MAX_DAYS} дней за один поиск`);
    windows.reverse();

    busy = true;
    const found = [];
    let capped = 0;
    try {
      for (let i = 0; i < windows.length; i++) {
        msg(`День ${i + 1} из ${windows.length}, найдено: ${found.length}…`);
        const p = new URLSearchParams();
        p.set('server_number', acc.server);
        p.set('min_period', fmtSite(windows[i][0]));
        p.set('max_period', fmtSite(windows[i][1]));
        p.set('limit', '1000');
        p.set('sort', 'desc');
        if (nick) p.set('player', nick);
        if (type) p.append('type[]', type);

        const rows = await fetchRows(p);
        if (rows.length >= 1000) capped++;
        const nickLow = nick.toLowerCase();
        for (const txt of rows) {
          const low = txt.toLowerCase();
          if (kw && !low.includes(kw)) continue;
          if (nickLow && !low.includes(nickLow)) continue;
          found.push(maskPrivate(txt));
        }
      }
      msg(`Готово: найдено ${found.length} строк` + (capped ? `. Лимит 1000 достигнут в ${capped} дн., сузь период` : ''));
      showResults(found);
    } catch (e) {
      msg('Ошибка загрузки: ' + e.message);
    } finally {
      busy = false;
    }
  }

  function showResults(lines) {
    const w = q('#cl-win');
    q('#cl-wtitle').textContent = `Результаты поиска: ${lines.length}`;
    const body = q('.cl-wbody', w);
    const frag = document.createDocumentFragment();
    if (!lines.length) {
      const d = document.createElement('div');
      d.textContent = 'Ничего не найдено';
      frag.appendChild(d);
    }
    lines.slice(0, MAX_RENDER).forEach(t => {
      const d = document.createElement('div');
      d.textContent = t;
      frag.appendChild(d);
    });
    if (lines.length > MAX_RENDER) {
      const d = document.createElement('div');
      d.textContent = `Показаны первые ${MAX_RENDER} строк из ${lines.length}. Сузь период или ключевое слово.`;
      frag.appendChild(d);
    }
    body.replaceChildren(frag);
    w.classList.add('open');
  }

  /* ---------- UI ---------- */
  let panel, btn, bubble;

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
  }

  function activateTab(name) {
    qa('.cl-tab').forEach(t => t.classList.toggle('act', t.dataset.tab === name));
    qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === name));
  }

  function renderAuth() {
    const acc = getAcc();
    panel.classList.toggle('logged', !!acc);
    if (acc) {
      q('#cl-accinfo').textContent = `Аккаунт: ${acc.nick} · сервер ${acc.server} ${serverName(acc.server)}`;
      q('#cl-pnick').textContent = acc.nick;
      q('#cl-pserver').textContent = `Сервер ${acc.server} · ${serverName(acc.server)}`;
      q('#cl-setserver').value = acc.server;
    } else {
      q('#cl-pnick').textContent = 'Гость';
      q('#cl-pserver').textContent = 'Войди, чтобы пользоваться поиском';
    }
    q('#cl-days').textContent = daysWithScript();
  }

  function renderAvatar() {
    q('#cl-avimg').src = cfg('avatar') || FIGURE;
  }

  function placeBubble() {
    const r = btn.getBoundingClientRect();
    const space = { top: r.top, bottom: innerHeight - r.bottom, left: r.left, right: innerWidth - r.right };
    bubble.dataset.pos = Object.keys(space).sort((a, b) => space[b] - space[a])[0];
  }

  function showBubble() {
    placeBubble();
    bubble.classList.add('show');
    setTimeout(() => bubble.classList.remove('show'), 5000);
  }

  function buildUI() {
    const serverOpts = SERVERS.map(([n, name]) => `<option value="${n}">[${n}] ${name}</option>`).join('');
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limitVal = cfg('limit');
    const limitRadios = LIMITS.map(n =>
      `<label><input type="radio" name="cl-lim" value="${n}" ${n === limitVal ? 'checked' : ''}><span>${n}</span></label>`).join('');
    const th = getTheme();
    const blurVal = clamp(+cfg('blur'), 0, 20);

    ui.innerHTML = `
      <style>${CSS}</style>
      <div id="cl-btn" title="CustomLogs — клик: меню, Alt + тяни: перемещение">
        <img src="${FIGURE}" alt="">
        <div class="cl-bubble"><span class="cl-dot ok" id="cl-bubble-dot"></span><span id="cl-bubble-text"></span></div>
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
            <div class="cl-tab" data-tab="settings">${ICON.gear}<span>Настройки</span></div>
            <div class="cl-tab" data-tab="offer">${ICON.chat}<span>Предложения</span></div>
          </div>
          <div class="cl-body">

            <div class="cl-pane" data-pane="auth">
              <div class="cl-auth">
                <h2>Вход в CustomLogs</h2>
                <p class="cl-hint">Локальный профиль в этом браузере</p>
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
              <div class="cl-hero">
                <h2>Добро Пожаловать в <em>Custom Logs!</em></h2>
                <p>Приятного проживания в логах</p>
                <div class="cl-status"><span class="cl-dot ok" id="cl-status-dot"></span><span id="cl-status-text"></span></div>
              </div>
              <div class="cl-foot">Разработчик - Without Custom</div>
            </div>

            <div class="cl-pane" data-pane="profile">
              <div class="cl-prof">
                <div class="cl-avatar"><img id="cl-avimg" src="${FIGURE}" alt=""></div>
                <div class="cl-pinfo">
                  <div class="cl-nick" id="cl-pnick">Гость</div>
                  <div class="cl-days">${ICON.drop}<b id="cl-days">0</b><span>дней со скриптом</span></div>
                  <div class="cl-acc" id="cl-pserver" style="color:var(--cl-muted);font-size:13px"></div>
                </div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Аватарка</div>
                <input class="cl-in" type="file" id="cl-avfile" accept="image/*">
                <div class="cl-row">
                  <button class="cl-btnp small" id="cl-avsave">Сохранить аватарку</button>
                  <button class="cl-btnp sec small" id="cl-avreset">Сбросить</button>
                </div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Аккаунт</div>
                <div class="cl-acc" id="cl-accinfo" style="color:var(--cl-muted);font-size:13px"></div>
                <button class="cl-btnp sec" id="cl-goset">Настройки профиля</button>
              </div>
            </div>

            <div class="cl-pane" data-pane="search">
              <div class="cl-card">
                <label class="cl-lbl">Ник игрока (Nick_Name)</label>
                <input class="cl-in" type="text" id="cl-nick" placeholder="Kent_Dairo">
                <label class="cl-lbl">Тип действия</label>
                <select class="cl-in" id="cl-type"><option value="">Все типы</option></select>
                <label class="cl-lbl">Ключевое слово в строке</label>
                <input class="cl-in" type="text" id="cl-kw" placeholder="например: PayPass">
                <label class="cl-lbl">Период от</label>
                <input class="cl-in" type="datetime-local" id="cl-from" value="${toLocalInput(startOfDay)}">
                <label class="cl-lbl">Период до</label>
                <input class="cl-in" type="datetime-local" id="cl-to" value="${toLocalInput(now)}">
              </div>
              <button class="cl-btnp" id="cl-go">Искать по всем дням периода</button>
              <div class="cl-msg" id="cl-msg"></div>
            </div>

            <div class="cl-pane" data-pane="look">
              <div class="cl-card">
                <label class="cl-sw"><span>Включить свой фон на весь сайт</span>
                  <input type="checkbox" id="cl-bgon" ${cfg('bgOn') ? 'checked' : ''}></label>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Фон</div>
                <label class="cl-lbl">Ссылка на фото / гифку</label>
                <input class="cl-in" type="text" id="cl-bgurl" placeholder="https://i.imgur.com/....gif"
                  value="${cfg('bgUrl').startsWith('data:') ? '' : cfg('bgUrl')}">
                <label class="cl-lbl">Или загрузить файл (картинка / гиф)</label>
                <input class="cl-in" type="file" id="cl-bgfile" accept="image/*">
                <div class="cl-row">
                  <button class="cl-btnp small" id="cl-bgsave">Сохранить фон</button>
                  <button class="cl-btnp sec small" id="cl-bgclear">Сбросить фон</button>
                </div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Блюр фона: <span id="cl-blurv">${blurVal}</span> px</div>
                <input class="cl-range" type="range" id="cl-blur" min="0" max="20" value="${blurVal}">
              </div>
            </div>

            <div class="cl-pane" data-pane="custom">
              <div class="cl-card">
                <div class="cl-sec">Цвета меню</div>
                <div class="cl-color"><span>Акцент (кнопки, активные вкладки, рамки)</span>
                  <input type="color" id="cl-c-accent" value="${th.accent}"></div>
                <div class="cl-color"><span>Фон меню</span>
                  <input type="color" id="cl-c-panel" value="${th.panel}"></div>
                <div class="cl-color"><span>Наведение на вкладки и кнопки</span>
                  <input type="color" id="cl-c-hover" value="${th.hover}"></div>
              </div>
              <button class="cl-btnp sec" id="cl-c-reset">Сбросить к стандартным цветам</button>
            </div>

            <div class="cl-pane" data-pane="settings">
              <div class="cl-card">
                <div class="cl-sec">Приватность логов</div>
                <label class="cl-sw"><span>Скрывать IP (столбец и адреса в поиске)</span>
                  <input type="checkbox" id="cl-ipb" ${cfg('ipHide') ? 'checked' : ''}></label>
                <label class="cl-sw"><span>Скрывать деньги (столбец и суммы в поиске)</span>
                  <input type="checkbox" id="cl-moneyb" ${cfg('moneyHide') ? 'checked' : ''}></label>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Строк на странице логов</div>
                <div class="cl-seg">${limitRadios}</div>
                <label class="cl-sw"><span>Автоматически выставлять это значение</span>
                  <input type="checkbox" id="cl-limon" ${cfg('limitOn') ? 'checked' : ''}></label>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Аккаунт</div>
                <label class="cl-lbl">Сервер для поиска</label>
                <select class="cl-in" id="cl-setserver">${serverOpts}</select>
                <button class="cl-btnp sec" id="cl-logout">Выйти из аккаунта</button>
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
                <div class="cl-contact">
                  <a href="https://vk.ru/lugneer" target="_blank" rel="noopener noreferrer">VK - https://vk.ru/lugneer</a>
                  <span>TG - @customspb</span>
                  <span style="color:var(--cl-muted);font-size:12px">С пересылкой на эти аккаунты</span>
                </div>
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

    const typeSel = q('#cl-type');
    document.querySelectorAll('select[name="type[]"] option').forEach(o => {
      if (!o.value) return;
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.textContent.trim();
      typeSel.appendChild(opt);
    });

    qa('.cl-tab').forEach(tab => tab.onclick = () => activateTab(tab.dataset.tab));
    q('.cl-x').onclick = () => togglePanel(false);
    q('#cl-wclose').onclick = () => q('#cl-win').classList.remove('open');
    document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });

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
      activateTab('home');
    }
    q('#cl-a-login').onclick = () => authSubmit('login');
    q('#cl-a-reg').onclick = () => authSubmit('register');
    q('#cl-go').onclick = runSearch;

    /* Профиль */
    q('#cl-avsave').onclick = () => {
      const file = q('#cl-avfile').files[0];
      if (!file) return;
      if (file.size > 1.5 * 1024 * 1024) {
        q('#cl-avfile').value = '';
        alert('Аватарка больше 1.5 МБ, выбери файл поменьше');
        return;
      }
      const fr = new FileReader();
      fr.onload = () => { setCfg('avatar', fr.result); renderAvatar(); };
      fr.readAsDataURL(file);
    };
    q('#cl-avreset').onclick = () => { setCfg('avatar', ''); renderAvatar(); q('#cl-avfile').value = ''; };
    q('#cl-goset').onclick = () => activateTab('settings');

    /* Интерфейс */
    q('#cl-bgon').onchange = e => { setCfg('bgOn', e.target.checked); applyBg(); };
    q('#cl-bgsave').onclick = () => {
      const file = q('#cl-bgfile').files[0];
      const url = q('#cl-bgurl').value.trim();
      const apply = val => {
        setCfg('bgUrl', val);
        setCfg('bgOn', true);
        q('#cl-bgon').checked = true;
        applyBg();
      };
      if (file) {
        const fr = new FileReader();
        fr.onload = () => apply(fr.result);
        fr.readAsDataURL(file);
      } else if (url) apply(url);
    };
    q('#cl-bgclear').onclick = () => {
      setCfg('bgUrl', '');
      setCfg('bgOn', false);
      q('#cl-bgon').checked = false;
      q('#cl-bgurl').value = '';
      applyBg();
    };
    q('#cl-blur').oninput = e => {
      setCfg('blur', +e.target.value);
      q('#cl-blurv').textContent = e.target.value;
      applyBg();
    };

    /* Кастомизация */
    const saveTheme = patch => { setCfg('theme', { ...getTheme(), ...patch }); applyTheme(); };
    q('#cl-c-accent').oninput = e => saveTheme({ accent: e.target.value });
    q('#cl-c-panel').oninput = e => saveTheme({ panel: e.target.value });
    q('#cl-c-hover').oninput = e => saveTheme({ hover: e.target.value });
    q('#cl-c-reset').onclick = () => {
      setCfg('theme', {});
      applyTheme();
      q('#cl-c-accent').value = THEME_DEF.accent;
      q('#cl-c-panel').value = THEME_DEF.panel;
      q('#cl-c-hover').value = THEME_DEF.hover;
    };

    /* Настройки */
    q('#cl-ipb').onchange = e => { setCfg('ipHide', e.target.checked); syncSite(true); };
    q('#cl-moneyb').onchange = e => { setCfg('moneyHide', e.target.checked); syncSite(true); };
    qa('input[name="cl-lim"]').forEach(r => r.onchange = () => {
      setCfg('limit', +r.value);
      applyLimit();
    });
    q('#cl-limon').onchange = e => { setCfg('limitOn', e.target.checked); applyLimit(); };
    q('#cl-setserver').onchange = e => {
      const acc = getAcc();
      if (acc) { saveAcc(acc.key, { server: e.target.value }); renderAuth(); }
    };
    q('#cl-logout').onclick = () => {
      setCfg('session', null);
      renderAuth();
      activateTab('home');
    };

    renderStatus();
    renderAuth();
    renderAvatar();
  }

  /* ---------- Запуск ---------- */
  if (!cfg('first')) setCfg('first', Date.now());
  applyTheme();
  buildUI();
  applyBg();
  syncSite(true);
  applyLimit();
  setTimeout(showBubble, 400);

  // Перестраиваем правила только когда таблица сайта действительно поменялась
  let syncTimer;
  new MutationObserver(() => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncSite(false), 300);
  }).observe(document.body, { childList: true, subtree: true });
})();