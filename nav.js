// 每一屏上哪里能点、点了去哪（文字都按稿图英文）
const A = l => `[aria-label="${l}"]`;
const T = (t, go, extra) => Object.assign({t, go}, extra || {});
const Q = (sel, go, extra) => Object.assign({sel, go}, extra || {});
window.NAV = {
  Checklist: [
    Q(A('Close'), 'Home', {mode:'tab'}), T('Skip for now', 'Home', {mode:'tab'}),
    Q('.item', 'Editor', {n:0}), Q('.item', 'PhotoSticker', {n:1}), Q('.item', 'Draw', {n:2}), Q('.item', 'StartBook', {n:3}),
    Q('.cta', 'PhotoSticker'),
  ],
  NewJournal: [
    Q(A('Close'), 'back'),
    Q('.opt', 'Style', {n:0}),
    Q('.opt', 'Style', {n:1}),
    Q('.opt', 'Studio', {n:2, mode:'tab'}),
    Q('.opt', 'StartBook', {n:3}),
    Q('.imp', '', {toast:'Opens Files to pick a PDF'}),
    {r:[0,0,390,270], go:'back'},
  ],
  PageStyle: [
    Q(A('Back'), 'back'),
    Q('.into', 'JournalOpen'),
    Q('.cta', 'Editor', {toast:'New page added to Everyday', popTo:['JournalOpen','Home']}),
  ],
  JournalOpen: [
    Q(A('Back'), 'back'),
    Q(A('Look back'), 'LookBack'),
    Q(A('More'), '', {toast:'Change cover · Rename · Export PDF'}),
    Q('.grid .pg', 'Editor', {all:true, zoom:true}),
    Q('.fab', 'PageStyle'),
  ],
  LookBack: [
    Q(A('Back'), 'back'),
    Q(A('Share month'), '', {toast:'Save this month as an image'}),
    Q(A('Previous month'), '', {toast:'October'}),
    Q(A('Next month'), '', {toast:'December hasn’t started yet'}),
    Q('.d.has', 'Editor', {all:true, zoom:true}),
    Q('.otd', 'Editor'),
  ],
  Editor: [
    Q(A('Back to journal'), 'back'),
    Q(A('Stickers'), 'MyStickers'),
    Q(A('Add'), 'EditorAdd'),
    Q(A('Undo'), '', {toast:'Undo'}), Q(A('Redo'), '', {toast:'Redo'}),
    Q(A('More'), '', {toast:'Paper · Flip through · Share page'}),
    Q(A('Previous page'), '', {toast:'Page 23'}), Q(A('Next page'), '', {toast:'This is the last page'}),
    Q(A('Add page'), 'PageStyle'),
    Q('img[alt="Latte sticker"]', 'EditorSelect'),
    Q('.hand', 'EditorText'), Q('.date', 'EditorText'),
  ],
  EditorAdd: [
    Q(A('Back to journal'), 'back'), Q(A('Close add menu'), 'back'), Q(A('Stickers'), 'MyStickers'),
    T('Sticker', 'MyStickers'), T('Text', 'EditorText'), T('Draw', 'Draw'),
    T('Tape', '', {toast:'Tape: 12 washi tapes'}), T('Shape', '', {toast:'Shapes: circle, square, speech bubble, arrow'}),
    T('All photos', '', {toast:'Opens your photo library'}),
    Q('.a1', 'back', {toast:'Photo added to the page'}),
    Q('.a2', 'PhotoSticker'),
  ],
  EditorSelect: [
    Q(A('Back to journal'), 'back'), Q(A('Add'), 'EditorAdd'), Q(A('Stickers'), 'MyStickers'),
    Q(A('Undo'), 'back', {toast:'Undo'}),
    T('Lock', '', {toast:'Locked in place'}), T('Crop', '', {toast:'Drag the corners to crop'}),
    T('Layer', '', {toast:'Brought to front'}), T('Flip', '', {fn:'flip'}), T('Copy', '', {toast:'Duplicated'}),
    Q('.del', 'back', {toast:'Sticker deleted'}),
  ],
  PhotoSticker: [
    T('Cancel', 'back'), T('Retry', '', {toast:'Finding the edges again…'}),
    Q(A('Erase edges'), '', {toast:'Rub away the extra bits'}), Q(A('Restore edges'), '', {toast:'Paint back what was cut'}),
    Q('.cta', 'EditorSelect', {toast:'Saved to My Stickers', mode:'replace', popTo:['Editor']}),
  ],
  EditorText: [ Q(A('Cancel text'), 'back'), Q('.done', 'back') ],
  Draw: [
    Q(A('Leave drawing'), 'back'), Q('.done', 'back', {toast:'Drawing placed on the page'}),
    Q(A('Steady hand settings'), '', {toast:'Steady hand: on · medium'}),
    Q(A('Undo'), '', {toast:'Undo'}), Q(A('Redo'), '', {toast:'Redo'}),
    Q(A('Palettes'), 'Palettes'), Q(A('Brush, selected'), 'Brushes'), Q(A('Brush settings'), 'Brushes'),
  ],
  Brushes: [ Q(A('Close'), 'back'), {r:[0,0,390,290], go:'back'} ],
  Palettes: [
    T('Wheel', 'ColorWheel', {mode:'replace'}), T('Pick', '', {toast:'Tap the page to pick a color'}),
    T('From photo', '', {toast:'Pick a photo, we pull 6 colors from it'}),
    Q('.newp', 'ColorWheel', {mode:'replace'}), {r:[0,0,390,200], go:'back'},
  ],
  ColorWheel: [
    T('Sets', 'Palettes', {mode:'replace'}), T('Pick', '', {toast:'Tap the page to pick a color'}),
    T('From photo', '', {toast:'Pick a photo, we pull 6 colors from it'}),
    Q('.add', 'back', {toast:'Added to Rainy Sunday'}), {r:[0,0,390,160], go:'back'},
  ],
  Studio: [
    T('All 18', 'MyStickers'),
    Q(A('Make a sticker from a photo'), 'PhotoSticker'),
    Q('.cv', '', {all:true, toast:'Added to My Journals'}),
    Q('.pk', 'Pack', {all:true, zoom:true}),
  ],
  Pack: [
    Q(A('Back'), 'back'), Q(A('Share pack'), '', {toast:'Share this pack'}),
    Q('.b1', '', {fn:'added'}), Q(A('Save to favorites'), '', {fn:'heart'}),
  ],
  MyStickers: [
    Q(A('Back'), 'back'), T('Select', '', {toast:'Tap stickers to select or delete'}),
    Q('.make', 'PhotoSticker'), Q('.st', '', {all:true, toast:'Stuck on your open page'}),
  ],
  Together: [
    Q('.start', 'StartBook'), T('Make my page', 'Editor'),
    Q('.row', 'BookDetail', {n:0, zoom:true}), Q('.row', 'OpenBook', {n:1}),
  ],
  StartBook: [ Q(A('Close'), 'back'), Q('.cta', 'Invite') ],
  Invite: [
    Q(A('Back'), 'back'), T('Edit message', '', {toast:'Write it in your own words'}),
    T('Messages', '', {toast:'Opens Messages'}), T('Copy link', '', {toast:'Link copied'}),
    T('QR code', '', {toast:'Show a QR code to scan'}), T('More', '', {toast:'Mail, AirDrop, more…'}),
    Q('.cta', 'BookDetail', {toast:'Invite sent', popTo:['Together']}),
    Q('.alt', 'Editor'),
  ],
  BookDetail: [
    Q(A('Back'), 'back'), Q(A('Book settings'), '', {toast:'Date · Prompt · Close the book'}),
    Q('.wait', '', {all:true, fn:'nudge'}), Q('.env', '', {all:true, toast:'Pages stay sealed until the book opens'}),
    Q('.b2', 'Invite'), Q('.b1', 'OpenBook', {toast:'Sent. Leo can open it now'}),
    Q('.print', '', {toast:'Printing opens once the book is sent'}),
  ],
  OpenBook: [
    Q(A('Close book'), 'back'), Q(A('Look through all pages'), '', {toast:'All 9 pages'}),
    Q(A('Send a heart'), '', {fn:'heart'}), Q(A('Send'), '', {toast:'Sent to Ben'}),
    Q('.b1', '', {toast:'Choose a size and print it as a book'}), Q('.b2', '', {toast:'Thank-you sent to 8 friends'}),
    Q('.pg.prev', '', {toast:'Priya’s page'}), Q('.pg.next', '', {toast:'Jonas’s page'}),
  ],
  Settings: [
    Q(A('Back'), 'back'),
    Q('.it', '', {n:0, toast:'Export all journals as PDF'}), Q('.it', '', {n:1, toast:'Dots · Lines · Grid · Plain'}),
    Q('.it', '', {n:2, toast:'English · 简体中文'}), Q('.it', '', {n:3, toast:'Send us a note'}),
  ],
};
window.PARENT = {
  Checklist:'Home', NewJournal:'Home', Style:'NewJournal', PageStyle:'NewJournal', JournalOpen:'Home', Page:'Home', LookBack:'JournalOpen', Guide:'Home',
  Editor:'Home', EditorAdd:'Editor', EditorSelect:'Editor', PhotoSticker:'EditorAdd', EditorText:'Editor',
  Draw:'Editor', Brushes:'Draw', Palettes:'Draw', ColorWheel:'Draw', Pack:'Studio', MyStickers:'Studio',
  StartBook:'Together', Invite:'StartBook', BookDetail:'Together', OpenBook:'Together', Settings:'Profile',
};
window.SHEET = {
  NewJournal:'Begin something new', Style:'Choose a Page Style', PageStyle:'Choose a page style', EditorAdd:'Recent photos', EditorSelect:'Lock',
  EditorText:'Handwriting', Brushes:'Search brushes', Palettes:'New color set', ColorWheel:'Mix a color',
};
window.MODAL = { PhotoSticker:1, StartBook:1, OpenBook:1, Guide:1 };
window.TABS = ['Home','Studio','Together','Profile'];
// 稿图里原来的三格底栏不用了，换成全局那条几乎透明的
window.SCREEN_CSS = { Studio:'.pill{display:none}', Together:'.pill{display:none}',
  // 新建、选页面样式是盖在手账首页上的面板：去掉稿图里画的旧背景，直接透出下面真正的那一屏
  NewJournal:'.root{background:transparent!important}.bgc{visibility:hidden}',
  PageStyle:'.root{background:transparent!important}',
};
window.SCREEN_FN = {
  flip(root){ const s = root.querySelector('img[alt^="Latte sticker"]'); if (!s) return;
    s.animate([{scale:'1 1'},{scale:'-1 1'}],{duration:520,fill:'forwards',easing:'cubic-bezier(.3,1.3,.5,1)'}); },
  added(root, b, cx){ if (b.dataset.done) return; b.dataset.done = 1; b.style.transition='background-color .4s'; b.style.background = '#4F6E45';
    b.childNodes[b.childNodes.length-1].textContent = 'Added'; cx.toast('24 stickers added to My Stickers'); },
  heart(root, b, cx){ const on = b.classList.toggle('liked');
    b.querySelectorAll('path').forEach(p => { if (p.dataset.of === undefined) p.dataset.of = p.getAttribute('fill') || 'none'; p.setAttribute('fill', on ? '#C9472F' : p.dataset.of); p.setAttribute('stroke', on ? '#C9472F' : 'currentColor'); });
    b.animate([{scale:'1'},{scale:'1.3'},{scale:'1'}],{duration:420,easing:'cubic-bezier(.3,1.6,.5,1)'}); },
  nudge(root, b, cx){ const n = b.textContent.replace('Nudge','').trim(); cx.toast(`Nudged ${n} · 11 days left`);
    const s = [...b.querySelectorAll('*')].find(x => x.textContent.trim() === 'Nudge'); if (s){ s.textContent = 'Nudged'; s.style.opacity = '.6'; } },
};
