// Initialize Lucide icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {

    // Initialize Lucide icons
    lucide.createIcons();
    
    // --- Start of EmailJS Integration ---
    // Initialize EmailJS with your Public Key
    // Replace 'YOUR_PUBLIC_KEY' with your actual key from your EmailJS account page
    emailjs.init('Vw6IttavQcdShcMBK');
    // --- End of EmailJS Integration ---
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.section-header, .program-card, .service-item, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

    // --- Start of Form Validation Functions (Moved for better structure) ---
    function showFieldError(input, message) {
        clearFieldError(input);
        input.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(errorElement);
    }

    function clearFieldError(input) {
        input.style.borderColor = ''; // Revert to stylesheet default
        const errorElement = input.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            clearFieldError(input); // Clear previous errors
            if (!input.value.trim()) {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                // Email validation
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        showFieldError(input, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                
                // Phone validation (optional field, but validate if filled)
                if (input.type === 'tel' && input.value) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(input.value.replace(/[\s\-\(\)]/g, ''))) {
                        showFieldError(input, 'Please enter a valid phone number');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }
    // --- End of Form Validation Functions ---


    // --- MODIFIED Contact form handling ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // First, validate the form
            if (!validateForm(contactForm)) {
                showNotification('Please fix the errors in the form.', 'error');
                return; // Stop if validation fails
            }
            
            // Get button and disable it
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send the form data using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
            emailjs.sendForm('service_3u4wn5j', 'template_ewe4vrg', this)
                .then(function() {
                    // On Success
                    showNotification('Thank you for connecting with us! We look forward to exploring how we can empower your students together.', 'success');
                    contactForm.reset(); // Clear the form
                }, function(error) {
                    // On Failure
                    showNotification('Oops! Something went wrong. Please try again.', 'error');
                    console.error('EmailJS Error:', error);
                })
                .finally(function() {
                    // This will run after success or failure
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            updateCounter();
        });
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Basic styles, can be moved to CSS file
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // (The rest of your existing JavaScript code for Parallax, Hover Effects, Loading Animation, etc., remains the same)

    // Parallax effect for hero and about sections (disabled on mobile)
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) return;
        
        const scrolled = window.pageYOffset;
        const heroGraphic = document.querySelector('.hero-graphic');
        const aboutGraphic = document.querySelector('.about-graphic');
        
        if (heroGraphic) {
            heroGraphic.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (aboutGraphic) {
            aboutGraphic.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });

    // Add hover effects to cards
    document.querySelectorAll('.program-card, .testimonial-card, .service-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Loading animation
    function showLoadingAnimation() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `<div class="loader-spinner"></div>`;
        loader.style.cssText = `...`; // your styles here
        
        const style = document.createElement('style');
        style.textContent = `...`; // your spinner styles here
        
        document.head.appendChild(style);
        document.body.appendChild(loader);
        
        window.addEventListener('load', function() {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        });
    }

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 90; // Offset for navbar
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Run on load
});

// Add CSS for active nav link (or move this to your styles.css)
const navActiveCSS = `
    .nav-link.active {
        color: #667eea; /* Example active color */
        font-weight: 600;
    }
`;

const navStyle = document.createElement('style');
navStyle.textContent = navActiveCSS;
document.head.appendChild(navStyle);
