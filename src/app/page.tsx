// import Faq from "@/components/Faq";
import Hero from "@/components/hero";
// import NewsTips from "@/components/newstips";
import NewProducts from "@/components/newProducts";
import Overview from "@/components/overview";
import ProductCategories from "@/components/ProductCategories";
import Services from "@/components/services";
// import Subscribe from "@/components/subscribe";
// import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <main className="font-montserrat bg-white min-h-screen">
        <Hero />
        <Services />
        {/* <Testimonials /> */}
        {/* <Faq /> */}
        <ProductCategories />
        <NewProducts />
        <Overview />
        {/* <NewsTips /> */}
        {/* <Subscribe /> */}
      </main>
    </>
  );
}
