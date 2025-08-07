import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/hero";
import NewsTips from "@/components/newstips";
import Overview from "@/components/overview";
import Services from "@/components/services";
import Subscribe from "@/components/subscribe";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Header showHeader={true} />
      {/* Add mt-20 (margin-top: 80px) to push content below the fixed header */}
      <main className="mt-20 font-montserrat bg-white min-h-screen">
        <Hero />
        <Services />
        <Testimonials />
        <Faq />
        <Overview />
        <NewsTips />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
