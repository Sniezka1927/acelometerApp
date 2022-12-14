// https://github.com/vasturiano/three-globe
const serverAddress = "192.168.0.220:1337";

const paramaters = {
  x: 0,
  y: 0,
  z: 0,
};
window.addEventListener("load", () => {
  const ws = new WebSocket(`ws://${serverAddress}`);

  ws.onopen = () => {
    //   ws.send("klient się podłączył");
  };

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
// Gen random data
const N = 300;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  alt: Math.random(),
  radius: Math.random() * 5,
  color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
}));

const Globe = new ThreeGlobe()
  .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")
  .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
  .customLayerData(gData)
  .customThreeObject(
    (d) =>
      new THREE.Mesh(
        new THREE.SphereGeometry(d.radius),
        new THREE.MeshLambertMaterial({ color: d.color })
      )
  )
  .customThreeObjectUpdate((obj, d) => {
    Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt));
  });

console.log(Globe.position);
// Globe.position.x = 50;
// Globe.position.y = 50;
Globe.position.z = 100;

(function moveSpheres() {
  gData.forEach((d) => (d.lat += 0.2));
  Globe.customLayerData(Globe.customLayerData());
  requestAnimationFrame(moveSpheres);
})();

// Setup renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("globeViz").appendChild(renderer.domElement);

// Setup scene
const scene = new THREE.Scene();
scene.add(Globe);
scene.add(new THREE.AmbientLight(0xbbbbbb));
scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

// Setup camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
camera.position.set(00, 0, 500);

camera.position.z = 500;

// Kick-off renderer
(function animate() {
  // IIFE
  // Frame cycle
  // tbControls.update();
  Globe.rotation.x = paramaters.x * 6;
  Globe.rotation.y = paramaters.y * 6;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
