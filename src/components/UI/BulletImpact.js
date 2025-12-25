import { gsap } from 'gsap';

/**
 * Creates a cinematic bullet impact effect at a specific position
 * Features: bullet tracer, impact flash, debris, bullet hole, gunsmoke
 * 
 * @param {Object} options
 * @param {number} options.x - X coordinate for impact
 * @param {number} options.y - Y coordinate for impact
 * @param {HTMLElement} options.container - Container element for the effect
 * @param {HTMLElement} options.targetElement - Element to shake on impact
 * @param {Function} options.onComplete - Callback when animation completes
 */
export const createBulletImpact = ({
    x,
    y,
    container,
    targetElement,
    onComplete
}) => {
    if (!container) return;

    // Play gunshot sound
    playGunshotSound();

    // Calculate random starting point from edge
    const edges = ['top', 'right', 'bottom', 'left'];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const containerRect = container.getBoundingClientRect();

    let startX, startY;
    const distance = Math.max(containerRect.width, containerRect.height);

    switch (edge) {
        case 'top':
            startX = x + (Math.random() - 0.5) * 200;
            startY = y - distance;
            break;
        case 'right':
            startX = x + distance;
            startY = y + (Math.random() - 0.5) * 200;
            break;
        case 'bottom':
            startX = x + (Math.random() - 0.5) * 200;
            startY = y + distance;
            break;
        case 'left':
        default:
            startX = x - distance;
            startY = y + (Math.random() - 0.5) * 200;
            break;
    }

    // Create bullet element
    const bullet = document.createElement('div');
    bullet.className = 'bullet-impact-bullet';
    container.appendChild(bullet);

    gsap.set(bullet, {
        x: startX,
        y: startY,
        opacity: 1
    });

    // Create bullet tracer
    const tracer = document.createElement('div');
    tracer.className = 'bullet-impact-tracer';
    container.appendChild(tracer);

    const tracerAngle = Math.atan2(y - startY, x - startX) * 180 / Math.PI;
    const tracerLength = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));

    gsap.set(tracer, {
        x: startX,
        y: startY,
        rotation: tracerAngle,
        scaleX: 0,
        transformOrigin: 'left center'
    });

    // Animate tracer
    gsap.to(tracer, {
        scaleX: tracerLength / 100,
        duration: 0.12,
        ease: 'none',
        onComplete: () => {
            gsap.to(tracer, {
                opacity: 0,
                duration: 0.1,
                onComplete: () => tracer.remove()
            });
        }
    });

    // Animate bullet to target
    gsap.to(bullet, {
        x: x,
        y: y,
        duration: 0.15,
        ease: 'power3.in',
        onComplete: () => {
            bullet.remove();
            createImpactEffects(x, y, container, targetElement, onComplete);
        }
    });
};

/**
 * Creates impact effects: flash, debris, bullet hole, gunsmoke
 */
const createImpactEffects = (x, y, container, targetElement, onComplete) => {
    // Impact flash
    const flash = document.createElement('div');
    flash.className = 'bullet-impact-flash';
    container.appendChild(flash);

    gsap.set(flash, {
        x: x,
        y: y,
        scale: 0,
        opacity: 1
    });

    gsap.to(flash, {
        scale: 3,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => flash.remove()
    });

    // Impact debris particles
    for (let i = 0; i < 8; i++) {
        const debris = document.createElement('div');
        debris.className = 'bullet-impact-debris';
        container.appendChild(debris);

        const debrisAngle = (Math.PI * 2 * i) / 8 + (Math.random() - 0.5) * 0.5;
        const debrisDistance = 30 + Math.random() * 40;

        gsap.set(debris, { x: x, y: y, scale: 1 });
        gsap.to(debris, {
            x: x + Math.cos(debrisAngle) * debrisDistance,
            y: y + Math.sin(debrisAngle) * debrisDistance,
            opacity: 0,
            scale: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => debris.remove()
        });
    }

    // Bullet hole with stuck bullet
    const hole = document.createElement('div');
    hole.className = 'bullet-impact-hole';
    container.appendChild(hole);

    // Create the actual bullet stuck in the hole
    const stuckBullet = document.createElement('div');
    stuckBullet.className = 'bullet-impact-stuck';
    hole.appendChild(stuckBullet);

    gsap.set(hole, {
        x: x,
        y: y,
        scale: 0,
        opacity: 1
    });

    // Bullet pops in with impact
    gsap.to(hole, {
        scale: 1,
        duration: 0.15,
        ease: 'back.out(4)',
        onComplete: () => {
            // Keep bullet visible longer - fade out after 4 seconds
            gsap.to(hole, {
                opacity: 0,
                delay: 4,
                duration: 1,
                onComplete: () => hole.remove()
            });
        }
    });

    // Gunsmoke effect
    createGunsmoke(x, y, container);

    // Shake target element
    if (targetElement) {
        gsap.to(targetElement, {
            x: (Math.random() - 0.5) * 12,
            y: (Math.random() - 0.5) * 8,
            rotation: (Math.random() - 0.5) * 3,
            duration: 0.08,
            yoyo: true,
            repeat: 3,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to(targetElement, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    duration: 0.2
                });
                // Delay the callback so effects can be seen
                if (onComplete) {
                    setTimeout(onComplete, 800);
                }
            }
        });
    } else if (onComplete) {
        // Delay even without target element
        setTimeout(onComplete, 1000);
    }
};

