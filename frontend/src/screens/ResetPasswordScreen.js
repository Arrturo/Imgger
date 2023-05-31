import React, { useState } from "react";
import FormContainer from "../components/FormContainer";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Message from "../components/Message";
import { url } from "../constants/host";

function ResetPasswordScreen() {
	const { token } = useParams();

	const navigate = useNavigate();

	const [password1, setPassword1] = useState(null);
	const [password2, setPassword2] = useState(null);

	const [message, setMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const submitHandler = async (e) => {
		e.preventDefault();

		if (password1 !== password2) {
			setMessage("The entered passwords are different!");
		} else {
			if (
				window.confirm("Are you sure you want to change your account password?")
			) {
				try {
					const { data } = await sendEmail();
					console.log(data);
				} catch (error) {
					console.error(error);
				}
			}
		}
	};

	const sendEmail = async () => {
		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		const { data } = await axios.post(
			`${url}/graphql`,
			{
				query: `
           mutation {
            passwordReset(token: "${token}", newPassword1: "${password1}", newPassword2: "${password2}"){
                success
                errors
            }
          }
          `,
			},
			config
		);

		if (data?.data?.passwordReset?.success) {
			await setSuccessMessage(
				"You have successfully changed your password, now you can log in with the new data"
			);
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} else {
			setMessage(data?.data?.passwordReset?.errors?.nonFieldErrors[0]?.message);
		}
	};

	return (
		<FormContainer onSubmit={submitHandler}>
			<h1 className="text-5xl text-center mb-5 underline decoration-double decoration-amber-500 ">
				Reset your password
			</h1>
			<h5 className="text-2xl text-center mb-5  ">
				Set new password to your account
			</h5>

			{message && <Message variant="danger">{message}</Message>}
			{successMessage && <Message variant="success">{successMessage}</Message>}

			<Form onSubmit={submitHandler} className="text-2xl">
				<Form.Group controlId="password" className="mt-3">
					<Form.Label>
						<i class="fa-solid fa-lock"></i> Password 1
					</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your new password"
						value={password1}
						onChange={(e) => setPassword1(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Form.Group controlId="password" className="mt-3">
					<Form.Label>
						<i class="fa-solid fa-lock"></i> Password 2
					</Form.Label>
					<Form.Control
						type="password"
						placeholder="Enter your new password again"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button
					type="submit"
					variant="primary"
					className="my-5 button-primary text-2xl "
				>
					Set new password
				</Button>
			</Form>
		</FormContainer>
	);
}

export default ResetPasswordScreen;
