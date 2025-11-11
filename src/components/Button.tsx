import Image from "next/image";
interface ButtonProps {
  label: string;
  iconUrl?: string;
  size?: "small" | "medium" | "large";
  underline?: boolean;
}
const Button = ({
  label,
  iconUrl,
  size = "medium",
  underline,
}: ButtonProps) => {
  return (
    <div className="w-fit">
      <button
        className={`bg-[#3A3A3CCC] flex justify-between gap-5  text-2xl ${
          size === "small"
            ? "p-2 text-sm"
            : size === "large"
            ? "py-6 px-8 text-3xl"
            : "p-5"
        }`}
      >
        {label}
        {iconUrl && <Image src={iconUrl} alt={label} width={25} height={25} />}
      </button>
      {underline && <div className="bg-[#F16625] h-1"></div>}
    </div>
  );
};

export default Button;
