import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'

function Post({post}) {
  return (
    <Card className="my-3 rounded hover:opacity-80">
      <Link to={'/'}>
        <Card.Img className="scale-90	 max-h-72" src="https://i.natgeofe.com/k/ad9b542e-c4a0-4d0b-9147-da17121b4c98/MOmeow1_4x3.png" />
      </Link>
      
      <Card.Body>
        <Card.Title className="text-center">
          <strong>MEOW?</strong>
        </Card.Title>

        <Card.Text as="div">
          <div className="my-3 text-xl flex justify-between px-4">
            <p className=""><i class="fa-regular fa-thumbs-up"></i> 155</p> 
            <p> <i class="fa-regular fa-thumbs-down"></i> 3</p>
            <p><i class="fa-regular fa-comment-dots"></i> 54</p>
          </div>
        </Card.Text>

      </Card.Body>
    </Card>
  )
}

export default Post
