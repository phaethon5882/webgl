import { random } from 'lodash-es';

export default function drawRandomRectangles(gl: WebGLRenderingContext, program: WebGLProgram, iteration = 50) {
  const colorLocation = gl.getUniformLocation(program, 'u_color');

  for (let i = 0; i < iteration; i++) {
    fillRectangleToBuffer(gl, random(0, 300), random(0, 300), random(0, 300), random(0, 300));
    gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

function fillRectangleToBuffer(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  // prettier-ignore
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]),
    gl.STATIC_DRAW
  );
}
