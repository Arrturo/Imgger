import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import {
	getUserDetails,
	updateUserProfile,
	deleteUserOwn,
} from "../actions/userActions";

function ProfileScreen() {
	const location = useLocation();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password1, setPassword1] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [messagePassword, setMessagePassword] = useState("");

	// const [confirmDelete, setConfirmDelete] = useState("");
	const [messageDelete, setMessageDelete] = useState("");

	const [message, setMessage] = useState("");
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { error: loginError, loading, userInfo } = userLogin;
	
	const userDeleteOwn = useSelector((state) => state.userDeleteOwn);
	const { error: deleteUserOwnError, loading: deleteUserOwnLoading, success: deleteUserOwnSuccess } = userDeleteOwn;

	useEffect(() => {
		if (userInfo === null) {
			navigate("/login");
		}
		setName(userInfo?.user?.username);
		setEmail(userInfo?.user?.email);
	}, [navigate, userInfo, dispatch]);

	const handleDeleteConfirmation = () => {
		setShowDeleteConfirmation(true);
	};

	const handleDeleteCancel = () => {
		setShowDeleteConfirmation(false);
		setPassword1("");
		setMessageDelete("");
		deleteUserOwnError && dispatch({ type: "USER_DELETE_OWN_REQUEST" });
	};

	const handleDeleteAccount = (e) => {
		e.preventDefault();
		if (password1 === "") {
			setMessageDelete("Please enter your password");
		} else {
			dispatch(deleteUserOwn(password1));
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessagePassword("The entered passwords are different!");
		} else {
			if (
				window.confirm(`${name} Are you sure you want to update your details?`)
			) {
				dispatch(
					updateUserProfile({
						id: userInfo?.user?.id,
						username: name,
						email: email,
						password: password,
					})
				);

				setMessage("User data successfully updated");
			}
		}
	};

	return (
		<div className="mb-72">
		  <Button
			variant="danger"
			className="bg-red-600 float-right"
			onClick={handleDeleteConfirmation}
		  >
			Delete account
		  </Button>
		  <Modal show={showDeleteConfirmation} onHide={handleDeleteCancel}>
			<Modal.Header closeButton>
			  <Modal.Title>Confirm Account Deletion</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			  <p>Are you sure you want to delete your account?</p>
			  <p>This action is irreversible and will permanently delete your account.</p>
			  <Form.Group controlId="password">
				<Form.Label>Password: </Form.Label>
				<Form.Control
				  type="password"
				  placeholder="Enter your password"
				  value={password1}
				  onChange={(e) => setPassword1(e.target.value)}
				  isInvalid={messageDelete}
				/>
				<Form.Control.Feedback type="invalid">
				  {messageDelete}
				</Form.Control.Feedback>
			  </Form.Group>
			  <br />
			  {deleteUserOwnError && <Message variant="danger">{deleteUserOwnError}</Message>}
			</Modal.Body>
			<Modal.Footer>
			  <Button variant="secondary" style={{ color: 'black' }} onClick={handleDeleteCancel}>
				Cancel
			  </Button>
			  <Button variant="danger" style={{ color: 'black' }} onClick={handleDeleteAccount}>
				Delete Account
			  </Button>
			</Modal.Footer>
		  </Modal>
			<Row className="flex justify-center">
				<Col md={5}>
					<h2 className="text-4xl text-center mb-3">My Account:</h2>
					{loading && <Loader />}
					{loginError && <Message variant="danger">{loginError}</Message>}
					{message && <Message variant="info">{message}</Message>}
					{messagePassword && (
						<Message variant="danger">{messagePassword}</Message>
					)}
					<Form onSubmit={submitHandler}>
						<Form.Group controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control
								required
								type="name"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="email" className="mt-3">
							<Form.Label>Email address</Form.Label>
							<Form.Control
								required
								type="email"
								placeholder="Enter your email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="password" className="mt-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Form.Group>

						<Form.Group controlId="PasswordConfirm" className="mt-3">
							<Form.Label>Password confirm</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter your password again"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</Form.Group>

						<Button
							type="submit"
							variant="primary"
							className="mt-4 button-primary"
						>
							<i className="fa-regular fa-pen-to-square"></i> Save changes
						</Button>
					</Form>
				</Col>
			</Row>
		</div>
	);
}

export default ProfileScreen;