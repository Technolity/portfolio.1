import React, { useEffect, useRef } from 'react';
import '../../styles/GlobalClickEffect.css';

/**
 * GlobalClickEffect - Adds bullet hole + gunsmoke on every click
 * Tries WebM first, then MOV, then falls back to GIF/CSS
 */
const GlobalClickEffect = () => {
    const gunshotAudioRef = useRef(null);

    useEffect(() => {
        // Preload audio
        gunshotAudioRef.current = new Audio('/effects/gunshot.mp3');
        gunshotAudioRef.current.volume = 0.5;

        // Global click handler
        const handleClick = (e) => {
            // Don't trigger on interactive elements
            const target = e.target;
            if (target.closest('input, textarea, select, button, a, .no-bullet-effect, .start-button')) {
                return;
            }

            const x = e.clientX;
            const y = e.clientY;

            // Play gunshot sound instantly
            playGunshotSound();

            // Create bullet hole at click position
            createBulletHole(x, y);

            // Create gunsmoke effect
            createGunsmoke(x, y);
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const playGunshotSound = () => {
        try {
            const sound = gunshotAudioRef.current.cloneNode();
            sound.volume = 0.5;
            sound.play().catch(() => { });
        } catch (e) {
            console.log('Gunshot audio not available');
        }
    };

    const createBulletHole = (x, y) => {
        const container = document.createElement('div');
        container.className = 'global-bullet-hole';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;

        // Create video element with multiple sources
        const video = document.createElement('video');
        video.className = 'bullet-hole-video';
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = false;

        // WebM first (Chrome, Firefox, Edge)
        const sourceWebm = document.createElement('source');
        sourceWebm.src = '/effects/Bullet-Hole-Glass.webm';
        sourceWebm.type = 'video/webm';
        video.appendChild(sourceWebm);

        // MOV fallback (Safari)
        const sourceMov = document.createElement('source');
        sourceMov.src = '/effects/Bullet-Hole-Glass.mov';
        sourceMov.type = 'video/quicktime';
        video.appendChild(sourceMov);

        // Track if video played successfully
        let videoPlayed = false;

        video.addEventListener('play', () => {
            videoPlayed = true;
        });

        // Keep bullet hole visible, then fade after 5 seconds
        video.addEventListener('ended', () => {
            setTimeout(() => {
                container.classList.add('fade-out');
                setTimeout(() => container.remove(), 500);
            }, 5000);
        });

        // Fallback if video fails completely
        video.addEventListener('error', () => {
            if (!videoPlayed) {
                container.classList.add('css-bullet-hole');
                setTimeout(() => {
                    container.classList.add('fade-out');
                    setTimeout(() => container.remove(), 500);
                }, 5500);
            }
        });

        // Timeout fallback for browsers that don't fire events properly
        setTimeout(() => {
            if (!videoPlayed && video.paused) {
                container.classList.add('css-bullet-hole');
                setTimeout(() => {
                    container.classList.add('fade-out');
                    setTimeout(() => container.remove(), 500);
                }, 5500);
            }
        }, 500);

        container.appendChild(video);
        document.body.appendChild(container);
    };

    const createGunsmoke = (x, y) => {
        const container = document.createElement('div');
        container.className = 'global-gunsmoke';
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;

        // Create video with multiple sources
        const video = document.createElement('video');
        video.className = 'gunsmoke-video';
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.loop = false;

        // WebM first (Chrome, Firefox, Edge)
        const sourceWebm = document.createElement('source');
        sourceWebm.src = '/effects/gunsmoke.webm';
        sourceWebm.type = 'video/webm';
        video.appendChild(sourceWebm);

        // MOV fallback (Safari)
        const sourceMov = document.createElement('source');
        sourceMov.src = '/effects/gunsmoke.mov';
        sourceMov.type = 'video/quicktime';
        video.appendChild(sourceMov);

        let videoPlayed = false;

        video.addEventListener('play', () => {
            videoPlayed = true;
        });

        // Remove when video ends
        video.addEventListener('ended', () => {
            container.remove();
        });

        // Fallback to GIF
        const useFallback = () => {
            if (!videoPlayed) {
                video.remove();
                const img = document.createElement('img');
                img.src = '/effects/gunsmoke.gif';
                img.className = 'gunsmoke-gif';
                container.appendChild(img);
                setTimeout(() => container.remove(), 2000);
            }
        };

        video.addEventListener('error', useFallback);

        // Timeout fallback
        setTimeout(() => {
            if (!videoPlayed && video.paused) {
                useFallback();
            }
        }, 500);

        container.appendChild(video);
        document.body.appendChild(container);
    };

    return null;
};

export default GlobalClickEffect;
