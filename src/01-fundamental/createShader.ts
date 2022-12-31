export default function createShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('쉐이더 생성 실패!');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const compileSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (!compileSuccess) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`${type === gl.VERTEX_SHADER ? '버텍스' : '프레그먼트'} 쉐이더 컴파일 실패! \n${log ?? ''}`);
  }

  return shader;
}
