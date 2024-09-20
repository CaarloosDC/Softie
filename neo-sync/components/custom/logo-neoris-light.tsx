import Image from "next/image";

export default function LogoNeorisLight() {
  return (
    <Image
      src="/NEORIS logo light.png"
      alt="Image"
      width={1920}
      height={1080}
      layout="responsive"
      className="max-h-screen max-w-52 w-full object-cover dark:brightness-[0.2] dark:grayscale pb-12 mx-auto"
    />
  );
}
