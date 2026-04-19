"use client";

/* -------------------------------------------------------
 * SSR Guards
 * ----------------------------------------------------- */
export const isClient = typeof window !== "undefined";

/* -------------------------------------------------------
 * Space Warp Shader (FULLY PARAMETRIZED)
 * ----------------------------------------------------- */
export const fragShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_tiltX;
uniform float u_tiltY;
uniform float u_theme;

/* Shader Config */
uniform float u_timeScale;
uniform float u_tiltInfluence;

uniform float u_n1Scale;
uniform float u_n1Time;
uniform float u_n2Scale;
uniform float u_n2Time;
uniform float u_n3Scale;
uniform float u_n3Time;

uniform float u_w1;
uniform float u_w2;
uniform float u_w3;

uniform float u_bendBase;
uniform float u_bendLiquid;

uniform float u_brightnessMin;
uniform float u_brightnessMax;

/* Theme Colors */
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

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

  float t = u_time * u_timeScale;

  float tiltWarp = (u_tiltX + u_tiltY) * u_tiltInfluence;

  float n1 = noise(uv * u_n1Scale + t * u_n1Time);
  float n2 = noise(uv * u_n2Scale - t * u_n2Time);
  float n3 = noise(uv * u_n3Scale + t * u_n3Time);

  float liquid = n1 * u_w1 + n2 * u_w2 + n3 * u_w3;

  vec2 bend = centered * (u_bendBase + liquid * u_bendLiquid + tiltWarp);

  float brightness = mix(u_brightnessMin, u_brightnessMax, u_theme);

  vec3 col = mix(u_color1, u_color2, liquid);
  col = mix(col, u_color3, liquid * 0.5);

  col *= brightness;

  gl_FragColor = vec4(col, 1.0);
}
`;
