import React, { useState, useEffect, useProps } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { listUsers, deleteUser } from "../actions/userActions";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";

function UserListScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();


    const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo} = userLogin
    
    const userList = useSelector(state => state.userList)
    const {users, usersCount} = userList

    const [activePage, setActivePage] = useState(1);
    const [loadingPage, setLoadingPage] = useState(false);
    const usersPerPage = 10;
    
    
    useEffect(() => {
        if(userInfo && userInfo.user.isStaff === true){
            dispatch(listUsers((activePage - 1) * usersPerPage))
        }else{
            navigate(`/login`)
        }
        
    }, [dispatch, navigate, userInfo, activePage])

    const handlePageChange = (pageNumber) => {
        setLoadingPage(true);
        setActivePage(pageNumber);
    
        setTimeout(() => {
          setLoadingPage(false);
        }, 300);
      };


    const deleteHandler = (id, email) => {
        if(window.confirm(`Are you sure to delete user with email: ${email} ?`)){
            dispatch(deleteUser(id))
            setTimeout(() => {
                window.location.reload()
            }, 1000)
    
        }    
    } 

  return (
    <div>
        <h1 className="text-4xl text-center mb-5">Registered users in PySquad ({usersCount? usersCount : 0})</h1>
        {loading ? <Loader /> : error ?
            <Message varinat='danger'>{error}</Message>:
            (
                <><Table striped hover responsive className="table-sm mb-5">
                      <thead className="text-center ">
                          <tr>
                              <th></th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Date of join</th>
                              <th>Admin</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody className="text-center">
                          {users.map((user, index) => (
                              <tr key={user?.node.id}>
                                  <td>{index + 1}</td>
                                  <td>{user?.node.username}</td>
                                  <td>{user?.node.email}</td>
                                  <td>{(user?.node.dateJoined).substring(0, 10)}</td>
                                  <td>{user?.node.isStaff ? (
                                      <i class="fa-solid fa-circle-check text-lime-500"></i>
                                  ) : <i class="fa-solid fa-circle-minus text-red-500"></i>}</td>
                                  <td>
                                      <a href={`/admin/userlist/${user?.node.id}/edit`}><Button varinat='light' className="btn-m"><i class="fa-regular fa-pen-to-square text-lime-500"></i></Button></a>

                                      <Button varinat='danger' className="btn-m" onClick={() => deleteHandler(user.node.id, user.node.email)}><i class="fa-solid fa-trash-can text-red-500"></i></Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </Table><ReactPaginate
                          pageCount={Math.ceil(usersCount / usersPerPage)}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          onPageChange={({ selected }) => handlePageChange(selected + 1)}
                          containerClassName="pagination justify-content-center"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          activeClassName="active"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          disabledClassName="disabled" /></>
            )
        }
        <br />
    </div>
    );
}

export default UserListScreen;
