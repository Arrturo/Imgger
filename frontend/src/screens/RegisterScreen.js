import React, {useState, useEffect, useProps} from 'react'
import FormContainer from '../components/FormContainer';
import {Form, Button, Row, Col, FormGroup} from 'react-bootstrap'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

function RegisterScreen() {

    const [firstName, setFirstName] = useState('')
    const [secondName, setSecondName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const dispatch = useDispatch()

    const location = useLocation()
    const navigate = useNavigate()



    
    const submitHandler = (e) => {
        e.preventDefault()
    }


  return (
    <div>
        <FormContainer >
            <h1 className="text-5xl text-center mb-5 underline decoration-double decoration-amber-500">Sign up</h1>

            <Form onSubmit={submitHandler} className="text-2xl">

                <Form.Group controlId='firstName' className="mt-3">
                    <Form.Label><i class="fa-solid fa-user-large"></i> First name</Form.Label>
                        <Form.Control type='text' placeholder='Enter your first name' value={firstName} onChange={(e)=>setFirstName(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='secondName' className="mt-3">
                    <Form.Label><i class="fa-solid fa-user-large"></i> Second name</Form.Label>
                        <Form.Control type='text' placeholder='Enter your second name' value={secondName} onChange={(e)=>setSecondName(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='nickName' className="mt-3">
                    <Form.Label><i class="fa-solid fa-user-tag"></i> Nickname</Form.Label>
                        <Form.Control type='text' placeholder='Enter your nickname' value={nickname} onChange={(e)=>setNickname(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className="mt-3">
                    <Form.Label><i class="fa-solid fa-at"></i> Email address</Form.Label>
                        <Form.Control type='email' placeholder='Enter your email address' value={email} onChange={(e)=>setEmail(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className="mt-3">
                    <Form.Label><i class="fa-solid fa-lock"></i> Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword' className="mt-3">
                    <Form.Label><i class="fa-solid fa-lock"></i> Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter your password again' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className="mt-4 button-primary text-2xl ">Sign up</Button>
            </Form>

            <Row className="py-3">
                <Col className="text-center text-xl">
                Already have an account <Link to={'/register'} className="text-red-700 hover:text-red-800"> Sign in</Link> now!
                </Col>
            </Row>
        </FormContainer>
            

    </div>
    

  )
}

export default RegisterScreen
