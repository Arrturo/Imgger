import Post from '../components/Post'
import {Row, Col} from 'react-bootstrap'

function PostList({posts}) {
    return (
        <Row className="mt-5">
            {posts.map(post => (
                <Col key={post.node.id} sm={12} md={6} lg={4} xl={3} >
                    <Post key={post.node.id} post={post} />
                </Col>
            ))}
        </Row>
    )
}

export default PostList