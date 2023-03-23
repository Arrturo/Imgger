
import React, {useState, useEffect, useProps} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Row, Col,Table} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useDispatch, useSelector} from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_DETAILS_RESET } from '../constants/userConstants';


function ProfileScreen() {

    const location = useLocation()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [messagePassword, setMessagePassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()


    const userLogin = useSelector(state => state.userLogin)
    const {error, loading, userInfo} = userLogin
    


     useEffect(() => {
        if(userInfo === null){
            navigate('/login')
        }
        setName(userInfo?.user?.username)
        setEmail(userInfo?.user?.email)

        }, [navigate, userInfo, dispatch])


     const submitHandler = (e) => {
        e.preventDefault()

        if(password != confirmPassword){
            setMessagePassword('The entered passwords are different!')
        }else{
            if(window.confirm(`${name} Are you sure you want to update your details ?`)){
                dispatch(updateUserProfile({
                    'id': userInfo?.user?.pk,
                    'username': name,
                    'email': email,
                    'password': password
            }))
        
        setMessage('user data successfully updated')
    }}}



  return (
    <Row className="flex justify-center">
        <Col md={5} >
            <h2 className="text-4xl text-center mb-3">My account:</h2>
            {loading && <Loader />}
            {error && <Message variant='danger'>{error}</Message>}
            {message && <Message variant='info'>{message}</Message>}
            {messagePassword && <Message variant='danger'>{messagePassword}</Message>}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                        <Form.Control required type='name' placeholder='Enter your name' value={name} onChange={(e)=>setName(e.target.value)}>
            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className="mt-3">
                    <Form.Label>Email address</Form.Label>
                        <Form.Control required type='email' placeholder='Enter your email address' value={email} onChange={(e)=>setEmail(e.target.value)}>
                                
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className="mt-3">
                    <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter your password' value={password} onChange={(e)=>setPassword(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='PasswordConfirm' className="mt-3">
                    <Form.Label>Password confirm</Form.Label>
                        <Form.Control type='Password' placeholder='Enter your password again' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}>
                            
                        </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className="mt-4 button-primary"><i class="fa-regular fa-pen-to-square"></i> Save changes</Button>
            </Form>
        </Col>

    
    </Row>
  )
}

export default ProfileScreen