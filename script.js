/* ==========================================================================
   TABLE OF CONTENTS
   1.  Global Utility Functions & Modal Logic (Accessible by HTML)
   2.  Main Initialization (DOMContentLoaded)
       a. Mobile Menu Logic
       b. Navbar Scroll Effect
       c. Back to Top Button Logic
       d. Smooth Scrolling
       e. Top Bar Animation
       f. FAQ Accordion Logic
       g. Intersection Observers (Animations)
       h. Contact Form Handling
       i. Escape Key Modal Close
       j. Scroll Spy (Active Link)
       k. Copyright Year Auto-update
   3.  Page Load Transition
   ========================================================================== */

/* ============================================
   1. GLOBAL UTILITIES & MODAL LOGIC
   ============================================ */

/**
 * Shows a Toast Notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;

    if (type === 'success') {
        toast.style.backgroundColor = '#10b981'; // Green
    } else if (type === 'error') {
        toast.style.backgroundColor = '#ef4444'; // Red
    } else {
        toast.style.backgroundColor = '#0D1B2A'; // Navy
    }

    toast.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Toggles the "Other" text area in the contact form
 * FIXED: Removed duplicate function and ensured clean display logic
 */
function toggleOtherField() {
    const dropdown = document.getElementById("service_type");
    const otherField = document.getElementById("other_field_container");
    const otherInput = document.getElementById("other_details");

    if (dropdown && otherField && otherInput) {
        if (dropdown.value === "other") {
            // Show the field
            otherField.style.display = "block";
            // Make it required so they don't submit it empty
            otherInput.setAttribute("required", "true");
        } else {
            // Hide the field
            otherField.style.display = "none";
            // Remove required so they can submit the form without it
            otherInput.removeAttribute("required");
            // Clear the text if they switch away
            otherInput.value = "";
        }
    }
}

/**
 * Scroll to Top Function
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/**
 * Modal Functions (Triggered by HTML onclick)
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModalBtn(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeModal(event, modalId) {
    if (event.target.id === modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
}

/* ============================================
   2. MAIN INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
        const closeIcon = mobileMenuBtn.querySelector('.close-icon');

        // Toggle Menu
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (menuIcon) menuIcon.classList.toggle('hidden');
            if (closeIcon) closeIcon.classList.toggle('hidden');
        });

        // Close Menu when clicking a Link
        const mobileLinks = document.querySelectorAll('.mobile-menu-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            });
        });
    }

    // --- B. Navbar Scroll Effect & C. Back to Top Logic ---
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Navbar Logic
        if (navbar) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down -> Hide Navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up -> Show Navbar
                navbar.style.transform = 'translateY(0)';
            }
            navbar.style.transition = 'transform 0.3s ease-in-out';
        }

        // Back to Top Logic
        if (backToTopBtn) {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        }

        lastScroll = currentScroll;
    });

    // --- D. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId) return;

            // If it's a modal trigger (used in buttons), ignore scroll
            if (this.hasAttribute('onclick')) return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navElement = document.querySelector('.navbar');
                const navbarHeight = navElement ? navElement.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- E. Top Bar Text Animation ---
    const textElement = document.getElementById("dynamic-text");
    if (textElement) {
        const messages = [
            "Welcome to Veyil Solutions - Digital Solutions Agency",
            "Your Satisfaction is our Priority",
            "Client's Success is our Success"
        ];
        let currentIndex = 0;

        const changeText = () => {
            textElement.style.opacity = '0';
            textElement.style.transform = 'translateX(-50px)';

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % messages.length;
                textElement.textContent = messages[currentIndex];
                textElement.style.transition = 'none';
                textElement.style.transform = 'translateX(50px)';

                // Trigger reflow
                void textElement.offsetWidth;

                textElement.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
                textElement.style.transform = 'translateX(0)';
                textElement.style.opacity = '1';
            }, 500);
        };

        setInterval(changeText, 3000);
    }

    // --- F. FAQ Accordion Logic ---
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            // Close other open FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.classList.contains("active")) {
                    otherQuestion.classList.remove("active");
                    otherQuestion.nextElementSibling.style.maxHeight = 0;
                }
            });

            // Toggle current FAQ
            question.classList.toggle("active");
            const answer = question.nextElementSibling;

            if (question.classList.contains("active")) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // --- G. Intersection Observers (Animations) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.service-card, .process-card, .why-card, .portfolio-card, .stat-card, .section-header'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // --- H. Contact Form Handling ---
    // FIXED: Updated to use FormData to automatically capture all HTML inputs
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show Loading State
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Automatically grab ALL fields from the form
                const formData = new FormData(contactForm);

                const response = await fetch('https://formspree.io/f/xwveaakn', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showToast("Message sent successfully! We'll get back to you soon.", "success");
                    contactForm.reset();
                    // Hide the "Other" field after successful reset
                    const otherField = document.getElementById("other_field_container");
                    if (otherField) otherField.style.display = "none";
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        showToast(data["errors"].map(error => error["message"]).join(", "), "error");
                    } else {
                        showToast("Failed to send message. Please try again later.", "error");
                    }
                }
            } catch (error) {
                console.error("Form submission error:", error);
                showToast("An error occurred. Check your internet connection.", "error");
            } finally {
                // Restore Button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Modal internal buttons (Close modal when "Start Project" is clicked)
    const projectButtons = document.querySelectorAll('.btn-modal');
    projectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const parentModal = this.closest('.modal-overlay');
            if (parentModal) {
                parentModal.classList.remove('active');
            }
        });
    });

    // --- I. Escape Key Modal Close ---
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            }
        }
    });

    // --- J. Scroll Spy (Active Link Highlighting) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // 150 is a buffer to trigger the highlight slightly before the section hits the very top
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- K. Copyright Year Auto-update ---
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});

// ============================================
// 3. PAGE LOAD TRANSITION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});