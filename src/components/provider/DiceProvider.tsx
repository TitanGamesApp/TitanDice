import { createContext, useContext, ReactNode, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ethers } from "ethers";

import TitanxABI from "../../web3/abis/Titanx.json";
import TitanGamesABI from "../../web3/abis/TitanGM.json";
import TitanGamesStakingABI from "../../web3/abis/TitanStaking.json";
import {
  pulseMainnetRpcEndpoint,
  TitanGamesContract,
  TitanxContract,
  TitanGamesStakingContract,
  zeroAddress,
} from "../../web3/consts/contracts";
import { multiplier } from "../../web3/consts/bet";

interface DiceContextType {
  loading: boolean;
  titBalance: any; // Replace any with the actual type if known
  credBalance: any; // Replace any with the actual type if known
  result: any;
  allBets: IBet[] | null;
  totalSupply: any;
  totalLiquidity: any;
  totalBurned: any;
  userBurned: any;
  titReward: any;
  titanGMBalance: any;
  totalStaked: any;
  userStaked: any;
  lastPayTime: any;
  leaderboard1: any;
  leaderboard2: any;
  leaderboard3: any;
  leaderboard4: any;
  leaderboard5: any;
  leaderboard6: any;
  leaderboard7: any;
  leaderboard8: any;
  leaderboardPayoutPool: any;
  stakers: any;
  contractBalance: any;
  isSingleBet: boolean;
  setSingleBet: (status: boolean) => void;
  isMultiBet: boolean;
  setMultiBet: (status: boolean) => void;
  numberOfBets: number;
  setNumberOfBets: (cnt: number) => void;
  refetch: () => void;
  refetchBurn: () => void;
  refetchStake: () => void;
  fetchDiceRollEvents: () => Promise<void>;
}

export const DiceContext = createContext<DiceContextType | null>(null);

export const provider = new ethers.JsonRpcProvider(pulseMainnetRpcEndpoint);

interface DiceProviderProps {
  children: ReactNode;
}

export interface IBet {
  time: number;
  address: string;
  betAmount: number;
  randomResult: number;
  payout: number;
}

