import loadImage from '../utils/image';
import { fitCanvasToDisplay } from '../utils/webgl';
import createProgram from './createProgram';
import createShader from './createShader';
import textureFragmentShaderSrc from './fragmentShader.glsl';
import textureVertexShaderSrc from './vertexShader.glsl';

(async function runWebGL() {
  const canvas = document.getElementById('c') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw Error('WebGL2 를 지원하지 않는 브라우저입니다.');
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, textureVertexShaderSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, textureFragmentShaderSrc);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const imageLocation = gl.getUniformLocation(program, 'u_image');

  const vao = gl.createVertexArray(); // attribute 상태 집합
  gl.bindVertexArray(vao);

  // Create a buffer and put a single pixel space rectangle in
  // it (2 triangles)
  const positionBuffer = gl.createBuffer();

  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const attribOpt = {
    size: 2, // iteration 마다 2개의 구성 요소 사용
    type: gl.FLOAT, // float 로 읽은다.
    normalize: false, // 정규화 하지 않음
    stride: 0, // 0인 경우 실행할 때마다 size * sizeof(type) 만큼 다음 위치로 이동
    offset: 0, // 버퍼의 시작부터 데이터를 읽음
  };
  gl.vertexAttribPointer(
    positionAttributeLocation,
    attribOpt.size,
    attribOpt.type,
    attribOpt.normalize,
    attribOpt.stride,
    attribOpt.offset,
  );

  // provide texture coordinates for the rectangle.
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    gl.STATIC_DRAW, // 한 번 계산한 쉐이더 결과를 캐싱한다. 트랜스폼이 일어나는거엔 쓰면 안 됨!
  );

  gl.enableVertexAttribArray(texCoordAttributeLocation);

  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();

  // make unit 0 the active texture uint
  // (ie, the unit all other texture commands will affect
  gl.activeTexture(gl.TEXTURE0 + 0);

  // Bind it to texture unit 0' 2D bind point
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we don't need mips and so we're not filtering
  // and we don't repeat at the edges
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const image = await loadImage('/static/uv_grid.jpeg');
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  fitCanvasToDisplay(gl.canvas);

  // [-1, 1] 인 클립 공간을 [0, 캔버스길이], [0,캔버스높이]로 맵핑한다.
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 배경색 초기화
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 쉐이더 사용
  gl.useProgram(program);
  // attribute/buffer 를 우리가 원하는 값으로 셋팅
  gl.bindVertexArray(vao);
  // 셰이더 내에서 픽셀 위치를 클립 공간으로 변환할 수 있도록 캔버스 해상도를 전달한다.
  gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

  // 쉐이더에게 texture0 유닛에서 이미지를 가져다 쓰라는 의미
  gl.uniform1i(imageLocation, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height);
})();

function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
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
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
