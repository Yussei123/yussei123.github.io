const lang = document.documentElement.lang === 'fr' ? 'fr' : 'en';

const tooltips = {
    fr: {
        img: 'Clic droit : zoomer\nClic gauche : dézoomer',
        slide: 'Clic droit : zoomer',
        btn: 'Clic pour changer de slide',
        link: 'Clic pour voir le projet',
        rocket: 'Retour en haut'
    },
    en: {
        img: 'Right click: Zoom\nLeft click: Unzoom',
        slide: 'Right click: Zoom',
        btn: 'Click to change slide',
        link: 'Click to view project',
        rocket: 'Back to top'
    }
};
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');

    for (const link of navLinks) {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        const backToTopBtn = document.getElementById('back-to-top');
backToTopBtn.setAttribute('title', tooltips[lang].rocket);

    }

    // Skill filtering
    const filterButtons = document.querySelectorAll('.skill-filters button');
    const skillCards = document.querySelectorAll('.skill-card');

    if (filterButtons.length > 0 && skillCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                const isActive = this.classList.contains('active');

                // Si déjà actif, désapplique et applique "all"
                filterButtons.forEach(btn => btn.classList.remove('active'));
                if (isActive && filter !== 'all') {
                    // Applique "all"
                    const allBtn = document.querySelector('.skill-filters button[data-filter="all"]');
                    if (allBtn) allBtn.classList.add('active');
                    skillCards.forEach(card => card.style.display = 'block');
                } else {
                    // Applique le filtre sélectionné
                    this.classList.add('active');
                    skillCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    const slidingTextContainer = document.getElementById('sliding-text');
const slidingTextContainerFr = document.getElementById('sliding-text-fr');

const textItems = [
    'Ange-Mario HOUETO!',
    'a generalist engineer!',
    'a cybersecurity enthusiast!',
    'an astrophysics lover!',
    'a human as defined by science :)'
];

const textItemsFr = [
    'Ange-Mario HOUETO!',
    'un ingénieur généraliste!',
    'un passionné de cybersécurité!',
    'un amoureux de l\'astrophysique!',
    'un humain d\'après la science :)'
];

function typeWriterEffect(container, texts, typingSpeed = 100, pause = 1500) {
    if (!container) return;
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    const span = document.createElement('span');
    span.classList.add('typewriter-text');
    container.appendChild(span);

    function type() {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            span.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentText.length) {
                isDeleting = true;
                typingTimeout = setTimeout(type, pause);
                return;
            }
        } else {
            span.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }

        typingTimeout = setTimeout(type, isDeleting ? typingSpeed / 2 : typingSpeed);
    }

    // Click to finish typing or erasing
    span.addEventListener('click', function() {
        const currentText = texts[textIndex];
        clearTimeout(typingTimeout);
        if (!isDeleting && charIndex < currentText.length) {
            // Finish typing instantly
            charIndex = currentText.length;
            span.textContent = currentText;
            isDeleting = true;
            typingTimeout = setTimeout(type, pause);
        } else if (isDeleting && charIndex > 0) {
            // Finish erasing instantly
            charIndex = 0;
            span.textContent = '';
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingTimeout = setTimeout(type, typingSpeed);
        }
    });

    type();
}

