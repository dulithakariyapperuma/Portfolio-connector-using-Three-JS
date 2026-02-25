import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import BrainScene from './components/BrainScene.jsx';
import HUD from './components/HUD.jsx';
import Loader from './components/Loader.jsx';
import ProgrammingPortfolio from './pages/ProgrammingPortfolio.jsx';
import PhotographyPortfolio from './pages/PhotographyPortfolio.jsx';

/**
 * Root application component with routing.
 * Brain landing → Programming or Photography portfolio pages.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BrainLanding />} />
      <Route path="/programming" element={<ProgrammingPortfolio />} />
      <Route path="/photography" element={<PhotographyPortfolio />} />
    </Routes>
  );
}

function BrainLanding() {
  const [ready, setReady] = useState(false);
  const [hoveredSide, setHoveredSide] = useState(null);
  const navigate = useNavigate();
  const handleReady = useCallback(() => setReady(true), []);

  const handleHemisphereHover = useCallback((side) => {
    setHoveredSide(side);
  }, []);

  const handleHemisphereClick = useCallback((side) => {
    if (side === 'left') {
      navigate('/programming');
    } else if (side === 'right') {
      navigate('/photography');
    }
  }, [navigate]);

  return (
    <>
      <Loader hidden={ready} />
      <BrainScene
        onReady={handleReady}
        onHemisphereHover={handleHemisphereHover}
        onHemisphereClick={handleHemisphereClick}
      />
      <HUD hoveredSide={hoveredSide} />
    </>
  );
}
