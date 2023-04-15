import Post from '../components/Post'

function PostList({posts}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map(post => (
                <Post key={post.node.id} post={post} />
            ))}
        </div>
    )
}

export default PostList