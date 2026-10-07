import AllProducts from "./components/AllProducts";
import Banner from "./components/HeroBanner";
import HighPrice from "./components/HighPrice";
import LowPrice from "./components/LowPrice";

export default function Home() {
  return (
    <>
      <Banner />
      <HighPrice />
      <LowPrice />
      <AllProducts />
    </>
  );
}
