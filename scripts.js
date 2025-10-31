// Font size management
let currentFontSize = 100;

function increaseFontSize() {
    currentFontSize = Math.min(currentFontSize + 10, 150);
    applyFontSize();
    announceToScreenReader('Text size increased to ' + currentFontSize + ' percent');
}

function decreaseFontSize() {
    currentFontSize = Math.max(currentFontSize - 10, 75);
    applyFontSize();
    announceToScreenReader('Text size decreased to ' + currentFontSize + ' percent');
}

function resetFontSize() {
    currentFontSize = 100;
    applyFontSize();
    announceToScreenReader('Text size reset to default');
}

function applyFontSize() {
    document.documentElement.style.fontSize = currentFontSize + '%';
}

// High contrast mode
let highContrastEnabled = false;

function toggleHighContrast() {
    highContrastEnabled = !highContrastEnabled;
    if (highContrastEnabled) {
        document.body.classList.add('high-contrast');
        announceToScreenReader('High contrast mode enabled');
    } else {
        document.body.classList.remove('high-contrast');
        announceToScreenReader('High contrast mode disabled');
    }
}

// Screen reader announcements
function announceToScreenReader(message) {
    // Remove any existing announcements
    const existingAnnouncements = document.querySelectorAll('.sr-announcement');
    existingAnnouncements.forEach(el => el.remove());
    
    // Create new announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-announcement');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Apply initial font size
    applyFontSize();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Focus the target for screen readers
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
    
    // Keyboard navigation enhancements
    document.addEventListener('keydown', function(e) {
        // Escape key returns focus to main content
        if (e.key === 'Escape') {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        }
    });
    
    // Add keyboard navigation indicator
    let isUsingKeyboard = false;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            isUsingKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        isUsingKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });
    
    // Ensure accessibility toolbar buttons are accessible
    const accessibilityButtons = document.querySelectorAll('.accessibility-tools button');
    accessibilityButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

// Add styles for screen reader announcements and keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .sr-announcement {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
    
    body.keyboard-nav *:focus {
        outline: 3px solid #654321 !important;
        outline-offset: 2px !important;
    }
    
    body.keyboard-nav a:focus,
    body.keyboard-nav button:focus,
    body.keyboard-nav input:focus,
    body.keyboard-nav select:focus,
    body.keyboard-nav textarea:focus {
        outline: 3px solid #654321 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);