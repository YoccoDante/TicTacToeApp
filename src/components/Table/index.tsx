import { useEffect, useState } from "react"
import { TableModel } from "../../models/tableModel"
import './index.css'
import Dialog from "../Dialog"

function Table() {
  const [ victory, setVictory ] = useState(false)
  const [ defeat, setDefeat ] = useState(false)
  const [ tie, setTie ] = useState(false)
  const turns = [true, false]
  const firstTurnIndex = Math.floor(Math.random() * turns.length)
  const [ turn, setTurn ] = useState(turns[firstTurnIndex])
  const [ table, setTable ] = useState<TableModel>([
    [' ',' ',' '],
    [' ',' ',' '],
    [' ',' ',' '],
  ])

  const replay = () => {
    const firstTurnIndex = Math.floor(Math.random() * turns.length)
    setTable([
      [' ',' ',' '],
      [' ',' ',' '],
      [' ',' ',' '],
    ])
    setTie(false)
    setVictory(false)
    setDefeat(false)
    setTurn(turns[firstTurnIndex])
  }

  const espaciosLibres = () => {
    let espacios = 0
    for (let i=0; i < 3; i++){
      for (let j=0; j < 3; j++){
        if (table[i][j] === ' ') {
          espacios++
        }
      }
    }
    return espacios
  }

  const placeSimbol = (fila:number, valor:number) => {
    const newTable = structuredClone(table)
    newTable[fila][valor] = turn? 'X' : 'O'
    setTable(newTable)
    setTurn(!turn)
  }

  const handleClick = (fila:number, valor:number) => {
    if (defeat || victory || tie) {
      return
    }
    if (table[fila][valor] !== ' '){
      return
    }
    if (!turn) {
      return
    }
    placeSimbol(fila, valor)
  }

  const makeAIMove =async () => {
    const espacios = espaciosLibres()
    if (espacios === 0) {
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:5000/auto',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({mapa:table})
      })
      const data = await res.json()
      if (data.error){
        setTie(true)
      }
      const fila = data.msg[0]
      const valor = data.msg[1]
      placeSimbol(fila, valor)
    }
    catch(error){
      setTie(true)
    }
    finally {
      setTurn(true)
    }
  }

  const checkVictory = async () => {
    const espacios = espaciosLibres()
    if (espacios === 0) {
      setTie(true)
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:5000/result',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({mapa:table})
      })
      const data = await res.json()
      if (data.victory){
        setVictory(true)
      } 
      if (data.defeat) {
        setDefeat(true)
      }
      if (data.tie){
        setTie(true)
      }
    }
    catch(error){
      setTie(true)
    }
  }
    
    

  const tableClass = victory? 'Table Green' : defeat? 'Table Red' : 'Table'

  useEffect(() => {
    if(!turn){
      makeAIMove()
    }
    checkVictory()
  },[placeSimbol])

  return (
    <>
    <div className={tableClass}>
    {table.map((row, fila) =>
      <div className="TableRow" key={fila}>
        {row.map((value, valor) =>
          <div
          onClick={() => handleClick(fila, valor)}
          className={tie? 'TableCell Gray' : "TableCell"}
          key={'cell'+valor}>{table[fila][valor]}</div>
          )}
      </div>
    )}
    </div>
    <p>Es el turno de :{turn? 'X' : 'O'}</p>
    {tie &&
      <Dialog action={replay} text="Ha sido un empate, piensa mejor! Deseas jugar otra vez?"/>
    }
    {defeat &&
      <Dialog action={replay} text="Has perdido, deseas jugar otra vez?"/>
    }
    {victory &&
      <Dialog action={replay} text="Hurra! has ganado!!! Deseas jugar otra vez?"/>
    }
    </>
  )
}

export default Table