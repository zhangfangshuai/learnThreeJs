/**
 * @func PBR渲染，基于物理的渲染
 * @aim 本文核心
 * 前提，先了解PBR，了解灯光属性和表面属性
 * （1）灯光属性：直接照明、间接照明、直接高光、间接高光、阴影、环境光闭塞
 * （2）表面属性：基础色、法线、高光、粗糙度、金属度
 */


import * as THREE from 'three'
import { DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(3, 2, 5)

// 核心元素三：Objects = Mesh(geometry, material)
const geometry = new THREE.BoxGeometry(2, 2, 2, 20, 20, 20)

// 定义贴图纹理
const textureLoader = new THREE.TextureLoader()
const mapTexture = textureLoader.load('./texture/map.png')

// 定义置换纹理
const displacementTextureLoader = new THREE.TextureLoader()
const displacementTexture = displacementTextureLoader.load('./texture/map.png')

/**
 * @func 定义标准物理材质-MeshStandardMaterial
 * @desc 必须要有灯光才会显示
 */
const material = new THREE.MeshStandardMaterial({
    map: mapTexture,
    side: THREE.DoubleSide,
    roughness: 0.1,  // 粗超度，0-表示镜面光滑，反光效果最好。1-最粗糙，不会镜面反光
    // roughnessMap: roughnessTexture  // 可以设置粗糙度纹理贴图-此处没有该图片
    metalness: 0.2, // 金属光泽 - 一般用于金属被光线照射时产生反光效果。本属性设置的是未被光照射时的光线强度
    // metalnessMap: metalnessTexture  // 可以设置粗糙度纹理贴图-此处没有该图片
    normalMap: mapTexture // 法线贴图 - 决定光线照射下，此处是否需要被反光
})

const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)
// 添加到场景中
scene.add(cube)

const planeGeometry = new THREE.PlaneBufferGeometry(2, 2, 20, 20)
const planeMaterial = new THREE.MeshStandardMaterial({
    map: mapTexture,
    side: THREE.DoubleSide,
    displacementMap: displacementTexture, // 置换贴图的纹理
    displacementScale: 0.1 // 设置置换纹理对突出的最大影响
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.set(3, 0, 0)
scene.add(plane)


/**
 * @func 定义灯光
 * （1）灯光颜色；（2）光照的强度
 */
// 环境光，每个方向都会投射过来的光
const light = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(light)
// 平行光（直线光源）某一个特定方向投射过来的光源
const directionalLight = new THREE.DirectionalLight(0xf5f5f5, 1)
directionalLight.position.set(5, 7, 10)
scene.add(directionalLight)


// 核心元素四：Renderer - 将内容渲染到dom的canvas上
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 核心元素五：Controls - 使用户可操控Object3D
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 给控制器增加阻尼、惯性 - 需在动画循环里调用update方法

// 添加辅助坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func 跟随屏幕resize
 * （1）更新摄像头
 * （2）更新渲染器
 */
window.addEventListener('resize', () => {
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix()

    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})

/**
 * @func 动画效果，循环渲染
 */
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera) // render to viewport
}

animate()