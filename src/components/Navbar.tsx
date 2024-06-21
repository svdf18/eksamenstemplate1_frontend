import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <NavbarWrapper>
      <NavbarBackground />
      <NavbarContainer>
          <NavLinkStyled to="/"><h2>I | A</h2></NavLinkStyled>
            <Nav>
              <NavLinkStyled to="/">INFO</NavLinkStyled>
              <NavLinkStyled to="/athletes">ATHLETES</NavLinkStyled>
              <NavLinkStyled to="/result-types">RESULTS</NavLinkStyled>
              <NavLinkStyled to="/items">ITEMS</NavLinkStyled>
              <NavLinkStyled to="/itemstable">TABLE</NavLinkStyled>
            </Nav>
      </NavbarContainer>
    </NavbarWrapper>
  );
}

const NavbarWrapper = styled.header`
  position: fixed; /* Change to fixed */
  top: 0;
  left: 0;
  width: 100vw;
  height: 4rem;
  z-index: 1000;
`;

const NavbarBackground = styled.div`
  position: absolute;
  margin-top: 0.4em;
  margin-left: 0.4em;
  margin-right: 0.4em;
  top: 0;
  left: 0;
  width: 99%;
  height: 100%;
  opacity: 0.2;
  filter: blur(0.4px);
  background-color: #5e5e5e;
  z-index: -1;
`;

const NavbarContainer = styled.div`
  display: flex;
  margin-top: 0.1em;
  margin-left: 0.2em;
  margin-right: 0.2em;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem; /* Adjust the padding as needed */

`;
const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 0!important;
`;

const NavLinkStyled = styled(NavLink)`
  padding: 0.3rem;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  z-index: 1000!important;

  &:hover {
    color: var(--link-hover-color);
  }
`;

export default Navbar;
