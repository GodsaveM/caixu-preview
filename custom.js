// 新做的几屏：手账首页（照 Zinnia 的排版）、个人主页、使用指南阅读器
(function(){
const SB = `<div class="sb"><span>9:41</span><span class="ic">
<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>
<svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.1 1.1a5 5 0 0 0-7 0zM1.2 4.6a9.6 9.6 0 0 1 13.6 0l-1.1 1.1a8 8 0 0 0-11.4 0z" fill="currentColor"/></svg>
<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor"/><rect x="25" y="4.5" width="1.5" height="4" rx=".7" fill="currentColor" opacity=".4"/></svg></span></div>`;
const BASE = `
*{box-sizing:border-box;margin:0;padding:0}
.root{width:390px;height:844px;position:relative;overflow:hidden;background:#ECE8E0;font-family:Inter,'PingFang SC',system-ui,sans-serif;color:#2B2723;-webkit-font-smoothing:antialiased}
.sb{position:absolute;top:0;left:0;right:0;height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 34px;font-weight:600;font-size:16px;z-index:30;color:#2B2723}
.sb .ic{display:flex;gap:6px;align-items:center}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.scroll{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;overscroll-behavior:contain}
.scroll::-webkit-scrollbar{display:none}
.serif{font-family:Fraunces,'Noto Serif SC',Georgia,serif;font-variation-settings:"opsz" 72}
.home{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#2B2723;z-index:40}
`;
const BOOK_SVG = (w,h) => `<svg class="nbsvg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <path d="M6 1.5 H${w-22} Q${w-1.5} 1.5 ${w-1.5} 22 V${h-22} Q${w-1.5} ${h-1.5} ${w-22} ${h-1.5} H6 Q1.5 ${h-1.5} 1.5 ${h-6} V6 Q1.5 1.5 6 1.5Z" stroke="#9C958B" stroke-width="2" stroke-dasharray="7 6" stroke-linecap="round"/>
  <path d="M15 4 V${h-4}" stroke="#9C958B" stroke-width="2" stroke-dasharray="7 6" stroke-linecap="round"/>
</svg>`;
const I = {
  plus:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>',
  list:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.5" cy="6.5" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1.2" fill="currentColor"/></svg>',
  grid:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
  more:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>',
  chev:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  right:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  check:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  close:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};
const MI = { // 菜单图标
  gear:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  cal:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  sort:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/></svg>',
  help:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>',
  open:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10 5 7.5 4.5 4 4.5v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-14c-3.5 0-6 .5-8 2zM12 6.5v14"/></svg>',
  pen:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
  img:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
  share:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12"/></svg>',
  trash:'<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.5A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.5L18 7M9 7V4.5h6V7"/></svg>',
};

// —————————————————— 手账首页 ——————————————————
const JOURNALS = [
  {id:'guide', title:'Quick Start Guide', img:'img/cover_guide.jpg', pages:'8 pages', go:'Guide'},
  {id:'every', title:'Everyday', img:'img/c_daily.jpg', pages:'24 pages', go:'Editor'},
  {id:'travel', title:'Travel Log', img:'img/c_traveldiary.jpg', pages:'9 pages', go:'Editor'},
  {id:'food', title:'Food Diary', img:'img/c_food.jpg', pages:'15 pages', go:'Editor'},
  {id:'album', title:'Photo Album', img:'img/c_album.jpg', pages:'6 pages', go:'Editor'},
];
const RECENT = [
  {pair:['img/g_rain.jpg','img/g_cafe.jpg'], go:'Editor', label:'Everyday · Nov 8–9'},
  {img:'img/tut_basics.jpg', go:'Guide', label:'Quick Start Guide'},
  {img:'img/tut_add.jpg', go:'Guide', label:'Quick Start Guide'},
  {pair:['img/g_movie.jpg','img/g_leaf.jpg'], go:'Editor', label:'Everyday · Nov 3–6'},
];
const TPL = [
  {img:'img/tpl_week.jpg', t:'This Week'}, {img:'img/tpl_food.jpg', t:'What I Ate'},
  {img:'img/tpl_trip.jpg', t:'Trip Planner'}, {img:'img/tpl_little.jpg', t:'Three Little Things'},
];
const homeHTML = `<div class="root">
${SB}
<div class="scroll" id="sc">
  <div class="pad-top"></div>
  <h2 class="serif sec">Recent Pages</h2>
  <div class="recent">${RECENT.map((r,i)=>`<button class="spread press" data-i="${i}" aria-label="${r.label}">${r.pair?`<img src="${r.pair[0]}" alt=""><img src="${r.pair[1]}" alt="">`:`<img class="full" src="${r.img}" alt="">`}<i class="gut"></i></button>`).join('')}</div>
  <h2 class="serif sec">My Journals</h2>
  <div class="books" id="books">
    <button class="book new press" aria-label="New Journal">${BOOK_SVG(161,240)}<span class="nl serif">New Journal</span><span class="np">${I.plus}</span></button>
    ${JOURNALS.map((j,i)=>`<div class="bk" data-i="${i}"><button class="book cov press" data-i="${i}" aria-label="${j.title}"><img src="${j.img}" alt=""><i class="spine"></i><i class="sel">${I.check}</i></button><button class="dots press" data-i="${i}" aria-label="More for ${j.title}">${I.more}</button><b class="serif bt">${j.title}</b></div>`).join('')}
  </div>
  <div class="listv" id="listv">${JOURNALS.map((j,i)=>`<button class="row press" data-i="${i}"><img src="${j.img}" alt=""><span><b>${j.title}</b><small>${j.pages}</small></span><em>${I.right}</em></button>`).join('')}</div>
  <button class="tplbar press" id="tplbar"><span class="serif">Templates For You</span><em id="chev">${I.chev}</em></button>
  <div class="tplwrap" id="tplwrap"><div class="tpls">${TPL.map((t,i)=>`<div class="tw"><button class="tpl press" data-i="${i}"><img src="${t.img}" alt=""><i class="gut"></i></button><b class="tl">${t.t}</b></div>`).join('')}</div></div>
  <div style="height:140px"></div>
</div>
<div class="bar" id="bar">
  <div class="bt-in">
    <button class="ib press" id="bNew" aria-label="New journal">${I.plus}</button>
    <button class="ib press" id="bView" aria-label="List view">${I.list}</button>
    <button class="tx press" id="bSel">Select</button>
    <button class="ib press" id="bMore" aria-label="More">${I.more}<i class="dot"></i></button>
  </div>
</div>
<div class="scrim" id="scrim"></div>
<div class="menu" id="menu"></div>
<div class="home"></div>
</div>`;
const homeCSS = BASE + `
.root{background:#ECE8E0}
.pad-top{height:104px}
.bar{position:absolute;left:0;right:0;top:0;height:100px;z-index:20;transition:background-color .35s ease, box-shadow .35s ease, backdrop-filter .35s}
.bar.solid{background:rgba(236,232,224,.72);backdrop-filter:blur(20px) saturate(1.6);-webkit-backdrop-filter:blur(20px) saturate(1.6);box-shadow:0 .5px 0 rgba(0,0,0,.12)}
.bt-in{position:absolute;right:14px;top:52px;display:flex;align-items:center;gap:2px;color:#2B2723}
.ib{width:42px;height:42px;display:grid;place-items:center;border-radius:21px;position:relative}
.tx{height:42px;padding:0 10px;font-size:19px;font-weight:400;letter-spacing:.1px}
.dot{position:absolute;right:7px;top:7px;width:9px;height:9px;border-radius:5px;background:#E5484D;border:1.5px solid #ECE8E0}
.sec{font-size:31px;font-weight:450;color:#57514A;letter-spacing:-.3px;padding:0 24px;margin:6px 0 14px}
.recent{display:flex;gap:16px;overflow-x:auto;padding:4px 24px 26px;scroll-snap-type:x mandatory;scroll-padding:0 24px;scrollbar-width:none}
.recent::-webkit-scrollbar{display:none}
.spread{flex:none;width:286px;height:166px;border-radius:12px;overflow:hidden;position:relative;display:flex;background:#FFFDF8;scroll-snap-align:start;box-shadow:0 1px 1px rgba(0,0,0,.05),0 10px 22px -10px rgba(50,38,25,.32)}
.spread img{width:50%;height:100%;object-fit:cover;display:block}
.spread img.full{width:100%}
.gut{position:absolute;left:50%;top:0;bottom:0;width:30px;margin-left:-15px;background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.08) 50%,rgba(0,0,0,0));pointer-events:none}
.books{display:grid;grid-template-columns:161px 161px;gap:28px 20px;padding:2px 24px 30px;transition:opacity .35s ease, transform .45s cubic-bezier(.2,.8,.2,1)}
.book{width:161px;height:240px;border-radius:5px 20px 20px 5px;position:relative;display:block;overflow:hidden}
.book.new{overflow:visible;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#7E776E}
.nbsvg{position:absolute;inset:0}
.nl{font-size:17px;font-weight:400;color:#7E776E}
.np svg{width:26px;height:26px}
.cov{box-shadow:0 1px 1px rgba(0,0,0,.06),0 14px 26px -12px rgba(50,38,25,.45);background:#ddd}
.cov img{width:100%;height:100%;object-fit:cover;display:block}
.spine{position:absolute;left:0;top:0;bottom:0;width:18px;background:linear-gradient(90deg,rgba(0,0,0,.16),rgba(0,0,0,.06) 45%,rgba(0,0,0,0));pointer-events:none}
.bk{position:relative}
.dots{position:absolute;right:10px;top:200px;width:28px;height:28px;border-radius:14px;background:rgba(255,255,255,.88);display:grid;place-items:center;color:#6F685F;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.dots svg{width:16px;height:16px}
.bt{display:block;font-size:17px;font-weight:450;color:#3B3631;margin-top:11px;letter-spacing:-.1px}
.sel{position:absolute;right:10px;bottom:10px;width:26px;height:26px;border-radius:13px;border:2px solid #fff;background:rgba(0,0,0,.18);display:grid;place-items:center;opacity:0;transform:scale(.4);transition:opacity .25s, transform .4s cubic-bezier(.3,1.5,.5,1), background-color .2s}
.sel svg{opacity:0;transition:opacity .15s}
.selecting .sel{opacity:1;transform:none}
.selecting .dots{opacity:0;pointer-events:none}
.dots{transition:opacity .25s}
.bk.on .sel{background:#2B2723}
.bk.on .sel svg{opacity:1}
.bk.on .cov{outline:3px solid #2B2723;outline-offset:3px}
.selecting .new{opacity:.35;pointer-events:none}
.new{transition:opacity .3s}
.listv{display:none;padding:0 20px 24px;flex-direction:column;gap:10px}
.row{display:flex;align-items:center;gap:14px;padding:10px;border-radius:16px;background:rgba(255,255,255,.5);text-align:left}
.row img{width:44px;height:64px;border-radius:3px 9px 9px 3px;object-fit:cover;box-shadow:0 4px 10px -4px rgba(0,0,0,.35)}
.row span{flex:1;display:flex;flex-direction:column;gap:3px}
.row b{font-family:Fraunces,Georgia,serif;font-weight:450;font-size:18px}
.row small{font-size:13px;color:#7E776E}
.row em{color:#B0A89C}
.isList .books{display:none}.isList .listv{display:flex}
.tplbar{margin:0 22px;width:346px;height:62px;border-radius:16px;background:#DAD6CE;display:flex;align-items:center;justify-content:space-between;padding:0 22px 0 24px}
.tplbar span{font-size:26px;font-weight:450;color:#4E4943}
.tplbar em{color:#7E776E;transition:transform .5s cubic-bezier(.2,.9,.25,1)}
.tplbar.closed em{transform:rotate(-90deg)}
.tplwrap{overflow:hidden;transition:height .55s cubic-bezier(.2,.9,.25,1), opacity .4s ease}
.tpls{display:flex;gap:16px;overflow-x:auto;padding:20px 24px 8px;scroll-snap-type:x mandatory;scroll-padding:0 24px;scrollbar-width:none}
.tpls::-webkit-scrollbar{display:none}
.tpl{display:block;width:286px;height:166px;border-radius:12px;overflow:hidden;position:relative;box-shadow:0 1px 1px rgba(0,0,0,.05),0 10px 22px -10px rgba(50,38,25,.3)}
.tpl img{width:100%;height:100%;object-fit:cover;display:block}
.tw{flex:none;scroll-snap-align:start}
.tl{display:block;font-size:14px;font-weight:500;color:#57514A;margin-top:10px;padding-left:2px}
/* 菜单（苹果式下拉菜单） */
.scrim{position:absolute;inset:0;z-index:50;pointer-events:none;background:rgba(40,32,24,0);transition:background-color .35s ease, backdrop-filter .35s}
.scrim.on{pointer-events:auto}
.scrim.dim{background:rgba(40,32,24,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.menu{position:absolute;z-index:60;width:250px;border-radius:14px;background:rgba(250,248,244,.86);backdrop-filter:blur(30px) saturate(1.8);-webkit-backdrop-filter:blur(30px) saturate(1.8);box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 18px 50px -10px rgba(40,30,20,.35);overflow:hidden;opacity:0;transform:scale(.3);pointer-events:none}
.menu button{display:flex;width:100%;align-items:center;justify-content:space-between;padding:0 16px;height:46px;font-size:16.5px;text-align:left;color:#211E1B}
.menu button+button{box-shadow:inset 0 .5px 0 rgba(0,0,0,.1)}
.menu button.gap{box-shadow:inset 0 7px 0 rgba(0,0,0,.05);height:53px;padding-top:7px}
.menu button.red{color:#D9362B}
.menu button:active,.menu button.hl{background:rgba(0,0,0,.06)}
.menu svg{opacity:.85}
.lift{position:absolute;z-index:55;border-radius:5px 20px 20px 5px;overflow:hidden;box-shadow:0 30px 60px -16px rgba(30,20,10,.5);pointer-events:none}
.lift img{width:100%;height:100%;object-fit:cover;display:block}
`;

// —————————————————— 个人主页 ——————————————————
const days = Array.from({length:30},(_,i)=>i+1), has = new Set([1,2,3,6,8,9]);
const profileHTML = `<div class="root">
${SB}
<div class="scroll">
  <div style="height:58px"></div>
  <div class="top"><h1 class="serif">Profile</h1><button class="edit press">Edit</button></div>
  <div class="me">
    <div class="av"><img src="img/p_palette.jpg" alt=""></div>
    <div><b class="serif">June Lin</b><small>Journaling since Sep 2</small></div>
  </div>
  <div class="stats">
    <div><b>5</b><small>journals</small></div><div><b>57</b><small>pages</small></div>
    <div><b>31</b><small>stickers</small></div><div><b>6</b><small>day streak</small></div>
  </div>
  <div class="card month press" id="month">
    <div class="mh"><b class="serif">November</b><span>6 pages so far ${I.right}</span></div>
    <div class="cal">${['S','M','T','W','T','F','S'].map(d=>`<i class="w">${d}</i>`).join('')}${'<i></i>'.repeat(6)}${days.map(d=>`<i class="${has.has(d)?'has':''} ${d===10?'today':''}">${d}</i>`).join('')}</div>
  </div>
  <div class="group">
    <button class="it press" data-go="LookBack">${MI.cal}<span>Look Back</span><em>${I.right}</em></button>
    <button class="it press" data-go="MyStickers">${MI.img}<span>My Stickers</span><small>18</small><em>${I.right}</em></button>
    <button class="it press" data-go="Together">${MI.open}<span>Books with Friends</span><small>3</small><em>${I.right}</em></button>
  </div>
  <div class="group">
    <button class="it press" data-toast="iCloud backup is off. Your pages stay on this iPhone.">${MI.share}<span>Backup &amp; Sync</span><small>Off</small><em>${I.right}</em></button>
    <button class="it press" data-toast="Export all journals as PDF or images">${MI.share}<span>Export Everything</span><em>${I.right}</em></button>
  </div>
  <div class="group">
    <button class="it press" data-go="Settings">${MI.gear}<span>Settings</span><em>${I.right}</em></button>
    <button class="it press" data-toast="Send us a note">${MI.help}<span>Help &amp; Feedback</span><em>${I.right}</em></button>
  </div>
  <p class="foot">Caixu 1.0 · your pages live on this iPhone</p>
  <div style="height:130px"></div>
</div>
<div class="home"></div>
</div>`;
const profileCSS = BASE + `
.top{display:flex;align-items:flex-end;justify-content:space-between;padding:0 24px}
h1{font-size:36px;font-weight:450;color:#3B3631;letter-spacing:-.4px}
.edit{font-size:17px;color:#6F685F;padding:6px 2px}
.me{display:flex;align-items:center;gap:16px;padding:22px 24px 18px}
.av{width:72px;height:72px;border-radius:36px;overflow:hidden;box-shadow:0 0 0 3px #fff,0 8px 18px -8px rgba(0,0,0,.35)}
.av img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.me b{display:block;font-size:23px;font-weight:500}
.me small{font-size:14px;color:#7E776E}
.stats{display:grid;grid-template-columns:repeat(4,1fr);margin:0 20px;padding:14px 4px;border-radius:18px;background:rgba(255,255,255,.55)}
.stats div{text-align:center}
.stats b{display:block;font-family:Fraunces,Georgia,serif;font-size:24px;font-weight:500;font-variant-numeric:tabular-nums}
.stats small{font-size:12px;color:#7E776E}
.card{display:block;width:350px;margin:14px 20px 0;padding:16px;border-radius:18px;background:rgba(255,255,255,.55);text-align:left}
.mh{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.mh b{font-size:19px;font-weight:500}
.mh span{font-size:13px;color:#7E776E;display:flex;align-items:center;gap:4px}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:6px 0;font-size:12.5px;text-align:center;font-style:normal}
.cal i{font-style:normal;height:28px;line-height:28px;width:28px;margin:0 auto;border-radius:14px;color:#57514A;font-variant-numeric:tabular-nums}
.cal i.w{color:#A39B90;font-size:11px}
.cal i.has{background:#2B2723;color:#FAF8F4}
.cal i.today{box-shadow:inset 0 0 0 1.5px #C9472F;color:#C9472F}
.group{margin:14px 20px 0;border-radius:18px;background:rgba(255,255,255,.55);overflow:hidden}
.it{display:flex;align-items:center;gap:12px;width:100%;height:52px;padding:0 14px 0 16px;text-align:left;font-size:16px}
.it+.it{box-shadow:inset 52px .5px 0 -52px rgba(0,0,0,.1), inset 0 .5px 0 rgba(0,0,0,.08)}
.it span{flex:1}.it small{font-size:15px;color:#8E877D}.it em{color:#B6AEA2;display:flex}
.it svg:first-child{color:#57514A}
.foot{text-align:center;font-size:12px;color:#A39B90;margin-top:22px}
`;

// —————————————————— 使用指南阅读器 ——————————————————
const GUIDE = ['tut_basics','tut_add','tut_draw','tut_together'];
const guideHTML = `<div class="root">
${SB}
<div class="top"><button class="x press" aria-label="Close guide">${I.close}</button><b class="serif">Quick Start Guide</b><span class="pn" id="pn">1 / 8</span></div>
<div class="pages" id="pages">${GUIDE.flatMap(g=>[`<div class="pg"><div class="sheet l" style="background-image:url(img/${g}.jpg)"></div></div>`,`<div class="pg"><div class="sheet r" style="background-image:url(img/${g}.jpg)"></div></div>`]).join('')}</div>
<div class="dotsrow" id="dr">${'<i></i>'.repeat(8)}</div>
<p class="hint">Swipe to turn the page · swipe down to close</p>
<div class="home"></div>
</div>`;
const guideCSS = BASE + `
.root{background:#E6E1D8}
.top{position:absolute;top:50px;left:0;right:0;height:52px;display:flex;align-items:center;justify-content:center;z-index:5}
.top b{font-size:18px;font-weight:500}
.x{position:absolute;left:16px;top:6px;width:40px;height:40px;border-radius:20px;background:rgba(255,255,255,.7);display:grid;place-items:center}
.pn{position:absolute;right:20px;font-size:13px;color:#7E776E;font-variant-numeric:tabular-nums}
.pages{position:absolute;top:118px;left:0;right:0;height:600px;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.pages::-webkit-scrollbar{display:none}
.pg{flex:none;width:390px;height:600px;display:grid;place-items:center;scroll-snap-align:center;perspective:1200px}
.sheet{width:340px;height:393px;border-radius:6px;background-size:200% 100%;box-shadow:0 1px 1px rgba(0,0,0,.06),0 24px 40px -18px rgba(40,30,20,.45);transform-origin:center;will-change:transform}
.sheet.l{background-position:0 0;border-radius:10px 4px 4px 10px}
.sheet.r{background-position:100% 0;border-radius:4px 10px 10px 4px}
.dotsrow{position:absolute;top:732px;left:0;right:0;display:flex;justify-content:center;gap:7px}
.dotsrow i{width:6px;height:6px;border-radius:3px;background:#C8C0B4;transition:width .35s cubic-bezier(.2,.9,.25,1), background-color .3s}
.dotsrow i.on{width:18px;background:#2B2723}
.hint{position:absolute;top:756px;left:0;right:0;text-align:center;font-size:13px;color:#8E877D}
`;

Object.assign(window.SCREENS, {
  Home:{title:'B1 手账首页（新）', css:homeCSS, html:homeHTML},
  Guide:{title:'B4 使用指南（新）', css:guideCSS, html:guideHTML},
  Profile:{title:'H1 个人主页（新）', css:profileCSS, html:profileHTML},
});

// —————————————————— 交互 ——————————————————
window.SCREEN_INIT = window.SCREEN_INIT || {};
SCREEN_INIT.Home = (root, api) => {
  const R = root.querySelector('.root'), sc = root.getElementById('sc'), bar = root.getElementById('bar');
  sc.addEventListener('scroll', () => bar.classList.toggle('solid', sc.scrollTop > 8), {passive:true});
  const tap = (el, fn) => el.addEventListener('click', e => { e.stopPropagation(); fn(e); });
  // 最近页面：从卡片放大进编辑页
  root.querySelectorAll('.spread').forEach(b => tap(b, () => { if (R.classList.contains('selecting')) return; const r = RECENT[b.dataset.i]; api.zoomOpen(b, r.go, {radius:12}); }));
  // 新建
  tap(root.querySelector('.book.new'), () => api.go('NewJournal'));
  tap(root.getElementById('bNew'), () => api.go('NewJournal'));
  // 本子封面：打开（放大）/ 选择
  root.querySelectorAll('.cov').forEach(b => {
    const j = JOURNALS[b.dataset.i];
    tap(b, () => {
      if (R.classList.contains('selecting')){ b.parentElement.classList.toggle('on'); api.haptic(b); updSel(); return; }
      api.openBook(b, j.go, {pageSel: j.go === 'Guide' ? '.sheet' : '.paper'});
    });
    longPress(b, () => { if (!R.classList.contains('selecting')) ctx(b, j); });
  });
  root.querySelectorAll('.dots').forEach(b => tap(b, () => ctx(root.querySelector(`.cov[data-i="${b.dataset.i}"]`), JOURNALS[b.dataset.i])));
  root.querySelectorAll('.row').forEach(b => tap(b, () => { const j = JOURNALS[b.dataset.i]; api.openBook(b.querySelector('img'), j.go, {pageSel: j.go === 'Guide' ? '.sheet' : '.paper'}); }));
  // 选择模式
  const bSel = root.getElementById('bSel');
  function updSel(){ const n = root.querySelectorAll('.bk.on').length; bSel.textContent = R.classList.contains('selecting') ? (n ? `Done (${n})` : 'Done') : 'Select'; }
  tap(bSel, () => {
    const on = R.classList.toggle('selecting');
    if (!on) root.querySelectorAll('.bk.on').forEach(x => x.classList.remove('on'));
    updSel(); api.tabbar(!on);
    if (on) api.toast('Tap journals to select them');
  });
  // 网格 / 列表
  const bView = root.getElementById('bView');
  tap(bView, () => {
    const box = sc;
    box.animate([{opacity:1},{opacity:0}],{duration:160,easing:'ease-in'}).onfinish = () => {
      const isList = R.classList.toggle('isList');
      bView.innerHTML = isList ? I.grid : I.list;
      box.animate([{opacity:0, transform:'translateY(8px)'},{opacity:1, transform:'none'}],{duration:380,easing:'cubic-bezier(.2,.9,.25,1)'});
    };
  });
  // 模板折叠
  const tb = root.getElementById('tplbar'), tw = root.getElementById('tplwrap');
  tap(tb, () => {
    const closed = tb.classList.toggle('closed');
    const h = tw.scrollHeight;
    if (closed){ tw.style.height = h+'px'; requestAnimationFrame(() => { tw.style.height = '0px'; tw.style.opacity = '0'; }); }
    else { tw.style.height = h+'px'; tw.style.opacity = '1'; setTimeout(() => tw.style.height = '', 560); }
  });
  root.querySelectorAll('.tpl').forEach(b => tap(b, () => api.zoomOpen(b, 'Editor', {radius:12, toast:`Added “${TPL[b.dataset.i].t}” to Everyday`})));
  // 右上角 … 菜单
  const menu = root.getElementById('menu'), scrim = root.getElementById('scrim');
  let lift = null, menuOpen = false;
  function openMenu(items, anchor, origin, dim){
    menu.innerHTML = items.map((it,i)=>`<button class="${it.cls||''}" data-k="${i}"><span>${it.t}</span>${it.i||''}</button>`).join('');
    Object.assign(menu.style, anchor);
    menu.style.transformOrigin = origin;
    scrim.classList.add('on'); if (dim) scrim.classList.add('dim');
    menu.style.pointerEvents = 'auto';
    menu.animate([{opacity:0, transform:'scale(.25)'},{opacity:1, transform:'scale(1)'}],{duration:520, easing:api.spring(.78,.42), fill:'forwards'});
    menu.querySelectorAll('button').forEach((b,i) => {
      b.animate([{opacity:0, transform:'translateY(-6px)'},{opacity:1, transform:'none'}],{duration:300, delay:60+i*22, easing:'ease-out', fill:'backwards'});
      b.addEventListener('click', e => { e.stopPropagation(); b.classList.add('hl'); setTimeout(() => { closeMenu(); items[i].fn && items[i].fn(); }, 120); });
    });
    menuOpen = true;
  }
  function closeMenu(){
    if (!menuOpen) return; menuOpen = false;
    menu.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(.6)'}],{duration:220, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'});
    menu.style.pointerEvents = 'none'; scrim.classList.remove('on','dim');
    if (!R.classList.contains('selecting')) api.showTabbar();
    if (lift){ const l = lift, src = l._src; lift = null;
      const r = src.getBoundingClientRect(), pr = R.getBoundingClientRect(), k = pr.width/390;
      l.animate([{transform:l.style.transform},{transform:'none', left:((r.left-pr.left)/k)+'px', top:((r.top-pr.top)/k)+'px'}],{duration:420, easing:api.spring(.85,.4), fill:'forwards'}).onfinish = () => { src.style.visibility=''; l.remove(); };
      l.style.boxShadow = '0 14px 26px -12px rgba(50,38,25,.45)';
    }
  }
  tap(scrim, closeMenu);
  tap(root.getElementById('bMore'), () => openMenu([
    {t:'Look Back', i:MI.cal, fn:()=>api.go('LookBack')},
    {t:'Sort By: Last Edited', i:MI.sort, fn:()=>api.toast('Sorted by last edited')},
    {t:'Settings', i:MI.gear, cls:'gap', fn:()=>api.go('Settings')},
    {t:'Help & Feedback', i:MI.help, fn:()=>api.toast('Send us a note')},
  ], {right:'16px', top:'96px'}, 'top right', false));
  // 长按封面：封面浮起 + 菜单（像 iOS 的上下文菜单）
  function ctx(cov, j){
    const r = cov.getBoundingClientRect(), pr = R.getBoundingClientRect(), k = pr.width/390;
    const x = (r.left-pr.left)/k, y = (r.top-pr.top)/k;
    lift = document.createElement('div'); lift.className = 'lift'; lift._src = cov;
    lift.innerHTML = `<img src="${cov.querySelector('img').src}">`;
    Object.assign(lift.style,{left:x+'px', top:y+'px', width:'161px', height:'240px'});
    R.appendChild(lift); cov.style.visibility = 'hidden';
    const ty = Math.min(0, 300 - y);  // 太靠下就往上挪，给菜单留位置
    api.hideTabbar();
    lift.animate([{transform:'none'},{transform:`translateY(${ty}px) scale(1.06)`}],{duration:520, easing:api.spring(.72,.45), fill:'forwards'});
    lift.style.transform = `translateY(${ty}px) scale(1.06)`;
    const mx = x < 150 ? {left:x+'px'} : {left:(x+161-250)+'px'};
    openMenu([
      {t:'Open', i:MI.open, fn:()=>{ setTimeout(() => api.openBook(cov, j.go, {pageSel: j.go === 'Guide' ? '.sheet' : '.paper'}), 380); }},
      {t:'Rename', i:MI.pen, fn:()=>api.toast(`Rename “${j.title}”`)},
      {t:'Change Cover', i:MI.img, fn:()=>api.go('Studio','tab')},
      {t:'Export PDF', i:MI.share, fn:()=>api.toast(`Exporting “${j.title}” as PDF`)},
      {t:'Delete Journal', i:MI.trash, cls:'red gap', fn:()=>api.toast('Moved to Recently Deleted · 30 days to undo')},
    ], Object.assign(mx,{top:(y+ty+262)+'px'}), x < 150 ? 'top left' : 'top right', true);
    api.haptic(lift);
  }
  function longPress(el, fn){
    let t = null, sx = 0, sy = 0, fired = false;
    el.addEventListener('pointerdown', e => { fired = false; sx = e.clientX; sy = e.clientY; t = setTimeout(() => { fired = true; fn(); }, 480); });
    const stop = () => clearTimeout(t);
    el.addEventListener('pointermove', e => { if (Math.hypot(e.clientX-sx, e.clientY-sy) > 8) stop(); });
    el.addEventListener('pointerup', stop); el.addEventListener('pointercancel', stop); el.addEventListener('pointerleave', stop);
    el.addEventListener('click', e => { if (fired){ e.stopImmediatePropagation(); fired = false; } }, true);
    el.addEventListener('contextmenu', e => e.preventDefault());
  }
};
SCREEN_INIT.Profile = (root, api) => {
  root.querySelectorAll('.it').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.toast) api.toast(b.dataset.toast);
    else if (b.dataset.go === 'Together') api.go('Together','tab');
    else if (b.dataset.go) api.go(b.dataset.go);
  }));
  root.getElementById('month').addEventListener('click', () => api.go('LookBack'));
  root.querySelector('.edit').addEventListener('click', () => api.toast('Change your name and photo'));
};
SCREEN_INIT.Guide = (root, api) => {
  const pages = root.getElementById('pages'), pn = root.getElementById('pn'), dots = [...root.getElementById('dr').children];
  const sheets = [...root.querySelectorAll('.sheet')];
  const upd = () => {
    const x = pages.scrollLeft / 390, i = Math.round(x);
    pn.textContent = `${i+1} / 8`; dots.forEach((d,k) => d.classList.toggle('on', k === i));
    sheets.forEach((s,k) => { const d = k - x; s.style.transform = `rotateY(${Math.max(-1,Math.min(1,d))*-14}deg) scale(${1-Math.min(1,Math.abs(d))*.06})`; });
  };
  pages.addEventListener('scroll', () => requestAnimationFrame(upd), {passive:true}); upd();
  root.querySelector('.x').addEventListener('click', () => api.back());
  // 往下拖关掉
  let sy = null, el = root.host;
  pages.addEventListener('pointerdown', e => { sy = e.clientY; });
  root.querySelector('.root').addEventListener('pointermove', e => { if (sy == null) return; const dy = Math.max(0, e.clientY - sy); if (dy > 6) { el.style.transform = `translateY(${dy*.6}px) scale(${1-dy/2400})`; el.style.borderRadius = '40px'; } });
  const end = e => { if (sy == null) return; const dy = e.clientY - sy; sy = null;
    if (dy > 140) api.back(); else { el.animate([{transform:el.style.transform},{transform:'none'}],{duration:450,easing:api.spring(.8,.4)}); el.style.transform=''; } };
  root.querySelector('.root').addEventListener('pointerup', end); root.querySelector('.root').addEventListener('pointercancel', end);
};
})();
