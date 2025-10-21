// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    if (lazyImage.dataset.srcset) {
                        lazyImage.srcset = lazyImage.dataset.srcset;
                    }
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
});

// Image error handling
function handleImageError(img) {
    console.warn('Image failed to load:', img.src);
    img.style.display = 'none';
}

// Responsive image loading
function loadResponsiveImage(img) {
    const width = img.clientWidth;
    let quality = 'medium';
    
    if (width <= 150) quality = 'thumbnail';
    else if (width > 800) quality = 'large';
    
    const originalSrc = img.dataset.src || img.src;
    const ext = originalSrc.split('.').pop();
    const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
    
    img.src = `${basePath}-${quality}.${ext}`;
}