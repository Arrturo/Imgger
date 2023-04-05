import React, { useState, useEffect } from 'react';
import FormContainer from "../components/FormContainer";
import {useDispatch, useSelector} from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form, FormLabel, FormGroup } from 'react-bootstrap'
import { useDropzone } from "react-dropzone";
import axios from 'axios'
import {categoriesList} from '../actions/categoriesActions'
import {createPost} from '../actions/postActions'
import {useNavigate, Link} from 'react-router-dom'
import { POST_CREATE_RESET } from "../constants/postConstants";
import Message from '../components/Message'
import Loader from '../components/Loader'


function CreatingPost() {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [uploadStatus, setUploadStatus] = useState(false)
  const [uploadedImage, setUploadedImage] = useState() 
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const CategoriesList = useSelector(state => state.categoriesList)
  const {categories} = CategoriesList

  const PostDetail = useSelector(state => state.postCreate)
  const {post} = PostDetail

  const [cat, setCat] = useState('')

  const imageId = uploadedImage?.image?.id
  const userId = userInfo?.user?.pk
  

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const submitHandler = async (e) => {
    dispatch(categoriesList())
    e.preventDefault();
    const formData = new FormData();
    const operations = {
      query: `
        mutation Upload($image: Upload!) {
          createImage(image: $image) {
            success
            errors
            image{
              id
              file
            }
          }
        }
      `,
      variables: {
        image: null,
      },
      operationName: 'Upload',
    };
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify({ 0: ['variables.image'] }));
    formData.append('0', file);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `JWT ${userInfo.token}`
        },
      };

      const { data } = await axios.post('http://127.0.0.1:8000/graphql',
        formData,
        config
      );

      if(data?.data?.createImage?.success === true){
        setUploadStatus(true)
        setUploadedImage(data.data.createImage)
      }

    } catch (error) {
      console.log(error)
    }

  };


  const addPost = async (ele) => {
    ele.preventDefault()
    dispatch(createPost(title, description, userId, imageId, cat))
  }

  useEffect(() =>{
    if(post?.success === true){
      // dispatch({type:POST_CREATE_RESET})
      navigate(`/post/${post?.post?.id}`)
      window.location.reload()}
  },[post, navigate])



  return (
    
      <div >
        {uploadStatus ? 
        (<div>
            <h1 className="text-5xl text-center">Add post</h1>
            <Row className="px-5 py-5">
              <Col>
                <Image src={`http://127.0.0.1:8000/media/${uploadedImage?.image?.file}`} alt={`${uploadedImage?.image?.name}`} 
                className="max-h-96 mt-5"/>
              </Col>
              <Col md={4}>
                <Form >
                  <Form.Group controlId='title' className="mt-3">
                      <Form.Label className="text-xl"><i class="fa-regular fa-hand-point-right"></i> Add title <span className="text-red-800">*</span></Form.Label>
                          <Form.Control required maxLength={25} type='text' placeholder='Enter title to your post' value={title} onChange={(ele) =>setTitle(ele.target.value)}> 
                          </Form.Control>
                  </Form.Group>
            
                  <Form.Group controlId='description' className="mt-5">
                      <Form.Label className="text-xl"><i class="fa-regular fa-hand-point-right"></i> Add description (optional)</Form.Label>
                          <Form.Control as='textarea' placeholder='Enter description to your post' value={description} onChange={(ele)=>setDescription(ele.target.value)}> 
                          </Form.Control>
                  </Form.Group>

                  <FormGroup controlId="category" className="mt-5">
                    <Form.Label className="text-xl"><i class="fa-regular fa-hand-point-right"></i> Choose category from list below<span className="text-red-800">*</span> </Form.Label>
                    <Form.Control required as='select' value={cat} onChange={(ele) => setCat(ele.target.value)} >
                      <option selected></option>
                        {(categories).map((category) => (
                          <option key={category?.node?.id} value={category?.node?.id}>
                            {category?.node?.name}
                          </option>
                       ))}
                    </Form.Control>
                  </FormGroup>

                  <Button onClick={addPost} type='submit' variant='primary' className="mt-5 button-primary"><i class="fa-solid fa-plus"></i> Share post</Button>
            
                </Form>
              </Col>
            </Row>
        </div>)
        
        :
        (<div>
          <h1 className="text-5xl text-center mb-3">Upload new image</h1>
          
          <Form onSubmit={submitHandler}>
            <div{...getRootProps()} className={`${
                isDragActive ? "upload-active" : "formularz" } mt-12 mx-auto max-w-2xl p-24 rounded-2xl border-4 border-rose-400 cursor-pointer`}>
              <input {...getInputProps()} />
              <p className="text-4xl text-center">Drop file here, or click to select</p>
              <p className="text-8xl text-center mt-3"><i class="fa-solid fa-cloud-arrow-up"></i></p>
              {file && (<p className="mt-12 text-base text-center">{file.name}</p>)}
              
            </div>
            {!userInfo ? <p className="mt-5 grid justify-items-center"><Message variant='danger'>You must be <Link to='/login' className="text-red-700">logged in </Link> to upload image</Message></p>: null}
            <Button type="submit" variant='primary' disabled={!userInfo || !file} className="button-primary my-5 text-2xl">Upload</Button>
          </Form>
        </div>)}
      </div>
  );
}

export default CreatingPost;
