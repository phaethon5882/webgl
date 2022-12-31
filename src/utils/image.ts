export default async function loadImage(src: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    // eslint-disable-next-line prefer-promise-reject-errors
    image.onerror = (e) => reject(src + '로딩 실패');
  });
}
