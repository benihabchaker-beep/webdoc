// ============================================
// SCROLLYTELLING ENGINE — CODEX ATLANTICUS 2.0
// Advanced Narrative Experience
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRevealAnimations();
    initComparisonSlider();
    initAudioSystem();
    initHotspots();
    initTerminalMode();

    // New Advanced Features
    initCanvasConstellation();
    initStickyScrollytelling();
    initMagicLens();
    initOAISDragDrop();
    initLightbox();
    initCounterAnimation();
});

// --------------------------------------------
// Canvas Data Constellation (Hero Background)
// --------------------------------------------
function initCanvasConstellation() {
    const canvas = document.getElementById('constellationCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        const numParticles = Math.floor((canvas.width * canvas.height) / 8000);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.7 ? '#00f5ff' : (Math.random() > 0.5 ? '#d4a853' : '#9d00ff'),
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 245, 255, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(p => {
            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }
            }

            // Move particle
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    // Event listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    animate();
}

// --------------------------------------------
// Sticky Scrollytelling (Heritage Section)
// --------------------------------------------
function initStickyScrollytelling() {
    const section = document.getElementById('heritage');
    if (!section) return;

    const cards = section.querySelectorAll('.story-card');
    const progressBar = document.getElementById('heritageProgress');
    const visual = document.getElementById('heritageVisual');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activate this card
                cards.forEach(c => c.classList.remove('active'));
                entry.target.classList.add('active');

                // Update section state
                const cardType = entry.target.dataset.card;
                section.setAttribute('data-state', cardType);

                // Trigger visual changes based on card
                updateHeritageVisual(cardType);
            }
        });
    }, observerOptions);

    cards.forEach(card => cardObserver.observe(card));

    // Progress bar scroll tracking
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = Math.min(100, (scrolled / (sectionHeight - window.innerHeight)) * 100);

        if (progressBar && rect.top < window.innerHeight && rect.bottom > 0) {
            progressBar.style.height = `${progress}%`;
        }
    });
}

function updateHeritageVisual(cardType) {
    const visual = document.getElementById('heritageVisual');
    if (!visual) return;

    // Add visual effects based on active card
    visual.classList.remove('effect-danger', 'effect-highlight');

    if (cardType === 'danger') {
        visual.classList.add('effect-danger');
    } else if (cardType === 'codex') {
        visual.classList.add('effect-highlight');
    }
}

// --------------------------------------------
// Magic Lens Decoder (AI Section)
// --------------------------------------------
function initMagicLens() {
    const lens = document.getElementById('magicLens');
    const cursor = document.getElementById('magicCursor');
    const revealed = document.getElementById('revealedLayer');

    if (!lens || !cursor || !revealed) return;

    let isInLens = false;

    lens.addEventListener('mouseenter', () => {
        isInLens = true;
        cursor.classList.add('visible');
    });

    lens.addEventListener('mouseleave', () => {
        isInLens = false;
        cursor.classList.remove('visible');
        revealed.style.clipPath = 'circle(0px at 50% 50%)';
    });

    lens.addEventListener('mousemove', (e) => {
        if (!isInLens) return;

        const rect = lens.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Move cursor
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;

        // Update clip-path to reveal translated text
        revealed.style.clipPath = `circle(80px at ${xPercent}% ${yPercent}%)`;
    });
}

