import Image from "next/image";
type cardProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
};
const Card = ({ imageUrl, imageAlt, title, description }: cardProps) => {
  return (
    <div className="w-[520px] shadow-[10px_10px_5px_0px_rgba(0,0,0,0.3)] ">
      <Image src={imageUrl} alt={imageAlt} width={520} height={450} />
      <div className="flex flex-col p-4 gap-4">
        <h1 className="font-extrabold text-black p-4 text-2xl">{title}</h1>
        <span className="text-[#3A3A3C] text-xl">{description}</span>
      </div>
    </div>
  );
};

export default Card;
