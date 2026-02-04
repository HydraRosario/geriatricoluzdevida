// ===================================
// MAIN JAVASCRIPT - REFACTORIZADO
// ===================================

// Utility Functions
const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit = 100) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Safe DOM Query
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializar AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100,
                disable: 'mobile' // Deshabilitar en móvil para mejor performance
            });
        }

        initMobileMenu();
        initSmoothScroll();
        initScrollTop();
        initActiveNavLinks();
        initGallery();
        initLightbox();
        initContactForm();
        initHeaderScroll();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

function initScrollTop() {
    const scrollTopBtn = $('#scroll-top');
    if (!scrollTopBtn) return;

    const handleScroll = throttle(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// ACTIVE NAV LINKS
// ===================================

function initActiveNavLinks() {
    const sections = $$('.section');
    const navLinks = $$('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const handleScroll = throttle(() => {
        let current = '';
        const headerHeight = $('.header')?.offsetHeight || 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===================================
// HEADER SCROLL EFFECT
// ===================================

function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;

    const handleScroll = throttle(() => {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===================================
// GALLERY
// ===================================

function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Array de imágenes de ejemplo (el cliente reemplazará con sus propias imágenes)
    // Simulando 30 imágenes para demostrar la paginación de 10 en 10
    // Array de imágenes reales encontradas en el sistema
    const galleryImages = [
        'images/gallery/1000248224.jpg',
        'images/gallery/1000248230.jpg',
        'images/gallery/1000249138.jpg',
        'images/gallery/1000249140.jpg',
        'images/gallery/1000249146.jpg',
        'images/gallery/1000354912.jpg',
        'images/gallery/1000354915.jpg',
        'images/gallery/1000354918.jpg',
        'images/gallery/1000354921.jpg',
        'images/gallery/1000354936.jpg',
        'images/gallery/1000363737.jpg',

        'images/gallery/1000448666.jpg',

        'images/gallery/IMG_20240229_143102065.jpg',
        'images/gallery/IMG_20240229_143136584.jpg',
        'images/gallery/IMG_20240229_143145711.jpg',
        'images/gallery/IMG_20240229_143204592.jpg',
        'images/gallery/IMG_20240229_175117898.jpg',
        'images/gallery/IMG_20240229_175151298.jpg',
        'images/gallery/IMG_20240229_175214046.jpg',
        'images/gallery/IMG_20240229_175234598.jpg',
        'images/gallery/IMG_20240229_175300181.jpg',
        'images/gallery/IMG_20240229_184806556.jpg',
        'images/gallery/IMG_20240229_184814105.jpg',
        'images/gallery/IMG_20240229_193848573.jpg',
        'images/gallery/IMG_20240301_193901195.jpg',
        'images/gallery/IMG_20240301_194109598.jpg',
        'images/gallery/IMG_20240301_211742323.jpg',
        'images/gallery/IMG_20240301_211905178.jpg',
        'images/gallery/IMG_20240304_125054837.jpg',
        'images/gallery/IMG_20240304_125109174.jpg',
        'images/gallery/IMG_20240305_185304739.jpg',
        'images/gallery/IMG_20240305_205851643.jpg'
    ];

    let currentIndex = 0;
    const imagesPerLoad = 10;

    function loadImages() {
        const endIndex = Math.min(currentIndex + imagesPerLoad, galleryImages.length);
        const newItems = [];

        for (let i = currentIndex; i < endIndex; i++) {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.setAttribute('data-index', i);

            galleryItem.innerHTML = `
                <img src="${galleryImages[i]}" 
                     alt="Instalación ${i + 1}" 
                     loading="lazy" 
                     decoding="async">
                <div class="gallery-overlay">
                    <span class="gallery-overlay-icon">🔍</span>
                </div>
            `;

            galleryGrid.appendChild(galleryItem);
            newItems.push(galleryItem);
        }

        currentIndex = endIndex;

        if (currentIndex >= galleryImages.length) {
            loadMoreBtn.style.display = 'none';
        }

        animateItems(newItems);
    }

    function animateItems(items) {
        if (!items.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    items.forEach((item, index) => {
                        // Strict sequential: 0.2s per item (matches CSS duration)
                        // Starts AFTER the previous one finishes visually
                        const delay = index * 0.2;
                        item.style.animationDelay = `${delay}s`;
                        item.classList.add('visible');
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });

        // Observe the first item of the new batch
        observer.observe(items[0]);
    }

    loadImages();

    loadMoreBtn.addEventListener('click', loadImages);
}

// ===================================
// LIGHTBOX
// ===================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImageIndex = 0;
    let galleryItems = [];

    // Abrir lightbox al hacer click en una imagen
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item')) {
            const galleryItem = e.target.closest('.gallery-item');
            currentImageIndex = parseInt(galleryItem.getAttribute('data-index'));
            galleryItems = Array.from(document.querySelectorAll('.gallery-item img'));

            openLightbox(galleryItems[currentImageIndex].src);
        }
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        lightboxImg.src = galleryItems[currentImageIndex].src;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        lightboxImg.src = galleryItems[currentImageIndex].src;
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            showPrevImage();
        }
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            showNextImage();
        }
    });

    // Cerrar al hacer click fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// ===================================
// CONTACT FORM
// ===================================

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Validación básica
        if (!data.nombre || !data.email || !data.telefono || !data.mensaje) {
            showFormMessage('Por favor, completa todos los campos.', 'error');
            return;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Por favor, ingresa un email válido.', 'error');
            return;
        }

        // Aquí iría la lógica para enviar el formulario
        // Por ahora, solo mostramos un mensaje de éxito

        try {
            // Simular envío
            await new Promise(resolve => setTimeout(resolve, 1000));

            showFormMessage('¡Gracias por tu consulta! Te contactaremos pronto.', 'success');
            contactForm.reset();
        } catch (error) {
            showFormMessage('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.', 'error');
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// ===================================
// ANIMATIONS ON SCROLL (opcional)
// ===================================

// Puedes agregar animaciones al hacer scroll usando Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar elementos que quieras animar
    const animateElements = document.querySelectorAll('.service-item, .confort-item, .gallery-item');
    animateElements.forEach(el => observer.observe(el));
}

// Descomentar para activar animaciones
// initScrollAnimations();
