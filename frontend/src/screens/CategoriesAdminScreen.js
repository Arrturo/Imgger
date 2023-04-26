import React, {useState, useEffect, useProps} from 'react'
import { useNavigate, useLocation, useParams, Link} from 'react-router-dom'
import {Form, Button, Row, Col, Table} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useDispatch, useSelector} from 'react-redux'
import {categoriesList, deleteCategories, createCategory, editCategory} from '../actions/categoriesActions'

function CategoriesAdminScreen() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [message, setMessage] = useState('')

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const CategoriesList = useSelector(state => state.categoriesList)
    const {categories} = CategoriesList

    const [edit, setEdit] = useState(false)
    const [editName, setEditName] = useState('')
    const [idEditCategory, setIdEditCategory] = useState(null)

    
    useEffect(() => {
        if(userInfo === null || userInfo.user.isStaff === false){
            navigate('/login')
        }else{
            dispatch(categoriesList())
        }
    }, [dispatch, navigate])


    const createCategoryHandler = (e) => {
        e.preventDefault()
        if (name === ''){
            setMessage("Name of category is empty!")
        }else{
            dispatch(createCategory(name))
            setTimeout(() => {
                window.location.reload();
              }, 1000);
        }
    }


    const deleteHandler = (id, name) => {
        if(window.confirm(`Are you sure to delete category ${name} ?`)){
            dispatch(deleteCategories(id))
        }
        window.location.reload()
    }

    const setEditdata = (id, name) =>{
        setEditName(name)
        setIdEditCategory(id)
    }


    const editDataSubmitHandler = (ele) => {
        ele.preventDefault()
        dispatch(editCategory({'id': idEditCategory, 'name': editName}))
        window.location.reload()
    }




  return (
    <div >
        <Row className="align-items-center gap-40">
            <Col className="flex justify-center" md={6}>
                <h1 className="text-4xl text-center" >Categories ({categories.length})</h1>
            </Col>
            <Col md={4} className="">
            {edit === true ? 
                (<Form onSubmit={editDataSubmitHandler}>
                    <h1 className="text-4xl text-center">Edit category</h1>
                    <Form.Group controlId='name'>
                        <Form.Label>Name of category</Form.Label>
                            <Form.Control type='name' placeholder='Enter name of category' value={editName} onChange={(ele)=>setEditName(ele.target.value)}>

                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'  className="mt-4 button-primary" ><i class="fa-solid fa-plus"></i> Save changes</Button>
                </Form>) :
                    
                (<Form onSubmit={createCategoryHandler}>
                    <h1 className="text-4xl text-center">Add new category</h1>
                    {message && <Message variant='danger'>{message}</Message>}
                    <Form.Group controlId='name'>
                        <Form.Label>Name of category</Form.Label>
                            <Form.Control type='name' placeholder='Enter name of category' value={name} onChange={(e)=>setName(e.target.value)}>
                    
                            </Form.Control>
                    </Form.Group>
    
                    <Button type='submit' variant='primary' className="mt-4 button-primary"><i class="fa-solid fa-plus"></i> Add new</Button>
                </Form>)

            }
                

            </Col>
        </Row>
        <Table striped  hover responsive className="max-w-xl mb-5">
            <thead className="text-center ">
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="text-center">
                {categories.map((category, index) => (
                    <tr key={category.node.id}>
                        <td>{index + 1}</td>
                        <td>{category.node.name}</td>
                        <td >
                            <Button varinat='light' className="btn-m" ><i class="fa-regular fa-pen-to-square text-lime-500" onClick={() => {setEdit(true); setEditdata(category.node.id, category.node.name)}}></i></Button>
                            <Button varinat='danger' className="btn-m" onClick={() => deleteHandler(category.node.id, category.node.name)}><i class="fa-solid fa-trash-can text-red-500"></i></Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        
    </div>
  )
}

export default CategoriesAdminScreen
