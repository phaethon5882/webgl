export default function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('쉐이더 프로그램을 초기화하는데 실패했습니다.');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linkSuccess) {
    gl.deleteProgram(program);
    throw new Error(`쉐이더 프로그램 링킹 실패!\n${gl.getProgramInfoLog(program) ?? ''}`);
  }

  return program;
}
