import React, {useState, useEffect} from 'react'
import { Link, useParams, useHistory, useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form, FormLabel, FormGroup } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {useDispatch, useSelector} from 'react-redux'
import { postsDetails, postsList } from '../actions/postActions'
import CategoryItem from '../components/CategoryItem'




function PostScreen() {
    const {id} = useParams()


    const dispatch = useDispatch()
    const navigate = useNavigate();
    
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const postDetails = useSelector(state => state.postDetails)
    const {loading, error, post} = postDetails

    const postList = useSelector(state => state.postList)
	  const {posts} = postList


    useEffect(() => {
      dispatch(postsDetails(id))
      dispatch(postsList())
      
    }, [dispatch])
    
    const currentPostIndex = posts.findIndex(post => post?.node?.id === id);

    const nextPostIndex = currentPostIndex + 1 < posts.length ? currentPostIndex + 1 : 0;
    const nextPost = posts[nextPostIndex]?.node?.id
    const previousPostIndex = currentPostIndex - 1 >= 0 ? currentPostIndex - 1 : posts.length - 1;
    const previousPost = posts[previousPostIndex]?.node?.id

  return (
    <div>
      <Col className="flex justify-between mb-20 border-b-4">
        <a href={`/post/${previousPost}`} className="btn font-bold bg-amber-300 hover:bg-amber-500 rounded-full my-3"><i class="fa-solid fa-circle-chevron-left"></i> Previous</a>
        <a href='/' className="btn font-bold bg-lime-500 hover:bg-lime-700 my-3"><i class="fa-solid fa-house"></i></a>
        <a href={`/post/${nextPost}`} className="btn font-bold bg-amber-300 hover:bg-amber-500 rounded-full my-3">Next <i class="fa-solid fa-circle-chevron-right"></i></a>
      </Col>
      {loading ? <Loader />
      : error ? <Message variant='danger' children={error} /> 
        : 
          <div>
            <Row>
              <Col md={1} className="text-2xl grid gap-16 content-center ">
                <ListGroup.Item>
                  <Button variant="outline-success" > <i class="fa-regular fa-thumbs-up"></i> {post.likes} </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button variant="outline-danger"> <i class="fa-regular fa-thumbs-down"></i> {post.dislikes} </Button>
                </ListGroup.Item>
              </Col>
              
              <Col md={6}>
                <p className="text-xl">Added by: <span className="text-purple-500">{post?.user?.username}</span> at {(post?.createTime)?.substring(0, 10)} {(post?.createTime)?.substring(15, 19)}</p>
                <Image src={`http://127.0.0.1:8000/media/${post?.image?.file}`} alt={post.title} fluid />
              </Col>
              
              <Col md={5} >
                <ListGroup.Item variant='flush' className="mb-5">
                  <p className="text-2xl">Tags:</p>
                  {<CategoryItem name={post?.category?.name}/>}
                </ListGroup.Item>

                <ListGroup.Item variant='flush'>
                  <h2 className="text-4xl text-center">{post.title}</h2>
                </ListGroup.Item>

                <ListGroup.Item variant='flush'>
                  <h2 className="text-base text-center mt-16">{post.description}</h2>
                </ListGroup.Item>
              </Col>
            </Row>

            <Row className="flex justify-center">
              <Col md={8}>
                <h1 className="text-3xl my-5">Comments:</h1>
                {true && <Message varing='info' >Users have not added any comments yet</Message>}

                  <h4 className="text-xl text-center mt-5">Add comment</h4>

                  
                  {userInfo ? (
                    <Form >
                      <FormGroup controlId='comment' className="mt-1">
                        <Form.Label>Message</Form.Label>
                        <Form.Control as='textarea' row='5' value={null} placeholer='Enter a comment'></Form.Control>
                      </FormGroup>

                      <Button type='submit' variant='primary' className="button-primary mt-3 mb-10">Share</Button> 

                    </Form>
                  ): (
                    <Message variant='info'>You must be <Link to='/login' className="text-red-700">logged in </Link> to add a comment</Message>
                  )}

              </Col>
            </Row>

          </div>
        }
    </div>
  )
}

export default PostScreen
