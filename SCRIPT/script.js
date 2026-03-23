/**
 * Quetiemals: The Fight for Eyuforyia 
 * Core Website Logic - v3.0 (Google Script Backend + Redirects + Music Player)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Logic
    const menuToggle = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
            
            const bars = document.querySelectorAll('.bar');
            if (menuToggle.classList.contains('is-active')) {
                // Animate hamburger to X
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                resetMenuBars(bars);
            }
        });
    }

    function resetMenuBars(bars) {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }

    // 2. Intersection Observer (Scroll Reveal Animations)
    const observerOptions = { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 3. Navbar Background Change on Scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(0, 0, 0, 0.95)';
                nav.style.padding = '1rem 5%';
            } else {
                nav.style.background = 'rgba(0, 0, 0, 0.8)';
                nav.style.padding = '1.5rem 5%';
            }
        }
    });

    // 4. Hero Entrance Animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            heroContent.style.transition = 'all 1s ease-out';
        }, 300);
    }

    // 5. Silent Form Submission & Redirect Logic
    const silentForms = document.querySelectorAll('.silent-form');
    
    silentForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the page from redirecting
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            // Loading state
            btn.innerText = "TRANSMITTING...";
            btn.style.opacity = "0.7";
            btn.style.pointerEvents = "none";

            // Send data to Google Script silently
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => response.json())
            .then(data => {
                if(data.result === "success") {
                    // Look for a custom success page on the form, otherwise default to success.html
                    const customRedirect = form.getAttribute('data-success') || "success.html";
                    window.location.href = customRedirect; 
                } else {
                    throw new Error("Script returned error");
                }
            })
            .catch(error => {
                // Error state
                console.error("Transmission failed:", error);
                btn.innerText = "ERROR! TRY AGAIN.";
                btn.style.background = "#ff4d00"; // Fire color
                btn.style.opacity = "1";
                
                // Reset button after 3 seconds to allow retry
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ""; 
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                }, 3000);
            });
        });
    });

    // 6. Comm-Array Music Player Logic
    // Figure out if we are in the HTML subfolder to adjust the file paths dynamically
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

    // Only run if the music player actually exists on the page
    if (audio && playPauseBtn) {
        
        // Converted to function expressions to satisfy JSHint (W082)
        const loadTrack = (index) => {
            const track = playlist[index];
            audio.src = track.src;
            document.getElementById('track-name').innerText = track.name;
            document.getElementById('track-artist').innerText = track.artist;
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
        // We ensure volume is low to be atmospheric!
        audio.volume = 0.15; 

        // THE AUTOPLAY ATTEMPT
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay worked! (Usually happens on subpages because user has already interacted)
                playPauseBtn.innerText = "⏸";
            }).catch(error => {
                // Autoplay was blocked by the browser (Usually on the first page load)
                console.log("Eyuforyia Comm-Array: Autoplay blocked until user interaction.");
                playPauseBtn.innerText = "▶";
            });
        }
    }
});