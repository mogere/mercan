import Faq from "@/components/Faq";
import Hero from "@/components/hero";
import NewsTips from "@/components/newstips";
import Overview from "@/components/overview";
import Services from "@/components/services";
import Subscribe from "@/components/subscribe";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <main className="mt-20 font-montserrat bg-white min-h-screen">
        <Hero />
        <Services />
        <Testimonials />
        <Faq />
        <Overview />
        <NewsTips />
        <Subscribe />
      </main>
    </>
  );
}
