import * as THREE from 'three';
import * as CANNON from 'cannon-es'

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    blocks: any
    world: CANNON.World;
    dice: { model: any; body: CANNON.Body; direction?: {
        one: THREE.Mesh,
        two: any,
        three: any,
        four: any,
        five: any,
        six: any,
    } }[];

    constructor() {

        this.init()
    }

    async init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
    
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        this.camera.position.set( 0, 3, 7 );
        this.scene.add(this.camera);
    
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
    
        document.querySelector("#screen").appendChild( this.renderer.domElement );
        
        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
    
    
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        const floor = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        floor.rotation.x = - Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
    
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        for (let index = 0; index < 1; index++) {
            this.getDice()
            
        }

        this.dice = []

        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
        })

        this.world.defaultContactMaterial.restitution = 0.3;
        this.world.allowSleep = true


        const floorBody = new CANNON.Body({
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Plane(),
        });

        floorBody.position.copy(new CANNON.Vec3(floor.position.x, floor.position.y, floor.position.z));
        floorBody.quaternion.copy(new CANNON.Quaternion(floor.quaternion.x, floor.quaternion.y, floor.quaternion.z, floor.quaternion.w));
        this.world.addBody(floorBody);




        this.animate();

    }


    getDice() {
        const loader = new GLTFLoader();

        loader.load( '/public/dice.glb', ( gltf ) => {
            this.dice.push({
                model: undefined,
                body: undefined,
                // direction: {
                //     one: undefined,
                //     two: undefined,
                //     three: undefined,
                //     four: undefined,
                //     five: undefined,
                //     six: undefined,
                // }
            })
            
            const scale = 0.6
            const model = gltf.scene
            model.scale.set(scale, scale, scale)
            model.rotation.set(
                Math.random() * Math.PI / 2,
                0,
                Math.random() * Math.PI / 2
            )


            this.dice[this.dice.length - 1].body = new CANNON.Body({
                mass: 0.3,
                shape: new CANNON.Box(new CANNON.Vec3(0.6, 0.6, 0.6)),
                position: new CANNON.Vec3(0, 10, 0),
                sleepTimeLimit: 0.02,
                sleepSpeedLimit: 0.2
            });

            this.dice[this.dice.length - 1].body.allowSleep = true

            this.dice[this.dice.length - 1].body.quaternion.copy(new CANNON.Quaternion(model.quaternion.x,model.quaternion.y,model.quaternion.z,model.quaternion.w))
            this.dice[this.dice.length - 1].body.applyImpulse(
                new CANNON.Vec3(-Math.random() * 1, Math.random() * 1, 0),
                new CANNON.Vec3(0, 0, 0.2)
            );
            this.world.addBody(this.dice[this.dice.length - 1].body);

            this.scene.add( model );
            this.dice[this.dice.length - 1].model = model

            this.dice[this.dice.length - 1].body.addEventListener("sleep", (e: any) => {
                this.dice[this.dice.length - 1].body.allowSleep = false

                const rotation = new CANNON.Vec3()
                e.target.quaternion.toEuler(rotation)
                const num = this.getDiceNumber(rotation)
                console.log(num)
            })

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    getDiceNumber(rotation: any) {
        const errorRate = 0.2
        // https://codepen.io/ksenia-k/pen/QWZVvxm?editors=1010
        // NOTE: 빠르게 개발하기 위해 가져다 씀. 나중에 리팩토링 할 예정.
        let isZero = (angle: any) => Math.abs(angle) < errorRate;
        let isHalfPi = (angle: any) => Math.abs(angle - 0.5 * Math.PI) < errorRate;
        let isMinusHalfPi = (angle: any) => Math.abs(0.5 * Math.PI + angle) < errorRate;
        let isPiOrMinusPi = (angle: any) => Math.abs(Math.PI - angle) < errorRate || Math.abs(Math.PI + angle) < errorRate;
    
        if (isZero(rotation.z)) {
            if (isZero(rotation.x)) {
                return 6
            } else if (isHalfPi(rotation.x)) {
                return 2
            } else if (isMinusHalfPi(rotation.x)) {
                return 4
            } else if (isPiOrMinusPi(rotation.x)) {
                return 5
            }
        } else if (isHalfPi(rotation.z)) {
            return 1
        } else if (isMinusHalfPi(rotation.z)) {
            return 3
        }
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.world.fixedStep()
        for (let index = 0; index < this.dice.length; index++) {
            this.dice[index].model.position.copy(this.dice[index].body.position);
            this.dice[index].model.quaternion.copy(this.dice[index].body.quaternion);

            // console.log(this.dice[index].model.rotation.x)

        }

        this.renderer.render( this.scene, this.camera );
    }

    
}




export { Scene }