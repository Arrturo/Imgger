import React, {useState} from 'react'
import {Button, Form} from 'react-bootstrap'
import {useNavigate, useLocation} from 'react-router-dom'

function SearchBox() {

    const [keyword, setKeyword] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    const submitHandler = (e) =>{
        e.preventDefault()
        navigate(`/search/${keyword}`)
        window.location.reload()
    }

  return (
    <Form onSubmit={submitHandler} className="inline-flex ms-auto">
        <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} className="min-w-full" placeholder={`Images, #tags, @users `}>
        </Form.Control>
        <Button type='submit' variant='outline-success' className="p-2">Search</Button>
    </Form>
  )
}

export default SearchBox