import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Faq from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
