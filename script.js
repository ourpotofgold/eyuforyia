/**
 * Quetiemals: The Fight for Eyuforyia 
 * Core Website Logic
 */

// 1. Mobile Menu Logic
const menuToggle = document.querySelector('#mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        // Toggle the 'active' class to show/hide the menu
        navLinks.classList.toggle('active');
        
        // Toggle 'is-active' for the hamburger animation
        menuToggle.classList.toggle('is-active');
        
        // Logic for transforming the bars into an 'X'
        const bars = document.querySelectorAll('.bar');
        if (menuToggle.classList.contains('is-active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-6px, -7px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });
}

// 2. Intersection Observer (Scroll Reveal Animations)
// This handles the "reveal" class used to fade in story sections and character cards
const observerOptions = { 
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Select all elements with the .reveal class
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// 3. Navbar Dynamics
// Changes background opacity and padding when the Guardian scrolls down
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.padding = '0.8rem 5%';
        nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
    } else {
        nav.classList.remove('scrolled');
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
        nav.style.padding = '1.2rem 5%';
        nav.style.borderBottom = 'none';
    }
});

// 4. Auto-Close Mobile Menu
// Closes the menu automatically when a user clicks a link (crucial for mobile UX)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('is-active');
            
            // Reset hamburger bars
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => bar.style.transform = 'none');
            bars[1].style.opacity = '1';
        }
    });
});

// 5. Hero Smooth Entrance
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
});