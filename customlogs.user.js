// ==UserScript==
// @name         CustomLogs — Rodina RP
// @namespace    customlogs.rodina
// @version      4.13.0
// @description  Фильтры (Пробив, Махинатор, Вирты), Логи, профиль, анимации, фон логов, кастомизация, обновления
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
  const VERSION = 'v4.13.0';
  const VERSION_NUM = '4.13.0';   // держи равным @version в заголовке
  const UPDATE_URL = 'https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js';
  const OWNER_NICK = 'without_custom';
  const OWNER_PASS = '124578';
  const FIGURE = 'data:image/webp;base64,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';
  const LOGO = 'data:image/webp;base64,UklGRkQGAABXRUJQVlA4WAoAAAAQAAAAJwAAHwAAQUxQSEECAAABoGxtm2nbeatm1drHis0LsG3btm327LTMlp10bTu3kJGWl1dhfo1ZS3cQEROgmDTnqPtxUEsh5noeSroWx35vfK9imkP8fQNnYPlJx37SG0k5pHo2Cjq3ctYDrSWv6zs1Y6xnUNd/YcA453kv7XLYiff1oqQQ63oKpfoaio5b9SCwZK+3Xm1LUqyn+XWzQrXALXrruI0NsN3xp/zTk+JECjq2AHvswLJrL8E7Dyxe66W2Up4k5QeBauG2twf/v/Dco4/tSEXlHLDtvVKeQBI4u6+0z/LNN9ls88UUDR5u+Ul5CsOn2p6ywRSpHMs/zWlMGt2PNXvrY2xpYsuynurCSO9Di7d1MK2lS6ZeZv2glDXcw5pq/U//3H2jjzvt3pTtzkdr/i2k3N6LynGGXuACBc3wt64k1RrujIdF/43WsTu9LcVcT66sZg7tvXBg1oz+WwDu6klRU6ZG1C54gCd1Bs561nqxLcV6ombQ1ziA3f74ZX1nwMK293alOEXSp8u9bRyhK3E0Paz1YlvKk2R9sYCh+c0AYwpUFra9t6tJQ38PPEV1lljvnHMGwMPqj+s8JuXvtnamlIYrmbhqcYT6YzTSkdaX9v1fz1xy2SUXXbIlFqCqdm9LsS7E+m5ciW1OOueSiyfBsu19XSlkSUq6g1bBMr2FtV5sS4qSRroT16ByZTOOysIOx39UK2Yp6Dp8Y8Ye7N7vSKpH8bcVxs6OygFHf9qVhvpmuTWzA6zDLbvpBw31En4u4IDlZ7bTW3gAAFZQOCDcAwAAMBUAnQEqKAAgAD4xFIhCoiEhFVb8IAMEtgBOnKCpDyW7APYEsn9a+8eSh0mfMu7oD9IP2K99HpAOkW/YD2APKu/Yr4D/2M/bz2av/bdXOg68pewuUp+7ZxvITfln+D/K/+d64j+P/5bjBu1fO3/jfTc/sfLp89/6n+w/AH/I/5F/dfzJ/wf/15Sj9JhGZgh5tvRxcHrOdM1bcKk34NG6dxRRsicHXiqQUnQjxpVBTvgoAAD+x9HJD3OhZge0n/ao/o/uPpEHXrRo2C9SVCrMZLGtEhhFJLXrX/9/wNJ7vZam+6AAdP0Jb8p1mw4xE+Ll6/qofBSVf/M1FuarcvhjwsuMLRy59Hz2L/Pqg0Oqp0BW6tq6Ay6+d65zXBbSkaMck+vwK4kIUAh2uPuqf/6iarsOYpD2uU1xXSwG15LvQOz+9oX+NgYKTKvP8TXPg1MW0xarUA5QMAEyK+s08bR29iEg2ESSl1igrXrZo2aGgeGNLU+/Iwkn9NVknI5qsWAs05UX2Fl0UVXn7cKglQ+X65xHrLp8lDcfoAdv/froFX8zddZmeEi6weUdqduPfBtFd/moDW8Xfnfr8cIfB4Udj64ilV55Z/7bfpwsWwHw+BZYdZX9TevNO5PBK30i0dO4OSei60f/EqUf8YN+zsc+SK8VfopzCoFYvo/veskn0u/9x/w//xpU/vx7wvyGhCp1iqPo+5JPv9bDc5y0/XLduTM/JQ3K76p0/y62hTGsgVVkLMVI9uUclZDjvWe/ad31DMsaAkCxr1w9gPwouH6xzP9at70YidA0BoZPxYCVabjEX++y8/hubvP7wp5BrJnszJJNmPk/8QdaLmeVGPhJHtwf5JqU6z89JqPffGIH74YzZVUUJ3/CkwmGSbt/xmp9mqcRMRdyiZT1mMEJ8jcOmdAIaJT+MfBOqr7WCXT1+2dLSEZFHYuBLTOzfqLO7TtMSsYwX8atQIx+rh2eTx3MiHFff7+IkK//Ndjszbx9QVn0R2NlTFndD/MB/t3bAED4hmhZ28fs5+TFsTiBE4ZAPCLFT0qAS3Vj7BRzrqYZZOodWEf5esclpExMdLxrBkHiVRCcClR7x9VBoKq16jzWfFnn0dC7y9GlAUw1qwLuC+mrtV9ik6FZJPvlwUojQWd1L2WkOB/D/EtFF73hZQPaeQnAnMnyXQIYqMXdf+3kFqnSB33qU3wHcucP2cKAflX2CAnhu6poL3KmA/6gHPdS3GU++bY3SOG367pbZuM+c3sywVY6XU2+cbxlhvoz2P/17rYOet5RtemOJsnhgm1n8ECCs0k3/TXzvgAAAA==';

  const IDLE_MS = 10 * 60 * 1000;
  const UPD_CHECK_MS = 30 * 60 * 1000;
  const INACTIVE_DAYS = 30;
  const UPD_CRIT_DAYS = 1;
  const UPD_BLOCK_DAYS = 3;
  const UPD_RED_DAYS = 30;
  const STREAK_RESET_DAYS = 7;
  const STREAK_PROTECT = 200;
  const STREAK_PROTECT_RESET = 30;
  const CD_OPTIONS = [5, 10, 15];
  const PER_OPTIONS = [90, 150, 300, 500, 1000];
  const MAX_RETRY_429 = 4;
  const ROW_CAP = 20000;
  const MAX_RENDER = 3000;
  const JOBS_CAP = 30;
  const SAVE_EVERY = 5;
  const DAY_MS = 86400000;
  const BTN_W = 56, BTN_H = 92;
  const IP_ALL = /\b\d{1,3}(?:[.,]\d{1,3}){3}\b/g;
  const MONEY_TXT_RE = /\d[\d ,]*\s*(?:руб\.?|денег)/g;
  const WARN_TEXT = 'Скрипт — неофициальное дополнение к сайту логов. Автор (Without Custom) не несёт ответственности за последствия его использования. Не злоупотребляй массовыми запросами, соблюдай правила сервера и не передавай свой аккаунт посторонним.';
  const CRASH_TEXT = 'Ой, похоже сломалось, я на всякий случай скачала тебе файл, надеюсь поможет 😢';
  const DONE_TEXT = 'Приветик Чемпион, твоя проверка закончена, держи файл';
  const WELCOME_TXT = 'Буду стараться и дальше улучшать скрипт, спасибо что выбрали наш продукт.\nС уважением, Разработчик CustomLogs!';

  const TIERS = [
    { d: 0, c: '#6b7280', id: 'dim', name: 'огонёк ещё не набран' },
    { d: 10, c: '#9ca3af', id: 'grey', name: 'серый' },
    { d: 25, c: '#3b82f6', id: 'blue', name: 'синий' },
    { d: 50, c: '#22c55e', id: 'green', name: 'зелёный' },
    { d: 100, c: '#facc15', id: 'yellow', name: 'жёлтый' },
    { d: 200, c: '#ef4444', id: 'red', name: 'красный' },
    { d: 365, c: '#ef4444', id: 'grad', name: 'градиент' },
  ];
  const POSITIONS = ['Главный Администратор', 'Заместитель ГА', 'Куратор', 'Администратор'];
  const POS_VER = 2;
  const POS_CLS = { 'Главный Администратор': 'p-ga', 'Заместитель ГА': 'p-zga', 'Куратор': 'p-cur', 'Администратор': 'p-adm', 'Разработчик': 'p-dev', 'Пользователь': 'p-user' };
  const LIMITS = [100, 500, 1000];
  const SERVERS = [
    ['501', 'Центральный'], ['502', 'Южный'], ['503', 'Северный'], ['504', 'Восточный'],
    ['505', 'Западный'], ['506', 'Приморский'], ['507', 'Федеральный'],
    ['601', 'Москва (Mobile)'], ['602', 'Санкт-Петербург (Mobile)'],
  ];
  const PALETTE = [
    ['Черный', '#000000'], ['Белый', '#ffffff'], ['Красный', '#ef4444'],
    ['Темно-синий', '#1e3a8a'], ['Розовый', '#ec4899'], ['Фиолетовый', '#8b5cf6'],
  ];
  const DEF_THEME = {
    accent: { g: false, c1: '#8b5cf6', c2: '#3b82f6' },
    panel: { g: false, c1: '#0a0a0d', c2: '#1e1b4b' },
    hover: { g: false, c1: '#8b5cf6', c2: '#ec4899' },
  };
  const THEME_LABELS = { accent: 'Цвет менюшки', panel: 'Фон менюшки', hover: 'Наведение' };
  const FX_TYPES = [
    ['off', 'Выкл', ''], ['star', 'Звёздочки', '⭐'], ['butterfly', 'Бабочки', '🦋'],
    ['sun', 'Солнце', '☀️'], ['makima', 'Макимы', ''], ['bolt', 'Молнии', '⚡'],
    ['snow', 'Снежинки', '❄️'], ['bat', 'Летучие мыши', '🦇'],
  ];
  const PMODES = {
    nick: { label: 'Ник игрока (Nick_Name)', ph: 'Kent_Dairo', ex: 'Все действия игрока за период. Ниже можно добавить ключевые слова через запятую.' },
    kw: { label: 'Ключевые слова (через запятую)', ph: 'PayPass, бочка, Lada', ex: 'Строки, где есть хотя бы одно из слов.' },
    type: { label: 'Тип запроса из логов', ph: 'Получение приза PayPass', ex: 'Начни писать и выбери тип из подсказок. Это точный тип из списка сайта.' },
  };
  const MSG_ID = { probiv: '#cl-msg-p', mech: '#cl-msg-m', virt: '#cl-msg-v' };

  // История версий. Для каждого нового выпуска добавляй запись наверх.
  const CHANGELOG = [
    {
      version: '4.13.0', date: '12.10.2026', items: [
        { type: 'Добавлено', text: 'Роль «Разработчик» для аккаунта Without_Custom' },
        { type: 'Добавлено', text: 'Должности: Главный Администратор, Заместитель ГА, Куратор, Администратор' },
        { type: 'Изменено', text: 'Все уже зарегистрированные аккаунты получили должность «Администратор»; её можно поменять в настройках профиля' },
      ],
    },
    {
      version: '4.12.0', date: '12.10.2026', items: [
        { type: 'Изменено', text: 'Настройки переименованы в «Техничка», внутри два раздела: Логи и Скрипт' },
        { type: 'Изменено', text: 'Вместо секунд на запрос — строки за один запрос: 90, 150, 300, 500, 1000' },
        { type: 'Добавлено', text: 'Пауза между страницами логов 5 сек (можно поднять до 10 или 15 сек)' },
        { type: 'Добавлено', text: 'Вкладка «Логи»: все проверки с датой, можно открыть, скачать TXT или продолжить' },
        { type: 'Добавлено', text: 'Настройка сохранения: во вкладку «Логи», в файл .txt или в оба места' },
        { type: 'Добавлено', text: 'Анимация меню: звёздочки, бабочки, солнце, Макимы, молнии, снежинки, летучие мыши — с частотой и скоростью' },
        { type: 'Улучшено', text: 'Градиент: при включении два цвета, при выключении палитра и свой цвет' },
        { type: 'Улучшено', text: 'Наведение стало полупрозрачным и почти незаметным' },
        { type: 'Изменено', text: 'Фильтры по центру окна, на кнопках текст по центру' },
        { type: 'Изменено', text: 'Иконки: Пробив 🕵️, Махинатор ⛓️, Вирты 💰' },
        { type: 'Исправлено', text: 'На белом фоне логов контуры вкладок и названия ячеек чёрные' },
      ],
    },
    { version: '4.11.0', date: '12.10.2026', items: [
      { type: 'Исправлено', text: 'Ошибка HTTP 429: запросы идут с паузой' },
      { type: 'Добавлено', text: 'Новый профиль: баннер, аватар, сервер, VK и Telegram, должности' },
      { type: 'Добавлено', text: 'Кнопка «Стоп», продолжение поиска и файл при сбое' },
    ] },
    { version: '4.10.0', date: '12.10.2026', items: [
      { type: 'Удалено', text: 'Режимы оптимизации и вкладка «Оптимизация»' },
    ] },
  ];

  const KEY = {
    btnPos: 'cl_btn_pos', panelPos: 'cl_panel_pos', bgUrl: 'cl_bg_url', bgOn: 'cl_bg_on',
    banner: 'cl_banner', blur: 'cl_blur', theme: 'cl_theme', ipHide: 'cl_ip_hide',
    moneyHide: 'cl_money_hide', limit: 'cl_limit', limitOn: 'cl_limit_on', accounts: 'cl_accounts',
    session: 'cl_session', streak: 'cl_streak', updRemote: 'cl_upd_remote', critical: 'cl_critical',
    outdated: 'cl_outdated', autoUpd: 'cl_auto_upd', autoTried: 'cl_auto_tried', lastSeen: 'cl_last_seen',
    perReq: 'cl_per_req', cd: 'cl_cd', saveLogs: 'cl_save_logs', saveFile: 'cl_save_file',
    fx: 'cl_fx', jobs: 'cl_jobs', mech: 'cl_mech', posVer: 'cl_pos_ver', ownerInit: 'cl_owner_init',
  };
  const DEF = {
    btnPos: null, panelPos: null, bgUrl: '', bgOn: false, banner: '', blur: 0, theme: {},
    ipHide: true, moneyHide: false, limit: 100, limitOn: false, accounts: {}, session: null,
    streak: { last: '', days: 0 }, updRemote: '', critical: false, outdated: null,
    autoUpd: true, autoTried: '', lastSeen: '', perReq: 90, cd: 5, saveLogs: true, saveFile: false,
    fx: { type: 'star', count: 10, speed: 10 }, jobs: [],
    mech: { big: 1000000, cheap: 100000, res: 15, barrel: 3 },
    posVer: 0, ownerInit: 0,
  };
  const TRANSFER_RE = /(передал|перевел|отправил|перевод)/i;
  const SALE_RE = /(продал|продажа|продажу)/i;
  const CAR_RE = /(т\/с|транспорт|автомоб|машин|\bавто\b|ВАЗ|IVECO|Tesla|Ferrari|Porsche|Mitsubishi|BMW|Mercedes|Lada|Kia|Toyota|Nissan|Mazda|Hyundai|Audi)/i;
  const RES_RE = /(материал|камень|лён|укроп|руд|нефт|бочк|ресурс|дерев|металл|ткан|зерн|молок|мяс|рыб|золот|железо|уголь|бензин|топлив)/i;
  const BARREL_RE = /бочк/i;
  const EARN_RE = /(получил|заработал|выручк|продал|доход|выигрыш)/i;
  const SPEND_RE = /(потратил|оплатил|заплатил|штраф|купил|отдал|передал|перевел)/i;
  /* ============================================ */

  /* ---------- Утилиты ---------- */
  const cache = {};
  const cfg = k => (k in cache ? cache[k] : (cache[k] = GM_getValue(KEY[k], DEF[k])));
  const setCfg = (k, v) => { cache[k] = v; GM_setValue(KEY[k], v); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = n => String(n).padStart(2, '0');
  const fmtSite = d =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayDiff = (a, b) => {
    const [y1, m1, d1] = a.split('-').map(Number);
    const [y2, m2, d2] = b.split('-').map(Number);
    return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY_MS);
  };
  // Дата из логов (2026-10-11 14:34:24) или из datetime-local (2026-10-11T14:34)
  const parseDT = s => {
    const m = String(s || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    return isNaN(d) ? null : d;
  };
  const normDT = s => { const d = parseDT(s); return d ? fmtSite(d) : ''; };
  const addSec = (s, sec) => { const d = parseDT(s); return d ? fmtSite(new Date(d.getTime() + sec * 1000)) : s; };
  const fileDate = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`; };
  const dateTimeRu = ms => { const d = new Date(ms); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const serverName = n => (SERVERS.find(s => s[0] === n) || [])[1] || '';
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
    const n = parseInt(String(hex).slice(1), 16);
    return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
  };
  const hexRgba = (hex, a) => {
    const n = parseInt(String(hex).slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  };
  const splitKw = s => s.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  const plural = (n, f) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return f[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return f[1];
    return f[2];
  };
  const linkHtml = v => /^https?:\/\//i.test(v)
    ? `<a href="${esc(v)}" target="_blank" rel="noopener noreferrer">${esc(v)}</a>` : esc(v);
  const pause = ms => new Promise(res => {
    const end = Date.now() + ms;
    const t = setInterval(() => { if (stopFlag || Date.now() >= end) { clearInterval(t); res(); } }, 200);
  });

  /* Подсветка ников и сумм */
  function hl(text) {
    let s = esc(text);
    s = s.replace(/((?:Игрок|Игроку|Администратор)\s+)([^\s,.:;()\[\]<>]+)/g, (m, a, n) => `${a}<b class="nk">${n}</b>`);
    s = s.replace(/(\d[\d ,]*)(\s*(?:руб\.?|денег|AZ))/g, (m, a, b) => `<b class="mn">${a}${b}</b>`);
    return s;
  }
  const rowHtml = (date, html) => `<div class="r"><span class="d">${esc(date)}</span><span class="t">${html}</span></div>`;
  const secHtml = (title, n) => `<div class="sec">${esc(title)}<i>${n}</i></div>`;
  const infoHtml = text => `<div class="info">${esc(text)}</div>`;
  const playerHtml = (who, text) => `<div class="pl"><b class="nk">${esc(who)}</b><span>${esc(text)}</span></div>`;

  /* ---------- Огонёк ---------- */
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
      const keep = days >= STREAK_PROTECT ? gap <= STREAK_PROTECT_RESET : gap <= STREAK_RESET_DAYS;
      days = keep ? days + 1 : 1;
    }
    setCfg('streak', { last: today, days });
  }
  const FLAME_PATH = 'M12 2c.6 3.4 5 5.7 5 11a5 5 0 0 1-10 0c0-2.3 1.1-3.9 2.3-5.1.2 1.7.9 2.8 2 3.4C11.2 7.6 11.4 4.7 12 2z';
  function flameSvg(tier, size) {
    let fill = tier.c, defs = '', stroke = 'none', sw = 0;
    if (tier.id === 'grad') {
      defs = `<defs><linearGradient id="fgrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ef4444"/><stop offset="1" stop-color="#facc15"/></linearGradient></defs>`;
      fill = 'url(#fgrad)';
      stroke = '#000';
      sw = 1.2;
    }
    return `<svg class="flame-anim" width="${size}" height="${size}" viewBox="0 0 24 24">${defs}
      <path fill="${fill}" stroke="${stroke}" stroke-width="${sw}" d="${FLAME_PATH}"/></svg>`;
  }

  /* ---------- Аккаунт ---------- */
  function getAcc() {
    const k = cfg('session');
    const accs = cfg('accounts');
    return k && accs[k] ? { key: k, ...accs[k] } : null;
  }
  const isLogged = () => !!getAcc();
  const isOwner = () => { const a = getAcc(); return !!a && a.key === OWNER_NICK; };
  const posOf = acc => (acc.key === OWNER_NICK ? 'Разработчик' : (acc.position || 'Администратор'));
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

  /* Один раз: старые аккаунты получают «Администратор», владелец получает пароль */
  async function migrateAccounts() {
    const accs = cfg('accounts');
    let changed = false;
    if (cfg('posVer') !== POS_VER) {
      for (const k of Object.keys(accs)) {
        if (k !== OWNER_NICK) accs[k] = { ...accs[k], position: 'Администратор' };
      }
      setCfg('posVer', POS_VER);
      changed = true;
    }
    if (cfg('ownerInit') !== 1) {
      const old = accs[OWNER_NICK] || {};
      const salt = newSalt();
      accs[OWNER_NICK] = {
        ...old, nick: 'Without_Custom', salt,
        hash: await hashPass(OWNER_PASS, salt),
        server: old.server || '602', position: 'Разработчик',
        vk: old.vk || '', tg: old.tg || '',
      };
      setCfg('ownerInit', 1);
      changed = true;
    }
    if (changed) setCfg('accounts', accs);
  }

  /* ---------- Обновления ---------- */
  function updState() {
    const remote = cfg('updRemote');
    const outdated = !!remote && cmpVer(remote, VERSION_NUM) > 0;
    if (!outdated) return { remote, outdated: false, blocked: false, red: false, days: 0 };
    const rec = cfg('outdated');
    const days = rec && rec.ver === remote ? (Date.now() - rec.since) / DAY_MS : 0;
    const blocked = days >= (cfg('critical') ? UPD_CRIT_DAYS : UPD_BLOCK_DAYS);
    return { remote, outdated: true, blocked, red: days >= UPD_RED_DAYS, days };
  }

  /* =========================================================
     САЙТ: оформление одним <style> и классами на body.
     Стоковый фон ничего не меняет.
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

  const TXT_SEL = 'td,th,label,h1,h2,h3,h4,h5,p,span,.navbar,.navbar-brand,.nav-link,.dropdown-item,.app-nav-menu__item-link,.app-content-body-title,.table-description,.text-muted';

  function buildSiteCss(idx) {
    const blurShadow = '0 0 8px rgba(255,255,255,.9)';
    const fieldSelectors = [
      'form.filter input', 'form.filter select', 'form.filter textarea',
      'form.filter .form-control', 'form.filter .form-select',
      '.js_toolbar input', '.js_toolbar select', '.js_toolbar .form-select',
      '.select2-container', '.select2-container--default .select2-selection',
      '.select2-container--default .select2-selection--single',
      '.select2-container--default .select2-selection--multiple',
      '.select2-selection__rendered', '.select2-selection__arrow', '.select2-search__field',
    ].map(s => `body.cl-bg-on ${s}`).join(',\n');

    let css = `
      html:has(body.cl-bg-on), body.cl-bg-on, body.cl-bg-on html { background: transparent !important; }
      body.cl-bg-on :is(div,section,nav,main,table,thead,tbody,tr,td,th,.card,.card-body,.navbar,.app-sidebar,
        .app-content,.app-content-body,.app-nav,.dropdown-menu,.modal-content,.bg-white,.bg-dark,.bg-light,.shadow-sm) {
        background-color: transparent !important; background-image: none !important; box-shadow: none !important; }
      body.cl-bg-on :is(${TXT_SEL}) { color: #fff !important; }
      body.cl-bg-on.cl-tone-light :is(${TXT_SEL}) { color: #111 !important; }
      body.cl-bg-on.cl-tone-light :is(.navbar,.app-nav-menu__item-link,.nav-link,.btn,.card,.page-link,.dropdown-menu,
        .app-sidebar,.app-nav,table,td,th,tr,input,select,textarea) { border-color: #000 !important; }
      body.cl-bg-on.cl-tone-light .app-nav-menu__item-link { border: 1px solid #000 !important; }

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
      body.cl-bg-on.cl-tone-light ${fieldSelectors.split(',').map(s => s.trim()).join(', body.cl-bg-on.cl-tone-light ')} {
        color: #111 !important; -webkit-text-fill-color: #111 !important; border-color: #000 !important; }
      body.cl-bg-on .select2-container, body.cl-bg-on .select2-selection__rendered,
      body.cl-bg-on .select2-selection__arrow, body.cl-bg-on .select2-search__field { border: none !important; box-shadow: none !important; }
      body.cl-bg-on .select2-selection__placeholder { color: rgba(255,255,255,.65) !important; }
      body.cl-bg-on .select2-selection__choice { background: rgba(255,255,255,.18) !important; border: 1px solid rgba(255,255,255,.4) !important; color: #fff !important; }
      body.cl-bg-on .select2-dropdown { background: #1b1530 !important; border-color: rgba(255,255,255,.3) !important; }
      body.cl-bg-on .select2-results__option { background: transparent !important; color: #fff !important; }
      body.cl-bg-on .select2-results__option--highlighted { background: rgba(255,255,255,.15) !important; }
      body.cl-bg-on form.filter ::placeholder { color: rgba(255,255,255,.6) !important; }
      body.cl-bg-on form.filter option, body.cl-bg-on select option { background: #1b1530 !important; color: #fff !important; }
      body.cl-bg-on.cl-tone-light form.filter option, body.cl-bg-on.cl-tone-light select option { background: #fff !important; color: #111 !important; }

      body.cl-bg-on .pagination .page-link, body.cl-bg-on .pagination .page-item > span, body.cl-bg-on .page-link {
        background: transparent !important; background-color: transparent !important;
        color: #fff !important; border: 1px solid rgba(255,255,255,.45) !important; box-shadow: none !important; }
      body.cl-bg-on.cl-tone-light .pagination .page-link, body.cl-bg-on.cl-tone-light .page-link { color: #111 !important; }
      body.cl-bg-on .pagination .page-item.active .page-link, body.cl-bg-on .pagination .page-item.active > span {
        background-color: #c0392b !important; border-color: #c0392b !important; color: #fff !important; }

      body.cl-ip-hide .table-ip, body.cl-ip-hide .table-ip * {
        color: transparent !important; text-shadow: ${blurShadow} !important; pointer-events: none !important; }`;
    if (idx && idx.ip) css += `
      body.cl-ip-hide table tr > :nth-child(${idx.ip}), body.cl-ip-hide table tr > :nth-child(${idx.ip}) * {
        color: transparent !important; text-shadow: ${blurShadow} !important; pointer-events: none !important; user-select: none !important; }`;
    if (idx && idx.money) css += `
      body.cl-money-hide table tr > :nth-child(${idx.money}) { display: none !important; }`;
    return css;
  }

  let lastIdx = null;
  // Режим фона: 'img', 'black', 'white' или '' (стоковый, без изменений)
  function bgMode() {
    if (!working()) return '';
    if (cfg('bgOn') && cfg('bgUrl')) return 'img';
    const b = cfg('banner');
    return b === 'black' || b === 'white' ? b : '';
  }
  function syncBody() {
    const m = bgMode();
    document.body.classList.toggle('cl-bg-on', !!m);
    document.body.classList.toggle('cl-tone-light', m === 'white');
    document.body.classList.toggle('cl-ip-hide', working() && cfg('ipHide'));
    document.body.classList.toggle('cl-money-hide', working() && cfg('moneyHide'));
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
    const m = bgMode();
    const layer = bgRoot.getElementById('layer');
    layer.style.backgroundImage = m === 'img' ? `url("${cfg('bgUrl')}")` : 'none';
    layer.style.backgroundColor = m === 'black' ? '#000000' : m === 'white' ? '#ffffff' : 'transparent';
    layer.style.filter = m === 'img' && cfg('blur') ? `blur(${cfg('blur')}px)` : 'none';
    bgHost.style.display = m ? 'block' : 'none';
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

  let panel, btn, bubble, sayTimer = null, pending = null, sleeping = false;
  let busy = false, stopFlag = false, curKind = 'probiv', pMode = 'nick', typeOpts = [];
  let uploadCdUntil = 0, pendingUpload = null, shownJob = null;

  const CSS = `
  :host{--cl-accent:#8b5cf6;--cl-accent-fill:#8b5cf6;--cl-panel:#0a0a0d;--cl-panel-fill:#0a0a0d;
    --cl-hover:#8b5cf6;--cl-hover-soft:rgba(139,92,246,.13);--cl-text:#ebe8f5;--cl-muted:#9b93b5;--cl-head:#fff;
    --cl-field-bg:rgba(0,0,0,.35);--cl-field-text:#f4f1fb;--cl-on-accent:#fff;
    --cl-ok:#22c55e;--cl-off:#ef4444;--cl-warn:#f59e0b;--cl-ease:cubic-bezier(.16,1,.3,1);
    font-family:'Nunito','Segoe UI',system-ui,sans-serif;font-size:15px;line-height:1.55;letter-spacing:.2px;-webkit-font-smoothing:antialiased}
  button,input,select,textarea{font:inherit;color:inherit}
  *{box-sizing:border-box}
  @keyframes clPane{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes clFade{from{opacity:0}to{opacity:1}}
  @keyframes clIn{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
  @keyframes clPulseOk{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.55)}50%{box-shadow:0 0 0 7px rgba(34,197,94,0)}}
  @keyframes clPulseOff{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
  @keyframes clPulseWarn{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.6)}50%{box-shadow:0 0 0 7px rgba(245,158,11,0)}}
  @keyframes clBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes clZ{0%{opacity:0;transform:translate(0,0) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translate(14px,-24px) scale(1)}}
  @keyframes clFlick{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(1.07) rotate(2deg)}}
  @keyframes clBar{from{width:0}to{width:100%}}
  @keyframes clFallFx{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(780px) rotate(200deg)}}

  #cl-btn{position:fixed;top:120px;right:24px;width:${BTN_W}px;cursor:pointer;user-select:none;touch-action:none;transition:transform .35s var(--cl-ease)}
  #cl-btn:hover{transform:translateY(-2px)}
  #cl-btn img{display:block;width:${BTN_W}px;height:auto;pointer-events:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6))}
  #cl-btn.sleep img{animation:clBob 3s ease-in-out infinite;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)) brightness(.7)}
  #cl-btn.upd-yellow::after,#cl-btn.upd-red::after{content:'';position:absolute;top:0;right:0;width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 2px #000;animation:clPulseWarn 2s infinite}
  #cl-btn.upd-yellow::after{background:var(--cl-warn)}
  #cl-btn.upd-red::after{background:var(--cl-off);animation:clPulseOff 2s infinite}
  #cl-btn.alt{cursor:move}
  #cl-btn.dragging{cursor:grabbing}
  .cl-zzz{position:absolute;left:44px;top:-6px;pointer-events:none;display:none;font:800 14px/1 'Nunito',sans-serif;color:#c4b5fd}
  .cl-zzz span{position:absolute;animation:clZ 2.4s ease-in infinite;opacity:0}
  .cl-zzz span:nth-child(2){animation-delay:.8s;font-size:11px}
  .cl-zzz span:nth-child(3){animation-delay:1.6s;font-size:9px}
  #cl-btn.sleep .cl-zzz{display:block}

  .cl-bubble{position:absolute;pointer-events:none;display:flex;align-items:center;gap:9px;width:270px;padding:11px 14px;border-radius:12px;
    background:var(--cl-panel);color:var(--cl-text);border:1px solid color-mix(in srgb,var(--cl-accent) 55%,transparent);
    box-shadow:0 8px 24px rgba(0,0,0,.6);font-size:13px;font-weight:700;line-height:1.5;opacity:0;visibility:hidden;transform:translateY(4px);
    transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  .cl-bubble.show{opacity:1;visibility:visible;transform:none;transition:opacity .5s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}
  .cl-bubble[data-pos=top]{bottom:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=bottom]{top:calc(100% + 10px);left:50%;transform:translateX(-50%)}
  .cl-bubble[data-pos=left]{right:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  .cl-bubble[data-pos=right]{left:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  #cl-bubble-text{white-space:pre-line;min-width:0}
  .cl-dot{width:9px;height:9px;border-radius:50%;flex:0 0 9px;background:var(--cl-ok);animation:clPulseOk 2s infinite}
  .cl-dot.off{background:var(--cl-off);animation:clPulseOff 2s infinite}
  .cl-dot.warn{background:var(--cl-warn);animation:clPulseWarn 2s infinite}
  .cl-dot.static{animation:none!important}

  #cl-warn,#cl-upopup{position:fixed;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(3px)}
  #cl-warn{z-index:2147483647}
  #cl-upopup{z-index:2147483600;background:transparent;backdrop-filter:none;pointer-events:none}
  #cl-warn.open,#cl-upopup.open{display:flex;animation:clFade .35s var(--cl-ease)}
  #cl-upopup .cl-upbox{pointer-events:auto}
  .cl-box{width:min(460px,92vw);padding:26px;border-radius:18px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 50%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.8);animation:clIn .4s var(--cl-ease)}
  .cl-box.center{text-align:center}
  .cl-warn-ico{width:52px;height:52px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:26px;font-weight:800;background:color-mix(in srgb,var(--cl-warn) 22%,transparent);color:var(--cl-warn)}
  .cl-box h3{margin:0 0 10px;color:var(--cl-head);font-size:19px;font-weight:800}
  .cl-box p{margin:0 0 16px;color:var(--cl-muted);font-size:14px;line-height:1.6}
  .cl-upbox{width:min(480px,92vw);padding:22px 24px;border-radius:18px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 50%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.8);animation:clIn .4s var(--cl-ease)}
  .cl-upbox h3{margin:0 0 10px;color:var(--cl-head);font-size:19px;font-weight:800}
  .cl-upbody{max-height:220px;overflow:auto;margin-bottom:10px}
  .cl-upend{white-space:pre-line;color:var(--cl-muted);font-size:13px;margin:10px 0 12px;line-height:1.6}
  .cl-upbar{height:4px;border-radius:4px;background:color-mix(in srgb,var(--cl-text) 10%,transparent);overflow:hidden;margin-bottom:12px}
  .cl-upbar i{display:block;height:100%;background:var(--cl-accent-fill);animation:clBar 3s linear forwards}

  #cl-panel{position:fixed;width:min(1060px,96vw);height:min(600px,86vh);max-width:calc(100vw - 16px);display:flex;flex-direction:column;overflow:hidden;
    color:var(--cl-text);background:var(--cl-panel-fill);border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);border-radius:20px;
    box-shadow:0 30px 80px rgba(0,0,0,.75);opacity:0;visibility:hidden;transform:translateY(14px) scale(.97);
    transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s .5s}
  #cl-panel.open{opacity:1;visibility:visible;transform:none;transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}
  #cl-panel:not(.logged) .cl-nav{display:none}
  #cl-panel:not(.logged) .cl-pane{display:none!important}
  #cl-panel:not(.logged) .cl-pane[data-pane=auth]{display:block!important;animation:clPane .55s var(--cl-ease)}
  #cl-panel.logged .cl-pane[data-pane=auth]{display:none!important}
  #cl-panel.blocked .cl-tab:not([data-tab=update]){display:none}
  #cl-panel.blocked .cl-pane:not([data-pane=update]){display:none!important}
  #cl-fx{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
  .fxp{position:absolute;top:-50px;opacity:.5;pointer-events:none;animation-name:clFallFx;animation-timing-function:linear;animation-iteration-count:infinite}
  .fxp img{display:block;height:auto}
  .cl-head,.cl-main{position:relative;z-index:1}

  .cl-head{display:flex;align-items:center;justify-content:space-between;padding:13px 22px;cursor:move;user-select:none;
    background:color-mix(in srgb,var(--cl-panel) 80%,#000);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .cl-title{display:flex;align-items:center;gap:10px}
  .cl-title b{font-size:16px;font-weight:800;color:var(--cl-head)}
  .cl-title > span{font-size:13px;color:var(--cl-muted)}
  .cl-beta{font:800 10px/1 'Nunito',sans-serif;letter-spacing:1px;padding:5px 8px;border-radius:6px;font-style:normal;background:var(--cl-accent-fill);color:var(--cl-on-accent)}
  .cl-ver{font:700 12px/1 Consolas,monospace;color:var(--cl-muted);padding:4px 7px;border-radius:6px;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-x{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-muted);transition:background .3s,color .3s,transform .4s var(--cl-ease)}
  .cl-x:hover{background:var(--cl-hover-soft);color:var(--cl-text);transform:rotate(90deg)}
  .cl-main{flex:1;display:flex;min-height:0}
  .cl-nav{width:210px;padding:14px 12px;display:flex;flex-direction:column;gap:5px;background:color-mix(in srgb,var(--cl-panel) 88%,#000);
    border-right:1px solid color-mix(in srgb,var(--cl-accent) 18%,transparent);overflow:auto}
  .cl-tab{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:11px;cursor:pointer;color:var(--cl-muted);font-weight:700;
    transition:background .35s var(--cl-ease),color .35s var(--cl-ease),transform .35s var(--cl-ease)}
  .cl-tab svg{width:18px;height:18px;flex:0 0 18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .cl-tab:hover{background:var(--cl-hover-soft);color:var(--cl-text);transform:translateX(3px)}
  .cl-tab.act{background:color-mix(in srgb,var(--cl-accent) 22%,transparent);color:var(--cl-text);box-shadow:inset 3px 0 0 var(--cl-accent)}
  .cl-tab.upd::after{content:'NEW';margin-left:auto;font:800 10px/1 'Nunito',sans-serif;padding:3px 6px;border-radius:6px;background:var(--cl-warn);color:#111}
  .cl-tab.lock::after{content:'скоро';margin-left:auto;font:700 10px/1 'Nunito',sans-serif;padding:3px 6px;border-radius:6px;background:color-mix(in srgb,var(--cl-text) 15%,transparent);color:var(--cl-muted)}
  .cl-body{flex:1;padding:20px 24px;overflow:auto;min-width:0;display:flex;flex-direction:column}
  .cl-pane{display:none}
  .cl-pane.act{display:block;animation:clPane .55s var(--cl-ease)}
  .cl-pane.act.cl-home{display:flex;flex-direction:column;flex:1;min-height:0}

  .cl-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px}
  .cl-hero h2{margin:0 0 14px;font-size:36px;font-weight:800;line-height:1.2;color:var(--cl-head)}
  .cl-hero h2 em{font-style:normal;color:var(--cl-accent)}
  .cl-hero p{margin:0 0 26px;color:var(--cl-muted);font-size:17px}
  .cl-status{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;max-width:560px;text-align:left;
    background:color-mix(in srgb,var(--cl-panel) 75%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);font-weight:700;font-size:14px}
  .cl-foot{text-align:left;color:var(--cl-muted);font-size:13px;padding-top:14px;letter-spacing:.3px}

  .cl-profcard{border-radius:20px;overflow:hidden;border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);margin-bottom:14px}
  .cl-cover{height:150px;background:linear-gradient(120deg,#4c1d95,#7c3aed 55%,#a855f7);background-size:cover;background-position:center}
  .cl-cbody{padding:0 24px 20px}
  .cl-av{width:104px;height:104px;border-radius:50%;overflow:hidden;margin-top:-52px;border:4px solid var(--cl-panel-fill);background:#050507}
  .cl-av img{width:100%;height:100%;object-fit:cover;display:block}
  .cl-nick{font-size:26px;font-weight:800;color:var(--cl-head);margin-top:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cl-badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
  .cl-badge{padding:4px 10px;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:#fff}
  .p-user{background:#4b5563}.p-test{background:#2563eb}.p-help{background:#059669}.p-mod{background:#ea580c}
  .p-dev{background:linear-gradient(90deg,#7c3aed,#ec4899,#ef4444)}
  .p-ga{background:linear-gradient(90deg,#b91c1c,#f59e0b)}.p-zga{background:#dc2626}.p-cur{background:#0891b2}.p-adm{background:#4b5563}
  .cl-infos{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;margin-top:14px}
  .cl-infos div{display:flex;flex-direction:column;gap:2px;min-width:0}
  .cl-infos span{color:var(--cl-muted);font-size:11px;text-transform:uppercase;letter-spacing:.7px;font-weight:700}
  .cl-infos b{color:var(--cl-text);font-size:15px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cl-infos a{color:var(--cl-accent);text-decoration:none}
  .cl-infos a:hover{text-decoration:underline}
  .cl-streakrow{display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;border-radius:14px;background:color-mix(in srgb,var(--cl-text) 4%,transparent)}
  .cl-streakrow b{font-size:17px;font-weight:800;color:var(--cl-head)}
  .cl-tiername{color:var(--cl-text);font-size:13px;font-weight:700}
  .cl-next{color:var(--cl-muted);font-size:13px}
  .flame-anim{animation:clFlick 1.6s ease-in-out infinite;transform-origin:50% 90%}

  .cl-card{background:color-mix(in srgb,var(--cl-text) 3%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);
    border-radius:16px;padding:14px 18px;margin-top:12px;transition:border-color .45s var(--cl-ease)}
  .cl-card:hover{border-color:color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-sec{font-weight:800;color:var(--cl-head);margin-bottom:8px;font-size:14px}
  .cl-secrow{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
  .cl-lbl{display:block;margin:12px 0 6px;color:var(--cl-muted);font-size:13px;font-weight:700}
  .cl-lbl:first-child{margin-top:0}
  .cl-in{width:100%;padding:10px 13px;border-radius:10px;border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);background:var(--cl-field-bg);
    color:var(--cl-field-text);outline:none;transition:border-color .35s,box-shadow .35s;font-size:15px;font-weight:600}
  .cl-in:focus{border-color:var(--cl-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--cl-accent) 22%,transparent)}
  .cl-in::placeholder{color:var(--cl-muted);opacity:.8}
  .cl-in:disabled{opacity:.6}
  .cl-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 4px;cursor:pointer;color:var(--cl-text);font-size:15px;font-weight:700}
  .cl-sw input{appearance:none;width:42px;height:23px;border-radius:999px;background:color-mix(in srgb,var(--cl-text) 18%,transparent);position:relative;cursor:pointer;transition:background .4s var(--cl-ease);flex:0 0 42px}
  .cl-sw input::after{content:'';position:absolute;top:3px;left:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:left .4s var(--cl-ease)}
  .cl-sw input:checked{background:var(--cl-accent-fill)}
  .cl-sw input:checked::after{left:22px}
  .cl-sw small{display:block;font-weight:400;color:var(--cl-muted);font-size:13px;margin-top:2px}
  .cl-range{width:100%;accent-color:var(--cl-accent);margin:8px 0 2px}
  .cl-seg{display:flex;gap:8px;margin:8px 0 6px;flex-wrap:wrap}
  .cl-seg label{flex:1;min-width:80px;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px 8px;border-radius:11px;
    border:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent);background:var(--cl-field-bg);cursor:pointer;color:var(--cl-text);font-weight:700;transition:all .35s var(--cl-ease)}
  .cl-seg label:hover{background:var(--cl-hover-soft);border-color:color-mix(in srgb,var(--cl-accent) 60%,transparent)}
  .cl-seg input{display:none}
  .cl-seg label:has(input:checked){background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}

  .cl-btnp{width:100%;margin-top:10px;padding:11px 14px;border:1px solid transparent;border-radius:11px;cursor:pointer;color:var(--cl-on-accent);font-weight:800;font-size:15px;
    background:var(--cl-accent-fill);display:flex;align-items:center;justify-content:center;text-align:center;
    transition:background .35s var(--cl-ease),border-color .35s,color .35s,transform .3s var(--cl-ease),box-shadow .35s}
  .cl-btnp:hover{background:var(--cl-hover-soft);border-color:color-mix(in srgb,var(--cl-accent) 45%,transparent);color:var(--cl-text);transform:translateY(-1px)}
  .cl-btnp:active{transform:scale(.98)}
  .cl-btnp:disabled{opacity:.5;cursor:default;transform:none}
  .cl-btnp.sec{background:color-mix(in srgb,var(--cl-text) 6%,transparent);border-color:color-mix(in srgb,var(--cl-accent) 35%,transparent);color:var(--cl-text)}
  .cl-btnp.small{width:auto;padding:9px 16px;margin-top:0}
  .cl-btnp.danger:hover{border-color:#ef4444;color:#fecaca}
  .cl-msg{margin-top:12px;color:var(--cl-accent);font-size:14px;min-height:18px;font-weight:700}
  .cl-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center}
  .cl-row.left{justify-content:flex-start}
  .cl-row .cl-btnp{margin-top:8px}
  .cl-center{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:12px}
  .cl-center .cl-btnp{width:auto;margin-top:0;min-width:150px}
  .cl-stop,.cl-res{display:none!important}
  .cl-stop.on,.cl-res.on{display:flex!important}
  .cl-auth{max-width:420px;margin:0 auto;padding-top:12px}
  .cl-auth h2{margin:0 0 4px;font-size:24px;font-weight:800;color:var(--cl-head)}
  .cl-auth .cl-hint{margin:0 0 16px;color:var(--cl-muted);font-size:14px}
  .cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .cl-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
  .cl-hint2{color:var(--cl-muted);font-size:13px;margin-top:8px;line-height:1.5}
  .cl-top{display:flex;align-items:center;gap:12px;margin-bottom:12px}
  .cl-top .cl-title-sm{font-size:20px;font-weight:800;color:var(--cl-head)}

  .cl-setrow{display:grid;grid-template-columns:160px 1fr;gap:18px;padding:16px 0;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 14%,transparent)}
  .cl-setlbl{font-weight:800;color:var(--cl-head);padding-top:8px}
  .cl-avbig{width:112px;height:112px;border-radius:50%;overflow:hidden;cursor:pointer;border:2px dashed color-mix(in srgb,var(--cl-accent) 60%,transparent);background:#050507;transition:transform .3s var(--cl-ease)}
  .cl-avbig:hover{transform:scale(1.04);border-style:solid}
  .cl-avbig img{width:100%;height:100%;object-fit:cover;display:block}
  .cl-bnwide{width:100%;height:150px;border-radius:14px;overflow:hidden;cursor:pointer;background:linear-gradient(120deg,#4c1d95,#7c3aed 55%,#a855f7);
    background-size:cover;background-position:center;border:2px dashed color-mix(in srgb,var(--cl-accent) 60%,transparent);transition:transform .3s var(--cl-ease)}
  .cl-bnwide:hover{transform:scale(1.01);border-style:solid}
  .cl-urlrow{display:flex;gap:8px;margin-top:10px;align-items:stretch}
  .cl-urlrow .cl-in{flex:1}
  .cl-urlrow .cl-btnp{width:auto;margin-top:0;padding:10px 16px;white-space:nowrap}
  .cl-prev{width:100%;height:170px;border-radius:14px;overflow:hidden;display:flex;align-items:center;justify-content:center;
    background-color:color-mix(in srgb,var(--cl-text) 4%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);background-size:cover;background-position:center}
  .cl-prev-empty{color:var(--cl-muted);font-size:14px}
  .cl-drop{margin-top:10px;border:1.5px dashed color-mix(in srgb,var(--cl-accent) 55%,transparent);border-radius:14px;padding:14px;
    display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;outline:none;transition:all .35s var(--cl-ease);background:color-mix(in srgb,var(--cl-text) 2%,transparent)}
  .cl-drop:hover,.cl-drop:focus,.cl-drop.drag{border-style:solid;border-color:var(--cl-accent);background:var(--cl-hover-soft)}
  .cl-drop-ico{width:40px;height:40px;flex:0 0 40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--cl-accent) 22%,transparent);font-size:20px;font-weight:800}
  .cl-drop b{display:block;color:var(--cl-head);font-size:14px}
  .cl-drop span{display:block;color:var(--cl-muted);font-size:12px;margin-top:2px}

  .cl-subtabs{display:flex;gap:8px;margin-bottom:6px}
  .cl-subtab{flex:1;display:flex;align-items:center;justify-content:center;padding:12px 0;border-radius:13px;cursor:pointer;font-weight:800;color:var(--cl-muted);
    border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);transition:all .4s var(--cl-ease)}
  .cl-subtab:hover{background:var(--cl-hover-soft);color:var(--cl-text)}
  .cl-subtab.act{background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}
  .cl-sub{display:none}
  .cl-sub.act{display:block;animation:clPane .45s var(--cl-ease)}

  .fcards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:860px;margin:18px auto 0}
  .fcard{padding:22px 18px;border-radius:18px;cursor:pointer;text-align:center;border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);
    background:var(--cl-field-bg);transition:all .4s var(--cl-ease);display:flex;flex-direction:column;align-items:center}
  .fcard:hover{background:var(--cl-hover-soft);border-color:color-mix(in srgb,var(--cl-accent) 45%,transparent);transform:translateY(-2px)}
  .fico{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--cl-accent) 18%,transparent);font-size:26px;margin-bottom:12px}
  .fcard b{display:block;font-size:17px;font-weight:800;color:var(--cl-head)}
  .fcard span{display:block;color:var(--cl-muted);font-size:13px;margin-top:4px;line-height:1.5}
  .f-view{display:none}
  .f-view.act{display:block;animation:clPane .45s var(--cl-ease)}
  .cl-modes{display:flex;gap:8px;margin:10px 0 4px;flex-wrap:wrap}
  .cl-mode{flex:1;min-width:150px;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;color:var(--cl-muted);
    border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-mode:hover{background:var(--cl-hover-soft);color:var(--cl-text)}
  .cl-mode.act{background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}

  .th-sec{margin-top:12px;padding:14px 18px;border-radius:16px;border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);background:color-mix(in srgb,var(--cl-text) 3%,transparent)}
  .th-row{display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap}
  .th-lab{width:70px;color:var(--cl-muted);font-size:13px;font-weight:700}
  .th-sw{display:flex;gap:10px;flex-wrap:wrap}
  .th-c{width:38px;height:38px;border-radius:50%;border:2px solid color-mix(in srgb,var(--cl-text) 25%,transparent);cursor:pointer;transition:transform .3s var(--cl-ease);position:relative;overflow:hidden;padding:0;display:inline-block}
  .th-c:hover{transform:scale(1.12)}
  .th-c.on{box-shadow:0 0 0 3px var(--cl-panel-fill),0 0 0 5px var(--cl-accent)}
  .th-custom{background:conic-gradient(#ef4444,#facc15,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)}
  .th-custom input{position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);opacity:0;cursor:pointer;border:0;padding:0}
  .th-reset{width:auto;margin-top:0;padding:7px 12px;font-size:13px}
  .fx-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .fx-chips label{padding:8px 12px;border-radius:11px;cursor:pointer;font-weight:700;color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);background:var(--cl-field-bg);transition:all .3s var(--cl-ease)}
  .fx-chips label:hover{background:var(--cl-hover-soft)}
  .fx-chips input{display:none}
  .fx-chips label:has(input:checked){background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}

  .cl-offer h2{margin:0 0 6px;font-size:24px;font-weight:800;color:var(--cl-head);text-align:center}
  .cl-offer .cl-hint{margin:0 0 14px;color:var(--cl-muted);font-size:15px;text-align:center}
  .cl-list{margin:0 auto 10px;padding-left:20px;color:var(--cl-text);max-width:440px;font-size:15px}
  .cl-list li{margin:6px 0}
  .cl-offer .cl-card{text-align:center}
  .cl-contacts{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:10px}
  .cl-link{display:inline-block;min-width:320px;text-align:center;padding:12px 18px;border-radius:12px;text-decoration:none;
    color:var(--cl-text);font-weight:800;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-link:hover{background:var(--cl-hover-soft);border-color:var(--cl-accent)}

  .ver{border-radius:14px;border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);background:var(--cl-field-bg);margin-top:8px;overflow:hidden}
  .ver summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-weight:800;color:var(--cl-head)}
  .ver summary::-webkit-details-marker{display:none}
  .ver summary::after{content:'▾';font-size:18px;color:var(--cl-accent);transition:transform .3s var(--cl-ease)}
  .ver[open] summary::after{transform:rotate(180deg)}
  .ver-body{padding:0 16px 12px}
  .ch-item{display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 10%,transparent);font-size:14px}
  .ch-item:last-child{border-bottom:0}
  .tag{flex:0 0 auto;font-size:12px;font-weight:800;padding:3px 8px;border-radius:7px;border:1px solid transparent}
  .t-Добавлено{background:rgba(34,197,94,.15);color:#4ade80;border-color:rgba(34,197,94,.35)}
  .t-Улучшено{background:rgba(59,130,246,.15);color:#60a5fa;border-color:rgba(59,130,246,.35)}
  .t-Изменено{background:rgba(250,204,21,.13);color:#facc15;border-color:rgba(250,204,21,.35)}
  .t-Удалено{background:rgba(239,68,68,.15);color:#f87171;border-color:rgba(239,68,68,.35)}
  .t-Исправлено{background:rgba(168,85,247,.15);color:#c084fc;border-color:rgba(168,85,247,.35)}
  .upd-line{font-size:14px;color:var(--cl-muted);margin-top:4px}
  .autoupd-note{font-size:13px;color:var(--cl-muted);line-height:1.5;margin-top:4px}

  .job{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;margin-top:10px;
    border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);background:var(--cl-field-bg)}
  .jdate{flex:0 0 118px;font:700 13px/1.4 Consolas,monospace;color:var(--cl-accent);text-align:left}
  .job-main{flex:1;min-width:0}
  .job-main b{display:block;color:var(--cl-head);font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .job-main span{display:block;color:var(--cl-muted);font-size:13px;margin-top:2px}
  .job-act{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  .job-act .cl-btnp{margin-top:0;width:auto;padding:8px 12px}

  .cl-lock{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;min-height:300px}
  .cl-lock-ico{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;background:color-mix(in srgb,var(--cl-accent) 18%,transparent)}
  .cl-lock h2{margin:0;font-size:26px;font-weight:800;color:var(--cl-head)}
  .cl-lock p{margin:0;color:var(--cl-muted);font-size:15px}

  #cl-win{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.98);width:min(1000px,94vw);height:min(640px,86vh);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);border-radius:18px;background:var(--cl-panel-fill);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s .45s}
  #cl-win.open{opacity:1;visibility:visible;transform:translate(-50%,-50%);transition:opacity .4s var(--cl-ease),transform .45s var(--cl-ease),visibility 0s}
  #cl-win .cl-head{cursor:default}
  .cl-whead-btns{display:flex;gap:8px;align-items:center}
  .cl-wbody{overflow:auto;flex:1;padding:0 0 14px;font-size:15px;line-height:1.6;color:var(--cl-text)}
  .r{display:grid;grid-template-columns:186px 1fr;gap:16px;padding:10px 22px;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 12%,transparent);transition:background .25s}
  .r:hover{background:var(--cl-hover-soft)}
  .d{color:var(--cl-muted);font:13px/1.8 Consolas,monospace;padding-top:1px}
  .t{word-break:break-word}
  .nk{color:color-mix(in srgb,var(--cl-accent) 50%,#fff);font-weight:800}
  .mn{color:#facc15;font-weight:800}
  .plus{color:#4ade80;font-weight:800;margin-left:8px;white-space:nowrap}
  .minus{color:#f87171;font-weight:800;margin-left:8px;white-space:nowrap}
  .sec{position:sticky;top:0;z-index:1;display:flex;justify-content:space-between;align-items:center;padding:11px 22px;
    font-weight:800;color:var(--cl-head);background:var(--cl-panel-fill);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .sec i{font-style:normal;color:var(--cl-muted);font-weight:700}
  .pl{display:flex;gap:12px;align-items:center;padding:10px 22px;background:color-mix(in srgb,var(--cl-accent) 10%,transparent);border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 12%,transparent)}
  .pl span{color:var(--cl-muted)}
  .info{padding:26px 22px;color:var(--cl-muted);text-align:center}
  .sum{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px 22px}
  .sum div{border-radius:14px;padding:14px 16px;border:1px solid}
  .sum div:nth-child(1){background:rgba(34,197,94,.1);border-color:rgba(34,197,94,.4)}
  .sum div:nth-child(2){background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.4)}
  .sum div:nth-child(3){background:rgba(250,204,21,.08);border-color:rgba(250,204,21,.4)}
  .sum span{display:block;color:var(--cl-muted);font-size:14px}
  .sum b{font-size:22px;font-weight:800}
  .sum .earn{color:#4ade80}
  .sum .spend{color:#f87171}
  .sum .diff{color:#facc15}
  `;

  const ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    logs: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
  };

  /* ---------- Тема: каждая настройка отдельно (цвет или градиент) ---------- */
  function getTheme() {
    const raw = cfg('theme') || {};
    const out = {};
    for (const k of Object.keys(DEF_THEME)) {
      let v = raw[k];
      if (typeof v === 'string') v = { g: false, c1: v, c2: v };
      out[k] = { ...DEF_THEME[k], ...(v || {}) };
    }
    return out;
  }
  const fillOf = t => (t.g ? `linear-gradient(90deg,${t.c1},${t.c2})` : t.c1);
  function applyTheme() {
    const t = getTheme();
    const panelLight = hexLum(t.panel.c1) > 0.6;
    const accLight = hexLum(t.accent.c1) > 0.7;
    const set = (k, v) => uiHost.style.setProperty(k, v);
    set('--cl-accent', t.accent.c1);
    set('--cl-accent-fill', fillOf(t.accent));
    set('--cl-panel', t.panel.c1);
    set('--cl-panel-fill', fillOf(t.panel));
    set('--cl-hover', t.hover.c1);
    set('--cl-hover-soft', hexRgba(t.hover.c1, 0.13));
    set('--cl-text', panelLight ? '#14121c' : '#ebe8f5');
    set('--cl-muted', panelLight ? '#5b5670' : '#9b93b5');
    set('--cl-head', panelLight ? '#0b0a12' : '#ffffff');
    set('--cl-field-bg', panelLight ? 'rgba(0,0,0,.05)' : 'rgba(0,0,0,.35)');
    set('--cl-field-text', panelLight ? '#14121c' : '#f4f1fb');
    set('--cl-on-accent', accLight ? '#000000' : '#ffffff');
  }
  function saveTheme(patch) {
    setCfg('theme', { ...getTheme(), ...patch });
    applyTheme();
  }
  function renderThemeSecs() {
    const t = getTheme();
    qa('.th-sec[data-key]').forEach(sec => {
      const key = sec.dataset.key, v = t[key];
      sec.querySelector('.th-grad').checked = !!v.g;
      let html;
      if (v.g) {
        html = [1, 2].map(slot => {
          const cur = slot === 1 ? v.c1 : v.c2;
          return `<div class="th-row"><span class="th-lab">Цвет ${slot}</span>
            <label class="th-c" style="background:${cur}"><input type="color" class="th-picker" data-key="${key}" data-slot="${slot}" value="${cur}"></label></div>`;
        }).join('');
      } else {
        const cur = (v.c1 || '').toLowerCase();
        html = `<div class="th-row"><span class="th-lab">Цвет</span><div class="th-sw">${PALETTE.map(([n, c]) =>
          `<button class="th-c${cur === c ? ' on' : ''}" style="background:${c}" title="${n}" data-key="${key}" data-slot="1" data-c="${c}"></button>`).join('')}
          <label class="th-c th-custom" title="Свой цвет"><input type="color" class="th-picker" data-key="${key}" data-slot="1" value="${cur}"></label></div></div>`;
      }
      sec.querySelector('.th-rows').innerHTML = html;
    });
  }
  function setThemePart(key, slot, color) {
    const part = slot === '2' ? 'c2' : 'c1';
    saveTheme({ [key]: { ...getTheme()[key], [part]: color } });
  }

  /* ---------- Анимация меню ---------- */
  const FX_EMOJI = { star: '⭐', butterfly: '🦋', sun: '☀️', bolt: '⚡', snow: '❄️', bat: '🦇' };
  function renderFx() {
    const fx = cfg('fx') || DEF.fx;
    const box = q('#cl-fx');
    if (!box) return;
    if (!fx || fx.type === 'off') { box.innerHTML = ''; return; }
    let html = '';
    for (let i = 0; i < fx.count; i++) {
      const left = Math.random() * 100;
      const size = 14 + Math.random() * 12;
      const dur = fx.speed * (0.8 + Math.random() * 0.4);
      const delay = -Math.random() * fx.speed;
      const inner = fx.type === 'makima'
        ? `<img src="${FIGURE}" alt="" style="width:${size + 12}px">`
        : `<span style="font-size:${size}px">${FX_EMOJI[fx.type] || '⭐'}</span>`;
      html += `<div class="fxp" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s">${inner}</div>`;
    }
    box.innerHTML = html;
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

  /* ---------- Статус на главной ---------- */
  function renderStatus() {
    const s = updState();
    let kind = 'ok', text = 'Скрипт запущен и готов к работе';
    if (!isLogged()) { kind = 'warn'; text = 'Войди в аккаунт, чтобы начать работу'; }
    else if (s.outdated && s.red) { kind = 'red'; text = 'Скрипт поврежден или не обновлялся больше месяца'; }
    else if (s.outdated) { kind = 'warn'; text = 'Вышло новое обновление, необходимо обновить скрипт для дальнейшей работы'; }
    const dot = q('#cl-status-dot');
    dot.className = 'cl-dot static ' + DOT[kind];
    dot.classList.toggle('off', DOT[kind] === 'off');
    dot.classList.toggle('warn', DOT[kind] === 'warn');
    dot.classList.toggle('ok', DOT[kind] === 'ok');
    q('#cl-status-text').textContent = text;
  }

  /* ---------- Профиль ---------- */
  function renderProfile() {
    const acc = getAcc();
    const days = (cfg('streak') || {}).days || 0;
    const t = tierOf(days);
    const nt = TIERS.find(x => x.d > days);
    q('#cl-cover').style.backgroundImage = acc && acc.banner ? `url("${acc.banner}")` : '';
    q('#cl-avimg').src = acc && acc.avatar ? acc.avatar : FIGURE;
    q('#cl-pnick').textContent = acc ? acc.nick : 'Гость';
    q('#cl-badges').innerHTML = acc ? `<span class="cl-badge ${POS_CLS[posOf(acc)] || 'p-user'}">${esc(posOf(acc))}</span>` : '';
    q('#cl-pserver').textContent = acc ? `${acc.server} · ${serverName(acc.server)}` : '—';
    q('#cl-pvk').innerHTML = acc && acc.vk ? linkHtml(acc.vk) : '—';
    q('#cl-ptg').textContent = acc && acc.tg ? acc.tg : '—';
    q('#cl-flame').innerHTML = flameSvg(t, 40);
    q('#cl-streakdays').textContent = `${days} ${plural(days, ['день', 'дня', 'дней'])} подряд`;
    q('#cl-tiername').textContent = `Огонёк: ${t.name}`;
    q('#cl-nexttier').textContent = nt ? `До следующего огонька: ${nt.d - days} дн.` : 'Максимальный огонёк';
  }

  function renderAccountForm() {
    const acc = getAcc() || {};
    q('#cl-av-prev').src = acc.avatar || FIGURE;
    q('#cl-bn-prev').style.backgroundImage = acc.banner ? `url("${acc.banner}")` : '';
    q('#cl-vk').value = acc.vk || '';
    q('#cl-tg').value = acc.tg || '';
    if (acc.server) q('#cl-acc-server').value = acc.server;
    const posSel = q('#cl-acc-pos'), own = acc.key === OWNER_NICK;
    posSel.innerHTML = own ? '<option>Разработчик</option>' : POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('');
    posSel.disabled = own;
    q('#cl-acc-posgo').disabled = own;
    if (!own) posSel.value = acc.position || 'Администратор';
  }

  function renderBgPreview() {
    const u = cfg('bgUrl');
    const el = q('#cl-bg-prev');
    el.style.backgroundImage = u ? `url("${u}")` : 'none';
    el.style.backgroundColor = cfg('banner') === 'white' ? '#ffffff' : cfg('banner') === 'black' ? '#000000' : '';
    q('#cl-bg-empty').style.display = u || cfg('banner') ? 'none' : 'block';
    q('#cl-bgon').checked = !!cfg('bgOn') && !!u;
    qa('.cl-banner-r').forEach(r => { r.checked = r.value === cfg('banner'); });
    q('#cl-blur').value = cfg('blur');
    q('#cl-blurv').textContent = cfg('blur');
  }

  /* ---------- Логи: сохранённые проверки ---------- */
  function pausedFor(kind) {
    return cfg('jobs').find(j => j.kind === kind && !j.done) || null;
  }
  function renderResumeBtns() {
    qa('.cl-res').forEach(b => {
      const j = pausedFor(b.dataset.kind);
      b.classList.toggle('on', !busy && !!j);
      b.dataset.id = j ? j.id : '';
    });
  }
  function renderLogs() {
    const list = cfg('jobs');
    q('#cl-logs').innerHTML = list.length ? list.map(j => `
      <div class="job">
        <div class="jdate">${esc(dateTimeRu(j.created))}</div>
        <div class="job-main"><b>${esc(j.title)}</b>
          <span>${j.done ? 'готово' : 'остановлено'} · строк: ${j.rows.length} · дошли до ${esc(j.cursor)}</span></div>
        <div class="job-act">
          <button class="cl-btnp small sec" data-act="open" data-id="${j.id}">Открыть</button>
          <button class="cl-btnp small sec" data-act="txt" data-id="${j.id}">TXT</button>
          ${j.done ? '' : `<button class="cl-btnp small" data-act="resume" data-id="${j.id}">Продолжить</button>`}
          <button class="cl-btnp small sec danger" data-act="del" data-id="${j.id}">Удалить</button>
        </div>
      </div>`).join('')
      : infoHtml('Здесь появятся проверки: Пробив, Махинатор и Вирты с датой и результатом');
  }

  function renderAuth() {
    const acc = getAcc();
    panel.classList.toggle('logged', !!acc);
    if (acc) q('#cl-acc-server').value = acc.server;
    renderProfile();
    renderAccountForm();
    renderStatus();
    renderResumeBtns();
    renderLogs();
  }

  /* ---------- Загрузка картинок ---------- */
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
  function checkImageUrl(u) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(u);
      im.onerror = () => rej(new Error('сайт не отдаёт картинку по этой ссылке'));
      im.src = u;
    });
  }
  function bindUploader(o) {
    const say2 = s => { o.status.textContent = s; };
    const finish = async src => {
      try { await o.apply(src); say2('Готово, применено'); }
      catch (e) { say2('Ошибка: ' + e.message); }
    };
    const fromFile = async file => {
      try { say2('Читаю файл…'); await finish(await readFile(file, o.maxMB)); }
      catch (e) { say2('Ошибка: ' + e.message); }
    };
    const fromUrl = async u => {
      say2('Проверяю ссылку…');
      try { await checkImageUrl(u); await finish(u); }
      catch (e) { say2('Ошибка: ' + e.message); }
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

  /* ---------- Профиль: ник, пароль, сервер, должность, связь ---------- */
  async function changeNick() {
    const say3 = s => { q('#cl-acc-msg1').textContent = s; };
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
    const say3 = s => { q('#cl-acc-msg2').textContent = s; };
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
  function changePosition() {
    const acc = getAcc();
    if (!acc || acc.key === OWNER_NICK) return;
    const v = q('#cl-acc-pos').value;
    if (!POSITIONS.includes(v)) return;
    saveAcc(acc.key, { position: v });
    renderAuth();
    q('#cl-acc-msg3').textContent = 'Должность сохранена: ' + v;
  }
  function saveContacts() {
    const acc = getAcc();
    if (!acc) return;
    const vk = q('#cl-vk').value.trim(), tg = q('#cl-tg').value.trim();
    if (vk && !/^https?:\/\//i.test(vk) && !/vk\.(com|ru)/i.test(vk)) {
      q('#cl-ct-msg').textContent = 'Ссылка VK: вставь адрес, например https://vk.ru/имя';
      return;
    }
    saveAcc(acc.key, { vk, tg });
    renderAuth();
    q('#cl-ct-msg').textContent = 'Связь сохранена';
  }
  function logout() {
    setCfg('session', null);
    renderAuth();
    applyBg();
    refreshUpdate(false);
    activateTab('home');
  }

  /* ---------- Обновления ---------- */
  function fetchText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(),
        nocache: true,
        onload: r => (r.status === 200 ? resolve(r.responseText) : reject(new Error('HTTP ' + r.status))),
        onerror: () => reject(new Error('нет связи с GitHub')),
      });
    });
  }
  function announceUpdate(s) {
    if (!s.outdated) return;
    const level = s.red ? 'red' : s.blocked ? 'blocked' : 'yellow';
    const tag = `${s.remote}:${level}`;
    if (sessionStorage.getItem('cl_said') === tag) return;
    sessionStorage.setItem('cl_said', tag);
    const text = level === 'red'
      ? 'Скрипт не обновлялся больше месяца. Срочно установи обновление во вкладке «О скрипте»'
      : level === 'blocked'
        ? 'Скрипт остановлен. Нажми на меня и установи обновление'
        : 'Датебаешечки, у нас появилось обновки, зацени во вкладке «О скрипте»';
    sayOrDefer(() => say(text, level === 'yellow' ? 'warn' : 'red', 8000));
  }
  function refreshUpdate(announce) {
    const s = updState();
    btn.classList.toggle('upd-yellow', s.outdated && !s.red);
    btn.classList.toggle('upd-red', s.outdated && s.red);
    panel.classList.toggle('blocked', s.blocked);
    q('.cl-tab[data-tab="update"]').classList.toggle('upd', s.outdated);
    q('#cl-upd-remote').textContent = s.outdated
      ? `Доступная версия: v${s.remote}${s.blocked ? ' — скрипт остановлен, установи обновление' : ' — есть обновление'}`
      : (s.remote ? `Доступная версия: v${s.remote} — у тебя актуальная` : 'Доступная версия: неизвестно');
    if (s.outdated && cfg('autoUpd') && cfg('autoTried') !== s.remote) {
      setCfg('autoTried', s.remote);
      window.open(UPDATE_URL, '_blank');
    }
    renderStatus();
    if (announce) announceUpdate(s);
  }
  async function checkUpdate(manual) {
    const msg = q('#cl-upd-msg');
    if (manual) msg.textContent = 'Проверяю…';
    try {
      const text = await fetchText(UPDATE_URL);
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
          ? `Есть обновление: ${VERSION_NUM} → ${remote}. Нажми «Обновить».`
          : `У тебя последняя версия (${VERSION_NUM}).`;
      }
    } catch (e) {
      if (manual) msg.textContent = 'Не удалось проверить: ' + e.message;
    }
  }

  const GROUPS = ['Добавлено', 'Улучшено', 'Исправлено', 'Изменено', 'Удалено'];
  function itemsHtml(items) {
    return GROUPS.map(g => {
      const list = (items || []).filter(i => i.type === g);
      return list.map(i => `<div class="ch-item"><span class="tag t-${esc(g)}">${esc(g)}</span><span>${esc(i.text)}</span></div>`).join('');
    }).join('') || infoHtml('Список изменений не указан');
  }
  function renderVersions() {
    q('#cl-verlist').innerHTML = CHANGELOG.map((e, i) => `
      <details class="ver"${i === 0 ? ' open' : ''}>
        <summary><span>v${esc(e.version)} · ${esc(e.date || '')}${i === 0 ? ' · последняя' : ''}</span></summary>
        <div class="ver-body">${itemsHtml(e.items)}</div>
      </details>`).join('');
  }
  // Окно после установки новой версии: показывается 3 секунды
  function showUpdatePopupIfNeeded() {
    const last = cfg('lastSeen');
    if (!last) { setCfg('lastSeen', VERSION_NUM); return; }
    if (last === VERSION_NUM) return;
    setCfg('lastSeen', VERSION_NUM);
    const entry = CHANGELOG.find(e => e.version === VERSION_NUM);
    q('#cl-upv').textContent = 'v' + VERSION_NUM;
    q('#cl-upbody').innerHTML = itemsHtml(entry ? entry.items : []);
    const pop = q('#cl-upopup');
    pop.classList.add('open');
    const close = () => pop.classList.remove('open');
    q('#cl-upclose').onclick = close;
    setTimeout(close, 3000);
  }

  /* ---------- Лимит строк на странице логов сайта ---------- */
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

  /* =========================================================
     ПРОВЕРКИ ЛОГОВ
     Скрипт идёт назад от «до» пачками по N строк (N задаётся в Технички).
     Каждая пачка — один запрос. Между пачками пауза CD (5 сек по умолчанию).
     Курсор — время самой старой строки пачки, следующая пачка идёт до него.
     ========================================================= */
  function gate() {
    if (!isLogged()) return 'Сначала войди в аккаунт';
    if (updState().blocked) return 'Скрипт остановлен: установи обновление во вкладке «О скрипте»';
    return '';
  }
  const msgFor = (kind, text) => { const el = q(MSG_ID[kind]); if (el) el.textContent = text; };
  const setMsg = text => msgFor(curKind, text);
  function gateOk(kind) {
    const g = gate();
    if (g) { msgFor(kind, g); return false; }
    return true;
  }
  function setStop(kind, on) {
    qa(`.cl-stop[data-kind="${kind}"]`).forEach(b => {
      b.classList.toggle('on', on);
      b.disabled = false;
      b.textContent = 'Стоп';
    });
  }

  function makeJob(kind, title, params, from, to) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kind, title, params, from, to, cursor: to,
      boundSeen: [], rows: [], pages: 0, scanned: 0, done: false, created: Date.now(),
    };
  }
  function saveJob(job) {
    let list = cfg('jobs').filter(j => j.id !== job.id);
    const dropFinished = job.done && !cfg('saveLogs') && cfg('saveFile');
    if (!dropFinished) list.unshift(job);
    setCfg('jobs', list.slice(0, JOBS_CAP));
  }

  // Запрос одной пачки строк до курсора
  async function fetchPage(acc, job, per) {
    const p = new URLSearchParams();
    p.set('server_number', acc.server);
    p.set('min_period', job.from);
    p.set('max_period', job.cursor);
    p.set('limit', String(per));
    p.set('sort', 'desc');
    if (job.params.nick) p.set('player', job.params.nick);
    if (job.params.type) p.append('type[]', job.params.type);
    let retry = 0;
    for (;;) {
      if (stopFlag) return null;
      const res = await fetch(`${location.pathname}?${p.toString()}`, { credentials: 'same-origin' });
      if (res.status === 429) {
        if (++retry > MAX_RETRY_429) throw new Error('сайт ограничил запросы (HTTP 429)');
        const sec = 20 * retry;
        setMsg(`Сайт ограничил запросы, жду ${sec} сек…`);
        await pause(sec * 1000);
        continue;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const html = await res.text();
      if (!/<table/i.test(html) && /двухфакторн/i.test(html)) throw new Error('сайт попросил двухфакторный код');
      const doc = new DOMParser().parseFromString(html, 'text/html');
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
  }

  // Подбор строк под вид проверки
  function matchRow(job, r) {
    const P = job.params;
    const low = r.full.toLowerCase();
    if (job.kind === 'probiv') {
      if (P.nick && !low.includes(P.nick.toLowerCase())) return [];
      if (P.kws.length && !P.kws.some(k => low.includes(k))) return [];
      return [{ t: r.time, a: r.action }];
    }
    if (job.kind === 'mech') return mechClassify(r, P);
    const nick = P.nick.toLowerCase();
    const a = r.action;
    if (whoOf(a).toLowerCase() !== nick) return [];
    if (/комисси/i.test(a)) return [];
    const amt = parseMoney(a);
    if (!amt) return [];
    if (SPEND_RE.test(a)) return [{ t: r.time, a, amt, sign: '-' }];
    if (EARN_RE.test(a)) return [{ t: r.time, a, amt, sign: '+' }];
    return [];
  }
  function mechClassify(r, P) {
    const a = r.action, who = whoOf(a), amt = parseMoney(a), low = a.toLowerCase();
    if (P.player && !who.toLowerCase().includes(P.player)) return [];
    if (P.kws.length && !P.kws.some(k => low.includes(k))) return [];
    if (P.car && !low.includes(P.car)) return [];
    if (P.min && amt < P.min) return [];
    if (P.max && amt > P.max) return [];
    const out = [];
    const base = { t: r.time, a, who, amt };
    if (TRANSFER_RE.test(a) && amt >= P.th.big) out.push({ ...base, cat: 'big' });
    if (SALE_RE.test(a) && CAR_RE.test(a) && amt > 0 && amt < P.th.cheap && !/комисси/i.test(a)) out.push({ ...base, cat: 'cheap' });
    if (who !== '?' && SALE_RE.test(a) && RES_RE.test(a)) out.push({ ...base, cat: 'res' });
    if (who !== '?' && BARREL_RE.test(a)) out.push({ ...base, cat: 'barrel' });
    return out;
  }

  async function runJob(job) {
    if (busy) return;
    busy = true;
    stopFlag = false;
    curKind = job.kind;
    setStop(job.kind, true);
    renderResumeBtns();
    const acc = getAcc();
    const per = cfg('perReq');
    const cd = cfg('cd') * 1000;
    let stopped = false;
    try {
      for (;;) {
        if (stopFlag) { stopped = true; break; }
        setMsg(`${job.title}: пачка ${job.pages + 1}, проверено строк: ${job.scanned}, найдено: ${job.rows.length}…`);
        const page = await fetchPage(acc, job, per);
        if (page === null) { stopped = true; break; }
        if (!page.length) { job.done = true; break; }
        job.pages++;
        job.scanned += page.length;
        const oldest = page[page.length - 1].time;
        const seen = new Set(job.boundSeen);
        for (const r of page) {
          if (r.time < job.from) continue;
          if (r.time === job.cursor && seen.has(r.time + '|' + r.action)) continue;
          for (const h of matchRow(job, r)) if (job.rows.length < ROW_CAP) job.rows.push(h);
        }
        if (oldest < job.from) { job.done = true; break; }
        let next = oldest;
        let bs = page.filter(r => r.time === oldest).map(r => r.time + '|' + r.action);
        if (next === job.cursor) { next = addSec(oldest, -1); bs = []; }
        job.cursor = next;
        job.boundSeen = bs;
        if (job.pages % SAVE_EVERY === 0) saveJob(job);
        await pause(cd);
      }
    } catch (e) {
      busy = false;
      setStop(job.kind, false);
      saveJob(job);
      writeTxt(job, 'сбой');
      say(CRASH_TEXT, 'red', 12000);
      setMsg(`Сбой: ${e.message}. Файл с логами скачан, прогресс сохранён во вкладке «Логи»`);
      renderResumeBtns();
      renderLogs();
      return;
    }
    busy = false;
    setStop(job.kind, false);
    saveJob(job);
    renderResumeBtns();
    renderLogs();
    if (job.done) {
      setMsg(`Готово: найдено ${job.rows.length} строк`);
      if (cfg('saveFile')) writeTxt(job, 'готово');
      say(DONE_TEXT, 'ok', 12000);
    } else if (stopped) {
      setMsg('Остановлено. Продолжить можно кнопкой «Продолжить» или во вкладке «Логи»');
    }
  }

  function resumeJob(id) {
    const job = cfg('jobs').find(j => j.id === id);
    if (!job || job.done) return;
    if (!gateOk(job.kind)) return;
    if (busy) return msgFor(job.kind, 'Сначала дождись окончания текущей проверки');
    runJob(job);
  }

  /* ---------- Файл .txt: сохранение и загрузка ---------- */
  function rowLine(kind, r) {
    if (kind === 'probiv') return `${r.t} | ${r.a}`;
    if (kind === 'mech') return `[${r.cat}] ${r.t} | ${r.who} | ${r.a}`;
    return `${r.sign}${r.amt} | ${r.t} | ${r.a}`;
  }
  function download(name, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function jobTxt(job, status) {
    const P = job.params;
    const head = [
      `# CustomLogs — ${job.title}`,
      `# Вид: ${job.kind}`,
      `# Ник: ${P.nick || '—'}`,
      `# Ключевые слова: ${(P.kws || []).join(', ') || '—'}`,
      `# Тип: ${P.typeLabel || '—'}`,
      `# Дата проверки: ${dateTimeRu(job.created)}`,
      `# Период: ${job.from} — ${job.to}`,
      `# Курсор: ${job.cursor}`,
      `# Статус: ${status}`,
      `# Строк найдено: ${job.rows.length}`,
      '-'.repeat(50),
    ];
    return [...head, ...job.rows.map(r => rowLine(job.kind, r))].join('\n');
  }
  function writeTxt(job, status) {
    const P = job.params;
    const who = (P.nick || (P.kws || []).join('_') || job.kind).replace(/[^\wа-яА-ЯёЁ-]+/g, '_');
    download(`CustomLogs_${job.kind}_${who}_${fileDate(job.created)}.txt`, jobTxt(job, status));
  }
  function parseTxt(text) {
    const H = {}, rows = [];
    let body = false;
    for (const line of text.split(/\r?\n/)) {
      if (!body) {
        if (/^-{5,}/.test(line)) { body = true; continue; }
        const m = line.match(/^#\s*([^:]+):\s*(.*)$/);
        if (m) H[m[1].trim()] = m[2].trim();
        continue;
      }
      const i = line.indexOf(' | ');
      if (i < 0) continue;
      rows.push({ t: line.slice(0, i).trim(), a: line.slice(i + 3).trim() });
    }
    return { H, rows };
  }
  async function loadResumeFile(file) {
    const info = q('#cl-pf-info');
    try {
      const { H, rows } = parseTxt(await file.text());
      if (!H['Вид'] || !H['Курсор'] || !H['Период']) throw new Error('это не файл CustomLogs');
      if (H['Вид'] !== 'probiv') throw new Error('продолжать из файла можно только Пробив');
      const [pf, pt] = H['Период'].split(/\s+—\s+/);
      const from = normDT(pf), to = normDT(pt), cursor = normDT(H['Курсор']);
      if (!from || !to || !cursor) throw new Error('не нашла даты в файле');
      const nick = H['Ник'] && H['Ник'] !== '—' ? H['Ник'] : '';
      const kws = H['Ключевые слова'] && H['Ключевые слова'] !== '—' ? splitKw(H['Ключевые слова']) : [];
      const typeLabel = H['Тип'] && H['Тип'] !== '—' ? H['Тип'] : '';
      const opt = typeLabel ? typeOpts.find(o => o.label === typeLabel) : null;
      if (!nick && !kws.length && !opt) throw new Error('в файле нет ника или ключевых слов');
      pendingUpload = {
        title: `Пробив: ${nick || kws.join(', ') || typeLabel}`,
        params: { nick, kws, type: opt ? opt.value : '', typeLabel },
        from, to, cursor, rows,
        boundSeen: rows.filter(r => r.t === cursor).map(r => r.t + '|' + r.a),
      };
      info.innerHTML = `Ник: <b>${esc(nick || '—')}</b> · слова: <b>${esc(kws.join(', ') || typeLabel || '—')}</b><br>Продолжу с ${esc(cursor)} · строк в файле: ${rows.length}`;
    } catch (e) {
      pendingUpload = null;
      info.textContent = 'Не получилось открыть файл: ' + e.message;
    }
  }
  function startFromFile() {
    if (!gateOk('probiv') || busy) return;
    if (!pendingUpload) return msgFor('probiv', 'Сначала загрузи файл .txt от Макимы');
    const now = Date.now();
    if (now < uploadCdUntil) return msgFor('probiv', `Подожди ${Math.ceil((uploadCdUntil - now) / 1000)} сек перед следующей загрузкой`);
    uploadCdUntil = now + cfg('cd') * 1000;
    const p = pendingUpload;
    const job = { ...makeJob('probiv', p.title, p.params, p.from, p.to), cursor: p.cursor, boundSeen: p.boundSeen, rows: p.rows.slice() };
    pendingUpload = null;
    q('#cl-pf-info').textContent = 'Файл ещё не загружен';
    runJob(job);
  }

  /* ---------- Результаты ---------- */
  function maskText(t) {
    return cfg('moneyHide') ? t.replace(MONEY_TXT_RE, 'скрыто') : t;
  }
  function renderProbivHtml(job) {
    return job.rows.slice(0, MAX_RENDER).map(r => rowHtml(r.t, hl(maskText(r.a)))).join('') || infoHtml('Ничего не найдено');
  }
  function renderMechHtml(job) {
    const P = job.params;
    const by = c => job.rows.filter(r => r.cat === c);
    const perPlayer = (c, min) => {
      const m = {};
      by(c).forEach(r => { (m[r.who] ||= []).push(r); });
      return Object.entries(m).filter(([, arr]) => arr.length >= min).sort((a, b) => b[1].length - a[1].length);
    };
    const big = by('big'), cheap = by('cheap');
    const res = perPlayer('res', P.th.res), barrels = perPlayer('barrel', P.th.barrel);
    const parts = [];
    parts.push(secHtml('Большие переводы', big.length));
    big.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)))));
    parts.push(secHtml('Дешёвая продажа транспорта', cheap.length));
    cheap.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)))));
    parts.push(secHtml('Много продаж ресурсов', res.length));
    res.forEach(([who, arr]) => {
      parts.push(playerHtml(who, `продаж за период: ${arr.length}`));
      arr.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)))));
    });
    parts.push(secHtml('Продажи бочек', barrels.length));
    barrels.forEach(([who, arr]) => {
      parts.push(playerHtml(who, `продано бочек: ${arr.length}`));
      arr.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)))));
    });
    return parts.join('');
  }
  function renderVirtHtml(job) {
    const earned = job.rows.filter(r => r.sign === '+').reduce((s, r) => s + r.amt, 0);
    const spent = job.rows.filter(r => r.sign === '-').reduce((s, r) => s + r.amt, 0);
    const ops = [...job.rows].sort((x, y) => (x.t < y.t ? 1 : x.t > y.t ? -1 : 0));
    const sum = `<div class="sum">
      <div><span>Заработал</span><b class="earn">${fmtPlain(earned)}</b></div>
      <div><span>Потратил</span><b class="spend">${fmtPlain(spent)}</b></div>
      <div><span>Разница</span><b class="diff">${earned - spent >= 0 ? '+' : ''}${fmtPlain(earned - spent)}</b></div></div>`;
    const list = ops.slice(0, MAX_RENDER).map(o => rowHtml(o.t,
      `${hl(maskText(o.a))}<span class="${o.sign === '+' ? 'plus' : 'minus'}">${o.sign === '+' ? '+' : '−'}${fmtPlain(o.amt)}</span>`)).join('');
    return sum + secHtml('Операции с деньгами', ops.length) + (list || infoHtml('Операций с деньгами за период не найдено'));
  }
  function showJob(job) {
    shownJob = job;
    const w = q('#cl-win');
    q('#cl-wtitle').textContent = job.title + (job.done ? '' : ' (не завершено)');
    q('.cl-wbody', w).innerHTML = job.kind === 'probiv' ? renderProbivHtml(job)
      : job.kind === 'mech' ? (renderMechHtml(job) || infoHtml('Подозрительных действий не найдено'))
        : renderVirtHtml(job);
    w.classList.add('open');
  }

  /* =========================================================
     ФИЛЬТРЫ: Пробив, Махинатор, Вирты
     ========================================================= */
  function setPMode(m) {
    pMode = m;
    qa('.cl-mode[data-mode]').forEach(x => x.classList.toggle('act', x.dataset.mode === m));
    const c = PMODES[m];
    q('#cl-p-qlabel').textContent = c.label;
    q('#cl-p-q').placeholder = c.ph;
    q('#cl-p-q').value = '';
    q('#cl-p-ex').textContent = c.ex;
    q('#cl-p-kw2-wrap').style.display = m === 'nick' ? 'block' : 'none';
    if (m === 'type') q('#cl-p-q').setAttribute('list', 'cl-p-types');
    else q('#cl-p-q').removeAttribute('list');
  }

  function startProbiv() {
    if (!gateOk('probiv') || busy) return;
    const raw = q('#cl-p-q').value.trim();
    const kw2 = q('#cl-p-kw2').value.trim();
    const params = { nick: '', kws: [], type: '', typeLabel: '' };
    let title;
    if (pMode === 'nick') {
      if (!raw) return msgFor('probiv', 'Введи ник игрока');
      params.nick = raw;
      params.kws = splitKw(kw2);
      title = `Пробив: ${raw}` + (params.kws.length ? ` + ${params.kws.join(', ')}` : '');
    } else if (pMode === 'kw') {
      params.kws = splitKw(raw);
      if (!params.kws.length) return msgFor('probiv', 'Введи ключевое слово (можно несколько через запятую)');
      title = `Пробив: ${params.kws.join(', ')}`;
    } else {
      const opt = typeOpts.find(o => o.label.toLowerCase() === raw.toLowerCase());
      if (!opt) return msgFor('probiv', 'Выбери тип из подсказок (начни писать и выбери из списка)');
      params.type = opt.value;
      params.typeLabel = opt.label;
      title = `Пробив: ${opt.label}`;
    }
    const from = normDT(q('#cl-p-from').value), to = normDT(q('#cl-p-to').value);
    if (!from || !to) return msgFor('probiv', 'Дата в формате 2026-10-11 14:30:00 (можно вставить из логов)');
    if (from >= to) return msgFor('probiv', 'Дата «от» должна быть раньше «до»');
    runJob(makeJob('probiv', title, params, from, to));
  }

  function startMech() {
    if (!gateOk('mech') || busy) return;
    const from = normDT(q('#cl-m-from').value), to = normDT(q('#cl-m-to').value);
    if (!from || !to) return msgFor('mech', 'Дата в формате 2026-10-11 14:30:00');
    if (from >= to) return msgFor('mech', 'Дата «от» должна быть раньше «до»');
    const num = id => { const v = q(id).value.trim(); return v ? Number(v.replace(/[ ,]/g, '')) || 0 : 0; };
    const player = q('#cl-m-player').value.trim().toLowerCase();
    const params = {
      nick: '', player, kws: splitKw(q('#cl-m-kw').value),
      car: q('#cl-m-car').value.trim().toLowerCase(),
      min: num('#cl-m-min'), max: num('#cl-m-max'),
      th: { ...cfg('mech') },
    };
    const title = 'Махинатор' + (player ? ': ' + player : '') + (params.car ? ' · ' + params.car : '');
    runJob(makeJob('mech', title, params, from, to));
  }

  function startVirt() {
    if (!gateOk('virt') || busy) return;
    const nick = q('#cl-v-nick').value.trim();
    if (!nick) return msgFor('virt', 'Укажи ник игрока');
    const from = normDT(q('#cl-v-from').value), to = normDT(q('#cl-v-to').value);
    if (!from || !to) return msgFor('virt', 'Дата в формате 2026-10-11 14:30:00');
    if (from >= to) return msgFor('virt', 'Дата «от» должна быть раньше «до»');
    runJob(makeJob('virt', 'Вирты: ' + nick, { nick }, from, to));
  }

  function saveMechThresholds() {
    const num = id => Number(q(id).value.replace(/[ ,]/g, '')) || 0;
    setCfg('mech', { big: num('#cl-th-big'), cheap: num('#cl-th-cheap'), res: num('#cl-th-res'), barrel: num('#cl-th-barrel') });
    msgFor('mech', 'Пороги сохранены');
  }

  function showFilter(kind) {
    qa('.f-view').forEach(v => v.classList.remove('act'));
    q(kind ? '#f-' + kind : '#f-menu').classList.add('act');
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
    if (name === 'filters') showFilter(null);
    if (name === 'logs') renderLogs();
  }
  function openAccount() {
    if (updState().blocked) return activateTab('update');
    qa('.cl-tab').forEach(t => t.classList.toggle('act', t.dataset.tab === 'profile'));
    qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === 'account'));
    renderAccountForm();
  }

  /* =========================================================
     ПОСТРОЕНИЕ ИНТЕРФЕЙСА
     ========================================================= */
  function buildUI() {
    const serverOpts = SERVERS.map(([n, name]) => `<option value="${n}">[${n}] ${name}</option>`).join('');
    const posOpts = POSITIONS.map(p => `<option value="${p}"${p === 'Администратор' ? ' selected' : ''}>${p}</option>`).join('');
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fromVal = fmtSite(startOfDay), toVal = fmtSite(now);
    const limitRadios = LIMITS.map(n =>
      `<label><input type="radio" name="cl-lim" value="${n}" ${n === cfg('limit') ? 'checked' : ''}><span>${n}</span></label>`).join('');
    const perRadios = PER_OPTIONS.map(n =>
      `<label><input type="radio" name="cl-per" value="${n}" ${n === cfg('perReq') ? 'checked' : ''}><span>${n}</span></label>`).join('');
    const cdRadios = CD_OPTIONS.map(n =>
      `<label><input type="radio" name="cl-cd" value="${n}" ${n === cfg('cd') ? 'checked' : ''}><span>${n} сек</span></label>`).join('');
    const bannerRadios = [['', 'Стоковый'], ['black', 'Чёрный'], ['white', 'Белый']].map(([v, n]) =>
      `<label><input type="radio" class="cl-banner-r" name="cl-banner" value="${v}"><span>${n}</span></label>`).join('');
    const fxChips = FX_TYPES.map(([v, n, e]) =>
      `<label><input type="radio" name="cl-fxt" value="${v}" ${cfg('fx').type === v ? 'checked' : ''}>${e ? e + ' ' : ''}${n}</label>`).join('');
    const blurVal = clamp(+cfg('blur'), 0, 20);
    const mech = cfg('mech');
    const typeOptsHtml = typeOpts.map(o => `<option value="${esc(o.label)}"></option>`).join('');
    const themeSec = key => `
      <div class="th-sec" data-key="${key}">
        <div class="cl-secrow"><div class="cl-sec">${THEME_LABELS[key]}</div>
          <button class="cl-btnp small sec th-reset" data-key="${key}">Сбросить</button></div>
        <label class="cl-sw"><span>Градиент</span><input type="checkbox" class="th-grad" data-key="${key}"></label>
        <div class="th-rows"></div>
      </div>`;

    ui.innerHTML = `
      <style>${CSS}</style>
      <div id="cl-btn" title="CustomLogs — клик: меню, Alt + тяни: перемещение">
        <img src="${FIGURE}" alt="">
        <div class="cl-zzz"><span>z</span><span>z</span><span>Z</span></div>
        <div class="cl-bubble"><span class="cl-dot ok" id="cl-bubble-dot"></span><span id="cl-bubble-text"></span></div>
      </div>

      <div id="cl-warn">
        <div class="cl-box center">
          <div class="cl-warn-ico">!</div>
          <h3>Предупреждение</h3>
          <p>${WARN_TEXT}</p>
          <button class="cl-btnp" id="cl-warn-ok">Понятно</button>
        </div>
      </div>

      <div id="cl-upopup">
        <div class="cl-upbox">
          <h3>Скрипт обновлён до <span id="cl-upv"></span></h3>
          <div class="cl-upbody" id="cl-upbody"></div>
          <div class="cl-upend">${WELCOME_TXT}</div>
          <div class="cl-upbar"><i></i></div>
          <button class="cl-btnp small sec" id="cl-upclose">Закрыть</button>
        </div>
      </div>

      <div id="cl-panel">
        <div id="cl-fx"></div>
        <div class="cl-head">
          <div class="cl-title"><b>CustomLogs</b><span>Rodina RP</span><em class="cl-beta">BETA</em><span class="cl-ver">${VERSION}</span></div>
          <span class="cl-x" title="Закрыть">✕</span>
        </div>
        <div class="cl-main">
          <div class="cl-nav">
            <div class="cl-tab act" data-tab="home">${ICON.home}<span>Главная</span></div>
            <div class="cl-tab" data-tab="profile">${ICON.user}<span>Профиль</span></div>
            <div class="cl-tab" data-tab="settings">${ICON.gear}<span>Техничка</span></div>
            <div class="cl-tab" data-tab="filters">${ICON.search}<span>Фильтры</span></div>
            <div class="cl-tab" data-tab="logs">${ICON.logs}<span>Логи</span></div>
            <div class="cl-tab lock" data-tab="ivent">${ICON.spark}<span>Ивенты</span></div>
            <div class="cl-tab" data-tab="offer">${ICON.chat}<span>Предложения</span></div>
            <div class="cl-tab" data-tab="update">${ICON.info}<span>О скрипте</span></div>
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
                  <label class="cl-lbl">Должность (выбирается при регистрации)</label>
                  <select class="cl-in" id="cl-a-pos">${posOpts}</select>
                </div>
                <button class="cl-btnp" id="cl-a-login">Войти</button>
                <button class="cl-btnp sec" id="cl-a-reg">Создать аккаунт</button>
                <div class="cl-msg" id="cl-a-msg"></div>
              </div>
            </div>

            <div class="cl-pane act cl-home" data-pane="home">
              <div class="cl-hero">
                <h2>Добро пожаловать в <em>Custom Logs!</em></h2>
                <p>Продуктивного проживания в Логах Проекта Rodina Roleplay</p>
                <div class="cl-status"><span class="cl-dot static" id="cl-status-dot"></span><span id="cl-status-text"></span></div>
              </div>
              <div class="cl-foot">Разработчик/Владелец - Without Custom</div>
            </div>

            <div class="cl-pane" data-pane="profile">
              <div class="cl-profcard">
                <div class="cl-cover" id="cl-cover"></div>
                <div class="cl-cbody">
                  <div class="cl-av"><img id="cl-avimg" alt=""></div>
                  <div class="cl-nick" id="cl-pnick">Гость</div>
                  <div class="cl-badges" id="cl-badges"></div>
                  <div class="cl-infos">
                    <div><span>Сервер</span><b id="cl-pserver">—</b></div>
                    <div><span>VK</span><b id="cl-pvk">—</b></div>
                    <div><span>Telegram</span><b id="cl-ptg">—</b></div>
                    <div><span>Огонёк</span><b id="cl-streakdays">0 дней подряд</b></div>
                  </div>
                  <div class="cl-streakrow">
                    <span id="cl-flame"></span>
                    <div><div class="cl-tiername" id="cl-tiername"></div><div class="cl-next" id="cl-nexttier"></div></div>
                  </div>
                </div>
              </div>
              <button class="cl-btnp" id="cl-goacc">Настройка профиля</button>
            </div>

            <div class="cl-pane" data-pane="account">
              <div class="cl-top">
                <button class="cl-btnp small sec" id="cl-acc-back">← Назад</button>
                <div class="cl-title-sm">Настройка профиля</div>
              </div>
              <div class="cl-setrow">
                <div class="cl-setlbl">Аватар:</div>
                <div>
                  <div class="cl-avbig" id="cl-av-zone" tabindex="0"><img id="cl-av-prev" alt=""></div>
                  <div class="cl-hint2">Нажмите на изображение, чтобы сменить аватар, или вставьте ссылку ниже.</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-av-url" placeholder="Ссылка на картинку с любого сайта">
                    <button class="cl-btnp" id="cl-av-urlgo">Вставить</button>
                  </div>
                  <input type="file" id="cl-av-file" accept="image/*" hidden>
                  <div class="cl-row">
                    <button class="cl-btnp small sec" id="cl-av-paste">Из буфера</button>
                    <button class="cl-btnp small sec danger" id="cl-av-reset">Сбросить</button>
                  </div>
                  <div class="cl-msg" id="cl-av-msg"></div>
                </div>
              </div>
              <div class="cl-setrow">
                <div class="cl-setlbl">Баннер профиля:</div>
                <div>
                  <div class="cl-bnwide" id="cl-bn-zone" tabindex="0"><div id="cl-bn-prev" style="width:100%;height:100%;background-size:cover;background-position:center"></div></div>
                  <div class="cl-hint2">Нажмите на баннер, чтобы сменить, или вставьте ссылку ниже.</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-bn-url" placeholder="Ссылка на картинку с любого сайта">
                    <button class="cl-btnp" id="cl-bn-urlgo">Вставить</button>
                  </div>
                  <input type="file" id="cl-bn-file" accept="image/*" hidden>
                  <div class="cl-row">
                    <button class="cl-btnp small sec" id="cl-bn-paste">Из буфера</button>
                    <button class="cl-btnp small sec danger" id="cl-bn-reset">Сбросить</button>
                  </div>
                  <div class="cl-msg" id="cl-bn-msg"></div>
                </div>
              </div>
              <div class="cl-setrow">
                <div class="cl-setlbl">Связь:</div>
                <div>
                  <label class="cl-lbl">VK (ссылка на профиль)</label>
                  <input class="cl-in" id="cl-vk" placeholder="https://vk.ru/имя">
                  <label class="cl-lbl">Telegram</label>
                  <input class="cl-in" id="cl-tg" placeholder="@имя">
                  <button class="cl-btnp small" id="cl-ct-save">Сохранить связь</button>
                  <div class="cl-msg" id="cl-ct-msg"></div>
                </div>
              </div>
              <div class="cl-grid2" style="margin-top:14px">
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
                  <label class="cl-lbl">Должность</label>
                  <select class="cl-in" id="cl-acc-pos"></select>
                  <button class="cl-btnp small" id="cl-acc-posgo">Сохранить должность</button>
                  <div class="cl-msg" id="cl-acc-msg3"></div>
                </div>
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Пароль</div>
                  <label class="cl-lbl">Старый пароль</label>
                  <input class="cl-in" id="cl-acc-oldp" type="password">
                  <label class="cl-lbl">Новый пароль (минимум 4 символа)</label>
                  <input class="cl-in" id="cl-acc-newp" type="password">
                  <button class="cl-btnp small" id="cl-acc-passgo">Сменить пароль</button>
                  <div class="cl-msg" id="cl-acc-msg2"></div>
                </div>
              </div>
              <button class="cl-btnp sec danger" id="cl-logout">Выйти из аккаунта</button>
            </div>

            <div class="cl-pane" data-pane="settings">
              <div class="cl-subtabs">
                <div class="cl-subtab act" data-ssub="logs">Логи</div>
                <div class="cl-subtab" data-ssub="script">Скрипт</div>
              </div>

              <div class="cl-sub act" data-spane="logs">
                <div class="cl-grid2">
                  <div>
                    <div class="cl-card" style="margin-top:0">
                      <div class="cl-sec">Фон логов</div>
                      <div class="cl-seg">${bannerRadios}</div>
                      <label class="cl-sw"><span>Показывать свою картинку или гифку</span>
                        <input type="checkbox" id="cl-bgon"></label>
                      <div class="cl-prev" id="cl-bg-prev"><span class="cl-prev-empty" id="cl-bg-empty">Картинка не выбрана</span></div>
                      <div class="cl-drop" id="cl-bg-zone" tabindex="0">
                        <div class="cl-drop-ico">⬆</div>
                        <div><b>Перетащи фото или гифку</b><span>Нажми сюда, вставь Ctrl+V или выбери файл</span></div>
                      </div>
                      <input type="file" id="cl-bg-file" accept="image/*" hidden>
                      <div class="cl-urlrow">
                        <input class="cl-in" id="cl-bg-url" placeholder="Ссылка на фото или гифку">
                        <button class="cl-btnp" id="cl-bg-urlgo">Вставить</button>
                      </div>
                      <div class="cl-row">
                        <button class="cl-btnp small sec" id="cl-bg-paste">Из буфера</button>
                        <button class="cl-btnp small sec danger" id="cl-bg-reset">Сбросить картинку</button>
                      </div>
                      <div class="cl-msg" id="cl-bg-msg"></div>
                      <div class="cl-sec" style="margin-top:12px">Блюр картинки: <span id="cl-blurv">${blurVal}</span> px</div>
                      <input class="cl-range" type="range" id="cl-blur" min="0" max="20" value="${blurVal}">
                    </div>
                    <div class="cl-card">
                      <div class="cl-sec">Приватность логов</div>
                      <label class="cl-sw"><span>Скрывать IP (столбец и адреса)</span>
                        <input type="checkbox" id="cl-ipb" ${cfg('ipHide') ? 'checked' : ''}></label>
                      <label class="cl-sw"><span>Скрывать деньги (столбец и суммы)</span>
                        <input type="checkbox" id="cl-moneyb" ${cfg('moneyHide') ? 'checked' : ''}></label>
                    </div>
                  </div>
                  <div>
                    <div class="cl-card" style="margin-top:0">
                      <div class="cl-sec">Строк за один запрос</div>
                      <div class="cl-seg">${perRadios}</div>
                      <div class="cl-hint2">По умолчанию 90. Скрипт берёт столько строк, проверяет их и переходит дальше.</div>
                    </div>
                    <div class="cl-card">
                      <div class="cl-sec">Пауза между запросами</div>
                      <div class="cl-seg">${cdRadios}</div>
                      <div class="cl-hint2">5 сек — минимум. Если сайт начнёт ограничивать запросы, выбери 10 или 15 сек.</div>
                    </div>
                    <div class="cl-card">
                      <div class="cl-sec">Сохранение результата</div>
                      <label class="cl-sw"><span>Сохранять во вкладку «Логи»</span>
                        <input type="checkbox" id="cl-savelogs" ${cfg('saveLogs') ? 'checked' : ''}></label>
                      <label class="cl-sw"><span>Скачивать файл .txt по окончании</span>
                        <input type="checkbox" id="cl-savefile" ${cfg('saveFile') ? 'checked' : ''}></label>
                      <div class="cl-hint2">Можно выбрать одно или оба. Если выбран только файл, после скачивания проверка не остаётся во вкладке «Логи».</div>
                    </div>
                    <div class="cl-card">
                      <div class="cl-sec">Строк на странице логов сайта</div>
                      <div class="cl-seg">${limitRadios}</div>
                      <label class="cl-sw"><span>Автоматически выставлять это значение</span>
                        <input type="checkbox" id="cl-limon" ${cfg('limitOn') ? 'checked' : ''}></label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cl-sub" data-spane="script">
                <div id="cl-set-script">
                  ${themeSec('accent')}
                  ${themeSec('panel')}
                  ${themeSec('hover')}
                  <div class="th-sec">
                    <div class="cl-sec">Анимация меню</div>
                    <div class="fx-chips">${fxChips}</div>
                    <div class="cl-row left" style="margin-top:12px">
                      <div style="flex:1;min-width:200px">
                        <div class="cl-lbl">Частота: <span id="cl-fx-countv">${cfg('fx').count}</span> шт.</div>
                        <input class="cl-range" type="range" id="cl-fx-count" min="3" max="40" value="${cfg('fx').count}">
                      </div>
                      <div style="flex:1;min-width:200px">
                        <div class="cl-lbl">Скорость падения: <span id="cl-fx-speedv">${cfg('fx').speed}</span> сек (меньше — быстрее)</div>
                        <input class="cl-range" type="range" id="cl-fx-speed" min="4" max="20" value="${cfg('fx').speed}">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cl-pane" data-pane="filters">
              <div id="f-menu" class="f-view act">
                <div class="fcards">
                  <div class="fcard" data-f="probiv"><div class="fico">🕵️</div><b>Пробив</b><span>Поиск по нику, ключевым словам или типу из логов</span></div>
                  <div class="fcard" data-f="mech"><div class="fico">⛓️</div><b>Махинатор</b><span>Подозрительные переводы, продажи и бочки за период</span></div>
                  <div class="fcard" data-f="virt"><div class="fico">💰</div><b>Вирты</b><span>Сколько игрок заработал и потратил за период</span></div>
                </div>
              </div>

              <div id="f-probiv" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Фильтры</button><div class="cl-title-sm">Пробив</div></div>
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
                    <div id="cl-p-kw2-wrap">
                      <label class="cl-lbl">Ключевые слова (через запятую, необязательно)</label>
                      <input class="cl-in" id="cl-p-kw2" placeholder="PayPass, бочка" autocomplete="off">
                    </div>
                    <div class="cl-hint2" id="cl-p-ex"></div>
                  </div>
                  <div class="cl-card" style="margin-top:12px">
                    <label class="cl-lbl">Период от (можно вставить из логов)</label>
                    <input class="cl-in" id="cl-p-from" value="${fromVal}" autocomplete="off">
                    <label class="cl-lbl">Период до</label>
                    <input class="cl-in" id="cl-p-to" value="${toVal}" autocomplete="off">
                  </div>
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-p-go">Искать</button>
                  <button class="cl-btnp sec cl-stop" data-kind="probiv">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="probiv">Продолжить</button>
                </div>
                <div class="cl-msg" id="cl-msg-p"></div>
                <div class="cl-card">
                  <div class="cl-sec">Продолжить из файла</div>
                  <div class="cl-hint2">Если поиск сломался, Макима скачала файл. Загрузи его сюда, и поиск начнётся с последней строки.</div>
                  <div class="cl-drop" id="cl-pf-zone" tabindex="0">
                    <div class="cl-drop-ico">⬆</div>
                    <div><b>Выбери файл .txt от Макимы</b><span>Нажми сюда или перетащи файл</span></div>
                  </div>
                  <input type="file" id="cl-pf-file" accept=".txt,text/plain" hidden>
                  <div class="cl-hint2" id="cl-pf-info">Файл ещё не загружен</div>
                  <button class="cl-btnp" id="cl-pf-go">Продолжить из файла</button>
                </div>
              </div>

              <div id="f-mech" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Фильтры</button><div class="cl-title-sm">Махинатор</div></div>
                <div class="cl-grid">
                  <div class="cl-card" style="margin-top:0">
                    <label class="cl-lbl">Ник игрока (необязательно)</label>
                    <input class="cl-in" id="cl-m-player" placeholder="Kent_Dairo">
                    <label class="cl-lbl">Ключевые слова (через запятую, необязательно)</label>
                    <input class="cl-in" id="cl-m-kw" placeholder="бочка, нефть">
                    <label class="cl-lbl">Машина или марка (необязательно)</label>
                    <input class="cl-in" id="cl-m-car" placeholder="Tesla">
                    <div class="cl-grid" style="gap:8px">
                      <div><label class="cl-lbl">Сумма от, руб.</label><input class="cl-in" id="cl-m-min" placeholder="0"></div>
                      <div><label class="cl-lbl">Сумма до, руб.</label><input class="cl-in" id="cl-m-max" placeholder="—"></div>
                    </div>
                  </div>
                  <div class="cl-card" style="margin-top:0">
                    <label class="cl-lbl">Период от (можно вставить из логов)</label>
                    <input class="cl-in" id="cl-m-from" value="${fromVal}" autocomplete="off">
                    <label class="cl-lbl">Период до</label>
                    <input class="cl-in" id="cl-m-to" value="${toVal}" autocomplete="off">
                    <div class="cl-sec" style="margin-top:14px">Пороги подозрительного</div>
                    <div class="cl-grid" style="gap:8px">
                      <div><label class="cl-lbl">Перевод от, руб.</label><input class="cl-in" id="cl-th-big" value="${mech.big}"></div>
                      <div><label class="cl-lbl">Продажа авто ниже, руб.</label><input class="cl-in" id="cl-th-cheap" value="${mech.cheap}"></div>
                      <div><label class="cl-lbl">Продаж ресурсов, шт.</label><input class="cl-in" id="cl-th-res" value="${mech.res}"></div>
                      <div><label class="cl-lbl">Продаж бочек, шт.</label><input class="cl-in" id="cl-th-barrel" value="${mech.barrel}"></div>
                    </div>
                    <button class="cl-btnp small sec" id="cl-th-save">Сохранить пороги</button>
                  </div>
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-m-go">Запустить Махинатор</button>
                  <button class="cl-btnp sec cl-stop" data-kind="mech">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="mech">Продолжить</button>
                </div>
                <div class="cl-msg" id="cl-msg-m"></div>
              </div>

              <div id="f-virt" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Фильтры</button><div class="cl-title-sm">Вирты</div></div>
                <div class="cl-card" style="margin-top:0">
                  <label class="cl-lbl">Ник игрока (Nick_Name)</label>
                  <input class="cl-in" id="cl-v-nick" placeholder="Kent_Dairo">
                  <label class="cl-lbl">Период от (можно вставить из логов)</label>
                  <input class="cl-in" id="cl-v-from" value="${fromVal}" autocomplete="off">
                  <label class="cl-lbl">Период до</label>
                  <input class="cl-in" id="cl-v-to" value="${toVal}" autocomplete="off">
                  <div class="cl-hint2">Считаются только строки, где игрок получает или теряет деньги. Комиссии за продажу не учитываются.</div>
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-v-go">Посчитать вирты</button>
                  <button class="cl-btnp sec cl-stop" data-kind="virt">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="virt">Продолжить</button>
                </div>
                <div class="cl-msg" id="cl-msg-v"></div>
              </div>
            </div>

            <div class="cl-pane" data-pane="logs">
              <div class="cl-top"><div class="cl-title-sm">Логи</div></div>
              <div class="cl-hint2">Здесь все проверки: дата слева, вид и параметры справа. Остановленные можно продолжить, готовые открыть или скачать TXT.</div>
              <div id="cl-logs"></div>
            </div>

            <div class="cl-pane" data-pane="ivent">
              <div class="cl-lock"><div class="cl-lock-ico">🔒</div><h2>В разработке</h2><p>Ивенты скоро появятся</p></div>
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
                <div class="upd-line" id="cl-upd-remote">Доступная версия: проверяю…</div>
                <div class="cl-row">
                  <button class="cl-btnp small" id="cl-upd-check">Проверить обновления</button>
                  <button class="cl-btnp small sec" id="cl-upd-dl">Обновить</button>
                </div>
                <div class="cl-msg" id="cl-upd-msg"></div>
              </div>
              <div class="cl-card">
                <label class="cl-sw"><span>Автообновление</span><input type="checkbox" id="cl-autoupd" ${cfg('autoUpd') ? 'checked' : ''}></label>
                <div class="autoupd-note">При включении автообновления скрипт будет обновляться сам при появлении нового обновления.</div>
              </div>
              <div class="cl-sec" style="margin-top:14px">Версии</div>
              <div id="cl-verlist"></div>
            </div>

          </div>
        </div>
      </div>

      <div id="cl-win">
        <div class="cl-head">
          <div class="cl-title"><b id="cl-wtitle"></b></div>
          <div class="cl-whead-btns">
            <button class="cl-btnp small sec" id="cl-wtxt">Скачать TXT</button>
            <span class="cl-x" id="cl-wclose">✕</span>
          </div>
        </div>
        <div class="cl-wbody"></div>
      </div>`;

    btn = q('#cl-btn');
    bubble = q('.cl-bubble');
    panel = q('#cl-panel');

    /* Вкладки и подразделы */
    qa('.cl-tab').forEach(tab => tab.onclick = () => activateTab(tab.dataset.tab));
    q('.cl-x').onclick = () => togglePanel(false);
    q('#cl-wclose').onclick = () => q('#cl-win').classList.remove('open');
    q('#cl-warn-ok').onclick = () => {
      q('#cl-warn').classList.remove('open');
      if (pending) { const f = pending; pending = null; f(); }
    };
    document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });
    qa('.cl-subtab').forEach(s => s.onclick = () => {
      qa('.cl-subtab').forEach(x => x.classList.toggle('act', x === s));
      qa('.cl-sub').forEach(p => p.classList.toggle('act', p.dataset.spane === s.dataset.ssub));
    });
    qa('.fcard').forEach(c => c.onclick = () => showFilter(c.dataset.f));
    qa('[data-back]').forEach(b => b.onclick = () => showFilter(null));
    qa('.cl-mode[data-mode]').forEach(m => m.onclick = () => setPMode(m.dataset.mode));
    setPMode(pMode);

    /* Перетаскивание меню за шапку */
    const head = q('.cl-head');
    let pDrag = false, px = 0, py = 0, plx = 0, ply = 0;
    head.addEventListener('pointerdown', e => {
      if (e.target.closest('.cl-x') || e.target.closest('button')) return;
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
        accs[key] = { nick, salt, hash: await hashPass(pass, salt), server, position: q('#cl-a-pos').value, vk: '', tg: '' };
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

    /* Фильтры */
    q('#cl-p-go').onclick = startProbiv;
    q('#cl-m-go').onclick = startMech;
    q('#cl-v-go').onclick = startVirt;
    q('#cl-th-save').onclick = saveMechThresholds;
    qa('.cl-stop').forEach(b => b.onclick = () => {
      if (!busy || curKind !== b.dataset.kind) return;
      stopFlag = true;
      b.textContent = 'Останавливаю…';
      b.disabled = true;
      setMsg('Останавливаю на текущей пачке…');
    });
    qa('.cl-res').forEach(b => b.onclick = () => { if (b.dataset.id) resumeJob(b.dataset.id); });
    const pfZone = q('#cl-pf-zone'), pfFile = q('#cl-pf-file');
    pfZone.addEventListener('click', () => pfFile.click());
    pfZone.addEventListener('keydown', e => { if (e.key === 'Enter') pfFile.click(); });
    pfFile.addEventListener('change', () => { if (pfFile.files[0]) loadResumeFile(pfFile.files[0]); pfFile.value = ''; });
    pfZone.addEventListener('dragover', e => { e.preventDefault(); pfZone.classList.add('drag'); });
    pfZone.addEventListener('dragleave', () => pfZone.classList.remove('drag'));
    pfZone.addEventListener('drop', e => {
      e.preventDefault();
      pfZone.classList.remove('drag');
      const f = e.dataTransfer && e.dataTransfer.files[0];
      if (f) loadResumeFile(f);
    });
    q('#cl-pf-go').onclick = startFromFile;
    q('#cl-wtxt').onclick = () => {
      if (!shownJob) return;
      download(`CustomLogs_${shownJob.kind}_${fileDate(shownJob.created)}.txt`, jobTxt(shownJob, shownJob.done ? 'готово' : 'остановлено'));
    };

    /* Вкладка «Логи» */
    q('#cl-logs').addEventListener('click', e => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      const job = cfg('jobs').find(j => j.id === b.dataset.id);
      if (!job) return;
      if (b.dataset.act === 'open') showJob(job);
      if (b.dataset.act === 'txt') { shownJob = job; download(`CustomLogs_${job.kind}_${fileDate(job.created)}.txt`, jobTxt(job, job.done ? 'готово' : 'остановлено')); }
      if (b.dataset.act === 'resume') resumeJob(job.id);
      if (b.dataset.act === 'del') {
        setCfg('jobs', cfg('jobs').filter(j => j.id !== job.id));
        renderLogs();
        renderResumeBtns();
      }
    });

    /* Профиль */
    q('#cl-goacc').onclick = openAccount;
    q('#cl-acc-back').onclick = () => activateTab('profile');
    q('#cl-acc-nickgo').onclick = changeNick;
    q('#cl-acc-servergo').onclick = changeServer;
    q('#cl-acc-posgo').onclick = changePosition;
    q('#cl-acc-passgo').onclick = changePass;
    q('#cl-ct-save').onclick = saveContacts;
    q('#cl-logout').onclick = logout;
    bindUploader({
      zone: q('#cl-av-zone'), input: q('#cl-av-file'), urlInput: q('#cl-av-url'), urlBtn: q('#cl-av-urlgo'),
      pasteBtn: q('#cl-av-paste'), status: q('#cl-av-msg'), maxMB: 1.5,
      apply: async src => { const a = getAcc(); if (a) saveAcc(a.key, { avatar: src }); renderAuth(); },
    });
    q('#cl-av-reset').onclick = () => {
      const a = getAcc(); if (a) saveAcc(a.key, { avatar: '' });
      renderAuth();
      q('#cl-av-msg').textContent = 'Аватар сброшен';
    };
    bindUploader({
      zone: q('#cl-bn-zone'), input: q('#cl-bn-file'), urlInput: q('#cl-bn-url'), urlBtn: q('#cl-bn-urlgo'),
      pasteBtn: q('#cl-bn-paste'), status: q('#cl-bn-msg'), maxMB: 3,
      apply: async src => { const a = getAcc(); if (a) saveAcc(a.key, { banner: src }); renderAuth(); },
    });
    q('#cl-bn-reset').onclick = () => {
      const a = getAcc(); if (a) saveAcc(a.key, { banner: '' });
      renderAuth();
      q('#cl-bn-msg').textContent = 'Баннер сброшен';
    };

    /* Техничка: логи */
    q('#cl-bgon').onchange = e => { setCfg('bgOn', e.target.checked); applyBg(); renderBgPreview(); };
    qa('.cl-banner-r').forEach(r => r.onchange = () => { setCfg('banner', r.value); applyBg(); renderBgPreview(); });
    bindUploader({
      zone: q('#cl-bg-zone'), input: q('#cl-bg-file'), urlInput: q('#cl-bg-url'), urlBtn: q('#cl-bg-urlgo'),
      pasteBtn: q('#cl-bg-paste'), status: q('#cl-bg-msg'), maxMB: 4,
      apply: async src => { setCfg('bgUrl', src); setCfg('bgOn', true); applyBg(); renderBgPreview(); },
    });
    q('#cl-bg-reset').onclick = () => {
      setCfg('bgUrl', ''); setCfg('bgOn', false);
      applyBg(); renderBgPreview();
      q('#cl-bg-msg').textContent = 'Картинка сброшена';
    };
    q('#cl-blur').oninput = e => {
      setCfg('blur', +e.target.value);
      q('#cl-blurv').textContent = e.target.value;
      applyBg();
    };
    q('#cl-ipb').onchange = e => { setCfg('ipHide', e.target.checked); syncSite(true); };
    q('#cl-moneyb').onchange = e => { setCfg('moneyHide', e.target.checked); syncSite(true); };
    qa('input[name="cl-per"]').forEach(r => r.onchange = () => setCfg('perReq', +r.value));
    qa('input[name="cl-cd"]').forEach(r => r.onchange = () => setCfg('cd', +r.value));
    q('#cl-savelogs').onchange = e => setCfg('saveLogs', e.target.checked);
    q('#cl-savefile').onchange = e => setCfg('saveFile', e.target.checked);
    qa('input[name="cl-lim"]').forEach(r => r.onchange = () => { setCfg('limit', +r.value); applyLimit(); });
    q('#cl-limon').onchange = e => { setCfg('limitOn', e.target.checked); applyLimit(); };

    /* Техничка: скрипт (цвета и анимация) */
    const setSec = q('#cl-set-script');
    setSec.addEventListener('click', e => {
      const c = e.target.closest('.th-c[data-c]');
      if (c) { setThemePart(c.dataset.key, c.dataset.slot, c.dataset.c); renderThemeSecs(); return; }
      const r = e.target.closest('.th-reset');
      if (r) { saveTheme({ [r.dataset.key]: { ...DEF_THEME[r.dataset.key] } }); renderThemeSecs(); }
    });
    setSec.addEventListener('input', e => {
      if (!e.target.classList.contains('th-picker')) return;
      setThemePart(e.target.dataset.key, e.target.dataset.slot, e.target.value);
      e.target.closest('label').style.background = e.target.value;
    });
    setSec.addEventListener('change', e => {
      if (e.target.classList.contains('th-picker')) return renderThemeSecs();
      if (!e.target.classList.contains('th-grad')) return;
      const key = e.target.dataset.key;
      saveTheme({ [key]: { ...getTheme()[key], g: e.target.checked } });
      renderThemeSecs();
    });
    qa('input[name="cl-fxt"]').forEach(r => r.onchange = () => {
      setCfg('fx', { ...cfg('fx'), type: r.value });
      renderFx();
    });
    q('#cl-fx-count').oninput = e => {
      setCfg('fx', { ...cfg('fx'), count: +e.target.value });
      q('#cl-fx-countv').textContent = e.target.value;
      renderFx();
    };
    q('#cl-fx-speed').oninput = e => {
      setCfg('fx', { ...cfg('fx'), speed: +e.target.value });
      q('#cl-fx-speedv').textContent = e.target.value;
      renderFx();
    };
    renderThemeSecs();

    /* О скрипте */
    q('#cl-upd-check').onclick = () => checkUpdate(true);
    q('#cl-upd-dl').onclick = () => window.open(UPDATE_URL, '_blank');
    q('#cl-autoupd').onchange = e => setCfg('autoUpd', e.target.checked);
    renderVersions();

    renderBgPreview();
    renderFx();
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
  setTimeout(showUpdatePopupIfNeeded, 1500);
  migrateAccounts().then(renderAuth);

  // Предупреждение: незарегистрированным и тем, кто давно не заходил
  if (!isLogged() || inactive) setTimeout(() => q('#cl-warn').classList.add('open'), 600);

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
