import * as THREE from "three";
import type { DeviceType, DeviceColor, DeviceStyle } from "../types/device";

export interface Render3DOptions {
  width: number;
  height: number;
  deviceType: DeviceType;
  deviceStyle: DeviceStyle;
  deviceColor: DeviceColor;
  rotateX: number; // Pitch in degrees
  rotateY: number; // Yaw in degrees
  rotateZ: number; // Roll in degrees
  scale: number;
  screenshotUrl: string | null;
}

// Color palettes for metallic 3D chassis
const CHASSIS_COLORS: Record<DeviceColor, { body: number; rim: number; metalness: number; roughness: number }> = {
  "titanium-dark": { body: 0x222226, rim: 0x44444a, metalness: 0.85, roughness: 0.25 },
  "titanium-natural": { body: 0x5a5a60, rim: 0x8a8a92, metalness: 0.88, roughness: 0.22 },
  silver: { body: 0xc8c8d0, rim: 0xf0f0f8, metalness: 0.92, roughness: 0.15 },
  gold: { body: 0xb8860b, rim: 0xffd700, metalness: 0.9, roughness: 0.2 },
  "deep-blue": { body: 0x14213d, rim: 0x0077b6, metalness: 0.85, roughness: 0.25 },
  "midnight-black": { body: 0x0e0e11, rim: 0x24242c, metalness: 0.9, roughness: 0.28 },
};

/**
 * Creates a rounded rectangle shape for 3D extrusion
 */
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;

  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  return shape;
}

export class ThreeDeviceStudio {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private canvas: HTMLCanvasElement;
  private phoneGroup: THREE.Group;
  private textureLoader: THREE.TextureLoader;
  private screenMesh: THREE.Mesh | null = null;
  private currentScreenshotUrl: string | null = null;
  private currentTexture: THREE.Texture | null = null;

  constructor(renderWidth = 1080, renderHeight = 1080) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = renderWidth;
    this.canvas.height = renderHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(renderWidth, renderHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(38, renderWidth / renderHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 7.2);

    this.phoneGroup = new THREE.Group();
    this.scene.add(this.phoneGroup);

    this.textureLoader = new THREE.TextureLoader();

    this.setupLighting();
  }

  private setupLighting() {
    // 1. Soft Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // 2. Key Studio Light (Top Front Right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 6, 6);
    this.scene.add(keyLight);

    // 3. Cyber Neon Magenta Rim Light (Left)
    const leftRimLight = new THREE.DirectionalLight(0xd946ef, 3.0);
    leftRimLight.position.set(-6, 2, -2);
    this.scene.add(leftRimLight);

    // 4. Cyber Neon Cyan Rim Light (Right)
    const rightRimLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
    rightRimLight.position.set(6, -2, -2);
    this.scene.add(rightRimLight);

    // 5. Specular Corner Highlight (Bottom)
    const bottomLight = new THREE.PointLight(0xffffff, 1.5, 20);
    bottomLight.position.set(0, -5, 4);
    this.scene.add(bottomLight);
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public async renderDevice(options: Render3DOptions): Promise<HTMLCanvasElement> {
    const {
      deviceType,
      deviceColor,
      rotateX,
      rotateY,
      rotateZ,
      screenshotUrl,
    } = options;

    // Clear old phone mesh
    while (this.phoneGroup.children.length > 0) {
      const obj = this.phoneGroup.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      this.phoneGroup.remove(obj);
    }

    const colorConfig = CHASSIS_COLORS[deviceColor] || CHASSIS_COLORS["titanium-dark"];

    // Dimensions for 3D Phone (Phone aspect ratio ~ 19.5:9)
    const phoneWidth = 2.4;
    const phoneHeight = 5.0;
    const phoneDepth = 0.22;
    const cornerRadius = deviceType === "android" ? 0.38 : 0.48;

    // 1. CHASSIS GEOMETRY (Extruded Rounded Rectangle with Bevel)
    const chassisShape = createRoundedRectShape(phoneWidth, phoneHeight, cornerRadius);
    const extrudeSettings = {
      steps: 1,
      depth: phoneDepth,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelOffset: 0,
      bevelSegments: 5,
    };

    const chassisGeometry = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
    chassisGeometry.center();

    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: colorConfig.body,
      metalness: colorConfig.metalness,
      roughness: colorConfig.roughness,
      envMapIntensity: 1.5,
    });

    const chassisMesh = new THREE.Mesh(chassisGeometry, chassisMaterial);
    this.phoneGroup.add(chassisMesh);

