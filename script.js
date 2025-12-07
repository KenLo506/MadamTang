// Header Animation Script
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        // User has scrolled down
        header.classList.add('scrolled');
    } else {
        // User is at the top
        header.classList.remove('scrolled');
    }
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

