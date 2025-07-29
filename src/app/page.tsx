import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header showHeader={true} />
      <main className="h-[10rem] bg-white"></main>
      <Footer />
    </>
  );
}