    // 2. METALLIC RIM BAND (Accent Bevel Chamfer)
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: colorConfig.rim,
      metalness: 0.95,
      roughness: 0.12,
    });
    const rimMesh = new THREE.Mesh(chassisGeometry, rimMaterial);
    rimMesh.scale.set(1.002, 1.002, 0.98);
    this.phoneGroup.add(rimMesh);

    // 3. SCREEN PLANE
    const screenWidth = phoneWidth - 0.14;
    const screenHeight = phoneHeight - 0.14;
    const screenRadius = cornerRadius - 0.06;
    const screenShape = createRoundedRectShape(screenWidth, screenHeight, screenRadius);
    const screenGeometry = new THREE.ShapeGeometry(screenShape);

    // Load or reuse screenshot texture
    let screenMaterial: THREE.MeshBasicMaterial;
    if (screenshotUrl) {
      if (this.currentScreenshotUrl !== screenshotUrl) {
        this.currentScreenshotUrl = screenshotUrl;
        this.currentTexture = await new Promise<THREE.Texture>((resolve) => {
          this.textureLoader.load(screenshotUrl, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            resolve(tex);
          });
        });
      }
      screenMaterial = new THREE.MeshBasicMaterial({
        map: this.currentTexture,
      });
    } else {
      screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x09090d,
      });
    }

    this.screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    this.screenMesh.position.set(0, 0, phoneDepth / 2 + 0.045);
    this.phoneGroup.add(this.screenMesh);

    // 4. DYNAMIC ISLAND / PUNCH HOLE CAMERA
    if (deviceType === "android") {
      // Android Punch Hole
      const punchGeo = new THREE.CircleGeometry(0.065, 32);
      const punchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const punchMesh = new THREE.Mesh(punchGeo, punchMat);
      punchMesh.position.set(0, phoneHeight / 2 - 0.28, phoneDepth / 2 + 0.048);
      this.phoneGroup.add(punchMesh);
    } else {
      // iPhone Dynamic Island Pill
      const pillShape = createRoundedRectShape(0.72, 0.18, 0.09);
      const pillGeo = new THREE.ShapeGeometry(pillShape);
      const pillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const pillMesh = new THREE.Mesh(pillGeo, pillMat);
      pillMesh.position.set(0, phoneHeight / 2 - 0.28, phoneDepth / 2 + 0.048);
      this.phoneGroup.add(pillMesh);
    }

    // 5. PHYSICAL 3D BUTTONS
    const btnMat = new THREE.MeshStandardMaterial({
      color: colorConfig.rim,
      metalness: 0.9,
      roughness: 0.2,
    });

    // Right Side: Power Button
    const powerBtnGeo = new THREE.BoxGeometry(0.05, 0.6, 0.08);
    const powerBtn = new THREE.Mesh(powerBtnGeo, btnMat);
    powerBtn.position.set(phoneWidth / 2 + 0.05, 0.3, 0);
    this.phoneGroup.add(powerBtn);

    // Left Side: Volume Buttons
    const volUpBtnGeo = new THREE.BoxGeometry(0.05, 0.45, 0.08);
    const volUpBtn = new THREE.Mesh(volUpBtnGeo, btnMat);
    volUpBtn.position.set(-phoneWidth / 2 - 0.05, 0.6, 0);
    this.phoneGroup.add(volUpBtn);

    const volDownBtnGeo = new THREE.BoxGeometry(0.05, 0.45, 0.08);
    const volDownBtn = new THREE.Mesh(volDownBtnGeo, btnMat);
    volDownBtn.position.set(-phoneWidth / 2 - 0.05, 0.05, 0);
    this.phoneGroup.add(volDownBtn);

    // 6. APPLY 3D ROTATION
    this.phoneGroup.rotation.x = THREE.MathUtils.degToRad(rotateX);
    this.phoneGroup.rotation.y = THREE.MathUtils.degToRad(rotateY);
    this.phoneGroup.rotation.z = THREE.MathUtils.degToRad(rotateZ);

    // Render WebGL frame
    this.renderer.render(this.scene, this.camera);

    return this.canvas;
  }

  public dispose() {
    this.renderer.dispose();
  }
}

// Global Singleton for fast caching
let globalStudio: ThreeDeviceStudio | null = null;

export function getThreeDeviceStudio(): ThreeDeviceStudio {
  if (!globalStudio) {
    globalStudio = new ThreeDeviceStudio(1080, 1080);
  }
  return globalStudio;
}
