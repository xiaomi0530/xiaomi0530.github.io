(() => {
  'use strict';

  const data = window.PORTFOLIO_DATA || { projects: [] };
  const grid = document.querySelector('#projects-grid');
  const detail = document.querySelector('#detail-dialog');
  const detailContent = document.querySelector('#detail-content');
  const viewer = document.querySelector('#image-viewer');
  const toast = document.querySelector('.toast');
  const header = document.querySelector('.site-header');
  const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch] || ch));

  function cover(project) {
    const id = project.id;
    if (id === 'project-sxq') return '<div class="project-art chip-art"><div class="chip-grid"></div><div class="chip"><span>SXQ / 01</span><strong>RISC-V</strong><small>2.76 COREMARK / MHZ</small></div></div>';
    if (id === 'project-rv32i') return '<div class="project-art terminal-art"><div class="terminal-window"><div class="terminal-bar"><i></i><i></i><i></i><span>m-cpu / terminal</span></div><div class="terminal-body"><div class="terminal-logo">M-CPU</div><div class="command">$ boot --rtos<br>&gt; mounting /dev/sd0<br>&gt; vga: 25MHz online<br>&gt; system ready<span>_</span></div></div></div></div>';
    if (id === 'project-myopia') return '<div class="project-art research-art"><div class="research-grid"></div><div class="research-orb"></div><div class="research-title">DEEP VISION<small>HIGH MYOPIA / NEURAL PREDICTION</small></div></div>';
    if (id === 'project-breadboard') return `<div class="project-art breadboard-art"><img src="${escapeHtml(project.cover)}" alt="" loading="lazy"><span class="photo-caption">A PROCESSOR, BY HAND</span></div>`;
    if (id === 'project-touch') return '<div class="project-art touch-art"><div class="touch-word">Touch<small>LEAVE A TRACE</small></div><img class="touch-phone" src="fig/Touch/Touch_1.jpg" alt="Touch 应用界面" loading="lazy"></div>';
    return '<div class="project-art syn-art"><div class="syn-layers"><i></i><i></i><i></i><i></i></div><div class="syn-caption">RTL → GDSII<small>SYNOPSYS SUMMER SCHOOL</small></div></div>';
  }

  function card(project, index) {
    const category = escapeHtml(project.category);
    const title = escapeHtml(project.title);
    return `<article class="project-card reveal" data-category="${category}" style="--card-index:${index}">
      <button class="project-open" type="button" data-project="${escapeHtml(project.id)}" aria-label="查看项目：${title}">
        ${cover(project)}
        <span class="project-number">${escapeHtml(project.number)} / 06</span><span class="project-open-icon" aria-hidden="true"><img src="fig/ui/arrow-up-right.svg" alt=""></span>
        <div class="project-info"><div class="project-meta">${escapeHtml(project.period)}　/　${escapeHtml(project.role)}</div>
          <h3>${title}<small>${escapeHtml(project.english || '')}</small></h3><p>${escapeHtml(project.summary)}</p>
          <div class="project-tags">${(project.tags || []).slice(0, 4).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        </div>
      </button>
    </article>`;
  }

  if (grid) grid.innerHTML = data.projects.map(card).join('');

  const foodArchive = document.querySelector('#food-archive');
  const foodMedia = [...(data.food?.meal || []), ...(data.food?.dessert || [])];
  if (foodArchive && foodMedia.length) {
    foodArchive.innerHTML = `<div class="food-archive-head"><div><span class="detail-section-label">KITCHEN ARCHIVE / ${String(foodMedia.length).padStart(2, '0')}</span><h3>把日常，也做成作品。</h3></div><p>正餐与甜品的完整记录<br>一张张收集生活的温度。</p></div><div class="food-archive-grid">${foodMedia.map((src, i) => `<button type="button" class="food-tile" data-food-media="${escapeHtml(src)}" data-food-index="${i}" aria-label="查看餐食记录 ${i + 1}"><img src="${escapeHtml(src)}" alt="餐食记录 ${i + 1}" loading="lazy"><span>${String(i + 1).padStart(2, '0')}</span></button>`).join('')}</div>`;
  }

  let detailReturnFocus = null;
  let activeProjectIndex = -1;
  let detailCloseTimer = null;
  let viewerReturnFocus = null;
  let viewerScale = 1;
  let viewerMedia = [];
  let viewerIndex = 0;
  let viewerDrag = null;
  const viewerImage = viewer?.querySelector('.viewer-image');

  const themeById = { 'project-sxq':['sxq','blueprint'], 'project-rv32i':['rv32i','timeline'], 'project-myopia':['myopia','research'], 'project-breadboard':['breadboard','lab'], 'project-touch':['touch','app'], 'project-synopsys':['synopsys','ic-flow'] };
  const getProjectTheme = project => { const fallback = themeById[project?.id] || ['default','blueprint']; return { theme: project?.detailTheme || fallback[0], layout: project?.detailLayout || fallback[1] }; };
  const mediaList = project => (project?.media || []).filter(item => item && item.src);
  const mediaLabel = type => String(type || 'image').toLowerCase() === 'video' ? 'VIDEO' : 'IMAGE';
  function setModalState(open) { document.body.classList.toggle('modal-open', open); }
  function closeDialog(dialog, returnFocus) { if (!dialog) return; dialog.classList.add('is-closing'); const delay = prefersReducedMotion ? 0 : 280; const finish = () => { dialog.classList.remove('is-closing'); if (dialog.open) dialog.close(); if (![detail,viewer].some(d=>d?.open)) setModalState(false); if (returnFocus?.focus) window.setTimeout(()=>returnFocus.focus(),0); }; if (dialog===detail) { window.clearTimeout(detailCloseTimer); detailCloseTimer=window.setTimeout(finish,delay); } else window.setTimeout(finish,delay); }
  function renderDetailHero(project) { const media=mediaList(project), lead=media[0]; const leadMarkup=lead ? (String(lead.type).toLowerCase()==='video' ? `<div class="detail-hero-media detail-video-wrap"><video controls muted playsinline preload="metadata" ${lead.poster?`poster="${escapeHtml(lead.poster)}"`:''}><source src="${escapeHtml(lead.src)}"></video><span class="media-status">VIDEO</span></div>` : `<button class="detail-hero-media detail-image-wrap" type="button" data-zoomable data-media-index="0"><img src="${escapeHtml(lead.src)}" alt="${escapeHtml(lead.alt||project.title)}" loading="eager"><span class="media-status">IMAGE · 01</span></button>`) : '<div class="detail-hero-media media-placeholder"><span>MEDIA UNAVAILABLE</span></div>'; return `<section class="detail-hero" data-reveal="hero"><div class="detail-hero-copy"><p class="detail-kicker">${escapeHtml(project.number)} / ${escapeHtml(project.category||'PROJECT')}</p><h2 id="detail-title">${escapeHtml(project.title)}</h2><p class="detail-english">${escapeHtml(project.english||'')}</p><p class="detail-summary" id="detail-description">${escapeHtml(project.summary||'')}</p><div class="detail-meta"><span>${escapeHtml(project.period||'')}</span><span>${escapeHtml(project.role||'')}</span><span class="detail-theme-label">${escapeHtml(getProjectTheme(project).layout)}</span></div></div>${leadMarkup}</section>`; }
  function renderMetrics(metrics=[]) { if(!metrics.length) return ''; return `<section class="detail-metrics" aria-label="项目指标">${metrics.map((m,i)=>`<div class="metric-card" style="--metric-index:${i}"><strong>${escapeHtml(m.value)}</strong><span>${escapeHtml(m.label||'')}</span></div>`).join('')}</section>`; }
  function renderStory(paragraphs=[]) { const body=paragraphs.length?paragraphs:['暂无项目说明。']; return `<section class="detail-story" data-reveal="story"><div class="detail-section-label">PROJECT NOTES</div>${body.map((t,i)=>`<article class="detail-story-block"><span class="story-index">0${i+1}</span><p>${escapeHtml(t)}</p></article>`).join('')}</section>`; }
  function renderMedia(project) { const media=mediaList(project).slice(1); if(!media.length) return ''; return `<section class="detail-media detail-media-${escapeHtml(getProjectTheme(project).layout)}" aria-label="项目媒体"><div class="detail-section-label">MEDIA / ${String(media.length).padStart(2,'0')}</div><div class="detail-media-grid">${media.map((m,i)=>{ const mediaIndex=i+1, type=String(m.type||'image').toLowerCase(), caption=m.alt||`${project.title} ${mediaIndex+1}`; if(type==='video') return `<figure class="detail-media-card media-video" style="--media-index:${i}"><div class="media-frame"><video controls muted playsinline preload="metadata" ${m.poster?`poster="${escapeHtml(m.poster)}"`:''}><source src="${escapeHtml(m.src)}"></video><span class="media-status">${mediaLabel(type)} · ${String(mediaIndex+1).padStart(2,'0')}</span></div><figcaption>${escapeHtml(caption)}</figcaption></figure>`; return `<figure class="detail-media-card media-image" style="--media-index:${i}"><button type="button" class="media-frame" data-zoomable data-media-index="${mediaIndex}" aria-label="查看图片：${escapeHtml(caption)}"><img src="${escapeHtml(m.src)}" alt="${escapeHtml(caption)}" loading="lazy"><span class="media-status">${mediaLabel(type)} · ${String(mediaIndex+1).padStart(2,'0')}</span></button><figcaption>${escapeHtml(caption)}</figcaption></figure>`; }).join('')}</div></section>`; }
  function renderProjectNavigation(index) { const total=data.projects.length, p=data.projects[(index-1+total)%total], n=data.projects[(index+1)%total], project=data.projects[index]; return `<nav class="detail-footer" aria-label="项目导航"><div class="detail-nav-actions"><button type="button" data-detail-nav="prev" data-project="${escapeHtml(p.id)}">← ${escapeHtml(p.title)}</button><a class="detail-repo" href="${project.repo?escapeHtml(project.repo):'#projects'}" ${project.repo?'target="_blank" rel="noreferrer"':''}>${project.repo?'在 GitHub 查看仓库 ↗':'返回项目列表 ↑'}</a><button type="button" data-detail-nav="next" data-project="${escapeHtml(n.id)}">${escapeHtml(n.title)} →</button></div></nav>`; }
  function renderDetail(project,index=activeProjectIndex) { if(!detailContent||!project) return; const {theme,layout}=getProjectTheme(project), total=data.projects.length; detail.className=`detail-dialog theme-${theme} layout-${layout}`; detail.dataset.theme=theme; detail.dataset.layout=layout; detail.setAttribute('aria-labelledby','detail-title'); detail.setAttribute('aria-describedby','detail-description'); detailContent.innerHTML=`<div class="detail-shell"><header class="detail-header"><div><span class="detail-kicker">${escapeHtml(project.number)} / ${String(total).padStart(2,'0')}</span><span class="detail-category">${escapeHtml(project.category||'PROJECT')}</span></div><div class="detail-header-actions"><span class="detail-counter">${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}</span><div class="detail-nav"><button type="button" class="detail-prev" data-detail-nav="prev" data-project="${escapeHtml(data.projects[(index-1+total)%total].id)}" aria-label="上一个项目">←</button><button type="button" class="detail-next" data-detail-nav="next" data-project="${escapeHtml(data.projects[(index+1)%total].id)}" aria-label="下一个项目">→</button></div><button type="button" class="detail-close-inline" aria-label="关闭项目详情">×</button></div></header>${renderDetailHero(project)}${renderMetrics(project.metrics)}<div class="detail-main">${renderStory(project.paragraphs)}<aside class="detail-aside"><small>STACK / TOOLS</small><div class="detail-tags">${(project.tags||[]).map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div></aside></div>${renderMedia(project)}${renderProjectNavigation(index)}<div class="detail-scroll-progress" aria-hidden="true"><i></i></div></div>`; detailContent.querySelectorAll('img,video').forEach(el=>el.addEventListener('error',()=>el.closest('.media-frame,.detail-hero-media')?.classList.add('media-error'))); detailContent.querySelectorAll('[data-detail-nav]').forEach(btn=>btn.addEventListener('click',()=>openProject(btn.dataset.project,btn))); detailContent.querySelector('.detail-close-inline')?.addEventListener('click',()=>closeDialog(detail,detailReturnFocus)); const shell=detailContent.querySelector('.detail-shell'); shell?.addEventListener('scroll',()=>{const max=shell.scrollHeight-shell.clientHeight, ratio=max>0?shell.scrollTop/max:0; detailContent.querySelector('.detail-scroll-progress i')?.style.setProperty('--progress',ratio.toFixed(3));},{passive:true}); requestAnimationFrame(()=>detailContent.querySelectorAll('[data-reveal],.metric-card,.detail-media-card').forEach((el,i)=>{el.style.setProperty('--reveal-index',i);el.classList.add('is-visible');})); }
  function openProject(id,opener) { const index=data.projects.findIndex(item=>item.id===id); if(index<0||!detail||!detailContent) return; activeProjectIndex=index; detailReturnFocus=opener||document.activeElement; renderDetail(data.projects[index],index); if(!detail.open){detail.classList.remove('is-closing'); detail.showModal();} setModalState(true); detailContent.querySelector('.detail-shell')?.scrollTo({top:0,behavior:'auto'}); window.setTimeout(()=>detail.querySelector('.detail-close-inline, .dialog-close')?.focus(),prefersReducedMotion?0:180); }
  grid?.addEventListener('click',event=>{const opener=event.target.closest('[data-project]'); if(opener) openProject(opener.dataset.project,opener);});
  const detailClose=detail?.querySelector('.dialog-close'); if(detailClose){detailClose.type='button'; detailClose.addEventListener('click',()=>closeDialog(detail,detailReturnFocus));} detail?.addEventListener('click',event=>{if(event.target===detail) closeDialog(detail,detailReturnFocus);});
  detail?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(detail, detailReturnFocus); });
  detail?.addEventListener('close', () => { detail.classList.remove('is-closing'); if (![detail, viewer].some(d=>d?.open)) setModalState(false); });

  function filterProjects(filterButton) {
    if (!grid || !filterButton) return;
    document.querySelectorAll('.filter').forEach(button => {
      const active = button === filterButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const filter = filterButton.dataset.filter || 'all';
    const normalized = filter === 'ai' ? 'research' : filter;
    [...grid.querySelectorAll('.project-card')].forEach((card, index) => {
      const show = filter === 'all' || card.dataset.category === normalized;
      card.classList.remove('filter-in', 'filter-out');
      card.style.removeProperty('transition-delay');
      if (!show) {
        card.classList.add('filter-out');
        window.setTimeout(() => { card.hidden = true; }, prefersReducedMotion ? 0 : 220);
      } else {
        card.hidden = false;
        card.style.setProperty('transition-delay', `${Math.min(index * 45, 260)}ms`);
        requestAnimationFrame(() => card.classList.add('filter-in'));
      }
    });
  }
  document.querySelectorAll('.filter').forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => filterProjects(button));
  });

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menu && nav) {
    if (!nav.id) nav.id = 'site-navigation';
    menu.setAttribute('aria-controls', nav.id);
    const setMenu = open => {
      nav.classList.toggle('open', open);
      header?.classList.toggle('menu-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? '关闭导航' : '展开导航');
    };
    menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', event => { if (nav.classList.contains('open') && !nav.contains(event.target) && event.target !== menu) setMenu(false); });
  }

  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setActiveSection = id => navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
    setActiveSection(sections[0].id);
  } else if (sections.length) {
    setActiveSection(sections[0].id);
  }
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => { document.documentElement.classList.add('js-ready'); hero.classList.add('hero-entered'); });
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', () => {
        const progress = Math.max(-.2, Math.min(1, window.scrollY / Math.max(hero.offsetHeight, 1)));
        hero.style.setProperty('--scroll-progress', progress.toFixed(3));
        hero.style.setProperty('--hero-shift', `${(progress * 42).toFixed(1)}px`);
      }, { passive: true });
      hero.addEventListener('pointermove', event => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 2}`);
        hero.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 2}`);
      }, { passive: true });
    }
  }

  document.querySelectorAll('[data-life]').forEach(button => button.addEventListener('click', () => {
    if (!toast) return;
    toast.textContent = button.dataset.life === 'music' ? '保持节奏，也保持热爱。' : button.dataset.life === 'food' ? '今天的灵感，先从厨房开始。' : '在文字里，给想象留一点空间。';
    toast.classList.add('visible'); window.setTimeout(() => toast.classList.remove('visible'), 2200);
  }));

  document.querySelector('#copy-email')?.addEventListener('click', async () => {
    const email = '25303040095@m.fudan.edu.cn';
    try { await navigator.clipboard.writeText(email); if (toast) toast.textContent = '邮箱已复制'; } catch { if (toast) toast.textContent = email; }
    toast?.classList.add('visible'); window.setTimeout(() => toast?.classList.remove('visible'), 2200);
  });

  function setViewerScale(next) {
    viewerScale = Math.max(.5, Math.min(4, next));
    if (viewerImage) { viewerImage.style.transform = `translate(${viewerImage.dataset.tx || 0}px, ${viewerImage.dataset.ty || 0}px) scale(${viewerScale})`; viewerImage.style.transformOrigin = 'center center'; }
    const reset = viewer?.querySelector('[data-zoom="reset"]');
    if (reset) reset.setAttribute('aria-label', `重置缩放（当前 ${Math.round(viewerScale * 100)}%）`);
  }
  function ensureViewerControls() {
    if (!viewer) return;
    const group = viewer.querySelector('.viewer-toolbar > div'); if (!group) return;
    if (!group.querySelector('[data-zoom="prev"]')) { const b=document.createElement('button'); b.type='button'; b.dataset.zoom='prev'; b.textContent='←'; b.setAttribute('aria-label','上一张'); group.insertBefore(b, group.firstChild); b.addEventListener('click',()=>setViewerMedia(viewerIndex-1)); }
    if (!group.querySelector('[data-zoom="next"]')) { const b=document.createElement('button'); b.type='button'; b.dataset.zoom='next'; b.textContent='→'; b.setAttribute('aria-label','下一张'); group.insertBefore(b, group.lastElementChild); b.addEventListener('click',()=>setViewerMedia(viewerIndex+1)); }
  }
  function setViewerMedia(index) {
    if (!viewerImage || !viewerMedia.length) return;
    viewerIndex = (index + viewerMedia.length) % viewerMedia.length; const item = viewerMedia[viewerIndex];
    viewerImage.dataset.tx='0'; viewerImage.dataset.ty='0'; viewerImage.src=item.src; viewerImage.alt=item.alt || ''; setViewerScale(1);
    const label=viewer?.querySelector('.viewer-toolbar p'); if(label) label.textContent=`${String(viewerIndex+1).padStart(2,'0')} / ${String(viewerMedia.length).padStart(2,'0')} · ${item.alt||''}`;
    viewer?.querySelector('[data-zoom="prev"]')?.toggleAttribute('disabled', viewerMedia.length<2); viewer?.querySelector('[data-zoom="next"]')?.toggleAttribute('disabled', viewerMedia.length<2);
  }
  function openViewer(image) {
    if (!viewer || !viewerImage) return;
    viewerReturnFocus=image; ensureViewerControls();
    const project=data.projects[activeProjectIndex];
    if (image.dataset.foodMedia) {
      viewerMedia = foodMedia.map((src, i) => ({ src, alt: `餐食记录 ${i + 1}` }));
    } else {
      viewerMedia=mediaList(project).filter(m=>String(m.type||'image').toLowerCase()!=='video');
    }
    const sourceSrc=image.dataset.foodMedia||image.currentSrc||image.src; let source=viewerMedia.findIndex(item=>item.src===sourceSrc); if(source<0 && image.dataset.mediaIndex!=null){ const raw=Number(image.dataset.mediaIndex); source=viewerMedia.findIndex((item)=>item.src===mediaList(project)[raw]?.src); } if(source<0) source=0; viewerIndex=Math.max(0, Math.min(viewerMedia.length-1, source));
    if (!viewerMedia.length) viewerMedia=[{src:sourceSrc, alt:image.alt||''}];
    setViewerMedia(viewerIndex); if (!viewer.open) viewer.showModal(); setModalState(true);
    window.setTimeout(()=>viewer.querySelector('[data-zoom="close"]')?.focus(),0);
  }
  document.addEventListener('click', event=>{ const image=event.target.closest('[data-zoomable]'); if(image) openViewer(image); });
  foodArchive?.addEventListener('click', event => { const tile = event.target.closest('[data-food-media]'); if (tile) openViewer(tile); });
  viewer?.querySelector('[data-zoom="close"]')?.addEventListener('click',()=>closeDialog(viewer,viewerReturnFocus));
  viewer?.addEventListener('click',event=>{if(event.target===viewer) closeDialog(viewer,viewerReturnFocus);});
  viewer?.addEventListener('cancel', event => { event.preventDefault(); closeDialog(viewer, viewerReturnFocus); });
  viewer?.querySelector('[data-zoom="in"]')?.addEventListener('click',()=>setViewerScale(viewerScale+.25));
  viewer?.querySelector('[data-zoom="out"]')?.addEventListener('click',()=>setViewerScale(viewerScale-.25));
  viewer?.querySelector('[data-zoom="reset"]')?.addEventListener('click',()=>{if(viewerImage){viewerImage.dataset.tx='0';viewerImage.dataset.ty='0';}setViewerScale(1);});
  viewer?.querySelector('.viewer-stage')?.addEventListener('wheel',event=>{if(!viewer.open)return; event.preventDefault(); setViewerScale(viewerScale+(event.deltaY<0?.1:-.1));},{passive:false});
  viewer?.querySelector('.viewer-stage')?.addEventListener('pointerdown',event=>{if(!viewerImage)return; viewerImage.setPointerCapture?.(event.pointerId); viewerDrag={x:event.clientX,y:event.clientY,tx:Number(viewerImage.dataset.tx||0),ty:Number(viewerImage.dataset.ty||0)};});
  viewer?.querySelector('.viewer-stage')?.addEventListener('pointermove',event=>{if(!viewerDrag||!viewerImage)return; const tx=viewerDrag.tx+event.clientX-viewerDrag.x, ty=viewerDrag.ty+event.clientY-viewerDrag.y; viewerImage.dataset.tx=tx; viewerImage.dataset.ty=ty; setViewerScale(viewerScale);});
  viewer?.querySelector('.viewer-stage')?.addEventListener('pointerup',()=>{viewerDrag=null;});

  function trapFocus(dialog, event) {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', event => {
    if (detail?.open) { if (event.key === 'Escape') closeDialog(detail, detailReturnFocus); else trapFocus(detail, event); }
    if (viewer?.open) {
      if (event.key === 'Escape') closeDialog(viewer, viewerReturnFocus);
      else if (event.key === 'ArrowLeft') { event.preventDefault(); setViewerMedia(viewerIndex - 1); }
      else if (event.key === 'ArrowRight') { event.preventDefault(); setViewerMedia(viewerIndex + 1); }
      else if (event.key === '+' || event.key === '=') { event.preventDefault(); setViewerScale(viewerScale + .25); }
      else if (event.key === '-' || event.key === '_') { event.preventDefault(); setViewerScale(viewerScale - .25); }
      else if (event.key === '0') { event.preventDefault(); setViewerScale(1); }
      else trapFocus(viewer, event);
    }
    if (event.key === 'Escape' && nav?.classList.contains('open')) { nav.classList.remove('open'); header?.classList.remove('menu-open'); menu?.setAttribute('aria-expanded', 'false'); menu?.setAttribute('aria-label', '展开导航'); menu?.focus(); }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
  }

  const motionButton = document.querySelector('.art-motion');
  motionButton?.addEventListener('click', () => { const art = window.portfolioArt; if (!art) return; const paused = !art.paused; art.setPaused(paused); motionButton.setAttribute('aria-pressed', String(paused)); motionButton.innerHTML = `<span>${paused ? '▶' : 'Ⅱ'}</span> ${paused ? '播放动画' : '暂停动画'}`; });
})();

