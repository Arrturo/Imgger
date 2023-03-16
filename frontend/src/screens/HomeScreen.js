import React from 'react'
import {useDispatch, useSelector} from 'react-redux'

function HomeScreen() {


  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin




  return (
    <div>
      <p className="text-center text-8xl">{userInfo?.user?.dateJoined}</p>
    </div>
  )
}

export default HomeScreen
