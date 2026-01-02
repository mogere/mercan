"use client";
import Image from "next/image";
import Link from "next/link";
import { Wrench, Car, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[600px] h-[90vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Hero Background"
          fill
          className="object-cover brightness-[0.45]"
          priority
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE - Text & Buttons */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col space-y-8 max-w-xl text-center lg:text-left"
        >
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight uppercase"
          >
            Drive Performance.
            <br />
            Define Style.
            <br />
            Discover More..
          </motion.h1>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full sm:w-auto"
          >
            <Link
              href="/services"
              className="flex items-center justify-center gap-2 bg-black/70 border-b-4 border-[#e3703b] px-5 py-3 rounded-md text-white font-semibold hover:bg-black transition min-h-[48px] touch-manipulation"
            >
              <Wrench className="w-5 h-5" />
              Book a Service
            </Link>
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-black/70 border-b-4 border-[#e3703b] px-5 py-3 rounded-md text-white font-semibold hover:bg-black transition min-h-[48px] touch-manipulation"
            >
              <Car className="w-5 h-5" />
              Browse Cars for Sale
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - Mechanic & Testimonial */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex flex-col items-center hidden lg:flex"
        >
          <div className="relative w-60 sm:w-72 lg:w-80 h-auto">
            <Image
              src="/hero-mech.png"
              alt="Mechanic"
              width={400}
              height={400}
              className="object-cover z-10"
            />
          </div>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -right-16 xl:-right-24 text-white p-4 max-w-xs shadow-lg"
          >
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
              <Star className="w-4 h-4 fill-current text-white" />
              <span>4.9/5</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
