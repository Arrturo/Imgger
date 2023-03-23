import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CategoryItem from '../components/CategoryItem'
import { categoriesList } from '../actions/categoriesActions'
import {Message} from '../components/Message'
import {Loader} from '../components/Loader'
import Post from '../components/Post'
import {Row, Col} from 'react-bootstrap'

function HomeScreen() {

  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const CategoriesList = useSelector(state => state.categoriesList)
  const {categories} = CategoriesList


  useEffect(() =>{
    dispatch(categoriesList())

  },[dispatch])


  return (
    <div>
      EXPLORE TAGS <br></br>
      {categories.map(category => (
        <CategoryItem name={category.name} />))
      }

      <div className="py-5">
        <Row >
          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>
            
          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>
          
          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>
          
          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

          <Col sm={12} md={6} lg={4} xl={3} className="">
            <Post />
          </Col>

        </Row>
      </div>

    </div>
  )
}

export default HomeScreen
