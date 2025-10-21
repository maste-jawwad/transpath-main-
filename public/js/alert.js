// Simple alert management
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
    
    // Insert at the top of the body
    document.body.insertBefore(alertDiv, document.body.firstChild);
}

// Expose to window
window.showAlert = showAlert;