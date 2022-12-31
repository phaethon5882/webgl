// 캔바스의 드로링 버퍼 크기(캔버스에 표시할 픽셀 사이즈)를 디스플레이 크기로 설정한다.
// clientWidth 는 실제 DOM Element 의 크기를 device의 PixelRatio 로 나눈 값이기 때문에
// dpr 을 안 곱해주면 확대돼서 보인다.
export function fitCanvasToDisplay(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  multiplier = window.devicePixelRatio,
): boolean {
  // client 값은 padding 을 포함하지 않는다. 그래서 canvas 태그에는 패딩 주지 않는게 좋음.
  if ('clientWidth' in canvas && 'clientHeight' in canvas) {
    const width = canvas.clientWidth * multiplier || 0;
    const height = canvas.clientHeight * multiplier || 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
  }
  return false;
}
