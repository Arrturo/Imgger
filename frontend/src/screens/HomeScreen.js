import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import CategoryItem from '../components/CategoryItem'
import { categoriesList } from '../actions/categoriesActions'
import {Message} from '../components/Message'
import {Loader} from '../components/Loader'


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
      <CategoryItem name={category.name} />))}      


    </div>
  )
}

export default HomeScreen
