import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { deletePost } from "../actions/postActions";

function Post({ post, my, liked }) {
	const dispatch = useDispatch();
	const [hoveredItemId, setHoveredItemId] = useState(null);

	const handleItemMouseEnter = (itemId) => {
		setHoveredItemId(itemId);
	};

	const handleItemMouseLeave = () => {
		setHoveredItemId(null);
	};

	const deletePostHandler = (id, name) => {
		if (window.confirm(`Are you sure to delete post: "${name}" ?`)) {
			dispatch(deletePost(id));
		}
		window.location.reload();
	};

	return (
		<div>
			{my && !liked ? (
				<Card
					className="my-3 rounded card-m"
					onMouseEnter={() => handleItemMouseEnter(post?.node?.id)}
					onMouseLeave={handleItemMouseLeave}
				>
					{post.node.id == hoveredItemId ? (
						<div className="centering ">
							<Link to={`/post/${post?.node?.id}/edit`}>
								<Button variant="light" className="edit-btn2 mb-2">
									<i class="fa-solid fa-pen-to-square"></i> Edit
								</Button>
							</Link>
							<Button
								onClick={() =>
									deletePostHandler(hoveredItemId, post?.node?.title)
								}
								variant="primary"
								className="delete-btn"
							>
								<i class="fa-regular fa-trash-can"></i> Delete
							</Button>
						</div>
					) : null}
					<Link to={`/post/${post.node.id}`} target="blank">
						<Card.Img
							className={`scale-90	 max-h-96 ${
								post.node.id == hoveredItemId ? "opacity-20" : null
							}`}
							src={`${post?.node.image?.url}`}
						/>
					</Link>

					<Card.Body>
						<Card.Title className="text-center">
							<strong>{post.node.title}</strong>
						</Card.Title>

						<Card.Text as="div">
							<div className="my-3 text-xl flex justify-between px-4">
								<p className="">
									<i class="fa-regular fa-thumbs-up"></i> {post.node.likes}
								</p>
								<p>
									{" "}
									<i class="fa-regular fa-thumbs-down"></i> {post.node.dislikes}
								</p>
								<p>
									<i class="fa-regular fa-comment-dots"></i>{" "}
									{post.node.commentsCount}
								</p>
								<p>
									{" "}
									<i class="fa-regular fa-eye"></i> {post.node.views}
								</p>
							</div>
						</Card.Text>
					</Card.Body>
				</Card>
			) : liked ? (
				<Card className="my-3 rounded hover:opacity-80 liked">
					<Link to={`/post/${post.node.id}`} target="blank">
						<Card.Img
							className="scale-90	 max-h-72 liked_img"
							src={`${post?.node.image?.url}`}
						/>
					</Link>
					<Card.Body>
						<Card.Title className="text-center">
							<strong>{post.node.title}</strong>
						</Card.Title>
					</Card.Body>
				</Card>
			) : (
				<Card
					className={`my-3 rounded hover:opacity-80 ${
						post?.node.likes >= 10 ? `ramka` : null
					}
					${
						post?.node.views >= 100 ? `top-views` : null
					}
					`}
				>
					<Link to={`/post/${post.node.id}`}>
						<Card.Img
							className="scale-90 max-h-96"
							src={`${post?.node.image?.url}`}
						/>
					</Link>

					<Card.Body>
						<Card.Title className="text-center">
							<strong>{post.node.title}</strong>
						</Card.Title>

						<Card.Text as="div">
							<div className="my-3 text-xl flex justify-between px-4">
								<p>
									{" "}
									<i class="fa-regular fa-thumbs-up"></i> {post.node.likes}
								</p>
								<p>
									{" "}
									<i class="fa-regular fa-thumbs-down"></i> {post.node.dislikes}
								</p>
								<p>
									{" "}
									<i class="fa-regular fa-comment-dots"></i>{" "}
									{post.node.commentsCount}
								</p>
								<p>
									{" "}
									<i class="fa-regular fa-eye"></i> {post.node.views}
								</p>
							</div>
						</Card.Text>
					</Card.Body>
				</Card>
			)}
		</div>
	);
}

export default Post;
