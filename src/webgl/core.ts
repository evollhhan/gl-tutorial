const { THREE } = window;

export default class App {
  public scene: any;
  public renderApp: () => void;
  private camera: any;
  private renderer: any;
  private controls: any;
  private renderCb: (...args: any[]) => void;

  /**
   * 根据配置初始化场景
   */
  constructor() {
    // 系统初始化
    this.init();
  }

  /** 系统初始化 */
  private init(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor(0x222222, 1);
    document.body.appendChild(this.renderer.domElement);
    this.controls = new THREE.OrbitControls(this.camera);
    this.camera.position.set(0, 130, 100);
    this.controls.update();
    this.renderApp = this.playScene.bind(this);
    this.renderCb = () => { return; };

    // for development
    window.scene = this.scene;
  }

  /** 当播放场景时 */
  public onRender(cb: (...args: any[]) => void): void {
    this.renderCb = cb.bind(null);
  }

  /** 播放场景 */
  private playScene(): void {
    requestAnimationFrame(this.renderApp);

    // // lock frame
    // const now = Date.now();
    // if (now - this.now < 30) {
    //   return;
    // } else {
    //   this.now = now;
    // }

    this.renderCb();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