/**
 * Creates gunsmoke cloud effect that billows and fades
 */
const createGunsmoke = (x, y, container) => {
    // More smoke particles for revolver-style effect
    const smokeCount = 12;

    for (let i = 0; i < smokeCount; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'bullet-impact-smoke';
        container.appendChild(smoke);

        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        const delay = i * 0.03;
        const size = 50 + Math.random() * 50;

        gsap.set(smoke, {
            x: x + offsetX,
            y: y + offsetY,
            scale: 0.2,
            opacity: 0.9,
            width: size,
            height: size
        });

        // Animate smoke rising and expanding - more dramatic
        gsap.to(smoke, {
            y: y + offsetY - 100 - Math.random() * 60,
            x: x + offsetX + (Math.random() - 0.5) * 80,
            scale: 2 + Math.random() * 1,
            opacity: 0,
            duration: 2 + Math.random() * 1,
            delay: delay,
            ease: 'power1.out',
            onComplete: () => smoke.remove()
        });
    }

    // Add wispy smoke trails
    for (let i = 0; i < 6; i++) {
        const wisp = document.createElement('div');
        wisp.className = 'bullet-impact-smoke bullet-impact-smoke-wisp';
        container.appendChild(wisp);

        const angle = (Math.PI * 2 * i) / 6;
        const wispX = x + Math.cos(angle) * 15;
        const wispY = y + Math.sin(angle) * 15;

        gsap.set(wisp, {
            x: wispX,
            y: wispY,
            scale: 0.3,
            opacity: 0.7,
            width: 30,
            height: 30
        });

        gsap.to(wisp, {
            y: wispY - 120 - Math.random() * 40,
            x: wispX + (Math.random() - 0.5) * 60,
            scale: 1.5,
            opacity: 0,
            duration: 2.5 + Math.random() * 0.5,
            delay: 0.1 + i * 0.05,
            ease: 'power1.out',
            onComplete: () => wisp.remove()
        });
    }

    // Add a larger, slower smoke cloud
    const bigSmoke = document.createElement('div');
    bigSmoke.className = 'bullet-impact-smoke bullet-impact-smoke-big';
    container.appendChild(bigSmoke);

    gsap.set(bigSmoke, {
        x: x,
        y: y,
        scale: 0.5,
        opacity: 0.6
    });

    gsap.to(bigSmoke, {
        y: y - 80,
        scale: 2.5,
        opacity: 0,
        duration: 2.5,
        ease: 'power1.out',
        onComplete: () => bigSmoke.remove()
    });
};

/**
 * Plays gunshot sound from custom audio file
 */
const playGunshotSound = () => {
    try {
        const sound = new Audio('/effects/gunshot.mp3');
        sound.volume = 0.5;
        sound.play().catch(() => {
            // Audio blocked - fail silently
        });
    } catch (e) {
        console.log('Gunshot audio not available');
    }
};

export default createBulletImpact;
