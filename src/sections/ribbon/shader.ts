const { THREE } = window;

const vertexShader = `
  attribute float displacement;
  varying float posy;

  void main() {
    vec3 vPosition = position;
    vPosition.y = vPosition.y + displacement / 255.0 * 100.0;
    posy = vPosition.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
  }
`;

const fragmentShader = `
  varying float posy;

  void main() {
    float r = posy / 100.0;
    float b = r < 0.2 ? 0.4 - r : r - 0.4;
    gl_FragColor = vec4(r, 0.0, b, r);
  }
`;

export default new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
  transparent: true
});
