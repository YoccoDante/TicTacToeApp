import { useEffect, useState } from 'react'
import './index.css'

interface DialogProps {
    text:string,
    action:any
}

function Dialog({text, action}:DialogProps) {
    const [ visible, setVisible ] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setVisible(true)
        },1000)
    },[])
  return (
    <>
    {visible &&
    <div className='DialogContainer'>
        <div className='DialogBody'>
            <p className='DialogText'>{text}</p>
            <div className='DialogButtonContainer'>
                <button
                className='DialogButton'
                onClick={() => action()}
                >Aceptar</button>
            </div>
        </div>
    </div>
    }
    </>
  )
}

export default Dialog