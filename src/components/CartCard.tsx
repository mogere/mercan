import Image from "next/image";
type cardProps = {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  icon?: string;
};
const CartCard = ({ imageUrl, imageAlt, title, description }: cardProps) => {
  return (
    <div className=" flex w-[390px] shadow-sm bg-[#D9D9D9] my-4 md:w-[390px] ">
      <div className="w-full bg-white h-[333px] object-cover">
        <Image src={imageUrl} alt={imageAlt} width={390} height={333} />
      </div>
      <div className="flex flex-col p-4 gap-4">
        <h1 className="font-extrabold text-black text-2xl">{title}</h1>
        <span className="text-black text-xl">{description}</span>
      </div>
    </div>
  );
};

export default CartCard;
