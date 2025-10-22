// ...existing code...
import Image from "next/image";

const Footer = () => {
  return (
    <>
      {/* Main footer */}
      <footer className="w-full bg-[#3A3A3C] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Logo + description + address */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Mercan Logo" width={60} height={60} />
              <h3 className="text-lg font-semibold">Mercan Auto</h3>
            </div>

            <p className="text-sm text-white/90 max-w-md">
              Revitalize Your Ride with Mercan — expert repairs, genuine spares,
              and trusted car sales to keep you moving with confidence.
            </p>

            <ul className="text-sm mt-2 space-y-2 text-white/90">
              <li className="flex items-start gap-2">
                <Image
                  src="/icons/location.svg"
                  alt=""
                  width={16}
                  height={16}
                />
                <span>Bungoma Road, off Bunyala Road, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start gap-2">
                <Image src="/icons/phone.svg" alt="" width={16} height={16} />
                <span>0741000000</span>
              </li>
              <li className="flex items-start gap-2">
                <Image src="/icons/mail.svg" alt="" width={16} height={16} />
                <span>info@mercan.com</span>
              </li>
            </ul>
          </div>

          {/* Middle: Services & Quick links (stack on small, two columns on md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-orange-400 text-sm font-semibold mb-3">
                Services
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Garage
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Auto Spares
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Body-kit Conversion
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Car Sales
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-orange-400 text-sm font-semibold mb-3">
                Quick links
              </h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  About Us
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Products & Services
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Contact Us
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  Car Sales
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Newsletter / appointment / socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-orange-400 text-sm font-semibold">
              Schedule An Appointment
            </h4>

            <div className="flex w-full gap-2">
              <input
                type="email"
                placeholder="Write your email..."
                className="flex-1 p-2 text-sm bg-white text-gray-800 placeholder-gray-400 rounded-l focus:outline-none"
                aria-label="Email"
              />
              <button
                className="bg-orange-500 text-white px-3 rounded-r flex items-center justify-center"
                aria-label="Send email"
              >
                <Image src="/icons/send.svg" alt="" width={20} height={20} />
              </button>
            </div>

            <div className="text-sm text-white/90">
              <span className="block text-orange-400">Open Hours:</span>
              <span className="block">9:00 AM - 6:00 PM</span>
            </div>

            <div className="flex gap-4 mt-2">
              <a href="#" aria-label="Twitter">
                <Image
                  src="/social-media/x.png"
                  alt="Twitter"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Image
                  src="/social-media/linkedin.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#" aria-label="Instagram">
                <Image
                  src="/social-media/instagram.png"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </a>
              <a href="#" aria-label="Facebook">
                <Image
                  src="/social-media/facebook.png"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <hr className="text-orange-500" />
      {/* Bottom copyright bar */}
      <div className="w-full bg-[#3A3A3C] text-white/80 text-sm py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          © {new Date().getFullYear()} Mercan. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Footer;
// ...existing code...
