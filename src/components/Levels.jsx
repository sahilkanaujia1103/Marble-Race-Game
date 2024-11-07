import { Float, Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import React, { useMemo, useRef, useState } from 'react'
import * as THREE from "three"

 
THREE.ColorManagement.legacyMode=false

const boxGeometry=new THREE.BoxGeometry(1,1,1)
const floor1Material=new THREE.MeshStandardMaterial({color:"#111111",metalness:0,roughness:0})
const floor2Material=new THREE.MeshStandardMaterial({color:"#222222",metalness:0,roughness:0})
const obstacleMaterial=new THREE.MeshStandardMaterial({color:"#ff0000",metalness:0,roughness:1})
const WallMaterial=new THREE.MeshStandardMaterial({color:"#887777",metalness:0,roughness:0})
 export function BlockStart({position=[0,0,0]}){
    return(
        <group position={position}>
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
            <Text
            font='./bebas-neue-v9-latin-regular.woff'
            scale={4}
            maxWidth={0.25}
            lineHeight={0.75}
            textAlign='right'
            position={[0.75,0.65,0]}
            rotation-y={-0.25}
            >
                MARBLE RACE
                <meshBasicMaterial toneMapped={false}/>
            </Text>
        </Float>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                receiveShadow
                position={[0,-0.1,0]}
                scale={[4,0.2,4]}
            />
        </group>
    )
}
export function BlockSpinner({position=[0,0,0]}){
    const obstacle= useRef()
    const [speed]=useState(()=>(Math.random()+0.2)*(Math.random()<0.5?-1:1))

    useFrame((state)=>{
        let time=state.clock.getElapsedTime()
        const rotation=new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0,time*speed,0))
        obstacle.current.setNextKinematicRotation(rotation)

    })
    return(
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                receiveShadow
                position={[0,-0.1,0]}
                scale={[4,0.2,4]}
            />
            <RigidBody
            ref={obstacle}
            type='kinematicPosition' position={[0,0.3,0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5,0.3,0.3]}
                receiveShadow
                castShadow
            />
            </RigidBody>
        </group>
    )
}
export function BlockLimbo({position=[0,0,0]}){
    const obstacle= useRef()
    const [speed]=useState(()=>(Math.random()+0.2)*(Math.random()<0.5?-1:1))
    const [offSet]=useState(Math.random()*Math.PI*2)

    useFrame((state)=>{
        let time=state.clock.getElapsedTime()
        const y=Math.sin(time+offSet) +1.15
        obstacle.current.setNextKinematicTranslation({x:position[0],y:position[1]+ y,z:position[2]})

    })
    return(
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                receiveShadow
                position={[0,-0.1,0]}
                scale={[4,0.2,4]}
            />
            <RigidBody
            ref={obstacle}
            type='kinematicPosition' position={[0,0.3,0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[3.5,0.3,0.3]}
                receiveShadow
                castShadow
            />
            </RigidBody>
        </group>
    )
}
export function BlockAxe({position=[0,0,0]}){
    const obstacle= useRef()
    const [speed]=useState(()=>(Math.random()+0.2)*(Math.random()<0.5?-1:1))
    const [offSet]=useState(Math.random()*Math.PI*2)

    useFrame((state)=>{
        let time=state.clock.getElapsedTime()
        const x=Math.sin(time+offSet) *1.25
        obstacle.current.setNextKinematicTranslation({x:x+position[0],y:position[1]+0.75,z:position[2]})

    })
    return(
        <group position={position}>
            <mesh
                geometry={boxGeometry}
                material={floor2Material}
                receiveShadow
                position={[0,-0.1,0]}
                scale={[4,0.2,4]}
            />
            <RigidBody
            ref={obstacle}
            type='kinematicPosition' position={[0,0.3,0]} restitution={0.2} friction={0}>
            <mesh
                geometry={boxGeometry}
                material={obstacleMaterial}
                scale={[1.5,1.5,0.3]}
                receiveShadow
                castShadow
            />
            </RigidBody>
        </group>
    )
}

export function BlockEnd({position=[0,0,0]}){

    const hamburger=useGLTF("./hamburger.glb")
    hamburger.scene.children.forEach((mesh)=>{
        mesh.castShadow=true
    })
    return(
        <group position={position}>
        <Text 
        position={[0,1.2,2]}
        scale={8}
        font='./bebas-neue-v9-latin-regular.woff'>
            FINISH
            <meshBasicMaterial toneMapped={false}/>
        </Text>
            <mesh
                geometry={boxGeometry}
                material={floor1Material}
                receiveShadow
                position={[0,0,0]}
                scale={[4,0.2,4]}
            />
            <RigidBody restitution={0.2}
             friction={0}
              type="fixed"
              position={[0,0.25,0]}
              colliders="hull">
            <primitive 
             object={hamburger.scene} scale={0.2}/>
             </RigidBody>
        </group>
    )
}
function Bounds({length=1}){
    return(
        <>
<RigidBody type='fixed'>
  <mesh
  position={[2.15,0.75,-(length*2)+2]}
  geometry={boxGeometry}
  material={WallMaterial}
  scale={[0.3,1.5,length*4]}
  castShadow

  />
   <mesh
  position={[-2.15,0.75,-(length*2)+2]}
  geometry={boxGeometry}
  material={WallMaterial}
  scale={[0.3,1.5,length*4]}
  
  receiveShadow

  />
  <mesh
  position={[0,0.75,-(length*4)+2]}
  geometry={boxGeometry}
  material={WallMaterial}
  scale={[4,1.5,0.3]}
  
  receiveShadow

  />
  <CuboidCollider 
    args={[2,0.1,2*length]}
    position={[0,-0.1,-(length*2)+2]}
    restitution={0.2}
    friction={1}
  />
  </RigidBody>
  </>
    )

  
}

const Levels = ({count=5, types=[BlockSpinner,BlockLimbo,BlockAxe],seed=0}) => {
    const blocks =useMemo(()=>{
        const blocks=[]
        for(let i=0;i<count;i++){
            let type=types[Math.floor(Math.random()*types.length)]
            blocks.push(type)
        }
        return(blocks)

    },[count,types,seed])
  return (
   <>
   <BlockStart position={[0,0,0]}/>
{blocks.map((Blocks,index)=>(
   <Blocks position={[0,0,-(index+1)*4]} key={index}/>
))}
<BlockEnd position={[0,0,-(count+1)*4]}/>
<Bounds length={count+2}/>
   </>
  )
}

export default Levels