"use client";

import { Box } from "@mui/material";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* -------------------------------------------------------
 * Device Tilt Parallax Hook
 * ----------------------------------------------------- */
function useParallax(maxTilt = 18) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleOrientation(event: DeviceOrientationEvent) {
      const { beta, gamma } = event;
      if (beta == null || gamma == null) return;

      const x = (gamma / 45) * maxTilt;
      const y = (beta / 45) * maxTilt;

      tiltX.set(x);
      tiltY.set(y);
    }

    function handleMouse(event: MouseEvent) {
      const x = (event.clientX / window.innerWidth - 0.5) * maxTilt * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * maxTilt * 2;

      tiltX.set(x);
      tiltY.set(y);
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, [maxTilt, tiltX, tiltY]);

  return { tiltX, tiltY };
}

/* -------------------------------------------------------
 * Space Warp Shader
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
  float tiltWarp = (u_tiltX + u_tiltY) * 0.02;

  float n1 = noise(uv * 6.0 + t * 0.4);
  float n2 = noise(uv * 10.0 - t * 0.3);
  float n3 = noise(uv * 3.0 + t * 0.2);

  float liquid = n1 * 0.6 + n2 * 0.3 + n3 * 0.25;
  vec2 bend = centered * (0.12 + liquid * 0.18 + tiltWarp);

  float brightness = mix(0.3, 0.75, u_theme);

  vec3 col = vec3(
    brightness * (0.25 + liquid * 1.2 + bend.x * 0.04),
    brightness * (0.18 + liquid * 0.8 + bend.y * 0.03),
    brightness * (0.35 + liquid * 0.9)
  );

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function useSpaceWarpShader(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  tiltX: MotionValue<number>,
  tiltY: MotionValue<number>,
  isDarkMode: boolean,
) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      `
        attribute vec4 position;
        void main() {
          gl_Position = position;
        }
      `,
    );

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShader);

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const position = gl.getAttribLocation(program, "position");
    if (position >= 0) {
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    }

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const uTiltX = gl.getUniformLocation(program, "u_tiltX");
    const uTiltY = gl.getUniformLocation(program, "u_tiltY");
    const uTheme = gl.getUniformLocation(program, "u_theme");

    let frameId: number | null = null;
    let disposed = false;

    const render = (time: number) => {
      if (disposed) return;

      const tx = tiltX.get();
      const ty = tiltY.get();

      gl.viewport(0, 0, canvas.width, canvas.height);

      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uTiltX) gl.uniform1f(uTiltX, tx);
      if (uTiltY) gl.uniform1f(uTiltY, ty);
      if (uTheme) gl.uniform1f(uTheme, isDarkMode ? 0.0 : 1.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    return () => {
      disposed = true;

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [canvasRef, tiltX, tiltY, isDarkMode]);
}

/* -------------------------------------------------------
 * Main Component
 * ----------------------------------------------------- */
export default function StartupVisionPro() {
  const [show, setShow] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ w: 1, h: 1 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkMode = false;

  const { tiltX, tiltY } = useParallax(16);

  const orbX = useTransform(tiltX, (value) => value * 0.8);
  const orbY = useTransform(tiltY, (value) => value * 0.8);

  const logoX = useTransform(tiltX, (value) => value * 0.3);
  const logoY = useTransform(tiltY, (value) => value * 0.3);

  const raysX = useTransform(tiltX, (value) => value * 0.4);
  const raysY = useTransform(tiltY, (value) => value * 0.4);

  const logoRotateX = useTransform(tiltY, (value) => value * 0.9);
  const logoRotateY = useTransform(tiltX, (value) => value * -0.9);
  const logoRotateZ = useTransform(tiltX, (value) => value * 0.15);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateCanvasSize = () => {
      setCanvasSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    audio.playbackRate = 0.95 + Math.random() * 0.1;

    void audio.play().catch(() => {});

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(30);
    }

    const timer = window.setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  useSpaceWarpShader(canvasRef, tiltX, tiltY, isDarkMode);

  return (
    <motion.div
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 999999,
      }}
    >
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
            rotateZ: [0, 0.5, -0.3, 0],
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
            rotateX: logoRotateX,
            rotateY: logoRotateY,
            rotateZ: logoRotateZ,
            filter: "drop-shadow(0 0 25px rgba(255,255,255,0.35))",
          }}
        />

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
