import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom'


function CategoryItem({name, postsCount}) {
  return (
    <Link to={'/'}>
        <Card className="category-item inline-block m-1 ">
            {/* <Card.Img variant="top" src="https://cdn-icons-png.flaticon.com/512/126/126422.png" /> */}
            <Card.Body>
            <Card.Title className="text-center underline underline-offset-8 decoration-1">{name}</Card.Title>
            {postsCount >= 0 && <Card.Text className='text-xs text-center'>{postsCount} posts</Card.Text>}
            </Card.Body>
        </Card>
    </Link>
  )
}

export default CategoryItem
