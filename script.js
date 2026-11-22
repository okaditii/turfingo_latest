// Global array of images. (Removed .HEIC files because most browsers instantly display a broken/blank screen when attempting to load them, only using the universally supported JPG files!)
const imageUrls = [
    'images/Copy of DSC_0185.JPG',
    'images/Copy of DSC_0218.JPG',
    'images/Copy of DSC_0219.JPG',
    'images/Copy of IMG_0146.jpg',
    'images/Copy of IMG_7950.JPG'
];

function getRandomImage(excludeSrcs) {
    let available = imageUrls.filter(url => !excludeSrcs.includes(encodeURI(url)));
    if (available.length === 0) available = imageUrls;
    return encodeURI(available[Math.floor(Math.random() * available.length)]);
}

// Fixed Initial Load to never be blank!
function initImages() {
    const containers = document.querySelectorAll('.image-container');
    let usedUrls = [];

    // Instead of instantly deleting the placeholders (causing a white/blank gap while downloading huge local files), 
    // we let the real images fully download invisibly first, and smoothly crossfade them IN over the placeholders.
    containers.forEach(container => {
        const url = getRandomImage(usedUrls);
        usedUrls.push(url);

        const oldImg = container.querySelector('img');

        const newImg = document.createElement('img');
        newImg.src = url;
        newImg.style.position = 'absolute';
        newImg.style.top = '0';
        newImg.style.left = '0';
        newImg.style.width = '100%';
        newImg.style.height = '100%';
        newImg.style.objectFit = 'cover';
        newImg.style.opacity = '0';
        newImg.style.transition = 'opacity 0.2s ease-in-out'; // Fast fade

        // Wait for it to perfectly load:
        newImg.onload = () => {
            container.appendChild(newImg);
            void newImg.offsetWidth; // Register CSS properties
            newImg.style.opacity = '1';

            setTimeout(() => {
                if (oldImg && oldImg.parentNode === container) {
                    container.removeChild(oldImg);
                }
            }, 200); // Wait for the transition
        };

        newImg.onerror = () => { newImg.remove(); };
    });
}

function cycleRandomBlock() {
    const containers = Array.from(document.querySelectorAll('.image-container'));

    // Pick a random container block to animate
    const randomContainer = containers[Math.floor(Math.random() * containers.length)];

    if (randomContainer.childElementCount > 1) return; // Prevent bugs if transition active

    const currentImgs = Array.from(document.querySelectorAll('.image-container img'));
    const currentSrcs = currentImgs.map(img => img.getAttribute('src'));

    const newSrc = getRandomImage(currentSrcs);
    const oldImg = randomContainer.querySelector('img');

    const newImg = document.createElement('img');
    newImg.src = newSrc;
    newImg.style.position = 'absolute';
    newImg.style.top = '0';
    newImg.style.left = '0';
    newImg.style.width = '100%';
    newImg.style.height = '100%';
    newImg.style.objectFit = 'cover';
    newImg.style.opacity = '0';
    newImg.style.transition = 'opacity 0.2s ease-in-out'; // Make animation lightning fast

    newImg.onload = () => {
        randomContainer.appendChild(newImg);

        void newImg.offsetWidth;
        newImg.style.opacity = '1';

        setTimeout(() => {
            if (oldImg && oldImg.parentNode === randomContainer) {
                randomContainer.removeChild(oldImg);
            }
        }, 200);
    };

    newImg.onerror = () => { newImg.remove(); }
}

window.addEventListener('DOMContentLoaded', () => {
    initImages();

    // Cycle lightning fast now (Every 1 Second)
    setInterval(cycleRandomBlock, 1000);
});
