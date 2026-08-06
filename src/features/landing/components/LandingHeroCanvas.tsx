import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { LandingHeroScene } from "./LandingHeroScene";

function CanvasFallback() {
  return (
    <div className="landing-cinematic-fallback absolute inset-0">
      <div className="landing-cinematic-fallback__glow" />
    </div>
  );
}

export function LandingHeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          className="touch-none"
          camera={{ position: [0, 0.35, 6], fov: 42, near: 0.1, far: 40 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          shadows
        >
          <LandingHeroScene />
        </Canvas>
      </Suspense>
      <div className="landing-cinematic-vignette pointer-events-none absolute inset-0" />
      <div className="landing-cinematic-gradient pointer-events-none absolute inset-0" />
    </div>
  );
}
