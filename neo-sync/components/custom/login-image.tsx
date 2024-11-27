import Image from "next/image";

export default function LoginImage() {
  return (
    <div className="hidden bg-muted lg:block">
      <Image
        src="/login/2.jpg"
        alt="Image"
        width="1920"
        height="1080"
        className="h-full w-full object-cover max-h-screen dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  );
}
