
import React from 'react'
import {Spinner} from 'react-bootstrap'


function Loader() {
  return (
    <Spinner animation="border" role="status" style={{height:'100px',width:'100px',margin:'auto',display:'block'}} className='mb-5'>
        <span className="sr-only">Ładowanie...</span>
    </Spinner>
  )
}


export default Loader