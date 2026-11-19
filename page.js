// 手账的一页（照 Zinnia 的编辑页）：平时只有一页纸，点了才出工具
(function(){
const INKS = ['#2B2723','#6F685F','#D2463A','#E8913A','#E6C34A','#6E9E6B','#3E8E8A','#3E6FA8','#8C6BB1','#E58C8C','#FFFFFF','#C9A27C'];
const PAPERS = ['#FFFFFF','#F1EFEA','#C9D3C4','#CFC6C8','#D9A86C','#F6EBCB','#DCEBF1','#F7DADB','#E6F3DF','#E4E0F5','#2F3A3A','#3A3550'];
// 笔库：每种笔有自己的画法；笔盒里放哪几支由用户自己挑
const PENS = {
  fine:   {t:'Fineliner',   d:'Even, clean lines',            w:[1.4,2.4,4]},
  ball:   {t:'Ballpoint',   d:'Everyday writing',             w:[1.1,1.7,2.6]},
  calli:  {t:'Calligraphy', d:'Thick and thin with the angle', w:[3,5,8]},
  brush:  {t:'Brush Pen',   d:'Fast is thin, slow is thick',   w:[3,5.5,9]},
  pencil: {t:'Pencil',      d:'Soft, a little grainy',         w:[1.2,2,3.4]},
  crayon: {t:'Crayon',      d:'Waxy and rough',                w:[4,6.5,10]},
  marker: {t:'Marker',      d:'Bold, layers when you overlap', w:[8,13,20]},
  high:   {t:'Highlighter', d:'Flat tip, see-through',         w:[10,16,24]},
  water:  {t:'Watercolor',  d:'Soft edges that bleed',         w:[10,18,28]},
  air:    {t:'Airbrush',    d:'A fine mist of color',          w:[10,18,30]},
  glitter:{t:'Glitter',     d:'Sparkles along the line',       w:[3,5,8]},
  eraser: {t:'Eraser',      d:'Rub out what you drew',         w:[10,18,32]},
};
const PEN_ORDER = ['fine','ball','calli','brush','pencil','crayon','marker','high','water','air','glitter'];
const MAX_CASE = 6;
const FONTS = [
  {k:'hand', t:'Handwriting', f:"Caveat,'WK Hand',cursive", w:600},
  {k:'serif', t:'Serif', f:"Fraunces,'Noto Serif SC',Georgia,serif", w:450},
  {k:'sans', t:'Clean', f:"Inter,'PingFang SC',system-ui,sans-serif", w:450},
  {k:'mono', t:'Typewriter', f:"'Courier New',ui-monospace,monospace", w:500},
];
const STICKER_PACKS = [
  {t:'My Stickers', s:['latte','cat','receipt','plant','trainticket','movieticket','noodles','tote','lamp','icedamericano','postcard','mug','cake','glass']},
];
const PHOTOS = ['rainstreet','latte','cafecorner','sky','croissant','trainwindow','lunch','leaves','movienight','beach'];
const svg = (d, w = 22, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
const I = {
  back: svg('<path d="M15 5l-7 7 7 7"/>', 24),
  sticker: svg('<path d="M20.5 12.5a8.5 8.5 0 1 1-9-9h1.2a7.8 7.8 0 0 0 7.8 7.8z"/><path d="M12.7 3.5c-.4 2.9.3 5.4 2.1 6.9 1.6 1.4 3.6 1.4 5.7.9"/>', 25),
  plus: svg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>', 25),
  undo: svg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>', 24),
  redo: svg('<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>', 24),
  more: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0"/>', 21),
  locked: svg('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 21),
  dup: svg('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8M14 11v6M11 14h6"/>', 21),
  trash: svg('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.5L18 7M9 7V4.5h6V7"/>', 21),
  front: svg('<rect x="8" y="8" width="12" height="12" rx="2" fill="currentColor" fill-opacity=".15"/><path d="M16 5.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h.5"/>', 21),
  flip: svg('<path d="M12 3v18"/><path d="M8 7 3 12l5 5zM16 7l5 5-5 5z"/>', 21),
  photo: svg('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>', 20),
  text: svg('<path d="M5 6V4.5h14V6M12 4.5v15M9 19.5h6"/>', 20),
  pen: svg('<path d="M4 20h4L19 9l-4-4L4 16z"/>', 20),
  page: svg('<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M12 11v6M9 14h6"/>', 20),
  dl: svg('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>', 20),
  pdf: svg('<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/>', 20),
  print: svg('<path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2"/><rect x="7" y="14" width="10" height="6"/>', 20),
  share: svg('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12"/>', 20),
  right: svg('<path d="M9 6l6 6-6 6"/>', 18),
  plus2: svg('<path d="M12 5v14M5 12h14"/>', 20),
  hist: svg('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5M12 8v4l3 2"/>', 20),
  grid: svg('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>', 20),
};
function penSVG(k){
  // 笔杆统一深灰（像真的笔），笔尖或笔身的一截用当前颜色
  const B = 'url(#pbody)', M = 'url(#pmetal)';
  const body = {
    fine:   `<rect x="14" y="30" width="16" height="66" rx="3" fill="${B}"/><path d="M15 30 L19 14 L25 14 L29 30Z" fill="${M}"/><rect x="20.5" y="5" width="3" height="10" rx="1" fill="var(--pc)"/>`,
    ball:   `<rect x="15" y="34" width="14" height="62" rx="3" fill="${B}"/><rect x="26" y="40" width="2" height="30" rx="1" fill="#8E8984"/><path d="M15.5 34 L21 10 L23 10 L28.5 34Z" fill="${M}"/><circle cx="22" cy="9" r="1.6" fill="var(--pc)"/>`,
    calli:  `<rect x="14" y="36" width="16" height="60" rx="3" fill="${B}"/><rect x="14" y="30" width="16" height="7" fill="${M}"/><path d="M15 30 L22 4 L29 30Z" fill="var(--pc)"/><path d="M22 10 L22 24" stroke="#2B2723" stroke-width="1.2"/><circle cx="22" cy="24" r="1.6" fill="#2B2723"/>`,
    brush:  `<rect x="13" y="34" width="18" height="62" rx="4" fill="${B}"/><path d="M14 34 C 15 20, 20 10, 22 2 C 24 10, 29 20, 30 34Z" fill="var(--pc)"/>`,
    pencil: `<rect x="14" y="30" width="16" height="66" fill="${B}"/><path d="M14 30 L22 6 L30 30Z" fill="#E8C9A0"/><path d="M19.4 13.8 L22 6 L24.6 13.8Z" fill="var(--pc)"/><path d="M14 30 L17 27 L20 30 L23 27 L26 30 L30 27" stroke="#D1AE80" stroke-width="1" fill="none"/>`,
    crayon: `<rect x="12" y="34" width="20" height="62" rx="2" fill="var(--pc)"/><rect x="12" y="44" width="20" height="40" fill="#F4EFE6"/><path d="M12 50 h20 M12 78 h20" stroke="var(--pc)" stroke-width="2"/><path d="M13 34 L17 16 Q22 12 27 16 L31 34Z" fill="var(--pc)"/>`,
    marker: `<rect x="11" y="34" width="22" height="62" rx="5" fill="${B}"/><rect x="11" y="34" width="22" height="7" fill="var(--pc)"/><path d="M15 34 L17 14 L27 14 L29 34Z" fill="${M}"/><path d="M18 14 L19 6 L25 6 L26 14Z" fill="var(--pc)"/>`,
    high:   `<rect x="10" y="36" width="24" height="60" rx="5" fill="var(--pc)" opacity=".75"/><rect x="10" y="36" width="24" height="60" rx="5" fill="none" stroke="rgba(0,0,0,.18)"/><path d="M13 36 L15 16 L29 16 L31 36Z" fill="${B}"/><path d="M16 16 L16 6 L28 10 L28 16Z" fill="var(--pc)"/>`,
    water:  `<rect x="18" y="38" width="8" height="58" rx="3" fill="#C7A27A"/><rect x="16" y="28" width="12" height="12" rx="2" fill="${M}"/><path d="M16 28 C 12 18, 18 8, 22 4 C 26 8, 32 18, 28 28Z" fill="var(--pc)"/>`,
    air:    `<rect x="14" y="40" width="16" height="56" rx="4" fill="${B}"/><rect x="24" y="26" width="10" height="9" rx="2" fill="${M}"/><path d="M16 40 L19 16 L25 16 L28 40Z" fill="${M}"/><circle cx="22" cy="10" r="2.2" fill="var(--pc)"/><circle cx="16" cy="6" r="1.2" fill="var(--pc)" opacity=".6"/><circle cx="28" cy="5" r="1" fill="var(--pc)" opacity=".5"/>`,
    glitter:`<rect x="14" y="34" width="16" height="62" rx="3" fill="${B}"/><path d="M15 34 L19 14 L25 14 L29 34Z" fill="${M}"/><rect x="20.5" y="6" width="3" height="9" rx="1" fill="var(--pc)"/><path d="M10 6 l1.4 3 3 1.4 -3 1.4 -1.4 3 -1.4 -3 -3 -1.4 3 -1.4z" fill="var(--pc)"/><path d="M34 14 l1 2 2 1 -2 1 -1 2 -1 -2 -2 -1 2 -1z" fill="var(--pc)"/>`,
    eraser: `<rect x="12" y="30" width="20" height="66" rx="4" fill="#F1EEEA" stroke="rgba(0,0,0,.08)"/><rect x="12" y="12" width="20" height="22" rx="6" fill="#F2A9A1"/><rect x="12" y="28" width="20" height="6" fill="#BDB7B0"/>`,
  }[k];
  return `<svg width="40" height="88" viewBox="0 0 44 96">${body}</svg>`;
}
// 横着放的笔（笔库列表里用）
const penSide = k => `<span class="side">${penSVG(k)}</span>`;

const html = `<div class="root" id="R">
<div class="sb"><span>9:41</span><span class="ic"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/></svg></span></div>
<div class="desk" id="desk"><div class="zoom" id="zoom">
  <div class="paper" id="paper"><canvas id="cv"></canvas><i class="spine"></i><div class="items" id="items"></div><div class="selbox" id="selbox"><i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i><i class="d l"></i><i class="d r"></i><i class="d t"></i><i class="d b"></i></div></div>
</div></div>
<div class="top" id="top">
  <button class="ib press" id="bBack" aria-label="Back to journals">${I.back}</button>
  <div class="mid"><div class="tools"><button class="ib press" id="bStk" aria-label="Stickers">${I.sticker}</button><button class="ib press" id="bAdd" aria-label="Add">${I.plus}</button></div><button class="donepill press" id="bDone">Done</button></div>
  <div class="rt"><button class="ib press" id="bUndo" aria-label="Undo">${I.undo}</button><button class="ib press" id="bRedo" aria-label="Redo">${I.redo}</button><button class="ib press" id="bMore" aria-label="More">${I.more}</button></div>
</div>
<div class="hint" id="hint">tap the page to start</div>
<button class="vchip press" id="vchip" aria-label="View: whole spread"><i class="hl"></i><i class="hr"></i></button>
<div class="ctx" id="ctx"><button data-a="paste">Paste</button><button data-a="type">Type</button><button data-a="draw">Draw</button><button data-a="color">Color</button></div>
<div class="tbar" id="tbar"></div>
<div class="tray" id="tray">
  <div class="pens" id="pens"></div>
  <div class="inks" id="inks">${['#2B2723','#D2463A','#E8913A','#E6C34A','#6E9E6B','#3E8E8A','#3E6FA8','#8C6BB1'].map((c,i)=>`<button class="cl ${i===0?'on':''}" data-c="${c}" style="--c:${c}" aria-label="Color"></button>`).join('')}<button class="cl wheel" id="bWheel" aria-label="More colors"></button></div>
</div>
<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="pbody" x1="0" x2="1"><stop offset="0" stop-color="#6A6662"/><stop offset=".45" stop-color="#3D3A37"/><stop offset="1" stop-color="#57534F"/></linearGradient>
  <linearGradient id="pmetal" x1="0" x2="1"><stop offset="0" stop-color="#D9D6D2"/><stop offset=".5" stop-color="#9E9A95"/><stop offset="1" stop-color="#C9C5C0"/></linearGradient>
</defs></svg>
<div class="pop" id="pop"></div>
<div class="sheetwrap" id="sw"><div class="scrim" id="scrim"></div><div class="sheet" id="sheet"><i class="grab"></i><div class="sbody" id="sbody"></div></div></div>
<div class="home"></div>
</div>`;

const css = `
*{box-sizing:border-box;margin:0;padding:0}
.root{width:390px;height:844px;position:relative;overflow:hidden;background:#E6E0D3;font-family:Inter,'PingFang SC',system-ui,sans-serif;color:#2B2723;-webkit-font-smoothing:antialiased;touch-action:none;-webkit-user-select:none;user-select:none}
.sb{position:absolute;top:0;left:0;right:0;height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font-weight:600;font-size:16px;z-index:30}
.sb .ic{display:flex;gap:6px;align-items:center}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.serif{font-family:Fraunces,'Noto Serif SC',Georgia,serif}
.top{position:absolute;top:52px;left:6px;right:8px;height:46px;display:flex;align-items:center;justify-content:space-between;z-index:20;color:#4A453F}
.mid{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:4px}
.rt{display:flex}
.ib{width:44px;height:44px;display:grid;place-items:center;border-radius:22px;transition:opacity .25s, color .25s}
.ib:disabled{opacity:.28;pointer-events:none}
.desk{position:absolute;inset:0;overflow:hidden;z-index:1}
.zoom{position:absolute;left:0;top:0;width:390px;height:844px;transform-origin:0 0;will-change:transform}
.paper{position:absolute;background-color:var(--paper,#fff);border-radius:6px;box-shadow:0 1px 1px rgba(0,0,0,.04),0 18px 36px -16px rgba(60,45,30,.32);transition:background-color .45s ease;background-size:cover;background-position:center}
.paper.dots{background-image:radial-gradient(rgba(60,50,40,.26) 1px,transparent 1.25px);background-size:12px 12px;background-position:6px 6px}
.paper.grid{background-image:linear-gradient(rgba(60,50,40,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(60,50,40,.12) 1px,transparent 1px);background-size:14px 14px}
.paper.lined{background-image:repeating-linear-gradient(transparent 0 17px,rgba(60,50,40,.18) 17px 18px);background-position:0 20px}
.paper.dark .spine{background:rgba(255,255,255,.12)}
.spine{position:absolute;left:50%;top:3%;bottom:3%;width:1px;margin-left:-.5px;background:rgba(60,50,40,.13);display:none;pointer-events:none;z-index:1}
.paper.spread .spine{display:block}
canvas{position:absolute;inset:0;width:100%;height:100%;border-radius:6px;z-index:2}
.items{position:absolute;inset:0;z-index:3;overflow:hidden;border-radius:6px}
.it{position:absolute;transform-origin:center;touch-action:none}
.it.txt{min-width:20px;padding:2px 4px;line-height:1.15;white-space:pre-wrap;word-break:break-word;outline:none;-webkit-user-select:text;user-select:text;cursor:default}
.it.txt:empty::before{content:"\\200b"}
.it.txt.editing{cursor:text;background:rgba(80,150,230,.06)}
.it.img{filter:drop-shadow(0 4px 5px rgba(50,35,20,.22))}
.it.img img{display:block;width:100%;height:auto;pointer-events:none}
.it.ph{background:#fff;padding:5px 5px 14px;box-shadow:0 5px 12px -6px rgba(0,0,0,.35)}
.it.ph img{display:block;width:100%;aspect-ratio:4/5;object-fit:cover;pointer-events:none}
.selbox{position:absolute;z-index:6;border:1.5px dashed #4AA3F0;border-radius:2px;pointer-events:none;opacity:0;transition:opacity .18s}
.selbox.on{opacity:1}
.selbox .h{position:absolute;width:13px;height:13px;border-radius:50%;background:#fff;border:2px solid #4AA3F0;pointer-events:auto;touch-action:none}
.selbox .d{position:absolute;width:7px;height:7px;border-radius:50%;background:#4AA3F0;pointer-events:auto;touch-action:none}
.selbox .tl{left:-7.5px;top:-7.5px;cursor:nwse-resize}.selbox .tr{right:-7.5px;top:-7.5px;cursor:nesw-resize}.selbox .bl{left:-7.5px;bottom:-7.5px;cursor:nesw-resize}.selbox .br{right:-7.5px;bottom:-7.5px;cursor:nwse-resize}
.selbox .l{left:-4.5px;top:50%;margin-top:-3.5px;cursor:ew-resize}.selbox .r{right:-4.5px;top:50%;margin-top:-3.5px;cursor:ew-resize}.selbox .t{top:-4.5px;left:50%;margin-left:-3.5px}.selbox .b{bottom:-4.5px;left:50%;margin-left:-3.5px}
.selbox.locked{border-color:#A39B90}.selbox.locked .h,.selbox.locked .d{display:none}
.hint{position:absolute;left:0;right:0;text-align:center;font-family:Caveat,'WK Hand',cursive;font-size:22px;color:#9C958B;pointer-events:none;transition:opacity .6s, transform .6s;z-index:2}
.hint.gone{opacity:0;transform:translateY(6px)}
.vchip{position:absolute;right:20px;bottom:34px;width:50px;height:34px;padding:5px;border-radius:9px;background:rgba(255,255,255,.92);box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 4px 12px -4px rgba(0,0,0,.25);display:flex;gap:1.5px;z-index:12;transition:opacity .3s, transform .45s var(--spr)}
.vchip i{flex:1;background:#5E5A55;transition:background-color .35s}
.vchip .hl{border-radius:3px 1px 1px 3px}.vchip .hr{border-radius:1px 3px 3px 1px}
.vchip.left .hr,.vchip.right .hl{background:#E3DED6}
.vchip.single{display:none}
.drawing .vchip,.selected .vchip{opacity:0;transform:translateY(20px);pointer-events:none}
.tools{display:flex;gap:4px;transition:opacity .25s, transform .4s var(--spr)}
.donepill{position:absolute;left:50%;top:2px;height:40px;width:100px;margin-left:-50px;border-radius:20px;background:#D9654B;color:#fff;font-size:17px;font-weight:500;opacity:0;transform:scale(.6);pointer-events:none;box-shadow:0 6px 16px -6px rgba(217,101,75,.6);transition:opacity .25s, transform .45s var(--spr)}
.drawing .tools{opacity:0;transform:scale(.7);pointer-events:none}
.drawing .donepill{opacity:1;transform:none;pointer-events:auto}
/* 点页面弹出的那条小菜单 */
.ctx{position:absolute;z-index:25;display:flex;height:46px;border-radius:23px;background:rgba(255,255,255,.96);box-shadow:0 0 0 .5px rgba(0,0,0,.06),0 10px 30px -8px rgba(40,30,20,.3);opacity:0;pointer-events:none;transform:scale(.6)}
.ctx button{padding:0 16px;font-size:16.5px;font-weight:500;color:#1F1C19;position:relative}
.ctx button+button::before{content:"";position:absolute;left:0;top:13px;bottom:13px;width:1px;background:rgba(0,0,0,.12)}
.ctx button:active{background:rgba(0,0,0,.05)}
.ctx button:first-child{border-radius:23px 0 0 23px;padding-left:20px}.ctx button:last-child{border-radius:0 23px 23px 0;padding-right:20px}
.ctx button.dim{color:#B5AEA3}
/* 选中东西后底部的工具条 */
.tbar{position:absolute;left:50%;bottom:30px;z-index:22;display:flex;align-items:center;height:56px;padding:0 8px;border-radius:28px;background:rgba(250,246,238,.92);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 12px 30px -10px rgba(40,30,20,.35);transform:translate(-50%,140%);opacity:0;pointer-events:none;color:#4A453F}
.tbar button{height:56px;min-width:44px;padding:0 6px;display:grid;place-items:center;font-size:21px}
.tbar .dot{width:28px;height:28px;border-radius:14px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}
.tbar .aa{display:flex;align-items:baseline;justify-content:center;font-family:Fraunces,Georgia,serif;font-size:22px;letter-spacing:-1px}
.tbar .aa small{font-size:15px}
.tbar .num{font-size:21px;font-variant-numeric:tabular-nums;min-width:40px}
.tbar .sep{width:1px;height:26px;background:rgba(0,0,0,.12);margin:0 4px}
.tbar .on{color:#D9654B}
/* 画画时的笔盒（上面一排立着的笔，下面一排颜色） */
.tray{position:absolute;left:10px;right:10px;bottom:22px;height:168px;border-radius:30px;z-index:22;background:rgba(248,245,240,.94);backdrop-filter:blur(24px) saturate(1.7);-webkit-backdrop-filter:blur(24px) saturate(1.7);box-shadow:0 0 0 .5px rgba(0,0,0,.06),0 14px 34px -14px rgba(40,30,20,.35);overflow:clip;transform:translateY(140%);opacity:0;pointer-events:none}
.pens{position:absolute;left:0;right:0;top:0;height:104px;display:flex;justify-content:center;align-items:flex-end;gap:7px;overflow:clip;border-bottom:.5px solid rgba(0,0,0,.1)}
.pen svg,.slot svg{width:36px;height:79px}
.pen{width:36px;height:88px;flex:none;transform:translateY(26px);transition:transform .5s var(--spr), filter .3s, opacity .3s;filter:drop-shadow(0 3px 3px rgba(0,0,0,.14))}
.pen.on{transform:translateY(6px);filter:drop-shadow(0 7px 7px rgba(0,0,0,.2))}
.slot{width:36px;height:88px;flex:none;transform:translateY(26px);color:#9C958B;display:block}
.slot svg{display:block}
.inks{position:absolute;left:0;right:0;bottom:0;height:64px;display:flex;align-items:center;justify-content:center;gap:10px}
.inks .cl{width:28px;height:28px;border-radius:14px;background:var(--c);position:relative;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08);transition:transform .45s var(--spr)}
.inks .cl::after{content:"";position:absolute;inset:-5px;border-radius:50%;box-shadow:0 0 0 2.5px #4AA3F0;opacity:0;transform:scale(.7);transition:opacity .2s, transform .45s var(--spr)}
.inks .cl.on::after{opacity:1;transform:none}
.inks .wheel{background:conic-gradient(#E5484D,#F2A33A,#E6D33A,#6CC24A,#3EA6D8,#5B5BD6,#B04FC8,#E5484D);box-shadow:none}
.inks .wheel::before{content:"";position:absolute;inset:9px;border-radius:50%;background:#fff}
.inks .wheel.on::before{background:var(--c)}
/* 笔库 */
.lib .row{height:64px;gap:12px}
.lib .nm{flex:none;width:118px;display:flex;flex-direction:column;align-items:flex-start;gap:2px}
.lib .nm b{font-weight:500;font-size:16px}.lib .nm small{font-size:11.5px;color:#9C958B;line-height:1.2}
.lib canvas.smp{position:static;width:110px;height:40px;flex:1;border-radius:0}
.lib .side{display:block;width:30px;height:66px;transform:rotate(90deg);flex:none;margin:0 6px}
.lib .side svg{width:30px;height:66px}
.lib .ck{width:26px;height:26px;border-radius:13px;flex:none;box-shadow:inset 0 0 0 1.6px #C9C1B5;display:grid;place-items:center;transition:background-color .25s, box-shadow .25s}
.lib .ck svg{opacity:0;transform:scale(.4);transition:opacity .2s, transform .4s var(--spr)}
.lib .row.in .ck{background:#2B2723;box-shadow:none}.lib .row.in .ck svg{opacity:1;transform:none}
.cnt{padding:2px 20px 0;font-size:13px;color:#8E877D}
.hue{position:relative;height:26px;margin:14px 16px 6px;border-radius:13px;background:linear-gradient(90deg,hsl(0,80%,55%),hsl(45,85%,55%),hsl(90,60%,48%),hsl(150,55%,45%),hsl(200,70%,50%),hsl(250,60%,58%),hsl(300,55%,55%),hsl(360,80%,55%));touch-action:none;cursor:pointer}
.hue i{position:absolute;top:-4px;width:34px;height:34px;margin-left:-17px;border-radius:17px;background:var(--k);box-shadow:0 0 0 3px #fff,0 3px 10px rgba(0,0,0,.25);pointer-events:none}
.shades{display:flex;gap:10px;justify-content:center;padding:8px 16px 16px}
.shades button{width:36px;height:36px;border-radius:18px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
/* 弹出的小面板 */
.pop{position:absolute;z-index:40;border-radius:18px;background:rgba(252,250,247,.94);backdrop-filter:blur(30px) saturate(1.8);-webkit-backdrop-filter:blur(30px) saturate(1.8);box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 20px 50px -14px rgba(40,30,20,.38);opacity:0;pointer-events:none;transform:scale(.5);overflow:hidden}
.pop .sw{display:grid;grid-template-columns:repeat(6,32px);gap:12px;padding:16px}
.pop .sw button{width:32px;height:32px;border-radius:16px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);position:relative;transition:transform .4s var(--spr)}
.pop .sw button.on::after{content:"";position:absolute;inset:-4px;border-radius:50%;box-shadow:0 0 0 2px #D9654B}
.pop .sizes{display:flex;justify-content:space-around;align-items:center;height:52px;border-top:.5px solid rgba(0,0,0,.08)}
.pop .sizes button{width:44px;height:40px;border-radius:12px;display:grid;place-items:center}
.pop .sizes button i{border-radius:50%;background:#A39B90}
.pop .sizes button.on{background:rgba(0,0,0,.06)}.pop .sizes button.on i{background:#2B2723}
.pop .ttl{padding:12px 16px 0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8E877D;font-weight:600}
.pop .list button{display:flex;align-items:center;justify-content:space-between;gap:24px;width:100%;height:46px;padding:0 16px;font-size:16px;text-align:left}
.pop .list button+button{box-shadow:inset 0 .5px 0 rgba(0,0,0,.1)}
.pop .list button:active{background:rgba(0,0,0,.05)}
.pop .list button.on{color:#D9654B}
.pop .step{display:flex;align-items:center;gap:6px;padding:8px}
.pop .step button{width:44px;height:44px;border-radius:12px;font-size:22px;display:grid;place-items:center}
.pop .step button:active{background:rgba(0,0,0,.06)}
.pop .step b{min-width:44px;text-align:center;font-size:20px;font-variant-numeric:tabular-nums}
/* 底部面板 */
.sheetwrap{position:absolute;inset:0;z-index:50;pointer-events:none}
.sheetwrap.on{pointer-events:auto}
.scrim{position:absolute;inset:0;background:rgba(43,39,35,.28);opacity:0}
.sheet{position:absolute;left:0;right:0;bottom:0;max-height:86%;border-radius:28px 28px 0 0;background:#F6F3EE;box-shadow:0 -10px 40px -20px rgba(0,0,0,.3);transform:translateY(105%);display:flex;flex-direction:column}
.grab{display:block;width:38px;height:5px;border-radius:3px;background:#D3CCC1;margin:8px auto 4px;flex:none}
.sbody{overflow-y:auto;padding:0 0 34px;scrollbar-width:none}
.sbody::-webkit-scrollbar{display:none}
.sbody h5{padding:16px 20px 8px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8E877D;font-weight:600}
.sbody h3{padding:6px 20px 4px;font-family:Fraunces,Georgia,serif;font-size:22px;font-weight:500}
.grp{margin:0 14px;border-radius:16px;background:#fff;overflow:hidden}
.row{display:flex;align-items:center;justify-content:space-between;width:100%;height:50px;padding:0 16px;font-size:16.5px;text-align:left;color:#2B2723}
.row+.row{box-shadow:inset 16px .5px 0 -16px rgba(0,0,0,.1),inset 0 .5px 0 rgba(0,0,0,.08)}
.row:active{background:rgba(0,0,0,.04)}
.row svg{color:#6F685F}
.tg{width:50px;height:30px;border-radius:15px;background:#E2DDD5;position:relative;transition:background-color .3s;flex:none}
.tg::after{content:"";position:absolute;left:2px;top:2px;width:26px;height:26px;border-radius:13px;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.18);transition:transform .45s var(--spr)}
.tg.on{background:#6E9E6B}.tg.on::after{transform:translateX(20px)}
.stk{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:8px 16px}
.stk button{aspect-ratio:1;border-radius:14px;background:#fff;display:grid;place-items:center;padding:8px}
.stk img{max-width:100%;max-height:100%;filter:drop-shadow(0 3px 4px rgba(0,0,0,.18));pointer-events:none}
.phs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:8px 16px}
.phs button{aspect-ratio:1;overflow:hidden;border-radius:6px}
.phs img{width:100%;height:100%;object-fit:cover;pointer-events:none}
.strip{display:flex;gap:14px;overflow-x:auto;padding:10px 20px 6px;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}
.strip button{flex:none;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;color:#8E877D}
.strip .th{width:120px;border-radius:5px;background:var(--paper,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.06),0 6px 12px -6px rgba(0,0,0,.3);overflow:hidden;position:relative}
.strip .th img{display:block;width:100%;height:100%}
.strip button.on .th{box-shadow:0 0 0 2.5px #2B2723}
.strip .add .th{display:grid;place-items:center;background:transparent;box-shadow:inset 0 0 0 1.5px #C9C1B5;color:#8E877D}
.home{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#2B2723;z-index:60}
.flip{position:absolute;inset:0;border-radius:6px;transform-origin:left center;backface-visibility:hidden;pointer-events:none;z-index:8;overflow:hidden;box-shadow:0 18px 36px -16px rgba(60,45,30,.4)}
.flip img{width:100%;height:100%;display:block}
.flip.fromR{transform-origin:right center}
`;
window.SCREENS.Page = {title:'C0 一页手账（新）', css, html, own:true};

window.SCREEN_INIT = window.SCREEN_INIT || {};
SCREEN_INIT.Page = (root, api) => {
  const R = root.getElementById('R'), $ = id => root.getElementById(id);
  const SPR = api.spring(.72, .42), SOFT = api.spring(.86, .5);
  R.style.setProperty('--spr', SPR);
  const J = window.CUR_JOURNAL || {title:'My Journal', color:'#FFFFFF', styleKey:'dots', r:9/16, orient:'land', spread:true};
  const r = J.r || 9/16, orient = J.orient || 'land', spread = J.spread !== false;
  J.pages = J.pages || [{strokes:[], items:[], color:J.color || '#FFFFFF'}];
  J.pages.forEach(p => { p.items = p.items || []; p.color = p.color || J.color || '#FFFFFF'; });
  let pi = J.pi !== undefined ? J.pi : 0;

  // —— 纸的大小：横 / 竖 + 尺寸，放在屏幕正中，左右各留 16
  const a = orient === 'land' ? 1/r : r;
  const maxW = 358, maxH = 600, CY = 442;
  let PW = maxW, PH = PW / a; if (PH > maxH){ PH = maxH; PW = PH * a; }
  PW = Math.round(PW); PH = Math.round(PH);
  const PX = Math.round((390 - PW) / 2), PY = Math.round(CY - PH / 2);
  const paper = $('paper'), cv = $('cv'), ctx = cv.getContext('2d'), itemsEl = $('items'), selbox = $('selbox');
  Object.assign(paper.style, {left:PX+'px', top:PY+'px', width:PW+'px', height:PH+'px'});
  if (spread) paper.classList.add('spread');
  if (J.tpl){ paper.style.backgroundImage = `url(img/${J.tpl}.jpg)`; }
  else if (J.styleKey && J.styleKey !== 'blank') paper.classList.add(J.styleKey);
  const hint = $('hint'); hint.style.top = (PY + PH + 18) + 'px';
  const isDark = c => { const m = /#(..)(..)(..)/.exec(c); if (!m) return false; const [x,y,z] = m.slice(1).map(h => parseInt(h,16)); return (x*299 + y*587 + z*114) / 1000 < 90; };
  function applyPaper(){ const c = J.pages[pi].color; paper.style.setProperty('--paper', c); paper.classList.toggle('dark', isDark(c)); }

  // —— 撤销 / 重做：每一步之前存一份这一页
  const undoS = [], redoS = [];
  const snap = () => JSON.stringify(J.pages[pi]);
  function commit(){ undoS.push({pi, s:snap()}); redoS.length = 0; updUR(); }
  function updUR(){ $('bUndo').disabled = !undoS.length; $('bRedo').disabled = !redoS.length; }
  function restore(st){ pi = st.pi; J.pages[pi] = JSON.parse(st.s); render(); }
  $('bUndo').addEventListener('click', () => { const s = undoS.pop(); if (!s) return; redoS.push({pi:s.pi, s:JSON.stringify(J.pages[s.pi])}); restore(s); updUR(); });
  $('bRedo').addEventListener('click', () => { const s = redoS.pop(); if (!s) return; undoS.push({pi:s.pi, s:JSON.stringify(J.pages[s.pi])}); restore(s); updUR(); });

  // —— 画笔
  // 笔盒：默认 5 支，可以从笔库里换；记在这本手账上
  const pcase = J.pens || (J.pens = ['fine','brush','pencil','marker']);
  let tool = pcase[0], ink = INKS[0], zi = 1, dpr = 2, Z = {s:1, x:0, y:0}, view = 'full';
  const width = () => PENS[tool].w[zi];
  const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const base = document.createElement('canvas'), bctx = base.getContext('2d');
  function sizeCanvas(){ const k = (paper.getBoundingClientRect().width / PW) || 1; dpr = Math.min(4, Math.max(1, (window.devicePixelRatio || 1) * k)); cv.width = Math.round(PW*dpr); cv.height = Math.round(PH*dpr); redraw(); }
  function hexA(c, al){ const m = /#(..)(..)(..)/.exec(c); if (!m) return c; return `rgba(${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)},${al})`; }
  function path(c, p){ c.beginPath(); c.moveTo(p[0].x, p[0].y); for (let i = 1; i < p.length - 1; i++) c.quadraticCurveTo(p[i].x, p[i].y, (p[i].x+p[i+1].x)/2, (p[i].y+p[i+1].y)/2); c.lineTo(p[p.length-1].x, p[p.length-1].y); }
  // 每种笔一种画法
  function drawStroke(c, s){
    const p = s.pts; if (!p.length) return; const T = s.tool, col = s.color;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col; c.fillStyle = col;
    if (p.length === 1 && !['air','glitter'].includes(T)){
      c.globalCompositeOperation = T === 'eraser' ? 'destination-out' : 'source-over';
      c.globalAlpha = T === 'marker' || T === 'high' ? .4 : T === 'water' ? .3 : 1;
      c.beginPath(); c.arc(p[0].x, p[0].y, s.w/2, 0, 7); c.fill(); c.restore(); return;
    }
    if (T === 'eraser'){ c.globalCompositeOperation = 'destination-out'; c.lineWidth = s.w; path(c, p); c.stroke(); c.restore(); return; }
    if (T === 'marker'){ c.globalCompositeOperation = 'multiply'; c.globalAlpha = .45; c.lineWidth = s.w; path(c, p); c.stroke(); c.restore(); return; }
    if (T === 'high'){ c.globalCompositeOperation = 'multiply'; c.globalAlpha = .38; c.lineCap = 'butt'; c.lineJoin = 'miter'; c.lineWidth = s.w; path(c, p); c.stroke(); c.restore(); return; }
    if (T === 'water'){
      c.globalCompositeOperation = 'multiply';
      for (let k = 0; k < 3; k++){ c.globalAlpha = .16; c.shadowColor = col; c.shadowBlur = s.w * .6; c.lineWidth = s.w * (1 - k*.22);
        c.save(); c.translate((rnd(k,3)-.5)*s.w*.25, (rnd(k,7)-.5)*s.w*.25); path(c, p); c.stroke(); c.restore(); }
      c.restore(); return;
    }
    if (T === 'air'){
      for (let i = 0; i < p.length; i++){ const n = Math.round(s.w * 1.6);
        for (let j = 0; j < n; j++){ const ang = rnd(i*31+j, 1) * 6.283, rr = Math.sqrt(rnd(i*31+j, 2)) * s.w * .9;
          c.globalAlpha = .05 + rnd(i*31+j, 5) * .12; c.beginPath(); c.arc(p[i].x + Math.cos(ang)*rr, p[i].y + Math.sin(ang)*rr, .6 + rnd(i*31+j,4)*1.1, 0, 7); c.fill(); } }
      c.restore(); return;
    }
    if (T === 'glitter'){
      c.globalAlpha = .55; c.lineWidth = s.w * .6; if (p.length > 1){ path(c, p); c.stroke(); }
      for (let i = 0; i < p.length; i++){ for (let j = 0; j < 3; j++){ const ang = rnd(i*7+j,1)*6.283, rr = rnd(i*7+j,2) * s.w * 1.4;
        const x = p[i].x + Math.cos(ang)*rr, y = p[i].y + Math.sin(ang)*rr, z = .5 + rnd(i*7+j,3) * 1.6;
        c.globalAlpha = .9; c.fillStyle = rnd(i*7+j,6) > .55 ? '#FFFFFF' : col; c.fillRect(x - z/2, y - z/2, z, z);
        if (rnd(i*7+j,9) > .93){ c.fillStyle = '#FFF8D6'; c.beginPath(); c.moveTo(x, y-z*2.4); c.lineTo(x+z*.5, y); c.lineTo(x, y+z*2.4); c.lineTo(x-z*.5, y); c.fill(); } } }
      c.restore(); return;
    }
    if (T === 'crayon'){
      for (let k = 0; k < 6; k++){ c.globalAlpha = .22; c.lineWidth = s.w * .35;
        c.beginPath(); for (let i = 0; i < p.length; i++){ const ox = (rnd(i+k*97,1)-.5) * s.w * .7, oy = (rnd(i+k*97,2)-.5) * s.w * .7; i ? c.lineTo(p[i].x+ox, p[i].y+oy) : c.moveTo(p[i].x+ox, p[i].y+oy); } c.stroke(); }
      c.restore(); return;
    }
    let m0 = p[0];
    for (let i = 1; i < p.length; i++){
      const q = p[i], n = p[i+1] || q, m1 = {x:(q.x+n.x)/2, y:(q.y+n.y)/2};
      let w = s.w; c.globalAlpha = 1;
      if (T === 'brush') w = s.w * q.f;
      if (T === 'fine') w = s.w;
      if (T === 'ball'){ w = s.w * (.9 + .1 * q.f); c.globalAlpha = .82 + .18 * rnd(i, 3); }
      if (T === 'calli'){ const ang = Math.atan2(q.y - m0.y, q.x - m0.x); w = s.w * (.18 + 1.05 * Math.abs(Math.sin(ang - Math.PI/4))); }
      if (T === 'pencil'){ c.globalAlpha = .45 + .4 * rnd(i, 11); }
      c.lineWidth = Math.max(.5, w); c.beginPath(); c.moveTo(m0.x, m0.y); c.quadraticCurveTo(q.x, q.y, m1.x, m1.y); c.stroke(); m0 = m1;
    }
    c.restore();
  }
  function blit(){ ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cv.width,cv.height); ctx.drawImage(base,0,0); ctx.setTransform(dpr,0,0,dpr,0,0); }
  function redraw(){ base.width = cv.width; base.height = cv.height; bctx.setTransform(dpr,0,0,dpr,0,0); J.pages[pi].strokes.forEach(s => drawStroke(bctx, s)); blit(); }

  // —— 页面上的东西（文字、贴纸、照片）
  let sel = null, uid = Date.now();
  function itemHTML(it){
    if (it.type === 'text') return '';
    if (it.type === 'photo') return `<img src="img/p_${it.src}.jpg" alt="">`;
    return `<img src="img/s_${it.src}.webp" alt="">`;
  }
  function place(el, it){
    Object.assign(el.style, {left:it.x+'px', top:it.y+'px', width:it.w+'px', transform:`rotate(${it.rot||0}deg) scaleX(${it.flip ? -1 : 1})`, zIndex:it.z||1});
    if (it.type === 'text'){ const F = FONTS.find(f => f.k === it.font) || FONTS[0]; Object.assign(el.style,{fontFamily:F.f, fontWeight:F.w, fontSize:it.size+'px', color:it.color}); }
  }
  function render(){
    applyPaper(); redraw();
    itemsEl.innerHTML = '';
    J.pages[pi].items.forEach(it => itemsEl.appendChild(mk(it)));
    deselect(true); updPg(); updUR();
  }
  function mk(it){
    const el = document.createElement('div');
    el.className = 'it ' + (it.type === 'text' ? 'txt' : it.type === 'photo' ? 'ph' : 'img');
    el.dataset.id = it.id; el.innerHTML = itemHTML(it);
    if (it.type === 'text') el.textContent = it.text || '';
    place(el, it); return el;
  }
  const elOf = it => itemsEl.querySelector(`[data-id="${it.id}"]`);
  const itemOf = el => J.pages[pi].items.find(i => i.id == el.dataset.id);
  function boxOf(el){ return {x:el.offsetLeft, y:el.offsetTop, w:el.offsetWidth, h:el.offsetHeight}; }
  function updSel(){
    if (!sel){ selbox.classList.remove('on'); return; }
    const el = elOf(sel); if (!el){ selbox.classList.remove('on'); return; }
    const b = boxOf(el), pad = 4;
    Object.assign(selbox.style,{left:(b.x-pad)+'px', top:(b.y-pad)+'px', width:(b.w+pad*2)+'px', height:(b.h+pad*2)+'px', transform:`rotate(${sel.rot||0}deg)`});
    selbox.classList.add('on'); selbox.classList.toggle('locked', !!sel.locked);
  }
  function select(it){
    hideCtx(); closePop();
    sel = it; updSel(); R.classList.add('selected'); showTbar();
  }
  function deselect(quiet){
    if (!sel && quiet) { hideTbar(); return; }
    const el = sel && elOf(sel);
    if (el && el.classList.contains('editing')) finishEdit(el);
    sel = null; updSel(); R.classList.remove('selected'); hideTbar(); closePop();
  }
  function addItem(it, anim){
    commit();
    it.id = ++uid; it.z = Math.max(0, ...J.pages[pi].items.map(i => i.z||0)) + 1;
    J.pages[pi].items.push(it); const el = mk(it); itemsEl.appendChild(el);
    if (anim) el.animate([{transform:`rotate(${it.rot||0}deg) scale(1.35)`, opacity:0, filter:'drop-shadow(0 20px 18px rgba(0,0,0,.25))'},{transform:`rotate(${it.rot||0}deg) scale(1)`, opacity:1}],{duration:560, easing:SPR});
    hint.classList.add('gone');
    return el;
  }

  // —— 文字
  function startEdit(el){
    el.contentEditable = 'true'; el.classList.add('editing'); el.focus();
    const rg = document.createRange(); rg.selectNodeContents(el); rg.collapse(false);
    const s = root.getSelection ? root.getSelection() : document.getSelection(); s.removeAllRanges(); s.addRange(rg);
    el.addEventListener('input', () => { const it = itemOf(el); if (it){ it.text = el.innerText; updSel(); } });
  }
  function finishEdit(el){
    el.contentEditable = 'false'; el.classList.remove('editing');
    const it = itemOf(el); if (!it) return;
    it.text = el.innerText.replace(/\n$/, '');
    if (!it.text.trim()){ J.pages[pi].items = J.pages[pi].items.filter(i => i !== it); el.remove(); }
  }
  function addText(x, y){
    const it = {type:'text', x:Math.max(6, x - 10), y:Math.max(6, y - 16), w:Math.min(PW - x + 10, 170), text:'', size:22, font:'hand', color:ink === '#FFFFFF' ? '#2B2723' : ink};
    const el = addItem(it, false); select(it); startEdit(el);
    el.animate([{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'none'}],{duration:300, easing:'ease-out'});
  }

  // —— 坐标换算（手机外框可能缩放，页面也可能被放大）
  function toPage(e){ const b = paper.getBoundingClientRect(); return {x:(e.clientX - b.left) * PW / b.width, y:(e.clientY - b.top) * PH / b.height, t:e.timeStamp}; }
  function toRoot(e){ const b = R.getBoundingClientRect(); return {x:(e.clientX - b.left) * 390 / b.width, y:(e.clientY - b.top) * 844 / b.height}; }
  const inPaper = p => p.x >= 0 && p.y >= 0 && p.x <= PW && p.y <= PH;

  // —— 点页面弹出的小菜单：Paste / Type / Draw / Color
  const ctxEl = $('ctx'); let ctxAt = null, ctxOpen = false, clip = null;
  function showCtx(rp, pp){
    closePop(); ctxAt = pp; ctxOpen = true;
    ctxEl.querySelector('[data-a="paste"]').classList.toggle('dim', !clip);
    const w = ctxEl.offsetWidth || 290;
    const x = Math.max(12, Math.min(390 - w - 12, rp.x - w / 2)), y = Math.max(108, rp.y - 70);
    Object.assign(ctxEl.style,{left:x+'px', top:y+'px', transformOrigin:`${rp.x - x}px 60px`, pointerEvents:'auto'});
    ctxEl.animate([{opacity:0, transform:'scale(.5) translateY(10px)'},{opacity:1, transform:'none'}],{duration:440, easing:SPR, fill:'forwards'});
  }
  function hideCtx(){ if (!ctxOpen) return; ctxOpen = false; ctxEl.style.pointerEvents = 'none'; ctxEl.animate([{opacity:1, transform:'none'},{opacity:0, transform:'scale(.85)'}],{duration:160, easing:'ease-in', fill:'forwards'}); }
  ctxEl.querySelectorAll('button').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation(); const at = ctxAt; hideCtx();
    const a = b.dataset.a;
    if (a === 'type') addText(at.x, at.y);
    if (a === 'draw') enterDraw();
    if (a === 'color') pagePop(b);
    if (a === 'paste'){
      if (!clip) return api.toast('Copy something first, then paste it here');
      const it = JSON.parse(clip); it.x = at.x - it.w/2; it.y = at.y - 20; const el = addItem(it, true); select(it);
    }
  }));

  // —— 弹出小面板（颜色、字体、字号…）
  const pop = $('pop'); let popOpen = false, popAnchor = null;
  function openPop(anchor, inner, below){
    closePop(true); pop.innerHTML = inner; popOpen = true; popAnchor = anchor;
    pop.style.left = '0px'; pop.style.top = '0px'; pop.style.pointerEvents = 'auto';
    const ar = anchor.getBoundingClientRect(), rb = R.getBoundingClientRect(), k = rb.width / 390;
    const ax = (ar.left - rb.left + ar.width/2) / k, ay = (ar.top - rb.top) / k, ah = ar.height / k;
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    const x = Math.max(12, Math.min(390 - pw - 12, ax - pw/2));
    const y = below ? ay + ah + 10 : Math.max(60, ay - ph - 12);
    Object.assign(pop.style,{left:x+'px', top:y+'px', transformOrigin:`${ax - x}px ${below ? 0 : ph}px`});
    pop.animate([{opacity:0, transform:'scale(.4)'},{opacity:1, transform:'scale(1)'}],{duration:480, easing:SPR, fill:'forwards'});
    [...pop.querySelectorAll('button')].forEach((b,i) => b.animate([{opacity:0},{opacity:1}],{duration:220, delay:40 + Math.min(i,10)*14, fill:'backwards'}));
  }
  function closePop(fast){
    if (!popOpen) return; popOpen = false; pop.style.pointerEvents = 'none';
    pop.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(.8)'}],{duration:fast ? 1 : 170, easing:'ease-in', fill:'forwards'});
  }
  function pagePop(anchor){
    openPop(anchor || $('bMore'), `<div class="ttl">Page color</div><div class="sw">${PAPERS.map(c => `<button style="--c:${c}" data-c="${c}" class="${c === J.pages[pi].color ? 'on':''}"></button>`).join('')}</div>`, !anchor);
    pop.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); commit(); J.pages[pi].color = b.dataset.c; applyPaper(); pop.querySelectorAll('[data-c]').forEach(x => x.classList.toggle('on', x === b)); b.animate([{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:450, easing:SPR}); }));
  }

  // —— 选中后的工具条
  const tbar = $('tbar'); let tbarOn = false;
  function showTbar(){
    if (!sel) return;
    const t = sel.type === 'text';
    tbar.innerHTML = t
      ? `<button data-a="lock" class="${sel.locked?'on':''}" aria-label="Lock">${sel.locked ? I.locked : I.lock}</button><i class="sep"></i><button data-a="color" aria-label="Text color"><i class="dot" style="--c:${sel.color}"></i></button><button data-a="font" class="aa" aria-label="Font">A<small>A</small></button><button data-a="size" class="num" aria-label="Size">${sel.size}</button><i class="sep"></i><button data-a="dup" aria-label="Duplicate">${I.dup}</button><button data-a="del" aria-label="Delete">${I.trash}</button><button data-a="more" aria-label="More">${I.more}</button>`
      : `<button data-a="lock" class="${sel.locked?'on':''}" aria-label="Lock">${sel.locked ? I.locked : I.lock}</button><i class="sep"></i><button data-a="front" aria-label="Bring to front">${I.front}</button><button data-a="flip" aria-label="Flip">${I.flip}</button><i class="sep"></i><button data-a="dup" aria-label="Duplicate">${I.dup}</button><button data-a="del" aria-label="Delete">${I.trash}</button><button data-a="more" aria-label="More">${I.more}</button>`;
    tbar.querySelectorAll('button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); tAct(b.dataset.a, b); }));
    if (!tbarOn){ tbarOn = true; tbar.style.pointerEvents = 'auto'; tbar.animate([{transform:'translate(-50%,140%)', opacity:0},{transform:'translate(-50%,0)', opacity:1}],{duration:520, easing:SPR, fill:'forwards'}); }
  }
  function hideTbar(){ if (!tbarOn) return; tbarOn = false; tbar.style.pointerEvents = 'none'; tbar.animate([{transform:'translate(-50%,0)', opacity:1},{transform:'translate(-50%,140%)', opacity:0}],{duration:300, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'}); }
  function tAct(a, b){
    const it = sel; if (!it) return; const el = elOf(it);
    if (a === 'lock'){ it.locked = !it.locked; updSel(); showTbar(); api.toast(it.locked ? 'Locked in place' : 'Unlocked'); }
    if (a === 'del'){ commit(); J.pages[pi].items = J.pages[pi].items.filter(i => i !== it); deselect(); el.animate([{transform:el.style.transform, opacity:1},{transform:el.style.transform + ' scale(.3)', opacity:0}],{duration:260, easing:'ease-in'}).onfinish = () => el.remove(); }
    if (a === 'dup'){ const c = JSON.parse(JSON.stringify(it)); c.x += 16; c.y += 16; c.locked = false; addItem(c, true); select(J.pages[pi].items[J.pages[pi].items.length-1]); api.haptic(tbar); }
    if (a === 'front'){ commit(); it.z = Math.max(...J.pages[pi].items.map(i => i.z||0)) + 1; place(el, it); api.toast('Brought to front'); }
    if (a === 'flip'){ commit(); it.flip = !it.flip; el.animate([{transform:`rotate(${it.rot||0}deg) scaleX(${it.flip ? 1 : -1})`},{transform:`rotate(${it.rot||0}deg) scaleX(${it.flip ? -1 : 1})`}],{duration:460, easing:SPR}); place(el, it); }
    if (a === 'color'){ openPop(b, `<div class="sw">${INKS.map(c => `<button style="--c:${c}" data-c="${c}" class="${c===it.color?'on':''}"></button>`).join('')}</div>`);
      pop.querySelectorAll('[data-c]').forEach(x => x.addEventListener('click', e => { e.stopPropagation(); commit(); it.color = x.dataset.c; place(el, it); showTbar(); pop.querySelectorAll('[data-c]').forEach(y => y.classList.toggle('on', y === x)); })); }
    if (a === 'font'){ openPop(b, `<div class="list">${FONTS.map(f => `<button data-f="${f.k}" class="${f.k===it.font?'on':''}" style="font-family:${f.f};font-weight:${f.w};font-size:${f.k==='hand'?22:17}px">${f.t}</button>`).join('')}</div>`);
      pop.querySelectorAll('[data-f]').forEach(x => x.addEventListener('click', e => { e.stopPropagation(); commit(); it.font = x.dataset.f; place(el, it); updSel(); pop.querySelectorAll('[data-f]').forEach(y => y.classList.toggle('on', y === x)); })); }
    if (a === 'size'){ openPop(b, `<div class="step"><button data-d="-2">−</button><b id="szv">${it.size}</b><button data-d="2">+</button></div>`);
      pop.querySelectorAll('[data-d]').forEach(x => x.addEventListener('click', e => { e.stopPropagation(); commit(); it.size = Math.max(10, Math.min(80, it.size + +x.dataset.d)); place(el, it); updSel(); pop.querySelector('#szv').textContent = it.size; b.textContent = it.size; })); }
    if (a === 'more'){ openPop(b, `<div class="list"><button data-m="copy"><span>Copy</span>${I.dup}</button><button data-m="back"><span>Send to Back</span>${I.front}</button>${it.type==='text'?`<button data-m="edit"><span>Edit Text</span>${I.text}</button>`:''}<button data-m="rot"><span>Rotate 15°</span>${I.flip}</button></div>`);
      pop.querySelectorAll('[data-m]').forEach(x => x.addEventListener('click', e => { e.stopPropagation(); const m = x.dataset.m; closePop();
        if (m === 'copy'){ clip = JSON.stringify(it); api.toast('Copied · tap the page and choose Paste'); }
        if (m === 'back'){ commit(); it.z = Math.min(...J.pages[pi].items.map(i => i.z||0)) - 1; place(el, it); }
        if (m === 'edit') startEdit(el);
        if (m === 'rot'){ commit(); const from = it.rot||0; it.rot = from + 15; el.animate([{transform:`rotate(${from}deg)`},{transform:`rotate(${it.rot}deg)`}],{duration:420, easing:SPR}); place(el, it); updSel(); }
      })); }
  }

  // —— 画画模式：点 Draw 才出现笔盒；顶上中间换成 Done
  const tray = $('tray'), pensEl = $('pens'); let drawing = false;
  const SLOT = `<svg width="40" height="88" viewBox="0 0 44 96" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4 4"><path d="M14 96 V30 L22 6 L30 30 V96"/></svg>`;
  function renderCase(animIn){
    pensEl.innerHTML = [...pcase, 'eraser'].map(k => `<button class="pen ${k===tool?'on':''}" data-k="${k}" aria-label="${PENS[k].t}">${penSVG(k)}</button>`).join('') + `<button class="slot press" id="bSlot" aria-label="Choose pens">${SLOT}</button>`;
    pensEl.querySelectorAll('.pen').forEach(b => b.addEventListener('click', () => {
      if (tool === b.dataset.k){ sizePop(b); return; }
      tool = b.dataset.k; pensEl.querySelectorAll('.pen').forEach(x => x.classList.toggle('on', x === b)); closePop();
    }));
    $('bSlot').addEventListener('click', penLibrary);
    tint();
    if (animIn) pensEl.querySelectorAll('.pen,.slot').forEach((p,i) => p.animate([{translate:'0 80px'},{translate:'0 0'}],{duration:640, delay:60 + i*45, easing:SPR, fill:'backwards'}));
  }
  function tint(){ pensEl.querySelectorAll('.pen').forEach(b => b.style.setProperty('--pc', ink)); }
  function enterDraw(){
    if (drawing) return; deselect(true); hideCtx(); drawing = true; R.classList.add('drawing'); hint.classList.add('gone');
    tray.style.pointerEvents = 'auto'; renderCase(true);
    tray.animate([{transform:'translateY(140%)', opacity:0},{transform:'none', opacity:1}],{duration:600, easing:SOFT, fill:'forwards'});
  }
  function exitDraw(){
    if (!drawing) return; drawing = false; R.classList.remove('drawing'); closePop();
    tray.style.pointerEvents = 'none';
    tray.animate([{transform:'none', opacity:1},{transform:'translateY(140%)', opacity:0}],{duration:360, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'});
  }
  $('bDone').addEventListener('click', exitDraw);
  // 颜色
  const inks = $('inks');
  function setInk(c, btn){ ink = c; inks.querySelectorAll('.cl').forEach(x => x.classList.toggle('on', x === btn)); if (tool === 'eraser'){ tool = pcase[0]; pensEl.querySelectorAll('.pen').forEach(x => x.classList.toggle('on', x.dataset.k === tool)); } tint(); }
  inks.querySelectorAll('.cl[data-c]').forEach(b => b.addEventListener('click', () => { setInk(b.dataset.c, b); b.animate([{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:450, easing:SPR}); }));
  $('bWheel').addEventListener('click', e => { e.stopPropagation();
    const hsl = (h, l) => `hsl(${h},${l > 70 ? 55 : 68}%,${l}%)`;
    openPop($('bWheel'), `<div class="ttl">Any color</div><div class="hue" id="hue"><i id="hk" style="left:50%;--k:${hsl(180,50)}"></i></div><div class="shades" id="shades"></div>`);
    const hue = pop.querySelector('#hue'), hk = pop.querySelector('#hk'), sh = pop.querySelector('#shades');
    function shades(h){ sh.innerHTML = [28,40,52,66,80].map(l => `<button style="--c:${hsl(h,l)}" data-c="${hsl(h,l)}"></button>`).join(''); sh.querySelectorAll('button').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); const w = $('bWheel'); w.style.setProperty('--c', b.dataset.c); setInk(b.dataset.c, w); b.animate([{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:400, easing:SPR}); })); }
    function at(ev){ const r = hue.getBoundingClientRect(); const t = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)); const h = Math.round(t * 360); hk.style.left = (t*100)+'%'; hk.style.setProperty('--k', hsl(h,50)); shades(h); const w = $('bWheel'); w.style.setProperty('--c', hsl(h,50)); setInk(hsl(h,50), w); }
    hue.addEventListener('pointerdown', ev => { ev.stopPropagation(); hue.setPointerCapture(ev.pointerId); at(ev); });
    hue.addEventListener('pointermove', ev => { if (hue.hasPointerCapture(ev.pointerId)) at(ev); });
    shades(180);
  });
  // 粗细：再点一次选中的笔
  function sizePop(b){
    openPop(b, `<div class="ttl">${PENS[tool].t}</div><div class="sizes">${[0,1,2].map(i => `<button data-z="${i}" class="${i===zi?'on':''}"><i style="width:${5+i*5}px;height:${5+i*5}px"></i></button>`).join('')}</div>`);
    pop.querySelectorAll('[data-z]').forEach(x => x.addEventListener('click', e => { e.stopPropagation(); zi = +x.dataset.z; pop.querySelectorAll('[data-z]').forEach(y => y.classList.toggle('on', y === x)); }));
  }
  // 笔库：点笔盒最后那个虚线笔，挑要放进笔盒的笔，每支都画一笔给你看
  function sample(k, cv2){
    const w = 110, h = 40, d = 2; cv2.width = w*d; cv2.height = h*d; const c = cv2.getContext('2d'); c.scale(d, d);
    const pts = []; for (let i = 0; i <= 40; i++){ const t = i / 40; const prevX = i ? pts[i-1].x : 0; const x = 6 + t * 98; pts.push({x, y:h/2 + Math.sin(t * 6.28 * 1.1) * 10, f:.55 + .6 * Math.abs(Math.cos(t * 6.28)), t:i*16}); }
    drawStroke(c, {tool:k, color:ink === '#FFFFFF' ? '#2B2723' : ink, w:PENS[k].w[1], pts});
  }
  function penLibrary(){
    const ck = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    openSheet(`<h3>Pens</h3><p class="cnt" id="cnt"></p><h5>Pick up to ${MAX_CASE} for your pen case</h5><div class="grp lib">${PEN_ORDER.map(k => `<button class="row ${pcase.includes(k)?'in':''}" data-k="${k}">${penSide(k)}<span class="nm"><b>${PENS[k].t}</b><small>${PENS[k].d}</small></span><canvas class="smp" data-k="${k}"></canvas><i class="ck">${ck}</i></button>`).join('')}</div>`, b => {
      b.querySelectorAll('.side').forEach(x => x.style.setProperty('--pc', ink));
      b.querySelectorAll('canvas.smp').forEach(c => sample(c.dataset.k, c));
      const cnt = () => b.querySelector('#cnt').textContent = `${pcase.length} of ${MAX_CASE} in your case · tap to add or remove`;
      cnt();
      b.querySelectorAll('.row[data-k]').forEach(r => r.addEventListener('click', () => {
        const k = r.dataset.k, i = pcase.indexOf(k);
        if (i >= 0){ if (pcase.length === 1) return api.toast('Keep at least one pen'); pcase.splice(i, 1); if (tool === k) tool = pcase[0]; }
        else { if (pcase.length >= MAX_CASE){ r.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300}); return api.toast(`Your case holds ${MAX_CASE} pens. Remove one first`); } pcase.push(k); tool = k; }
        r.classList.toggle('in', pcase.includes(k)); cnt(); renderCase(false);
        const pe = pensEl.querySelector(`[data-k="${k}"]`); if (pe) pe.animate([{translate:'0 60px'},{translate:'0 0'}],{duration:560, easing:SPR});
      }));
    });
  }

  // —— 缩放 / 平移（两指捏合、触控板、双击）
  const zoomEl = $('zoom');
  function setZ(s, x, y, anim){
    s = Math.max(1, Math.min(4, s));
    if (s === 1){ x = 0; y = 0; }
    else { x = Math.min(0, Math.max(390 - 390*s, x)); y = Math.min(0, Math.max(844 - 844*s, y)); }
    const from = zoomEl.style.transform || 'none';
    Z = {s, x, y}; zoomEl.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    if (anim) zoomEl.animate([{transform:from},{transform:zoomEl.style.transform}],{duration:520, easing:SOFT});
    clearTimeout(setZ.t); setZ.t = setTimeout(sizeCanvas, anim ? 540 : 160);
    updSel();
  }
  function zoomAt(rp, s, anim){ const k = s / Z.s; setZ(s, rp.x - (rp.x - Z.x) * k, rp.y - (rp.y - Z.y) * k, anim); }
  R.addEventListener('wheel', e => {
    e.preventDefault(); const rp = toRoot(e);
    if (e.ctrlKey || e.metaKey) zoomAt(rp, Z.s * Math.exp(-e.deltaY * .01));
    else if (Z.s > 1) setZ(Z.s, Z.x - e.deltaX, Z.y - e.deltaY);
  }, {passive:false});

  // —— 手指 / 鼠标在页面上的所有操作
  const pts = new Map(); let g = null, lastTap = 0;
  const desk = $('desk');
  desk.addEventListener('pointerdown', e => {
    if (e.target.closest('.ctx,.tbar,.tray,.pop,.top')) return;
    desk.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, toRoot(e));
    if (pts.size === 2){ // 两指：捏合缩放
      if (g && g.kind === 'draw' && g.stroke.pts.length < 4){ blit(); }
      const [p1, p2] = [...pts.values()];
      g = {kind:'pinch', d0:Math.hypot(p1.x-p2.x, p1.y-p2.y), c0:{x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2}, z0:{...Z}}; return;
    }
    if (pts.size > 2) return;
    const pp = toPage(e), rp = toRoot(e);
    const hitEl = e.target.closest('.it'), handle = e.target.closest('.selbox .h, .selbox .d');
    if (handle && sel && !sel.locked){ commit(); const el = elOf(sel); g = {kind:'resize', h:handle.className, it:sel, el, p0:pp, w0:sel.w, s0:sel.size, x0:sel.x}; return; }
    if (drawing && inPaper(pp)){
      g = {kind:'draw', stroke:{tool, color:ink, w:width(), pts:[Object.assign(pp,{f:1})]}, last:pp}; return;
    }
    if (hitEl && !drawing){
      const it = itemOf(hitEl);
      if (hitEl.classList.contains('editing')) { g = null; return; }
      g = {kind:'item', it, el:hitEl, p0:pp, x0:it.x, y0:it.y, moved:false, wasSel:sel === it, t0:e.timeStamp}; return;
    }
    g = {kind:'tap', rp0:rp, pp0:pp, t0:e.timeStamp, moved:false};
  });
  desk.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, toRoot(e));
    if (!g) return;
    if (g.kind === 'pinch' && pts.size >= 2){
      const [p1, p2] = [...pts.values()]; const d = Math.hypot(p1.x-p2.x, p1.y-p2.y), c = {x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2};
      const s = Math.max(.8, Math.min(4.5, g.z0.s * d / g.d0)), k = s / g.z0.s;
      const x = c.x - (g.c0.x - g.z0.x) * k, y = c.y - (g.c0.y - g.z0.y) * k;
      Z = {s, x, y}; zoomEl.style.transform = `translate(${x}px,${y}px) scale(${s})`; return;
    }
    if (g.kind === 'draw'){
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of (evs.length ? evs : [e])){
        const p = toPage(ev); const d = Math.hypot(p.x - g.last.x, p.y - g.last.y); if (d < .6 / Z.s) continue;
        const v = d / Math.max(1, p.t - g.last.t);
        p.f = g.last.f * .7 + Math.max(.35, Math.min(1.35, 1.35 - v * .6)) * .3;
        g.stroke.pts.push(p); g.last = p;
      }
      blit(); drawStroke(ctx, g.stroke); return;
    }
    const pp = toPage(e);
    if (g.kind === 'item'){
      const dx = pp.x - g.p0.x, dy = pp.y - g.p0.y;
      if (!g.moved && Math.hypot(dx, dy) > 3){ if (g.it.locked){ g.kind = 'tap'; g.rp0 = toRoot(e); g.pp0 = pp; g.t0 = e.timeStamp; g.moved = true; return; } g.moved = true; commit(); if (sel !== g.it) select(g.it); g.el.style.transition = 'none'; g.el.animate([{scale:'1'},{scale:'1.04'}],{duration:180, fill:'forwards'}); }
      if (g.moved){ g.it.x = g.x0 + dx; g.it.y = g.y0 + dy; place(g.el, g.it); updSel(); }
      return;
    }
    if (g.kind === 'resize'){
      const dx = pp.x - g.p0.x, dy = pp.y - g.p0.y, it = g.it, h = g.h;
      if (/ l| r/.test(' ' + h) && it.type === 'text'){ if (h.includes(' r')) it.w = Math.max(30, g.w0 + dx); else { it.w = Math.max(30, g.w0 - dx); it.x = g.x0 + (g.w0 - it.w); } }
      else { const grow = (h.includes('r') ? dx : -dx); const k = Math.max(.25, (g.w0 + grow) / g.w0);
        if (it.type === 'text'){ it.size = Math.round(Math.max(10, Math.min(90, g.s0 * k))); it.w = g.w0 * k; } else it.w = Math.max(30, g.w0 * k);
        if (h.includes('l')) it.x = g.x0 + (g.w0 - it.w); }
      place(g.el, it); updSel(); if (it.type === 'text') { const n = tbar.querySelector('.num'); if (n) n.textContent = it.size; }
      return;
    }
    if (g.kind === 'tap'){
      const rp = toRoot(e), dx = rp.x - g.rp0.x;
      if (Math.hypot(dx, rp.y - g.rp0.y) > 8) g.moved = true;
      if (Z.s > 1 && g.moved && view === 'full'){ setZ(Z.s, Z.x + (rp.x - (g.lx||g.rp0.x)), Z.y + (rp.y - (g.ly||g.rp0.y))); g.lx = rp.x; g.ly = rp.y; g.pan = true; }
    }
  });
  const up = e => {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (!g) return;
    if (g.kind === 'pinch'){
      if (pts.size === 0){ view = 'full'; vchip.classList.remove('left','right'); if (Z.s < 1.05) setZ(1, 0, 0, true); else setZ(Z.s, Z.x, Z.y, false); g = null; }
      return;
    }
    const kind = g.kind; const G = g; g = null;
    if (kind === 'draw'){ commit(); J.pages[pi].strokes.push(G.stroke); redraw(); updPg(); return; }
    if (kind === 'item'){
      if (G.moved){ G.el.animate([{scale:'1.04'},{scale:'1'}],{duration:420, easing:SPR}); updPg(); return; }
      if (G.wasSel && G.it.type === 'text' && !G.it.locked){ startEdit(G.el); return; }
      select(G.it); G.el.animate([{scale:'1'},{scale:'1.03'},{scale:'1'}],{duration:300}); return;
    }
    if (kind === 'resize'){ updPg(); return; }
    if (kind === 'tap'){
      const rp = toRoot(e), dx = rp.x - G.rp0.x, dt = e.timeStamp - G.t0;
      if (G.pan) return;
      // 左右页视图：横滑在左页和右页之间切；到头了再翻页
      if (view !== 'full' && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(rp.y - G.rp0.y) * 1.4){
        if (view === 'left' && dx < 0) return setView('right');
        if (view === 'right' && dx > 0) return setView('left');
        if (view === 'right' && dx < 0){ next(); return setView('left'); }
        if (view === 'left' && dx > 0 && pi > 0){ prev(); return setView('right'); }
      }
      // 左右滑：翻页
      if (!drawing && Z.s === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(rp.y - G.rp0.y) * 1.4 && dt < 600){ dx < 0 ? next() : prev(); return; }
      if (G.moved) return;
      // 双击：放大 / 还原
      if (e.timeStamp - lastTap < 300 && inPaper(G.pp0)){ lastTap = 0; hideCtx(); if (view !== 'full'){ setView('full'); return; } zoomAt(rp, Z.s > 1.2 ? 1 : 2.4, true); return; }
      lastTap = e.timeStamp;
      if (popOpen){ closePop(); return; }
      if (sel){ deselect(); return; }
      if (ctxOpen){ hideCtx(); return; }
      if (drawing) return;
      if (inPaper(G.pp0)){ setTimeout(() => { if (lastTap === e.timeStamp) showCtx(rp, G.pp0); }, 230); }
    }
  };
  desk.addEventListener('pointerup', up); desk.addEventListener('pointercancel', up);
  R.addEventListener('pointerdown', e => { if (popOpen && !e.target.closest('.pop') && e.target.closest('.top,.tbar,.tray') && !e.target.closest('#bWheel,.pen.on')) closePop(); });

  // —— 翻页
  function updPg(){ J.pi = pi; }
  function pageImage(){ const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height; const x = c.getContext('2d'); x.drawImage(cv,0,0); return c.toDataURL(); }
  function turn(to, dir){
    if (to === pi) return;
    deselect(true); hideCtx();
    const sn = document.createElement('div'); sn.className = 'flip' + (dir < 0 ? ' fromR' : '');
    const cs = getComputedStyle(paper);
    Object.assign(sn.style,{backgroundColor:cs.backgroundColor, backgroundImage:cs.backgroundImage, backgroundSize:cs.backgroundSize, backgroundPosition:cs.backgroundPosition});
    const im = new Image(); im.src = pageImage(); sn.appendChild(im);
    const cl = itemsEl.cloneNode(true); cl.style.position = 'absolute'; cl.style.inset = '0'; sn.appendChild(cl);
    paper.appendChild(sn);
    pi = to; render();
    paper.style.perspective = '1800px';
    sn.animate([{transform:'perspective(1800px) rotateY(0)', filter:'brightness(1)'},{transform:`perspective(1800px) rotateY(${dir > 0 ? -95 : 95}deg)`, filter:'brightness(.8)'}],{duration:640, easing:'cubic-bezier(.45,.05,.3,1)', fill:'forwards'}).onfinish = () => sn.remove();
  }
  function next(){
    if (pi === J.pages.length - 1){ J.pages.push({strokes:[], items:[], color:J.pages[pi].color}); api.toast(`Page ${J.pages.length} · a fresh page`); }
    turn(pi + 1, 1);
  }
  function prev(){ if (pi > 0) turn(pi - 1, -1); else { paper.animate([{transform:'translateX(0)'},{transform:'translateX(14px)'},{transform:'translateX(0)'}],{duration:380, easing:SPR}); } }

  // —— 底部面板
  const sw = $('sw'), sheet = $('sheet'), scrim = $('scrim'), sbody = $('sbody'); let sheetOn = false;
  function openSheet(inner, wire){
    deselect(true); hideCtx(); closePop(true);
    sbody.innerHTML = inner; sbody.scrollTop = 0; sheetOn = true; sw.classList.add('on');
    sheet.animate([{transform:'translateY(105%)'},{transform:'none'}],{duration:620, easing:SOFT, fill:'forwards'});
    scrim.animate([{opacity:0},{opacity:1}],{duration:300, fill:'forwards'});
    wire && wire(sbody);
  }
  function closeSheet(){
    if (!sheetOn) return; sheetOn = false; sw.classList.remove('on');
    const cur = getComputedStyle(sheet).transform;
    sheet.animate([{transform:cur === 'none' ? 'none' : cur},{transform:'translateY(105%)'}],{duration:420, easing:'cubic-bezier(.3,.7,.2,1)', fill:'forwards'});
    scrim.animate([{opacity:1},{opacity:0}],{duration:300, fill:'forwards'});
  }
  scrim.addEventListener('click', closeSheet);
  // 往下拖关掉面板
  let sd = null;
  root.querySelector('.grab').parentElement.addEventListener('pointerdown', e => { if (sbody.scrollTop > 0 && !e.target.classList.contains('grab')) return; sd = {y:e.clientY, k:R.getBoundingClientRect().height / 844}; });
  sheet.addEventListener('pointermove', e => { if (!sd) return; const dy = Math.max(0, (e.clientY - sd.y) / sd.k); if (dy > 4){ sheet.getAnimations().forEach(a => a.cancel()); sheet.style.transform = `translateY(${dy}px)`; } });
  const sEnd = e => { if (!sd) return; const dy = (e.clientY - sd.y) / sd.k; sd = null; if (dy > 110){ closeSheet(); sheet.style.transform = ''; } else if (dy > 4){ const cur = sheet.style.transform; sheet.style.transform = ''; sheet.animate([{transform:cur},{transform:'none'}],{duration:480, easing:SOFT, fill:'forwards'}); } };
  sheet.addEventListener('pointerup', sEnd); sheet.addEventListener('pointercancel', sEnd);

  // —— 顶栏
  $('bBack').addEventListener('click', () => { deselect(true); exitDraw(); view = 'full'; setZ(1,0,0,false); api.back(); });
  $('bStk').addEventListener('click', () => openSheet(`<h3>Stickers</h3>${STICKER_PACKS.map(p => `<h5>${p.t}</h5><div class="stk">${p.s.map(s => `<button data-s="${s}" class="press"><img src="img/s_${s}.webp" alt=""></button>`).join('')}</div>`).join('')}`, b => {
    b.querySelectorAll('[data-s]').forEach(x => x.addEventListener('click', () => { closeSheet(); setTimeout(() => { const w = 96; const it = {type:'sticker', src:x.dataset.s, x:PW/2 - w/2 + (Math.random()*40-20), y:PH/2 - w/2 + (Math.random()*30-15), w, rot:Math.round(Math.random()*16-8)}; addItem(it, true); select(it); }, 220); }));
  }));
  function photoSheet(){ openSheet(`<h3>Photos</h3><h5>Recents</h5><div class="phs">${PHOTOS.map(p => `<button data-p="${p}" class="press"><img src="img/p_${p}.jpg" alt=""></button>`).join('')}</div>`, b => {
    b.querySelectorAll('[data-p]').forEach(x => x.addEventListener('click', () => { closeSheet(); setTimeout(() => { const w = Math.min(120, PW*.36); const it = {type:'photo', src:x.dataset.p, x:PW/2 - w/2, y:Math.max(8, PH/2 - w*.7), w, rot:Math.round(Math.random()*10-5)}; addItem(it, true); select(it); }, 220); }));
  }); }
  $('bAdd').addEventListener('click', e => { e.stopPropagation();
    openPop($('bAdd'), `<div class="list"><button data-x="photo"><span>Photo</span>${I.photo}</button><button data-x="sticker"><span>Sticker</span>${I.sticker}</button><button data-x="text"><span>Text</span>${I.text}</button><button data-x="draw"><span>Draw</span>${I.pen}</button><button data-x="page"><span>New Page</span>${I.page}</button></div>`, true);
    pop.querySelectorAll('[data-x]').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); closePop(); const x = b.dataset.x;
      if (x === 'photo') photoSheet();
      if (x === 'sticker') $('bStk').click();
      if (x === 'text') addText(PW/2 - 60, PH/2 - 10);
      if (x === 'draw') enterDraw();
      if (x === 'page'){ J.pages.push({strokes:[], items:[], color:J.pages[pi].color}); turn(J.pages.length - 1, 1); }
    }));
  });
  const settings = J.settings || (J.settings = {snap:true, big:false});
  $('bMore').addEventListener('click', () => openSheet(`
    <h5>Export Page</h5><div class="grp">
      <button class="row" data-r="photos"><span>Export to Photos</span>${I.dl}</button>
      <button class="row" data-r="pdf"><span>Export PDF</span>${I.pdf}</button>
      <button class="row" data-r="print"><span>Print</span>${I.print}</button>
      <button class="row" data-r="share"><span>Share</span>${I.share}</button></div>
    <h5>Page Options</h5><div class="grp">
      <button class="row" data-r="color"><span>Page Color</span>${I.right}</button>
      <button class="row" data-r="new"><span>New Page</span>${I.plus2}</button>
      <button class="row" data-r="dup"><span>Duplicate Page</span>${I.dup}</button>
      <button class="row" data-r="pages"><span>All Pages</span>${I.grid}</button>
      <button class="row" data-r="clear"><span>Clear Page</span>${I.trash}</button>
      <button class="row" data-r="hist"><span>Restore Page Version</span>${I.hist}</button></div>
    <h5>Editor Settings</h5><div class="grp">
      <button class="row" data-r="snap"><span>Snap to Guides</span><i class="tg ${settings.snap?'on':''}"></i></button>
      <button class="row" data-r="big"><span>Larger Toolbar</span><i class="tg ${settings.big?'on':''}"></i></button></div>`, b => {
    b.querySelectorAll('[data-r]').forEach(x => x.addEventListener('click', () => { const k = x.dataset.r;
      if (k === 'snap' || k === 'big'){ settings[k] = !settings[k]; x.querySelector('.tg').classList.toggle('on', settings[k]); if (k === 'big'){ tbar.style.scale = settings.big ? '1.15' : ''; } return; }
      closeSheet();
      if (k === 'photos') api.toast('Saved to Photos');
      if (k === 'pdf') api.toast('Exported as PDF');
      if (k === 'print') api.toast('Opening print options…');
      if (k === 'share') api.toast('Share sheet opens here');
      if (k === 'color') setTimeout(() => pagePop(null), 300);
      if (k === 'new') setTimeout(() => { J.pages.push({strokes:[], items:[], color:J.pages[pi].color}); turn(J.pages.length - 1, 1); }, 300);
      if (k === 'dup') setTimeout(() => { J.pages.splice(pi + 1, 0, JSON.parse(JSON.stringify(J.pages[pi]))); turn(pi + 1, 1); api.toast('Page duplicated'); }, 300);
      if (k === 'pages') setTimeout(pagesSheet, 380);
      if (k === 'clear'){ commit(); J.pages[pi].strokes = []; J.pages[pi].items = []; render(); api.toast('Page cleared · Undo to bring it back'); }
      if (k === 'hist') api.toast('Versions from the last 30 days appear here');
    }));
  }));
  function pagesSheet(){
    const th = (p, i) => `<button data-i="${i}" class="press ${i===pi?'on':''}"><div class="th" style="--paper:${p.color};aspect-ratio:${PW}/${PH}">${i === pi ? `<img src="${pageImage()}">` : ''}</div>Page ${i+1}</button>`;
    openSheet(`<h3>${J.title}</h3><h5>${J.pages.length} page${J.pages.length>1?'s':''}</h5><div class="strip">${J.pages.map(th).join('')}<button class="add press" data-add="1"><div class="th" style="aspect-ratio:${PW}/${PH}">${I.plus2}</div>New Page</button></div>`, b => {
      b.querySelectorAll('[data-i]').forEach(x => x.addEventListener('click', () => { closeSheet(); const i = +x.dataset.i; setTimeout(() => turn(i, i > pi ? 1 : -1), 260); }));
      b.querySelector('[data-add]').addEventListener('click', () => { closeSheet(); setTimeout(() => { J.pages.push({strokes:[], items:[], color:J.pages[pi].color}); turn(J.pages.length - 1, 1); }, 260); });
    });
  }
  const vchip = $('vchip');
  if (!spread) vchip.classList.add('single');
  function setView(v){
    view = v; vchip.classList.toggle('left', v === 'left'); vchip.classList.toggle('right', v === 'right');
    vchip.setAttribute('aria-label', 'View: ' + (v === 'full' ? 'whole spread' : v + ' page'));
    if (v === 'full'){ setZ(1, 0, 0, true); return; }
    const s = Math.min(370 / (PW/2), 640 / PH);
    const cx = PX + (v === 'left' ? PW/4 : PW*3/4);
    setZ(s, 195 - cx * s, CY - CY * s, true);
  }
  vchip.addEventListener('click', () => { setView(view === 'full' ? 'left' : view === 'left' ? 'right' : 'full'); });
  // 按住小方块：看全部页面
  let vt = null; vchip.addEventListener('pointerdown', () => { vt = setTimeout(() => { vt = 'fired'; pagesSheet(); }, 500); });
  vchip.addEventListener('pointerup', () => { if (vt !== 'fired') clearTimeout(vt); });
  vchip.addEventListener('click', e => { if (vt === 'fired'){ e.stopImmediatePropagation(); vt = null; } }, true);

  // —— 开始
  render();
  if (J.pages.some(p => p.strokes.length || p.items.length)) hint.classList.add('gone');
  requestAnimationFrame(sizeCanvas);
  window.addEventListener('resize', sizeCanvas);
  // 第一次打开新本子：提示「点页面开始」，几秒后自己淡掉
  setTimeout(() => hint.classList.add('gone'), 6000);
};
})();
