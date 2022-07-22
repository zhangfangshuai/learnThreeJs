/**
 * @func PBR渲染，基于物理的渲染
 * @aim 本文核心
 * 前提，先了解PBR，了解灯光属性和表面属性
 * （1）灯光属性：直接照明、间接照明、直接高光、间接高光、阴影、环境光闭塞
 * （2）表面属性：基础色、法线、高光、粗糙度、金属度
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(3, 2, 5)

// 定义贴图纹理
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.setPath('./textures/envMaps/1/').load([
    'px.jpg',
    'nx.jpg',
    'py.jpg',
    'ny.jpg',
    'pz.jpg',
    'nz.jpg'
])

// 创造一个球体
const sphereGeometry = new THREE.SphereGeometry(2, 50, 50)
const material = new THREE.MeshStandardMaterial({
    // envMap: envMapTexture,
    roughness: 0,
    metalness: 0.8
})
const sphere = new THREE.Mesh(sphereGeometry, material)
// 添加到场景中
scene.add(sphere)

// 给场景添加背景
scene.background = envMapTexture
// 给场景的所有物体增加默认的背景，设置此值后，material就可以不用设置envMap了
scene.environment = envMapTexture



/**
 * @func 定义灯光
 * （1）灯光颜色；（2）光照的强度
 */
// 环境光，所有方向投射进入
const light = new THREE.AmbientLight(0xffffff, 0.9)
// scene.add(light)
// 直接光，某一特定方向投射进入
const directionalLight = new THREE.DirectionalLight(0xf5f5f5, 0.8)
directionalLight.position.set(-2, 0, 0)
scene.add(directionalLight)


// 核心元素四：Renderer - 将内容渲染到dom的canvas上
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 核心元素五：Controls - 使用户可操控Object3D
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 给控制器增加阻尼、惯性 - 需在动画循环里调用update方法

// 坐标轴
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

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