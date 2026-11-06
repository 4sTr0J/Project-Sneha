import React, { useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';
import heart from '../../assets/anatomical_heart.png';

const Preloader = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for perf
        let animationFrameId;
        let particles = [];
        let time = 0;
        let lastTime = performance.now();
        let phase = 'HEART_BEEP';

        const logoImg = new Image();
        const heartImg = new Image();
        let imagesLoaded = 0;

        const checkLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                initParticles();
                animate();
                startSequence();
            }
        };

        logoImg.onload = checkLoaded;
        heartImg.onload = checkLoaded;
        logoImg.src = logo;
        heartImg.src = heart;

        const initParticles = () => {
            const width = canvas.width;
            const height = canvas.height;

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');

            // 1. Sample Heart
            const heartW = Math.min(width * 0.4, 250);
            const heartH = (heartImg.height / heartImg.width) * heartW;
            tempCanvas.width = heartImg.width;
            tempCanvas.height = heartImg.height;
            tempCtx.drawImage(heartImg, 0, 0);
            const heartData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            const heartSX = (width - heartW) / 2;
            const heartSY = (height - heartH) / 2;
            const heartParticles = [];

            // Use slightly higher skip for 120fps stability if particle count is huge
            const skip = 2;

            for (let y = 0; y < heartImg.height; y += skip) {
                for (let x = 0; x < heartImg.width; x += skip) {
                    const idx = (y * heartImg.width + x) * 4;
                    const r = heartData[idx], g = heartData[idx + 1], b = heartData[idx + 2], a = heartData[idx + 3];
                    const brightness = (r + g + b) / 3;
                    if (a > 128 && brightness > 15) {
                        heartParticles.push({
                            x: heartSX + (x / heartImg.width) * heartW,
                            y: heartSY + (y / heartImg.height) * heartH,
                            color: `rgb(${r},${g},${b})`
                        });
                    }
                }
            }

            // 2. Sample Logo
            const logoW = Math.min(width * 0.8, 300);
            const logoH = (logoImg.height / logoImg.width) * logoW;
            tempCanvas.width = logoImg.width;
            tempCanvas.height = logoImg.height;
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(logoImg, 0, 0);
            const logoData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
            const logoSX = (width - logoW) / 2;
            const logoSY = (height - logoH) / 2;
            const logoPixels = [];

            for (let y = 0; y < logoImg.height; y += skip) {
                for (let x = 0; x < logoImg.width; x += skip) {
                    const idx = (y * logoImg.width + x) * 4;
                    if (logoData[idx + 3] > 128) {
                        logoPixels.push({
                            x: logoSX + (x / logoImg.width) * logoW,
                            y: logoSY + (y / logoImg.height) * logoH,
                            color: `rgb(${logoData[idx]},${logoData[idx + 1]},${logoData[idx + 2]})`
                        });
                    }
                }
            }

            // 3. Create Particles
            const count = Math.max(heartParticles.length, logoPixels.length);
            for (let i = 0; i < count; i++) {
                const h = heartParticles[i % heartParticles.length];
                const l = logoPixels[i % logoPixels.length];
                particles.push({
                    x: h.x, y: h.y, hX: h.x, hY: h.y, lX: l.x, lY: l.y,
                    vx: 0, vy: 0,
                    size: Math.random() * 1.5 + 0.5,
                    hCol: h.color, lCol: l.color, currCol: h.color,
                    f: 0.94, // friction
                    e: 0.05 + Math.random() * 0.05, // ease
                    seed: Math.random() * 100
                });
            }
        };

        const startSequence = () => {
            // 3 seconds of focused heartbeat before loading the site
            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.opacity = '0';
                    setTimeout(onComplete, 1000); // Graceful fade out
                }
            }, 3000);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            const now = performance.now();
            const dt = (now - lastTime) / 8.33; // Target 120fps base for dt calculation
            lastTime = now;
            time += 0.05 * dt;

            // Use slightly lighter clear for better trails
            ctx.fillStyle = '#1A0B2E';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const hScale = phase === 'HEART_BEEP' ? 1 + Math.sin(time * 2) * 0.08 : 1;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                if (phase === 'HEART_BEEP') {
                    p.x = centerX + (p.hX - centerX) * hScale;
                    p.y = centerY + (p.hY - centerY) * hScale;
                } else if (phase === 'DISPERSE') {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    // Framerate-independent damping
                    const damping = Math.pow(p.f, dt);
                    p.vx *= damping;
                    p.vy *= damping;
                    p.vx += Math.sin(time + p.seed) * 0.3 * dt;
                } else if (phase === 'CONVERGE') {
                    const dx = p.lX - p.x;
                    const dy = p.lY - p.y;
                    const d = Math.sqrt(dx * dx + dy * dy) || 1;

                    const force = (dx / d) * p.e * 10 * dt;
                    p.vx += force;
                    p.vy += (dy / d) * p.e * 10 * dt;

                    p.x += p.vx * dt;
                    p.y += p.vy * dt;

                    const damping = Math.pow(0.85, dt);
                    p.vx *= damping;
                    p.vy *= damping;
                    p.currCol = p.lCol;
                }

                ctx.fillStyle = p.currCol;
                // fillRect is MUCH faster than arc()
                ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [onComplete]);

    return (
        <div ref={containerRef} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: '#1A0B2E', zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'opacity 0.8s ease-in-out', overflow: 'hidden'
        }}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Preloader;
