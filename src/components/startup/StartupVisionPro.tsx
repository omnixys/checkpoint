"use client";

import { Box } from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------
 * SSR Guards
 * ----------------------------------------------------- */
const isClient = typeof window !== "undefined";

/* -------------------------------------------------------
 * Device Tilt Parallax Hook
 * ----------------------------------------------------- */
function useParallax(maxTilt = 18) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;

      const x = (gamma / 45) * maxTilt;
      const y = (beta / 45) * maxTilt;

      tiltX.set(x);
      tiltY.set(y);
    }

    window.addEventListener("deviceorientation", handleOrientation, true);

    function handleMouse(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * maxTilt * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * maxTilt * 2;

      tiltX.set(x);
      tiltY.set(y);
    }

    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return { tiltX, tiltY };
}

/* -------------------------------------------------------
 * Space Warp Shader (WebGL)
 * ----------------------------------------------------- */
const fragShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_tiltX;
uniform float u_tiltY;
uniform float u_theme;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 centered = (uv - 0.5) * 2.0;

  float t = u_time * 0.35;

  // Dynamic warp influenced by tilt
  float tiltWarp = (u_tiltX + u_tiltY) * 0.02;

  // Liquid distortion field
  float n1 = noise(uv * 6.0 + t * 0.4);
  float n2 = noise(uv * 10.0 - t * 0.3);
  float n3 = noise(uv * 3.0 + t * 0.2);

  float liquid = n1 * 0.6 + n2 * 0.3 + n3 * 0.25;

  // Light bending effect
  vec2 bend = centered * (0.12 + liquid * 0.18 + tiltWarp);

  float brightness = mix(0.3, 0.75, u_theme);

  vec3 col = vec3(
    brightness * (0.25 + liquid * 1.2),
    brightness * (0.18 + liquid * 0.8),
    brightness * (0.35 + liquid * 0.9)
  );

  gl_FragColor = vec4(col, 1.0);
}
`;

function useSpaceWarpShader(
  canvasRef: any,
  tiltX: any,
  tiltY: any,
  isDarkMode: boolean,
) {
  useEffect(() => {
    if (!isClient) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(
      vertexShader,
      `
      attribute vec4 position;
      void main() { gl_Position = position; }
    `,
    );
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const u_time = gl.getUniformLocation(program, "u_time");
    const u_res = gl.getUniformLocation(program, "u_res");
    const u_tiltX = gl.getUniformLocation(program, "u_tiltX");
    const u_tiltY = gl.getUniformLocation(program, "u_tiltY");
    const u_theme = gl.getUniformLocation(program, "u_theme");

    function render(time: number) {
      const tx = tiltX.get();
      const ty = tiltY.get();

      gl.uniform1f(u_time, time * 0.001);
      gl.uniform2f(u_res, canvas.width, canvas.height);
      gl.uniform1f(u_tiltX, tx);
      gl.uniform1f(u_tiltY, ty);
      gl.uniform1f(u_theme, isDarkMode ? 0.0 : 1.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    render(0);
  }, [canvasRef, tiltX, tiltY, isDarkMode]);
}

/* -------------------------------------------------------
 * Main Component
 * ----------------------------------------------------- */
export default function StartupVisionPro() {
  const [show, setShow] = useState(true);

  // SSR-safe hydration state
  const [clientReady, setClientReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 1, h: 1 });

  useEffect(() => {
    if (!isClient) return;
    setClientReady(true);
    setCanvasSize({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  // DO NOT RENDER ANYTHING SSR
  // if (!clientReady) return null;

  const { tiltX, tiltY } = useParallax(16);

  const orbX = useTransform(tiltX, (v) => v * 0.8);
  const orbY = useTransform(tiltY, (v) => v * 0.8);

  const logoX = useTransform(tiltX, (v) => v * 0.3);
  const logoY = useTransform(tiltY, (v) => v * 0.3);

  const raysX = useTransform(tiltX, (v) => v * 0.4);
  const raysY = useTransform(tiltY, (v) => v * 0.4);

  useEffect(() => {
    // Intro Sound
    const sounds = [
      "/sounds/bright_variant.wav",
      "/sounds/intro.wav",
      "/sounds/ios_tab.wav",
      "/sounds/powerup.wav",
      "/sounds/scifi.wav",
    ];

    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];

    const audio = new Audio(randomSound);
    audio.volume = 0.38;

    // Optional: slight pitch variation for natural feeling
    audio.playbackRate = 0.95 + Math.random() * 0.1;

    audio.play().catch(() => {});

    if (navigator.vibrate) navigator.vibrate(30);

    const timer = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkMode = false; // später dynamisch!
  useSpaceWarpShader(canvasRef, tiltX, tiltY, isDarkMode);

  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        pointerEvents: "none", // block UI after fade
        position: "fixed",
        inset: 0,
        zIndex: 999999,
      }}
    >
      {/* dein Shader + Logo + Text */}

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 999999,
          overflow: "hidden",
          bgcolor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
        }}
      >
        {/* Space Warp Shader */}
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Light Rays (Lens Flare) */}
        <motion.div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            borderRadius: "50%",
            background:
              "conic-gradient(from 0deg, rgba(255,200,255,0.25), rgba(0,150,255,0.25), rgba(255,80,180,0.2))",
            filter: "blur(90px)",
            opacity: 0.25,
            x: raysX,
            y: raysY,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 9, ease: "linear" }}
        />

        {/* Glow Orb */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, filter: "blur(22px)" }}
          animate={{
            scale: 1,
            opacity: 1,
            filter: "blur(4px)",
          }}
          transition={{
            duration: 1.2,
            ease: [0.33, 1, 0.68, 1],
          }}
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 55%, rgba(0,120,255,0.65), rgba(120,20,255,0.55), rgba(255,60,140,0.45))",
            boxShadow: "0 0 150px 70px rgba(120,30,255,0.55)",
            x: orbX,
            y: orbY,
          }}
        />

        {/* Logo */}
        <motion.img
          src="/logo/omnixys-original.png"
          alt="checkpoint"
          initial={{
            opacity: 0,
            scale: 0.7,
            filter: "blur(8px)",
            rotateZ: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            rotateZ: [0, 0.5, -0.3, 0], // micro drift
          }}
          transition={{
            duration: 1.3,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            zIndex: 50,
            x: logoX,
            y: logoY,
            width: 150,
            transformStyle: "preserve-3d",
            perspective: 1200,
            rotateX: useTransform(tiltY, (v) => v * 0.9),
            rotateY: useTransform(tiltX, (v) => v * -0.9),
            rotateZ: useTransform(tiltX, (v) => v * 0.15),
            filter: "drop-shadow(0 0 25px rgba(255,255,255,0.35))",
          }}
        />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          style={{
            position: "absolute",
            bottom: "11%",
            color: "white",
            width: "100%",
            textAlign: "center",
            fontSize: 19,
            letterSpacing: 0.5,
          }}
        >
          Powered by <strong>Omnixys</strong>
        </motion.div>
      </Box>
    </motion.div>
  );
}
