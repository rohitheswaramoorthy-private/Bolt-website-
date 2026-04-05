import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const butterflyColors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#FFA500', '#FFD700', '#00CED1', '#9370DB', '#DA70D6', '#FF00FF', '#00FF7F', '#ADFF2F', '#FF4500', '#FF8C00', '#FFC0CB', '#F0E68C', '#E6E6FA', '#DDA0DD', '#FF1493', '#FF6B9D'];

function createButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    butterfly.textContent = '🦋';
    butterfly.style.left = Math.random() * 100 + '%';
    butterfly.style.top = Math.random() * 100 + '%';
    butterfly.style.color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
    butterfly.style.animationDuration = (3 + Math.random() * 3) + 's';
    butterfly.style.animationDelay = Math.random() * 2 + 's';

    let posX = parseFloat(butterfly.style.left);
    let posY = parseFloat(butterfly.style.top);
    let velocityX = (Math.random() - 0.5) * 0.5;
    let velocityY = (Math.random() - 0.5) * 0.5;

    function animateButterfly() {
        posX += velocityX;
        posY += velocityY;

        if (posX <= 0 || posX >= 100) velocityX *= -1;
        if (posY <= 0 || posY >= 100) velocityY *= -1;

        butterfly.style.left = posX + '%';
        butterfly.style.top = posY + '%';

        requestAnimationFrame(animateButterfly);
    }

    butterfly.addEventListener('mouseenter', function() {
        velocityX = (Math.random() - 0.5) * 2;
        velocityY = (Math.random() - 0.5) * 2;
        butterfly.style.color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
    });

    butterfly.addEventListener('click', function() {
        butterfly.style.transform = 'scale(1.5) rotate(360deg)';
        setTimeout(() => {
            butterfly.style.transform = '';
        }, 500);
    });

    animateButterfly();

    return butterfly;
}

function initializeButterflies() {
    const container = document.getElementById('butterflyContainer');
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            container.appendChild(createButterfly());
        }, i * 200);
    }
}

function createRosePetal() {
    const petal = document.createElement('div');
    petal.className = 'rose-petal';
    petal.textContent = '🌹';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDuration = (5 + Math.random() * 5) + 's';
    petal.style.animationDelay = Math.random() * 3 + 's';

    return petal;
}

function initializeRosePetals() {
    const container = document.getElementById('petalsContainer');

    function addPetal() {
        const petal = createRosePetal();
        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 10000);
    }

    setInterval(addPetal, 300);

    for (let i = 0; i < 15; i++) {
        setTimeout(addPetal, i * 200);
    }
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('heroSection');

    if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const opacity = 1 - (scrolled / heroHeight);
        heroSection.style.opacity = Math.max(0, opacity);
    }

    const parallaxSections = document.querySelectorAll('.parallax-section');
    parallaxSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const translateY = (scrollProgress - 0.5) * 50;
            section.style.transform = `translateY(${translateY}px)`;
        }
    });
}

function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.couple-card, .event-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
}

async function handleWishSubmission(event) {
    event.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitBtn = event.target.querySelector('.submit-btn');
    const nameInput = document.getElementById('nameInput');
    const messageInput = document.getElementById('messageInput');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
        formMessage.textContent = 'Please fill in all fields';
        formMessage.className = 'form-message error';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';

    try {
        const { error: dbError } = await supabase
            .from('wishes')
            .insert([{ name, message }]);

        if (dbError) throw dbError;

        const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-wish-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({ name, message })
        });

        if (!emailResponse.ok) {
            console.error('Email sending failed, but wish was saved');
        }

        formMessage.textContent = 'Thank you for your beautiful wishes! They mean the world to us. 💖';
        formMessage.className = 'form-message success';

        nameInput.value = '';
        messageInput.value = '';

        for (let i = 0; i < 10; i++) {
            createCelebrationButterfly();
        }

    } catch (error) {
        console.error('Error submitting wish:', error);
        formMessage.textContent = 'Oops! Something went wrong. Please try again.';
        formMessage.className = 'form-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Send Wishes</span><span class="btn-icon">💝</span>';
    }
}

function createCelebrationButterfly() {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    butterfly.textContent = '🦋';
    butterfly.style.position = 'fixed';
    butterfly.style.left = '50%';
    butterfly.style.top = '50%';
    butterfly.style.color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
    butterfly.style.fontSize = '40px';
    butterfly.style.zIndex = '10001';
    butterfly.style.pointerEvents = 'none';

    document.body.appendChild(butterfly);

    const angle = Math.random() * Math.PI * 2;
    const distance = 300;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    butterfly.animate([
        { transform: 'translate(-50%, -50%) scale(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(1.5) rotate(720deg)`, opacity: 0 }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });

    setTimeout(() => butterfly.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeButterflies();
    initializeRosePetals();
    observeElements();

    const wishesForm = document.getElementById('wishesForm');
    if (wishesForm) {
        wishesForm.addEventListener('submit', handleWishSubmission);
    }

    window.addEventListener('scroll', handleParallax);
    handleParallax();
});

window.addEventListener('resize', handleParallax);
