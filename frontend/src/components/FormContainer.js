import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function FormContainer({ children }) {
	return (
		<Container className="py-4 rounded-2xl border-4 border-rose-400 formularz max-w-screen-md mb-5">
			<Row className="justify-content-center ">
				<Col xs={12} md={8}>
					{children}
				</Col>
			</Row>
		</Container>
	);
}

export default FormContainer;
