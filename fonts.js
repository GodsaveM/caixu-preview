// 字体随页面一起发布，用 FontFace 加载（Shadow DOM 里的每一屏也能用到）
(function(){
  const F = [
    ['Fraunces','f/fraunces.woff2',{weight:'100 900',style:'normal'}],
    ['Fraunces','f/fraunces-i.woff2',{weight:'100 900',style:'italic'}],
    ['Inter','f/inter.woff2',{weight:'100 900'}],
    ['Caveat','f/caveat.woff2',{weight:'400 700'}],
    ['Noto Serif SC','f/serif-500.woff2',{weight:'100 550'}],
    ['Noto Serif SC','f/serif-600.woff2',{weight:'551 900'}],
    ['Noto Sans SC','f/sans-400.woff2',{weight:'100 450'}],
    ['Noto Sans SC','f/sans-500.woff2',{weight:'451 550'}],
    ['Noto Sans SC','f/sans-600.woff2',{weight:'551 900'}],
    ['WK Hand','f/wenkai.woff2',{sizeAdjust:'90%'}],
  ];
  for (const [name, url, d] of F){
    fetch(url).then(r => r.arrayBuffer()).then(buf => {
      const ff = new FontFace(name, buf, d); return ff.load();
    }).then(ff => document.fonts.add(ff)).catch(() => {});
  }
})();
