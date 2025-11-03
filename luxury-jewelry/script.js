// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Product Category Filter
const categoryBtns = document.querySelectorAll('.category-btn');
const productCards = document.querySelectorAll('.product-card');

categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.dataset.category;

        // Filter products
        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                // Add fade-in animation
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// Add to Cart Functionality (Demo)
const cartIcons = document.querySelectorAll('.btn-icon:last-child');
const cartCount = document.querySelector('.cart-count');
let cartItems = 0;

cartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        cartItems++;
        cartCount.textContent = cartItems;

        // Add animation to cart icon
        cartCount.style.animation = 'none';
        setTimeout(() => {
            cartCount.style.animation = 'pulse 0.5s ease';
        }, 10);

        // Show notification
        showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    });
});

// Wishlist Functionality (Demo)
const heartIcons = document.querySelectorAll('.btn-icon:first-child');

heartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        icon.classList.toggle('liked');

        if (icon.classList.contains('liked')) {
            icon.querySelector('i').classList.remove('fa-heart');
            icon.querySelector('i').classList.add('fa-heart');
            icon.querySelector('i').style.color = '#e74c3c';
            showNotification('Đã thêm vào danh sách yêu thích!');
        } else {
            icon.querySelector('i').style.color = '';
            showNotification('Đã xóa khỏi danh sách yêu thích!');
        }
    });
});

// Quick View Functionality (Demo)
const eyeIcons = document.querySelectorAll('.btn-icon:nth-child(2)');

eyeIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = icon.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        showNotification(`Xem nhanh: ${productName}`);
    });
});

// Notification Function
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 1rem;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;
document.head.appendChild(style);

// Contact Form Submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Validate
        if (name && email && phone && message) {
            showNotification('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
            contactForm.reset();
        } else {
            showNotification('Vui lòng điền đầy đủ thông tin!');
        }
    });
}

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (email) {
            showNotification('Đăng ký thành công! Cảm ơn bạn đã quan tâm.');
            newsletterForm.reset();
        } else {
            showNotification('Vui lòng nhập email hợp lệ!');
        }
    });
}

// Scroll Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.feature-item, .product-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Counter Animation for Stats
const statNumbers = document.querySelectorAll('.stat-item h3');

const animateCounter = (element, target) => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.textContent);
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Search Functionality (Demo)
const searchIcon = document.querySelector('.nav-icons a:first-child');
if (searchIcon) {
    searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Chức năng tìm kiếm đang được phát triển!');
    });
}

// User Account (Demo)
const userIcon = document.querySelector('.nav-icons a:nth-child(2)');
if (userIcon) {
    userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Vui lòng đăng nhập để tiếp tục!');
    });
}

console.log('LuxeJewels Website Loaded Successfully!');