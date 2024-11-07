import { useKeyboardControls } from '@react-three/drei'
import React from 'react'
import useGames from '../stores/useGames'
import { useEffect,useRef } from 'react'
import { addEffect } from '@react-three/fiber'

const Interface = () => {
   const time=useRef()
   useEffect(()=>{
      const unsubsrcribeEffect=addEffect(()=>{
         let state=useGames.getState()
         let elapsedTime=0
         if(state.phase==="playing"){
            elapsedTime=Date.now()-state.startTime
         }
         if(state.phase==="ended"){
            elapsedTime=state.endTime-state.startTime
         }
         elapsedTime/=1000
         elapsedTime=elapsedTime.toFixed(2)
         if(time.current){
            time.current.textContent=elapsedTime
         }

      })
      return(()=>{
         unsubsrcribeEffect()
      })
   },[])
     const restart=useGames((state)=>(state.restart))
     const phase=useGames((state)=>(state.phase))

    const forward =useKeyboardControls((state)=>(state.forward))
    const backward =useKeyboardControls((state)=>(state.backward))
    const leftward =useKeyboardControls((state)=>(state.leftward))
    const rightward =useKeyboardControls((state)=>(state.rightward))
    const jump=useKeyboardControls((state)=>(state.jump))
   
  return (
    <div className='interface'>
         <div ref={time} className="time">
            0.00
         </div>
         {
            phase==="ended"&&<div onClick={restart} className="restart">
            Restart
         </div>
         }
         
         <div className="controls">
            <div className="raw">
             <div className={`key ${forward?"active":""}`}>

             </div>
            </div>
            <div className="raw">
            <div className={`key ${leftward?"active":""}`}></div>
            <div className={`key ${backward?"active":""}`}></div>
            <div className={`key ${rightward?"active":""}`}></div>

            </div>
            <div className="raw">
               <div className={`key large ${jump?"active":""}`}></div>
            </div>
         </div>
    </div>
  )
}

export default Interface