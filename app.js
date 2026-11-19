(function(){
const S = window.SCREENS;
const phone = document.getElementById('phone');
const NAV = window.NAV || {}, SHEET = window.SHEET || {}, MODAL = window.MODAL || {}, TABS = window.TABS || [];
let stack = [];   // [{id, el, mode, src}]
let busy = false;

// —— 弹簧曲线（和 iOS 的 spring 一样：阻尼比 + 响应时间），生成 CSS linear() 曲线
const LIN = CSS.supports('animation-timing-function', 'linear(0, 1)');
const springCache = {};
function spring(z = 1, resp = .45){
  const key = z + '_' + resp; if (springCache[key]) return springCache[key];
  if (!LIN) return springCache[key] = (z < .9 ? 'cubic-bezier(.3,1.25,.5,1)' : 'cubic-bezier(.22,.9,.28,1)');
  const w0 = 2 * Math.PI / resp, T = resp * 2.1, N = 48, pts = [];
  for (let i = 0; i <= N; i++){
    const t = T * i / N; let x;
    if (z < 1){ const wd = w0 * Math.sqrt(1 - z*z); x = 1 - Math.exp(-z*w0*t) * (Math.cos(wd*t) + (z*w0/wd) * Math.sin(wd*t)); }
    else x = 1 - Math.exp(-w0*t) * (1 + w0*t);
    pts.push(+(i === N ? 1 : x).toFixed(4));
  }
  return springCache[key] = `linear(${pts.join(',')})`;
}
const SMOOTH = spring(1, .7), SOFT = spring(.86, .5), BOUNCE = spring(.66, .4);

// 每一屏放进自己的 Shadow DOM，稿图的样式和结构原样不动
const EXTRA = `
.root{font-synthesis:none}
button,[data-go],.press{cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;touch-action:manipulation}
img{-webkit-user-drag:none;user-select:none}
.hs{position:absolute;z-index:60;cursor:pointer;-webkit-tap-highlight-color:transparent}
.tg{transition:background-color .3s}
.tg::after{transition:transform .45s ${BOUNCE}}
.tg.off{background:#D3CABD}
.tg.off::after{transform:translateX(-20px)}
.on,.sel{transition:background-color .25s, color .25s, box-shadow .25s, border-color .25s}
`;
function build(id){
  const el = document.createElement('section');
  el.className = 'scr'; el.dataset.id = id;
  if (SHEET[id]) el.style.background = 'transparent';
  const root = el.attachShadow({mode:'open'});
  root.innerHTML = `<style>${S[id].css}${EXTRA}${(window.SCREEN_CSS||{})[id]||''}</style>${S[id].html}`;
  wire(id, el, root);
  return el;
}

// —— 按下去的手感：有底色的东西轻轻缩小，纯文字/图标按钮变淡，松手用弹簧回来
function pressable(root){
  let cur = null, mode = '';
  const pick = t => t.closest && t.closest('button,[data-go],.press');
  root.addEventListener('pointerdown', e => {
    const el = pick(e.target); if (!el || el.disabled) return;
    cur = el;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const plain = (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent') && !el.querySelector('img') && cs.boxShadow === 'none' && r.width < 140;
    mode = plain ? 'dim' : 'scale';
    const s = r.width > 250 ? .975 : r.width > 120 ? .96 : .92;
    el._pa && el._pa.cancel();
    el._pa = plain ? el.animate([{opacity:1},{opacity:.35}],{duration:90,fill:'forwards',easing:'ease-out'})
                   : el.animate([{scale:'1'},{scale:String(s)}],{duration:180,fill:'forwards',easing:'cubic-bezier(.2,.8,.3,1)'});
    el._ps = s;
  }, {passive:true});
  const up = () => {
    if (!cur) return; const el = cur; cur = null;
    const from = el._pa; let start;
    if (mode === 'dim'){ start = getComputedStyle(el).opacity; from && from.cancel(); el._pa = el.animate([{opacity:start},{opacity:1}],{duration:380,easing:'ease-out'}); }
    else { start = getComputedStyle(el).scale; from && from.cancel(); el._pa = el.animate([{scale:start === 'none' ? String(el._ps) : start},{scale:'1'}],{duration:620,easing:BOUNCE}); }
  };
  root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up);
  root.addEventListener('pointerleave', up, true);
}

function findAllByText(root, text){
  const out = [];
  root.querySelectorAll('*').forEach(n => {
    if (n.closest('svg') || n.tagName === 'STYLE') return;
    const own = [...n.childNodes].filter(c => c.nodeType === 3).map(c => c.textContent).join('').replace(/\s+/g,' ').trim();
    if (own === text) out.push(n.closest('button,a') || n);
  });
  return out;
}

function wire(id, el, root){
  const rootDiv = root.querySelector('.root') || root;
  pressable(root);
  for (const r of (NAV[id] || [])){
    let targets = [];
    if (r.sel) targets = [...root.querySelectorAll(r.sel)];
    else if (r.t) targets = findAllByText(root, r.t);
    if (r.r){
      const d = document.createElement('div'); d.className = 'hs';
      const [x,y,w,h] = r.r; Object.assign(d.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
      rootDiv.appendChild(d); targets = [d];
    } else if (r.all) targets = targets.slice(r.from || 0);
    else targets = targets[r.n || 0] ? [targets[r.n || 0]] : [];
    if (!targets.length){ console.warn('nav miss', id, r); continue; }
    for (const t of targets){
      t.dataset.go = r.go || 'x';
      t.addEventListener('click', ev => { ev.stopPropagation(); act(r, t, root); });
    }
  }
  // 同一组选项：点哪个哪个选中；开关：点了切换
  root.addEventListener('click', ev => {
    if (S[id].own) return;   // 自己管交互的屏（比如能画的一页）不用通用的切换
    let tg = ev.target.closest('.tg');
    if (!tg){ const row = ev.target.closest('div,label,li'); if (row && row !== rootDiv && row.children.length < 6){ const t = row.querySelector(':scope > .tg'); if (t) tg = t; } }
    if (tg && !tg.dataset.go){ tg.classList.toggle(id === 'Settings' ? 'on' : 'off'); return; }
    const b = ev.target.closest('button');
    if (!b || b.dataset.go) return;
    const sibs = b.parentElement ? [...b.parentElement.children].filter(x => x.tagName === 'BUTTON') : [];
    for (const cls of ['on','sel','active','cur']){
      if (sibs.some(s => s !== b && s.classList.contains(cls))){ sibs.forEach(s => s.classList.remove(cls)); b.classList.add(cls); return; }
    }
  });
  if (window.SCREEN_INIT && SCREEN_INIT[id]) SCREEN_INIT[id](root, api);
}

function act(r, t, root){
  if (r.toast) toast(r.toast);
  if (r.fn && window.SCREEN_FN && SCREEN_FN[r.fn]) SCREEN_FN[r.fn](root, t, api);
  if (r.go === 'back') back();
  else if (r.go && r.go !== 'x'){ if (r.zoom) zoomOpen(t, r.go, {popTo:r.popTo}); else go(r.go, r.mode, r.popTo); }
}

function sheetOf(el){
  const key = SHEET[el.dataset.id]; if (!key) return null;
  const root = el.shadowRoot, rd = root.querySelector('.root');
  const hit = findAllByText(root, key)[0]; if (!hit) return null;
  let n = hit; while (n.parentElement && n.parentElement !== rd) n = n.parentElement;
  return n.parentElement === rd ? n : null;
}
const scale = () => phone.getBoundingClientRect().width / 390;
function local(rect){ const p = phone.getBoundingClientRect(), k = p.width/390; return {x:(rect.left-p.left)/k, y:(rect.top-p.top)/k, w:rect.width/k, h:rect.height/k}; }
function insetOf(b, rad){ return `inset(${b.y}px ${390-b.x-b.w}px ${844-b.y-b.h}px ${b.x}px round ${rad})`; }

// —— 转场：全部用弹簧，慢进慢出，不跳
function modeFor(id, mode){ return mode || (SHEET[id] ? 'sheet' : MODAL[id] ? 'modal' : 'push'); }
function mount(el){ phone.insertBefore(el, document.getElementById('edge')); }
function enter(el, mode, cur){
  const A = [];
  if (mode === 'sheet'){
    const sh = sheetOf(el);
    A.push(el.animate([{opacity:0},{opacity:1}],{duration:340,easing:'cubic-bezier(.25,.1,.25,1)'}));
    if (sh) A.push(sh.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:800,easing:SMOOTH}));
  } else if (mode === 'modal'){
    A.push(el.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:820,easing:SMOOTH}));
    A.push(cur.el.animate([{scale:'1',filter:'brightness(1)',borderRadius:'0px'},{scale:'.93',filter:'brightness(.8)',borderRadius:'40px'}],{duration:820,easing:SMOOTH,fill:'forwards'}));
  } else if (mode === 'tab'){
    A.push(el.animate([{opacity:0, transform:'translateY(10px) scale(.995)'},{opacity:1, transform:'none'}],{duration:420,easing:SOFT}));
    A.push(cur.el.animate([{opacity:1},{opacity:0}],{duration:240,easing:'ease-out',fill:'forwards'}));
  } else if (mode === 'replace'){
    A.push(el.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-out'}));
  } else {
    A.push(el.animate([{transform:'translateX(100%)',boxShadow:'-24px 0 40px rgba(40,30,20,.0)'},{transform:'none',boxShadow:'-24px 0 40px rgba(40,30,20,.16)'}],{duration:780,easing:SMOOTH}));
    A.push(cur.el.animate([{transform:'none',filter:'brightness(1)'},{transform:'translateX(-26%)',filter:'brightness(.9)'}],{duration:780,easing:SMOOTH,fill:'forwards'}));
  }
  return A;
}
function settle(A, done){ let n = 0; const fin = () => { if (++n === 1) done(); }; A[0].onfinish = fin; }
function finishPush(id, el, mode, cur, A, popTo, extra){
  busy = false;
  A.slice(1).forEach(a => a.cancel());
  if (mode === 'tab'){ stack.forEach(s => s.el.remove()); stack = [{id, el, mode:'push'}]; }
  else if (mode === 'replace'){ cur.el.remove(); stack[stack.length-1] = Object.assign({id, el, mode:cur.mode}, extra||{}); }
  else { if (mode !== 'sheet') cur.el.style.visibility = 'hidden'; stack.push(Object.assign({id, el, mode}, extra||{})); }
  if (popTo){
    const keep = [].concat(popTo); let i = stack.length - 2;
    while (i >= 0 && !keep.includes(stack[i].id)) i--;
    if (i >= 0){ stack.splice(i+1, stack.length-2-i).forEach(s => s.el.remove()); const top = stack[stack.length-1]; if (top.mode === 'sheet' || top.mode === 'zoom' || top.mode === 'book') top.mode = 'push'; }
  }
  mark();
}
function go(id, mode, popTo){
  if (busy || !S[id]) return;
  const cur = stack[stack.length-1];
  if (cur && cur.id === id) return;
  mode = modeFor(id, mode);
  if (mode === 'push' && TABS.includes(id) && cur && TABS.includes(cur.id)) mode = 'tab';
  const el = build(id); mount(el);
  if (!cur){ stack = [{id, el, mode:'push'}]; mark(); return; }
  busy = true;
  const A = enter(el, mode, cur);
  settle(A, () => finishPush(id, el, mode, cur, A, popTo));
  tabbarFor(id, mode);
}
// 从一张卡片「长」成下一屏（像 iOS 打开相册里的照片）
function zoomOpen(srcEl, id, o = {}){
  if (busy || !S[id]) return;
  const cur = stack[stack.length-1];
  const b = local(srcEl.getBoundingClientRect());
  const rad = (o.radius !== undefined ? o.radius : getComputedStyle(srcEl).borderRadius) || '12px';
  const el = build(id); mount(el);
  busy = true;
  const ghost = srcEl.cloneNode(true);
  Object.assign(ghost.style,{position:'absolute',left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px',margin:0,zIndex:40,pointerEvents:'none',borderRadius:typeof rad==='string'?rad:rad+'px',overflow:'hidden',scale:'1',transform:'none'});
  ghost.querySelectorAll('*').forEach(n => n.style && (n.style.pointerEvents = 'none'));
  phone.appendChild(ghost);
  srcEl.style.visibility = 'hidden';
  const D = 820;
  const A = [
    el.animate([{clipPath:insetOf(b, typeof rad==='string'?rad.split(' ')[0]:rad+'px'), opacity:0},{opacity:1, offset:.45},{clipPath:'inset(0px 0px 0px 0px round 0px)', opacity:1}],{duration:D,easing:SMOOTH}),
    ghost.animate([{left:b.x+'px',top:b.y+'px',width:b.w+'px',height:b.h+'px',opacity:1},{opacity:0, offset:.5},{left:'0px',top:'0px',width:'390px',height:'844px',opacity:0}],{duration:D,easing:SMOOTH,fill:'forwards'}),
    cur.el.animate([{scale:'1',filter:'brightness(1)'},{scale:'.94',filter:'brightness(.85)'}],{duration:D,easing:SMOOTH,fill:'forwards'}),
  ];
  hideTabbar();
  settle(A, () => { ghost.remove(); srcEl.style.visibility = ''; finishPush(id, el, 'zoom', cur, A, o.popTo, {src:srcEl, rad}); if (o.toast) toast(o.toast); });
}
// 打开一本手账：封面先飞到书页的位置，再像真书一样沿左边翻开，露出里面那一页
function openBook(srcEl, id, o = {}){
  if (busy || !S[id]) return;
  const cur = stack[stack.length-1];
  const b = local(srcEl.getBoundingClientRect());
  const el = build(id); mount(el);
  busy = true;
  const pg = o.pageSel && el.shadowRoot.querySelector(o.pageSel);
  const P = pg ? local(pg.getBoundingClientRect()) : {x:28, y:122, w:334, h:472};
  // 双页：封面盖在右半边，沿中缝翻到左边，正好像一本真书摊开
  const C = (pg && pg.classList.contains('spread')) ? {x:P.x+P.w/2, y:P.y, w:P.w/2, h:P.h} : P;
  const stage = document.createElement('div');
  Object.assign(stage.style,{position:'absolute', inset:'0', zIndex:45, perspective:'1500px', pointerEvents:'none'});
  const book = document.createElement('div');
  Object.assign(book.style,{position:'absolute', left:b.x+'px', top:b.y+'px', width:b.w+'px', height:b.h+'px', transformStyle:'preserve-3d', transformOrigin:'left center'});
  const front = srcEl.cloneNode(true);
  Object.assign(front.style,{position:'absolute', inset:'0', width:'100%', height:'100%', margin:0, scale:'1', transform:'none', backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', borderRadius:'5px 20px 20px 5px', overflow:'hidden', boxShadow:'0 20px 40px -14px rgba(40,30,20,.45)'});
  const backF = document.createElement('div');
  Object.assign(backF.style,{position:'absolute', inset:'0', background:'linear-gradient(90deg,#E6DED1,#F4EFE7 30%)', borderRadius:'20px 5px 5px 20px', transform:'rotateY(180deg)', backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', boxShadow:'inset -8px 0 14px -10px rgba(0,0,0,.3)'});
  book.append(front, backF); stage.appendChild(book); phone.appendChild(stage);
  srcEl.style.visibility = 'hidden';
  hideTabbar();
  const T = 1350, f1 = .36, f2 = .78;     // 0–36% 飞过去，36–78% 翻开，之后页面铺满
  const E1 = 'cubic-bezier(.3,.85,.3,1)', E2 = 'cubic-bezier(.45,.05,.25,1)', E3 = 'cubic-bezier(.25,.8,.25,1)';
  const pr = '4px';
  const A = [
    el.animate([
      {clipPath:insetOf(b, pr), offset:0, easing:E1},
      {clipPath:insetOf(C, pr), offset:f1, easing:E2},
      {clipPath:insetOf(P, pr), offset:f2, easing:E3},
      {clipPath:'inset(0px 0px 0px 0px round 0px)', offset:1}],{duration:T}),
    book.animate([
      {left:b.x+'px', top:b.y+'px', width:b.w+'px', height:b.h+'px', transform:'rotateY(0deg)', offset:0, easing:E1},
      {left:C.x+'px', top:C.y+'px', width:C.w+'px', height:C.h+'px', transform:'rotateY(0deg)', offset:f1, easing:E2},
      {left:C.x+'px', top:C.y+'px', width:C.w+'px', height:C.h+'px', transform:'rotateY(-172deg)', opacity:1, offset:f2},
      {left:C.x+'px', top:C.y+'px', width:C.w+'px', height:C.h+'px', transform:'rotateY(-180deg)', opacity:0, offset:1}],{duration:T, fill:'forwards'}),
    cur.el.animate([{filter:'brightness(1)', scale:'1'},{filter:'brightness(.72)', scale:'.97', offset:f1},{filter:'brightness(.72)', scale:'.97'}],{duration:T, easing:E1, fill:'forwards'}),
  ];
  settle(A, () => { stage.remove(); srcEl.style.visibility = ''; finishPush(id, el, 'book', cur, A, o.popTo, {src:srcEl, P, C}); });
}
function closeBook(cur, prev){
  const b = local(cur.src.getBoundingClientRect()), P = cur.P, C = cur.C || cur.P;
  const stage = document.createElement('div');
  Object.assign(stage.style,{position:'absolute', inset:'0', zIndex:45, perspective:'1500px', pointerEvents:'none'});
  const book = document.createElement('div');
  Object.assign(book.style,{position:'absolute', left:C.x+'px', top:C.y+'px', width:C.w+'px', height:C.h+'px', transformStyle:'preserve-3d', transformOrigin:'left center'});
  const front = cur.src.cloneNode(true);
  Object.assign(front.style,{position:'absolute', inset:'0', width:'100%', height:'100%', margin:0, scale:'1', transform:'none', visibility:'visible', backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', borderRadius:'5px 20px 20px 5px', overflow:'hidden', boxShadow:'0 20px 40px -14px rgba(40,30,20,.45)'});
  const backF = document.createElement('div');
  Object.assign(backF.style,{position:'absolute', inset:'0', background:'linear-gradient(90deg,#E6DED1,#F4EFE7 30%)', borderRadius:'20px 5px 5px 20px', transform:'rotateY(180deg)', backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden'});
  book.append(front, backF); stage.appendChild(book); phone.appendChild(stage);
  cur.src.style.visibility = 'hidden';
  const T = 1150, E = 'cubic-bezier(.4,.1,.25,1)', E3 = 'cubic-bezier(.3,.8,.3,1)';
  cur.el.animate([{clipPath:'inset(0px 0px 0px 0px round 40px)', offset:0, easing:E3},{clipPath:insetOf(P,'4px'), offset:.22, easing:E},{clipPath:insetOf(C,'4px'), opacity:1, offset:.62},{clipPath:insetOf(C,'4px'), opacity:0, offset:.64},{opacity:0, offset:1}],{duration:T, fill:'forwards'});
  const a = book.animate([
    {transform:'rotateY(-180deg)', opacity:0, offset:0},
    {transform:'rotateY(-172deg)', opacity:1, offset:.22, easing:E},
    {left:C.x+'px', top:C.y+'px', width:C.w+'px', height:C.h+'px', transform:'rotateY(0deg)', offset:.64, easing:E3},
    {left:b.x+'px', top:b.y+'px', width:b.w+'px', height:b.h+'px', transform:'rotateY(0deg)', offset:1}],{duration:T, fill:'forwards'});
  prev.el.animate([{filter:'brightness(.72)', scale:'.97'},{filter:'brightness(.72)', scale:'.97', offset:.55},{filter:'brightness(1)', scale:'1'}],{duration:T, easing:E3});
  a.addEventListener('finish', () => { stage.remove(); cur.src.style.visibility = ''; });
  return a;
}

function back(){
  if (busy) return;
  if (stack.length < 2){
    const p = (window.PARENT||{})[stack[0] && stack[0].id]; if (!p) return;
    const pe = build(p); phone.insertBefore(pe, stack[0].el); stack.unshift({id:p, el:pe, mode:'push'});
  }
  busy = true;
  const cur = stack.pop(), prev = stack[stack.length-1];
  prev.el.style.visibility = '';
  let a;
  if (cur.mode === 'sheet'){
    const sh = sheetOf(cur.el);
    if (sh) sh.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:600,easing:SMOOTH,fill:'forwards'});
    a = cur.el.animate([{opacity:1},{opacity:1,offset:.35},{opacity:0}],{duration:600,easing:'ease-in-out',fill:'forwards'});
  } else if (cur.mode === 'modal'){
    a = cur.el.animate([{transform:getComputedStyle(cur.el).transform === 'none' ? 'none' : getComputedStyle(cur.el).transform},{transform:'translateY(100%)'}],{duration:700,easing:SMOOTH,fill:'forwards'});
    prev.el.animate([{scale:'.93',filter:'brightness(.8)',borderRadius:'40px'},{scale:'1',filter:'brightness(1)',borderRadius:'0px'}],{duration:700,easing:SMOOTH});
  } else if (cur.mode === 'book' && !cur.el._dragX && cur.src && cur.src.isConnected){
    a = closeBook(cur, prev);
  } else if (cur.mode === 'zoom' && !cur.el._dragX && cur.src && cur.src.isConnected){
    const b = local(cur.src.getBoundingClientRect());
    const r = typeof cur.rad === 'string' ? cur.rad.split(' ')[0] : cur.rad+'px';
    a = cur.el.animate([{clipPath:'inset(0px 0px 0px 0px round 40px)', opacity:1},{opacity:1, offset:.6},{clipPath:insetOf(b, r), opacity:0}],{duration:700,easing:SMOOTH,fill:'forwards'});
    prev.el.animate([{scale:'.94',filter:'brightness(.85)'},{scale:'1',filter:'brightness(1)'}],{duration:700,easing:SMOOTH});
  } else {
    const t0 = cur.el._dragX || 0, p0 = prev.el._dragX;
    a = cur.el.animate([{transform:`translateX(${t0}px)`,boxShadow:'-24px 0 40px rgba(40,30,20,.16)'},{transform:'translateX(100%)',boxShadow:'-24px 0 40px rgba(40,30,20,0)'}],{duration:t0 ? 480 : 680,easing:SMOOTH,fill:'forwards'});
    prev.el.animate([{transform:p0 !== undefined ? `translateX(${p0}px)` : 'translateX(-26%)',filter:'brightness(.9)'},{transform:'none',filter:'brightness(1)'}],{duration:t0 ? 480 : 680,easing:SMOOTH});
  }
  tabbarFor(prev.id, 'push');
  a.onfinish = () => { cur.el.remove(); prev.el.style.transform = ''; delete prev.el._dragX; busy = false; mark(); };
}

// 一次收起好几层，回到某一屏（比如「建好了」直接回首页）
function popTo(id, after){
  if (busy) return;
  let i = stack.length - 1; while (i >= 0 && stack[i].id !== id) i--;
  if (i < 0){ go(id, 'tab'); return; }
  const top = stack.slice(i + 1); if (!top.length){ after && after(stack[i]); return; }
  busy = true;
  const target = stack[i]; target.el.style.visibility = '';
  target.el.getAnimations().forEach(a => a.cancel());
  let last;
  top.forEach((s, k) => {
    const sh = s.mode === 'sheet' ? sheetOf(s.el) : null;
    if (sh) sh.animate([{transform:'none'},{transform:'translateY(100%)'}],{duration:640, easing:SMOOTH, fill:'forwards'});
    else s.el.animate([{transform:'none'},{transform:s.mode === 'modal' ? 'translateY(100%)' : 'translateX(100%)'}],{duration:640, easing:SMOOTH, fill:'forwards'});
    last = s.el.animate([{opacity:1},{opacity:1, offset:.35},{opacity:0}],{duration:640, fill:'forwards'});
  });
  stack = stack.slice(0, i + 1);
  tabbarFor(id);
  last.onfinish = () => { top.forEach(s => s.el.remove()); busy = false; mark(); after && after(target); };
}

// —— 从左边缘拖动返回（跟手）
const edge = document.getElementById('edge');
let drag = null;
edge.addEventListener('pointerdown', e => {
  if (busy || stack.length < 2) return;
  const cur = stack[stack.length-1]; if (!['push','zoom','book'].includes(cur.mode)) return;
  drag = {x0:e.clientX, t0:performance.now(), cur, prev:stack[stack.length-2], k:scale(), lx:e.clientX, lt:performance.now(), v:0};
  drag.prev.el.style.visibility = '';
  edge.setPointerCapture(e.pointerId);
});
edge.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = Math.max(0, (e.clientX - drag.x0) / drag.k), p = dx / 390;
  const now = performance.now(); drag.v = (e.clientX - drag.lx) / drag.k / Math.max(1, now - drag.lt); drag.lx = e.clientX; drag.lt = now;
  drag.cur.el.style.transform = `translateX(${dx}px)`; drag.cur.el.style.boxShadow = `-24px 0 40px rgba(40,30,20,${.16*(1-p)})`;
  drag.prev.el.style.transform = `translateX(${-101 + 101*p}px)`; drag.prev.el.style.filter = `brightness(${.9 + .1*p})`;
  drag.cur.el._dragX = dx; drag.prev.el._dragX = -101 + 101*p;
});
const endDrag = e => {
  if (!drag) return; const d = drag; drag = null;
  const dx = d.cur.el._dragX || 0;
  if (dx > 130 || d.v > .45){ d.cur.el.style.transform = ''; d.prev.el.style.filter = ''; back(); }
  else {
    d.cur.el.animate([{transform:`translateX(${dx}px)`},{transform:'none'}],{duration:500,easing:SMOOTH});
    d.prev.el.animate([{transform:`translateX(${d.prev.el._dragX}px)`},{transform:'translateX(-101px)'}],{duration:500,easing:SMOOTH}).onfinish = () => { d.prev.el.style.visibility = 'hidden'; };
    d.cur.el.style.transform = ''; d.prev.el.style.transform = ''; d.prev.el.style.filter = ''; delete d.cur.el._dragX; delete d.prev.el._dragX;
  }
};
edge.addEventListener('pointerup', endDrag); edge.addEventListener('pointercancel', endDrag);

// —— 底部导航：几乎透明的玻璃胶囊，选中的那格有一块会滑动的亮片
const tb = document.getElementById('tabbar'), cap = document.getElementById('cap');
let tabsHidden = false, tabLock = false;
function placeCap(id, animate){
  const btn = tb.querySelector(`[data-t="${id}"]`); if (!btn) return;
  tb.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
  const x = btn.offsetLeft, w = btn.offsetWidth;
  const from = cap._x;
  cap.style.width = w + 'px'; cap.style.transform = `translateX(${x}px)`;
  if (animate && from !== undefined && from !== x){
    const dir = Math.sign(x - from);
    cap.animate([{transform:`translateX(${from}px) scaleX(1)`},{transform:`translateX(${(from+x)/2}px) scaleX(1.18)`, offset:.4},{transform:`translateX(${x}px) scaleX(1)`}],{duration:620,easing:SOFT});
  }
  cap._x = x;
}
function showTabbar(){ if (!tabsHidden || tabLock) return; tabsHidden = false; tb.style.pointerEvents = ''; tb.animate([{transform:'translate(-50%,140%)',opacity:0},{transform:'translate(-50%,0)',opacity:1}],{duration:620,easing:SOFT,fill:'forwards'}); }
function hideTabbar(){ if (tabsHidden) return; tabsHidden = true; tb.style.pointerEvents = 'none'; tb.animate([{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,140%)',opacity:0}],{duration:420,easing:SMOOTH,fill:'forwards'}); }
function tabbarFor(id){ if (TABS.includes(id)){ placeCap(id, true); showTabbar(); } else hideTabbar(); }
tb.addEventListener('click', e => {
  const b = e.target.closest('button[data-t]'); if (!b) return;
  const id = b.dataset.t, cur = stack[stack.length-1];
  if (cur && cur.id === id){ // 再点一次：回到顶部
    const sc = cur.el.shadowRoot.querySelector('.scroll'); sc && sc.scrollTo({top:0, behavior:'smooth'}); return; }
  placeCap(id, true);
  go(id, 'tab');
});
pressable(tb);

let tt;
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg;
  t.getAnimations().forEach(a => a.cancel());
  t.animate([{opacity:0, transform:'translate(-50%,-14px) scale(.92)'},{opacity:1, transform:'translate(-50%,0) scale(1)'}],{duration:520,easing:SOFT,fill:'forwards'});
  clearTimeout(tt); tt = setTimeout(() => t.animate([{opacity:1, transform:'translate(-50%,0)'},{opacity:0, transform:'translate(-50%,-10px) scale(.96)'}],{duration:300,easing:'ease-in',fill:'forwards'}), 1900);
}
function haptic(el){ el.animate([{scale:'1'},{scale:'1.04'},{scale:'1'}],{duration:360,easing:'ease-out'}); }
const api = {go, back, popTo, toast, zoomOpen, openBook, spring, haptic, hideTabbar, showTabbar, tabbar:(on) => { if (on){ tabLock = false; showTabbar(); } else { hideTabbar(); tabLock = true; } }};

// —— 左边目录
const side = document.getElementById('side');
const GROUPS = [
  ['手账', ['Home','NewJournal','Style','PageStyle','JournalOpen','LookBack','Guide']],
  ['编辑一页', ['Page','Editor','EditorAdd','EditorSelect','PhotoSticker','EditorText']],
  ['画画和颜色', ['Draw','Brushes','Palettes','ColorWheel']],
  ['素材（第 2 格）', ['Studio','Pack','MyStickers']],
  ['一起做（第 3 格 · 待定）', ['Together','StartBook','Invite','BookDetail','OpenBook']],
  ['个人主页（第 4 格）', ['Profile','Settings']],
  ['其他', ['Checklist']],
];
let html = '<h1>Caixu · Preview</h1><p>手账首页照 Zinnia 的排版重做，其余按稿图。界面文字用英文。点屏幕上的按钮会跳转，从左边缘往右拖可以返回。</p>';
for (const [g, ids] of GROUPS){
  html += `<div class="g">${g}</div>`;
  for (const id of ids){ if (!S[id]) continue; const [code, ...name] = S[id].title.split(' '); html += `<button data-id="${id}"><i>${code}</i>${name.join(' ')}</button>`; }
}
side.innerHTML = html + '<button id="closeMenu" class="close">← 回到预览</button>';
side.addEventListener('click', e => {
  if (e.target.closest('#closeMenu')){ document.body.classList.remove('menu'); return; }
  const b = e.target.closest('button[data-id]'); if (!b) return;
  document.body.classList.remove('menu');
  jump(b.dataset.id);
});
function jump(id){
  if (busy) return;
  stack.forEach(s => s.el.remove()); stack = [];
  const base = TABS.includes(id) ? null : (window.PARENT||{})[id];
  const mode = modeFor(id);
  if (base){
    const be = build(base); mount(be);
    if (mode !== 'sheet') be.style.visibility = 'hidden';
    stack.push({id:base, el:be, mode:'push'});
  }
  const el = build(id); mount(el);
  stack.push({id, el, mode: base ? (mode === 'zoom' ? 'push' : mode) : 'push'});
  if (mode === 'sheet' && base){ const sh = sheetOf(el); el.animate([{opacity:0},{opacity:1}],{duration:340}); if (sh) sh.animate([{transform:'translateY(100%)'},{transform:'none'}],{duration:800,easing:SMOOTH}); }
  else el.animate([{opacity:0, transform:'scale(.985)'},{opacity:1, transform:'none'}],{duration:420,easing:SOFT});
  tabbarFor(id);
  mark();
}
function mark(){
  const id = stack.length ? stack[stack.length-1].id : '';
  side.querySelectorAll('button[data-id]').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  const lab = document.getElementById('menuBtn'); if (lab) lab.textContent = S[id] ? S[id].title + ' · 目录' : '目录';
  try{ history.replaceState(null,'','#p-'+id); }catch(e){}
}
document.getElementById('backBtn').onclick = back;
document.getElementById('homeBtn').onclick = () => jump('Home');
document.getElementById('menuBtn').onclick = () => document.body.classList.add('menu');
addEventListener('keydown', e => { const p = e.composedPath ? e.composedPath()[0] : e.target; if (p && (p.isContentEditable || /INPUT|TEXTAREA/.test(p.tagName))) return; if (e.key === 'Escape' || (e.key === 'ArrowLeft' && e.altKey)) back(); });

function fit(){
  const m = document.getElementById('main');
  const small = innerWidth <= 760;
  const s = small ? Math.min(m.clientWidth/390, m.clientHeight/844) : Math.min((m.clientWidth-60)/410, (m.clientHeight-120)/864, 1.15);
  phone.style.transform = `scale(${s})`;
}
addEventListener('resize', fit); fit();

// 预先把图片都加载好，切屏时不会一块一块地蹦出来
setTimeout(() => {
  const seen = new Set();
  Object.values(S).forEach(s => (s.html.match(/(?:src="|url\()(img\/[^")]+)/g)||[]).forEach(m => { const u = m.replace(/^(src="|url\()/,''); if (!seen.has(u)){ seen.add(u); const i = new Image(); i.decoding = 'async'; i.src = u; } }));
}, 300);

window.CX = {go, back, jump, toast, stack:()=>stack};
let start = '';
try{ start = decodeURIComponent(location.hash.replace(/^#p-/,'')); }catch(e){}
placeCap('Home', false);
if (S[start]) jump(start); else { go('Home'); tabbarFor('Home'); }
})();
