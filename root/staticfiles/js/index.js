// Define variables
let scene, camera, renderer, controls;

// Initialize Three.js scene
function init(THREE, OrbitControls, OBJLoader) {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('3d-model-container').appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // Load your 3D model
    // Replace 'path/to/your/model.obj' with the path to your 3D model file
    // Example: loadModel('models/your_model.obj');
    loadModel("../img/scifi_cartoon_rocket.obj");

    // Render the scene
    animate();
}

// Load 3D model
function loadModel(modelPath) {
    // Load model code goes here
    const loader = new THREE.OBJLoader();

    // Load OBJ model
    loader.load(
        // Path to the OBJ file
        modelPath,
        // onLoad callback
        function (object) {
            // Add the loaded model to the scene
            scene.add(object);
        },
        // onProgress callback (optional)
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // onError callback (optional)
        function (error) {
            console.error('Error loading model:', error);
        }
    );
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

// Initialize scene
async function loadScripts() {
    try {
        // Import Three.js
        const { default: THREE } = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js');

        // Import OrbitControls from CDN
        const { OrbitControls } = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js');

        // Import OBJLoader
        const { OBJLoader } = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/loaders/OBJLoader.js');

        // Initialize Three.js scene
        init(THREE, OrbitControls, OBJLoader);
    } catch (error) {
        console.error('Error loading scripts:', error);
    }
}

loadScripts();
