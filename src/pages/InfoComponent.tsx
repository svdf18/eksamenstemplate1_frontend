import { useState, useEffect } from "react";
import { HeroContainer, PageContainer } from "../styles/GlobalStyles";
import HERO from '../assets/HERO.mov';

function InfoComponent() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
    <HeroContainer>
      <video autoPlay loop muted style={{position: 'absolute', width: '100%', left: '50%', top: '50%', height: '100%', objectFit: 'cover', transform: 'translate(-50%, -50%)', zIndex: '0', opacity: '0.7', filter: 'brightness 0.5'}}>
        <source src={HERO} type="video/mp4" />
        </video>
        <PageContainer style={{zIndex:'0'}}>
        <div>
          <h1>I | A</h1>
            <p>Date: {new Date().toDateString()}</p>
            <p>Time: {currentTime}</p>
        </div>
      </PageContainer>
    </HeroContainer>
    </>

  );
}

export default InfoComponent;