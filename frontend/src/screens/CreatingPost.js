import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, Button, Form, FormGroup } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { categoriesList } from "../actions/categoriesActions";
import { createPost } from "../actions/postActions";
import { useNavigate, Link } from "react-router-dom";
import { url } from "../constants/host";

function CreatingPost() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);

	const [uploadStatus, setUploadStatus] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const CategoriesList = useSelector((state) => state.categoriesList);
	const { categories } = CategoriesList;

	const PostDetail = useSelector((state) => state.postCreate);
	const { post } = PostDetail;

	const [cat, setCat] = useState("");

	const [isPrivate, setIsPrivate] = useState(true);

	const [selectedOption, setSelectedOption] = useState(1);

	const userId = userInfo?.user?.id;

	const onDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
		setImage(URL.createObjectURL(acceptedFiles[0]));
		dispatch(categoriesList());
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const submitHandler = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		const operations = {
			query: `
        mutation Upload($image: Upload!) {
          createImage(image: $image) {
            success
            errors
            image{
              id
              url
            }
          }
        }
      `,
			variables: {
				image: null,
			},
			operationName: "Upload",
		};
		formData.append("operations", JSON.stringify(operations));
		formData.append("map", JSON.stringify({ 0: ["variables.image"] }));
		formData.append("0", file);
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const { data } = await axios.post(`${url}/graphql`, formData, config);

			const imageId = data?.data?.createImage?.image?.id;

			if (imageId) {
				await dispatch(
					createPost(
						title,
						description,
						userId,
						imageId,
						cat,
						isPrivate,
						selectedOption
					)
				);
			} else {
				console.log("Image ID not available yet.");
			}
		} catch (error) {
			console.log(error);
		}
	};

	console.log(selectedOption);

	useEffect(() => {
		if (userInfo?.user) {
			setIsPrivate(false);
		}
	}, [navigate]);

	useEffect(() => {
		if (post?.success === true) {
			if (isPrivate === true) {
				navigate(`/post/private/${post?.post?.id}`);
			} else {
				navigate(`/post/${post?.post?.id}`);
			}
			window.location.reload();
		}
	}, [post, navigate]);

	return (
		<div className="mb-40">
			{uploadStatus ? (
				<div>
					<h1 className="text-5xl text-center">Add post</h1>
					<Row className="px-5 py-5">
						<Col>
							<Image
								src={`${image}`}
								// alt={`${uploadedImage?.image?.name}`}
								className="max-h-96 mt-5"
							/>
						</Col>
						<Col md={4}>
							<Form onSubmit={submitHandler}>
								<Form.Group controlId="title" className="mt-3">
									<Form.Label className="text-xl">
										<i class="fa-regular fa-hand-point-right"></i> Add title{" "}
										<span className="text-red-800">*</span>
									</Form.Label>
									<Form.Control
										required
										maxLength={25}
										type="text"
										placeholder="Enter title to your post"
										value={title}
										onChange={(ele) => setTitle(ele.target.value)}
									></Form.Control>
								</Form.Group>

								<Form.Group controlId="description" className="mt-5">
									<Form.Label className="text-xl">
										<i class="fa-regular fa-hand-point-right"></i> Add
										description (optional)
									</Form.Label>
									<Form.Control
										as="textarea"
										placeholder="Enter description to your post"
										value={description}
										onChange={(ele) => setDescription(ele.target.value)}
									></Form.Control>
								</Form.Group>

								<FormGroup controlId="category" className="mt-5">
									<Form.Label className="text-xl">
										<i class="fa-regular fa-hand-point-right"></i> Choose
										category from list below
									</Form.Label>
									<Form.Control
										required
										as="select"
										value={cat}
										onChange={(ele) => setCat(ele.target.value)}
									>
										<option selected></option>
										{categories.map((category) => (
											<option
												key={category?.node?.id}
												value={category?.node?.id}
											>
												{category?.node?.name}
											</option>
										))}
									</Form.Control>
									<Form.Check
										disabled={!userInfo?.user}
										className="mt-5 text-xl"
										type="checkbox"
										label="Private post?"
										checked={isPrivate}
										onChange={(e) => setIsPrivate(e.target.checked)}
									></Form.Check>
								</FormGroup>

								{isPrivate ? (
									<Form.Group>
										<Form.Label className="text-xl mt-5 ">
											Expiration time:
										</Form.Label>
										<div className="flex justify-between">
											<Form.Check
												className="mt-1 text-xl"
												type="radio"
												label="1 day"
												name="expiration"
												checked={selectedOption === 1}
												onChange={() => setSelectedOption(1)}
											/>
											<Form.Check
												className="mt-1 text-xl"
												type="radio"
												label="3 days"
												name="expiration2"
												checked={selectedOption === 2}
												onChange={() => setSelectedOption(2)}
											/>
											<Form.Check
												className="mt-1 text-xl"
												type="radio"
												label="7 days"
												name="expiration3"
												checked={selectedOption === 3}
												onChange={() => setSelectedOption(3)}
											/>
										</div>
									</Form.Group>
								) : null}

								<Button
									type="submit"
									variant="primary"
									className="mt-5 button-primary"
								>
									<i class="fa-solid fa-plus"></i> Share post
								</Button>
							</Form>
						</Col>
					</Row>
				</div>
			) : (
				<div>
					<h1 className="text-5xl text-center mb-3">Upload new image</h1>

					<Form>
						<div
							{...getRootProps()}
							className={`${
								isDragActive ? "upload-active" : "formularz"
							} mt-12 mx-auto max-w-2xl p-24 rounded-2xl border-4 border-rose-400 cursor-pointer`}
						>
							<input {...getInputProps()} />
							<p className="text-4xl text-center">
								Drop file here, or click to select
							</p>
							<p className="text-8xl text-center mt-3">
								<i class="fa-solid fa-cloud-arrow-up"></i>
							</p>
							{file && (
								<p className="mt-12 text-base text-center">{file.name}</p>
							)}
						</div>
						<Button
							type="submit"
							variant="primary"
							disabled={!file}
							className="button-primary my-5 text-2xl"
							onClick={() => setUploadStatus(true)}
						>
							Upload
						</Button>
					</Form>
				</div>
			)}
		</div>
	);
}

export default CreatingPost;
