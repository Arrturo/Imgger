import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Image, Button, Form, FormGroup } from "react-bootstrap";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { postsDetails, editPost } from "../actions/postActions";
import { categoriesList } from "../actions/categoriesActions";
import CategoryItem from "../components/CategoryItem";

function PostEditScreen() {
	const { id } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const postDetails = useSelector((state) => state.postDetails);
	const { loading, error, post } = postDetails;

	const CategoriesList = useSelector((state) => state.categoriesList);
	const { categories } = CategoriesList;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState(null);
	const [category, setCategory] = useState("");

	useEffect(() => {
		if (userInfo === null) {
			navigate("/login");
		}
		dispatch(categoriesList());
		dispatch(postsDetails(id));
	}, [navigate, userInfo, dispatch, id]);

	useEffect(() => {
		setTitle(post?.title);
		setDescription(post?.description);
		setCategory(post?.category?.id);
	}, [post, setTitle, setDescription, setCategory]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			editPost({
				postId: id,
				title: title,
				description: description,
				category: category,
			})
		);
		setTimeout(() => {
			navigate(`/post/${id}`);
		}, 1000);
	};

	console.log(description);

	return (
		<div>
			{loading && <Loader />}
			<div>
				<h1 className="text-5xl text-center">Edit your post:</h1>
				<Row className="px-5 py-5">
					<Col>
						<Image
							src={`${post?.image?.url}`}
							alt={`${post?.title}`}
							className="max-h-96 mt-5"
						/>
					</Col>
					<Col md={4}>
						<Form onSubmit={submitHandler}>
							<Form.Group controlId="title" className="mt-3">
								<Form.Label className="text-xl">
									<i class="fa-regular fa-hand-point-right"></i> Change title{" "}
									<span className="text-red-800">*</span>
								</Form.Label>
								<Form.Control
									required
									maxLength={25}
									type="text"
									placeholder="Enter title to your post"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId="description" className="mt-5">
								<Form.Label className="text-xl">
									<i class="fa-regular fa-hand-point-right"></i> Change
									description (optional)
								</Form.Label>
								<Form.Control
									as="textarea"
									placeholder="Enter description to your post"
									value={description}
									onChange={(e) => {
										setDescription(e.target.value);
									}}
								></Form.Control>
							</Form.Group>

							<FormGroup controlId="category" className="mt-5">
								<Form.Label className="text-xl">
									<p className="text-center mb-3">
										Your current category:{" "}
										<CategoryItem name={post?.category?.name} />
									</p>
									<i class="fa-regular fa-hand-point-right"></i> If you want to
									change the category, choose one from list below
									<span className="text-red-800">*</span>{" "}
								</Form.Label>
								<Form.Control
									as="select"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									<option selected></option>
									{categories.map((category) => (
										<option key={category?.node?.id} value={category?.node?.id}>
											{category?.node?.name}
										</option>
									))}
								</Form.Control>
							</FormGroup>

							<Button
								type="submit"
								variant="primary"
								className="mt-5 button-primary"
								disabled={
									!userInfo.user.isStaff && post?.user?.id != userInfo?.user?.id
								}
							>
								<i class="fa-solid fa-plus"></i> Save changes
							</Button>
						</Form>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default PostEditScreen;
