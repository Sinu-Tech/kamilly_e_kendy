// Configurações
const WEDDING_DATE = new Date('2026-01-11T16:00:00').getTime();

// Galeria de imagens
const galleryImages = [
    'img/kamillykendy1.jpg',
    'img/kamillykendy2.jpg',
    'img/kamillykendy3.jpg',
    'img/kamillykendy4.jpg',
    'img/kamillykendy5.jpg',
    'img/kamillykendy6.jpg',
];

let currentImageIndex = 0;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    initCountdown();
    initScrollIndicator();
    initRSVPForm();
    initSmoothScroll();
    initAnimations();
    handleResize(); // Garante o tamanho correto das imagens da galeria no carregamento
    preloadImages(); // Preload das imagens da galeria
});
// Controle de Música de Fundo
document.addEventListener('DOMContentLoaded', function () {
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const musicIcon = musicControl.querySelector('i');

    music.volume = 0.2;// Define volume inicial em 20%

    // Navegadores modernos bloqueiam o autoplay. A música só começa com a primeira interação do usuário.
    function playMusic() {
        music.play().then(() => {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
            // Remove o listener para não tocar de novo em outros cliques
            document.body.removeEventListener('click', playMusic);
        }).catch(error => {
            console.log("Autoplay bloqueado. A música começará no clique do botão.");
        });
    }

    // Tenta tocar a música na primeira interação do usuário com a página
    document.body.addEventListener('click', playMusic, { once: true });

    musicControl.addEventListener('click', function () {
        if (music.paused) {
            music.play();
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        } else {
            music.pause();
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    });
});

// Contagem Regressiva
function initCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now;

        if (distance < 0) {
            countdownElement.innerHTML = '<div class="countdown-item"><span class="countdown-number">♥</span><span class="countdown-label">Casamos!</span></div>';
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }, 1000);
}

// Indicador de scroll
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            document.querySelector('#nossa-historia').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Galeria de Fotos - Lightbox
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg && galleryImages[index]) {
        lightboxImg.src = galleryImages[index];
        lightbox.style.display = 'flex'; // Usar flex para centralizar
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;

    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }

    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        // Adiciona um efeito suave de fade na troca de imagem
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = galleryImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
        }, 200);
    }
}

// Eventos do Lightbox
document.addEventListener('keydown', function (e) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.style.display === 'flex') {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

const lightboxElement = document.getElementById('lightbox');
if (lightboxElement) {
    lightboxElement.addEventListener('click', function (e) {
        if (e.target === this) {
            closeLightbox();
        }
    });
}

// Formulário RSVP
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const convidados = document.getElementById('convidados').value;

        if (!nome) {
            showAlert('Por favor, preencha seu nome completo.', 'error');
            return;
        }

        if (!convidados) {
            showAlert('Por favor, selecione o número de convidados.', 'error');
            return;
        }

        showLoadingButton();

        // Simulação de envio bem-sucedido
        setTimeout(() => {
            const successMessage = document.getElementById('rsvp-success');
            form.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            resetLoadingButton();
        }, 1500);
    });
}

function showLoadingButton() {
    const button = document.querySelector('.rsvp-button');
    if (button) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        button.disabled = true;
    }
}

function resetLoadingButton() {
    const button = document.querySelector('.rsvp-button');
    if (button) {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Scroll suave para links internos
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animações de entrada
function initAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .historia-text, .historia-image, .gallery-item, .evento-item, .dress-code-card, .presente-item, .rsvp-form, .contato-info');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.classList.add('hidden-anim');
        observer.observe(el);
    });
}

// REMOVIDO: Efeito de parallax que causava a sobreposição
/*
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});
*/

// Adicionar CSS para animações e alertas
function addCustomCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out forwards;
        }
        .alert.alert-success { background: #28a745; }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .rsvp-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .hidden-anim {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .visible {
            opacity: 1;
            transform: translateY(0);
        }

        .lightbox {
            align-items: center;
            justify-content: center;
        }
        .lightbox-content {
            transition: opacity 0.2s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}
addCustomCSS();

// Função para redimensionar imagens da galeria responsivamente
function handleResize() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.style.height = window.innerWidth < 768 ? '250px' : '300px';
    });
}
window.addEventListener('resize', handleResize);

// Preload das imagens da galeria para melhor performance
function preloadImages() {
    galleryImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Log de inicialização
console.log('🎉 Landing page de casamento carregada com sucesso!');
console.log('💕 Kendy & Kamilly - 11 de Janeiro de 2026');
