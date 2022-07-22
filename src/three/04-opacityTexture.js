/**
 * @func 基础案例
 * @aim 本文核心
 * （1）入门和作为其他案例的模版使用
 * （2）解决显示器resize后画布canvas跟随变新问题
 * （3）利用循环渲染让物体在场景中动起来
 */


import * as THREE from 'three'
import { DoubleSide } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

// 核心元素三：Objects = Mesh(geometry, material)
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 给材质增加纹理（加载一张图片给物体对象表面贴图）
const textureLoader = new THREE.TextureLoader()
const mapTexture = textureLoader.load('./texture/map.png')
// const mapAplhaTexture = textureLoader.load('./texture/pureBlack.png') // 黑色贴图会让物体对象表面透明
// const mapAplhaTexture = textureLoader.load('./texture/pureWhite.png') // 白色贴图会让物体对象表面不透明
const mapAplhaTexture = textureLoader.load('./texture/alpha.png') // 中间白，两边黑透明纹理贴图
// const mapAplhaTexture = textureLoader.load('./texture/alpha2.png') // 中间黑，两边白透明纹理贴图

const material = new THREE.MeshBasicMaterial({ 
    map: mapTexture,
    alphaMap: mapAplhaTexture,
    transparent: true // transparent设置为ture表示开启材质允许透明。为false时，则opacity和alphaMap都不生效
})
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)

// object add to scene
scene.add(cube)

/**
 * @func 再添加一个平面物体
 * @desc 默认只渲染正面，不渲染背面。可以给材质设置side属性为doubleSide表示正背面都渲染
 */
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1), 
    new THREE.MeshBasicMaterial({ map: mapTexture, side: THREE.DoubleSide })
)
plane.position.set(2, 0, 0)
scene.add(plane)

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