// --------------------------------------------
// OAIS Drag & Drop Simulation
// --------------------------------------------
function initOAISDragDrop() {
    const manuscript = document.getElementById('draggableManuscript');
    const dropZone = document.getElementById('aipDropZone');
    const processing = document.getElementById('processingAnimation');
    const archived = document.getElementById('archivedPackage');
    const resultMessage = document.getElementById('oaisResultMessage');

    if (!manuscript || !dropZone) return;

    // Drag events for manuscript
    manuscript.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'manuscript');
        manuscript.classList.add('dragging');
    });

    manuscript.addEventListener('dragend', () => {
        manuscript.classList.remove('dragging');
    });

    // Drop zone events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        // Start archival process animation
        manuscript.classList.add('success');
        dropZone.querySelector('.drop-zone__icon').style.display = 'none';
        dropZone.querySelector('.drop-zone__label').style.display = 'none';
        dropZone.querySelector('.drop-zone__status').style.display = 'none';

        processing.classList.add('active');

        // After 2 seconds, show success
        setTimeout(() => {
            processing.classList.remove('active');
            dropZone.classList.add('success');
            archived.classList.add('visible');

            // Show result message
            if (resultMessage) {
                resultMessage.style.opacity = '1';
            }
        }, 2000);
    });

    // Touch support for mobile
    manuscript.addEventListener('touchstart', handleTouchStart, { passive: false });
    manuscript.addEventListener('touchmove', handleTouchMove, { passive: false });
    manuscript.addEventListener('touchend', handleTouchEnd);

    let touchStartX, touchStartY;

    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX - manuscript.offsetLeft;
        touchStartY = touch.clientY - manuscript.offsetTop;
        manuscript.classList.add('dragging');
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        manuscript.style.position = 'fixed';
        manuscript.style.left = `${touch.clientX - 60}px`;
        manuscript.style.top = `${touch.clientY - 80}px`;
        manuscript.style.zIndex = '1000';

        // Check if over drop zone
        const dropRect = dropZone.getBoundingClientRect();
        if (touch.clientX > dropRect.left && touch.clientX < dropRect.right &&
            touch.clientY > dropRect.top && touch.clientY < dropRect.bottom) {
            dropZone.classList.add('drag-over');
        } else {
            dropZone.classList.remove('drag-over');
        }
    }

    function handleTouchEnd(e) {
        const dropRect = dropZone.getBoundingClientRect();
        const touch = e.changedTouches[0];

        if (touch.clientX > dropRect.left && touch.clientX < dropRect.right &&
            touch.clientY > dropRect.top && touch.clientY < dropRect.bottom) {
            // Dropped on target
            dropZone.dispatchEvent(new Event('drop'));
        }

        manuscript.classList.remove('dragging');
        manuscript.style.position = '';
        manuscript.style.left = '';
        manuscript.style.top = '';
        manuscript.style.zIndex = '';
    }
}

// --------------------------------------------
// Deep Zoom Lightbox
// --------------------------------------------
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxImage = document.getElementById('lightboxImage');

    if (!lightbox) return;

    // Open lightbox on folio click
    const folioPlaceholders = document.querySelectorAll('[data-placeholder="codex-folio-full"]');
    folioPlaceholders.forEach(placeholder => {
        placeholder.style.cursor = 'zoom-in';
        placeholder.addEventListener('click', () => {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Deep zoom effect on hover
    lightboxContent?.addEventListener('mousemove', (e) => {
        const rect = lightboxContent.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        lightboxImage.style.setProperty('--zoom-x', `${x}%`);
        lightboxImage.style.setProperty('--zoom-y', `${y}%`);
    });
}

// --------------------------------------------
// Counter Animation (Stats)
// --------------------------------------------
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    };

    update();
}

// --------------------------------------------
// Navigation Scroll Effect
// --------------------------------------------
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// --------------------------------------------
// Scroll to Section (Smooth)
// --------------------------------------------
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// --------------------------------------------
// Reveal on Scroll (Intersection Observer)
// --------------------------------------------
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => observer.observe(reveal));
}

// --------------------------------------------
// Audio System (Ambient + Narration)
// --------------------------------------------
function initAudioSystem() {
    const ambientToggle = document.getElementById('ambientToggle');
    const ambientAudio = document.getElementById('ambientAudio');
    let ambientPlaying = false;

    // Ambient Sound Toggle
    if (ambientToggle && ambientAudio) {
        ambientToggle.addEventListener('click', () => {
            if (ambientPlaying) {
                ambientAudio.pause();
                ambientToggle.textContent = '🔇';
                ambientToggle.classList.remove('active');
            } else {
                // For placeholder: show alert that audio is not yet available
                if (!ambientAudio.querySelector('source[src]') || ambientAudio.querySelector('source[src=""]')) {
                    showAudioPlaceholderNotice('ambient');
                } else {
                    ambientAudio.volume = 0.3;
                    ambientAudio.play();
                }
                ambientToggle.textContent = '🔊';
                ambientToggle.classList.add('active');
            }
            ambientPlaying = !ambientPlaying;
        });
    }

    // Narration Buttons
    const narrationBtns = document.querySelectorAll('.narration-btn');
    let currentNarration = null;

    narrationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const audioId = btn.getAttribute('data-audio');
            const audioEl = document.getElementById(audioId);

            // Stop any currently playing narration
            if (currentNarration && currentNarration !== audioEl) {
                currentNarration.pause();
                currentNarration.currentTime = 0;
                document.querySelector(`.narration-btn[data-audio="${currentNarration.id}"]`)?.classList.remove('playing');
            }

            if (audioEl) {
                if (btn.classList.contains('playing')) {
                    audioEl.pause();
                    btn.classList.remove('playing');
                    currentNarration = null;
                } else {
                    // Check if audio source exists
                    if (!audioEl.querySelector('source[src]') || audioEl.querySelector('source')?.src === '') {
                        showAudioPlaceholderNotice(audioId);
                        btn.classList.add('playing');
                        // Simulate playing for demo
                        setTimeout(() => {
                            btn.classList.remove('playing');
                        }, 3000);
                    } else {
                        audioEl.play();
                        btn.classList.add('playing');
                        currentNarration = audioEl;

                        audioEl.onended = () => {
                            btn.classList.remove('playing');
                            currentNarration = null;
                        };
                    }
                }
            }
        });
    });
}

