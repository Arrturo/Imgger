import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {useDispatch, useSelector} from 'react-redux'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap'
import '../index.css';


function Header() {
	

	return (
        <header className="text-2xl">
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container fluid >
                    <LinkContainer to='/'>
					    <Navbar.Brand className="hover:text-amber-400 hover:font-bold text-2xl" href='/'>PySquad</Navbar.Brand>
                    </LinkContainer>
					<Navbar.Toggle aria-controls='navbarScroll' />
					<Navbar.Collapse id='navbarScroll'>
						<Nav className='my-2 my-lg-0 ms-auto p-1 gap-5 ' navbarScroll>
                            <LinkContainer to='/newpost'>
                                <Nav.Link className="hover:text-amber-400"> <i class="fa-solid fa-plus"></i> Dodaj zdjęcie </Nav.Link>
                            </LinkContainer>
							<LinkContainer to='/login'>
								<Nav.Link className="hover:text-amber-400"><i class="fa-solid fa-right-to-bracket"></i> Zaloguj się</Nav.Link>
							</LinkContainer>														
							<LinkContainer to='/register'>
								<Nav.Link className="hover:text-amber-400"> Rejestracja</Nav.Link>
							</LinkContainer>														
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
      );
}

export default Header;
