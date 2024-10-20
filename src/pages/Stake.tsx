import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import Header from "../components/common/Header";
import StakeCard from "../components/stake/StakeCard";
import UnStakeCard from "../components/stake/UnStakeCard";
import Footer from "../components/common/Footer";
import TitanGamesStakingABI from "../web3/abis/TitanStaking.json";
import { TitanGamesStakingContract } from "../web3/consts/contracts";
import { useDice } from "../components/provider/DiceProvider";
import { decimals } from "../web3/consts/token";
import { convertSecondsToTime } from "../utils/secToString";
import { oneDayToSecs } from "../web3/consts/bet";

export default function Stake() {
  const account = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const {
    totalStaked,
    userStaked,
    lastPayTime,
    stakers,
    contractBalance,
    refetchBurn,
    refetchStake,
  } = useDice();

  const [unclaimedRewards, setUnclaimedRewards] = useState<number>(0);
  const [estimatedPayout, setEstimatedPayout] = useState<number>(0);

  useEffect(() => {
    let unclaimedRewardsTemp = 0,
      estimatedPayoutTemp = 0;
    const getUnclaimedReward = async () => {
      try {
        if (!contractBalance || !totalStaked || !publicClient) return;
        const rewardPool = Number(contractBalance) - Number(totalStaked);

        for (let i = 0; i < stakers.length; i++) {
          const temp = await publicClient.readContract({
            abi: TitanGamesStakingABI,
            address: TitanGamesStakingContract,
            functionName: "userRewards",
            args: [stakers[i]],
          });

          unclaimedRewardsTemp += Number(temp);

          if (rewardPool) {
            const temp_ = await publicClient.readContract({
              abi: TitanGamesStakingABI,
              address: TitanGamesStakingContract,
              functionName: "userStakes",
              args: [stakers[i]],
            });

            if (Number(temp_) > 0) {
              estimatedPayoutTemp +=
                (Number(temp_) * Number(rewardPool)) / Number(totalStaked);
            }
          }
        }

        if (unclaimedRewardsTemp !== 0)
          setUnclaimedRewards(unclaimedRewardsTemp);
        if (estimatedPayoutTemp !== 0) setEstimatedPayout(estimatedPayoutTemp);
      } catch (error) {
        console.error("Error during getting unclaimed rewards: ", error);
      }
    };

    if (stakers && stakers.length > 0) {
      // Calculate Unclaimed Rewards and Estimated Next Payout
      getUnclaimedReward();
    }
  }, [contractBalance, totalStaked, stakers]);

  let timeCaption;
  if (
    lastPayTime &&
    (Number(lastPayTime) + oneDayToSecs) * 1000 <= new Date().getTime()
  ) {
    timeCaption = "Paying Now";
  } else {
    timeCaption = convertSecondsToTime(
      Number(
        (Number(lastPayTime) + 86400 - new Date().getTime() / 1000).toFixed(0)
      )
    );
  }

  const data = [
    {
      title: "Total Staked Tokens",
      amt: (Number(totalStaked) / decimals).toString(),
    },
    {
      title: "My Staked Tokens",
      amt: (Number(userStaked) / decimals).toString(),
    },
    {
      title: "Unclaimed Rewards",
      amt: unclaimedRewards / decimals,
    },
    {
      title: "Next Payout in",
      amt: timeCaption,
    },
    {
      title: "Estimated Next Payout",
      amt: estimatedPayout / decimals,
    },
  ];

  const handleClaimStakeRewards = async () => {
    if (!account.isConnected) return;

    let hash;

    try {
      hash = await writeContractAsync({
        abi: TitanGamesStakingABI,
        address: TitanGamesStakingContract,
        functionName: "claimRewards",
      });

      await publicClient?.waitForTransactionReceipt({ hash });

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
    <div className="stake-burn-page min-h-screen">
      <Header />
      <main>
        <div className="container">
          <div className="lg:mt-[70px] mt-[50px]">
            <h1 className="text-[32px] md:text-[64px] text-[#3CAB56] font-bold text-center leading-none">
              STAKE
            </h1>
            <p className="text-[16px] md:text-[20px] text-white font-medium text-center">
              Stake your Credits & earn Rewards
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  sm:grid-rows-4 grid-rows-6 lg:grid-rows-2 gap-x-[8px] gap-y-[16px] mt-[72px] lg:mb-[116px] mb-[50px] sm:mb-[70px]">
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

              <button
                style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.50)" }}
                className="text-[#071913] bg-gradient-to-r from-[#69E885] to-[#39A753] border border-[#64E180] rounded-[8px] text-[14px] sm:text-[20px] font-bold tracking-[2px] transition-all duration-100 ease-linear hover:border-[#64E180] hover:from-[#021D11] hover:to-[#021D11] hover:text-[#64E180]"
                onClick={handleClaimStakeRewards}
              >
                CLAIM REWARDS
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-[82px] sm:gap-[50px] gap-[30px] lg:mb-[133px] sm:mb-[70px] mb-[50px] max-w-[802px] mx-auto">
            <div className=" w-full">
              <StakeCard />
            </div>
            <div className=" w-full">
              <UnStakeCard />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
