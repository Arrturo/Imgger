import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

function RegisterScreen() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");

	const dispatch = useDispatch();

	const location = useLocation();
	const navigate = useNavigate();

	const userRegister = useSelector((state) => state.userRegister);
	const { error, loading, userInfo } = userRegister;

	useEffect(() => {
		if (userInfo?.data?.register?.success === true) {
			navigate("/login");
			toast.success(
				`Successfully registered, go to your email and click activate link`,
				{
					position: "top-center",
					style: {
						fontSize: "25px",
					},
					duration: 6000,
				}
			);
		}
	}, [navigate, userInfo]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (password != confirmPassword) {
			setMessage("The entered passwords are different!");
		} else {
			dispatch(register(username, email, password, confirmPassword));
		}
	};

	return (
		<div>
			<FormContainer>
				<h1 className="text-5xl text-center mb-5 underline decoration-double decoration-amber-500">
					Sign up
				</h1>
				{message && <Message variant="danger">{message}</Message>}
				{error
					? error.map((err) => (
							<Message variant="danger">{err.message}</Message>
					  ))
					: null}
				{loading && <Loader />}
				<Form onSubmit={submitHandler} className="text-2xl">
					<Form.Group controlId="username" className="mt-3">
						<Form.Label>
							<i class="fa-solid fa-user-tag"></i> Username
						</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="Enter your nickname"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="email" className="mt-3">
						<Form.Label>
							<i class="fa-solid fa-at"></i> Email address
						</Form.Label>
						<Form.Control
							required
							type="email"
							placeholder="Enter your email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="password" className="mt-3">
						<Form.Label>
							<i class="fa-solid fa-lock"></i> Password
						</Form.Label>
						<Form.Control
							required
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="confirmPassword" className="mt-3">
						<Form.Label>
							<i class="fa-solid fa-lock"></i> Confirm Password
						</Form.Label>
						<Form.Control
							required
							type="password"
							placeholder="Enter your password again"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Form.Group controlId="confirmCheckbox" className="mt-3">
						<div className="flex items-center text-base">
							<input
								required
								type="checkbox"
								id="rules"
								className="form-checkbox h-5 w-5 text-primary-500 rounded focus:ring-primary-500"
							/>
							<label htmlFor="rules" className="ml-2 break-words text-lg">
								I agree with the rules on our website and accept{" "}
								<a
									href="/rules"
									target="_blank"
									className="text-red-700 hover:text-red-800"
								>
									{" "}
									the regulations{" "}
								</a>{" "}
								<span className="text-red-600">*</span>
							</label>
						</div>
					</Form.Group>

					<Button
						type="submit"
						variant="primary"
						className="mt-4 button-primary text-2xl "
					>
						Sign up
					</Button>
				</Form>

				<Row className="py-3">
					<Col className="text-center text-xl">
						Already have an account{" "}
						<Link to={"/login"} className="text-red-700 hover:text-red-800">
							{" "}
							Sign in
						</Link>{" "}
						now!
					</Col>
				</Row>
			</FormContainer>
		</div>
	);
}

export default RegisterScreen;
