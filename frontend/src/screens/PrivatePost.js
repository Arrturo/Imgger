import React, { useState, useEffect, useRef } from "react";
import {
	Link,
	useParams,
	useHistory,
	useLocation,
	useNavigate,
} from "react-router-dom";
import {
	Row,
	Col,
	Image,
	ListGroup,
	Button,
	Card,
	Form,
	FormLabel,
	FormGroup,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost } from "../actions/postActions";
import { postsDetails } from "../actions/postActions";
import CategoryItem from "../components/CategoryItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function PrivatePost() {
	const { id } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const urlRef = useRef(null);

	const postDetails = useSelector((state) => state.postDetails);
	const { loading, error, post } = postDetails;

	const [isPriv, setIsPriv] = useState(false);

	useEffect(() => {
		dispatch(postsDetails(id));
	}, [dispatch]);

	useEffect(() => {
		if (post) {
			setIsPriv(post.isPrivate);
		}
	}, [post]);

	function CopyUrlButton(props) {
		const handleClick = () => {
		  navigator.clipboard.writeText(props.url);
		};
	  
		return (
		  <button onClick={handleClick} className="btn btn-primary">
			Copy URL
		  </button>
		);
	  }

	return (
		<div className="mb-24 min-h-screen">
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger" children={error} />
			) : isPriv === true ? (
				<div>
					<h1 className="text-center mb-5 text-2xl underline">Private post</h1>
					<Col className="float-right">
						<CopyUrlButton url={window.location.href} />
					</Col>
					<Row>
						<Col md={6}>
							<p className="text-xl">
								Uploaded {dayjs(post?.createTime).fromNow()}
							</p>
							<Image src={post?.image?.url} alt={post.title} fluid />
						</Col>

						<Col md={5}>
							{/* <ListGroup.Item variant="flush" className="mb-5">
								<p className="text-2xl">Tags:</p>
								{post?.category && <CategoryItem name={post?.category?.name} />}
							</ListGroup.Item> */}

							<ListGroup.Item variant="flush">
								<h2 className="text-4xl text-center">{post.title}</h2>
							</ListGroup.Item>

							<ListGroup.Item variant="flush">
								<h2 className="text-base text-center mt-16">
									{post.description}
								</h2>
							</ListGroup.Item>
						</Col>
					</Row>
				</div>
			) : (
				<h1 className="text-center text-4xl">This post is not private!</h1>
			)}
		</div>
	);
}

export default PrivatePost;
