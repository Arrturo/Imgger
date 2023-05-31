import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	getUserDetails,
	updateUserProfileByAdmin,
} from "../actions/userActions";
import FormContainer from "../components/FormContainer";

function UserEditScreen() {
	const { id: userId } = useParams();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [isStaff, setIsStaff] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error, loading, user } = userDetails;

	useEffect(() => {
		if (userInfo && userInfo.user.isStaff === true) {
			dispatch(getUserDetails(userId));
		} else {
			navigate(`/login`);
		}
	}, [dispatch, navigate, userId, userInfo]);

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setEmail(user.email);
			setIsStaff(user.isStaff);
		}
	}, [user]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(
			updateUserProfileByAdmin({
				id: userId,
				username: username,
				email: email,
				isStaff: isStaff,
			})
		);
		navigate("/admin/userlist");
		window.location.reload();
	};

	return (
		<div>
			<Link to="/admin/userlist">
				{" "}
				<i class="fa-solid fa-caret-left"></i> Back
			</Link>
			<FormContainer className="formcontainer">
				<h1 className="text-5xl text-center mb-5">Edit user</h1>

				<Form onSubmit={submitHandler}>
					<Form.Group controlId="name">
						<Form.Label>Username</Form.Label>
						<Form.Control
							type="name"
							placeholder="Enter username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="email" className="mt-3">
						<Form.Label>Email address</Form.Label>
						<Form.Control
							type="email"
							placeholder="Enter email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="isstaff" className="mt-3">
						<Form.Check
							type="checkbox"
							label="Is Staff"
							checked={isStaff}
							onChange={(e) => setIsStaff(e.target.checked)}
						></Form.Check>
					</Form.Group>

					<Button
						type="submit"
						variant="primary"
						className="mt-4 button-primary"
					>
						<i class="fa-regular fa-pen-to-square"></i> Save changes
					</Button>
				</Form>
			</FormContainer>
		</div>
	);
}

export default UserEditScreen;