typeWriterEffect(slidingTextContainer, textItems);
typeWriterEffect(slidingTextContainerFr, textItemsFr);


    // Starry background animation
    const canvas = document.getElementById('starry-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const stars = [];
        const numStars = 200;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: Math.floor(Math.random() * 50) - 25,
                vy: Math.floor(Math.random() * 50) - 25
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0, x = stars.length; i < x; i++) {
                const s = stars[i];
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        function update() {
            for (let i = 0, x = stars.length; i < x; i++) {
                const s = stars[i];
                s.x += s.vx / 60;
                s.y += s.vy / 60;

                if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
                if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
            }
        }

        function tick() {
            draw();
            update();
            requestAnimationFrame(tick);
        }

        tick();

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Dynamically load skills from skills.json
    fetch('assets/jsons/skills.json')
        .then(response => response.json())
        .then(data => {
            // Detect language from <html lang="...">
            const skills = data[lang] || data['en'];
            const skillsGrid = document.querySelector('.skills-grid');
            if (skillsGrid) {
                skillsGrid.innerHTML = '';
                skills.forEach(skill => {
                    const card = document.createElement('div');
                    card.className = 'skill-card';
                    card.setAttribute('data-category', skill.category);
                    card.innerHTML = `<h3><i class="${skill.icon}"></i> ${skill.name}</h3>`;
                    skillsGrid.appendChild(card);
                });
            }
        });

    // Dynamically load projects from projects.json
    fetch('assets/jsons/projects.json')
        .then(response => response.json())
        .then(data => {
            const sliderTrack = document.querySelector('.slide-track');
            if (!sliderTrack) return;
            sliderTrack.innerHTML = '';
            data.projects.forEach(project => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.onclick = () => openModal(project.id);
                const projectTitle = project.title && project.title[lang] ? project.title[lang] : (project.title.en || project.title.fr || '');
                slide.innerHTML = `
                    <img src="assets/projects/${project.image}" alt="${projectTitle}">
                    <p>${projectTitle}</p>
                `;
                sliderTrack.appendChild(slide);
            });

            document.querySelectorAll('.slide img').forEach(img => {
    img.setAttribute('title', tooltips[lang].slide);
    img.style.cursor = 'pointer';
});

            const slides = sliderTrack.querySelectorAll('.slide');
            let currentIndex = 0;
            let autoSlideInterval;
            const progressBar = document.querySelector('.slider-progress-bar');
            const slideDuration = 3000;

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.style.display = i === index ? 'flex' : 'none';
                });
            }

            function goToSlide(index) {
                if (!slides.length) return;
                currentIndex = (index + slides.length) % slides.length;
                showSlide(currentIndex);
                animateProgressBar();
            }

            function animateProgressBar() {
                if (!progressBar) return;
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = `width ${slideDuration}ms linear`;
                    progressBar.style.width = '100%';
                }, 10);
            }

            function resetProgressBar() {
                if (!progressBar) return;
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
            }

            function startAutoSlide() {
                autoSlideInterval = setInterval(() => {
                    goToSlide(currentIndex + 1);
                }, slideDuration);
                animateProgressBar();
            }
            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
                resetProgressBar();
            }

            showSlide(currentIndex);
            startAutoSlide();

            sliderTrack.addEventListener('mouseenter', stopAutoSlide);
            sliderTrack.addEventListener('mouseleave', startAutoSlide);

            const prevBtn = document.getElementById('slider-prev');
            const nextBtn = document.getElementById('slider-next');
            if (prevBtn && nextBtn) {
                prevBtn.onclick = () => {
    stopAutoSlide();
    goToSlide(currentIndex - 1);
    animateProgressBar();
    startAutoSlide();
};
nextBtn.onclick = () => {
    stopAutoSlide();
    goToSlide(currentIndex + 1);
    animateProgressBar();
    startAutoSlide();
};

            }
        });

    // MODAL LOGIC
