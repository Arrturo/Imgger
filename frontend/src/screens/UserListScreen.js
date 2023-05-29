import React, {useState, useEffect, useProps} from 'react'
import { useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Row, Col, Table} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer';
import {listUsers, deleteUser} from '../actions/userActions'
import {LinkContainer} from 'react-router-bootstrap'
import axios from 'axios';


function UserListScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo} = userLogin
    
    const userList = useSelector(state => state.userList)
    const {users} = userList
    
    
    useEffect(() => {
        if(userInfo && userInfo.user.isStaff === true){
            dispatch(listUsers())
        }else{
            navigate(`/login`)
        }
        
    }, [dispatch, navigate])



    const deleteHandler = (id, email) => {
        if(window.confirm(`Are you sure to delete user with email: ${email} ?`)){
            dispatch(deleteUser(id))
            setTimeout(() => {
                window.location.reload()
            }, 1000)
    
        }    
    } 
    console.log(users)


  return (
    <div>
        <h1 className="text-4xl text-center mb-5">Registered users in PySquad ({users?.length})</h1>
        {loading ? <Loader /> : error ?
            <Message varinat='danger'>{error}</Message>:
            (
                <Table striped hover responsive className="table-sm mb-5">
                    <thead className="text-center ">
                        <tr>
                            <th>Id</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Date of join</th>
                            <th>Admin</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {users.map(user => (
                            <tr key={user.node.id}>
                                <td>{user.node.id}</td>
                                <td>{user.node.username}</td>
                                <td>{user.node.email}</td>
                                <td>{(user.node.dateJoined).substring(0, 10)}</td>
                                <td>{user.node.isStaff ? (
                                    <i class="fa-solid fa-circle-check text-lime-500"></i>
                                    ): <i class="fa-solid fa-circle-minus text-red-500"></i>}</td>
                                <td>
                                    <a href={`/admin/userlist/${user.node.id}/edit`}><Button varinat='light' className="btn-m"><i class="fa-regular fa-pen-to-square text-lime-500"></i></Button></a>
                                    
                                    <Button varinat='danger' className="btn-m" onClick={() => deleteHandler(user.node.id, user.node.email)} ><i class="fa-solid fa-trash-can text-red-500"></i></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            )}
    </div>
  )
}

export default UserListScreen