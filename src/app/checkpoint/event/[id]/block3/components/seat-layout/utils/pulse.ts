import Konva from "konva";

export function enablePulseAnimation(node, intensity = 0.05) {
  const anim = new Konva.Animation((frame) => {
    if (!frame) return;
    const scale = 1 + Math.sin(frame.time / 300) * intensity;
    node.scale({ x: scale, y: scale });
  }, node.getLayer());

  anim.start();
  return anim;
}
