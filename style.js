// 新建手账：选页面样式（照 Zinnia 的结构）+ 建好后回到首页、新本子「长」出来
(function(){
const SIZES = [
  {k:'iphone', t:'iPhone (9:16)', r:9/16},
  {k:'a5', t:'A5 (148 × 210 mm)', r:148/210},
  {k:'b6', t:'B6 (128 × 182 mm)', r:128/182},
  {k:'letter', t:'Letter (8.5 × 11 in)', r:8.5/11},
  {k:'trav', t:'Traveler’s (110 × 210 mm)', r:110/210},
  {k:'square', t:'Square (1:1)', r:1},
];
const COLORS = ['#FFFFFF','#F1EFEA','#C9D3C4','#CFC6C8','#D9A86C','#F6EBCB','#DCEBF1','#F7DADB','#E6F3DF','#E4E0F5'];
const STYLES = [{k:'blank',t:'Blank'},{k:'dots',t:'Dot Grid'},{k:'grid',t:'Grid'},{k:'lined',t:'Lined'}];
const TPLS = [{k:'tpl_week',t:'This Week'},{k:'tpl_food',t:'What I Ate'},{k:'tpl_trip',t:'Trip Planner'},{k:'tpl_little',t:'Three Little Things'}];
const ACC = '#D9654B';
const I = {
  back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  close:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  right:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  land:'<svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M2 3h13l5 5v7H2z"/><path d="M15 3v5h5"/></svg>',
  port:'<svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M2 2h8l4 4v12H2z"/><path d="M10 2v4h4"/></svg>',
  check:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  bigcheck:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path class="ck" d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>',
};
const html = `<div class="root">
<div class="sb"><span>9:41</span><span></span></div>
<div class="scrim"></div>
<div class="sheet" id="sheet">
  <i class="grab"></i>
  <div class="hd">
    <button class="circ press" id="bBack" aria-label="Back">${I.back}</button>
    <b class="serif">Choose a Page Style</b>
    <button class="circ press" id="bClose" aria-label="Close">${I.close}</button>
  </div>
  <div class="body" id="body">
    <button class="size press" id="bSize"><span id="sizeLab">iPhone (9:16)</span><em>${I.right}</em></button>
    <div class="seg" id="seg">
      <button class="sg on press" data-o="land">${I.land}<span>Landscape</span></button>
      <button class="sg press" data-o="port">${I.port}<span>Portrait</span></button>
    </div>
    <div class="row"><span>Spread</span><button class="sw on" id="swSpread" role="switch" aria-checked="true" aria-label="Spread"><i></i></button></div>
    <div class="row" id="snapRow"><span>Snap to Grid</span><button class="sw" id="swSnap" role="switch" aria-checked="false" aria-label="Snap to Grid"><i></i></button></div>
    <div class="cols" id="cols">${COLORS.map((c,i)=>`<button class="cl ${i===0?'on':''}" data-c="${c}" style="--c:${c}" aria-label="Paper color ${c}"></button>`).join('')}<button class="cl custom" id="bCustom" aria-label="Custom color"><i></i><i></i><i></i></button></div>
    <div class="hue" id="hue"><div class="huebar" id="huebar"><i id="knob"></i></div></div>
    <div class="grid" id="grid">${STYLES.map((s,i)=>`<button class="st ${i===1?'on':''}" data-s="${s.k}"><div class="pv"><div class="paper" data-s="${s.k}"><i class="spine"></i></div></div><span>${s.t}</span></button>`).join('')}</div>
    <h4>Templates</h4>
    <div class="tgrid" id="tgrid">${TPLS.map(t=>`<button class="st tp" data-t="${t.k}"><div class="pv"><div class="paper tpl" style="background-image:url(img/${t.k}.jpg)"></div></div><span>${t.t}</span></button>`).join('')}</div>
    <div style="height:120px"></div>
  </div>
  <div class="fade"></div>
  <button class="begin press" id="bBegin"><span>Begin New Journal</span>${I.bigcheck}</button>
</div>
<div class="pick" id="pick">${SIZES.map((s,i)=>`<button data-k="${s.k}"><span>${s.t}</span><em>${i===0?I.check:''}</em></button>`).join('')}</div>
</div>`;
const css = `
*{box-sizing:border-box;margin:0;padding:0}
.root{width:390px;height:844px;position:relative;overflow:hidden;background:transparent;font-family:Inter,'PingFang SC',system-ui,sans-serif;color:#2B2723;-webkit-font-smoothing:antialiased}
.sb{position:absolute;top:0;left:0;right:0;height:50px;z-index:3;display:flex;align-items:center;padding:0 34px;font-weight:600;font-size:16px;color:transparent}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
.serif{font-family:Fraunces,'Noto Serif SC',Georgia,serif}
.scrim{position:absolute;inset:0;background:rgba(43,39,35,.3)}
.sheet{position:absolute;left:0;right:0;bottom:0;top:54px;background:#F7F5F1;border-radius:30px 30px 0 0;overflow:hidden;box-shadow:0 -10px 40px -20px rgba(0,0,0,.3)}
.grab{position:absolute;left:50%;top:7px;width:38px;height:5px;margin-left:-19px;border-radius:3px;background:#D3CCC1}
.hd{position:absolute;top:18px;left:0;right:0;height:46px;display:flex;align-items:center;justify-content:center;z-index:2}
.hd b{font-size:21px;font-weight:500;letter-spacing:-.2px}
.circ{position:absolute;top:2px;width:42px;height:42px;border-radius:21px;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 2px 6px rgba(0,0,0,.06)}
#bBack{left:16px}#bClose{right:16px}
.body{position:absolute;top:76px;left:0;right:0;bottom:0;overflow-y:auto;padding:4px 20px 0;scrollbar-width:none}
.body::-webkit-scrollbar{display:none}
.size{width:100%;height:50px;border-radius:12px;background:#fff;box-shadow:0 0 0 1px #E6E0D6;display:flex;align-items:center;justify-content:space-between;padding:0 14px 0 16px;font-size:17px}
.size em{color:#2B2723;display:flex;transition:transform .45s}
.size.open em{transform:rotate(90deg)}
.seg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.sg{height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:9px;font-size:16.5px;color:#B3ABA0;box-shadow:inset 0 0 0 1.5px #DDD6CC;background:#fff;transition:color .3s, box-shadow .3s}
.sg.on{color:${ACC};box-shadow:inset 0 0 0 2px ${ACC};background:#FFF8F5}
.row{display:flex;align-items:center;justify-content:space-between;height:62px;box-shadow:0 -1px 0 #E6E0D6;margin-top:14px;font-size:20px;color:#3B3631;transition:color .3s}
.row+.row{margin-top:0}
.row.dis{color:#C4BDB2}
.sw{width:52px;height:32px;border-radius:16px;background:#E2DDD5;position:relative;transition:background-color .3s}
.sw i{position:absolute;left:2px;top:2px;width:28px;height:28px;border-radius:14px;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.18),0 0 0 .5px rgba(0,0,0,.04);transition:transform .5s var(--spr), width .2s}
.sw.on{background:${ACC}}
.sw.on i{transform:translateX(20px)}
.sw:active i{width:33px}.sw.on:active i{transform:translateX(15px)}
.row.dis .sw{opacity:.5;pointer-events:none}
.cols{display:flex;flex-wrap:wrap;justify-content:center;gap:14px 20px;padding:16px 10px 6px;box-shadow:0 -1px 0 #E6E0D6}
.cl{width:30px;height:30px;border-radius:15px;background:var(--c);box-shadow:inset 0 0 0 1px rgba(0,0,0,.1);position:relative;transition:transform .4s var(--spr)}
.cl::after{content:"";position:absolute;inset:-5px;border-radius:50%;box-shadow:0 0 0 2px ${ACC};opacity:0;transform:scale(.7);transition:opacity .25s, transform .45s var(--spr)}
.cl.on::after{opacity:1;transform:none}
.custom{background:none;box-shadow:none}
.custom i{position:absolute;width:17px;height:17px;border-radius:9px}
.custom i:nth-child(1){left:7px;top:2px;background:#56B45E}.custom i:nth-child(2){left:1px;top:12px;background:#D33A3A}.custom i:nth-child(3){left:12px;top:12px;background:#3C6FC4;mix-blend-mode:multiply}
.hue{height:0;overflow:hidden;opacity:0;transition:height .5s var(--spr), opacity .3s}
.hue.open{height:54px;opacity:1}
.huebar{position:relative;margin:16px 6px 0;height:24px;border-radius:12px;background:linear-gradient(90deg,hsl(0,70%,88%),hsl(40,70%,86%),hsl(80,60%,86%),hsl(140,50%,86%),hsl(190,60%,88%),hsl(230,60%,90%),hsl(280,50%,90%),hsl(330,60%,90%),hsl(360,70%,88%));box-shadow:inset 0 0 0 1px rgba(0,0,0,.06);touch-action:none;cursor:pointer}
#knob{position:absolute;top:-4px;left:50%;width:32px;height:32px;margin-left:-16px;border-radius:16px;background:var(--k,#fff);box-shadow:0 0 0 3px #fff,0 3px 10px rgba(0,0,0,.25)}
.grid,.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px 16px;margin-top:18px}
.st{display:flex;flex-direction:column;align-items:flex-start;gap:9px;text-align:left;font-size:16px;color:#8E877D}
.pv{width:100%;height:118px;display:flex;align-items:center;justify-content:center;border-radius:12px;transition:background-color .3s}
.paper{--w:150px;--h:104px;width:var(--w);height:var(--h);border-radius:5px;position:relative;background-color:var(--paper,#fff);box-shadow:0 0 0 1px rgba(0,0,0,.06),0 6px 14px -6px rgba(40,30,20,.3);transition:width .55s var(--spr), height .55s var(--spr), background-color .35s, box-shadow .3s}
.paper[data-s="dots"]{background-image:radial-gradient(rgba(60,50,40,.32) 1.1px,transparent 1.4px);background-size:7px 7px;background-position:3px 3px}
.paper[data-s="grid"]{background-image:linear-gradient(rgba(60,50,40,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(60,50,40,.22) 1px,transparent 1px);background-size:8px 8px}
.paper[data-s="lined"]{background-image:repeating-linear-gradient(transparent 0 8px,rgba(60,50,40,.28) 8px 9px)}
.paper.tpl{background-size:cover;background-position:center}
.paper .spine{position:absolute;left:50%;top:6%;bottom:6%;width:1.5px;margin-left:-.75px;background:rgba(60,50,40,.35);transition:opacity .3s, transform .4s var(--spr)}
.vert .paper .spine{left:6%;right:6%;top:50%;bottom:auto;width:auto;height:1.5px;margin:-.75px 0 0}
.nospread .paper .spine{opacity:0;transform:scaleY(.4)}
.st span{transition:color .25s}
.st.on span{color:#2B2723;font-weight:500}
.st.on .paper{box-shadow:0 0 0 3px #8E877D,0 10px 20px -8px rgba(40,30,20,.35)}
.st.on .pv{background:rgba(0,0,0,.03)}
h4{margin-top:26px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#8E877D;font-weight:600}
.fade{position:absolute;left:0;right:0;bottom:0;height:130px;background:linear-gradient(rgba(247,245,241,0),#F7F5F1 55%);pointer-events:none}
.begin{position:absolute;left:50%;bottom:40px;width:250px;height:56px;margin-left:-125px;border-radius:28px;background:${ACC};color:#fff;font-size:18px;font-weight:500;box-shadow:0 10px 24px -10px rgba(217,101,75,.7);display:grid;place-items:center;overflow:hidden}
.begin span{grid-area:1/1;transition:opacity .2s}
.begin svg{grid-area:1/1;opacity:0}
.ck{stroke-dasharray:1;stroke-dashoffset:1}
.pick{position:absolute;left:28px;right:28px;top:190px;z-index:20;border-radius:16px;background:rgba(252,251,249,.9);backdrop-filter:blur(30px) saturate(1.8);-webkit-backdrop-filter:blur(30px) saturate(1.8);box-shadow:0 0 0 .5px rgba(0,0,0,.08),0 24px 60px -16px rgba(40,30,20,.4);overflow:hidden;opacity:0;transform:scale(.4);transform-origin:50% 0;pointer-events:none}
.pick button{display:flex;align-items:center;justify-content:space-between;width:100%;height:48px;padding:0 18px;font-size:16.5px;text-align:left}
.pick button+button{box-shadow:inset 0 .5px 0 rgba(0,0,0,.1)}
.pick button:active{background:rgba(0,0,0,.05)}
.pick em{color:${ACC};display:flex}
`;
window.SCREENS.Style = {title:'A4 选页面样式（新）', css, html};

window.SCREEN_INIT = window.SCREEN_INIT || {};
SCREEN_INIT.Style = (root, api) => {
  const R = root.querySelector('.root'), $ = id => root.getElementById(id);
  R.style.setProperty('--spr', api.spring(.72, .45));
  const st = {size:SIZES[0], orient:'land', spread:true, snap:false, color:COLORS[0], style:'dots', tpl:null};
  const papers = [...root.querySelectorAll('.grid .paper')];
  function layout(){
    // 预览框的大小跟着尺寸、横竖、跨页一起变
    // 整页按横 / 竖放；打开「跨页」就在中间加一条中缝
    const r = st.size.r;               // 单页宽/高（竖放）
    const a = st.orient === 'land' ? 1/r : r;   // 跨页只是在中间加一条中缝，整页大小不变（和 Zinnia 一样）
    const maxW = 150, maxH = 104;
    let w = maxW, h = w / a; if (h > maxH){ h = maxH; w = h * a; }
    papers.forEach(p => { p.style.setProperty('--w', w.toFixed(1)+'px'); p.style.setProperty('--h', h.toFixed(1)+'px'); p.style.setProperty('--paper', st.color); });
    R.classList.toggle('nospread', !st.spread);
    const snapOK = !st.tpl && (st.style === 'dots' || st.style === 'grid');
    $('snapRow').classList.toggle('dis', !snapOK);
  }
  layout();
  // 尺寸选择
  const pick = $('pick'), bSize = $('bSize'); let open = false;
  function closePick(){ if (!open) return; open = false; bSize.classList.remove('open');
    pick.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(.6)'}],{duration:220, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards'}); pick.style.pointerEvents = 'none'; }
  bSize.addEventListener('click', e => { e.stopPropagation();
    if (open) return closePick(); open = true; bSize.classList.add('open');
    const r = bSize.getBoundingClientRect(), pr = R.getBoundingClientRect(), k = pr.width/390;
    pick.style.top = ((r.bottom - pr.top)/k + 8) + 'px';
    pick.style.pointerEvents = 'auto';
    pick.animate([{opacity:0, transform:'scale(.3)'},{opacity:1, transform:'scale(1)'}],{duration:540, easing:api.spring(.78,.42), fill:'forwards'});
    [...pick.children].forEach((b,i) => b.animate([{opacity:0, transform:'translateY(-6px)'},{opacity:1, transform:'none'}],{duration:280, delay:50+i*24, fill:'backwards', easing:'ease-out'}));
  });
  pick.querySelectorAll('button').forEach(b => b.addEventListener('click', e => { e.stopPropagation();
    st.size = SIZES.find(s => s.k === b.dataset.k);
    pick.querySelectorAll('em').forEach(x => x.innerHTML = ''); b.querySelector('em').innerHTML = I.check;
    const lab = $('sizeLab');
    lab.animate([{opacity:1, transform:'none'},{opacity:0, transform:'translateY(-6px)'}],{duration:140}).onfinish = () => { lab.textContent = st.size.t; lab.animate([{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'none'}],{duration:320, easing:api.spring(.8,.4)}); };
    setTimeout(closePick, 120); layout();
  }));
  R.addEventListener('click', closePick);
  // 横 / 竖
  root.querySelectorAll('.sg').forEach(b => b.addEventListener('click', () => {
    if (st.orient === b.dataset.o) return; st.orient = b.dataset.o;
    root.querySelectorAll('.sg').forEach(x => x.classList.toggle('on', x === b));
    const ic = b.querySelector('svg'); ic.animate([{transform:'rotate(-90deg) scale(.6)', opacity:.3},{transform:'none', opacity:1}],{duration:520, easing:api.spring(.65,.4)});
    layout();
  }));
  // 开关
  function toggle(sw, on){ sw.classList.toggle('on', on); sw.setAttribute('aria-checked', on); }
  $('swSpread').addEventListener('click', () => { st.spread = !st.spread; toggle($('swSpread'), st.spread); layout(); });
  $('swSnap').addEventListener('click', () => { st.snap = !st.snap; toggle($('swSnap'), st.snap); api.toast(st.snap ? 'Things will snap to the grid' : 'Snap to grid off'); });
  // 纸的颜色
  const cols = [...root.querySelectorAll('.cl[data-c]')];
  function setColor(c, fromHue){ st.color = c; cols.forEach(x => x.classList.toggle('on', x.dataset.c === c)); if (!fromHue){ $('bCustom').classList.remove('on'); } layout(); }
  cols.forEach(b => b.addEventListener('click', () => { setColor(b.dataset.c); b.animate([{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:500, easing:api.spring(.5,.35)}); $('hue').classList.remove('open'); }));
  $('bCustom').addEventListener('click', () => { const h = $('hue'); h.classList.toggle('open'); $('bCustom').animate([{transform:'rotate(0)'},{transform:'rotate(120deg)'}],{duration:500, easing:api.spring(.7,.4)}); });
  const bar = $('huebar'), knob = $('knob');
  function hueAt(e){ const r = bar.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    knob.style.left = (p*100)+'%'; const c = `hsl(${Math.round(p*360)},65%,88%)`; knob.style.setProperty('--k', c); cols.forEach(x => x.classList.remove('on')); st.color = c; layout(); }
  bar.addEventListener('pointerdown', e => { bar.setPointerCapture(e.pointerId); hueAt(e); knob.animate([{transform:'scale(1)'},{transform:'scale(1.2)'}],{duration:200, fill:'forwards'}); });
  bar.addEventListener('pointermove', e => { if (bar.hasPointerCapture(e.pointerId)) hueAt(e); });
  bar.addEventListener('pointerup', () => knob.animate([{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:400, easing:api.spring(.5,.35), fill:'forwards'}));
  // 纸样 / 模板（选一个）
  const all = [...root.querySelectorAll('.st')];
  all.forEach(b => b.addEventListener('click', () => {
    all.forEach(x => x.classList.toggle('on', x === b));
    if (b.dataset.s){ st.style = b.dataset.s; st.tpl = null; } else { st.tpl = b.dataset.t; }
    b.querySelector('.paper').animate([{transform:'scale(.94)'},{transform:'scale(1.03)'},{transform:'scale(1)'}],{duration:520, easing:'ease-out'});
    layout();
  }));
  // 返回 / 关闭
  $('bBack').addEventListener('click', () => api.back());
  $('bClose').addEventListener('click', () => api.popTo('Home'));
  // 开始：按钮收成一个圆、打勾，然后面板收起，首页里长出新本子
  const begin = $('bBegin'); let done = false;
  begin.addEventListener('click', () => {
    if (done) return; done = true;
    const sp = begin.querySelector('span'), ck = begin.querySelector('svg'), path = ck.querySelector('.ck');
    sp.style.opacity = 0;
    begin.animate([{width:'250px', marginLeft:'-125px'},{width:'56px', marginLeft:'-28px'}],{duration:520, easing:api.spring(.8,.42), fill:'forwards'});
    ck.animate([{opacity:0},{opacity:1}],{duration:200, delay:260, fill:'forwards'});
    path.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:360, delay:300, easing:'ease-out', fill:'forwards'});
    const info = {color:st.color, style:st.tpl ? TPLS.find(t => t.k === st.tpl).t : STYLES.find(s => s.k === st.style).t, size:st.size.t, tpl:st.tpl, styleKey:st.style, r:st.size.r, orient:st.orient, spread:st.spread};
    setTimeout(() => api.popTo('Home', home => home.el.shadowRoot.dispatchEvent(new CustomEvent('newjournal', {detail:info}))), 820);
  });
};

