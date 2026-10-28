const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
const closeLightbox = document.querySelector('.lightbox-close');

document.querySelectorAll('.photo-card').forEach((card) => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function hideLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

if (closeLightbox) closeLightbox.addEventListener('click', hideLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) hideLightbox();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) hideLightbox();
});


// Hide the sticky navigation while scrolling down, reveal it when scrolling up.
const siteHeader=document.querySelector('.site-header');
let previousScrollY=window.scrollY,scrollScheduled=false;
function updateHeaderVisibility() {
  const y=window.scrollY,delta=y-previousScrollY;
  if(y<70 || navLinks?.classList.contains('is-open')) siteHeader?.classList.remove('is-hidden');
  else if(delta>5 && y>140) siteHeader?.classList.add('is-hidden');
  else if(delta< -5) siteHeader?.classList.remove('is-hidden');
  previousScrollY=y; scrollScheduled=false;
}
window.addEventListener('scroll',()=>{
  if(!scrollScheduled){window.requestAnimationFrame(updateHeaderVisibility);scrollScheduled=true;}
},{passive:true});

// Read-only details for closed internship applications.
const jobs={
  backend:{title:'Backend Developer Intern',department:'Engineering',
    about:'Assist in developing and maintaining internal applications and backend services.',
    skills:['Basic Java and Spring Boot','REST API development','SQL and database fundamentals','Git and basic debugging'],
    duties:['Develop APIs for internal applications','Integrate databases and handle data operations','Test backend functionality and resolve issues']},
  marketing:{title:'Marketing Intern',department:'Marketing',
    about:'Assist with digital marketing, brand visibility, content creation, and market research.',
    skills:['Social media fundamentals','Content writing and communication','Canva and basic design','MS Excel and market research'],
    duties:['Support brand visibility and digital campaigns','Help prepare social content and marketing materials','Conduct market and competitor research']}
};
const jobDialog=document.getElementById('jobDialog'),jobDetails=document.getElementById('jobDetails');
if(jobDialog && jobDetails) {
  document.querySelectorAll('.career-card[data-job]').forEach(card=>card.addEventListener('click',()=>{
    const job=jobs[card.dataset.job]; if(!job)return;
    const ul=items=>'<ul>'+items.map(item=>'<li>'+item+'</li>').join('')+'</ul>';
    jobDetails.innerHTML=
      '<p class="job-modal-kicker">'+job.department+' / Internship · Applications Closed</p>'+
      '<h2 id="jobDialogTitle">'+job.title+'</h2>'+
      '<p class="job-modal-meta">Chennai · 2 Months · Unpaid Internship</p>'+
      '<h3>About the Role</h3><p>'+job.about+'</p>'+
      '<h3>Required Skills</h3>'+ul(job.skills)+
      '<h3>Responsibilities</h3>'+ul(job.duties)+
      '<div class="job-modal-footer"><p class="job-modal-deadline">Application Deadline: 20 October 2026</p>'+
      '<button class="job-modal-apply" type="button" disabled>Applications Closed</button></div>';
    jobDialog.showModal();
  }));
  document.querySelector('.job-modal-close')?.addEventListener('click',()=>jobDialog.close());
  jobDialog.addEventListener('click',event=>{if(event.target===jobDialog)jobDialog.close();});
}

// Clean section links use real GitHub Pages directories, so they also work on reload.
(() => {
  const sections = ['services', 'projects', 'gallery', 'about', 'contact'];
  if (!document.querySelector('.hero')) return;
  const sectionFromLocation = () => {
    const path = location.pathname.split('/').filter(Boolean)[0];
    const hash = location.hash.slice(1);
    return sections.includes(hash) ? hash : sections.includes(path) ? path : null;
  };
  const showSection = (id, behavior = 'auto') => {
    if (id) document.getElementById(id)?.scrollIntoView({behavior});
    else window.scrollTo({top: 0, behavior});
  };
  const initial = sectionFromLocation();
  const cleanPath = initial ? '/' + initial + '/' : '/';
  if (location.pathname !== cleanPath || location.hash) history.replaceState(null, '', cleanPath + location.search);
  if (initial) requestAnimationFrame(() => showSection(initial));
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, location.href);
    const id = url.pathname.split('/').filter(Boolean)[0];
    if (url.origin !== location.origin || (!sections.includes(id) && url.pathname !== '/')) return;
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const target = sections.includes(id) ? id : null;
      const path = target ? '/' + target + '/' : '/';
      if (location.pathname !== path || location.hash) history.pushState(null, '', path);
      showSection(target, 'smooth');
    });
  });
  window.addEventListener('popstate', () => showSection(sectionFromLocation()));
})();
