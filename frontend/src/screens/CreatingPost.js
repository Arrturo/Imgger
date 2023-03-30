import React, {useState, useEffect, useProps} from 'react'
import FormContainer from '../components/FormContainer'
import {Form, Button, Row, Col} from 'react-bootstrap'
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useDispatch, useSelector} from 'react-redux'


function CreatingPost() {




    const submitHandler = (e) => {
        console.log('adding new post')
    }


  return (
    <div>
        <FormContainer>
            <h1 className="text-5xl text-center">Adding new post</h1>
            
            <Form onSubmit={submitHandler}>


            </Form>
        </FormContainer>
    </div>
  )
}

export default CreatingPost
