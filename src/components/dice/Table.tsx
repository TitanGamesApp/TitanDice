import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Dropdown from "./Dropdown";
import AllBetsTable from "./AllBetsTable";
import MyBetsTable from "./MyBetsTable";
import HighRollersTable from "./HighRollersTable";
import RareWinsTable from "./RareWinsTable";
import { IBet, provider, useDice } from "../provider/DiceProvider";
import { multiplier } from "../../web3/consts/bet";

export default function Table() {
  const { address } = useAccount();
  const [tab, setTab] = useState("all");

  //show data
  const [numberOfData, setNumberOfData] = useState(10);
  const [myBets, setMyBets] = useState<IBet[] | null>(null);

  const { allBets, result, fetchDiceRollEvents } = useDice();

  useEffect(() => {
    fetchDiceRollEvents();
  }, []);

  //handle numer of data
  const handleClick = (text: string) => {
    setTab(text);
    setNumberOfData(10);
  };

  useEffect(() => {
    if (result && address && result.length > 0) {
      async function parseBetResult() {
        const temp: IBet[] = [];
        for (let i = 0; i < result.length; i++) {
          const block = await provider.getBlock(result[i].blockNumber);
          if (block) {
            temp.push({
              address: address as string,
              time: block.timestamp,
              betAmount: Number(result[i].betAmount) / multiplier,
              payout:
                (Number(result[i].betAmount) * Number(result[i].payout)) /
                multiplier ** 2 / 100,
              randomResult: Number(result[i].payout) / multiplier,
            });
          }
        }

        setMyBets(temp);
      }

      parseBetResult();
    }
  }, [result]);

  return (
    <div>
      <div className="flex justify-between items-center flex-col sm:flex-row">
        <div className=" w-full md:bg-[#071913] rounded-[8px] md:w-fit py-[4px] px-[6px] md:flex grid  grid-cols-2 items-center sm:gap-x-[30px] gap-[10px] flex-wrap ">
          <button
            onClick={() => handleClick("all")}
            className={`text-[14px] rounded-[8px] font-semibold tracking-[1.4px] py-[11.5px] sm:px-[19.5px] px-[10px]  ${
              tab === "all"
                ? "text-[#071913] bg-[#01A755]"
                : "text-white bg-[#071913]"
            }`}
          >
            ALL BETS
          </button>
          <button
            onClick={() => handleClick("my")}
            className={`text-[14px] rounded-[8px] font-semibold tracking-[1.4px] py-[11.5px] sm:px-[19.5px] px-[10px]] ${
              tab === "my"
                ? "text-[#071913] bg-[#01A755]"
                : "text-white bg-[#071913]"
            }`}
          >
            MY BETS
          </button>
          <button
            onClick={() => handleClick("high")}
            className={`text-[14px] rounded-[8px] font-semibold tracking-[1.4px] py-[11.5px] sm:px-[19.5px] px-[10px]  ${
              tab === "high"
                ? "text-[#071913] bg-[#01A755]"
                : "text-white bg-[#071913]"
            }`}
          >
            HIGH ROLLERS
          </button>
          <button
            onClick={() => handleClick("rare")}
            className={`text-[14px] rounded-[8px] font-semibold tracking-[1.4px] py-[11.5px]  sm:px-[19.5px] px-[10px] ${
              tab === "rare"
                ? "text-[#071913] bg-[#01A755]"
                : "text-white bg-[#071913]"
            }`}
          >
            RARE WINS
          </button>
        </div>

        <div className="hidden md:block">
          <Dropdown
            numberOfData={numberOfData}
            setNumberOfData={setNumberOfData}
          />
        </div>
      </div>

      {/* table */}

      <div className="lg:mt-[46px] mt-[20px] overflow-x-scroll scrollbar-hide">
        {tab === "all" && (
          <AllBetsTable data={allBets} numberOfData={numberOfData} />
        )}
        {tab === "my" && (
          <MyBetsTable data={myBets} numberOfData={numberOfData} />
        )}
        {tab === "high" && (
          <HighRollersTable data={allBets} numberOfData={numberOfData} />
        )}
        {tab === "rare" && (
          <RareWinsTable data={allBets} numberOfData={numberOfData} />
        )}
      </div>
    </div>
  );
}
