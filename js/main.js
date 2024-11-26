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