function openModal(projectId) {
    fetch('assets/jsons/projects.json')
        .then(response => response.json())
        .then(data => {
            const project = data.projects.find(p => p.id === projectId);
            const modal = document.getElementById('projectModal');
            const body = document.getElementById('modal-body');
            const modalContent = modal.querySelector('.modal-content');

            if (!project) {
                body.innerHTML = "<p>Projet introuvable.</p>";
                modal.style.display = 'flex';
                modalContent.classList.add('modal-content--visible');
                return;
            }

            let deckHtml = '';
            if (project.modalImages && project.modalImages.length > 1) {
                deckHtml = `<ul class="cards">` +
                    project.modalImages.map(img =>
                        `<li class="card">
                            <img src="assets/projects/${img}" alt="${project.title[lang] || project.title.en || project.title.fr || ''}">
                        </li>`
                    ).join('') +
                `</ul>`;
            }

            // Affiche le titre et l'image principale
            body.innerHTML = `
                <h2 style="text-align:center; margin-bottom:1rem;">${project.title[lang]}</h2>
                <img id="modal-main-img" src="assets/projects/${project.modalImages && project.modalImages[0] ? project.modalImages[0] : project.image}" alt="${project.title[lang]}" class="modal-main-img">
                ${deckHtml}
                <div id="project-details" style="margin-top:2rem; text-align:left; white-space:pre-line; font-family:inherit;"></div>
                <div style="margin-top:1rem;">
               ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener">Lien du projet</a>` : ''}
                 </div>
            `;

            // Animation d'ouverture
            modal.style.display = 'flex';
            setTimeout(() => {
                modalContent.classList.add('modal-content--visible');
            }, 10);

            // Animation de fermeture
            window.closeModal = function() {
                modalContent.classList.remove('modal-content--visible');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 400);
            };

            // Charger le contenu du fichier .txt dans la bonne langue
            if (project.detailsFile && project.detailsFile[lang]) {
                fetch('assets/projects/' + project.detailsFile[lang])
                    .then(r => r.text())
                    .then(txt => {
                        document.getElementById('project-details').textContent = txt;
                    });
            }

            
            // Animation deck au clic (inchangé)
            const deck = document.querySelector('.cards');
            if (deck) {
                deck.classList.add('piled');
                deck.setAttribute('title', lang === 'fr' ? 'Cliquez pour désempiler le deck' : 'Click to unstack the deck');
                deck.querySelectorAll('.card').forEach((card, i, arr) => {
                    card.style.setProperty('--angle', `${-5 + i * (10/(arr.length-1||1))}deg`);
                });

                // Déplie au clic sur le fond du deck
                deck.addEventListener('click', function(e) {
                    if (e.target === deck) {
                        deck.classList.remove('piled');
                    }
                });

                // Rempile au clic gauche sur une image
                deck.querySelectorAll('img').forEach(img => {
                    img.addEventListener('click', function(e) {
                        deck.classList.add('piled');
                    });
                });

                // Zoom extrait au clic droit sur une image
                deck.querySelectorAll('img').forEach(img => {
                    img.addEventListener('contextmenu', function(e) {
                        e.preventDefault();
                        removeZoomOverlay();
                        const overlay = document.createElement('div');
                        overlay.className = 'img-zoom-overlay';
                        const zoomedImg = document.createElement('img');
                        zoomedImg.src = img.src;
                        zoomedImg.alt = img.alt || '';
                        overlay.appendChild(zoomedImg);
                        document.body.appendChild(overlay);
                        overlay.addEventListener('click', removeZoomOverlay);
                        zoomedImg.addEventListener('click', removeZoomOverlay);
                    });
                    
                });

                deck.querySelectorAll('img').forEach(img => {
                    img.setAttribute('title', lang === 'fr' ? 'Clic gauche : rempiler\nClic droit : zoomer' : 'Left click: stack\nRight click: zoom');
                    img.style.cursor = 'pointer';
                });
            }
        });
}

function closeModal() {
  document.getElementById('projectModal').style.display = 'none';
}

// Fermer en cliquant hors de la modal
window.onclick = function(event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

// Ajoute ici les autres scripts (slider, filtres, etc.)

    // Zoom extrait sur clic droit (overlay)
    document.body.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' && !e.target.closest('.modal')) {
        e.preventDefault();
        removeZoomOverlay();

        const overlay = document.createElement('div');
        overlay.className = 'img-zoom-overlay';

        const zoomedImg = document.createElement('img');
        zoomedImg.src = e.target.src;
        zoomedImg.alt = e.target.alt || '';

        overlay.appendChild(zoomedImg);
        document.body.appendChild(overlay);

        // Fermeture au clic
        overlay.addEventListener('click', removeZoomOverlay);
    }
});

function removeZoomOverlay() {
    const overlay = document.querySelector('.img-zoom-overlay');
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300); // correspond à animation
    }
}


    


    const sliderTrack = document.querySelector('.slide-track');
    const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
    let currentIndex = 0;
    let autoSlideInterval;

    function goToSlide(index) {
        if (!sliderTrack || slides.length === 0) return;
        currentIndex = (index + slides.length) % slides.length;
        const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(sliderTrack).gap || 0, 10);
        sliderTrack.scrollTo({
            left: currentIndex * slideWidth,
            behavior: 'smooth'
        });
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval); // pour éviter doublons
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3000);
    }
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    if (sliderTrack) {
        sliderTrack.addEventListener('mouseenter', stopAutoSlide);
        sliderTrack.addEventListener('mouseleave', startAutoSlide);
    }

    // BOUTONS
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (prevBtn && nextBtn) {
        prevBtn.onclick = () => goToSlide(currentIndex - 1);
        nextBtn.onclick = () => goToSlide(currentIndex + 1);
    }
});

// Tooltip pour toutes les images
document.querySelectorAll('img').forEach(img => {
    img.title = tooltips[lang].img;
    img.style.cursor = 'pointer';
});


// Boutons slider
document.querySelectorAll('.slider-controls button').forEach(btn => {
    btn.title = tooltips[lang].btn;
    btn.style.cursor = 'pointer';
});

// Liens dans slides
document.querySelectorAll('.slide a').forEach(link => {
    link.title = tooltips[lang].link;
    link.style.cursor = 'pointer';
});



const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  backToTopBtn.classList.add('launch');

  // Lancer le scroll en douceur
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Réinitialiser la fusée après l'animation
  setTimeout(() => {
    backToTopBtn.classList.remove('launch');
  }, 800);
});
