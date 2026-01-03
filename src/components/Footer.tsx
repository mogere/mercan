"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage("Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong");
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  return (
    <>
      <footer className="w-full bg-[#3A3A3C] text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <Link href="/services" className="hover:text-orange-400 transition">
                    Garage
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/shop" className="hover:text-orange-400 transition">
                    Auto Spares
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/shop?category=bodykits" className="hover:text-orange-400 transition">
                    Body-kit Conversion
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/shop" className="hover:text-orange-400 transition">
                    Car Sales
                  </Link>
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
                  <Link href="/#about" className="hover:text-orange-400 transition">
                    About Us
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/shop" className="hover:text-orange-400 transition">
                    Products & Services
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/#contact" className="hover:text-orange-400 transition">
                    Contact Us
                  </Link>
                </li>
                <li className="flex gap-2">
                  <Image
                    src="/icons/pointer.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                  <Link href="/shop" className="hover:text-orange-400 transition">
                    Car Sales
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-orange-400 text-sm font-semibold">
              Schedule An Appointment
            </h4>

            <div className="flex w-full gap-2">
              <input
                type="email"
                placeholder="Write your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
                className="flex-1 p-2 text-sm bg-white text-gray-800 placeholder-gray-400 rounded-l focus:outline-none"
                aria-label="Email"
                disabled={status === "loading"}
              />
              <button
                onClick={handleSubscribe}
                disabled={status === "loading"}
                className="bg-orange-500 text-white px-3 rounded-r flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50"
                aria-label="Send email"
              >
                <Image src="/icons/send.svg" alt="" width={20} height={20} />
              </button>
            </div>
            {message && (
              <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}

            <div className="text-sm text-white/90">
              <span className="block text-orange-400">Open Hours:</span>
              <span className="block">9:00 AM - 6:00 PM</span>
            </div>

            <div className="flex gap-4 mt-2">
              <a href="https://twitter.com/mercan" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:opacity-80 transition">
                <Image
                  src="/social-media/x.png"
                  alt="Twitter"
                  width={20}
                  height={20}
                />
              </a>
              <a href="https://linkedin.com/company/mercan" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:opacity-80 transition">
                <Image
                  src="/social-media/linkedin.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                />
              </a>
              <a href="https://instagram.com/mercan" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition">
                <Image
                  src="/social-media/instagram.png"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </a>
              <a href="https://facebook.com/mercan" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition">
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
      <div className="w-full bg-[#3A3A3C] text-white/80 text-sm py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          © {new Date().getFullYear()} Mercan. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Footer;
