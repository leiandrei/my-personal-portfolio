const buttonLinks = [
    { id: '#btn-cv', url: 'https://drive.google.com/uc?export=download&id=16m1JqDdqk-aQP1F0H-qAWHPPXfmazfD2'},
    { id: '#btn-projects', url: 'https://github.com/leiandrei'},
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