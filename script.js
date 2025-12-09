// Header Animation Script
const header = document.getElementById('main-header');

// Scroll progress indicator
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // User has scrolled down
        header.classList.add('scrolled');
    } else {
        // User is at the top
        header.classList.remove('scrolled');
    }
    
    // Update scroll progress
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.body.style.setProperty('--scroll-progress', Math.min(scrollProgress, 100) + '%');
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const sectionsToAnimate = document.querySelectorAll('.about-section, .menu-section, footer');
    
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const menuItems = document.querySelectorAll('.menu-item');
    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = `menuItemEntrance 0.6s ease-out forwards`;
                }, index * 100);
                menuObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    menuItems.forEach(item => {
        menuObserver.observe(item);
    });


    // Logo rotation on click
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            logoContainer.style.animation = 'logoSpin 0.6s ease-out';
            setTimeout(() => {
                logoContainer.style.animation = '';
            }, 600);
        });
    }
});

// Add CSS animation for logo spin (dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes logoSpin {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(style);

// Parallax effect for menu items and about image
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item[data-speed]');
    const aboutImage = document.querySelector('.about-image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Menu items parallax
        const menuSection = document.querySelector('.menu-section');
        if (menuSection) {
            const sectionTop = menuSection.offsetTop;
            const sectionHeight = menuSection.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                menuItems.forEach(item => {
                    const speed = parseFloat(item.getAttribute('data-speed'));
                    const yPos = -(scrolled - sectionTop + windowHeight) * speed;
                    item.style.transform = `translateY(${yPos}px)`;
                });
            }
        }
        
        // About image parallax
        if (aboutImage) {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                const sectionTop = aboutSection.offsetTop;
                const sectionHeight = aboutSection.offsetHeight;
                const windowHeight = window.innerHeight;
                
                if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                    const speed = 0.2;
                    const yPos = (scrolled - sectionTop + windowHeight) * speed;
                    aboutImage.style.transform = `translateY(${yPos}px)`;
                }
            }
        }
    });

    // Slideshow auto-advance
    const slideshowTrack = document.querySelector('.slideshow-track');
    if (slideshowTrack) {
        const slideshowContainer = document.querySelector('.slideshow-container');
        const slides = document.querySelectorAll('.slideshow-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        
        // Clone first and last slides for seamless loop
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[totalSlides - 1].cloneNode(true);
        slideshowTrack.insertBefore(lastClone, slides[0]);
        slideshowTrack.appendChild(firstClone);
        
        function getSlideWidth() {
            // Container shows 2 slides (half prev + full main + half next)
            // So each slide is half the container width
            return slideshowContainer.offsetWidth / 2;
        }
        
        function updateSlideWidths() {
            const slideWidth = getSlideWidth();
            // Update all slides including clones
            const allSlides = slideshowTrack.querySelectorAll('.slideshow-slide');
            allSlides.forEach(slide => {
                slide.style.width = `${slideWidth}px`;
                slide.style.minWidth = `${slideWidth}px`;
            });
        }
        
        function initializeSlideshow() {
            updateSlideWidths();
            const slideWidth = getSlideWidth();
            // Start at half slide width to show half of previous (last clone)
            const startOffset = slideWidth / 2;
            slideshowTrack.style.transform = `translateX(-${startOffset}px)`;
        }
        
        // Initialize
        initializeSlideshow();
        
        // Update on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateSlideWidths();
                const slideWidth = getSlideWidth();
                const currentOffset = (slideWidth / 2) + (currentIndex * slideWidth);
                slideshowTrack.style.transition = 'none';
                slideshowTrack.style.transform = `translateX(-${currentOffset}px)`;
            }, 100);
        });
        
        function nextSlide() {
            currentIndex++;
            const slideWidth = getSlideWidth();
            // Move by full slide width each time
            const offset = (slideWidth / 2) + (currentIndex * slideWidth);
            slideshowTrack.style.transition = 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
            slideshowTrack.style.transform = `translateX(-${offset}px)`;
            
            // Reset to beginning seamlessly when we reach the end
            if (currentIndex >= totalSlides) {
                setTimeout(() => {
                    slideshowTrack.style.transition = 'none';
                    currentIndex = 0;
                    const newOffset = slideWidth / 2;
                    slideshowTrack.style.transform = `translateX(-${newOffset}px)`;
                }, 2500);
            }
        }
        
        // Start slideshow - change every 3 seconds (slower)
        setInterval(nextSlide, 3000);
    }
});

