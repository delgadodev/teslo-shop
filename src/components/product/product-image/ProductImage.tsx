import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
  onMouseEnter?: React.MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLImageElement>;
}

export default function ProductImage({
  src,
  alt,
  width,
  height,
  className,
  style,
}: Props) {
  const customSrc = src
    ? src.startsWith("http")
      ? src
      : `/products/${src}`
    : "/imgs/placeholder.jpg";


    
  return (
    <Image
      src={customSrc}
      alt={alt}
      width={height}
      height={width}
      className={className}
      style={style}
      
    />
  );
}
