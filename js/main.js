// Function to add a fade-in effect to the main content
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = 0;
        setTimeout(() => {
            mainContent.style.transition = 'opacity 1s';
            mainContent.style.opacity = 1;
        }, 100);
    }

    // Highlight the current page in the navigation
    highlightCurrentPage();

    // Language switching functionality
    const korBtn = document.getElementById('korBtn');
    const engBtn = document.getElementById('engBtn');
    const korVersion = document.getElementById('korVersion');
    const engVersion = document.getElementById('engVersion');

    if (korBtn && engBtn) {
        korBtn.addEventListener('click', () => {
            korVersion.style.display = 'block';
            engVersion.style.display = 'none';
            korBtn.classList.add('active');
            engBtn.classList.remove('active');
        });

        engBtn.addEventListener('click', () => {
            korVersion.style.display = 'none';
            engVersion.style.display = 'block';
            engBtn.classList.add('active');
            korBtn.classList.remove('active');
        });
    }
});

// Function to highlight the current page in the navigation bar
function highlightCurrentPage() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.fontWeight = 'bold';
            link.style.borderBottom = '2px solid #3498db';
        }
    });
}

// Example function to show an alert when a button is clicked
function showAlert(message) {
    alert(message);
}

// Example of adding an event listener to a button
const exampleButton = document.getElementById('exampleButton');
if (exampleButton) {
    exampleButton.addEventListener('click', () => showAlert('Button clicked!'));
} 