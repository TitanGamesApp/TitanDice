import { useState } from "react";

// Import Custom Context Hooks
import { useDice } from "../provider/DiceProvider";

// Import Constants
import { decimals } from "../../web3/consts/token";
import TitanGamesABI from "../../web3/abis/TitanGM.json";
import TitanxABI from "../../web3/abis/Titanx.json";
import {
  TitanGamesContract,
  TitanxContract,
} from "../../web3/consts/contracts";

// Import Utils
import { formatNumber } from "../../utils/formatNumber";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseEther } from "viem";

export default function Credits() {
  const account = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [active, setActive] = useState("10%");
  const [titanxAmount, setTitanxAmountToDeposit] = useState<string>("");

  const { titBalance, credBalance, refetch, loading } = useDice();

  const handleChangeTitanx = (rate: number) => {
    if (rate === 100) setActive("Max");
    else setActive(`${rate}%`);

    const amountToBeUpdated = (Number(titBalance) / decimals) * (rate / 100);
    setTitanxAmountToDeposit(amountToBeUpdated.toString());
  };

  const handleDeposit = async () => {
    if (Number(titanxAmount) === 0 || !account.isConnected) return;

    let hash;

    try {
      let allowance = await publicClient?.readContract({
        address: TitanxContract,
        abi: TitanxABI,
        functionName: "allowance",
        args: [account.address, TitanGamesContract],
      });

      if (BigInt(Number(allowance)) < parseEther(titanxAmount.toString())) {
        hash = await writeContractAsync({
          address: TitanxContract,
          abi: TitanxABI,
          functionName: "approve",
          args: [TitanGamesContract, parseEther(titanxAmount.toString())],
        });

        await publicClient?.waitForTransactionReceipt({ hash });
      }

      allowance = await publicClient?.readContract({
        address: TitanxContract,
        abi: TitanxABI,
        functionName: "allowance",
        args: [account.address, TitanGamesContract],
      });

      if (BigInt(Number(allowance)) >= parseEther(titanxAmount.toString())) {
        hash = await writeContractAsync({
          abi: TitanGamesABI,
          address: TitanGamesContract,
          functionName: "deposit",
          args: [parseEther(titanxAmount.toString())],
        });

        await publicClient?.waitForTransactionReceipt({ hash });

        setTitanxAmountToDeposit("0");
        refetch();
        alert("Success");
      }
    } catch (error) {
      console.log(
        "Internal server error during depositing titanx tokens: ",
        error
      );
      alert("Failed");
    }
  };

  return (
    <div className="box">
      <div className="p-[15px] bg-[#001009]">
        <p className="text-center text-[#3DAC57] text-sm tracking-[1.4px] font-semibold ">
          BUY CREDITS
        </p>
      </div>
      <div className="py-[30px] sm:px-[40px] px-[16px] flex flex-col gap-[9px]">
        <div className="flex justify-between items-center py-[6px] px-[10px] border border-[#0F3627] rounded-[8px]">
          <h4 className="text-white/60 text-[14px] tracking-[1.4px] font-semibold">
            BALANCE
          </h4>
          <h4 className="text-white/40 text-[14px] tracking-[1.4px] font-semibold">
            {loading || !credBalance ? "0" : formatNumber(Number(credBalance))}{" "}
            CREDITS
          </h4>
        </div>
        <div className="flex justify-between items-center py-[6px] px-[10px] border border-[#0F3627] rounded-[8px]">
          <h4 className="text-white/60 text-[14px] tracking-[1.4px] font-semibold">
            MY TITANX BALANCE
          </h4>
          <h4 className="text-white/40 text-[14px] tracking-[1.4px] font-semibold">
            {loading || !titBalance
              ? "0"
              : formatNumber(Number(titBalance) / decimals)}{" "}
          </h4>
        </div>

        <div
          className="bg-[#001009] rounded-[8px] overflow-hidden border border-[#0F3627] flex "
          style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset" }}
        >
          <div className="min-w-[56px] max-w-[56px] min-h-full flex-1 bg-[#0F3627] flex justify-center items-center">
            <div className="bg-[#3cab56] w-[28px] h-[28px] rounded-full"></div>
          </div>

          <div className="p-[10px] ">
            <input
              type="number"
              className="text-white/60 bg-transparent border-none outline-none text-[24px] font-semibold leading-[100%]"
              placeholder="0.0000"
              value={titanxAmount}
              onChange={(e) => setTitanxAmountToDeposit(e.target.value)}
            />

            <h5 className="text-white/30 font-semibold text-[16px]">$0.0000</h5>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-[6px]">
          <button
            onClick={() => handleChangeTitanx(10)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "10%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            10%
          </button>
          <button
            onClick={() => handleChangeTitanx(25)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "25%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            25%
          </button>
          <button
            onClick={() => handleChangeTitanx(50)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "50%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            50%
          </button>
          <button
            onClick={() => handleChangeTitanx(75)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "75%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            75%
          </button>
          <button
            onClick={() => handleChangeTitanx(100)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "max"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            MAX
          </button>
        </div>

        <button
          className="p-[15px] border border-[#64E180] bg-gradient-to-t from-[#69E885] to-[#39A753] text-[#071913] font-extrabold text-[20px] traking-[2px] rounded-[8px] mt-[6px] transition-all duration-100 ease-linear hover:border-[#64E180] hover:from-[#021D11] hover:to-[#021D11] hover:text-[#64E180]"
          onClick={handleDeposit}
        >
          BUY CREDITS
        </button>
      </div>
    </div>
  );
}
