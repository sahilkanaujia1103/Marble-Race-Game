import {OrbitControls, useGLTF,} from '@react-three/drei'
import Light from './Light'
import Levels from './Levels'
import { Debug, Physics } from '@react-three/rapier'
import Player from './Player'
import Interface from './Interface'
import useGames from '../stores/useGames'






const Experience = () => {
  const blockCount=useGames((state)=>(state.blockCount))
  const blockSeed=useGames((state)=>(state.blockSeed))
  
  

   return(
    <>
    <color args={["#252731"]} attach={"background"}/>
    <Physics>
    {/* <Debug/> */}
     
      <Light/>
      <Levels count={blockCount} seed={blockSeed}/>
      <Player/>
      </Physics>
    </>
   )

  
}

export default Experience