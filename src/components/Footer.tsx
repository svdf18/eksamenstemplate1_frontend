import { NavLink} from "react-router-dom";
import styled from "styled-components";

const FooterComponent = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterLogoContainer>
          <FooterLogo>I | A</FooterLogo>
        </FooterLogoContainer>
        <FooterTextContainer>
        <FooterNav>
          <NavLinkStyledFooter to="/about">About</NavLinkStyledFooter>
          <NavLinkStyledFooter to="/contact">Contact</NavLinkStyledFooter>
        </FooterNav>
        </FooterTextContainer>
     
      </FooterContainer>
      <p>&copy; 2021 I | A</p>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  position: relative;
  bottom: 0;
  left: 0;
  height: 20rem;
  z-index: 1000;
  background-color: var(--accent1-color);
  opacity: 0.55;
  width: 100%;
  z-index: 1000;

  @media screen and (max-width: 768px){
    height: 12rem;
  }

  @media screen and (max-width: 560px){
    height: 10rem;
  }
`;

const FooterContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10rem;
  padding: 0 4rem;
  
`;

const FooterLogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FooterLogo = styled.header`
  font-size: 10rem;
  color: var(--link-hover-color);
  letter-spacing: 0.5rem;
  transition: font-size 0.5s ease-in-out;

  @media screen and (max-width: 768px){
   font-size: 5rem; 
  }

  @media screen and (max-width: 560px){
   font-size: 1.5rem; 
  }
`;

const FooterNav = styled.nav`
  display: flex;
  flex-direction: column;
  align-self: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavLinkStyledFooter = styled(NavLink)`
  color: white;
  align-self: flex-end;
  text-decoration: none;
  font-size: 1.5rem;

  &:hover {
    color: var(--link-hover-color);
  }

  @media screen and (max-width: 768px){
   font-size: 1rem; 
  }

  @media screen and (max-width: 560px){
   font-size: 0.9rem; 
  }
`;


export default FooterComponent;