// —— 首页：接住「建好了」的新本子
window.CREATED = window.CREATED || [];
function coverHTML(j, n){
  const ink = '#2B2723';
  return `<div class="nc" style="--cc:${j.color}">
    <svg viewBox="0 0 161 240" width="161" height="240" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round">
      <path d="M118 40 l4 10 10 1 -8 7 3 10 -9 -6 -9 6 3 -10 -8 -7 10 -1z" fill="#F6C14E"/>
      <path d="M30 196 q 20 -14 40 0 t 40 0 t 40 0" stroke-width="2.2"/>
      <circle cx="40" cy="62" r="7" fill="#E58C8C" stroke="none"/>
    </svg>
    <div class="lab"><b>${j.title}</b><small>${j.style} · ${j.size.split(' (')[0]}</small></div>
  </div>`;
}
const NC_CSS = `
.nc{position:absolute;inset:0;background:var(--cc);background-image:radial-gradient(rgba(255,255,255,.35),rgba(255,255,255,0) 70%),linear-gradient(160deg,rgba(255,255,255,.25),rgba(0,0,0,.06))}
.nc svg{position:absolute;inset:0}
.nc .lab{position:absolute;left:24px;right:16px;top:96px;padding:10px 12px;background:#FFFDF8;border-radius:3px;box-shadow:0 3px 8px -3px rgba(0,0,0,.25);transform:rotate(-2deg)}
.nc .lab b{display:block;font-family:Caveat,'WK Hand',cursive;font-size:24px;font-weight:700;line-height:1}
.nc .lab small{display:block;margin-top:4px;font-size:10.5px;color:#8E877D}
`;
const prevHome = SCREEN_INIT.Home;
SCREEN_INIT.Home = (root, api) => {
  prevHome && prevHome(root, api);
  const st = document.createElement('style'); st.textContent = NC_CSS; root.appendChild(st);
  const books = root.getElementById('books'), newCard = books.querySelector('.book.new'), sc = root.getElementById('sc');
  function make(j){
    const d = document.createElement('div'); d.className = 'bk';
    d.innerHTML = `<button class="book cov press" aria-label="${j.title}">${coverHTML(j)}<i class="spine"></i></button><button class="dots press" aria-label="More">${'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>'}</button><b class="serif bt">${j.title}</b>`;
    d.querySelector('.cov').addEventListener('click', e => { e.stopPropagation(); if (root.querySelector('.root').classList.contains('selecting')){ d.classList.toggle('on'); return; } window.CUR_JOURNAL = j; api.openBook(d.querySelector('.cov'), 'Page', {pageSel:'.paper'}); });
    d.querySelector('.dots').addEventListener('click', e => { e.stopPropagation(); api.toast('Rename · Change cover · Export · Delete'); });
    return d;
  }
  // 已经建过的（切换标签后首页会重建）
  CREATED.slice().reverse().forEach(j => books.insertBefore(make(j), books.children[1]));
  root.addEventListener('newjournal', e => {
    const j = Object.assign({title:'Journal ' + (CREATED.length + 6)}, e.detail);
    CREATED.unshift(j);
    // 先滚到「My Journals」，再让新本子长出来，旁边的本子顺势往后挪（FLIP）
    const top = books.offsetTop - 120;
    sc.scrollTo({top, behavior:'smooth'});
    api.hideTabbar();
    setTimeout(() => {
      const items = [...books.children];
      const before = new Map(items.map(n => [n, n.getBoundingClientRect()]));
      const d = make(j); books.insertBefore(d, items[1]);
      const k = root.querySelector('.root').getBoundingClientRect().width / 390;
      items.forEach(n => { const a = before.get(n), b = n.getBoundingClientRect(); const dx = (a.left-b.left)/k, dy = (a.top-b.top)/k;
        if (dx || dy) n.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:700, easing:api.spring(.86,.5)}); });
      d.animate([{opacity:0, transform:'scale(.4) rotate(-6deg)'},{opacity:1, offset:.35},{opacity:1, transform:'none'}],{duration:760, easing:api.spring(.62,.5)});
      // 不用再点一次：新本子长出来后马上翻开，直接到第一页
      setTimeout(() => { window.CUR_JOURNAL = j; api.openBook(d.querySelector('.cov'), 'Page', {pageSel:'.paper'}); }, 820);
    }, 320);
  });
};

// 新建面板里「From a template」的小图换成手画的模板页
const prevNJ = SCREEN_INIT.NewJournal;
SCREEN_INIT.NewJournal = (root, api) => {
  prevNJ && prevNJ(root, api);
  const opts = root.querySelectorAll('.opt');
  const tpls = opts[1] ? opts[1].querySelectorAll('img') : [];
  ['img/tpl_food_p.jpg','img/tpl_trip_p.jpg','img/tpl_week_p.jpg'].forEach((u,i) => { if (tpls[i]) tpls[i].src = u; });
};
})();
