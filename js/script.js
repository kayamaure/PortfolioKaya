document.addEventListener('DOMContentLoaded', () => {
    // Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Terminal Typing Animation
    const terminalLines = document.querySelectorAll('.terminal-line');
    const heroTitle = document.getElementById('heroTitle');
    const heroText = document.querySelector('.hero-text');

    if (terminalLines.length > 0) {
        // Typing function
        const typeLine = (line, text, speed = 30) => {
            return new Promise((resolve) => {
                let i = 0;
                function type() {
                    if (i < text.length) {
                        line.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        resolve();
                    }
                }
                type();
            });
        };

        const runAnimation = async () => {
            // Type lines
            for (const line of terminalLines) {
                const text = line.getAttribute('data-text');
                await typeLine(line, text);
                await new Promise(r => setTimeout(r, 100)); // Pause between lines
            }

            // Fade in Title
            if (heroTitle) {
                heroTitle.style.animation = 'fadeIn 0.5s forwards';
            }

            // Fade in Hero Text (Bio) shortly after
            if (heroText) {
                setTimeout(() => {
                    heroText.style.animation = 'fadeInLeft 0.8s ease-out forwards';
                }, 500);
            }
        };

        if (!sessionStorage.getItem('visited')) {
            runAnimation();
            sessionStorage.setItem('visited', 'true');
        } else {
            // Instant load for returning visitors
            terminalLines.forEach(line => {
                line.textContent = line.getAttribute('data-text');
            });

            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.animation = 'none';
            }

            if (heroText) {
                heroText.style.opacity = '1';
                heroText.style.animation = 'none';
            }
        }
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Reset errors
            document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

            // Name
            const name = document.getElementById('name');
            if (name.value.trim() === '') {
                setError(name);
                isValid = false;
            }

            // Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                setError(email);
                isValid = false;
            }

            // Subject
            const subject = document.getElementById('subject');
            if (subject.value.trim() === '') {
                setError(subject);
                isValid = false;
            }

            // Message
            const message = document.getElementById('message');
            if (message.value.trim() === '') {
                setError(message);
                isValid = false;
            }

            if (isValid) {
                // Show Success Modal
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
                contactForm.reset();
            }
        });
    }

    // Success Modal Logic
    const successModal = document.getElementById('successModal');
    if (successModal) {
        const closeSuccessBtn = document.getElementById('closeSuccessBtn');
        const closeSuccessX = document.querySelector('.close-success');

        function closeSuccess() {
            successModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccess);
        if (closeSuccessX) closeSuccessX.addEventListener('click', closeSuccess);

        // Close on click outside (handled by generic window click)
        window.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccess();
            }
        });
    }


    function setError(input) {
        const group = input.parentElement;
        group.classList.add('error');
    }

    // Modal Projets
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalImage = document.getElementById('modalImage');
    const modalTags = document.getElementById('modalTags');
    const modalLinkCode = document.getElementById('modalLinkCode');
    const modalLinkDemo = document.getElementById('modalLinkDemo');
    const closeModal = document.querySelector('.close-modal');

    // Open Modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const image = card.getAttribute('data-image');
            const tags = card.getAttribute('data-tags').split(',');
            const linkCode = card.getAttribute('data-link-code');
            const linkDemo = card.getAttribute('data-link-demo');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            // Image styling
            if (image.includes('/') || image.includes('.')) {
                // If it looks like a path/URL
                modalImage.innerHTML = `<img src="${image}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
                modalImage.style.backgroundColor = 'transparent';
                modalImage.style.display = 'block';
                modalImage.textContent = ''; // Clear text
                // Re-append img because textContent clears it
                const img = document.createElement('img');
                img.src = image;
                img.alt = title;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '8px';
                modalImage.appendChild(img);
            } else {
                // Text placeholder
                modalImage.innerHTML = image;
                modalImage.style.backgroundColor = image === 'App Mobile' ? 'var(--color-accent)' :
                    image === 'Data' ? '#10b981' : 'var(--color-secondary)';
                modalImage.style.display = 'flex';
                modalImage.style.alignItems = 'center';
                modalImage.style.justifyContent = 'center';
            }

            // Tags
            modalTags.innerHTML = '';
            tags.forEach(tag => {
                const span = document.createElement('span');
                span.classList.add('skill-tag');
                span.textContent = tag.trim();
                modalTags.appendChild(span);
            });

            // Links
            if (linkCode) {
                modalLinkCode.style.display = 'inline-block';
                modalLinkCode.href = linkCode;
            } else {
                modalLinkCode.style.display = 'none';
            }

            if (linkDemo && linkDemo !== '#') {
                modalLinkDemo.style.display = 'inline-block';
                modalLinkDemo.href = linkDemo;
            } else {
                modalLinkDemo.style.display = 'none';
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scroll
        });
    }

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projects-list .project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    // Reset animation
                    card.classList.remove('animate-in');
                    void card.offsetWidth; // Trigger reflow

                    // Check if category includes the filter value (space separated)
                    if (filterValue === 'all' || category.split(' ').includes(filterValue)) {
                        card.style.display = 'flex';
                        card.classList.add('animate-in');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Academic Carousel Logic
    const slides = document.querySelectorAll('.academic-slide');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentSlide = 0;

    function showSlide(index) {
        // Wrap around
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
    }

    if (nextBtn && prevBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }

    // Competences Carousel Logic
    const compSlides = document.querySelectorAll('.competence-slide');
    const compNextBtn = document.getElementById('compNextBtn');
    const compPrevBtn = document.getElementById('compPrevBtn');
    let currentCompSlide = 0;

    function showCompSlide(index) {
        if (index >= compSlides.length) currentCompSlide = 0;
        else if (index < 0) currentCompSlide = compSlides.length - 1;
        else currentCompSlide = index;

        compSlides.forEach(slide => slide.classList.remove('active'));
        compSlides[currentCompSlide].classList.add('active');
    }

    if (compNextBtn && compPrevBtn && compSlides.length > 0) {
        compNextBtn.addEventListener('click', () => {
            showCompSlide(currentCompSlide + 1);
        });

        compPrevBtn.addEventListener('click', () => {
            showCompSlide(currentCompSlide - 1);
        });
    }

});

// CV Preview Function
function showPreview(type) {
    const previewContainer = document.getElementById('cvPreview');
    const cards = document.querySelectorAll('.cv-card');

    // Update active card style
    cards.forEach(card => card.classList.remove('active'));
    if (type === 'pdf') {
        document.getElementById('cardPdf').classList.add('active');
        previewContainer.innerHTML = `
            <iframe src="images/CV_Kaya_MAURE__Stage.pdf" width="100%" height="600px" style="border: none; border-radius: 8px;">
                Votre navigateur ne supporte pas la visualisation PDF. 
                <a href="images/CV_Kaya_MAURE__Stage.pdf">Télécharger le PDF</a>.
            </iframe>
        `;
    } else if (type === 'video') {
        document.getElementById('cardVideo').classList.add('active');
        previewContainer.innerHTML = `
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/MW9f6x3CQMM?autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border-radius: 8px;"></iframe>
        `;
    }
}
