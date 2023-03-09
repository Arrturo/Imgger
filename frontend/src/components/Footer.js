import React from 'react'
import '../index.css'
import { Container, Row, Col } from 'react-bootstrap'


function Footer() {
  return (
    <div>
        <Container>
            <Row>
                <Col className="text-center py-3 text-xl">
                    Copyright &copy; PySquad 2023 <a href='https://github.com/Arrturo/PySquad' className="hover:text-amber-400"><i class="fa-brands fa-github"></i></a>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Footer
