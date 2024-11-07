import { useState } from 'react'

import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'
import * as THREE from "three"
import { toneMapping } from 'three/examples/jsm/nodes/Nodes.js'
import { Leva } from 'leva'
import { KeyboardControls } from '@react-three/drei'
import Interface from './components/Interface'
function App() {


  return (
    <>
    <KeyboardControls
    map={[
      {name:"forward",keys:["ArrowUp","KeyW"]},
      {name:"backward",keys:["ArrowDown","KeyS"]},
      {name:"leftward",keys:["ArrowLeft","KeyA"]},
      {name:"rightward",keys:["ArrowRight","KeyD"]},
      {name:"jump",keys:["Space"]}
    ]}>
    <Leva collapsed/>
      <Canvas 
      gl={{
        antialias:true,
        toneMapping:THREE.ACESFilmicToneMapping,
        outputEncoding:THREE.sRGBEncoding

      }}
      camera={{
        fov:45,
        near:0.1,
        far:200,
        position:[2.5,4,6]
      }}
      shadows
      flat
     >
       <Experience/>
      </Canvas>
      <Interface/>
      </KeyboardControls>
    </>

  )
}

export default App
