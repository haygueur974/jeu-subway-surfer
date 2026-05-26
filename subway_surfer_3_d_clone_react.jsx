import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, PerspectiveCamera, Text } from '@react-three/drei';

function Player({ lane }) {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += (lane - ref.current.position.x) * 0.15;
    }
  });
  return (
    <Box ref={ref} args={[0.8, 1.2, 0.8]} position={[0, 0.6, 0]}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
}

function Obstacle({ z }) {
  return (
    <Box args={[1, 1, 1]} position={[0, 0.5, z]}>
      <meshStandardMaterial color="crimson" />
    </Box>
  );
}

function Track() {
  const lines = [];
  for (let i = 0; i < 20; i++) {
    lines.push(
      <Box key={i} args={[8, 0.1, 4]} position={[0, -0.05, -i * 4]}>
        <meshStandardMaterial color={i % 2 ? '#555' : '#666'} />
      </Box>
    );
  }
  return <>{lines}</>;
}

function Game() {
  const [lane, setLane] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setLane((l) => Math.max(-2, l - 2));
      if (e.key === 'ArrowRight') setLane((l) => Math.min(2, l + 2));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setScore((s) => s + 1), 100);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 8]} rotation={[-0.5, 0, 0]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} />
      <Track />
      <Player lane={lane} />
      <Obstacle z={-8} />
      <Text position={[-3, 4, 0]} fontSize={0.5} color="white">
        Score: {score}
      </Text>
    </>
  );
}

export default function App() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas>
        <Game />
      </Canvas>
    </div>
  );
}
