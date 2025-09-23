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
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initScrollIndicator();
    initRSVPForm();
    initSmoothScroll();
    initAnimations();
});

// Contagem Regressiva
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance < 0) {
        document.querySelector('.countdown').innerHTML = '<div class="countdown-item"><span class="countdown-number">♥</span><span class="countdown-label">Casamos!</span></div>';
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
}

// Indicador de scroll
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
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
    
    lightboxImg.src = galleryImages[index];
    lightbox.style.display = 'block';
    
    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    
    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = galleryImages[currentImageIndex];
}

// Fechar lightbox com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        changeImage(-1);
    } else if (e.key === 'ArrowRight') {
        changeImage(1);
    }
});

// Fechar lightbox clicando fora da imagem
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Formulário RSVP
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const successMessage = document.getElementById('rsvp-success');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica
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

        // URL do Google Form (substitua pelo seu)
        const formURL = 'https://docs.google.com/spreadsheets/d/1nx1Hp46LFSRKZ93KkcdwDsqV-IxRfSx-URc6_Gxh9hY/edit?usp=sharing';

        // Montar dados para envio
        const formData = new FormData();
        formData.append('entry.1234567890', nome); // substitua pelo seu entry ID do nome
        formData.append('entry.987654321', convidados); // substitua pelo seu entry ID de convidados

        // Enviar para o Google Form
        fetch(formURL, {
            method: 'POST',
            mode: 'no-cors', // necessário para Google Forms
            body: formData
        })
        .then(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            resetLoadingButton();
        })
        .catch(() => {
            showAlert('Erro ao enviar RSVP. Tente novamente.', 'error');
            resetLoadingButton();
        });
    });
}

function showLoadingButton() {
    const button = document.querySelector('.rsvp-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;
    
    // Armazenar texto original para restaurar depois
    button.dataset.originalText = originalText;
}

function resetLoadingButton() {
    const button = document.querySelector('.rsvp-button');
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
}

function showAlert(message, type = 'info') {
    // Criar elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    alert.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(alert);
    
    // Remover após 5 segundos
    setTimeout(() => {
        alert.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// Scroll suave para links internos
function initSmoothScroll() {
    // Se houver links de navegação, adicionar scroll suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
    // Intersection Observer para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.section-title, .historia-text, .gallery-item, .evento-item, .presente-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Efeitos de parallax simples
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Adicionar CSS para animações personalizadas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .alert {
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
    }
    
    .rsvp-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

document.head.appendChild(style);

// Função para redimensionar imagens da galeria responsivamente
function handleResize() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.style.height = window.innerWidth < 768 ? '250px' : '300px';
    });
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

// Preload das imagens da galeria para melhor performance
function preloadImages() {
    galleryImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Executar preload após carregamento da página
window.addEventListener('load', preloadImages);

// Adicionar efeito de hover nas imagens da galeria
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
});

// Função para compartilhar nas redes sociais (opcional)
function shareOnSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Kendy & Kamilly se casam em 11 de Janeiro de 2026!');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text} ${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Log de inicialização
console.log('🎉 Landing page de casamento carregada com sucesso!');
console.log('💕 Kendy & Kamilly - 11 de Janeiro de 2026');

