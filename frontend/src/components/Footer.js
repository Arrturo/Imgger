import React from 'react'
import '../index.css'
import { Container, Row, Col } from 'react-bootstrap'


function Footer() {
  return (
    <div className=" w-full footer ">
        <Container>
            <Row>
                <Col className="text-center text-xl p-4">
                    Copyright &copy; PySquad 2023 <a href='https://github.com/Arrturo/PySquad' target='blank' className="hover:text-amber-400"><i class="fa-brands fa-github"></i></a>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Footer
