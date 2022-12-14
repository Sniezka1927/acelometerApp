// https://github.com/vasturiano/three-globe
const serverAddress = "192.168.0.220:1337";

const paramaters = {
  x: 0,
  y: 0,
  z: 0,
};
window.addEventListener("load", () => {
  const ws = new WebSocket(`ws://${serverAddress}`);

  ws.onopen = () => {};

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    setTimeout(() => {
      paramaters.x = data.x.toFixed(2);
      paramaters.y = data.y.toFixed(2);
      paramaters.z = data.z.toFixed(2);
    }, 100);
  };

  ws.onerror = (e) => {
    console.log(e.message);
  };

  ws.onclose = (e) => {
    console.log(e.code, e.reason);
  };
});
const Globe = new ThreeGlobe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png");

// custom globe material
const globeMaterial = Globe.globeMaterial();
globeMaterial.bumpScale = 10;
new THREE.TextureLoader().load(
  "//unpkg.com/three-globe/example/img/earth-water.png",
  (texture) => {
    globeMaterial.specularMap = texture;
    globeMaterial.specular = new THREE.Color("grey");
    globeMaterial.shininess = 15;
  }
);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("globeViz").appendChild(renderer.domElement);

// Setup scene
const scene = new THREE.Scene();
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(directionalLight);

// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.z = 500;

// Kick-off renderer
(function animate() {
  // IIFE
  // Frame cycle
  Globe.rotation.x = paramaters.x * 6;
  Globe.rotation.y = paramaters.y * 6;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
