// ==UserScript==
// @name         CustomLogs — Rodina RP
// @namespace    customlogs.rodina
// @version      5.2.0
// @description  Поиск (Пробив, Махинатор, Вирты), Лог Проверки, профиль, анимации, фон логов, кастомизация, обновления
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

  // Если пользователь удалил аккаунт и скрипт, при следующем запуске ничего не делаем
  if (GM_getValue('cl_deleted', false)) return;

  /* ================= НАСТРОЙКИ ================= */
  const VERSION = 'v5.2.0';
  const VERSION_NUM = '5.2.0';   // держи равным @version в заголовке
  const UPDATE_URL = 'https://raw.githubusercontent.com/Customka/customlogs/main/customlogs.user.js';
  const OWNER_NICK = 'without_custom';
  const OWNER_PASS = '124578';

  /* ---------- ПЕРСОНАЖИ (иконка запуска и режим) ----------
     img — ссылка на картинку персонажа. Если нужна версия без фона, вставь сюда PNG/WebP (data:... или https://...). */
  const MECH_IMG = '';
  const CHARS = [
    { id: 'makima', name: 'Макима', short: 'Макима', female: true, bg: '#7f1d1d',
      img: 'https://www.mosigra.ru/image/cache/hobbygames_beta/data/predvaritelnie-tovari/bandai/figuarts/mini-makima-00-1024x1024.webp',
      theme: { accent: '#dc2626', panel: '#0a0a0a', hover: '#ffffff' } },
    { id: 'aizen', name: 'Айзен Соскэ', short: 'Айзен', female: false, bg: '#4a0e16',
      img: 'https://www.mosigra.ru/image/cache/hobbygames_beta/data/predvaritelnie-tovari/funko-pop/anime/bleach/bleach-sosuke-aizen-1697-00-1000x416.webp',
      theme: { accent: '#7f1d1d', panel: '#0a0a0a', hover: '#ffffff' } },
    { id: 'kaneki', name: 'Кен Канеки', short: 'Канеки', female: false, bg: '#111111',
      img: 'https://nendotoy.ru/wp-content/uploads/2025/12/tokyo-ghoul-kaneki-ken-nendoroid-2734-1.jpg',
      theme: { accent: '#ef4444', panel: '#000000', hover: '#ffffff' } },
    { id: 'rebecca', name: 'Ребекка', short: 'Ребекка', female: true, bg: '#0e7490',
      img: 'https://funkopoprussia.com/image/cache/data/Games/Cyberpunk-2077/funko-pop-russia-Rebecca-Cyberpunk-Edgerunners-2415-fu93276-2-500x500.png',
      theme: { accent: { g: true, c1: '#39ff14', c2: '#22d3ee' }, panel: '#04120b', hover: '#f472b6' } },
  ];
  const phImg = (t, bg) => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160" viewBox="0 0 120 160"><rect width="120" height="160" rx="22" fill="${bg || '#27272a'}"/><text x="60" y="98" font-size="64" text-anchor="middle" fill="#fff" font-family="Arial">${t}</text></svg>`);
  const charById = id => CHARS.find(c => c.id === id) || CHARS[0];
  const charImg = c => c.img || phImg(c.short[0], c.bg);

  const IDLE_MS = 7 * 60 * 1000;
  const UPD_CHECK_MS = 30 * 60 * 1000;
  const INACTIVE_DAYS = 30;
  const UPD_CRIT_DAYS = 1;
  const UPD_BLOCK_DAYS = 3;
  const UPD_RED_DAYS = 30;
  const STREAK_RESET_DAYS = 7;
  const STREAK_PROTECT = 200;
  const MAX_RETRY_429 = 4;
  const ROW_CAP = 20000;
  const MAX_RENDER = 3000;
  const JOBS_CAP = 30;
  const SAVE_EVERY = 5;
  const DAY_MS = 86400000;
  const POPUP_MS = 15000;
  const WARN_MS = 15000;
  const FILE_CD_MS = 5000;
  const MAX_UPLOAD_MB = 20;
  const CD_MIN = 0.5, CD_MAX = 60, CD_DEF = 3;
  const WARN_TEXT = 'Скрипт — неофициальное дополнение к сайту логов. Автор (Without Custom) не несёт ответственности за последствия его использования. Не злоупотребляй массовыми запросами, соблюдай правила сервера и не передавай свой аккаунт посторонним.';
  const CRASH_TEXT = 'Ой, похоже сломалось, я на всякий случай скачала тебе файл, надеюсь поможет 😢';
  const WELCOME_TXT = 'Буду стараться и дальше улучшать скрипт, спасибо что выбрали наш продукт.\nС уважением, Разработчик CustomLogs!';
  const QUOTES = [
    ['Путь в тысячу ли начинается с первого шага.', 'Лао-цзы'],
    ['Единственный способ делать великие дела — любить то, что ты делаешь.', 'Стив Джобс'],
    ['Воображение важнее знания.', 'Альберт Эйнштейн'],
    ['Если вы думаете, что можете, или думаете, что не можете, — вы правы.', 'Генри Форд'],
    ['Тот, кто хочет, ищет возможности. Тот, кто не хочет, ищет причины.', 'Сократ'],
    ['Не ошибается тот, кто ничего не делает.', 'Теодор Рузвельт'],
    ['Делай, что должно, и будь что будет.', 'Лев Толстой'],
    ['Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.', 'Уинстон Черчилль'],
  ];

  const TIERS = [
    { d: 0, c: '#6b7280', id: 'dim', name: 'огонёк ещё не набран' },
    { d: 10, c: '#9ca3af', id: 'grey', name: 'серый' },
    { d: 25, c: '#3b82f6', id: 'blue', name: 'синий' },
    { d: 50, c: '#22c55e', id: 'green', name: 'зелёный' },
    { d: 100, c: '#facc15', id: 'yellow', name: 'жёлтый' },
    { d: 200, c: '#ef4444', id: 'red', name: 'красный' },
    { d: 365, c: '#ef4444', id: 'grad', name: 'разноцветный' },
  ];
  const POSITIONS = ['Главный Администратор', 'Заместитель ГА', 'Куратор', 'Администратор'];
  const SELF_POSITIONS = ['Администратор', 'Куратор'];   // максимум, который можно выдать себе
  const TEST_ROLES = ['Пользователь', ...POSITIONS, 'Разработчик'];
  const POS_VER = 2;
  const POS_CLS = { 'Главный Администратор': 'p-ga', 'Заместитель ГА': 'p-zga', 'Куратор': 'p-cur', 'Администратор': 'p-adm', 'Разработчик': 'p-dev', 'Пользователь': 'p-user' };
  const ROLE_COLOR = { 'Разработчик': '#ef4444', 'Главный Администратор': '#22c55e', 'Заместитель ГА': '#4ade80', 'Куратор': '#a855f7', 'Администратор': '#3b82f6', 'Пользователь': '#9ca3af' };
  const BASE_TABS = ['home', 'settings', 'filters', 'logs', 'offer', 'update'];
  const STAFF_TABS = [...BASE_TABS, 'ivent'];
  const ROLE_ACCESS = {
    'Пользователь': { tabs: BASE_TABS, filters: ['probiv', 'virt'] },
    'Администратор': { tabs: STAFF_TABS, filters: ['probiv', 'mech', 'virt'] },
    'Куратор': { tabs: STAFF_TABS, filters: ['probiv', 'mech', 'virt'] },
    'Заместитель ГА': { tabs: STAFF_TABS, filters: ['probiv', 'mech', 'virt'] },
    'Главный Администратор': { tabs: STAFF_TABS, filters: ['probiv', 'mech', 'virt'] },
    'Разработчик': { tabs: [...STAFF_TABS, 'dev'], filters: ['probiv', 'mech', 'virt'] },
  };
  const LIMITS = [100, 500, 1000];
  const PER_OPTIONS = [100, 200, 500, 1000];
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
    accent: { g: false, c1: '#000000', c2: '#3b82f6' },
    panel: { g: false, c1: '#ffffff', c2: '#e5e7eb' },
    hover: { g: false, c1: '#000000', c2: '#ec4899' },
  };
  const STOCK_THEME = {
    accent: { g: false, c1: '#ffffff', c2: '#ffffff' },
    panel: { g: false, c1: '#000000', c2: '#000000' },
    hover: { g: false, c1: '#ffffff', c2: '#ffffff' },
  };
  const THEME_LABELS = { accent: 'Цвет менюшки', panel: 'Фон менюшки', hover: 'Наведение' };
  const FX_TYPES = [
    ['off', 'Выкл', ''], ['bow', 'Бантики', '🎀'], ['sun', 'Солнце', '☀️'],
    ['makima', 'Персонаж', ''], ['bolt', 'Молнии', '⚡'], ['snow', 'Снежинки', '❄️'], ['bat', 'Летучие мыши', '🦇'],
  ];
  const FX_COLORS = [
    ['auto', 'Авто (под фон)'], ['#ffffff', 'Белый'], ['#000000', 'Чёрный'], ['#9ca3af', 'Серый'],
    ['#ef4444', 'Красный'], ['#3b82f6', 'Синий'], ['#8b5cf6', 'Фиолетовый'], ['#ec4899', 'Розовый'],
    ['#facc15', 'Жёлтый'], ['#22c55e', 'Зелёный'],
  ];
  const PMODES = {
    nick: { label: 'Ник игрока' },
    kw: { label: 'Ключевые слова' },
    type: { label: 'Тип запроса' },
  };
  const MSG_ID = { probiv: '#cl-msg-p', mech: '#cl-msg-m', virt: '#cl-msg-v' };

  // История версий. Для каждого нового выпуска добавляй запись наверх. Показываются последние 5.
  const CHANGELOG = [
    {
      version: '5.2.0', date: '14.10.2026', items: [
        { type: 'Добавлено', text: 'Логи: вверху итог найденных строк, подсветка сумм, AZ Coins, машин, IP и чисел' },
        { type: 'Добавлено', text: 'Логи: выборочное скачивание строк или скачивание всех сразу, в файле дата, период, ник, ошибки и время поиска' },
        { type: 'Добавлено', text: 'Профиль: смена своей роли до Куратора, кнопка «Удалить аккаунт» с предупреждениями' },
        { type: 'Добавлено', text: 'Иконки запуска: Макима, Айзен, Канеки и Ребекка с новыми картинками и оформлением' },
        { type: 'Изменено', text: 'Огонёк после 200 дней не сбрасывается' },
        { type: 'Изменено', text: 'Скрытие IP: кликать по адресам нельзя; скрытие денег срабатывает для AZ Coins и других валют' },
        { type: 'Изменено', text: 'Комета на главной странице падает вертикально и реже; вкладка «Пользователи» убрана' },
        { type: 'Изменено', text: 'Белый фон логов убран; версия перенесена к BETA' },
      ],
    },
    {
      version: '5.1.0', date: '14.10.2026', items: [
        { type: 'Добавлено', text: 'Фон логов: Стоковый, Кастомный, Чёрный, Белый' },
        { type: 'Добавлено', text: 'Скрытие даты в логах, режимы анимации: снегопад, кровь, бантики, размер анимации' },
        { type: 'Изменено', text: 'КД по умолчанию 3 сек, можно задать свой. Запросы: 100, 200, 500, 1000' },
      ],
    },
    {
      version: '5.0.0', date: '13.10.2026', global: true, items: [
        { type: 'Добавлено', text: 'Все окна скрипта можно перемещать' },
        { type: 'Добавлено', text: 'Новый профиль: баннер, аватар, огонёк, блок «Связь»' },
        { type: 'Добавлено', text: 'Должность «Разработчик» и вкладка «Для Разработчика» с тестовым режимом' },
      ],
    },
    {
      version: '4.13.0', date: '12.10.2026', items: [
        { type: 'Добавлено', text: 'Роль «Разработчик» для аккаунта Without_Custom' },
        { type: 'Добавлено', text: 'Должности: Главный Администратор, Заместитель ГА, Куратор, Администратор' },
      ],
    },
    {
      version: '4.12.0', date: '12.10.2026', items: [
        { type: 'Добавлено', text: 'Вкладка «Логи»: все проверки с датой, можно открыть или продолжить' },
      ],
    },
  ];

  const KEY = {
    btnPos: 'cl_btn_pos', panelPos: 'cl_panel_pos', panelSize: 'cl_panel_size', bgUrl: 'cl_bg_url',
    banner: 'cl_banner', blur: 'cl_blur', theme: 'cl_theme', ipHide: 'cl_ip_hide', dateHide: 'cl_date_hide',
    moneyHide: 'cl_money_hide', limit: 'cl_limit', limitOn: 'cl_limit_on', accounts: 'cl_accounts',
    session: 'cl_session', streak: 'cl_streak', updRemote: 'cl_upd_remote', critical: 'cl_critical',
    outdated: 'cl_outdated', autoUpd: 'cl_auto_upd', autoTried: 'cl_auto_tried', lastSeen: 'cl_last_seen',
    perReq: 'cl_per_req', cd: 'cl_cd', cdVer: 'cl_cd_ver', saveLogs: 'cl_save_logs', saveFile: 'cl_save_file', allowDl: 'cl_allow_dl',
    fx: 'cl_fx', jobs: 'cl_jobs', mech: 'cl_mech', posVer: 'cl_pos_ver', ownerInit: 'cl_owner_init', roleFix: 'cl_role_fix',
    char: 'cl_char', charTheme: 'cl_char_theme', btnScale: 'cl_btn_scale', devRole: 'cl_dev_role',
  };
  const DEF = {
    btnPos: null, panelPos: null, panelSize: null, bgUrl: '', banner: 'black', blur: 0, theme: {},
    ipHide: true, dateHide: false, moneyHide: false, limit: 100, limitOn: false, accounts: {}, session: null,
    streak: { last: '', days: 0 }, updRemote: '', critical: false, outdated: null,
    autoUpd: true, autoTried: '', lastSeen: '', perReq: 100, cd: CD_DEF, cdVer: 0,
    saveLogs: true, saveFile: false, allowDl: true,
    fx: { type: 'snow', count: 10, speed: 10, color: 'auto', size: 100 }, jobs: [],
    mech: { big: 1000000, cheap: 100000, res: 15, barrel: 3 },
    posVer: 0, ownerInit: 0, roleFix: 0, char: 'makima', charTheme: true, btnScale: 1, devRole: '',
  };
  const TRANSFER_RE = /(передал|перевел|отправил|перевод)/i;
  const SALE_RE = /(продал|продажа|продажу)/i;
  const CAR_RE = /(т\/с|транспорт|автомоб|машин|\bавто\b|ВАЗ|IVECO|Tesla|Ferrari|Porsche|Mitsubishi|BMW|Mercedes|Lada|Kia|Toyota|Nissan|Mazda|Hyundai|Audi)/i;
  const RES_RE = /(материал|камень|лён|укроп|руд|нефт|бочк|ресурс|дерев|металл|ткан|зерн|молок|мяс|рыб|золот|железо|уголь|бензин|топлив)/i;
  const BARREL_RE = /бочк/i;
  const EARN_RE = /(получил|заработал|выручк|продал|доход|выигрыш)/i;
  const SPEND_RE = /(потратил|оплатил|заплатил|штраф|купил|отдал|передал|перевел)/i;
  // Подсветка: 1 IP, 2 деньги, 3 AZ Coins, 4 машины, 5-6 ник, 7 любое число
  const HL_RE = /(\b\d{1,3}(?:\.\d{1,3}){3}\b)|(\d(?:[\d ,]*\d)?\s*(?:руб\.?|денег))|(\bAZ[\s-]?Coins?\b|\bAZ\b)|(т\/с|транспорт\S*|автомоб\S*|машин\S*|\bавто\b|ВАЗ|IVECO|Tesla|Ferrari|Porsche|Mitsubishi|BMW|Mercedes|Lada|Kia|Toyota|Nissan|Mazda|Hyundai|Audi)|((?:Игрок|Игроку|Администратор)\s+)([^\s,.:;()\[\]<>]+)|(\d(?:[\d ,]*\d)?)/gi;
  const MONEY_TXT_RE = /\d(?:[\d ,]*\d)?\s*(?:руб\.?|денег|AZ[\s-]?Coins?|AZ\b|\$)/gi;
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
  const parseDT = s => {
    const m = String(s || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    return isNaN(d) ? null : d;
  };
  const normDT = s => { const d = parseDT(s); return d ? fmtSite(d) : ''; };
  const addSec = (s, sec) => { const d = parseDT(s); return d ? fmtSite(new Date(d.getTime() + sec * 1000)) : s; };
  const fileDate = ms => { const d = new Date(ms); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`; };
  const dateTimeRu = ms => { const d = new Date(ms); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
  const serverName = n => (SERVERS.find(s => s[0] === n) || [])[1] || '';
  const cmpVer = (a, b) => {
    const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      const d = (pa[i] || 0) - (pb[i] || 0);
      if (d) return d;
    }
    return 0;
  };
  const whoOf = a => (a.match(/(?:Игрок|Игроку)\s+(\S+)/) || [])[1] || '?';
  const parseMoney = t => {
    const m = t.match(/(\d[\d ,]*)\s*(?:руб|денег)/i);
    return m ? Number(m[1].replace(/[ ,]/g, '')) || 0 : 0;
  };
  const fmtPlain = v => `${Math.round(v).toLocaleString('ru-RU')} руб.`;
  const fmtDur = sec => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return `${h} ч ${m} мин ${s} сек`;
  };
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
  const mixHex = (a, b, t) => {
    const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
    const ch = s => Math.round(((x >> s) & 255) * (1 - t) + ((y >> s) & 255) * t);
    return '#' + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('');
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
  const isFemale = nick => /(?:а|я|ia|ya)$/i.test(String(nick).split(/[_.\-]/)[0]);
  const pause = ms => new Promise(res => {
    const end = Date.now() + ms;
    const t = setInterval(() => { if (stopFlag || Date.now() >= end) { clearInterval(t); res(); } }, 200);
  });
  const perReq = () => (PER_OPTIONS.includes(+cfg('perReq')) ? +cfg('perReq') : 100);
  const cdSec = () => { const v = Number(cfg('cd')); return v >= CD_MIN && v <= CD_MAX ? v : CD_DEF; };

  /* Окно браузера открыто заново — session-cookie живёт, пока браузер не закрыт */
  const browserFresh = () => !/(?:^|;\s*)cl_browser=1/.test(document.cookie);
  const markBrowser = () => { document.cookie = 'cl_browser=1; path=/; SameSite=Lax'; };

  /* Перетаскивание окна за «ручку» (через свойство translate) */
  function makeDrag(el, handle) {
    let on = false, sx = 0, sy = 0, tx = 0, ty = 0;
    const apply = () => {
      el.style.translate = `${tx}px ${ty}px`;
      const r = el.getBoundingClientRect();
      let fx = 0, fy = 0;
      if (r.left < 0) fx = -r.left; else if (r.right > innerWidth) fx = innerWidth - r.right;
      if (r.top < 0) fy = -r.top; else if (r.bottom > innerHeight) fy = innerHeight - r.bottom;
      if (fx || fy) { tx += fx; ty += fy; el.style.translate = `${tx}px ${ty}px`; }
    };
    handle.style.cursor = 'move';
    handle.addEventListener('pointerdown', e => {
      if (e.target.closest('button,.cl-x,input,select,textarea,a')) return;
      on = true; sx = e.clientX - tx; sy = e.clientY - ty;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e => { if (!on) return; tx = e.clientX - sx; ty = e.clientY - sy; apply(); });
    handle.addEventListener('pointerup', () => { on = false; });
    return () => { tx = 0; ty = 0; el.style.translate = ''; };
  }

  /* Подсветка строк: IP красным (тихо), AZ Coins жёлтым, деньги зелёным, машины серым, любое число розовым, ники жирным */
  function hl(text) {
    const s = String(text);
    let out = '', last = 0, m;
    HL_RE.lastIndex = 0;
    while ((m = HL_RE.exec(s))) {
      const full = m[0];
      out += esc(s.slice(last, m.index));
      if (m[1]) out += `<b class="ip">${esc(full)}</b>`;
      else if (m[2]) out += `<b class="mn">${esc(full)}</b>`;
      else if (m[3]) out += `<b class="az">${esc(full)}</b>`;
      else if (m[4]) out += `<b class="car">${esc(full)}</b>`;
      else if (m[5]) out += `${esc(m[5])}<b class="nk">${esc(m[6])}</b>`;
      else out += `<b class="cnt">${esc(full)}</b>`;
      last = m.index + full.length;
    }
    return out + esc(s.slice(last));
  }
  // Скрытие денег: заменяет суммы, AZ Coins и валюту на «скрыто»
  function maskText(t) { return cfg('moneyHide') ? String(t).replace(MONEY_TXT_RE, 'скрыто') : t; }
  const rowHtml = (date, html, i) => i === undefined
    ? `<div class="r"><span class="d">${esc(date)}</span><span class="t">${html}</span></div>`
    : `<div class="r sel-able" data-i="${i}"><span class="d">${esc(date)}</span><span class="t">${html}</span></div>`;
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
    if (!st.last) days = 1;
    else {
      const gap = dayDiff(st.last, today);
      // Не заходил больше 7 дней — огонёк сбрасывается, но только если до 200 дней не дошёл
      days = (gap <= STREAK_RESET_DAYS || days >= STREAK_PROTECT) ? days + 1 : 1;
    }
    setCfg('streak', { last: today, days });
  }
  let flameUid = 0;
  function flameSvg(tier, size) {
    const id = 'f' + (++flameUid);
    const c = tier.c, dim = tier.id === 'dim', grad = tier.id === 'grad';
    const st = arr => arr.map((col, i) => `<stop offset="${(i / (arr.length - 1)).toFixed(2)}" stop-color="${col}"/>`).join('');
    const outer = grad ? ['#fde047', '#f97316', '#ef4444', '#ec4899', '#8b5cf6'] : [mixHex(c, '#ffffff', 0.35), mixHex(c, '#000000', 0.35)];
    const mid = grad ? ['#fef08a', '#fb7185', '#f0abfc', '#67e8f9'] : [mixHex(c, '#ffffff', 0.65), mixHex(c, '#ffffff', 0.15)];
    const stroke = grad ? ' stroke="#000" stroke-width=".7"' : '';
    return `<svg class="flame${grad ? ' fl-grad' : ''}" width="${Math.round(size * 0.75)}" height="${size}" viewBox="0 0 24 32" style="${dim ? 'opacity:.55' : `filter:drop-shadow(0 0 6px ${hexRgba(c, 0.6)})`}">
      <defs>
        <linearGradient id="${id}o" x1="0" y1="0" x2="0" y2="1">${st(outer)}</linearGradient>
        <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1">${st(mid)}</linearGradient>
        <radialGradient id="${id}c" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fff3b0"/></radialGradient>
      </defs>
      <path class="fl-o" fill="url(#${id}o)"${stroke} d="M12 1C13 7 20 10 20 19A8 8 0 0 1 4 19C4 14 7 11.5 8.5 8.5C9.5 10.5 10.5 11 11.2 11C11.5 7.5 11 4 12 1Z"/>
      <path class="fl-m" fill="url(#${id}m)" d="M12 11C12.5 14 16.5 15.5 16.5 20.5A4.5 4.5 0 0 1 7.5 20.5C7.5 17.5 9.5 16 10.5 13.5C11.2 14.5 11.7 14.5 12 11Z"/>
      <path class="fl-c" fill="url(#${id}c)" d="M12 17C12.4 18.5 14 19.5 14 22A2 2 0 0 1 10 22C10 20 11.6 19.2 12 17Z"/>
    </svg>`;
  }

  /* ---------- Аккаунт и роли ---------- */
  function getAcc() {
    const k = cfg('session');
    const accs = cfg('accounts');
    return k && accs[k] ? { key: k, ...accs[k] } : null;
  }
  const isLogged = () => !!getAcc();
  const isOwner = () => { const a = getAcc(); return !!a && a.key === OWNER_NICK; };
  const posOf = acc => (acc.key === OWNER_NICK ? 'Разработчик' : (acc.position || 'Администратор'));
  const curRole = () => {
    const a = getAcc();
    if (!a) return 'Пользователь';
    return isOwner() && cfg('devRole') ? cfg('devRole') : posOf(a);
  };
  const canTab = t => (t === 'dev' ? isOwner() && !cfg('devRole') : (ROLE_ACCESS[curRole()] || ROLE_ACCESS['Пользователь']).tabs.includes(t));
  const canFilter = f => (ROLE_ACCESS[curRole()] || ROLE_ACCESS['Пользователь']).filters.includes(f);
  const working = () => isLogged() && !updState().blocked;
  const saveAcc = (key, patch) => {
    const accs = cfg('accounts');
    accs[key] = { ...accs[key], ...patch };
    setCfg('accounts', accs);
  };
  const touchSeen = () => { const a = getAcc(); if (a) saveAcc(a.key, { seen: Date.now() }); };
  const newSalt = () =>
    [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, '0')).join('');
  async function hashPass(pass, salt) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + pass));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

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
    if (cfg('roleFix') !== 1) {
      if (accs['young_nakamura']) {
        accs['young_nakamura'] = { ...accs['young_nakamura'], position: 'Куратор' };
        changed = true;
      }
      setCfg('roleFix', 1);
    }
    if (changed) setCfg('accounts', accs);
    if (!PER_OPTIONS.includes(+cfg('perReq'))) setCfg('perReq', 100);
    if (cfg('cdVer') !== 1) { setCfg('cd', CD_DEF); setCfg('cdVer', 1); }
    // Старый белый фон логов убран: возвращаем стоковый
    if (cfg('banner') === 'white') setCfg('banner', '');
    if (cfg('bgOn')) { if (cfg('bgUrl')) setCfg('banner', 'custom'); setCfg('bgOn', false); }
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
     ========================================================= */
  const siteStyle = document.createElement('style');
  siteStyle.id = 'cl-site';
  document.head.appendChild(siteStyle);
  let curIdx = null;

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
      date: find(t => /дата|время/.test(t)) || 1,
    };
  }

  const TXT_SEL = 'td,th,label,h1,h2,h3,h4,h5,p,span,.navbar,.navbar-brand,.nav-link,.dropdown-item,.app-nav-menu__item-link,.app-content-body-title,.table-description,.text-muted';
  /* Поле кода аутентификатора на сайте */
  const CODE_SELS = [
    'input[autocomplete="one-time-code"]', 'input[name*="code" i]', 'input[name*="otp" i]',
    'input[name*="2fa" i]', 'input[name*="token" i]', 'input[id*="code" i]', 'input[placeholder*="код" i]',
  ];

  function buildSiteCss(idx) {
    const fieldSelectors = [
      'form.filter input', 'form.filter select', 'form.filter textarea',
      'form.filter .form-control', 'form.filter .form-select',
      '.js_toolbar input', '.js_toolbar select', '.js_toolbar .form-select',
      '.select2-container', '.select2-container--default .select2-selection',
      '.select2-container--default .select2-selection--single',
      '.select2-container--default .select2-selection--multiple',
      '.select2-selection__rendered', '.select2-selection__arrow', '.select2-search__field',
    ].map(s => `body.cl-bg-on ${s}`).join(',\n');
    const codeRule = (cls, bg, fg) => CODE_SELS.map(s => `body.${cls} ${s}`).join(',\n') +
      ` { background: ${bg} !important; background-color: ${bg} !important; color: ${fg} !important;
        -webkit-text-fill-color: ${fg} !important; border: 1px solid ${fg} !important; box-shadow: none !important; }`;

    let css = `
      html:has(body.cl-bg-on), body.cl-bg-on, body.cl-bg-on html { background: transparent !important; }
      body.cl-bg-on :is(div,section,nav,main,table,thead,tbody,tr,td,th,.card,.card-body,.navbar,.app-sidebar,
        .app-content,.app-content-body,.app-nav,.dropdown-menu,.modal-content,.bg-white,.bg-dark,.bg-light,.shadow-sm) {
        background-color: transparent !important; background-image: none !important; box-shadow: none !important; }
      body.cl-bg-on :is(${TXT_SEL}) { color: #fff !important; }

      ${fieldSelectors} {
        background: transparent !important; background-color: transparent !important; background-image: none !important;
        -webkit-appearance: none !important; appearance: none !important;
        color: #fff !important; -webkit-text-fill-color: #fff !important;
        border: 1px solid rgba(255,255,255,.35) !important; box-shadow: none !important; border-radius: 4px !important;
      }
      body.cl-bg-on .select2-container, body.cl-bg-on .select2-selection__rendered,
      body.cl-bg-on .select2-selection__arrow, body.cl-bg-on .select2-search__field { border: none !important; box-shadow: none !important; }
      body.cl-bg-on .select2-selection__placeholder { color: rgba(255,255,255,.65) !important; }
      body.cl-bg-on .select2-selection__choice { background: rgba(255,255,255,.18) !important; border: 1px solid rgba(255,255,255,.4) !important; color: #fff !important; }
      body.cl-bg-on .select2-dropdown { background: #1b1530 !important; border-color: rgba(255,255,255,.3) !important; }
      body.cl-bg-on .select2-results__option { background: transparent !important; color: #fff !important; }
      body.cl-bg-on .select2-results__option--highlighted { background: rgba(255,255,255,.15) !important; }
      body.cl-bg-on form.filter ::placeholder { color: rgba(255,255,255,.6) !important; }
      body.cl-bg-on form.filter option, body.cl-bg-on select option { background: #1b1530 !important; color: #fff !important; }

      body.cl-bg-on .pagination .page-link, body.cl-bg-on .pagination .page-item > span, body.cl-bg-on .page-link {
        background: transparent !important; background-color: transparent !important;
        color: #fff !important; border: 1px solid rgba(255,255,255,.45) !important; box-shadow: none !important; }
      body.cl-bg-on .pagination .page-item.active .page-link, body.cl-bg-on .pagination .page-item.active > span {
        background-color: #c0392b !important; border-color: #c0392b !important; color: #fff !important; }

      /* Скрытие IP: размываются серые и красные ячейки, а вся колонка IP не нажимается */
      body.cl-ip-hide [data-cl-ip] { filter: blur(6px) !important; }
      body.cl-ip-hide [data-cl-ip], body.cl-ip-hide [data-cl-ip] * {
        pointer-events: none !important; user-select: none !important; cursor: default !important; }

      ${codeRule('cl-code-black', '#000', '#fff')}`;
    if (idx && idx.money) css += `
      body.cl-money-hide table tr > :nth-child(${idx.money}) { display: none !important; }`;
    if (idx && idx.date) css += `
      body.cl-date-hide table tr > :nth-child(${idx.date}) { display: none !important; }`;
    if (idx && idx.ip) css += `
      body.cl-ip-hide table tr > :nth-child(${idx.ip}), body.cl-ip-hide table tr > :nth-child(${idx.ip}) * {
        pointer-events: none !important; user-select: none !important; cursor: default !important; }`;
    return css;
  }

  const IP_CLS = '.table-secondary,.table-danger,.bg-secondary,.bg-danger,.badge-secondary,.badge-danger,.text-secondary,.text-danger';
  function isGrayRed(el) {
    if (el.matches(IP_CLS)) return true;
    const m = getComputedStyle(el).backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (!m) return false;
    const r = +m[1], g = +m[2], b = +m[3], a = m[4] === undefined ? 1 : +m[4];
    if (a < 0.3) return false;
    return (Math.max(r, g, b) - Math.min(r, g, b) < 20 && r > 70 && r < 225) || (r > 150 && g < 120 && b < 120);
  }
  function markIp(idx) {
    document.querySelectorAll('[data-cl-ip]').forEach(e => e.removeAttribute('data-cl-ip'));
    if (!working() || !cfg('ipHide') || !idx || !idx.ip) return;
    const cells = [...document.querySelectorAll('table tbody tr')].map(tr => tr.children[idx.ip - 1]).filter(Boolean);
    let n = 0;
    cells.forEach(c => [c, ...c.querySelectorAll('*')].forEach(el => {
      if (isGrayRed(el)) { el.setAttribute('data-cl-ip', '1'); n++; }
    }));
    if (!n) cells.forEach(c => c.setAttribute('data-cl-ip', '1'));
  }

  let lastIdx = null;
  // Режим фона логов: 'img' (кастомный), 'black' или '' (стоковый)
  function bgMode() {
    if (!working()) return '';
    const b = cfg('banner');
    if (b === 'custom') return cfg('bgUrl') ? 'img' : '';
    return b === 'black' ? 'black' : '';
  }
  function syncBody() {
    const m = bgMode();
    document.body.classList.toggle('cl-bg-on', !!m);
    document.body.classList.toggle('cl-ip-hide', working() && cfg('ipHide'));
    document.body.classList.toggle('cl-money-hide', working() && cfg('moneyHide'));
    document.body.classList.toggle('cl-date-hide', working() && cfg('dateHide'));
    document.body.classList.add('cl-code-black');
  }
  function syncSite(force) {
    syncBody();
    const idx = colIdx();
    curIdx = idx;
    const key = idx ? `${idx.ip}|${idx.money}|${idx.date}` : '';
    if (force || key !== lastIdx) {
      lastIdx = key;
      siteStyle.textContent = buildSiteCss(idx);
    }
    markIp(idx);
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
    layer.style.backgroundColor = m === 'black' ? '#000000' : 'transparent';
    layer.style.filter = m === 'img' && cfg('blur') ? `blur(${cfg('blur')}px)` : 'none';
    bgHost.style.display = m ? 'block' : 'none';
    syncSite(true);
  }

  // Клик по IP-адресам при скрытии не работает
  document.addEventListener('click', e => {
    if (!working() || !cfg('ipHide') || !curIdx || !curIdx.ip) return;
    const td = e.target.closest && e.target.closest('td,th');
    if (!td || !td.parentElement) return;
    if ([...td.parentElement.children].indexOf(td) === curIdx.ip - 1) {
      e.preventDefault(); e.stopPropagation();
    }
  }, true);

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
  let busy = false, chain = false, stopFlag = false, curKind = 'probiv', pMode = 'nick', typeOpts = [];
  let shownJob = null, selSet = new Set(), fileLoading = false, tabToken = 0;
  const isBusy = () => busy || chain;

  const CSS = `
  :host{--cl-accent:#000;--cl-accent-fill:#000;--cl-panel:#fff;--cl-panel-fill:#fff;
    --cl-hover:#000;--cl-hover-soft:rgba(0,0,0,.13);--cl-text:#14121c;--cl-muted:#5b5670;--cl-head:#0b0a12;--cl-title:#000;
    --cl-field-bg:rgba(0,0,0,.05);--cl-field-text:#14121c;--cl-on-accent:#fff;
    --cl-ok:#22c55e;--cl-off:#ef4444;--cl-warn:#f59e0b;--cl-ease:cubic-bezier(.16,1,.3,1);--cl-fxc:#000;
    font-family:'Nunito','Segoe UI',system-ui,sans-serif;font-size:15px;line-height:1.55;letter-spacing:.2px;-webkit-font-smoothing:antialiased}
  button,input,select,textarea{font:inherit;color:inherit}
  *{box-sizing:border-box}
  @keyframes clPane{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  @keyframes clPulseOk{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.55)}50%{box-shadow:0 0 0 7px rgba(34,197,94,0)}}
  @keyframes clPulseOff{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.55)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}
  @keyframes clPulseWarn{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.6)}50%{box-shadow:0 0 0 7px rgba(245,158,11,0)}}
  @keyframes clBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes clZ{0%{opacity:0;transform:translate(0,0) scale(.6)}30%{opacity:1}100%{opacity:0;transform:translate(14px,-24px) scale(1)}}
  @keyframes clFl1{0%,100%{transform:scale(1,1) skewX(0)}30%{transform:scale(.94,1.08) skewX(-3deg)}60%{transform:scale(1.04,.96) skewX(3deg)}}
  @keyframes clFl2{0%,100%{transform:scale(1,1)}40%{transform:scale(.9,1.12)}70%{transform:scale(1.06,.94)}}
  @keyframes clFl3{0%,100%{transform:scale(1,1);opacity:1}50%{transform:scale(.8,1.2);opacity:.8}}
  @keyframes clFlick{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
  @keyframes clHue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}
  @keyframes clBar{from{width:0}to{width:100%}}
  @keyframes clFallFx{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(780px) rotate(200deg)}}
  @keyframes clDevFlow{0%{background-position:0% 50%}100%{background-position:100% 50%}}
  @keyframes clComet{0%{transform:translate3d(0,-60px,0);opacity:0}3%{opacity:1}22%{opacity:0;transform:translate3d(0,320px,0)}100%{opacity:0;transform:translate3d(0,320px,0)}}

  #cl-btn{position:fixed;top:120px;right:24px;cursor:pointer;user-select:none;touch-action:none;transition:transform .35s var(--cl-ease)}
  #cl-btn:hover{transform:translateY(-2px)}
  #cl-btn img{display:block;width:auto;pointer-events:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6))}
  #cl-btn.sleep img{animation:clBob 3s ease-in-out infinite;filter:drop-shadow(0 3px 8px rgba(0,0,0,.6)) brightness(.7)}
  #cl-btn.b-yellow::after,#cl-btn.b-red::after{content:'';position:absolute;top:0;right:0;width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 2px #000;animation:clPulseWarn 2s infinite}
  #cl-btn.b-yellow::after{background:var(--cl-warn)}
  #cl-btn.b-red::after{background:var(--cl-off);animation:clPulseOff 2s infinite}
  #cl-btn.alt{cursor:move}
  #cl-btn.dragging{cursor:grabbing}
  .cl-zzz{position:absolute;left:70%;top:-6px;pointer-events:none;display:none;font:800 14px/1 'Nunito',sans-serif;color:#c4b5fd}
  .cl-zzz span{position:absolute;animation:clZ 2.4s ease-in infinite;opacity:0}
  .cl-zzz span:nth-child(2){animation-delay:.8s;font-size:11px}
  .cl-zzz span:nth-child(3){animation-delay:1.6s;font-size:9px}
  #cl-btn.sleep .cl-zzz{display:block}

  .cl-bubble{position:fixed;pointer-events:none;display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;
    background:#0a0a0d;color:#ebe8f5;border:1px solid rgba(255,255,255,.35);
    box-shadow:0 8px 24px rgba(0,0,0,.6);font-size:13px;font-weight:700;line-height:1.5;opacity:0;visibility:hidden;
    transition:opacity .6s var(--cl-ease),visibility 0s .6s}
  .cl-bubble.show{opacity:1;visibility:visible;transition:opacity .5s var(--cl-ease),visibility 0s}
  #cl-bubble-text{white-space:pre-line;min-width:0}
  .cl-dot{width:10px;height:10px;border-radius:50%;flex:0 0 10px;background:var(--cl-ok);animation:clPulseOk 2s infinite}
  .cl-dot.off{background:var(--cl-off);animation:clPulseOff 2s infinite}
  .cl-dot.warn{background:var(--cl-warn);animation:clPulseWarn 2s infinite}
  .cl-dot.static{animation:none!important}

  #cl-warn,#cl-upopup,#cl-del{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(3px);
    opacity:0;visibility:hidden;transition:opacity .45s var(--cl-ease),visibility 0s .45s}
  #cl-warn,#cl-del{z-index:2147483647}
  #cl-upopup{z-index:2147483600;background:transparent;backdrop-filter:none;pointer-events:none}
  #cl-warn.open,#cl-upopup.open,#cl-del.open{opacity:1;visibility:visible;transition:opacity .45s var(--cl-ease),visibility 0s}
  #cl-upopup .cl-upbox{pointer-events:auto}
  .cl-box{width:min(460px,92vw);padding:26px;border-radius:18px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 50%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.8)}
  .cl-box.center{text-align:center}
  .cl-warn-ico{width:52px;height:52px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:26px;font-weight:800;background:color-mix(in srgb,var(--cl-warn) 22%,transparent);color:var(--cl-warn)}
  .cl-box h3{margin:0 0 10px;color:var(--cl-head);font-size:19px;font-weight:800}
  .cl-box p{margin:0 0 16px;color:var(--cl-muted);font-size:14px;line-height:1.6}
  .cl-upbox{width:min(480px,92vw);padding:22px 24px;border-radius:18px;background:var(--cl-panel);color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 50%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.8)}
  .cl-upbox h3{margin:0 0 4px;color:var(--cl-head);font-size:19px;font-weight:800}
  .cl-upglobal{display:inline-block;margin:0 0 10px;padding:3px 9px;border-radius:7px;font-size:12px;font-weight:800;background:var(--cl-accent-fill);color:var(--cl-on-accent)}
  .cl-upbody{max-height:240px;overflow:auto;margin-bottom:10px}
  .cl-upend{white-space:pre-line;color:var(--cl-muted);font-size:13px;margin:10px 0 12px;line-height:1.6}
  .cl-upbar{height:4px;border-radius:4px;background:color-mix(in srgb,var(--cl-text) 10%,transparent);overflow:hidden;margin:0 0 12px}
  .cl-upbar i{display:block;height:100%;background:var(--cl-accent-fill);animation:clBar 8s linear forwards}
  .cl-del-steps{font-size:13px;color:var(--cl-muted);margin-bottom:6px}
  .cl-del-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px}
  .cl-del-row .cl-btnp{width:auto;margin-top:0;min-width:140px}

  #cl-panel{position:fixed;width:min(1060px,96vw);height:min(600px,86vh);min-width:640px;min-height:420px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);
    display:flex;flex-direction:column;overflow:hidden;
    color:var(--cl-text);background:var(--cl-panel-fill);border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);border-radius:20px;
    box-shadow:0 30px 80px rgba(0,0,0,.75);opacity:0;visibility:hidden;transform:translateY(18px) scale(.96);
    transition:opacity .6s var(--cl-ease),transform .7s var(--cl-ease),visibility 0s .7s}
  #cl-panel.open{opacity:1;visibility:visible;transform:none;transition:opacity .5s var(--cl-ease),transform .6s var(--cl-ease),visibility 0s}
  .cl-resize{position:absolute;right:0;bottom:0;width:22px;height:22px;cursor:nwse-resize;z-index:5;touch-action:none;
    background:linear-gradient(135deg,transparent 50%,color-mix(in srgb,var(--cl-accent) 55%,transparent) 50%,color-mix(in srgb,var(--cl-accent) 55%,transparent) 58%,transparent 58%,transparent 70%,color-mix(in srgb,var(--cl-accent) 55%,transparent) 70%,color-mix(in srgb,var(--cl-accent) 55%,transparent) 78%,transparent 78%)}
  #cl-panel:not(.logged) .cl-nav{display:none}
  #cl-panel:not(.logged) .cl-pane{display:none!important}
  #cl-panel:not(.logged) .cl-pane[data-pane=auth]{display:block!important;animation:clPane .55s var(--cl-ease)}
  #cl-panel.logged .cl-pane[data-pane=auth]{display:none!important}
  #cl-panel.blocked .cl-tab:not([data-tab=update]),#cl-panel.blocked .cl-profbtn{display:none!important}
  #cl-panel.blocked .cl-pane:not([data-pane=update]){display:none!important}
  #cl-fx,#cl-wfx{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
  .fxp{position:absolute;top:-50px;opacity:.55;pointer-events:none;animation-name:clFallFx;animation-timing-function:linear;animation-iteration-count:infinite}
  .fxp span{display:block;color:transparent;text-shadow:0 0 0 var(--cl-fxc)}
  .fxp i{display:block;background:var(--cl-fxc);-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center}
  .cl-head,.cl-main,#cl-win > .cl-wbody{position:relative;z-index:1}

  .cl-head{display:flex;align-items:center;justify-content:space-between;padding:13px 22px;cursor:move;user-select:none;
    background:transparent;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent)}
  .cl-title{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .cl-title b{font-size:16px;font-weight:800;color:var(--cl-title)}
  .cl-title > span{font-size:13px;color:var(--cl-muted)}
  .cl-beta{font:800 10px/1 'Nunito',sans-serif;letter-spacing:1px;padding:5px 8px;border-radius:6px;font-style:normal;background:var(--cl-accent-fill);color:var(--cl-on-accent)}
  .cl-homever{font:700 12px/1 Consolas,monospace;color:var(--cl-muted);padding:5px 8px;border-radius:7px;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent)}
  .cl-test{display:none;align-items:center;gap:8px;margin-left:8px;padding:4px 6px 4px 10px;border-radius:8px;font-size:12px;font-weight:800;background:var(--cl-warn);color:#111}
  .cl-test.on{display:inline-flex}
  .cl-test button{border:0;border-radius:6px;padding:2px 8px;cursor:pointer;font-weight:800;background:#111;color:#fff}
  .cl-x{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cl-muted);transition:background .3s,color .3s,transform .4s var(--cl-ease)}
  .cl-x:hover{background:var(--cl-hover-soft);color:var(--cl-text);transform:rotate(90deg)}
  .cl-main{flex:1;display:flex;min-height:0}
  .cl-nav{width:210px;padding:18px 14px;display:flex;flex-direction:column;gap:9px;background:transparent;
    border-right:1px solid color-mix(in srgb,var(--cl-accent) 18%,transparent);overflow:auto;position:relative;z-index:1}
  .cl-tab{display:flex;align-items:center;gap:11px;padding:10px 13px;border-radius:11px;cursor:pointer;color:var(--cl-muted);font-weight:700;
    transition:background .35s var(--cl-ease),color .35s var(--cl-ease),transform .35s var(--cl-ease)}
  .cl-tab svg{width:18px;height:18px;flex:0 0 18px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .cl-tab:hover{background:var(--cl-hover-soft);color:var(--cl-text);transform:translateX(3px)}
  .cl-tab.act{background:color-mix(in srgb,var(--cl-accent) 22%,transparent);color:var(--cl-text);box-shadow:inset 3px 0 0 var(--cl-accent)}
  .cl-tab.upd::after{content:'NEW';margin-left:auto;font:800 10px/1 'Nunito',sans-serif;padding:3px 6px;border-radius:6px;background:var(--cl-warn);color:#111}
  .cl-tab.lock::after{content:'скоро';margin-left:auto;font:700 10px/1 'Nunito',sans-serif;padding:3px 6px;border-radius:6px;background:color-mix(in srgb,var(--cl-text) 15%,transparent);color:var(--cl-muted)}
  .cl-navend{margin-top:auto}
  .cl-profbtn{display:flex;align-items:center;justify-content:center;padding:6px;border-radius:50%;cursor:pointer;transition:transform .35s var(--cl-ease),background .35s var(--cl-ease)}
  .cl-profbtn:hover{transform:scale(1.08)}
  .cl-profbtn.act{background:color-mix(in srgb,var(--cl-accent) 22%,transparent)}
  .cl-body{flex:1;padding:24px 32px;overflow:auto;min-width:0;display:flex;flex-direction:column;position:relative;z-index:1}
  .cl-pane{display:none}
  .cl-pane.act{display:block;animation:clPane .55s var(--cl-ease)}
  .cl-pane.act.leaving{opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .2s ease;animation:none}
  .cl-pane.act.cl-home{display:flex;flex-direction:column;flex:1;min-height:0;position:relative;overflow:hidden}
  .cl-pane.act.cl-col{display:flex;flex-direction:column;flex:1;min-height:0}

  .cl-stars{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
  .cl-star{position:absolute;top:0;width:2px;height:2px;border-radius:50%;background:#fff;opacity:0;
    box-shadow:0 0 6px 2px rgba(255,255,255,.55);animation:clComet linear infinite}
  .cl-star::after{content:'';position:absolute;left:0;top:-38px;width:2px;height:38px;border-radius:2px;
    background:linear-gradient(to top,rgba(255,255,255,.9),transparent)}
  .cl-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:20px;position:relative;z-index:1}
  .cl-hero h2{margin:0 0 14px;font-size:36px;font-weight:800;line-height:1.2;color:var(--cl-head)}
  .cl-hero h2 em{font-style:normal;color:var(--cl-accent)}
  .cl-hero p{margin:0 0 26px;color:var(--cl-muted);font-size:17px}
  .cl-status{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:999px;max-width:560px;text-align:left;
    background:color-mix(in srgb,var(--cl-panel) 75%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);font-weight:700;font-size:14px}
  .cl-foot{text-align:left;color:var(--cl-muted);font-size:13px;padding-top:14px;letter-spacing:.3px;position:relative;z-index:1}

  /* Профиль: баннер покрывает верх карточки, ник и должность поверх него */
  .cl-profcard{position:relative;overflow:hidden;border-radius:20px;border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);margin-bottom:14px}
  .cl-cover{position:absolute;left:0;right:0;top:0;height:200px;background:var(--cl-panel-fill) center/cover no-repeat;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);z-index:0}
  .cl-gear{position:absolute;top:12px;right:12px;z-index:2;display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;cursor:pointer;font-weight:800;font-size:13px;
    background:color-mix(in srgb,var(--cl-panel) 82%,transparent);color:var(--cl-text);border:1px solid color-mix(in srgb,var(--cl-text) 30%,transparent);backdrop-filter:blur(4px);transition:all .3s var(--cl-ease)}
  .cl-gear:hover{background:var(--cl-hover-soft);transform:translateY(-1px)}
  .cl-gear svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
  .cl-cbody{position:relative;z-index:1;padding:132px 24px 20px}
  .cl-prow{display:flex;align-items:flex-end;gap:16px}
  .cl-pinfo{min-width:0;padding-bottom:14px}
  .cl-nick{font-size:26px;font-weight:800;color:var(--cl-head);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:360px;text-shadow:0 1px 6px rgba(0,0,0,.25)}
  .cl-avl,.cl-avimg{border-radius:50%;flex:0 0 auto;border:4px solid var(--cl-panel);object-fit:cover}
  .cl-avl{display:flex;align-items:center;justify-content:center;font-weight:800;outline:2px solid color-mix(in srgb,var(--cl-text) 35%,transparent);outline-offset:-2px}
  .cl-badge{display:inline-block;margin-top:6px;padding:4px 11px;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.55)}
  .cl-badge.p-user{background:#4b5563}
  .cl-badge:not(.p-user){background-size:300% 100%;animation:clDevFlow 3s linear infinite}
  .p-dev{background-image:linear-gradient(90deg,#450a0a,#dc2626,#fecaca,#dc2626,#450a0a)}
  .p-ga{background-image:linear-gradient(90deg,#022c12,#16a34a,#bbf7d0,#16a34a,#022c12)}
  .p-zga{background-image:linear-gradient(90deg,#14532d,#4ade80,#ecfdf5,#4ade80,#14532d)}
  .p-cur{background-image:linear-gradient(90deg,#2e1065,#a855f7,#f3e8ff,#a855f7,#2e1065)}
  .p-adm{background-image:linear-gradient(90deg,#172554,#3b82f6,#dbeafe,#3b82f6,#172554)}
  .cl-conn{margin-top:16px;padding:12px 14px;border-radius:14px;background:color-mix(in srgb,var(--cl-text) 4%,transparent)}
  .cl-conn .cl-sec{margin-bottom:6px}
  .cl-cline{display:flex;gap:10px;padding:3px 0;min-width:0}
  .cl-cline span{flex:0 0 70px;color:var(--cl-muted);font-weight:700}
  .cl-cline b{color:var(--cl-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
  .cl-cline a{color:var(--cl-accent);text-decoration:none}
  .cl-cline a:hover{text-decoration:underline}
  .cl-flamewrap{position:relative;display:inline-flex;align-items:center;gap:8px;margin-top:22px;padding:6px 14px 6px 8px;border-radius:14px;cursor:default;
    background:color-mix(in srgb,var(--cl-text) 4%,transparent)}
  .cl-flamewrap b{font-size:22px;font-weight:800;color:var(--cl-head)}
  .cl-flametip{position:absolute;left:0;bottom:calc(100% + 10px);width:290px;padding:14px 16px;border-radius:14px;z-index:20;
    background:var(--cl-panel);color:var(--cl-text);border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);box-shadow:0 14px 40px rgba(0,0,0,.45);
    opacity:0;visibility:hidden;transform:translateY(6px);transition:opacity .3s var(--cl-ease),transform .3s var(--cl-ease),visibility 0s .3s}
  .cl-flamewrap:hover .cl-flametip{opacity:1;visibility:visible;transform:none;transition:opacity .3s var(--cl-ease),transform .3s var(--cl-ease),visibility 0s}
  .cl-tline{display:flex;align-items:center;gap:10px;padding:3px 0;font-size:13px;font-weight:700}
  .cl-tline em{font-style:normal;color:var(--cl-muted);font-weight:700;min-width:62px}
  .cl-tnote{margin-top:8px;padding-top:8px;border-top:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);color:var(--cl-muted);font-size:12px;line-height:1.5}
  .flame{display:block;overflow:visible;animation:clFlick 2s ease-in-out infinite}
  .fl-o,.fl-m,.fl-c{transform-box:fill-box;transform-origin:50% 100%}
  .fl-o{animation:clFl1 1.2s ease-in-out infinite}
  .fl-m{animation:clFl2 .9s ease-in-out infinite}
  .fl-c{animation:clFl3 .6s ease-in-out infinite}
  .fl-grad .fl-o{animation:clFl1 1.2s ease-in-out infinite,clHue 5s linear infinite}
  .fl-grad .fl-m{animation:clFl2 .9s ease-in-out infinite,clHue 5s linear infinite reverse}

  .cl-card{background:color-mix(in srgb,var(--cl-text) 3%,transparent);border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);
    border-radius:16px;padding:14px 18px;margin:14px 4px 0;transition:border-color .45s var(--cl-ease)}
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
  select.cl-in option{background:var(--cl-panel);color:var(--cl-text)}
  .cl-sw{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 4px;cursor:pointer;color:var(--cl-text);font-size:15px;font-weight:700}
  .cl-sw input{appearance:none;-webkit-appearance:none;width:42px;height:23px;border-radius:999px;background:color-mix(in srgb,var(--cl-text) 18%,transparent);
    border:2px solid var(--cl-accent);position:relative;cursor:pointer;transition:background .4s var(--cl-ease);flex:0 0 42px}
  .cl-sw input::after{content:'';position:absolute;top:1px;left:1px;width:17px;height:17px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.4);transition:left .4s var(--cl-ease)}
  .cl-sw input:checked{background:var(--cl-accent-fill)}
  .cl-sw input:checked::after{left:21px}
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
  .cl-btnp.danger:hover{border-color:#ef4444;color:#ef4444}
  .cl-msg{margin-top:12px;color:var(--cl-accent);font-size:14px;min-height:18px;font-weight:700}
  .cl-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center}
  .cl-row.left{justify-content:flex-start}
  .cl-row .cl-btnp{margin-top:8px}
  .cl-center{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:14px}
  .cl-center .cl-btnp{width:auto;margin-top:0;min-width:150px;justify-content:center;text-align:center}
  .cl-stop,.cl-res{display:none!important}
  .cl-stop.on,.cl-res.on{display:flex!important}
  .cl-auth{max-width:420px;margin:0 auto;padding-top:12px}
  .cl-auth h2{margin:0 0 4px;font-size:24px;font-weight:800;color:var(--cl-head)}
  .cl-auth .cl-hint{margin:0 0 16px;color:var(--cl-muted);font-size:14px}
  .cl-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .cl-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  .cl-hint2{color:var(--cl-muted);font-size:13px;margin-top:8px;line-height:1.5}
  .cl-cap{color:var(--cl-muted);font-size:13px;margin:2px 0 10px}
  .cl-top{display:flex;align-items:center;gap:12px;margin-bottom:6px}
  .cl-top .cl-title-sm{font-size:20px;font-weight:800;color:var(--cl-head)}

  .cl-setrow{display:grid;grid-template-columns:160px 1fr;gap:18px;padding:16px 4px;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 14%,transparent)}
  .cl-setlbl{font-weight:800;color:var(--cl-head);padding-top:8px}
  .cl-avbig{width:112px;height:112px;border-radius:50%;overflow:hidden;cursor:pointer;border:2px dashed color-mix(in srgb,var(--cl-accent) 60%,transparent);transition:transform .3s var(--cl-ease)}
  .cl-avbig:hover{transform:scale(1.04);border-style:solid}
  .cl-avbig .cl-avl,.cl-avbig .cl-avimg{border:0;outline:0;width:100%;height:100%}
  .cl-bnwide{width:100%;height:150px;border-radius:14px;overflow:hidden;cursor:pointer;border:2px dashed color-mix(in srgb,var(--cl-accent) 60%,transparent);transition:transform .3s var(--cl-ease)}
  .cl-bnwide:hover{transform:scale(1.01);border-style:solid}
  .cl-urlrow{display:flex;gap:8px;margin-top:10px;align-items:stretch}
  .cl-urlrow .cl-in{flex:1}
  .cl-urlrow .cl-btnp{width:auto;margin-top:0;padding:10px 16px;white-space:nowrap}

  .t-view,.f-view{display:none}
  .t-view.act,.f-view.act{display:block;animation:clPane .45s var(--cl-ease)}
  .t-view.menu-center.act,.f-view.menu-center.act{display:flex;flex:1;align-items:center;justify-content:center}
  .tcards{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:14px 0 0}
  .tcard{width:230px;padding:26px 18px;border-radius:18px;cursor:pointer;text-align:center;border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);
    background:var(--cl-field-bg);transition:all .4s var(--cl-ease);display:flex;flex-direction:column;align-items:center;gap:12px}
  .tcard:hover{background:var(--cl-hover-soft);border-color:color-mix(in srgb,var(--cl-accent) 45%,transparent);transform:translateY(-2px)}
  .tcard svg{width:34px;height:34px;stroke:var(--cl-head);fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
  .tcard b{font-size:17px;font-weight:800;color:var(--cl-head)}

  .fcards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;width:100%;max-width:760px;margin:0 auto}
  .fcard{padding:26px 14px;border-radius:18px;cursor:pointer;text-align:center;border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);
    background:var(--cl-field-bg);transition:all .4s var(--cl-ease);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
  .fcard:hover{background:var(--cl-hover-soft);border-color:color-mix(in srgb,var(--cl-accent) 45%,transparent);transform:translateY(-2px)}
  .fico{width:56px;height:56px;display:flex;align-items:center;justify-content:center;font-size:34px}
  .fico svg{width:44px;height:44px;stroke:var(--cl-head);fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
  .fico img{max-width:56px;max-height:56px;object-fit:contain;filter:grayscale(1) contrast(1.1)}
  .fcard b{display:block;font-size:17px;font-weight:800;color:var(--cl-head)}
  .cl-modes{display:flex;gap:8px;margin:10px 0 4px;flex-wrap:wrap}
  .cl-mode{flex:1;min-width:130px;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;color:var(--cl-muted);
    border:1px solid color-mix(in srgb,var(--cl-accent) 25%,transparent);background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-mode:hover{background:var(--cl-hover-soft);color:var(--cl-text)}
  .cl-mode.act{background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}

  .th-sec{margin-top:14px;padding:14px 18px;border-radius:16px;border:1px solid color-mix(in srgb,var(--cl-accent) 20%,transparent);background:color-mix(in srgb,var(--cl-text) 3%,transparent)}
  .th-row{display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap}
  .th-lab{width:70px;color:var(--cl-muted);font-size:13px;font-weight:700}
  .th-sw{display:flex;gap:10px;flex-wrap:wrap}
  .th-c{width:38px;height:38px;min-width:38px;border-radius:50%;border:2px solid color-mix(in srgb,var(--cl-text) 25%,transparent);cursor:pointer;transition:transform .3s var(--cl-ease);position:relative;overflow:hidden;padding:0;display:inline-block;flex:0 0 38px}
  .th-c:hover{transform:scale(1.12)}
  .th-c.on{box-shadow:0 0 0 3px var(--cl-panel),0 0 0 5px var(--cl-accent)}
  .th-custom{background:conic-gradient(#ef4444,#facc15,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)}
  .th-c input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:0;padding:0;margin:0;border-radius:50%;appearance:none;-webkit-appearance:none;background:none}
  .th-c input::-webkit-color-swatch-wrapper{padding:0}
  .th-c input::-webkit-color-swatch{border:0;border-radius:50%}
  .th-reset{width:auto;margin-top:0;padding:7px 12px;font-size:13px}
  .fx-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
  .fx-chips label{padding:8px 12px;border-radius:11px;cursor:pointer;font-weight:700;color:var(--cl-text);
    border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);background:var(--cl-field-bg);transition:all .3s var(--cl-ease)}
  .fx-chips label:hover{background:var(--cl-hover-soft)}
  .fx-chips input{display:none}
  .fx-chips label:has(input:checked){background:var(--cl-accent-fill);border-color:var(--cl-accent);color:var(--cl-on-accent)}
  .chars{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:8px}
  .chars label{display:flex;flex-direction:column;align-items:center;gap:8px;padding:10px 6px;border-radius:12px;cursor:pointer;text-align:center;font-size:13px;font-weight:700;
    border:1px solid color-mix(in srgb,var(--cl-accent) 28%,transparent);background:var(--cl-field-bg);transition:all .3s var(--cl-ease)}
  .chars label:hover{background:var(--cl-hover-soft)}
  .chars input{display:none}
  .chars img{height:84px;width:auto;max-width:100%;object-fit:contain;border-radius:8px}
  .chars label:has(input:checked){border-color:var(--cl-accent);box-shadow:0 0 0 2px var(--cl-accent)}

  .cl-offer h2{margin:0 0 6px;font-size:24px;font-weight:800;color:var(--cl-head);text-align:center}
  .cl-offer .cl-hint{margin:0 0 14px;color:var(--cl-muted);font-size:15px;text-align:center}
  .cl-list{margin:0 auto 10px;padding-left:20px;color:var(--cl-text);max-width:440px;font-size:15px}
  .cl-list li{margin:6px 0}
  .cl-offer .cl-card{text-align:center}
  .cl-contacts{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:10px}
  .cl-link{display:inline-block;min-width:320px;text-align:center;padding:12px 18px;border-radius:12px;text-decoration:none;
    color:var(--cl-text);font-weight:800;border:1px solid color-mix(in srgb,var(--cl-accent) 35%,transparent);background:var(--cl-field-bg);transition:all .35s var(--cl-ease)}
  .cl-link:hover{background:var(--cl-hover-soft);border-color:var(--cl-accent)}
  .cl-verbig{font-size:26px;font-weight:800;color:var(--cl-head)}

  .ver{border-radius:14px;border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);background:var(--cl-field-bg);margin-top:8px;overflow:hidden}
  .ver summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-weight:800;color:var(--cl-head);gap:10px}
  .ver summary::-webkit-details-marker{display:none}
  .ver summary::after{content:'▾';font-size:18px;color:var(--cl-accent);transition:transform .3s var(--cl-ease)}
  .ver[open] summary::after{transform:rotate(180deg)}
  .ver summary .gl{margin-left:8px;padding:2px 8px;border-radius:6px;font-size:11px;background:var(--cl-accent-fill);color:var(--cl-on-accent)}
  .ver-body{padding:0 16px 12px}
  .ch-item{display:flex;align-items:flex-start;gap:10px;padding:6px 0;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 10%,transparent);font-size:14px}
  .ch-item:last-child{border-bottom:0}
  .tag{flex:0 0 auto;font-size:12px;font-weight:800;padding:3px 8px;border-radius:7px;border:1px solid transparent}
  .t-Добавлено{background:rgba(34,197,94,.15);color:#16a34a;border-color:rgba(34,197,94,.35)}
  .t-Улучшено{background:rgba(59,130,246,.15);color:#2563eb;border-color:rgba(59,130,246,.35)}
  .t-Изменено{background:rgba(250,204,21,.18);color:#a16207;border-color:rgba(250,204,21,.45)}
  .t-Удалено{background:rgba(239,68,68,.15);color:#dc2626;border-color:rgba(239,68,68,.35)}
  .t-Исправлено{background:rgba(168,85,247,.15);color:#9333ea;border-color:rgba(168,85,247,.35)}
  .upd-line{font-size:14px;color:var(--cl-muted);margin-top:4px}
  .autoupd-note{font-size:13px;color:var(--cl-muted);line-height:1.5;margin-top:4px}

  .job{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;margin-top:10px;
    border:1px solid color-mix(in srgb,var(--cl-accent) 22%,transparent);background:var(--cl-field-bg)}
  .jdate{flex:0 0 130px;font:700 13px/1.4 Consolas,monospace;color:var(--cl-accent);text-align:left}
  .job-main{flex:1;min-width:0}
  .job-main b{display:block;color:var(--cl-head);font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .job-main span{display:block;color:var(--cl-muted);font-size:13px;margin-top:2px}
  .job-act{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
  .job-act .cl-btnp{margin-top:0;width:auto;padding:8px 12px}

  .cl-lock{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;min-height:300px}
  .cl-lock-ico{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;background:color-mix(in srgb,var(--cl-accent) 18%,transparent)}
  .cl-lock h2{margin:0;font-size:26px;font-weight:800;color:var(--cl-head)}
  .cl-lock p{margin:0;color:var(--cl-muted);font-size:15px}

  #cl-win{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.97);width:min(1000px,94vw);height:min(640px,86vh);
    display:flex;flex-direction:column;overflow:hidden;color:var(--cl-text);border-radius:18px;background:var(--cl-panel-fill);
    border:1px solid color-mix(in srgb,var(--cl-accent) 45%,transparent);box-shadow:0 24px 70px rgba(0,0,0,.75);
    opacity:0;visibility:hidden;transition:opacity .5s var(--cl-ease),transform .6s var(--cl-ease),visibility 0s .6s}
  #cl-win.open{opacity:1;visibility:visible;transform:translate(-50%,-50%);transition:opacity .45s var(--cl-ease),transform .5s var(--cl-ease),visibility 0s}
  .cl-whead-btns{display:flex;gap:8px;align-items:center}
  .cl-whead-btns .cl-btnp{margin-top:0}
  #cl-win .cl-wbody{overflow:auto;flex:1;padding:0 0 14px;font-size:15px;line-height:1.6;color:var(--cl-text)}
  .found{display:flex;justify-content:space-between;align-items:center;padding:14px 22px;font-weight:800;color:var(--cl-head);
    border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 30%,transparent);background:var(--cl-field-bg)}
  .found span{font-weight:700;color:var(--cl-muted);font-size:13px}
  .r{display:grid;grid-template-columns:186px 1fr;gap:16px;padding:10px 22px;border-bottom:1px solid color-mix(in srgb,var(--cl-accent) 12%,transparent);transition:background .25s}
  .r:hover{background:var(--cl-hover-soft)}
  .r.sel-able{cursor:pointer}
  .r.sel{background:color-mix(in srgb,var(--cl-accent) 20%,transparent);box-shadow:inset 3px 0 0 var(--cl-accent)}
  .d{color:var(--cl-muted);font:13px/1.8 Consolas,monospace;padding-top:1px}
  .t{word-break:break-word}
  .nk{color:var(--cl-head);font-weight:800}
  .mn{color:#22c55e;font-weight:800}
  .az{color:#facc15;font-weight:800}
  .car{color:#9ca3af;font-weight:800}
  .cnt{color:#f472b6;font-weight:800}
  .ip{color:#fca5a5;opacity:.75;font-weight:700}
  .plus{color:#16a34a;font-weight:800;margin-left:8px;white-space:nowrap}
  .minus{color:#dc2626;font-weight:800;margin-left:8px;white-space:nowrap}
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
  .sum div:nth-child(3){background:rgba(250,204,21,.1);border-color:rgba(250,204,21,.45)}
  .sum span{display:block;color:var(--cl-muted);font-size:14px}
  .sum b{font-size:22px;font-weight:800}
  .sum .earn{color:#16a34a}
  .sum .spend{color:#dc2626}
  .sum .diff{color:#ca8a04}
  `;

  const ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    logs: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>',
    dev: '<svg viewBox="0 0 24 24"><path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/></svg>',
    dollar: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M14.5 9a2.5 2 0 0 0-2.5-1.5c-1.4 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2A2.5 2.5 0 0 1 9.5 15M12 6v1.5M12 16.5V18"/></svg>',
    sliders: '<svg viewBox="0 0 24 24"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    brush: '<svg viewBox="0 0 24 24"><path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/></svg>',
    wand: '<svg viewBox="0 0 24 24"><path d="M4 20L16 8M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 12l.7 1.3L21 14l-1.3.7L19 16l-.7-1.3L17 14l1.3-.7z"/></svg>',
    film: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></svg>',
    chain: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  };

  /* ---------- Тема ---------- */
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
    set('--cl-title', panelLight ? '#000000' : '#ffffff');
    set('--cl-field-bg', panelLight ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.07)');
    set('--cl-field-text', panelLight ? '#14121c' : '#f4f1fb');
    set('--cl-on-accent', accLight ? '#000000' : '#ffffff');
    const fc = (cfg('fx') || DEF.fx).color || 'auto';
    set('--cl-fxc', fc === 'auto' ? (panelLight ? '#000000' : '#ffffff') : fc);
    if (q('#cl-profbtn')) renderProfile();
  }
  function saveTheme(patch) {
    setCfg('theme', { ...getTheme(), ...patch });
    applyTheme();
  }
  const toTh = v => (typeof v === 'string' ? { g: false, c1: v, c2: v } : { ...v });
  function applyCharTheme(c) {
    saveTheme({ accent: toTh(c.theme.accent), panel: toTh(c.theme.panel), hover: toTh(c.theme.hover) });
    renderThemeSecs();
  }
  function renderThemeSecs() {
    const t = getTheme();
    qa('.th-sec[data-key]').forEach(sec => {
      const key = sec.dataset.key, v = t[key];
      sec.querySelector('.th-grad').checked = !!v.g;
      let html;
      if (v.g) {
        html = `<div class="th-row"><span class="th-lab">Цвета</span><div class="th-sw">` + [1, 2].map(slot => {
          const cur = slot === 1 ? v.c1 : v.c2;
          return `<label class="th-c" style="background:${cur}"><input type="color" class="th-picker" data-key="${key}" data-slot="${slot}" value="${cur}"></label>`;
        }).join('') + `</div></div>`;
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

  /* ---------- Анимации меню ---------- */
  const FX_EMOJI = { bow: '🎀', sun: '☀️', bolt: '⚡', snow: '❄️', bat: '🦇' };
  function buildFx(fx, sc) {
    let html = '';
    const img = fx.type === 'makima' ? charImg(charById(cfg('char'))) : '';
    for (let i = 0; i < fx.count; i++) {
      const left = Math.random() * 100;
      const size = (14 + Math.random() * 12) * sc;
      const dur = fx.speed * (0.8 + Math.random() * 0.4);
      const delay = -Math.random() * fx.speed;
      const inner = fx.type === 'makima'
        ? `<i style="width:${size + 12}px;height:${(size + 12) * 1.3}px;-webkit-mask-image:url('${img}');mask-image:url('${img}')"></i>`
        : `<span style="font-size:${size}px">${FX_EMOJI[fx.type] || '❄️'}</span>`;
      html += `<div class="fxp" style="left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s">${inner}</div>`;
    }
    return html;
  }
  function renderFx() {
    const fx = { ...DEF.fx, ...(cfg('fx') || {}) };
    if (!FX_TYPES.some(f => f[0] === fx.type)) fx.type = 'snow';
    applyTheme();
    const html = fx.type === 'off' ? '' : buildFx(fx, (fx.size || 100) / 100);
    ['#cl-fx', '#cl-wfx'].forEach(id => { const b = q(id); if (b) b.innerHTML = html; });
  }
  // Главная: редкие кометы, падают вертикально
  function renderHomeStars() {
    const html = Array.from({ length: 7 }, (_, i) => {
      const left = 6 + i * 14 + Math.random() * 6;
      const dur = 9 + Math.random() * 5;
      const delay = -(i * 3.5 + Math.random() * 3);
      return `<span class="cl-star" style="left:${left.toFixed(1)}%;animation-duration:${dur.toFixed(2)}s;animation-delay:${delay.toFixed(2)}s"></span>`;
    }).join('');
    const box = q('#cl-stars');
    if (box) box.innerHTML = html;
  }

  /* ---------- Персонаж запуска и его фразы ---------- */
  const DOT = { ok: 'ok', warn: 'warn', red: 'off' };
  const btnSize = () => ({ w: btn.offsetWidth || 56, h: btn.offsetHeight || 84 });
  function applyChar() {
    const c = charById(cfg('char'));
    const img = q('#cl-char');
    img.src = charImg(c);
    img.style.height = Math.round(84 * clamp(+cfg('btnScale') || 1, 0.4, 1.6)) + 'px';
  }
  function placeBubble() {
    const r = btn.getBoundingClientRect();
    const bw = Math.min(380, innerWidth - 16);
    bubble.style.width = bw + 'px';
    const bh = bubble.offsetHeight, gap = 10;
    const cx = v => clamp(v, 8, innerWidth - bw - 8);
    const cy = v => clamp(v, 8, innerHeight - bh - 8);
    let x, y;
    if (r.top >= bh + gap + 8) { y = r.top - bh - gap; x = cx(r.left + r.width / 2 - bw / 2); }
    else if (innerHeight - r.bottom >= bh + gap + 8) { y = r.bottom + gap; x = cx(r.left + r.width / 2 - bw / 2); }
    else if (r.left >= bw + gap + 8) { x = r.left - bw - gap; y = cy(r.top + r.height / 2 - bh / 2); }
    else { x = Math.min(r.right + gap, innerWidth - bw - 8); y = cy(r.top + r.height / 2 - bh / 2); }
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
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
  const charName = () => charById(cfg('char')).short;
  const newbieText = () => `Охае, ты новенький видимо, я ${charName()}, приятно познакомиться.\nРасполагайся, настраивай скрипт под себя и приступай к работе\nХорошей тебе работы`;
  const greetText = nick => `Охае, ${nick}\nТы снова решил поработать, похвально\nУдачи тебе`;
  const doneText = nick => `${nick}, эй, там твои поиски закончились, проверь их пожалуйста 😊`;
  function setBadge(kind) {
    btn.classList.toggle('b-yellow', kind === 'yellow');
    btn.classList.toggle('b-red', kind === 'red');
  }
  let doneBadge = false;
  function refreshBadge() {
    const s = updState();
    if (sleeping) return setBadge('red');
    if (s.outdated && s.red) return setBadge('red');
    if (doneBadge || s.outdated) return setBadge('yellow');
    setBadge('');
  }
  function goSleep() {
    if (sleeping) return;
    sleeping = true;
    btn.classList.add('sleep');
    refreshBadge();
    say('Спит......', 'red', 0);
  }
  function wakeUp() {
    if (!sleeping) return;
    sleeping = false;
    btn.classList.remove('sleep');
    refreshBadge();
    bubble.classList.remove('show');
  }
  function scheduleQuote() {
    setTimeout(() => {
      if (!sleeping && working() && !document.hidden && !q('#cl-panel').classList.contains('open')) {
        const [t, a] = QUOTES[Math.floor(Math.random() * QUOTES.length)];
        say(`«${t}»\n— ${a}`, 'ok', 10000);
      }
      scheduleQuote();
    }, (10 + Math.random() * 5) * 60000);
  }

  /* ---------- Статус на главной ---------- */
  function renderStatus() {
    const s = updState();
    let kind = 'ok', text = 'Скрипт успешно активирован и готов к работе';
    if (!isLogged()) { kind = 'warn'; text = 'Войди в аккаунт, чтобы начать работу'; }
    else if (s.outdated && s.red) { kind = 'red'; text = 'Скрипт поврежден или не обновлялся больше месяца'; }
    else if (s.outdated) { kind = 'warn'; text = 'Вышло новое обновление, необходимо обновить скрипт для дальнейшей работы'; }
    const dot = q('#cl-status-dot');
    dot.className = 'cl-dot static ' + DOT[kind];
    q('#cl-status-text').textContent = text;
  }

  /* ---------- Профиль ---------- */
  function avatarHtml(acc, size) {
    if (acc && acc.avatar) return `<img class="cl-avimg" src="${esc(acc.avatar)}" alt="" style="width:${size}px;height:${size}px">`;
    const light = hexLum(getTheme().panel.c1) > 0.5;
    const L = ((acc && acc.nick) || '?')[0].toUpperCase();
    return `<div class="cl-avl" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.46)}px;background:var(--cl-panel-fill);color:${light ? '#000' : '#fff'}">${esc(L)}</div>`;
  }
  // Аватар с контуром цвета должности
  function ringAv(acc, size) {
    const c = ROLE_COLOR[acc ? curRole() : 'Пользователь'] || '#9ca3af';
    return `<span style="display:inline-flex;border-radius:50%;box-shadow:0 0 0 3px ${c}">${avatarHtml(acc, size)}</span>`;
  }
  function renderProfile() {
    const acc = getAcc();
    const days = (cfg('streak') || {}).days || 0;
    const t = tierOf(days);
    q('#cl-cover').style.backgroundImage = acc && acc.banner ? `url("${acc.banner}")` : '';
    q('#cl-av').innerHTML = avatarHtml(acc, 96);
    q('#cl-profbtn-av').innerHTML = ringAv(acc, 38);
    q('#cl-pnick').textContent = acc ? acc.nick : 'Гость';
    const role = acc ? curRole() : '';
    q('#cl-badges').innerHTML = acc ? `<span class="cl-badge ${POS_CLS[role] || 'p-user'}">${esc(role)}</span>` : '';
    let conn = '';
    if (acc) {
      conn += `<div class="cl-cline"><span>Сервер:</span><b>${esc(acc.server)} · ${esc(serverName(acc.server))}</b></div>`;
      if (acc.vk) conn += `<div class="cl-cline"><span>VK:</span><b>${linkHtml(acc.vk)}</b></div>`;
      if (acc.tg) conn += `<div class="cl-cline"><span>TG:</span><b>${esc(acc.tg)}</b></div>`;
    }
    q('#cl-conn').innerHTML = `<div class="cl-sec">Связь:</div>${conn}`;
    q('#cl-flame').innerHTML = flameSvg(t, 44);
    q('#cl-streakdays').textContent = String(days);
    q('#cl-flametip').innerHTML = TIERS.filter(x => x.d > 0).map(x =>
      `<div class="cl-tline">${flameSvg(x, 22)}<em>${x.d} ${plural(x.d, ['день', 'дня', 'дней'])}</em><span>${x.name}</span></div>`).join('') +
      `<div class="cl-tnote">Огонёк сбросится, если не заходить в скрипт ${STREAK_RESET_DAYS} дней. После ${STREAK_PROTECT} дней огонёк не сбрасывается</div>`;
  }

  function renderAccountForm() {
    const acc = getAcc() || {};
    q('#cl-av-zone').innerHTML = avatarHtml(acc, 112);
    q('#cl-bn-prev').style.backgroundImage = acc.banner ? `url("${acc.banner}")` : '';
    q('#cl-vk').value = acc.vk || '';
    q('#cl-tg').value = acc.tg || '';
    if (acc.server) q('#cl-acc-server').value = acc.server;
    const posSel = q('#cl-acc-pos'), own = acc.key === OWNER_NICK;
    const cur = acc.position || 'Администратор';
    const opts = own ? ['Разработчик'] : (SELF_POSITIONS.includes(cur) ? SELF_POSITIONS : [cur, ...SELF_POSITIONS]);
    posSel.innerHTML = opts.map(p => `<option value="${p}">${p}</option>`).join('');
    posSel.disabled = own;
    q('#cl-acc-posgo').disabled = own;
    if (!own) posSel.value = cur;
    q('#cl-delacc').style.display = own ? 'none' : '';
  }

  /* ---------- Настройки: синхронизация элементов с сохранённым ---------- */
  function renderBgPreview() {
    qa('.cl-banner-r').forEach(r => { r.checked = r.value === cfg('banner'); });
    q('#cl-blur').value = cfg('blur');
    q('#cl-blurv').textContent = cfg('blur');
  }
  function syncSettingsUI() {
    renderBgPreview();
    qa('input[name="cl-per"]').forEach(r => { r.checked = +r.value === perReq(); });
    qa('input[name="cl-lim"]').forEach(r => { r.checked = +r.value === +cfg('limit'); });
    q('#cl-cd-in').value = cdSec();
    q('#cl-ipb').checked = !!cfg('ipHide');
    q('#cl-moneyb').checked = !!cfg('moneyHide');
    q('#cl-dateb').checked = !!cfg('dateHide');
    q('#cl-limon').checked = !!cfg('limitOn');
    q('#cl-savelogs').checked = !!cfg('saveLogs');
    q('#cl-savefile').checked = !!cfg('saveFile');
    q('#cl-allowdl').checked = !!cfg('allowDl');
    const fx = { ...DEF.fx, ...(cfg('fx') || {}) };
    qa('input[name="cl-fxt"]').forEach(r => { r.checked = r.value === fx.type; });
    q('#cl-fx-color').value = fx.color;
    q('#cl-fx-count').value = fx.count; q('#cl-fx-countv').textContent = fx.count;
    q('#cl-fx-speed').value = fx.speed; q('#cl-fx-speedv').textContent = fx.speed;
    q('#cl-fx-size').value = fx.size || 100; q('#cl-fx-sizev').textContent = fx.size || 100;
    qa('input[name="cl-char"]').forEach(r => { r.checked = r.value === cfg('char'); });
    q('#cl-chartheme').checked = !!cfg('charTheme');
    const sc = Math.round((+cfg('btnScale') || 1) * 100);
    q('#cl-scale').value = sc; q('#cl-scalev').textContent = sc;
    renderThemeSecs();
    qa('.cl-dl').forEach(b => { b.style.display = cfg('allowDl') ? '' : 'none'; });
  }
  function resetLogsSettings() {
    ['bgUrl', 'banner', 'blur', 'ipHide', 'dateHide', 'moneyHide', 'perReq', 'cd', 'saveLogs', 'saveFile', 'allowDl', 'limit', 'limitOn']
      .forEach(k => setCfg(k, DEF[k]));
    applyBg(); syncSettingsUI(); renderLogs();
    q('#cl-bg-msg').textContent = '';
    q('#cl-reset-logs-msg').textContent = 'Настройки логов сброшены';
  }
  function resetScriptSettings() {
    ['theme', 'fx', 'panelSize', 'char', 'charTheme', 'btnScale'].forEach(k => setCfg(k, DEF[k]));
    panel.style.width = ''; panel.style.height = '';
    applyTheme(); applyChar(); renderFx(); syncSettingsUI(); renderProfile();
    q('#cl-reset-script-msg').textContent = 'Настройки скрипта сброшены';
  }

  /* ---------- Лог Проверки: сохранённые проверки ---------- */
  function pausedFor(kind) { return cfg('jobs').find(j => j.kind === kind && !j.done) || null; }
  function renderResumeBtns() {
    qa('.cl-res').forEach(b => {
      const j = pausedFor(b.dataset.kind);
      b.classList.toggle('on', !isBusy() && !!j);
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
          ${cfg('allowDl') ? `<button class="cl-btnp small sec" data-act="dl" data-id="${j.id}">Скачать</button>` : ''}
          ${j.done ? '' : `<button class="cl-btnp small" data-act="resume" data-id="${j.id}">Продолжить</button>`}
          <button class="cl-btnp small sec danger" data-act="del" data-id="${j.id}">Удалить</button>
        </div>
      </div>`).join('')
      : infoHtml('Здесь появятся проверки: Пробив, Махинатор и Вирты с датой и результатом');
  }

  /* ---------- Доступ по ролям ---------- */
  function applyAccess() {
    qa('.cl-tab').forEach(t => { t.style.display = canTab(t.dataset.tab) ? '' : 'none'; });
    qa('.fcard').forEach(c => { c.style.display = canFilter(c.dataset.f) ? '' : 'none'; });
    const act = q('.cl-tab.act');
    if (act && act.style.display === 'none') activateTab('home', true);
    const chip = q('#cl-test');
    const on = isOwner() && !!cfg('devRole');
    chip.classList.toggle('on', on);
    q('#cl-test-name').textContent = 'Тест: ' + (cfg('devRole') || '');
    if (q('#cl-dev-cur')) q('#cl-dev-cur').textContent = cfg('devRole') ? `Включён тестовый режим: ${cfg('devRole')}` : 'Тестовый режим выключен — у тебя роль «Разработчик»';
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
    renderDevUsers();
    applyAccess();
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
      try { say2('Читаю файл…'); await finish(await readFile(file, MAX_UPLOAD_MB)); }
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
    o.zone.addEventListener('dragover', e => { e.preventDefault(); });
    o.zone.addEventListener('drop', e => {
      e.preventDefault();
      if (!fromDT(e.dataTransfer)) say2('Перетащи картинку или ссылку на неё');
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
        say2('Не удалось прочитать буфер обмена');
      }
    });
  }

  /* Фон логов: одно поле — вставил ссылку или картинку, сохраняется и включает «Кастомный» */
  function bindBgInput() {
    const inp = q('#cl-bg-in'), st = q('#cl-bg-msg'), fileIn = q('#cl-bg-file');
    const done = src => {
      setCfg('bgUrl', src); setCfg('banner', 'custom');
      inp.value = '';
      applyBg(); renderBgPreview();
      st.textContent = 'Фон применён';
    };
    const fromFile = async f => {
      try { st.textContent = 'Читаю файл…'; done(await readFile(f, MAX_UPLOAD_MB)); }
      catch (e) { st.textContent = 'Ошибка: ' + e.message; }
    };
    const fromUrl = async u => {
      if (!/^https?:\/\//i.test(u)) return;
      st.textContent = 'Проверяю ссылку…';
      try { await checkImageUrl(u); done(u); }
      catch (e) { st.textContent = 'Ошибка: ' + e.message; }
    };
    inp.addEventListener('paste', e => {
      const f = [...((e.clipboardData && e.clipboardData.files) || [])].find(x => x.type.startsWith('image/'));
      if (f) { e.preventDefault(); fromFile(f); return; }
      setTimeout(() => fromUrl(inp.value.trim()), 0);
    });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') fromUrl(inp.value.trim()); });
    inp.addEventListener('dragover', e => e.preventDefault());
    inp.addEventListener('drop', e => {
      e.preventDefault();
      const f = [...((e.dataTransfer && e.dataTransfer.files) || [])].find(x => x.type.startsWith('image/'));
      if (f) return fromFile(f);
      const txt = ((e.dataTransfer && e.dataTransfer.getData('text/uri-list')) || '').trim();
      if (txt) fromUrl(txt);
    });
    q('#cl-bg-pick').onclick = () => fileIn.click();
    fileIn.addEventListener('change', () => { if (fileIn.files[0]) fromFile(fileIn.files[0]); fileIn.value = ''; });
  }

  /* ---------- Профиль: ник, пароль, сервер, роль, связь ---------- */
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
  // Себе можно выдать роль не выше «Куратор»
  function changePosition() {
    const acc = getAcc();
    if (!acc || acc.key === OWNER_NICK) return;
    const v = q('#cl-acc-pos').value;
    if (!SELF_POSITIONS.includes(v) && v !== acc.position) return;
    saveAcc(acc.key, { position: v });
    renderAuth();
    q('#cl-acc-msg3').textContent = 'Роль сохранена: ' + v;
  }
  function giveRole() {
    if (!isOwner()) return;
    const key = q('#cl-dev-user').value, pos = q('#cl-dev-pos').value;
    const msg = s => { q('#cl-dev-msg').textContent = s; };
    if (!key || key === OWNER_NICK) return msg('Эту роль поменять нельзя');
    if (!POSITIONS.includes(pos)) return msg('Выбери должность');
    saveAcc(key, { position: pos });
    renderDevUsers();
    msg(`Роль «${pos}» выдана: ${cfg('accounts')[key].nick}`);
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
    setCfg('devRole', '');
    renderAuth();
    applyBg();
    refreshUpdate(false);
    activateTab('home', true);
  }

  /* ---------- Удаление аккаунта и скрипта ---------- */
  function renderDel() {
    const m = q('#cl-del'), box = q('#cl-del-box'), s = m.dataset.step;
    const btn2 = (act, label, cls) => `<button class="cl-btnp ${cls}" data-d="${act}">${label}</button>`;
    let h = '', btns = '';
    if (s === '1') {
      h = `<div class="cl-del-steps">Шаг 1 из 3</div><h3>Удалить аккаунт и скрипт?</h3>
        <p>Аккаунт, профиль, настройки и данные скрипта будут удалены из этого браузера.</p>`;
      btns = btn2('cancel', 'Отмена', 'sec') + btn2('next', 'Далее', 'danger');
    } else if (s === '2') {
      h = `<div class="cl-del-steps">Шаг 2 из 3</div><h3>Вернуть назад будет нельзя</h3>
        <p>Восстановить аккаунт и данные после удаления не получится. Скрипт перестанет работать в этом браузере.</p>`;
      btns = btn2('cancel', 'Отмена', 'sec') + btn2('next', 'Я понимаю, далее', 'danger');
    } else if (s === '3') {
      h = `<div class="cl-del-steps">Шаг 3 из 3</div><h3>Сохранить лог проверок?</h3>
        <p>Перед удалением можно скачать все сохранённые проверки одним файлом.</p>`;
      btns = btn2('del-no', 'Не сохранять, удалить', 'danger') + btn2('del-yes', 'Сохранить и удалить', 'danger') + btn2('cancel', 'Отмена', 'sec');
    } else {
      h = `<h3>Аккаунт удалён</h3>
        <p>Данные очищены. Чтобы полностью убрать скрипт, удали его в Tampermonkey. Потом перезагрузи страницу.</p>`;
      btns = btn2('close', 'Закрыть', 'sec');
    }
    box.innerHTML = `${h}<div class="cl-del-row">${btns}</div>`;
  }
  function openDel() {
    const m = q('#cl-del');
    m.dataset.step = '1';
    renderDel();
    m.classList.add('open');
  }
  function performDelete(save) {
    if (save && cfg('jobs').length) {
      const text = cfg('jobs').map(j => jobTxt(j, j.done ? 'готово' : 'остановлено')).join('\n\n' + '='.repeat(50) + '\n\n');
      saveText(`CustomLogs_все_проверки_${fileDate(Date.now())}.txt`, text);
    }
    Object.keys(KEY).forEach(k => GM_setValue(KEY[k], DEF[k]));
    GM_setValue('cl_deleted', true);
    q('#cl-del').dataset.step = 'done';
    renderDel();
    panel.classList.remove('open');
    btn.style.display = 'none';
    bgHost.style.display = 'none';
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
    const acc = getAcc();
    if (!s.outdated || !acc) return;
    const level = s.red ? 'red' : s.blocked ? 'blocked' : 'yellow';
    const tag = `${s.remote}:${level}`;
    if (sessionStorage.getItem('cl_said') === tag) return;
    sessionStorage.setItem('cl_said', tag);
    const f = isFemale(acc.nick) ? 'а' : '';
    const text = level === 'red'
      ? `${acc.nick}, ты совсем афигел${f}?\nДавай обновимся, я хочу посмотреть свои новые обновки 😢`
      : level === 'blocked'
        ? 'Скрипт остановлен. Нажми на меня и установи обновление во вкладке «О скрипте»'
        : `${acc.nick}, проверь вкладку О скрипте, там что-то новенькое`;
    sayOrDefer(() => say(text, level === 'yellow' ? 'warn' : 'red', 9000));
  }
  function refreshUpdate(announce) {
    const s = updState();
    refreshBadge();
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
          ? `Есть обновление: ${VERSION_NUM} → ${remote}. Нажми «Скачать».`
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
    q('#cl-verlist').innerHTML = CHANGELOG.slice(0, 5).map((e, i) => `
      <details class="ver"${i === 0 ? ' open' : ''}>
        <summary><span>v${esc(e.version)} · ${esc(e.date || '')}${i === 0 ? ' · последняя' : ''}${e.global ? '<span class="gl">Глобальное обновление</span>' : ''}</span></summary>
        <div class="ver-body">${itemsHtml(e.items)}</div>
      </details>`).join('');
  }
  function showUpdatePopupIfNeeded() {
    const last = cfg('lastSeen');
    if (!last) { setCfg('lastSeen', VERSION_NUM); return; }
    if (last === VERSION_NUM) return;
    setCfg('lastSeen', VERSION_NUM);
    const entry = CHANGELOG.find(e => e.version === VERSION_NUM);
    q('#cl-upv').textContent = 'v' + VERSION_NUM;
    q('#cl-upglobal').style.display = entry && entry.global ? 'inline-block' : 'none';
    q('#cl-upbody').innerHTML = itemsHtml(entry ? entry.items : []);
    q('#cl-upbar-i').style.animationDuration = POPUP_MS + 'ms';
    const pop = q('#cl-upopup');
    pop.classList.add('open');
    const close = () => pop.classList.remove('open');
    q('#cl-upclose').onclick = close;
    setTimeout(close, POPUP_MS);
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
      errors: [], spent: 0,
    };
  }
  function saveJob(job) {
    let list = cfg('jobs').filter(j => j.id !== job.id);
    const dropFinished = job.done && !cfg('saveLogs') && cfg('saveFile');
    if (!dropFinished) list.unshift(job);
    setCfg('jobs', list.slice(0, JOBS_CAP));
  }

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
        (job.errors ||= []).push(`HTTP 429, пауза ${sec} сек`);
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
    const per = perReq();
    const cd = cdSec() * 1000;
    const started = Date.now();
    let stopped = false;
    try {
      for (;;) {
        if (stopFlag) { stopped = true; break; }
        setMsg(`${job.title}: пачка ${job.pages + 1}, проверено строк: ${job.scanned}, найдено: ${job.rows.length}…`);
        const t0 = Date.now();
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
        if (page.length < per || oldest < job.from) { job.done = true; break; }
        let next = oldest;
        let bs = page.filter(r => r.time === oldest).map(r => r.time + '|' + r.action);
        if (next === job.cursor) { next = addSec(oldest, -1); bs = []; }
        job.cursor = next;
        job.boundSeen = bs;
        if (job.pages % SAVE_EVERY === 0) saveJob(job);
        await pause(Math.max(0, cd - (Date.now() - t0)));
      }
    } catch (e) {
      job.spent = (job.spent || 0) + (Date.now() - started);
      job.errors.push(e.message);
      busy = false;
      setStop(job.kind, false);
      saveJob(job);
      writeTxt(job, 'сбой');
      say(CRASH_TEXT, 'red', 12000);
      setMsg(`Сбой: ${e.message}. Прогресс сохранён в «Лог Проверки»` + (cfg('allowDl') ? ', файл скачан' : ''));
      renderResumeBtns();
      renderLogs();
      job.failed = true;
      return;
    }
    job.spent = (job.spent || 0) + (Date.now() - started);
    busy = false;
    setStop(job.kind, false);
    saveJob(job);
    renderResumeBtns();
    renderLogs();
    if (job.done) {
      setMsg(`Готово: найдено ${job.rows.length} строк`);
      if (cfg('saveFile')) writeTxt(job, 'готово');
      if (!job.noSay) announceDone();
    } else if (stopped) {
      setMsg('Остановлено. Продолжить можно кнопкой «Продолжить» или в «Лог Проверки»');
    }
  }
  function announceDone() {
    const acc = getAcc();
    if (!acc) return;
    doneBadge = true;
    refreshBadge();
    say(doneText(acc.nick), 'warn', 12000);
  }

  function resumeJob(id) {
    const job = cfg('jobs').find(j => j.id === id);
    if (!job || job.done) return;
    if (!gateOk(job.kind)) return;
    if (isBusy()) return msgFor(job.kind, 'Сначала дождись окончания текущей проверки');
    runJob(job);
  }

  /* ---------- Файл .txt: сохранение и загрузка ---------- */
  function rowLine(kind, r) {
    if (kind === 'probiv') return `${r.t} | ${r.a}`;
    if (kind === 'mech') return `[${r.cat}] ${r.t} | ${r.who} | ${r.a}`;
    return `${r.sign}${r.amt} | ${r.t} | ${r.a}`;
  }
  // Скачивание файла без проверки настроек (используется при удалении аккаунта)
  function saveText(name, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function download(name, text) {
    if (!cfg('allowDl')) return;
    saveText(name, text);
  }
  function jobTxt(job, status, rows) {
    rows = rows || job.rows;
    const P = job.params;
    const head = [
      `Вид: ${job.kind}`,
      `Дата пробива: ${dateTimeRu(job.created)}`,
      `Период от: ${job.from}`,
      `Период до: ${job.to}`,
      `Ник пользователя: ${P.nick || '—'}`,
      `Искали: ${(P.kws || []).join(', ') || '—'}`,
      `Тип запроса: ${P.typeLabel || '—'}`,
      `Строк просмотрено: ${job.scanned || 0}`,
      `Строк найдено: ${rows.length}`,
      `Ошибки поиска: ${(job.errors || []).join('; ') || 'нет'}`,
      `Время поиска: ${fmtDur((job.spent || 0) / 1000)}`,
      `Статус: ${status}`,
      `Курсор: ${job.cursor}`,
      '-'.repeat(50),
    ];
    return [...head, ...rows.map(r => rowLine(job.kind, r))].join('\n');
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
        const m = line.match(/^([^:]+):\s*(.*)$/);
        if (m) H[m[1].trim()] = m[2].trim();
        continue;
      }
      const i = line.indexOf(' | ');
      if (i < 0) continue;
      rows.push({ t: line.slice(0, i).trim(), a: line.slice(i + 3).trim() });
    }
    return { H, rows };
  }
  /* Загрузил файл → через 5 секунд поиск продолжается сам */
  async function loadResumeFile(file) {
    const info = q('#cl-pf-info');
    if (fileLoading) return;
    if (!gateOk('probiv')) return;
    if (isBusy()) return msgFor('probiv', 'Сначала дождись окончания текущей проверки');
    try {
      const { H, rows } = parseTxt(await file.text());
      if (!H['Вид'] || !H['Курсор'] || !H['Период от'] || !H['Период до']) throw new Error('это не файл CustomLogs');
      if (H['Вид'] !== 'probiv') throw new Error('продолжать из файла можно только Пробив');
      const from = normDT(H['Период от']), to = normDT(H['Период до']), cursor = normDT(H['Курсор']);
      if (!from || !to || !cursor) throw new Error('не нашла даты в файле');
      const nick = H['Ник пользователя'] && H['Ник пользователя'] !== '—' ? H['Ник пользователя'] : '';
      const kws = H['Искали'] && H['Искали'] !== '—' ? splitKw(H['Искали']) : [];
      const typeLabel = H['Тип запроса'] && H['Тип запроса'] !== '—' ? H['Тип запроса'] : '';
      const opt = typeLabel ? typeOpts.find(o => o.label === typeLabel) : null;
      if (!nick && !kws.length && !opt) throw new Error('в файле нет ника или ключевых слов');
      const title = `Пробив: ${nick || kws.join(', ') || typeLabel}`;
      const params = { nick, kws, type: opt ? opt.value : '', typeLabel };
      const job = {
        ...makeJob('probiv', title, params, from, to), cursor, rows: rows.slice(),
        boundSeen: rows.filter(r => r.t === cursor).map(r => r.t + '|' + r.a),
      };
      info.textContent = `Файл принят, поиск продолжится через ${FILE_CD_MS / 1000} сек (строк в файле: ${rows.length})`;
      fileLoading = true;
      await pause(FILE_CD_MS);
      fileLoading = false;
      info.textContent = '';
      if (isBusy()) return;
      runJob(job);
    } catch (e) {
      fileLoading = false;
      info.textContent = 'Не получилось открыть файл: ' + e.message;
    }
  }

  /* ---------- Результаты ---------- */
  function renderProbivHtml(job) {
    return job.rows.slice(0, MAX_RENDER).map(r => rowHtml(r.t, hl(maskText(r.a)), r.i)).join('') || infoHtml('Ничего не найдено');
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
    big.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)), r.i)));
    parts.push(secHtml('Дешёвая продажа транспорта', cheap.length));
    cheap.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)), r.i)));
    parts.push(secHtml('Много продаж ресурсов', res.length));
    res.forEach(([who, arr]) => {
      parts.push(playerHtml(who, `продаж за период: ${arr.length}`));
      arr.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)), r.i)));
    });
    parts.push(secHtml('Продажи бочек', barrels.length));
    barrels.forEach(([who, arr]) => {
      parts.push(playerHtml(who, `продано бочек: ${arr.length}`));
      arr.forEach(r => parts.push(rowHtml(r.t, hl(maskText(r.a)), r.i)));
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
      `${hl(maskText(o.a))}<span class="${o.sign === '+' ? 'plus' : 'minus'}">${o.sign === '+' ? '+' : '−'}${fmtPlain(o.amt)}</span>`, o.i)).join('');
    return sum + secHtml('Операции с деньгами', ops.length) + (list || infoHtml('Операций с деньгами за период не найдено'));
  }

  function updSelBtn() {
    const b = q('#cl-wsel');
    if (!b) return;
    b.textContent = `Скачать выбранное (${selSet.size})`;
    b.disabled = !selSet.size;
  }
  function showWin(title, html, job) {
    shownJob = job || null;
    selSet = new Set();
    q('#cl-wtitle').textContent = title;
    q('#cl-win .cl-wbody').innerHTML = html;
    q('#cl-winbtns').style.display = job && cfg('allowDl') ? '' : 'none';
    q('#cl-wselall').textContent = 'Выбрать всё';
    updSelBtn();
    q('#cl-win').classList.add('open');
  }
  function showJob(job) {
    job.rows.forEach((r, i) => { r.i = i; });
    const title = job.title + (job.done ? '' : ' (не завершено)');
    const found = `<div class="found">Найдено строк: ${job.rows.length}<span>просмотрено строк: ${job.scanned || 0}</span></div>`;
    const body = job.kind === 'probiv' ? renderProbivHtml(job)
      : job.kind === 'mech' ? (renderMechHtml(job) || infoHtml('Подозрительных действий не найдено'))
        : renderVirtHtml(job);
    showWin(title, found + body, job);
  }
  function downloadShown(rows, tag) {
    if (!shownJob) return;
    const status = shownJob.done ? 'готово' : 'остановлено';
    download(`CustomLogs_${shownJob.kind}_${fileDate(shownJob.created)}${tag}.txt`, jobTxt(shownJob, status, rows));
  }

  /* =========================================================
     ФИЛЬТРЫ (в разделе «Поиск»): Пробив, Махинатор, Вирты
     ========================================================= */
  function setPMode(m) {
    pMode = m;
    qa('.cl-mode[data-mode]').forEach(x => x.classList.toggle('act', x.dataset.mode === m));
    q('#cl-p-qlabel').textContent = PMODES[m].label;
    q('#cl-p-q').value = '';
    q('#cl-p-kw2-wrap').style.display = m === 'nick' ? 'block' : 'none';
    if (m === 'type') q('#cl-p-q').setAttribute('list', 'cl-p-types');
    else q('#cl-p-q').removeAttribute('list');
  }

  function startProbiv() {
    if (!gateOk('probiv') || isBusy()) return;
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
      if (!params.kws.length) return msgFor('probiv', 'Введи ключевое слово');
      title = `Пробив: ${params.kws.join(', ')}`;
    } else {
      const opt = typeOpts.find(o => o.label.toLowerCase() === raw.toLowerCase());
      if (!opt) return msgFor('probiv', 'Выбери тип из подсказок');
      params.type = opt.value;
      params.typeLabel = opt.label;
      title = `Пробив: ${opt.label}`;
    }
    const from = normDT(q('#cl-p-from').value), to = normDT(q('#cl-p-to').value);
    if (!from || !to) return msgFor('probiv', 'Дата в формате 2026-10-11 14:30:00');
    if (from >= to) return msgFor('probiv', 'Период от должен быть раньше периода до');
    runJob(makeJob('probiv', title, params, from, to));
  }

  function startMech() {
    if (!gateOk('mech') || isBusy()) return;
    const from = normDT(q('#cl-m-from').value), to = normDT(q('#cl-m-to').value);
    if (!from || !to) return msgFor('mech', 'Дата в формате 2026-10-11 14:30:00');
    if (from >= to) return msgFor('mech', 'Период от должен быть раньше периода до');
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
    if (!gateOk('virt') || isBusy()) return;
    const nick = q('#cl-v-nick').value.trim();
    if (!nick) return msgFor('virt', 'Укажи ник игрока');
    const from = normDT(q('#cl-v-from').value), to = normDT(q('#cl-v-to').value);
    if (!from || !to) return msgFor('virt', 'Дата в формате 2026-10-11 14:30:00');
    if (from >= to) return msgFor('virt', 'Период от должен быть раньше периода до');
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
  /* Настройки: kind = null (меню), 'logs', 'script', 'l-ui', 'l-priv', 'l-set', 's-cust', 's-mode', 's-anim' */
  function showTech(kind) {
    qa('.t-view').forEach(v => v.classList.remove('act'));
    q('#t-' + (kind || 'menu')).classList.add('act');
  }

  /* ---------- Вкладки и панели ---------- */
  function placePanel() {
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const p = cfg('panelPos');
    const x = p ? clamp(p.x, 0, Math.max(0, innerWidth - w)) : (innerWidth - w) / 2;
    const y = p ? clamp(p.y, 0, Math.max(0, innerHeight - h)) : (innerHeight - h) / 2;
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  }
  function togglePanel(force) {
    const open = force ?? !panel.classList.contains('open');
    if (open) {
      placePanel();
      doneBadge = false;
      refreshBadge();
      touchSeen();
    }
    panel.classList.toggle('open', open);
    if (open && updState().blocked) activateTab('update', true);
  }
  function setActive(name) {
    qa('.cl-tab').forEach(t => t.classList.toggle('act', t.dataset.tab === name));
    qa('.cl-profbtn').forEach(t => t.classList.toggle('act', name === 'profile'));
    qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === name || (name === 'profile' && p.dataset.pane === 'profile')));
    if (name === 'filters') showFilter(null);
    if (name === 'settings') showTech(null);
    if (name === 'logs') renderLogs();
    if (name === 'home') renderHomeStars();
  }
  // Переключение вкладок с плавным затуханием предыдущей
  function activateTab(name, instant) {
    if (updState().blocked) name = 'update';
    const my = ++tabToken;
    const cur = qa('.cl-pane.act')[0];
    if (!instant && cur && cur.dataset.pane !== name && panel.classList.contains('open')) {
      cur.classList.add('leaving');
      setTimeout(() => {
        if (my !== tabToken) return;
        cur.classList.remove('leaving');
        setActive(name);
      }, 200);
    } else {
      setActive(name);
    }
  }
  function openAccount() {
    if (updState().blocked) return activateTab('update', true);
    const my = ++tabToken;
    const cur = qa('.cl-pane.act')[0];
    const go = () => {
      qa('.cl-tab').forEach(t => t.classList.remove('act'));
      qa('.cl-profbtn').forEach(t => t.classList.add('act'));
      qa('.cl-pane').forEach(p => p.classList.toggle('act', p.dataset.pane === 'account'));
      renderAccountForm();
    };
    if (cur) { cur.classList.add('leaving'); setTimeout(() => { if (my === tabToken) { cur.classList.remove('leaving'); go(); } }, 200); } else go();
  }

  /* =========================================================
     ПОСТРОЕНИЕ ИНТЕРФЕЙСА
     ========================================================= */
  function buildUI() {
    const serverOpts = SERVERS.map(([n, name]) => `<option value="${n}">[${n}] ${name}</option>`).join('');
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const fromVal = fmtSite(startOfDay), toVal = fmtSite(now);
    const limitRadios = LIMITS.map(n => `<label><input type="radio" name="cl-lim" value="${n}"><span>${n}</span></label>`).join('');
    const perRadios = PER_OPTIONS.map(n => `<label><input type="radio" name="cl-per" value="${n}"><span>${n}</span></label>`).join('');
    const bannerRadios = [['', 'Стоковый'], ['custom', 'Кастомный'], ['black', 'Чёрный']].map(([v, n]) =>
      `<label><input type="radio" class="cl-banner-r" name="cl-banner" value="${v}"><span>${n}</span></label>`).join('');
    const fxChips = FX_TYPES.map(([v, n, e]) =>
      `<label><input type="radio" name="cl-fxt" value="${v}">${e ? e + ' ' : ''}${n}</label>`).join('');
    const fxColorOpts = FX_COLORS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
    const charCards = CHARS.map(c =>
      `<label><input type="radio" name="cl-char" value="${c.id}"><img src="${charImg(c)}" alt=""><span>${c.name}</span></label>`).join('');
    const roleOpts = TEST_ROLES.map(r => `<option value="${r}">${r}</option>`).join('');
    const devPosOpts = POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('');
    const mech = cfg('mech');
    const typeOptsHtml = typeOpts.map(o => `<option value="${esc(o.label)}"></option>`).join('');
    const themeSec = key => `
      <div class="th-sec" data-key="${key}">
        <div class="cl-secrow"><div class="cl-sec" style="margin:0">${THEME_LABELS[key]}</div>
          <button class="cl-btnp small sec th-reset" data-key="${key}">Сбросить</button></div>
        <label class="cl-sw"><span>Градиент</span><input type="checkbox" class="th-grad" data-key="${key}"></label>
        <div class="th-rows"></div>
      </div>`;
    const mechIco = MECH_IMG ? `<img src="${MECH_IMG}" alt="">` : ICON.chain;

    ui.innerHTML = `
      <style>${CSS}</style>
      <div id="cl-btn" title="CustomLogs — клик: меню, Alt + тяни: перемещение">
        <img id="cl-char" src="" alt="">
        <div class="cl-zzz"><span>z</span><span>z</span><span>Z</span></div>
      </div>
      <div class="cl-bubble" id="cl-bubble"><span class="cl-dot ok" id="cl-bubble-dot"></span><span id="cl-bubble-text"></span></div>

      <div id="cl-warn">
        <div class="cl-box center" id="cl-warn-box">
          <div class="cl-warn-ico">!</div>
          <h3>Предупреждение</h3>
          <p>${WARN_TEXT}</p>
          <div class="cl-upbar"><i id="cl-warn-i" style="animation-duration:${WARN_MS}ms"></i></div>
          <button class="cl-btnp" id="cl-warn-ok">Понятно</button>
        </div>
      </div>

      <div id="cl-upopup">
        <div class="cl-upbox" id="cl-upbox">
          <h3>Скрипт обновлён до <span id="cl-upv"></span></h3>
          <span class="cl-upglobal" id="cl-upglobal">Глобальное обновление</span>
          <div class="cl-upbody" id="cl-upbody"></div>
          <div class="cl-upend">${WELCOME_TXT}</div>
          <div class="cl-upbar"><i id="cl-upbar-i"></i></div>
          <button class="cl-btnp small sec" id="cl-upclose">Закрыть</button>
        </div>
      </div>

      <div id="cl-del"><div class="cl-box center" id="cl-del-box"></div></div>

      <div id="cl-panel">
        <div id="cl-fx"></div>
        <div class="cl-head">
          <div class="cl-title"><b>CustomLogs</b><span>Rodina RP</span><em class="cl-beta">BETA</em><span class="cl-homever">${VERSION}</span>
            <span class="cl-test" id="cl-test"><span id="cl-test-name"></span><button id="cl-test-exit">Выйти</button></span></div>
          <span class="cl-x" title="Закрыть">✕</span>
        </div>
        <div class="cl-main">
          <div class="cl-nav">
            <div class="cl-tab act" data-tab="home">${ICON.home}<span>Главная</span></div>
            <div class="cl-tab" data-tab="settings">${ICON.gear}<span>Настройки</span></div>
            <div class="cl-tab" data-tab="filters">${ICON.search}<span>Поиск</span></div>
            <div class="cl-tab" data-tab="logs">${ICON.logs}<span>Лог Проверки</span></div>
            <div class="cl-tab lock" data-tab="ivent">${ICON.spark}<span>Ивенты</span></div>
            <div class="cl-tab" data-tab="offer">${ICON.chat}<span>Предложения</span></div>
            <div class="cl-tab" data-tab="update">${ICON.info}<span>О скрипте</span></div>
            <div class="cl-tab" data-tab="dev">${ICON.dev}<span>Для Разработчика</span></div>
            <div class="cl-navend"></div>
            <div class="cl-profbtn" id="cl-profbtn" title="Профиль"><span id="cl-profbtn-av"></span></div>
          </div>
          <div class="cl-body">

            <div class="cl-pane" data-pane="auth">
              <div class="cl-auth">
                <h2>Вход в CustomLogs</h2>
                <p class="cl-hint">Без входа скрипт не работает. Профиль локальный, в этом браузере.</p>
                <div class="cl-card">
                  <label class="cl-lbl">Ник</label>
                  <input class="cl-in" id="cl-a-nick">
                  <label class="cl-lbl">Пароль (минимум 4 символа)</label>
                  <input class="cl-in" id="cl-a-pass" type="password">
                  <label class="cl-lbl">Сервер</label>
                  <select class="cl-in" id="cl-a-server">${serverOpts}</select>
                  <label class="cl-lbl">Должность (выбирается при регистрации)</label>
                  <select class="cl-in" id="cl-a-pos">${SELF_POSITIONS.map(p => `<option${p === 'Администратор' ? ' selected' : ''}>${p}</option>`).join('')}</select>
                </div>
                <button class="cl-btnp" id="cl-a-login">Войти</button>
                <button class="cl-btnp sec" id="cl-a-reg">Создать аккаунт</button>
                <div class="cl-msg" id="cl-a-msg"></div>
              </div>
            </div>

            <div class="cl-pane act cl-home" data-pane="home">
              <div class="cl-stars" id="cl-stars"></div>
              <div class="cl-hero">
                <h2>Добро пожаловать в <em>Custom Logs!</em></h2>
                <p>Продуктивного проживания в логах Проекта Rodina RolePlay</p>
                <div class="cl-status"><span class="cl-dot static" id="cl-status-dot"></span><span id="cl-status-text"></span></div>
              </div>
              <div class="cl-foot">Разработчик/Владелец - Without Custom</div>
            </div>

            <div class="cl-pane" data-pane="profile">
              <div class="cl-profcard">
                <div class="cl-cover" id="cl-cover"></div>
                <button class="cl-gear" id="cl-goacc">${ICON.gear}<span>Настройка</span></button>
                <div class="cl-cbody">
                  <div class="cl-prow">
                    <div id="cl-av"></div>
                    <div class="cl-pinfo"><div class="cl-nick" id="cl-pnick">Гость</div><div id="cl-badges"></div></div>
                  </div>
                  <div class="cl-conn" id="cl-conn"></div>
                  <div class="cl-flamewrap">
                    <span id="cl-flame"></span><b id="cl-streakdays">0</b>
                    <div class="cl-flametip" id="cl-flametip"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="cl-pane" data-pane="account">
              <div class="cl-top">
                <button class="cl-btnp small sec" id="cl-acc-back">← Назад</button>
                <div class="cl-title-sm">Настройка профиля</div>
              </div>
              <div class="cl-setrow">
                <div class="cl-setlbl">Аватар:</div>
                <div>
                  <div class="cl-avbig" id="cl-av-zone" tabindex="0"></div>
                  <div class="cl-hint2">Нажмите на аватар, чтобы сменить, или вставьте ссылку ниже. По умолчанию — буква вашего ника.</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-av-url" placeholder="Ссылка на картинку">
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
                  <div class="cl-bnwide" id="cl-bn-zone" tabindex="0"><div id="cl-bn-prev" style="width:100%;height:100%;background:var(--cl-panel-fill) center/cover no-repeat"></div></div>
                  <div class="cl-hint2">Нажмите на баннер, чтобы сменить, или вставьте ссылку ниже. По умолчанию — цвет меню скрипта.</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-bn-url" placeholder="Ссылка на картинку">
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
                  <label class="cl-lbl">VK</label>
                  <input class="cl-in" id="cl-vk" placeholder="https://vk.ru/имя">
                  <label class="cl-lbl">Telegram</label>
                  <input class="cl-in" id="cl-tg" placeholder="@имя">
                  <button class="cl-btnp small" id="cl-ct-save" style="margin-top:10px">Сохранить связь</button>
                  <div class="cl-msg" id="cl-ct-msg"></div>
                </div>
              </div>
              <div class="cl-grid2">
                <div class="cl-card" style="margin-top:14px">
                  <div class="cl-sec">Ник и сервер</div>
                  <label class="cl-lbl">Новый ник</label>
                  <input class="cl-in" id="cl-acc-nick">
                  <label class="cl-lbl">Пароль для подтверждения</label>
                  <input class="cl-in" id="cl-acc-pass1" type="password">
                  <button class="cl-btnp small" id="cl-acc-nickgo" style="margin-top:10px">Сменить ник</button>
                  <label class="cl-lbl">Сервер</label>
                  <select class="cl-in" id="cl-acc-server">${serverOpts}</select>
                  <button class="cl-btnp small" id="cl-acc-servergo" style="margin-top:10px">Сохранить сервер</button>
                  <div class="cl-msg" id="cl-acc-msg1"></div>
                  <label class="cl-lbl">Моя роль (максимум — Куратор)</label>
                  <select class="cl-in" id="cl-acc-pos"></select>
                  <button class="cl-btnp small" id="cl-acc-posgo" style="margin-top:10px">Сохранить роль</button>
                  <div class="cl-msg" id="cl-acc-msg3"></div>
                </div>
                <div class="cl-card" style="margin-top:14px">
                  <div class="cl-sec">Пароль</div>
                  <label class="cl-lbl">Старый пароль</label>
                  <input class="cl-in" id="cl-acc-oldp" type="password">
                  <label class="cl-lbl">Новый пароль (минимум 4 символа)</label>
                  <input class="cl-in" id="cl-acc-newp" type="password">
                  <button class="cl-btnp small" id="cl-acc-passgo" style="margin-top:10px">Сменить пароль</button>
                  <div class="cl-msg" id="cl-acc-msg2"></div>
                </div>
              </div>
              <button class="cl-btnp sec danger" id="cl-logout" style="margin-top:14px">Выйти из аккаунта</button>
              <button class="cl-btnp sec danger" id="cl-delacc">Удалить аккаунт</button>
            </div>

            <div class="cl-pane cl-col" data-pane="settings">
              <div id="t-menu" class="t-view menu-center act">
                <div class="tcards">
                  <div class="tcard" data-t="logs">${ICON.doc}<b>Настройки логов</b></div>
                  <div class="tcard" data-t="script">${ICON.sliders}<b>Настройки скрипта</b></div>
                </div>
              </div>

              <div id="t-logs" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="">← Назад</button><div class="cl-title-sm">Настройки логов</div></div>
                <div class="tcards">
                  <div class="tcard" data-t="l-ui">${ICON.eye}<b>Интерфейс</b></div>
                  <div class="tcard" data-t="l-priv">${ICON.sliders}<b>Приватность</b></div>
                  <div class="tcard" data-t="l-set">${ICON.gear}<b>Настройка</b></div>
                </div>
                <button class="cl-btnp sec danger" id="cl-reset-logs" style="margin-top:18px">Сбросить все настройки логов</button>
                <div class="cl-msg" id="cl-reset-logs-msg"></div>
              </div>

              <div id="t-l-ui" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="logs">← Назад</button><div class="cl-title-sm">Интерфейс логов</div></div>
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Фон логов</div>
                  <div class="cl-seg">${bannerRadios}</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-bg-in" placeholder="Вставь ссылку на картинку или gif" autocomplete="off">
                    <button class="cl-btnp sec" id="cl-bg-pick">Файл</button>
                  </div>
                  <input type="file" id="cl-bg-file" accept="image/*" hidden>
                  <div class="cl-row left">
                    <button class="cl-btnp small sec danger" id="cl-bg-reset" style="margin-top:8px">Сбросить картинку</button>
                  </div>
                  <div class="cl-msg" id="cl-bg-msg"></div>
                  <div class="cl-sec" style="margin-top:6px">Блюр картинки: <span id="cl-blurv">0</span> px</div>
                  <input class="cl-range" type="range" id="cl-blur" min="0" max="20" value="0">
                </div>
              </div>

              <div id="t-l-priv" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="logs">← Назад</button><div class="cl-title-sm">Приватность</div></div>
                <div class="cl-card" style="margin-top:0">
                  <label class="cl-sw"><span>Скрытие IP Адресов</span><input type="checkbox" id="cl-ipb"></label>
                  <label class="cl-sw"><span>Скрытие Денежных Средств</span><input type="checkbox" id="cl-moneyb"></label>
                  <label class="cl-sw"><span>Скрытие Даты</span><input type="checkbox" id="cl-dateb"></label>
                </div>
              </div>

              <div id="t-l-set" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="logs">← Назад</button><div class="cl-title-sm">Настройка логов</div></div>
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-sec">Запросы</div>
                  <div class="cl-seg">${perRadios}</div>
                  <div class="cl-cap">Сколько строк проверяется за одну пачку</div>
                  <div class="cl-sec" style="margin-top:12px">КД, сек</div>
                  <div class="cl-urlrow">
                    <input class="cl-in" id="cl-cd-in" type="number" min="${CD_MIN}" max="${CD_MAX}" step="0.5">
                  </div>
                  <div class="cl-hint2">По умолчанию ${CD_DEF} сек. Можно поставить меньше, но тогда выше риск ограничения со стороны сайта.</div>
                </div>
                <div class="cl-card">
                  <div class="cl-sec">Кол-во строк на странице</div>
                  <div class="cl-seg">${limitRadios}</div>
                  <label class="cl-sw"><span>Автоматически выставлять это значение</span><input type="checkbox" id="cl-limon"></label>
                </div>
                <div class="cl-card">
                  <div class="cl-sec">Логирование</div>
                  <label class="cl-sw"><span>Сохранение всех файлов</span><input type="checkbox" id="cl-allowdl"></label>
                  <label class="cl-sw"><span>Сохранение в лог проверки</span><input type="checkbox" id="cl-savelogs"></label>
                  <label class="cl-sw"><span>Сохранение на ПК</span><input type="checkbox" id="cl-savefile"></label>
                </div>
              </div>

              <div id="t-script" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="">← Назад</button><div class="cl-title-sm">Настройки скрипта</div></div>
                <div class="tcards">
                  <div class="tcard" data-t="s-cust">${ICON.brush}<b>Кастомизация</b></div>
                  <div class="tcard" data-t="s-mode">${ICON.wand}<b>Режим</b></div>
                  <div class="tcard" data-t="s-anim">${ICON.film}<b>Анимация</b></div>
                </div>
                <button class="cl-btnp sec danger" id="cl-reset-script" style="margin-top:18px">Сбросить настройки скрипта</button>
                <div class="cl-msg" id="cl-reset-script-msg"></div>
              </div>

              <div id="t-s-cust" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="script">← Назад</button><div class="cl-title-sm">Кастомизация</div></div>
                <div class="cl-card" style="margin-top:0">
                  <div class="cl-secrow"><div class="cl-sec" style="margin:0">Вид меню</div>
                    <button class="cl-btnp small sec" id="cl-stock">Стоковый вид</button></div>
                  <div class="cl-hint2" style="margin-top:0">Чёрный фон, белый контур, белая заливка надписи BETA, белое полупрозрачное наведение.</div>
                </div>
                ${themeSec('accent')}
                ${themeSec('panel')}
                ${themeSec('hover')}
                <div class="th-sec">
                  <div class="cl-secrow"><div class="cl-sec" style="margin:0">Размер меню</div>
                    <button class="cl-btnp small sec" id="cl-size-reset">Сбросить размер</button></div>
                  <div class="cl-hint2" style="margin-top:0">Потяни меню за правый нижний угол, чтобы растянуть. Размер сохранится навсегда.</div>
                </div>
              </div>

              <div id="t-s-mode" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="script">← Назад</button><div class="cl-title-sm">Режим</div></div>
                <div class="th-sec" style="margin-top:0">
                  <div class="cl-sec">Иконка запуска меню скрипта</div>
                  <div class="chars">${charCards}</div>
                  <label class="cl-sw"><span>Оформление скрипта под персонажа</span><input type="checkbox" id="cl-chartheme"></label>
                  <div class="cl-lbl">Размер модельки: <span id="cl-scalev">100</span>%</div>
                  <input class="cl-range" type="range" id="cl-scale" min="40" max="150" value="100">
                </div>
              </div>

              <div id="t-s-anim" class="t-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-tback="script">← Назад</button><div class="cl-title-sm">Анимация</div></div>
                <div class="th-sec" style="margin-top:0">
                  <div class="cl-sec">Анимация меню</div>
                  <div class="fx-chips">${fxChips}</div>
                  <label class="cl-lbl">Цвет анимации</label>
                  <select class="cl-in" id="cl-fx-color">${fxColorOpts}</select>
                  <div class="cl-row left" style="margin-top:12px">
                    <div style="flex:1;min-width:200px">
                      <div class="cl-lbl">Частота: <span id="cl-fx-countv">10</span> шт.</div>
                      <input class="cl-range" type="range" id="cl-fx-count" min="3" max="40" value="10">
                    </div>
                    <div style="flex:1;min-width:200px">
                      <div class="cl-lbl">Скорость падения: <span id="cl-fx-speedv">10</span> сек (меньше — быстрее)</div>
                      <input class="cl-range" type="range" id="cl-fx-speed" min="4" max="20" value="10">
                    </div>
                  </div>
                  <div class="cl-lbl">Размер анимации: <span id="cl-fx-sizev">100</span>%</div>
                  <input class="cl-range" type="range" id="cl-fx-size" min="50" max="200" value="100">
                </div>
              </div>
            </div>

            <div class="cl-pane cl-col" data-pane="filters">
              <div id="f-menu" class="f-view menu-center act">
                <div class="fcards">
                  <div class="fcard" data-f="probiv"><div class="fico">${ICON.search}</div><b>Пробив</b></div>
                  <div class="fcard" data-f="mech"><div class="fico">${mechIco}</div><b>Махинатор</b></div>
                  <div class="fcard" data-f="virt"><div class="fico">${ICON.dollar}</div><b>Вирты</b></div>
                </div>
              </div>

              <div id="f-probiv" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Поиск</button><div class="cl-title-sm">Пробив</div></div>
                <div class="cl-modes">
                  <div class="cl-mode act" data-mode="nick">Ник</div>
                  <div class="cl-mode" data-mode="kw">Ключевые слова</div>
                  <div class="cl-mode" data-mode="type">Тип запроса</div>
                </div>
                <div class="cl-grid">
                  <div class="cl-card" style="margin-top:12px">
                    <label class="cl-lbl" id="cl-p-qlabel"></label>
                    <input class="cl-in" id="cl-p-q" autocomplete="off">
                    <datalist id="cl-p-types">${typeOptsHtml}</datalist>
                    <div id="cl-p-kw2-wrap">
                      <label class="cl-lbl">Ключевые слова</label>
                      <input class="cl-in" id="cl-p-kw2" autocomplete="off">
                    </div>
                  </div>
                  <div class="cl-card" style="margin-top:12px">
                    <label class="cl-lbl">Период от</label>
                    <input class="cl-in" id="cl-p-from" value="${fromVal}" autocomplete="off">
                    <label class="cl-lbl">Период до</label>
                    <input class="cl-in" id="cl-p-to" value="${toVal}" autocomplete="off">
                  </div>
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-p-go">Искать</button>
                  <button class="cl-btnp sec cl-stop" data-kind="probiv">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="probiv">Продолжить</button>
                  <button class="cl-btnp sec" id="cl-pf-btn" title="Загрузи файл проверки, и поиск продолжится с того же места">Продолжить из файла</button>
                </div>
                <input type="file" id="cl-pf-file" accept=".txt,text/plain" hidden>
                <div class="cl-msg" id="cl-msg-p"></div>
                <div class="cl-hint2" id="cl-pf-info" style="text-align:center"></div>
              </div>

              <div id="f-mech" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Поиск</button><div class="cl-title-sm">Махинатор</div></div>
                <div class="cl-grid">
                  <div class="cl-card" style="margin-top:0">
                    <label class="cl-lbl">Ник игрока</label>
                    <input class="cl-in" id="cl-m-player">
                    <label class="cl-lbl">Ключевые слова</label>
                    <input class="cl-in" id="cl-m-kw">
                    <label class="cl-lbl">Машина</label>
                    <input class="cl-in" id="cl-m-car">
                    <div class="cl-grid" style="gap:8px">
                      <div><label class="cl-lbl">Сумма от</label><input class="cl-in" id="cl-m-min"></div>
                      <div><label class="cl-lbl">Сумма до</label><input class="cl-in" id="cl-m-max"></div>
                    </div>
                  </div>
                  <div class="cl-card" style="margin-top:0">
                    <label class="cl-lbl">Период от</label>
                    <input class="cl-in" id="cl-m-from" value="${fromVal}" autocomplete="off">
                    <label class="cl-lbl">Период до</label>
                    <input class="cl-in" id="cl-m-to" value="${toVal}" autocomplete="off">
                    <div class="cl-sec" style="margin-top:14px">Пороги</div>
                    <div class="cl-grid" style="gap:8px">
                      <div><label class="cl-lbl">Перевод от</label><input class="cl-in" id="cl-th-big" value="${mech.big}"></div>
                      <div><label class="cl-lbl">Продажа авто ниже</label><input class="cl-in" id="cl-th-cheap" value="${mech.cheap}"></div>
                      <div><label class="cl-lbl">Продаж ресурсов</label><input class="cl-in" id="cl-th-res" value="${mech.res}"></div>
                      <div><label class="cl-lbl">Продаж бочек</label><input class="cl-in" id="cl-th-barrel" value="${mech.barrel}"></div>
                    </div>
                    <button class="cl-btnp small sec" id="cl-th-save" style="margin-top:10px">Сохранить пороги</button>
                  </div>
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-m-go">Запустить</button>
                  <button class="cl-btnp sec cl-stop" data-kind="mech">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="mech">Продолжить</button>
                </div>
                <div class="cl-msg" id="cl-msg-m"></div>
              </div>

              <div id="f-virt" class="f-view">
                <div class="cl-top"><button class="cl-btnp small sec" data-back>← Поиск</button><div class="cl-title-sm">Вирты</div></div>
                <div class="cl-card" style="margin-top:0">
                  <label class="cl-lbl">Ник игрока</label>
                  <input class="cl-in" id="cl-v-nick">
                  <label class="cl-lbl">Период от</label>
                  <input class="cl-in" id="cl-v-from" value="${fromVal}" autocomplete="off">
                  <label class="cl-lbl">Период до</label>
                  <input class="cl-in" id="cl-v-to" value="${toVal}" autocomplete="off">
                </div>
                <div class="cl-center">
                  <button class="cl-btnp" id="cl-v-go">Посчитать</button>
                  <button class="cl-btnp sec cl-stop" data-kind="virt">Стоп</button>
                  <button class="cl-btnp sec cl-res" data-kind="virt">Продолжить</button>
                </div>
                <div class="cl-msg" id="cl-msg-v"></div>
              </div>
            </div>

            <div class="cl-pane" data-pane="logs">
              <div class="cl-top"><div class="cl-title-sm">Лог Проверки</div></div>
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
                <div class="cl-verbig">v${VERSION_NUM}</div>
                <div class="upd-line" id="cl-upd-remote">Доступная версия: проверяю…</div>
                <div class="cl-row">
                  <button class="cl-btnp small" id="cl-upd-check">Проверить обновления</button>
                  <button class="cl-btnp small sec" id="cl-upd-dl">Скачать</button>
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

            <div class="cl-pane" data-pane="dev">
              <div class="cl-top"><div class="cl-title-sm">Для Разработчика</div></div>
              <div class="cl-card" style="margin-top:0">
                <div class="cl-sec">Тестовый режим</div>
                <div class="cl-hint2" style="margin-top:0">Выдай себе любую роль и посмотри, что ей открывается. Выйти можно кнопкой здесь или в шапке меню.</div>
                <label class="cl-lbl">Роль</label>
                <select class="cl-in" id="cl-dev-role">${roleOpts}</select>
                <div class="cl-center" style="justify-content:flex-start">
                  <button class="cl-btnp" id="cl-dev-on">Включить роль</button>
                  <button class="cl-btnp sec" id="cl-dev-off">Выйти из тестового режима</button>
                </div>
                <div class="cl-msg" id="cl-dev-cur"></div>
              </div>
              <div class="cl-card">
                <div class="cl-sec">Выдать роль пользователю</div>
                <label class="cl-lbl">Пользователь</label>
                <select class="cl-in" id="cl-dev-user"></select>
                <label class="cl-lbl">Должность</label>
                <select class="cl-in" id="cl-dev-pos">${devPosOpts}</select>
                <button class="cl-btnp small" id="cl-dev-give" style="margin-top:10px">Выдать</button>
                <div class="cl-msg" id="cl-dev-msg"></div>
              </div>
            </div>

          </div>
        </div>
        <div class="cl-resize" id="cl-resize" title="Потяни, чтобы изменить размер"></div>
      </div>

      <div id="cl-win">
        <div id="cl-wfx"></div>
        <div class="cl-head" id="cl-whead">
          <div class="cl-title"><b id="cl-wtitle"></b></div>
          <div class="cl-whead-btns" id="cl-winbtns">
            <button class="cl-btnp small sec" id="cl-wselall">Выбрать всё</button>
            <button class="cl-btnp small sec" id="cl-wsel" disabled>Скачать выбранное (0)</button>
            <button class="cl-btnp small sec" id="cl-wall">Скачать всё</button>
            <span class="cl-x" id="cl-wclose">✕</span>
          </div>
        </div>
        <div class="cl-wbody"></div>
      </div>`;

    btn = q('#cl-btn');
    bubble = q('#cl-bubble');
    panel = q('#cl-panel');

    /* Вкладки */
    qa('.cl-tab').forEach(tab => tab.onclick = () => activateTab(tab.dataset.tab));
    q('#cl-profbtn').onclick = () => activateTab('profile');
    q('.cl-head .cl-x').onclick = () => togglePanel(false);
    q('#cl-wclose').onclick = () => q('#cl-win').classList.remove('open');
    const closeWarn = () => {
      q('#cl-warn').classList.remove('open');
      if (pending) { const f = pending; pending = null; f(); }
    };
    q('#cl-warn-ok').onclick = closeWarn;
    document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });
    qa('.tcard').forEach(c => c.onclick = () => showTech(c.dataset.t));
    qa('[data-tback]').forEach(b => b.onclick = () => showTech(b.dataset.tback || null));
    qa('.fcard').forEach(c => c.onclick = () => showFilter(c.dataset.f));
    qa('[data-back]').forEach(b => b.onclick = () => showFilter(null));
    qa('.cl-mode[data-mode]').forEach(m => m.onclick = () => setPMode(m.dataset.mode));
    setPMode(pMode);

    /* Предупреждение о безопасности: закрывается само через WARN_MS */
    q('#cl-warn').dataset.close = '1';
    setTimeout(() => { q('#cl-warn').classList.add('open'); setTimeout(closeWarn, WARN_MS); }, 0);
    window.__clCloseWarn = closeWarn;

    /* Все окна перемещаются */
    makeDrag(q('#cl-win'), q('#cl-whead'));
    makeDrag(q('#cl-upbox'), q('#cl-upbox'));
    makeDrag(q('#cl-warn-box'), q('#cl-warn-box'));
    makeDrag(q('#cl-del-box'), q('#cl-del-box'));

    /* Меню: перетаскивание за шапку */
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

    /* Меню: растягивание за правый нижний угол, размер запоминается */
    const rz = q('#cl-resize');
    let rzOn = false, rx = 0, ry = 0, rw = 0, rh = 0;
    rz.addEventListener('pointerdown', e => {
      rzOn = true; rx = e.clientX; ry = e.clientY;
      rw = panel.offsetWidth; rh = panel.offsetHeight;
      rz.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    rz.addEventListener('pointermove', e => {
      if (!rzOn) return;
      const left = panel.getBoundingClientRect().left, top = panel.getBoundingClientRect().top;
      panel.style.width = clamp(rw + e.clientX - rx, 640, innerWidth - left - 4) + 'px';
      panel.style.height = clamp(rh + e.clientY - ry, 420, innerHeight - top - 4) + 'px';
    });
    rz.addEventListener('pointerup', () => {
      if (!rzOn) return;
      rzOn = false;
      setCfg('panelSize', { w: panel.offsetWidth, h: panel.offsetHeight });
    });
    const sz = cfg('panelSize');
    if (sz && sz.w && sz.h) {
      panel.style.width = clamp(sz.w, 640, innerWidth - 8) + 'px';
      panel.style.height = clamp(sz.h, 420, innerHeight - 8) + 'px';
    }
    q('#cl-size-reset').onclick = () => {
      setCfg('panelSize', null);
      panel.style.width = ''; panel.style.height = '';
      placePanel();
    };

    /* Модель запуска: перемещение только с Alt, клик без Alt — меню */
    const setBtnPos = (x, y) => {
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.style.right = 'auto';
    };
    const keepBtn = () => {
      const s = btnSize(), r = btn.getBoundingClientRect();
      setBtnPos(clamp(r.left, 0, innerWidth - s.w), clamp(r.top, 0, innerHeight - s.h));
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
      const s = btnSize();
      setBtnPos(clamp(bx + dx, 0, innerWidth - s.w), clamp(by + dy, 0, innerHeight - s.h));
      if (bubble.classList.contains('show')) placeBubble();
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
      keepBtn();
      if (panel.classList.contains('open')) placePanel();
    });
    applyChar();
    const saved = cfg('btnPos');
    if (saved) setBtnPos(saved.x, saved.y);
    q('#cl-char').addEventListener('load', keepBtn);

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
        accs[key] = { nick, salt, hash: await hashPass(pass, salt), server, position: q('#cl-a-pos').value, vk: '', tg: '', seen: Date.now() };
        setCfg('accounts', accs);
      } else {
        const a = accs[key];
        if (!a) return authMsg('Аккаунт не найден, нажми «Создать аккаунт»');
        if ((await hashPass(pass, a.salt)) !== a.hash) return authMsg('Неверный пароль');
        saveAcc(key, { server, seen: Date.now() });
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
        sayOrDefer(() => say(mode === 'register' ? newbieText() : greetText(acc.nick), 'ok', 9000));
      }
      activateTab('home', true);
    }
    q('#cl-a-login').onclick = () => authSubmit('login');
    q('#cl-a-reg').onclick = () => authSubmit('register');

    /* Фильтры */
    q('#cl-p-go').onclick = startProbiv;
    q('#cl-m-go').onclick = startMech;
    q('#cl-v-go').onclick = startVirt;
    q('#cl-th-save').onclick = saveMechThresholds;
    qa('.cl-stop').forEach(b => b.onclick = () => {
      if (!isBusy() || curKind !== b.dataset.kind) return;
      stopFlag = true;
      b.textContent = 'Останавливаю…';
      b.disabled = true;
      setMsg('Останавливаю на текущей пачке…');
    });
    qa('.cl-res').forEach(b => b.onclick = () => { if (b.dataset.id) resumeJob(b.dataset.id); });
    const pfBtn = q('#cl-pf-btn'), pfFile = q('#cl-pf-file');
    pfBtn.addEventListener('click', () => pfFile.click());
    pfFile.addEventListener('change', () => { if (pfFile.files[0]) loadResumeFile(pfFile.files[0]); pfFile.value = ''; });

    /* Окно результата: выбор строк и скачивание */
    q('#cl-win .cl-wbody').addEventListener('click', e => {
      const row = e.target.closest('.r[data-i]');
      if (!row) return;
      const i = +row.dataset.i;
      if (selSet.has(i)) selSet.delete(i); else selSet.add(i);
      row.classList.toggle('sel', selSet.has(i));
      updSelBtn();
    });
    q('#cl-wselall').onclick = () => {
      if (!shownJob) return;
      const all = selSet.size === shownJob.rows.length;
      selSet = all ? new Set() : new Set(shownJob.rows.map(r => r.i));
      qa('.r[data-i]', q('#cl-win .cl-wbody')).forEach(r => r.classList.toggle('sel', !all));
      q('#cl-wselall').textContent = all ? 'Выбрать всё' : 'Снять выделение';
      updSelBtn();
    };
    q('#cl-wsel').onclick = () => { if (shownJob) downloadShown(shownJob.rows.filter(r => selSet.has(r.i)), '_выборка'); };
    q('#cl-wall').onclick = () => { if (shownJob) downloadShown(shownJob.rows, ''); };

    /* Вкладка «Лог Проверки» */
    q('#cl-logs').addEventListener('click', e => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      const job = cfg('jobs').find(j => j.id === b.dataset.id);
      if (!job) return;
      if (b.dataset.act === 'open') showJob(job);
      if (b.dataset.act === 'dl') download(`CustomLogs_${job.kind}_${fileDate(job.created)}.txt`, jobTxt(job, job.done ? 'готово' : 'остановлено'));
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
    q('#cl-delacc').onclick = openDel;
    bindUploader({
      zone: q('#cl-av-zone'), input: q('#cl-av-file'), urlInput: q('#cl-av-url'), urlBtn: q('#cl-av-urlgo'),
      pasteBtn: q('#cl-av-paste'), status: q('#cl-av-msg'), maxMB: MAX_UPLOAD_MB,
      apply: async src => { const a = getAcc(); if (a) saveAcc(a.key, { avatar: src }); renderAuth(); },
    });
    q('#cl-av-reset').onclick = () => {
      const a = getAcc(); if (a) saveAcc(a.key, { avatar: '' });
      renderAuth();
      q('#cl-av-msg').textContent = 'Аватар сброшен';
    };
    bindUploader({
      zone: q('#cl-bn-zone'), input: q('#cl-bn-file'), urlInput: q('#cl-bn-url'), urlBtn: q('#cl-bn-urlgo'),
      pasteBtn: q('#cl-bn-paste'), status: q('#cl-bn-msg'), maxMB: MAX_UPLOAD_MB,
      apply: async src => { const a = getAcc(); if (a) saveAcc(a.key, { banner: src }); renderAuth(); },
    });
    q('#cl-bn-reset').onclick = () => {
      const a = getAcc(); if (a) saveAcc(a.key, { banner: '' });
      renderAuth();
      q('#cl-bn-msg').textContent = 'Баннер сброшен';
    };

    /* Удаление аккаунта */
    const delBox = q('#cl-del');
    delBox.addEventListener('click', e => {
      const b = e.target.closest('button[data-d]');
      if (!b) return;
      const act = b.dataset.d;
      if (act === 'cancel') return delBox.classList.remove('open');
      if (act === 'close') return delBox.classList.remove('open');
      if (act === 'next') { delBox.dataset.step = String(+delBox.dataset.step + 1); return renderDel(); }
      if (act === 'del-no') return performDelete(false);
      if (act === 'del-yes') return performDelete(true);
    });

    /* Для Разработчика: тестовый режим и выдача ролей */
    q('#cl-dev-on').onclick = () => {
      if (!isOwner()) return;
      setCfg('devRole', q('#cl-dev-role').value);
      renderAuth();
      activateTab('home', true);
    };
    const exitTest = () => { setCfg('devRole', ''); renderAuth(); activateTab('home', true); };
    q('#cl-dev-off').onclick = exitTest;
    q('#cl-test-exit').onclick = exitTest;
    q('#cl-dev-give').onclick = giveRole;

    /* Настройки логов */
    qa('.cl-banner-r').forEach(r => r.onchange = () => {
      setCfg('banner', r.value);
      applyBg(); renderBgPreview();
      if (r.value === 'custom' && !cfg('bgUrl')) q('#cl-bg-msg').textContent = 'Сначала вставь свою картинку или gif';
      else q('#cl-bg-msg').textContent = '';
    });
    bindBgInput();
    q('#cl-bg-reset').onclick = () => {
      setCfg('bgUrl', '');
      if (cfg('banner') === 'custom') setCfg('banner', '');
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
    q('#cl-dateb').onchange = e => { setCfg('dateHide', e.target.checked); syncSite(true); };
    qa('input[name="cl-per"]').forEach(r => r.onchange = () => setCfg('perReq', +r.value));
    q('#cl-cd-in').onchange = e => {
      const v = Number(String(e.target.value).replace(',', '.'));
      setCfg('cd', v >= CD_MIN && v <= CD_MAX ? v : CD_DEF);
      e.target.value = cdSec();
    };
    q('#cl-savelogs').onchange = e => setCfg('saveLogs', e.target.checked);
    q('#cl-savefile').onchange = e => setCfg('saveFile', e.target.checked);
    q('#cl-allowdl').onchange = e => {
      setCfg('allowDl', e.target.checked);
      qa('.cl-dl').forEach(b => { b.style.display = e.target.checked ? '' : 'none'; });
      renderLogs();
    };
    qa('input[name="cl-lim"]').forEach(r => r.onchange = () => { setCfg('limit', +r.value); applyLimit(); });
    q('#cl-limon').onchange = e => { setCfg('limitOn', e.target.checked); applyLimit(); };
    q('#cl-reset-logs').onclick = resetLogsSettings;

    /* Настройки скрипта: кастомизация */
    const custSec = q('#t-s-cust');
    custSec.addEventListener('click', e => {
      const c = e.target.closest('.th-c[data-c]');
      if (c) { setThemePart(c.dataset.key, c.dataset.slot, c.dataset.c); renderThemeSecs(); return; }
      const r = e.target.closest('.th-reset');
      if (r) { saveTheme({ [r.dataset.key]: { ...DEF_THEME[r.dataset.key] } }); renderThemeSecs(); }
    });
    custSec.addEventListener('input', e => {
      if (!e.target.classList.contains('th-picker')) return;
      setThemePart(e.target.dataset.key, e.target.dataset.slot, e.target.value);
      e.target.closest('label').style.background = e.target.value;
    });
    custSec.addEventListener('change', e => {
      if (e.target.classList.contains('th-picker')) return renderThemeSecs();
      if (!e.target.classList.contains('th-grad')) return;
      const key = e.target.dataset.key;
      saveTheme({ [key]: { ...getTheme()[key], g: e.target.checked } });
      renderThemeSecs();
    });
    q('#cl-stock').onclick = () => { saveTheme(STOCK_THEME); renderThemeSecs(); };
    q('#cl-size-reset').onclick = () => {
      setCfg('panelSize', null);
      panel.style.width = ''; panel.style.height = '';
      placePanel();
    };

    /* Настройки скрипта: режим (персонажи) */
    qa('input[name="cl-char"]').forEach(r => r.onchange = () => {
      setCfg('char', r.value);
      if (cfg('charTheme')) applyCharTheme(charById(r.value));
      applyChar();
      if (cfg('fx').type === 'makima') renderFx();
      keepBtn();
    });
    q('#cl-chartheme').onchange = e => {
      setCfg('charTheme', e.target.checked);
      if (e.target.checked) applyCharTheme(charById(cfg('char')));
    };
    q('#cl-scale').oninput = e => {
      setCfg('btnScale', +e.target.value / 100);
      q('#cl-scalev').textContent = e.target.value;
      applyChar();
      keepBtn();
    };

    /* Настройки скрипта: анимация */
    qa('input[name="cl-fxt"]').forEach(r => r.onchange = () => { setCfg('fx', { ...cfg('fx'), type: r.value }); renderFx(); });
    q('#cl-fx-color').onchange = e => { setCfg('fx', { ...cfg('fx'), color: e.target.value }); renderFx(); };
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
    q('#cl-fx-size').oninput = e => {
      setCfg('fx', { ...cfg('fx'), size: +e.target.value });
      q('#cl-fx-sizev').textContent = e.target.value;
      renderFx();
    };
    q('#cl-reset-script').onclick = resetScriptSettings;

    /* О скрипте */
    q('#cl-upd-check').onclick = () => checkUpdate(true);
    q('#cl-upd-dl').onclick = () => window.open(UPDATE_URL, '_blank');
    q('#cl-autoupd').onchange = e => setCfg('autoUpd', e.target.checked);
    renderVersions();

    renderHomeStars();
    syncSettingsUI();
    renderFx();
    renderAuth();
  }

  /* Список аккаунтов для выдачи ролей (только для Разработчика) */
  function renderDevUsers() {
    const sel = q('#cl-dev-user');
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = Object.entries(cfg('accounts'))
      .filter(([k]) => k !== OWNER_NICK)
      .map(([k, a]) => `<option value="${esc(k)}">${esc(a.nick)}</option>`).join('');
    if (cur) sel.value = cur;
  }

  /* ---------- Запуск ---------- */
  typeOpts = [...document.querySelectorAll('select[name="type[]"] option')]
    .filter(o => o.value)
    .map(o => ({ value: o.value, label: o.textContent.trim() }));

  const today = dayKey(new Date());
  const prevStreak = cfg('streak') || {};
  const inactive = !!prevStreak.last && dayDiff(prevStreak.last, today) > INACTIVE_DAYS;
  const freshBrowser = browserFresh();   // true только при первом запуске окна браузера
  markBrowser();
  touchStreak();

  applyTheme();
  buildUI();
  applyBg();
  syncSite(true);
  applyLimit();
  refreshUpdate(true);
  setTimeout(showUpdatePopupIfNeeded, 1500);
  migrateAccounts().then(() => {
    touchSeen();
    syncSettingsUI(); renderAuth();
  });

  // Приветствие: один раз при запуске браузера
  if (freshBrowser && working()) {
    const nick = getAcc().nick;
    setTimeout(() => sayOrDefer(() => say(greetText(nick), 'ok', 9000)), 1200);
  }

  // Бездействие: через несколько минут модель засыпает, при активности просыпается
  let lastAct = Date.now();
  const onActivity = () => { lastAct = Date.now(); if (sleeping) wakeUp(); };
  ['pointerdown', 'keydown', 'mousemove', 'wheel'].forEach(ev =>
    document.addEventListener(ev, onActivity, { passive: true }));
  setInterval(() => { if (!sleeping && Date.now() - lastAct >= IDLE_MS) goSleep(); }, 30000);

  scheduleQuote();

  setTimeout(() => checkUpdate(false), 3000);
  setInterval(() => checkUpdate(false), UPD_CHECK_MS);

  let syncTimer;
  new MutationObserver(() => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => syncSite(false), 300);
  }).observe(document.body, { childList: true, subtree: true });
})();
