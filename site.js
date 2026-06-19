
(function(){
  var b=document.body, prev=b.getAttribute('data-prev'), next=b.getAttribute('data-next');
  // ---- fast in-page scrolling (tune SCROLL_MS for speed; native smooth-scroll is too slow) ----
  var SCROLL_MS=180;
  function headerOffset(){ var m=document.querySelector('.mtop'); return (m&&m.offsetHeight)?m.offsetHeight+8:14; }
  function animateTo(y){
    if('matchMedia'in window&&matchMedia('(prefers-reduced-motion: reduce)').matches){window.scrollTo(0,y);return;}
    var sy=window.pageYOffset, d=y-sy, st=null;
    function ease(t){return 1-Math.pow(1-t,3);}            // easeOutCubic
    function step(ts){ if(st===null)st=ts; var p=Math.min((ts-st)/SCROLL_MS,1);
      window.scrollTo(0, sy+d*ease(p)); if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function scrollToHash(hash,push){
    var el=document.getElementById(decodeURIComponent(hash.slice(1))); if(!el)return false;
    var y=el.getBoundingClientRect().top+window.pageYOffset-headerOffset();
    animateTo(Math.max(0,y));
    if(push&&history.replaceState)history.replaceState(null,'',hash);
    return true;
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="#"]'); if(!a)return;
    var href=a.getAttribute('href'); if(href.length<2)return;
    if(scrollToHash(href,true)){e.preventDefault();b.classList.remove('nav-open');}
  });
  // honor a #hash present on initial load (with our offset, not the browser's)
  if(location.hash.length>1){var hh=location.hash;setTimeout(function(){scrollToHash(hh,false);},0);}
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey) return;
    var t=(e.target.tagName||'').toUpperCase();
    if(t==='INPUT'||t==='TEXTAREA') return;
    if(e.key==='ArrowLeft'&&prev){location.href=prev;}
    else if(e.key==='ArrowRight'&&next){location.href=next;}
  });
  window.toggleNav=function(){b.classList.toggle('nav-open');};
  var bd=document.querySelector('.backdrop'); if(bd) bd.addEventListener('click',function(){b.classList.remove('nav-open');});
  document.querySelectorAll('.sidebar a').forEach(function(a){a.addEventListener('click',function(){b.classList.remove('nav-open');});});
  // keep active topic visible in sidebar
  var sb=document.querySelector('.sidebar'), act=document.querySelector('.topic.active');
  if(sb&&act){ sb.scrollTop=Math.max(0, act.offsetTop-130); }
  // scrollspy: highlight current heading in BOTH the left subtopics (h2 only) and the
  // right "On this page" TOC (h2 + h3). One observer over the union of heading ids drives both.
  function ensureVisible(a){ if(a.scrollIntoView){var r=a.getBoundingClientRect(); if(r.top<70||r.bottom>window.innerHeight)a.scrollIntoView({block:'nearest'});} }
  function collect(sel){var m={}; document.querySelectorAll(sel).forEach(function(a){var h=a.getAttribute('href'); if(h&&h.charAt(0)==='#')m[h.slice(1)]=a;}); return m;}
  var spyL=collect('.subtopics a.spy'), spyR=collect('.toc-right a');
  // right rail accordion: map each heading id -> its h2 group <li>, so scrolling/clicking can
  // open the active group and collapse the rest.
  var idToGrp={}, openGrp=null;
  [].slice.call(document.querySelectorAll('.toc-grp')).forEach(function(g){
    g.querySelectorAll('a[href^="#"]').forEach(function(a){ idToGrp[a.getAttribute('href').slice(1)]=g; });
  });
  function openGroup(id){
    var g=idToGrp[id]; if(!g||g===openGrp)return;
    if(openGrp)openGrp.classList.remove('open');
    g.classList.add('open'); openGrp=g;
  }
  // clicking a TOC entry expands its group immediately (don't wait for the scroll to land)
  document.querySelectorAll('.toc-right a').forEach(function(a){
    a.addEventListener('click',function(){ openGroup(a.getAttribute('href').slice(1)); });
  });
  var idset={}; Object.keys(spyL).forEach(function(k){idset[k]=1;}); Object.keys(spyR).forEach(function(k){idset[k]=1;});
  var ids=Object.keys(idset);
  if(ids.length&&'IntersectionObserver'in window){
    var curL=null,curR=null;
    var obs=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(en.isIntersecting){
          var id=en.target.id;
          var al=spyL[id]; if(al&&al!==curL){ if(curL)curL.classList.remove('current'); al.classList.add('current'); curL=al; ensureVisible(al); }
          var ar=spyR[id]; if(ar&&ar!==curR){ openGroup(id); if(curR)curR.classList.remove('current'); ar.classList.add('current'); curR=ar; ensureVisible(ar); }
        }
      });
    },{rootMargin:'0px 0px -78% 0px',threshold:0});
    ids.forEach(function(id){var el=document.getElementById(id); if(el)obs.observe(el);});
  }
})();
