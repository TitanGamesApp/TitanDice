import { useDice } from "../components/provider/DiceProvider";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import BuyCard from "../components/burn/BuyCard";
import BurnCard from "../components/burn/BurnCard";
import { decimals } from "../web3/consts/token";

export default function Burn() {
  const { totalSupply, totalLiquidity, totalBurned, userBurned } = useDice();

  const data = [
    {
      title: "Total Supply",
      amt: (Number(totalSupply) / decimals).toString(),
    },
    {
      title: "Total Burned",
      amt: (Number(totalBurned) / decimals).toString(),
    },
    {
      title: "Total Liquidity",
      amt: Number(totalLiquidity).toString(),
    },
    {
      title: "My Burned",
      amt: (Number(userBurned) / decimals).toString(),
    },
  ];

  return (
    <div className="stake-burn-page min-h-screen">
      <Header />
      <main>
        <div className="container">
          <div className="lg:mt-[70px] mt-[50px]">
            <h1 className="text-[32px] md:text-[64px] text-[#3CAB56] font-bold text-center leading-none">
              BURN
            </h1>
            <p className="text-[16px] md:text-[20px] text-white font-medium text-center">
              Burn your Credits & get TITANGM
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2   sm:grid-rows-2 grid-rows-4  gap-x-[8px] gap-y-[16px] mt-[72px] lg:mb-[60px] mb-[40px] sm:mb-[50px] max-w-[776px] mx-auto">
              {data.map((dt, i) => (
                <div
                  key={i}
                  className="sm:py-[18px] py-2 sm:px-[43px] px-3 bg-[#071913]/95 rounded-[8px]"
                  style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.50)" }}
                >
                  <h5 className="text-white/60 text-[18px] sm:text-[20px] font-medium">
                    {dt.title}
                  </h5>
                  <h4 className="text-white md:text-[28px] text-[22px] font-bold leading-none mt-[5px]">
                    {dt.amt}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-[56px] sm:gap-[20px] gap-[30px] lg:mb-[92px] sm:mb-[70px] mb-[50px] max-w-[776px] mx-auto">
            <div className=" w-full">
              <BuyCard />
            </div>
            <div className=" w-full">
              <BurnCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
