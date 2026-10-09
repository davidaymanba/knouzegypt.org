// ===================================
// KNOUZ MINISTRY - MAIN JAVASCRIPT
// Modern, Interactive, Smooth Features
// ===================================

// ===== LANGUAGE MANAGEMENT =====
let currentLang = localStorage.getItem('knouzLang') || 'ar';

// Function to change language
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('knouzLang', lang);
    
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Batch DOM writes to avoid forced reflow
    requestAnimationFrame(function() {
        // Update all translatable elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });
    });
    
    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(btn => {
        btn.classList.add('active');
    });
    
    // Dispatch custom event for language change
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Initialize language on page load
function initLanguage() {
    changeLanguage(currentLang);
}

// ===== THEME MANAGEMENT =====
function getPreferredTheme() {
    var stored = localStorage.getItem('knouzTheme');
    if (stored) return stored;
    return 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('knouzTheme', theme);
    
    // Update meta theme-color for mobile browsers
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0B0E14' : '#B99359');
    }
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Apply theme immediately (before DOMContentLoaded) to prevent flash
applyTheme(getPreferredTheme());

// Listen for OS theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('knouzTheme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize language
    initLanguage();
    
    // Language switcher event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navMenu.classList.toggle('active');
            
            // Animate icon
            const icon = this.querySelector('i');
            if (isActive) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                // Close all open dropdowns when menu closes
                navMenu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Close all open dropdowns
                navMenu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });
        
        // Close menu when clicking on a non-dropdown link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const parentDropdown = this.closest('.dropdown');
                const isMobile = window.innerWidth <= 992;
                
                // If this is a dropdown parent link on mobile, toggle dropdown instead of navigating
                if (isMobile && parentDropdown && this.parentElement === parentDropdown) {
                    e.preventDefault();
                    
                    // Close other open dropdowns
                    navMenu.querySelectorAll('.dropdown.open').forEach(d => {
                        if (d !== parentDropdown) d.classList.remove('open');
                    });
                    
                    parentDropdown.classList.toggle('open');
                    return;
                }
                
                // For regular links, close menu
                navMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navMenu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
            });
        });
    }
    
    // ===== STICKY HEADER =====
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===== HERO SLIDER =====
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');
    
    let currentSlide = 0;
    let slideInterval;
    
    if (slides.length > 0) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            sliderDots.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dot');
        
        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + slides.length) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        function goToSlide(n) {
            showSlide(n);
            resetInterval();
        }
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
        
        // Auto slide
        slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetInterval();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetInterval();
            }
        });
    }
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== TESTIMONIALS SLIDER =====
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialDotsWrap = document.getElementById('testimonialDots');
    const testimonialSlider = document.getElementById('testimonialSlider');
    let testimonialIndex = 0;
    let testimonialInterval;
    
    if (testimonialCards.length > 0 && testimonialDotsWrap) {
        // Create dots
        testimonialCards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'testimonial-dot' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToTestimonial(idx));
            testimonialDotsWrap.appendChild(dot);
        });
        const testimonialDots = testimonialDotsWrap.querySelectorAll('.testimonial-dot');

        function showTestimonial(n) {
            testimonialCards.forEach(c => c.classList.remove('active'));
            testimonialDots.forEach(d => d.classList.remove('active'));
            testimonialIndex = (n + testimonialCards.length) % testimonialCards.length;
            testimonialCards[testimonialIndex].classList.add('active');
            testimonialDots[testimonialIndex].classList.add('active');
        }

        function nextTestimonial() { showTestimonial(testimonialIndex + 1); }
        function prevTestimonial() { showTestimonial(testimonialIndex - 1); }
        function goToTestimonial(n) { showTestimonial(n); resetTestimonialInterval(); }
        function resetTestimonialInterval() {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(nextTestimonial, 6000);
        }

        if (testimonialNext) testimonialNext.addEventListener('click', () => { nextTestimonial(); resetTestimonialInterval(); });
        if (testimonialPrev) testimonialPrev.addEventListener('click', () => { prevTestimonial(); resetTestimonialInterval(); });

        testimonialInterval = setInterval(nextTestimonial, 6000);

        // Pause on hover/focus
        const pause = () => clearInterval(testimonialInterval);
        const resume = () => testimonialInterval = setInterval(nextTestimonial, 6000);
        if (testimonialSlider) {
            testimonialSlider.addEventListener('mouseenter', pause);
            testimonialSlider.addEventListener('mouseleave', resume);
            testimonialSlider.addEventListener('focusin', pause);
            testimonialSlider.addEventListener('focusout', resume);
        }

        // Keyboard navigation when slider focused
        if (testimonialSlider) {
            testimonialSlider.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowLeft') { prevTestimonial(); resetTestimonialInterval(); }
                if (e.key === 'ArrowRight') { nextTestimonial(); resetTestimonialInterval(); }
            });
        }
    }

    // ===== SERVICE CARDS INTERACTION =====
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate form
            const name = data.name.trim();
            const phone = data.phone.trim();
            const email = data.email.trim();
            const message = data.message.trim();
            
            if (!name || !phone || !email || !message) {
                alert('الرجاء ملء جميع الحقول');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('الرجاء إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // Phone validation (Egyptian phone numbers)
            const phoneRegex = /^(010|011|012|015)\d{8}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                alert('الرجاء إدخال رقم هاتف صحيح');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Hide form and show success message
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show form again after 5 seconds
                setTimeout(() => {
                    contactForm.style.display = 'block';
                    formSuccess.classList.remove('show');
                }, 5000);
                
                // In production, you would send the data to your server:
                /*
                fetch('your-api-endpoint', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(result => {
                    // Handle success
                })
                .catch(error => {
                    // Handle error
                });
                */
            }, 1500);
        });
    }
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // ===== AOS (Animate On Scroll) INITIALIZATION =====
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
    
    initAOS();
    
    // ===== LAZY LOADING IMAGES =====
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== YOUTUBE FACADE =====
    var ytFacade = document.getElementById('ytFacade');
    if (ytFacade) {
        function loadYT() {
            var c = ytFacade.parentElement;
            c.innerHTML = '<iframe src="https://www.youtube.com/embed/cbjfbwX0FgQ?si=zKxsGYnb-l2hzSU3&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>';
            c.style.position = 'relative';
            c.style.paddingBottom = '56.25%';
        }
        ytFacade.addEventListener('click', loadYT);
        ytFacade.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadYT(); } });
    }

    // ===== DROPDOWN MENU FOR MOBILE =====
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('a');
        
        if (window.innerWidth <= 992) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // ===== FORM INPUT ANIMATIONS =====
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add focus class on focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Remove focus class on blur if empty
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // ===== PREVENT EMPTY FORM SUBMISSION =====
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--danger)';
                    
                    // Reset border color after 2 seconds
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('الرجاء ملء جميع الحقول المطلوبة');
            }
        });
    });
    
    // ===== NAVBAR ACTIVE LINK =====
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
    
    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for resize events
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // ===== WINDOW RESIZE HANDLER =====
    const handleResize = throttle(function() {
        // Reset mobile menu on desktop
        if (window.innerWidth > 992 && navMenu) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // ===== PREVENT SCROLL WHEN MOBILE MENU IS OPEN =====
    if (navMenu) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (navMenu.classList.contains('active')) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = '';
                    }
                }
            });
        });
        
        observer.observe(navMenu, { attributes: true });
    }
    
    // ===== LOADING STATE =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // ===== CONSOLE MESSAGE =====
    console.log('%c⚡ Knouz Ministry Website', 'color: #B99359; font-size: 20px; font-weight: bold;');
    console.log('%cDesigned & Developed with ❤️', 'color: #6C757D; font-size: 12px;');
    
});

// ===== SERVICE WORKER REGISTRATION (Optional) =====
// Uncomment to enable offline functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registered:', registration);
        }, function(err) {
            console.log('ServiceWorker registration failed:', err);
        });
    });
}
*/

// ===== UTILITY FUNCTIONS =====

// Format phone numbers
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('تم النسخ بنجاح');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('تم النسخ بنجاح');
    }
}

// Share on social media
function shareOn(platform, url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Export functions for external use
window.KnouzUtils = {
    formatPhone,
    isValidEmail,
    getQueryParam,
    copyToClipboard,
    shareOn
};