export const DiceProvider = ({ children }: DiceProviderProps) => {
  const { isConnected, address } = useAccount();
  const isEnabled = isConnected && !!address;
  const [allBets, setAllBets] = useState<IBet[] | null>(null);
  const [isSingleBet, setSingleBet] = useState<boolean>(false);
  const [isMultiBet, setMultiBet] = useState<boolean>(false);
  const [numberOfBets, setNumberOfBets] = useState<number>(1);

  // Get Titanx Balance
  const {
    data: titanxBalance,
    isLoading: titanxLoading,
    refetch: refetchTitanxBalance,
  } = useReadContract({
    abi: TitanxABI,
    address: TitanxContract,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  // Get Credit Balance
  const {
    data: creditBalance,
    isLoading: creditLoadinng,
    refetch: refetchCreditBalance,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "getRemainingCredits",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  // Get Latest Bet Result
  const {
    data: betResult,
    isLoading: resultLoading,
    refetch: refetchLatestBetResult,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "getUserBets",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  // Get Total Supply of TitanGM
  const {
    data: totalSupply,
    isLoading: totalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "totalSupply",
    query: { enabled: isEnabled },
  });

  // Get Total Burned
  const {
    data: totalBurned,
    isLoading: totalBurnedLoading,
    refetch: refetchTotalBurned,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "totalBurned",
    query: { enabled: isEnabled },
  });

  // Get User Burned
  const {
    data: userBurned,
    isLoading: userBurnedLoading,
    refetch: refetchUserBurned,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "userBurned",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  // Get Claimable Rewards
  const {
    data: titReward,
    isLoading: titanRewardLoading,
    refetch: refetchTitanReward,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "reward",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  // Get TitanGM Balance Of a Wallet
  const {
    data: titanGMBalance,
    isLoading: titanGMBalanceLoading,
    refetch: refetchTitanGMBalance,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  const {
    data: totalLiquidity,
    isLoading: totalLiquidityLoading,
    refetch: refetchTotalLiquidity,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "LIQ",
    query: { enabled: isEnabled },
  });

  const {
    data: totalStaked,
    isLoading: totalStakedLoading,
    refetch: refetchTotalStaked,
  } = useReadContract({
    abi: TitanGamesStakingABI,
    address: TitanGamesStakingContract,
    functionName: "totalStaked",
    query: { enabled: isEnabled },
  });

  const {
    data: userStaked,
    isLoading: userStakedLoading,
    refetch: refetchUserStaked,
  } = useReadContract({
    abi: TitanGamesStakingABI,
    address: TitanGamesStakingContract,
    functionName: "userStakes",
    args: [address ?? zeroAddress],
    query: { enabled: isEnabled },
  });

  const {
    data: lastPayTime,
    isLoading: lastPayTimeLoading,
    refetch: refetchLastPayTime,
  } = useReadContract({
    abi: TitanGamesStakingABI,
    address: TitanGamesStakingContract,
    functionName: "lastPayTime",
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard1,
    isLoading: leaderboardLoading1,
    refetch: refetchLeaderboard1,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [0],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard2,
    isLoading: leaderboardLoading2,
    refetch: refetchLeaderboard2,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [1],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard3,
    isLoading: leaderboardLoading3,
    refetch: refetchLeaderboard3,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [2],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard4,
    isLoading: leaderboardLoading4,
    refetch: refetchLeaderboard4,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [3],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard5,
    isLoading: leaderboardLoading5,
    refetch: refetchLeaderboard5,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [4],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard6,
    isLoading: leaderboardLoading6,
    refetch: refetchLeaderboard6,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [5],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard7,
    isLoading: leaderboardLoading7,
    refetch: refetchLeaderboard7,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [6],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboard8,
    isLoading: leaderboardLoading8,
    refetch: refetchLeaderboard8,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboard",
    args: [7],
    query: { enabled: isEnabled },
  });

  const {
    data: leaderboardPayoutPool,
    isLoading: leaderboardPayoutPoolLoading,
    refetch: refetchLeaderboardPayoutPool,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "leaderboardPayoutPool",
    query: { enabled: isEnabled },
  });

  const {
    data: stakers,
    isLoading: stakersLoading,
    refetch: refetchStakers,
  } = useReadContract({
    abi: TitanGamesStakingABI,
    address: TitanGamesStakingContract,
    functionName: "stakers",
    query: { enabled: isEnabled },
  });

  const {
    data: contractBalance,
    isLoading: contractBalanceLoading,
    refetch: refetchContractBalance,
  } = useReadContract({
    abi: TitanGamesABI,
    address: TitanGamesContract,
    functionName: "balanceOf",
    args: [TitanGamesStakingContract],
    query: { enabled: isEnabled },
  });

  const refetch = () => {
    refetchTitanxBalance();
    refetchCreditBalance();
    refetchLatestBetResult();
    refetchLeaderboardPayoutPool();
    refetchLeaderboard();
    fetchDiceRollEvents();
  };

  const refetchLeaderboard = () => {
    refetchLeaderboard1();
    refetchLeaderboard2();
    refetchLeaderboard3();
    refetchLeaderboard4();
    refetchLeaderboard5();
    refetchLeaderboard6();
    refetchLeaderboard7();
    refetchLeaderboard8();
  };

  const refetchBurn = () => {
    refetchTotalSupply();
    refetchTotalLiquidity();
    refetchTotalBurned();
    refetchUserBurned();
    refetchTitanReward();
    refetchTitanGMBalance();
  };

  const refetchStake = () => {
    refetchTotalStaked();
    refetchUserStaked();
    refetchLastPayTime();
    refetchStakers();
    refetchContractBalance();
  };

  const fetchDiceRollEvents = async () => {
    const contract = new ethers.Contract(
      TitanGamesContract,
      TitanGamesABI,
      provider
    );

    try {
      const filter = contract.filters.DiceRolled();
      const events = await contract.queryFilter(filter);
      const events150: any = events.slice(-50);

      const parsedEvents150: IBet[] = [];
      if (events150.length > 0) {
        for (let i = 0; i < events150.length; i++) {
          const eventData = events150[i].args;

          const block = await provider.getBlock(events150[i].blockNumber);

          if (block) {
            const temp: IBet = {
              time: block.timestamp,
              address: eventData[0],
              betAmount: Number(eventData[1]) / multiplier,
              randomResult: Number(eventData[2]) / multiplier,
              payout:
                (Number(eventData[1]) * Number(eventData[2])) /
                multiplier ** 2 /
                100,
            };

            parsedEvents150.push(temp);
          }
        }
      }

      setAllBets(parsedEvents150);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  return (
    <DiceContext.Provider
      value={{
        loading:
          titanxLoading ||
          creditLoadinng ||
          resultLoading ||
          totalSupplyLoading ||
          totalLiquidityLoading ||
          totalBurnedLoading ||
          userBurnedLoading ||
          titanRewardLoading ||
          titanGMBalanceLoading ||
          totalStakedLoading ||
          userStakedLoading ||
          leaderboardLoading1 ||
          leaderboardLoading2 ||
          leaderboardLoading3 ||
          leaderboardLoading4 ||
          leaderboardLoading5 ||
          leaderboardLoading6 ||
          leaderboardLoading7 ||
          leaderboardLoading8 ||
          leaderboardPayoutPoolLoading ||
          lastPayTimeLoading ||
          stakersLoading ||
          contractBalanceLoading,
        titBalance: titanxBalance,
        credBalance: creditBalance,
        result: betResult,
        allBets,
        totalSupply,
        totalLiquidity,
        totalBurned,
        userBurned,
        titReward,
        titanGMBalance,
        totalStaked,
        userStaked,
        lastPayTime,
        leaderboard1,
        leaderboard2,
        leaderboard3,
        leaderboard4,
        leaderboard5,
        leaderboard6,
        leaderboard7,
        leaderboard8,
        leaderboardPayoutPool,
        stakers,
        contractBalance,
        isSingleBet,
        setSingleBet,
        isMultiBet,
        setMultiBet,
        numberOfBets,
        setNumberOfBets,
        refetch,
        refetchBurn,
        refetchStake,
        fetchDiceRollEvents,
      }}
    >
      {children}
    </DiceContext.Provider>
  );
};

export const useDice = () => {
  const context = useContext(DiceContext);
  if (!context) {
    throw new Error("useDice must be used within a DiceProvider");
  }
  return context;
};
