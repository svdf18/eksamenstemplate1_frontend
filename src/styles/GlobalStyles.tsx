import styled from 'styled-components';

const darkColors = {
  text: 'var(--text-color)',
  textAlt: 'var(--text-alt-color)',
  linkHover: 'var(--link-hover-color)',
  header: 'var(--header-color)',
  background: 'var(--background-color)',
  border: 'var(--border-color)',
  borderAlt: 'var(--border-alt-color)',
  imageText: 'var(--image-text-color)',
  accent1: 'var(--accent1-color)',
  accent2: 'var(--accent2-color)',
  accent3: 'var(--accent3-color)',
};

const PageContainer = styled.div`
  display: flex;
  height: 100%;
  width: 90vw;
  padding-top: 4rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${darkColors.text};  
`;

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${darkColors.background};
  color: ${darkColors.text};
  min-height: 100vh;
  overflow: hidden;
`;

const Grid1 = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;

  @media screen and (min-width: 576px) {
    grid-template-columns: 1fr;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 992px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export { PageContainer, Grid1, HeroContainer };
