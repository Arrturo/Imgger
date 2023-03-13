import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap'
import '../index.css';


function Header() {

	return (
        <header className="text-2xl">
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container fluid >
                    <LinkContainer to='/'>
					    <Navbar.Brand className="hover:text-amber-400 hover:font-bold text-2xl text-amber-200" href='/'>PySquad</Navbar.Brand>
                    </LinkContainer>
					<Navbar.Toggle aria-controls='navbarScroll' />
					<Navbar.Collapse id='navbarScroll'>
						<Nav className='my-2 my-lg-0 ms-auto p-1 gap-5 ' navbarScroll>
                            <LinkContainer to='/newpost'>
                                <Nav.Link className="hover:text-amber-500 text-amber-200"> <i class="fa-solid fa-plus"></i> New post </Nav.Link>
                            </LinkContainer>
							<LinkContainer to='/login' >
								<Nav.Link className="hover:text-amber-500 text-amber-200"><i class="fa-solid fa-right-to-bracket"></i> Sign in</Nav.Link>
							</LinkContainer>														
							<LinkContainer to='/register' >
								<Nav.Link className="hover:text-amber-400 text-amber-200"> Sign up</Nav.Link>
							</LinkContainer>														
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
      );
}

export default Header;
