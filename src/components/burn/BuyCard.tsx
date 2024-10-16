import { usePublicClient, useWriteContract } from "wagmi";
import { useDice } from "../provider/DiceProvider";
import { formatNumber } from "../../utils/formatNumber";
import { decimals } from "../../web3/consts/token";
import TitanGamesABI from "../../web3/abis/TitanGM.json";
import { TitanGamesContract } from "../../web3/consts/contracts";
import { claimFee, multiplier } from "../../web3/consts/bet";

export default function BuyCard() {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { refetchBurn, titReward, titanGMBalance } = useDice();

  const handleClaim = async () => {
    try {
      const hash = await writeContractAsync({
        abi: TitanGamesABI,
        address: TitanGamesContract,
        functionName: "claimTokens",
      });

      await publicClient?.waitForTransactionReceipt({ hash });

      refetchBurn();
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
          CLAIM
        </p>
      </div>
      <div className="pt-[39px] pb-[13px] sm:px-[40px] px-[16px] flex flex-col gap-[9px]">
        <p className="text-center text-white/60 text-[16px] tracking-[1.6px] font-semibold mb-[12px]">
          CLAIM TITANGM FROM BETS
        </p>
        <div className="flex justify-between items-center py-[6px] px-[10px] border border-[#0F3627] rounded-[8px] mb-[7px]">
          <h4 className="text-white/60 text-[14px] tracking-[1.4px] font-semibold">
            MY BALANCE
          </h4>
          <h4 className="text-white/40 text-[14px] tracking-[1.4px] font-semibold">
            {formatNumber(
              ((Number(titReward) / multiplier) * (1 - claimFee)) / 100
            )}{" "}
            TITANGM
          </h4>
        </div>

        <button
          className="p-[15px] border border-[#64E180] bg-gradient-to-t from-[#69E885] to-[#39A753] text-[#071913] font-extrabold text-[20px] traking-[2px] rounded-[8px] mt-[16px] transition-all duration-100 ease-linear hover:border-[#64E180] hover:from-[#021D11] hover:to-[#021D11] hover:text-[#64E180]"
          onClick={handleClaim}
        >
          CLAIM
        </button>
        <div className="flex justify-between items-center py-[6px] px-[10px] border border-[#0F3627] rounded-[8px] mt-[15px]">
          <h4 className="text-white/60 text-[14px] tracking-[1.4px] font-semibold">
            MY BALANCE
          </h4>
          <h4 className="text-white/40 text-[14px] tracking-[1.4px] font-semibold">
            {formatNumber(Number(titanGMBalance) / decimals)} TITANGM
          </h4>
        </div>
        <p className="text-center text-white/60 text-[14px] tracking-[1.4px] font-normal mt-[15px]">
          1 TITANGM = 1 REWARDX
        </p>
      </div>
    </div>
  );
}
