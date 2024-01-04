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
    dice: { model: any; body: CANNON.Body; };

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

        this.getDice()

        this.dice = {
            model: undefined,
            body: undefined
        }

        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
        })

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
            const scale = 0.6
            const model = gltf.scene
            model.scale.set(scale, scale, scale)
            model.rotation.set(
                Math.random() * Math.PI,
                0,
                Math.random() * Math.PI
            )

            this.dice.body = new CANNON.Body({
                mass: 0.3,
                shape: new CANNON.Box(new CANNON.Vec3(0.6, 0.6, 0.6)),
                position: new CANNON.Vec3(0, 10, 0),
            });

            this.dice.body.quaternion.copy(new CANNON.Quaternion(model.quaternion.x,model.quaternion.y,model.quaternion.z,model.quaternion.w))
            this.dice.body.applyImpulse(
                new CANNON.Vec3(-Math.random() * 3, Math.random() * 3, 0),
                new CANNON.Vec3(0, 0, 0.2)
            );
            this.world.addBody(this.dice.body);

            this.scene.add( model );
            this.dice.model = model
            

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.world.fixedStep()
        this.dice.model.position.copy(this.dice.body.position);
        this.dice.model.quaternion.copy(this.dice.body.quaternion);


        this.renderer.render( this.scene, this.camera );
    }

    
}




export { Scene }