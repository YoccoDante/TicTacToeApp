import React, { useState } from 'react'
import { TableModel } from '../models/tableModel'

interface checkVictoryProps {
    setTie:React.Dispatch<React.SetStateAction<boolean>>,
    setVictory:React.Dispatch<React.SetStateAction<boolean>>,
    setDefeat:React.Dispatch<React.SetStateAction<boolean>>,
    table:TableModel
}

interface MakeAiMoveProps {
    table:TableModel,
    setTurn:React.Dispatch<React.SetStateAction<boolean>>,
    placeSimbol:any
}

const API = 'https://tictactoeaibackend.onrender.com'

function useBackendConnection() {  
  async function MakeAiMove({table, setTurn, placeSimbol}:MakeAiMoveProps) {
    try {
        const res = await fetch(API+'/auto',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({mapa:table})
        })
        const data = await res.json()
        const fila = data.msg[0]
        const valor = data.msg[1]
        placeSimbol(fila, valor)
      }
      catch(error){
        console.log(error)
      }
      finally {
        setTurn(true)
      }
    }

  async function CheckVictory({table, setVictory, setTie, setDefeat}:checkVictoryProps) {
    try {
        const res = await fetch(API + '/result',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({mapa:table})
        })
        const data = await res.json()
        if (data.victory){
          setVictory(true)
          return
        } 
        if (data.defeat) {
          setDefeat(true)
          return
        }
        if (data.tie){
          setTie(true)
          return
        }
      }
      catch(error){
        console.log(error)
      }
  }
  return {
    MakeAiMove,
    CheckVictory
  }
}

export default useBackendConnection