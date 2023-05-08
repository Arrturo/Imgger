import React from 'react';
import Post from '../components/Post';
import { Row, Col } from 'react-bootstrap';
import Masonry from 'react-masonry-css';

function PostList({ posts }) {
  const breakpointColumnsObj = {
    default: 6,
    2500: 5,
    2000: 4,
    1100: 3,
    800: 2,
    700: 1
  };
  const childElements = posts.map((post) => (
    <div key={post.node.id}>
      <Post key={post.node.id} post={post} />
    </div>
  ));
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {childElements}
    </Masonry>
  );
}

export default PostList;
