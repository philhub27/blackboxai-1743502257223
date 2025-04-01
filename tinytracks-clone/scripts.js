// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.classList.add(savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.classList.remove(currentTheme);
    html.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && e.target !== mobileMenuButton) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form validation for newsletter
const newsletterForm = document.querySelector('footer form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput.value && emailInput.checkValidity()) {
            // Show success message
            alert('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            emailInput.classList.add('border-red-500');
            setTimeout(() => {
                emailInput.classList.remove('border-red-500');
            }, 2000);
        }
    });
}

// Password visibility toggle
document.querySelectorAll('.fa-eye').forEach(eyeIcon => {
    eyeIcon.addEventListener('click', function() {
        const passwordInput = this.parentElement.querySelector('input');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});

// Password strength indicator
const passwordInputs = document.querySelectorAll('input[type="password"]');
passwordInputs.forEach(input => {
    input.addEventListener('input', function() {
        const strengthBar = document.getElementById('password-strength');
        if (strengthBar) {
            const strength = calculatePasswordStrength(this.value);
            strengthBar.className = 'h-full rounded-full ' + 
                (strength < 3 ? 'bg-red-500' : strength < 6 ? 'bg-yellow-500' : 'bg-green-500');
            strengthBar.style.width = (strength * 10) + '%';
        }
    });
});

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length > 0) strength++;
    if (password.length > 4) strength++;
    if (password.length > 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    return Math.min(strength, 10);
}

// Form validation for signup/login
const authForms = document.querySelectorAll('form');
authForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        // Check required fields
        const requiredInputs = this.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-500');
                isValid = false;
            } else {
                input.classList.remove('border-red-500');
            }
        });

        // Check password match
        const password = this.querySelector('#password');
        const confirmPassword = this.querySelector('#confirm-password');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            confirmPassword.classList.add('border-red-500');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            alert('Please fill all required fields correctly.');
        }
    });
});

// FAQ accordion functionality
document.querySelectorAll('.fa-chevron-down').forEach(chevron => {
    chevron.addEventListener('click', function() {
        const answer = this.closest('button').nextElementSibling;
        answer.classList.toggle('hidden');
        this.classList.toggle('rotate-180');
    });
});
