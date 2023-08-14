const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('lavas.png');

const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });

const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

camera.position.z = 10;

function detectDeviceType() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile ? 'mobile' : 'desktop';
}

window.onload = function () {
    const deviceType = detectDeviceType();
    console.log(`Device type: ${deviceType}`);
    if (deviceType === 'mobile') {
        let isDragging = false;
        let previousPosition = {
            x: 0,
            y: 0
        };
        const pointerEventToXY = (event) => {
            const touch = event.touches[0] || event.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        };
        
        renderer.domElement.addEventListener('touchstart', (event) => {
            event.preventDefault();
            isDragging = true;
            previousPosition = pointerEventToXY(event);
        });
        
        renderer.domElement.addEventListener('touchmove', (event) => {
            if (!isDragging) return;
        
            const currentPosition = pointerEventToXY(event);
            const deltaMove = {
                x: currentPosition.x - previousPosition.x,
                y: currentPosition.y - previousPosition.y
            };
        
            const rotationSpeed = 0.005;
            sphereMesh.rotation.y += deltaMove.x * rotationSpeed;
            sphereMesh.rotation.x += deltaMove.y * rotationSpeed;
        
            previousPosition = currentPosition;
        });
        
        renderer.domElement.addEventListener('touchend', () => {
            isDragging = false;
        });
    } else {
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        renderer.domElement.addEventListener('mousedown', (event) => {
            isDragging = true;
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        });
        
        renderer.domElement.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
        
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;
        
            const rotationSpeed = 0.005;
            sphereMesh.rotation.y += deltaX * rotationSpeed;
            sphereMesh.rotation.x += deltaY * rotationSpeed;
        
            previousMousePosition = {
                x: event.clientX,
                y: event.clientY
            };
        });
        
        renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
    }
};

function animate() {
    requestAnimationFrame(animate);
    sphereMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
renderer.render(scene, camera);