import { createRoot } from 'react-dom/client';
import LightRays from './LightRays';

// Rays are sized against the screen width, so a tall phone screen needs longer, wider rays to fill it.
const sizing = () => innerHeight > innerWidth
  ? { rayLength: 8, lightSpread: 1.6, fadeDistance: 4 }
  : { rayLength: 2.4, lightSpread: 0.7, fadeDistance: 1 };

const root = createRoot(document.getElementById('rays'));
const draw = () => root.render(
  <LightRays raysOrigin="top-center" raysColor="#ffffff" raysSpeed={1.5} followMouse={true}
    mouseInfluence={0.1} noiseAmount={0.1} distortion={0.05} {...sizing()} />
);
draw();
addEventListener('resize', draw);
