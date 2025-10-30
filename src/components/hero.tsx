"use client";
import Image from "next/image";
import { Wrench, Car, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg" // Replace with your background image
          alt="Garage Background"
          fill
          className="object-cover brightness-[0.45]"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left side - Text and Buttons */}
        <div className="flex flex-col space-y-8 max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight uppercase">
            Drive Performance.
            <br />
            Define Style.
            <br />
            Discover More..
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="flex items-center gap-2 cursor-pointer bg-black/70 border-b-4 border-[#e3703b] px-5 py-3  text-white font-semibold hover:bg-black transition">
              <Wrench className="w-5 h-5" />
              Book a Service
            </button>
            <button className="flex items-center gap-2 cursor-pointer bg-black/70 border-b-4 border-[#e3703b] px-5 py-3  text-white font-semibold hover:bg-black transition">
              <Car className="w-5 h-5" />
              Browse Cars for Sale
            </button>
          </div>
        </div>

        {/* Right side - Mechanic + Testimonial */}
        <div className="relative flex flex-col items-center">
          {/* Mechanic image */}
          <div className="relative w-60 sm:w-72 lg:w-80 h-auto">
            <Image
              src="/hero-mech.png"
              alt="Mechanic"
              width={400}
              height={400}
              className=" object-cover z-10"
            />
          </div>

          {/* Testimonial card */}
          <div className="absolute -right-16 sm:-right-24 text-white p-4  max-w-xs shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/profile.png"
                alt="Customer"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-semibold">Customer Review</span>
            </div>
            <p className="text-sm leading-snug">
              Top-notch service! Got my car fully upgraded and back on the road
              in no time. The team knows their stuff — honest, fast, and
              reliable.
            </p>
            <div className="flex items-center justify-end gap-1 mt-2 text-sm">
              <Star className="w-4 h-4 fill-current text-orange-500" />
              <span>4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
