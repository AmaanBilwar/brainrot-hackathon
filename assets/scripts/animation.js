document.addEventListener('DOMContentLoaded', () => {
    const img = document.getElementById('bouncing-image');
    const container = document.getElementById('animation-container');
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;
    const imgWidth = img.clientWidth;
    const imgHeight = img.clientHeight;

    let x = Math.random() * (containerWidth - imgWidth);
    let y = Math.random() * (containerHeight - imgHeight);
    let dx = 2;
    let dy = 2;
    let angle = 0;
    let rotationSpeed = 2;

    function updateContainerSize() {
        containerWidth = container.clientWidth;
        containerHeight = container.clientHeight;
    }

    window.addEventListener('resize', updateContainerSize);

    function animate() {
        x += dx;
        y += dy;
        angle += rotationSpeed;

        if (x + imgWidth >= containerWidth || x <= 0) {
            dx = -dx;
            rotationSpeed = -rotationSpeed; // Invert rotation direction
        }

        if (y + imgHeight >= containerHeight || y <= 0) {
            dy = -dy;
            rotationSpeed = -rotationSpeed; // Invert rotation direction
        }

        img.style.left = x + 'px';
        img.style.top = y + 'px';
        img.style.transform = `rotate(${angle}deg)`;
        requestAnimationFrame(animate);
    }

    animate();
});