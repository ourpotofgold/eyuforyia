/**
 * Quetiemals: The Fight for Eyuforyia 
 * Core Website Logic - Final Version (Google Script Backend + No Redirects + Music Player)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Lucide Icons (Used in the footer)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Logic & Animations
    const menuToggle = document.querySelector('.nav-menu-btn') || document.querySelector('#menu-btn') || document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links') || document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navLinks.classList.toggle('active'); // Fallback for older class names
            
            // Handle standard SVG icon swap if it exists
            const menuIcon = document.getElementById('menu-icon');
            if (menuIcon) {
                menuToggle.setAttribute('aria-expanded', isOpen);
                menuIcon.setAttribute('d', isOpen ? 'M18 6L6 18M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'); 
            }

            // Handle custom hamburger bars if they exist
            menuToggle.classList.toggle('is-active');
            const bars = menuToggle.querySelectorAll('.bar');
            if (bars.length === 3) {
                if (menuToggle.classList.contains('is-active')) {
                    bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Main site class
                entry.target.classList.add('active');  // Fallback class
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Navbar Background Change on Scroll
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar') || document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                // Fallback direct styling if CSS class isn't present
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                navbar.classList.remove('scrolled');
                // Fallback direct styling
                navbar.style.background = '';
            }
        }
    });

    // 5. Hero Entrance Animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            heroContent.style.transition = 'all 1s ease-out';
        }, 300);
    }

    // 6. Silent Form Submissions (Feedback, Playtest, Data Deletion)
    const silentForms = document.querySelectorAll('.silent-form') || document.querySelectorAll('form');
    
    silentForms.forEach(form => {
        // Skip forms that don't have a Google Script action
        if (!form.action || !form.action.includes('script.google.com')) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the browser from leaving the page
            
            const btn = form.querySelector('button[type="submit"]') || document.getElementById('submitBtn');
            if (!btn) return;

            const originalText = btn.innerText;
            const originalBg = btn.style.background;
            
            // Visual Loading State
            btn.innerText = "TRANSMITTING...";
            btn.style.opacity = "0.7";
            btn.style.pointerEvents = "none";

            // Send data in the background bypassing CORS blocks
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                mode: 'no-cors'
            })
            .then(() => {
                // SUCCESS LOGIC

                // A. Check if this form triggers a modal (like the Beta Access page)
                const modalId = form.getAttribute('data-modal-target') || 'successModal';
                const modal = document.getElementById(modalId);
                
                if (modal && modal.classList) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                } else {
                    // B. Inline success state (for Feedback & Data Deletion pages)
                    btn.innerText = "TRANSMISSION SUCCESSFUL";
                    btn.style.background = "#10b981"; // Green success color
                }

                // Reset form inputs
                form.reset();

                // Custom logic to reset emoji sentiments on the feedback page
                const sentimentBtns = form.querySelectorAll('.sentiment-btn');
                if (sentimentBtns.length > 0) {
                    sentimentBtns.forEach(b => b.classList.remove('selected'));
                    const sentimentInput = document.getElementById('sentimentInput');
                    if(sentimentInput) sentimentInput.value = "Not Selected";
                }

                // Reset button UI after 3 seconds if not using a popup modal
                if (!modal) {
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = originalBg; 
                        btn.style.opacity = "1";
                        btn.style.pointerEvents = "auto";
                    }, 3000);
                } else {
                    // If a modal popped up, reset the button underneath it instantly
                    btn.innerText = originalText;
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                }
            })
            .catch(error => {
                // ERROR LOGIC
                console.error("Transmission failed:", error);
                btn.innerText = "ERROR! TRY AGAIN.";
                btn.style.background = "#ef4444"; // Red error color
                btn.style.opacity = "1";
                
                // Reset button after 3 seconds to allow retry
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = originalBg; 
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                }, 3000);
            });
        });
    });

    // 7. Comm-Array Music Player Logic
    const isSubpage = window.location.pathname.includes('/HTML/');
    const pathPrefix = isSubpage ? '../AUDIO/' : 'AUDIO/';

    const playlist = [
        { name: "Scepter of the Guardian", artist: "Meadow Core", src: pathPrefix + "guardian.mp3" },
        { name: "The Mechanical Thrum", artist: "Tech-Shack City", src: pathPrefix + "tech.mp3" },
        { name: "Winds of Destiny", artist: "Sky Sanctuary", src: pathPrefix + "destiny.mp3" }
    ];

    let currentTrackIndex = 0;
    const audio = document.getElementById('main-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (audio && playPauseBtn) {
        
        const loadTrack = (index) => {
            const track = playlist[index];
            audio.src = track.src;
            
            const trackNameEl = document.getElementById('track-name');
            const trackArtistEl = document.getElementById('track-artist');
            
            if (trackNameEl) trackNameEl.innerText = track.name;
            if (trackArtistEl) trackArtistEl.innerText = track.artist;
        };

        const playMusic = () => {
            audio.play();
            playPauseBtn.innerText = "⏸";
        };

        const pauseMusic = () => {
            audio.pause();
            playPauseBtn.innerText = "▶";
        };

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        nextBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            playMusic();
        });

        prevBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            playMusic();
        });

        // Auto-play next track when current one ends
        audio.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            playMusic();
        });

        // Initialize the first track
        loadTrack(currentTrackIndex);
        audio.volume = 0.15; // Set volume low for atmospheric background

        // Autoplay attempt
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay succeeded
                playPauseBtn.innerText = "⏸";
            }).catch(error => {
                // Autoplay blocked by browser until user clicks
                console.log("Eyuforyia Comm-Array: Autoplay blocked until user interaction.");
                playPauseBtn.innerText = "▶";
            });
        }
    }
});