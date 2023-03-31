import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from 'axios'


function CreatingPost() {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
  
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
  
      const response = await axios.post(
        "http://127.0.0.1:8000/graphql", {
          query: `
            mutation {
              createImage(input: ${file}) {
                success
                errors
              }
            }
          `}, config);
  
    } catch (error) {
      console.error(error);
    }
  };
  

  return (

      <div >
        <h1 className="text-5xl text-center">Upload new image</h1>
        <Form onSubmit={submitHandler}>
        <div{...getRootProps()} className={`${
              isDragActive ? "upload-active" : "formularz" } mt-12 mx-auto max-w-2xl p-24 rounded-2xl border-4 border-rose-400 cursor-pointer`}>
            <input {...getInputProps()} />
            <p className="text-4xl text-center">Drop file here, or click to select</p>
            <p className="text-8xl text-center mt-3"><i class="fa-solid fa-cloud-arrow-up"></i></p>
            {file && (<p className="mt-12 text-base text-center">{file.name}</p>)}
          </div>
          <Button type="submit" variant='primary' className="button-primary my-5 text-2xl">Upload</Button>
        </Form>
      </div>
  );
}

export default CreatingPost;