function showAudioPlaceholderNotice(audioType) {
    console.log(`[PLACEHOLDER] Audio "${audioType}" non chargé. Remplacez le fichier source.`);
}

// --------------------------------------------
// Interactive Hotspots System
// --------------------------------------------
function initHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    const tooltips = {
        'mercury': document.getElementById('tooltip-mercury'),
        'fold': document.getElementById('tooltip-fold'),
        'writing': document.getElementById('tooltip-writing')
    };

    let activeTooltip = null;

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = hotspot.getAttribute('data-hotspot');
            const tooltip = tooltips[type];

            // Close any open tooltip
            if (activeTooltip && activeTooltip !== tooltip) {
                activeTooltip.classList.remove('active');
            }

            if (tooltip) {
                // Position tooltip near the hotspot
                const rect = hotspot.getBoundingClientRect();
                const tooltipWidth = 320;

                let left = rect.left + rect.width / 2 - tooltipWidth / 2;
                let top = rect.bottom + 15;

                // Keep tooltip within viewport
                if (left < 20) left = 20;
                if (left + tooltipWidth > window.innerWidth - 20) {
                    left = window.innerWidth - tooltipWidth - 20;
                }
                if (top + 300 > window.innerHeight) {
                    top = rect.top - 320;
                }

                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.classList.toggle('active');

                activeTooltip = tooltip.classList.contains('active') ? tooltip : null;
            }
        });
    });

    // Close tooltips when clicking outside
    document.addEventListener('click', (e) => {
        if (activeTooltip && !e.target.closest('.hotspot-tooltip') && !e.target.closest('.hotspot')) {
            activeTooltip.classList.remove('active');
            activeTooltip = null;
        }
    });

    // Close buttons
    document.querySelectorAll('.hotspot-tooltip__close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.hotspot-tooltip').classList.remove('active');
            activeTooltip = null;
        });
    });
}

