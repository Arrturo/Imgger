import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CategoryItem from '../components/CategoryItem'
import { categoriesList } from '../actions/categoriesActions'
import {postsList} from '../actions/postActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Post from '../components/Post'
import {Row, Col} from 'react-bootstrap'

function HomeScreen() {

  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const CategoriesList = useSelector(state => state.categoriesList)
  const {loading, error, categories} = CategoriesList

	const postList = useSelector(state => state.postList)
	const {posts} = postList


  useEffect(() =>{
    dispatch(categoriesList())
    dispatch(postsList())

  },[dispatch])




  return (
    <div>
      EXPLORE TAGS <br></br>
      {categories.map(category => (
        <CategoryItem name={category.node.name} />))
      }

      <div className="py-5">
        {loading ? <Loader />
        : <Row >
          {posts.map(post => (
            <Col sm={12} md={6} lg={4} xl={3} >
              <Post post={post} />
            </Col>
          ))}
        </Row>
        }
      </div>

    </div>
  )
}

export default HomeScreen
