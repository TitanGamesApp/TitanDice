import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useDice } from "../provider/DiceProvider";
import { decimals } from "../../web3/consts/token";
import TitanGamesStakingABI from "../../web3/abis/TitanStaking.json";
import { TitanGamesStakingContract } from "../../web3/consts/contracts";
import { formatNumber } from "../../utils/formatNumber";
import { parseEther } from "viem";

export default function UnStakeCard() {
  const account = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { userStaked, refetchBurn, refetchStake } = useDice();
  const [active, setActive] = useState("10%");
  const [titanGMAmount, setTitanGMAmountToDeposit] = useState<string>("");

  const handleChangeTitanGM = (rate: number) => {
    if (rate === 100) setActive("Max");
    else setActive(`${rate}%`);

    const amountToBeUpdated = (Number(userStaked) / decimals) * (rate / 100);
    setTitanGMAmountToDeposit(amountToBeUpdated.toString());
  };

  const handleUnStake = async () => {
    if (Number(titanGMAmount) === 0 || !account.isConnected) return;

    let hash;

    try {
      hash = await writeContractAsync({
        abi: TitanGamesStakingABI,
        address: TitanGamesStakingContract,
        functionName: "unstake",
        args: [parseEther(titanGMAmount.toString())],
      });

      await publicClient?.waitForTransactionReceipt({ hash });

      setTitanGMAmountToDeposit("0");
      refetchBurn();
      refetchStake();
      alert("Success");
    } catch (error) {
      console.log(
        "Internal server error during depositing titanx tokens: ",
        error
      );
      alert("Failed");
    }
  };

  return (
    <div className="box rounded-[8px] overflow-hidden">
      <div className="p-[15px] bg-[#001009]">
        <p className="text-center text-white text-[16px] tracking-[1.4px] font-semibold ">
          UNSTAKE
        </p>
      </div>
      <div className="pt-[50px] pb-[13px] sm:px-[40px] px-[16px] flex flex-col gap-[9px]">
        <div className="flex justify-between items-center py-[6px] px-[10px] border border-[#0F3627] rounded-[8px] mb-[7px]">
          <h4 className="text-white/60 text-[14px] tracking-[1.4px] font-semibold">
            STAKE BALANCE
          </h4>
          <h4 className="text-white/40 text-[14px] tracking-[1.4px] font-semibold">
            {formatNumber(Number(userStaked) / decimals)} TITANGM
          </h4>
        </div>

        <div
          className="bg-[#001009] rounded-[8px] overflow-hidden border border-[#0F3627] flex "
          style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset" }}
        >
          <div className="min-w-[56px] max-w-[56px] min-h-full flex-1 bg-[#0F3627] flex justify-center items-center">
            <div className="bg-[#3cab56] w-[28px] h-[28px] rounded-full"></div>
          </div>

          <div className="p-[10px] bg-[#001009]">
            <input
              type="number"
              className="text-white/60 bg-transparent border-none outline-none text-[24px] font-semibold leading-[100%]"
              placeholder="0.0000"
              min={0}
              value={titanGMAmount}
              onChange={(e) => setTitanGMAmountToDeposit(e.target.value)}
            />

            <h5 className="text-white/30 font-semibold text-[16px]">$0.0000</h5>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-[8px]">
          <button
            onClick={() => handleChangeTitanGM(10)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "10%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            10%
          </button>
          <button
            onClick={() => handleChangeTitanGM(25)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "25%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            25%
          </button>
          <button
            onClick={() => handleChangeTitanGM(50)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "50%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            50%
          </button>
          <button
            onClick={() => handleChangeTitanGM(75)}
            className={`text-[14px]   py-[6px]  rounded-[8px]    ${
              active === "75%"
                ? "bg-[#64E180] font-bold text-[#071913]"
                : "bg-[#0F3627] font-normal text-white/60"
            }`}
          >
            75%
          </button>
          <button
            onClick={() => handleChangeTitanGM(100)}
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
          className="p-[15px] border border-[#64E180] bg-gradient-to-t from-[#69E885] to-[#39A753] text-[#071913] font-extrabold text-[20px] traking-[2px] rounded-[8px] mt-[16px] transition-all duration-100 ease-linear hover:border-[#64E180] hover:from-[#021D11] hover:to-[#021D11] hover:text-[#64E180]"
          onClick={handleUnStake}
        >
          UNSTAKE
        </button>

        <p className="text-center text-white/40 text-[14px] tracking-[1.4px] font-semibold mt-[13px]">
          5% TAX
        </p>
      </div>
    </div>
  );
}
