import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { RigidBody, useRapier } from '@react-three/rapier'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from "three"
import useGames from '../stores/useGames'

const Player = () => {
    const body =useRef()
    const [smoothCameraPosition]=useState(()=>(new THREE.Vector3(10,10,10)))
    const [smoothCameraTarget]=useState(()=>(new THREE.Vector3()))
    const [subscribeKey,getKey]=useKeyboardControls()
    const {rapier,world}=useRapier()
    const rapierWorld=world.raw()

    const start=useGames((state)=>(state.start))
    const end=useGames((state)=>state.end)
    const restart=useGames((state)=>state.restart)
    const blockCount=useGames((state)=>(state.blockCount))

    const jump=()=>{
         const origin=body.current.translation()
         origin.y-=0.31
         const direction={x:0,y:-1,z:0}
         const ray =new rapier.Ray(origin,direction) 
         const hit=rapierWorld.castRay(ray,10,true)
     if(hit.toi<0.15){
        body.current.applyImpulse({x:0,y:0.5,z:0})
    }
     }  
         
   const reset=()=>{
   
    body.current.setTranslation({x:0,y:1,z:0})
    body.current.setLinvel({x:0,y:0,z:0})
    body.current.setAngvel({x:0,y:0,z:0})


   }
    useEffect(()=>{
   const unsubsrcibeReset=useGames.subscribe(
    (state)=>(state.phase),
    (value)=>{
       
        if(value==="ready"){
            reset()
        }
       
           
    }

   )

      const unSubscribeJump=subscribeKey(
        (state)=>(state.jump),
        (value)=>{
            if(value){
               jump()
            }
        }
      )
      const unSubscribeAny=subscribeKey(
          ()=>{
            start()
          }
      )
  
      return(
       ()=>{
        unSubscribeJump()
        unSubscribeAny()
        unsubsrcibeReset()
       }
      )
    },[])
    useFrame((state,delta)=>{
        const {forward,backward,leftward,rightward}=getKey()
        const impulse={x:0,y:0,z:0}
        const torque={x:0,y:0,z:0}
        const impulseStrength=0.6*delta
        const torqueStrength=0.2*delta
        if(forward){
            impulse.z-=impulseStrength
            torque.x-=torqueStrength
        }
        if(rightward){
            impulse.x+=impulseStrength
            torque.z-=torqueStrength
        }
        if(backward){
            impulse.z+=impulseStrength
            torque.x+=torqueStrength
        }
        if(leftward){
            impulse.x-=impulseStrength
            torque.z+=torqueStrength
        }
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        const bodyPosition=body.current.translation()
        const cameraPosition=new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z+=2.25
        cameraPosition.y+=0.65

        const cameraTarget=new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraPosition.y+=0.25
        smoothCameraPosition.lerp(cameraPosition,5*delta)
        smoothCameraTarget.lerp(cameraTarget,5*delta)
        state.camera.position.copy(smoothCameraPosition)
        state.camera.lookAt(smoothCameraTarget)
        if(bodyPosition.z<-(blockCount*4+2)){
            end()
        }
        if(bodyPosition.z>4|| bodyPosition.y<-4){
            restart()
        }

    })

  return (
    <>
    <RigidBody ref={body} colliders="ball" 
    restitution={0.2} 
    friction={1} 
    position={[0,1,0]}
    linearDamping={0.5}
    angularDamping={0.5}>
        <mesh castShadow>
            <icosahedronGeometry args={[0.3,1]}/>
            <meshStandardMaterial flatShading color={"mediumpurple"}/>
        </mesh>
    </RigidBody>
    </>
  )
}

export default Player