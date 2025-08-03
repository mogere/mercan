import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsTips from "@/components/newstips";
import Subscribe from "@/components/subscribe";

export default function Home() {
  return (
    <>
      <Header showHeader={true} />
      {/* Add mt-20 (margin-top: 80px) to push content below the fixed header */}
      <main className="mt-20 font-montserrat bg-white min-h-screen">
        <NewsTips />
        <Subscribe />
      </main>
      <Footer />
    </>
  );
}
