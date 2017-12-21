/**
 * Geometry - Console
 *
 * ！Expose THREE & scene to window first.
 */
interface Console {
  /**
   * 记录一个geometry的顶点。
   */
  record(id: string, geometry: any): void;
  /**
   * 开始绘制geometry的各个定点。
   */
  play(id: string): void;
}

(() => {
  const recordList = Object.create(null);
  const { THREE } = window;
  const material = new THREE.MeshBasicMaterial( {color: 0xccff33} );

  class Recorder {
    /** Geometry Id */
    public id: string;
    /** Geometry Instance */
    public geometry: any;
    /** If is playing record */
    private hasPlay: boolean;
    /** Array Index */
    private index: number;
    /** Position Array */
    private poss: Float32Array;
    /** Position Array length */
    private possLen: number;
    /** Events handler */
    private handler: (...args: any[]) => void;

    constructor(id: string, geometry: any) {
      this.id = id;
      this.index = 0;
      this.hasPlay = false;
      this.geometry = geometry;
      this.poss = geometry.attributes.position.array;
      this.possLen = this.poss.length;
      this.handler = this.drawPos.bind(this);
    }

    /**
     * 绘制某一点的位置
     */
    public drawPos(): void {
      if (this.index >= this.possLen) {
        console.log('[Geometry-Console] End record:', this.id);
        window.removeEventListener('click', this.handler);
        return;
      }

      let x = this.poss[this.index];
      let y = this.poss[this.index + 1];
      let z = this.poss[this.index + 2];
      console.log(
        `[Pos ${this.id}]`,
        'x: ', x,
        '\ty: ', y,
        '\tz: ', z
      );
      const geom = new THREE.BoxGeometry(1, 1, 1);
      const cube = new THREE.Mesh(geom, material);
      cube.position.set(x, y, z);
      window.scene.add(cube);
      this.index += 3;
    }

    /**
     * 开启绘制
     */
    public play(): void {
      if (this.hasPlay) {
        console.log('[Geometry-Console] Record:', this.id, 'has already played.');
        return;
      }

      this.hasPlay = true;
      window.addEventListener('click', this.handler);
    }
  }

  function RecordGeometry(id: string, geometry: any) {
    recordList[id] = new Recorder(id, geometry);
  }

  function PlayRecord(id: string) {
    if (!recordList[id]) {
      console.warn('[Geometry-Console] No geometry found:', id);
      return;
    }

    recordList[id].play();
  }

  Object.defineProperty(console, 'record', {
    get () {
      return RecordGeometry;
    }
  });

  Object.defineProperty(console, 'play', {
    get () {
      return PlayRecord;
    }
  });

})();
