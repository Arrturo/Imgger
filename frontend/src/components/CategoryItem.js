import React from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom'


function CategoryItem({name}) {
  return (
    <Link to={'/'}>
        <Card className="category-item inline-block m-1 ">
            {/* <Card.Img variant="top" src="../../public/images/python_2-300x300.jpg" /> */}
            <Card.Body>
            <Card.Title className="text-center">{name}</Card.Title>
            </Card.Body>
        </Card>
    </Link>
  )
}

export default CategoryItem
