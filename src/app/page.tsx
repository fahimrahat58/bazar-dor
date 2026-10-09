import AllProducts from "./components/AllProducts";
import Banner from "./components/HeroBanner";
import HighPrice from "./components/HighPrice";
import LowPrice from "./components/LowPrice";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#f8f9fa]">
      <Banner />
      <HighPrice />
      <LowPrice />
      <AllProducts />
    </main>
  );
}
