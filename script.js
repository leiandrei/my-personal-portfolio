const buttonLinks = [
    { id: '#btn-cv', url: 'https://drive.google.com/uc?export=download&id=16m1JqDdqk-aQP1F0H-qAWHPPXfmazfD2'},
        { id: '#gh', url: 'https://github.com/leiandrei'},
    { id: '#li', url: 'https://www.linkedin.com/in/leiandrei/'},
    { id: '#fb', url: 'https://www.facebook.com/domaoall.lei'},
    { id: '#ig', url: 'https://www.instagram.com/definitelynot.leii/'}
];

const hamMenu = document.getElementById('ham-menu');
const navlinks = document.getElementById('navlinks');
const links = document.querySelectorAll('.navlinks a');

hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    navlinks.classList.toggle('active');
});

links.forEach(linkItem => {
    linkItem.addEventListener('click', () => {
        hamMenu.classList.remove('active');
        navlinks.classList.remove('active');
    });
});

buttonLinks.forEach(link => {
    const button = document.querySelector(link.id);
    if (button) {
        button.addEventListener('click', () => window.open(link.url, '_blank'));
    }
});

function showErrPopup(bool) {
    const errPopup = document.getElementById('err-popup');
    if (bool) {
        errPopup.style.display = 'flex';
    } else {
        errPopup.style.display = 'none';
    }
}

function showPopup(bool) {
    const popup = document.getElementById('popup');
    if (bool) {
        popup.style.display = 'flex';
    } else {
        popup.style.display = 'none';
    }
}

function getInquiry() {
    const name = document.getElementById('name-inp').value;
    const email = document.getElementById('email-inp').value;
    const msg = document.getElementById('msg-inp').value;
    const form = document.getElementById('contactForm');

    if (email.trim() !== '' && msg.trim() !== '' && name.trim() !== '') {
        showPopup(true);
        setTimeout(() => {
            form.submit();
        }, 2000);
    } else {
        showErrPopup(true);
    }
}

const projectsButton = document.getElementById('btn-projects');
if (projectsButton) {
    projectsButton.addEventListener('click', () => {
        document.getElementById('projectsContent')?.scrollIntoView({ behavior: 'smooth' });
    });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('is-visible'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealElements.forEach(element => revealObserver.observe(element));
}

const featuredRepositories = new Set([
    'FrauduLens-Credit-Card-Fraud-Detection-utilizing-Classifier-Models-and-Anomaly-Detection',
    'SpaceX-Data-Science-Project',
    'flyrank-ml-internship-starter',
    'my-personal-portfolio'
]);
const fallbackTech = ['GitHub'];
const projectGrid = document.getElementById('project-grid');
const projectSentinel = document.getElementById('project-sentinel');
const projectStatus = document.getElementById('project-feed-status');
const projectStatusText = document.getElementById('project-status-text');
let repositoryQueue = [];
let visibleRepositoryCount = 0;
let isAppendingProjects = false;
const projectsPerBatch = 3;

function humanizeRepositoryName(name) {
    return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
}

function escapeHtml(value) {
    const wrapper = document.createElement('div');
    wrapper.textContent = value;
    return wrapper.innerHTML;
}

function createRepositoryCard(repository, number) {
    const card = document.createElement('a');
    const title = humanizeRepositoryName(repository.name);
    const description = repository.description || 'Explore the source code, documentation, and development history for this project.';
    const technologies = repository.language ? [repository.language] : fallbackTech;
    card.className = 'project-card reveal';
    card.href = repository.html_url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.setAttribute('aria-label', `View ${title} on GitHub`);
    card.innerHTML = `
        <span class="project-number">${String(number).padStart(2, '0')} / repository</span>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        <ul class="tech-list" aria-label="Technology stack">${technologies.map(technology => `<li>${escapeHtml(technology)}</li>`).join('')}</ul>
        <span class="project-link">view_repository <span aria-hidden="true">↗</span></span>
    `;
    return card;
}

function setProjectStatus(message, state = '') {
    if (!projectStatus || !projectStatusText) return;
    projectStatus.className = `project-feed-status${state ? ` ${state}` : ''}`;
    projectStatusText.textContent = message;
}

function appendProjectBatch() {
    if (!projectGrid || isAppendingProjects || visibleRepositoryCount >= repositoryQueue.length) return;
    isAppendingProjects = true;
    const nextRepositories = repositoryQueue.slice(visibleRepositoryCount, visibleRepositoryCount + projectsPerBatch);

    nextRepositories.forEach((repository, index) => {
        const card = createRepositoryCard(repository, visibleRepositoryCount + index + 4);
        projectGrid.appendChild(card);
        requestAnimationFrame(() => card.classList.add('is-visible'));
    });

    visibleRepositoryCount += nextRepositories.length;
    isAppendingProjects = false;
    if (visibleRepositoryCount >= repositoryQueue.length) {
        setProjectStatus('You have reached the end of the project archive.', 'is-complete');
    } else {
        setProjectStatus('Scroll to load more projects.');
    }
}

async function loadRepositoryArchive() {
    try {
        const response = await fetch('https://api.github.com/users/leiandrei/repos?sort=updated&direction=desc&per_page=100', {
            headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) throw new Error(`GitHub request failed with status ${response.status}`);
        const repositories = await response.json();
        repositoryQueue = repositories.filter(repository => !repository.fork && !featuredRepositories.has(repository.name));
        if (repositoryQueue.length === 0) {
            setProjectStatus('You have reached the end of the project archive.', 'is-complete');
            return;
        }
        appendProjectBatch();
    } catch (error) {
        console.error('Unable to load additional repositories:', error);
        setProjectStatus('Additional projects are temporarily unavailable. Featured work is still available above.', 'is-error');
    }
}

if (projectSentinel && 'IntersectionObserver' in window) {
    const projectFeedObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) appendProjectBatch();
    }, { rootMargin: '500px 0px' });
    projectFeedObserver.observe(projectSentinel);
}

loadRepositoryArchive();
