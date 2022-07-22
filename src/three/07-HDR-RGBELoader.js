/**
 * @func HDR：高动态范围图像，360度全景图-可设置为环境环绕图使用（普通环境图由上下左右六张图构成）
 * @aim 本文核心
 * （1）HDR增加了亮度范围，改善了动态对比度，提升最亮和罪案画面的对比度，以便用户看到更多的细节
 * （2）使用RGBLoader载入一张.hdr图
 * （3）把纹理平面贴图改为等距的经纬球效果，观察者在球心
 */


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 核心元素一：Scene
const scene = new THREE.Scene()
// 核心元素二：Camera - 负责观察场景及场景中的物体对象
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

// 加载hdr环境图
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./textures/hdr/street.hdr').then(texture => {
    // 把纹理平面贴图改为等距的经纬球效果，观察者在球心
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture
    scene.environment = texture
})

const sphereGeometry = new THREE.SphereGeometry(2)
const material = new THREE.MeshStandardMaterial({
    metalness: 0.9,
    roughness: 0.1
})
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// 定义环境光
const envLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(envLight)

// 核心元素四：Renderer - 将内容渲染到dom的canvas上
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 核心元素五：Controls - 使用户可操控Object3D
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 给控制器增加阻尼、惯性 - 需在动画循环里调用update方法

// 添加辅助坐标轴
// const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
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
    controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera) // render to viewport
}

animate()
