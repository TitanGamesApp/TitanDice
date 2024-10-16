import { useState } from "react";
import MultiBets from "./MultiBets";
import SingleBets from "./SingleBets";

export default function Bets() {
  const [bet, setBet] = useState("multi");

  return (
    <div className="box flex flex-col">
      <div className=" grid grid-cols-2 ">
        <button
          onClick={() => setBet("single")}
          className={`text-[16px] rounded-t-[8px] py-[15px]  tracking-[1.6px] font-semibold ${
            bet === "single"
              ? "text-[#001009]  bg-[#01A755]  "
              : "text-white/60 bg-[#001009]"
          }`}
        >
          SINGLE BETS
        </button>
        <button
          onClick={() => setBet("multi")}
          className={`text-[16px] rounded-t-[8px] py-[15px]  tracking-[1.6px] font-semibold ${
            bet === "multi"
              ? "text-[#001009]  bg-[#01A755]  "
              : "text-white/60 bg-[#001009]"
          }`}
        >
          MULTI BETS
        </button>
      </div>
      <div className="border border-[#01A755] flex-1 rounded-b-[8px]">
        {bet === "multi" ? <MultiBets /> : <SingleBets />}
      </div>
    </div>
  );
}