// --------------------------------------------
// Terminal Mode Toggle (AI Section)
// --------------------------------------------
function initTerminalMode() {
    const modeVisualBtn = document.getElementById('modeVisual');
    const modeCodeBtn = document.getElementById('modeCode');
    const comparisonWrapper = document.getElementById('comparisonWrapper');
    const terminalWrapper = document.getElementById('terminalWrapper');
    const terminalBody = document.getElementById('terminalBody');

    if (!modeVisualBtn || !modeCodeBtn) return;

    const terminalCode = [
        { type: 'comment', text: '# Neural Translation Pipeline — Codex Atlanticus' },
        { type: 'comment', text: '# Traitement de l\'écriture spéculaire de Léonard' },
        { type: 'import', text: 'import torch' },
        { type: 'import', text: 'from transformers import AutoModelForSeq2Seq' },
        { type: 'import', text: 'from codex_utils import mirror_flip, preprocess_manuscript' },
        { type: 'variable', text: '' },
        { type: 'comment', text: '# Chargement du modèle entraîné sur l\'italien médiéval' },
        { type: 'variable', text: 'model = AutoModelForSeq2Seq.from_pretrained("leonardo-translator-v2")' },
        { type: 'variable', text: 'tokenizer = AutoTokenizer.from_pretrained("medieval-italian-bert")' },
        { type: 'variable', text: '' },
        { type: 'comment', text: '# Prétraitement de l\'image du manuscrit' },
        { type: 'function', text: 'def analyze_folio(image_path):' },
        { type: 'variable', text: '    img = preprocess_manuscript(image_path)' },
        { type: 'variable', text: '    flipped = mirror_flip(img)  # Inversion spéculaire' },
        { type: 'variable', text: '    ocr_result = extract_text(flipped)' },
        { type: 'keyword', text: '    return ocr_result' },
        { type: 'variable', text: '' },
        { type: 'comment', text: '# Analyse du Folio 1033r...' },
        { type: 'variable', text: 'text = analyze_folio("codex_atlanticus/folio_1033r.tiff")' },
        { type: 'output', text: '>>> Texte extrait: "La sperientia non falla mai..."' },
        { type: 'variable', text: '' },
        { type: 'comment', text: '# Traduction vers le français moderne' },
        { type: 'variable', text: 'translation = model.generate(tokenizer.encode(text))' },
        { type: 'output', text: '>>> Traduction: "L\'expérience ne trompe jamais..."' },
        { type: 'variable', text: '' },
        { type: 'warning', text: '⚠ WARNING: Hallucination detected in mechanical gear generation.' },
        { type: 'warning', text: '  → Human verification required before archival validation.' },
        { type: 'variable', text: '' },
        { type: 'output', text: '>>> Confiance: 94.7% | 67 tokens incertains flaggés | Export OAIS/DIP/' },
    ];

    let terminalInitialized = false;

    modeVisualBtn.addEventListener('click', () => {
        modeVisualBtn.classList.add('active');
        modeCodeBtn.classList.remove('active');
        comparisonWrapper?.classList.remove('hidden');
        terminalWrapper?.classList.remove('active');
    });

    modeCodeBtn.addEventListener('click', () => {
        modeCodeBtn.classList.add('active');
        modeVisualBtn.classList.remove('active');
        comparisonWrapper?.classList.add('hidden');
        terminalWrapper?.classList.add('active');

        if (!terminalInitialized && terminalBody) {
            terminalInitialized = true;
            animateTerminal(terminalBody, terminalCode);
        }
    });
}

function animateTerminal(container, lines) {
    container.innerHTML = '';
    let delay = 0;

    lines.forEach((line, index) => {
        const lineEl = document.createElement('div');
        lineEl.className = `terminal__line terminal__line--${line.type}`;
        lineEl.style.animationDelay = `${delay}ms`;

        if (line.text === '') {
            lineEl.innerHTML = '&nbsp;';
        } else {
            lineEl.textContent = line.text;
        }

        if (index === lines.length - 1) {
            const cursor = document.createElement('span');
            cursor.className = 'terminal__cursor';
            lineEl.appendChild(cursor);
        }

        container.appendChild(lineEl);
        delay += 150;
    });
}

// --------------------------------------------
// Before/After Comparison Slider
// --------------------------------------------
function initComparisonSlider() {
    const container = document.getElementById('comparisonContainer');
    const slider = document.getElementById('comparisonSlider');
    const before = document.getElementById('comparisonBefore');

    if (!container || !slider || !before) return;

    let isDragging = false;

    function updateSliderPosition(x) {
        const rect = container.getBoundingClientRect();
        let position = (x - rect.left) / rect.width;
        position = Math.max(0.05, Math.min(0.95, position));
        slider.style.left = `${position * 100}%`;
        before.style.clipPath = `inset(0 ${(1 - position) * 100}% 0 0)`;
    }

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSliderPosition(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        updateSliderPosition(e.touches[0].clientX);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSliderPosition(e.touches[0].clientX);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Keyboard accessibility
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', 'Comparateur avant/après');

    slider.addEventListener('keydown', (e) => {
        const currentLeft = parseFloat(slider.style.left) || 50;
        let newPosition = currentLeft;

        if (e.key === 'ArrowLeft') {
            newPosition = Math.max(5, currentLeft - 5);
        } else if (e.key === 'ArrowRight') {
            newPosition = Math.min(95, currentLeft + 5);
        }

        slider.style.left = `${newPosition}%`;
        before.style.clipPath = `inset(0 ${100 - newPosition}% 0 0)`;
    });
}
