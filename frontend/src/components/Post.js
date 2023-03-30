import React from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'

function Post({post}) {

  return (
    <Card className="my-3 rounded hover:opacity-80">
      <Link to={`/post/${post.node.id}`}>
        <Card.Img className="scale-90	 max-h-72" src={`http://127.0.0.1:8000/media/${post?.node.image?.file}`} />
      </Link>
      
      <Card.Body>
        <Card.Title className="text-center">
          <strong>{post.node.title}</strong>
        </Card.Title>

        <Card.Text as="div">
          <div className="my-3 text-xl flex justify-between px-4">
            <p className=""><i class="fa-regular fa-thumbs-up"></i> {post.node.likes}</p> 
            <p> <i class="fa-regular fa-thumbs-down"></i> {post.node.dislikes}</p>
            <p><i class="fa-regular fa-comment-dots"></i> </p>
          </div>
        </Card.Text>

      </Card.Body>
    </Card>
  )
}

export default Post
