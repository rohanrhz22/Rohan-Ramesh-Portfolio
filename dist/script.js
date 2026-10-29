'use strict';
const projects = window.PORTFOLIO_PROJECTS || [];
const profile = window.PORTFOLIO_PROFILE || {};
const artwork = window.PORTFOLIO_ART || {};
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const dashboard = document.querySelector('#project-dashboard');
function renderDashboard(filter = 'all') {
  const filtered = projects.filter(project => filter === 'all' || project.category === filter);
  dashboard.dataset.filter = filter;
  dashboard.setAttribute('aria-label', filter === 'all' ? 'All projects' : filter === 'web' ? 'Web experience projects' : 'Tools and automation projects');
  dashboard.innerHTML = filtered.map(project => `<article class="dashboard-card" aria-labelledby="card-${escapeHTML(project.id)}">
    <button class="dashboard-cover" data-project="${escapeHTML(project.id)}" aria-label="View details for ${escapeHTML(project.name)}"><div class="project-art" aria-hidden="true">${artwork[project.id] || ''}</div><span class="project-open-arrow" aria-hidden="true">↗</span></button>
    <div class="dashboard-card-body"><div class="project-category"><span>${project.category === 'tools' ? 'TOOL & AUTOMATION' : 'WEB EXPERIENCE'}${project.fork ? ' <b class="fork-label">FORK</b>' : ''}</span><span>${String(projects.indexOf(project) + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}</span></div><button class="project-title-button" data-project="${escapeHTML(project.id)}" aria-label="Explore ${escapeHTML(project.name)}"><h3 id="card-${escapeHTML(project.id)}">${escapeHTML(project.name)}</h3></button><p class="dashboard-description">${escapeHTML(project.description)}</p><div class="tag-row" aria-label="Technologies">${project.stack.slice(0,3).map(skill => `<span>${escapeHTML(skill)}</span>`).join('')}</div></div>
    <div class="dashboard-actions"><a href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(project.name)} source code">Source code <span aria-hidden="true">↗</span></a>${project.demo ? `<a class="demo-link" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHTML(project.name)} live demo"><span class="demo-dot" aria-hidden="true"></span>Live demo <span aria-hidden="true">↗</span></a>` : ''}</div>
  </article>`).join('');
  document.querySelector('#result-count').textContent = filter === 'all' ? `Showing all ${projects.length} projects` : `Showing ${filtered.length} of ${projects.length} projects`;
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.filter').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); renderDashboard(button.dataset.filter); }));
document.querySelectorAll('[data-project-count]').forEach(element => { element.textContent = projects.length; });
const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
function openProject(id, trigger) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  dialogTrigger = trigger;
  document.querySelector('#dialog-content').innerHTML = `<div class="dialog-art" aria-hidden="true">${artwork[project.id] || ''}</div><div class="dialog-body"><p class="eyebrow">${escapeHTML(project.kind)}</p><h2 id="dialog-title">${escapeHTML(project.name)}</h2><p class="dialog-description">${escapeHTML(project.description)}</p><p class="dialog-detail">${escapeHTML(project.detail)}</p><div class="tag-row" aria-label="Technologies">${project.stack.map(skill => `<span>${escapeHTML(skill)}</span>`).join('')}</div><h3>INSIDE THE PROJECT</h3><ul class="dialog-features">${project.features.map(feature => `<li>${escapeHTML(feature)}</li>`).join('')}</ul><div class="dialog-links"><a class="button button-dark" href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer">View source code <span aria-hidden="true">↗</span></a>${project.demo ? `<a class="button button-outline" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">Open live demo <span aria-hidden="true">↗</span></a>` : ''}</div><p class="dialog-repo">${escapeHTML(project.url.replace('https://',''))}</p></div>`;
  dialog.showModal(); dialog.scrollTop = 0; document.querySelector('.dialog-close').focus();
}
document.addEventListener('click', event => { const trigger = event.target.closest('[data-project]'); if(trigger) openProject(trigger.dataset.project, trigger); });
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); }});
dialog.addEventListener('close', () => { if(dialogTrigger?.isConnected) dialogTrigger.focus({preventScroll:true}); });
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-nav');
function closeMenu() { menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Open navigation'); mobileMenu.hidden = true; }
menuToggle.addEventListener('click', () => { const open = menuToggle.getAttribute('aria-expanded') !== 'true'; menuToggle.setAttribute('aria-expanded',String(open)); menuToggle.setAttribute('aria-label',open ? 'Close navigation' : 'Open navigation'); mobileMenu.hidden = !open; });
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 651px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
let toastTimeout;
function toast(message) { const target = document.querySelector('#toast'); target.textContent = message; target.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => target.classList.remove('show'),4000); }
document.querySelector('.copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText(profile.email); toast('Email address copied'); } catch { toast(profile.email); } });
document.querySelector('#year').textContent = new Date().getFullYear();
renderDashboard();
