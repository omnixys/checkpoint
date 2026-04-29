"use client";

import { useEffect, type RefObject } from "react";
import { MotionValue } from "framer-motion";
import { OmnixysColorScheme } from "@/checkpoint/themes/paletteTypes";
import { fragShader, isClient } from "@/checkpoint/components/startup/config/constants";
import { omnixysPresets } from "@/checkpoint/themes/colors/omnixysPresets";

type Mode = "light" | "dark";

/**
 * Converts HEX → normalized vec3 for GLSL
 */
function hexToVec3(hex: string): [number, number, number] {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

/**
 * NOTE:
 * RefObject MUST allow null because React refs are null before mount.
 */
export function useSpaceWarpShader(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  tiltX: MotionValue<number>,
  tiltY: MotionValue<number>,
  scheme: OmnixysColorScheme,
  mode: Mode,
) {
  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return; // ✅ runtime safety

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const preset = omnixysPresets[scheme] ?? omnixysPresets["original"];

    if (!preset.visual) return;

    const visual = preset.visual[mode];

    const g = visual.gradient.orb;

    const c1 = hexToVec3(g[0]);
    const c2 = hexToVec3(g[1]);
    const c3 = hexToVec3(g[2]);

    const vertex = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertex, `attribute vec4 position; void main(){gl_Position=position;}`);
    gl.compileShader(vertex);

    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragment, fragShader);
    gl.compileShader(fragment);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    function render(time: number) {
      gl?.uniform1f(gl.getUniformLocation(program, "u_time"), time * 0.001);

      gl?.uniform1f(gl.getUniformLocation(program, "u_tiltX"), tiltX.get());

      gl?.uniform1f(gl.getUniformLocation(program, "u_tiltY"), tiltY.get());

      gl?.uniform3f(gl.getUniformLocation(program, "u_color1"), c1[0], c1[1], c1[2]);

      gl?.uniform3f(gl.getUniformLocation(program, "u_color2"), c2[0], c2[1], c2[2]);

      gl?.uniform3f(gl.getUniformLocation(program, "u_color3"), c3[0], c3[1], c3[2]);

      gl?.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(render);
    }

    render(0);
  }, [canvasRef, tiltX, tiltY, scheme, mode]);
}
