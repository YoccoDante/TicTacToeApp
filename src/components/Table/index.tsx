import { useEffect, useState } from "react"
import { TableModel } from "../../models/tableModel"
import './index.css'
import Dialog from "../Dialog"
import useBackendConnection from "../../hooks/backendConnection"

function Table() {
  const {MakeAiMove, CheckVictory} = useBackendConnection()
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
    MakeAiMove({table, setTurn, placeSimbol})
  }

  const checkVictory = async () => {
    CheckVictory({table, setVictory, setTie, setDefeat})
  }

  const tableClass = victory? 'Table Green' : defeat? 'Table Red' : 'Table'
  const turnClass = turn? 'Turno Green' : 'Turno Red'

  useEffect(() => {
    checkVictory()
    const espacios = espaciosLibres()
    if(!turn){
      makeAIMove()
    }
  },[turn])

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
    <p className={turnClass}>{turn? 'Te toca' : 'es el turno de: O'}</p>
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