/**
 * @func 材质Material和给材质增加贴图
 * @aim 本文核心
 * （1）给材质增加纹理，纹理贴图
 * （2）同一个material的贴图加载进度级状态统一管理
 */ 


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(1, 1, 8)

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1)


/**
 * @func 定义纹理加载进度及状态回调函数
 * @desc 纹理加载器里的所有纹理都会被纹理管理器所管理
 */
const loaderEvent = {
    onStart: (url, itemsLoaded, itemsTotal) => {
        console.log( '* Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    },
    onLoad: () => {
        console.log('* All texture loaded');
    },
    onProgress: (url, itemsLoaded, itemsTotal) => {
        console.log( '* Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        console.log('Loading percentage', (itemsLoaded * 100 / itemsTotal).toFixed(2) + '%');
    },
    onError: (url) => {
        console.log('* 纹理加载失败：', url);
    }
}
const loaderManager = new THREE.LoadingManager(loaderEvent.onLoad, loaderEvent.onProgress, loaderEvent.onError)
loaderManager.onStart = loaderEvent.onStart // 构造函数无onStart的入参，因此需要自己传入


/**
 * @func 给材质增加纹理（加载一张图片给物体对象表面贴图）
 * @desc load()在dist文件夹下的相对目录里载入图片
 * @desc 使用MeshBasicMaterial的map属性给材质贴图
 * @desc 载入加载管理器
 */
const textureLoader = new THREE.TextureLoader(loaderManager)
const mapTexture = textureLoader.load('./texture/map.png')


/**
 * @func 设置纹理偏移、旋转、旋转原点、重复方式、重复策略等
 */
// 设置纹理偏移
mapTexture.offset.set(0, 0) // mapTexture.offset.x = 0.05,  mapTexture.offset.y = 0.05
// 设置纹理旋转45度，
// 此时是按左下角进行旋转
// mapTexture.rotation = Math.PI / 4 // 旋转45度，Math.PI = 180度
// 设置全纹理的中心 - 设置旋转原点为本案例的中心
// mapTexture.center.set(0.5, 0.5)

// 设置贴图的重复,Vector2 - 横向重复次数，纵向重复次数
mapTexture.repeat.set(2, 1)
// 此时，虽然设置了重复，但依据官网解释，只会将纹理贴图的边缘推至物体边缘，因此需要设置重复的模式
mapTexture.wrapS = THREE.MirroredRepeatWrapping // wrapS水平方向 - 镜像重复
mapTexture.wrapT = THREE.RepeatWrapping // wrapT垂直方向 - 正常无限重复



// 设置材质的纹理贴图
const material = new THREE.MeshBasicMaterial({ map: mapTexture })
const cube = new THREE.Mesh(geometry, material)
cube.position.set(0, 0, 0)

// object add to scene
scene.add(cube)

// Renderer
const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Controls 
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // 给控制器增加阻尼、惯性 - 需在动画循环里调用update方法

// 添加辅助坐标轴
const axesHelper = new THREE.AxesHelper(5) // 坐标周长度为5
scene.add(axesHelper)

/**
 * @func 跟随屏幕resize
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
