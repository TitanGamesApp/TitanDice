import { shortenAddress } from "../../utils/shrtenAddress";
import { leaderboardRates } from "../../web3/consts/bet";
import { decimals } from "../../web3/consts/token";
import { useDice } from "../provider/DiceProvider";
import LeaderboardTable from "./LeaderBoardTable";

interface LeaderboardData {
  rank: number;
  player: string;
  bets: number;
  spent: number;
  won: number;
}

export default function LeaderBoard() {
  const {
    leaderboard1,
    leaderboard2,
    leaderboard3,
    leaderboard4,
    leaderboard5,
    leaderboard6,
    leaderboard7,
    leaderboard8,
    leaderboardPayoutPool,
  } = useDice();

  const data: LeaderboardData[] = [];
  if (leaderboard1)
    data.push({
      rank: 1,
      player: shortenAddress(leaderboard1[0], 4) as string,
      bets: Number(leaderboard1[1]),
      spent: Number(leaderboard1[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[0]) / 100 / decimals,
    });
  if (leaderboard2)
    data.push({
      rank: 2,
      player: shortenAddress(leaderboard2[0], 4) as string,
      bets: Number(leaderboard2[1]),
      spent: Number(leaderboard2[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[1]) / 100 / decimals,
    });
  if (leaderboard3)
    data.push({
      rank: 3,
      player: shortenAddress(leaderboard3[0], 4) as string,
      bets: Number(leaderboard3[1]),
      spent: Number(leaderboard3[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[2]) / 100 / decimals,
    });
  if (leaderboard4)
    data.push({
      rank: 4,
      player: shortenAddress(leaderboard4[0], 4) as string,
      bets: Number(leaderboard4[1]),
      spent: Number(leaderboard4[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[3]) / 100 / decimals,
    });
  if (leaderboard5)
    data.push({
      rank: 5,
      player: shortenAddress(leaderboard5[0], 4) as string,
      bets: Number(leaderboard5[1]),
      spent: Number(leaderboard5[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[4]) / 100 / decimals,
    });
  if (leaderboard6)
    data.push({
      rank: 6,
      player: shortenAddress(leaderboard6[0], 4) as string,
      bets: Number(leaderboard6[1]),
      spent: Number(leaderboard6[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[5]) / 100 / decimals,
    });
  if (leaderboard7)
    data.push({
      rank: 7,
      player: shortenAddress(leaderboard7[0], 4) as string,
      bets: Number(leaderboard7[1]),
      spent: Number(leaderboard7[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[6]) / 100 / decimals,
    });
  if (leaderboard8)
    data.push({
      rank: 8,
      player: shortenAddress(leaderboard8[0], 4) as string,
      bets: Number(leaderboard8[1]),
      spent: Number(leaderboard8[2]),
      won:
        (Number(leaderboardPayoutPool) * leaderboardRates[7]) / 100 / decimals,
    });

  return (
    <div className="box pt-[11px] rounded-[16px] w-full overflow-hidden">
      <div>
        <div className="px-[14px] mb-1 flex items-center justify-between">
          <h3 className=" text-[#01A755] text-[20px] sm:text-[32px] font-bold">
            Leaderboard
          </h3>
        </div>

        {/* table */}
        <LeaderboardTable leaderBoardModal={false} data={data.slice(0, 8)} />
      </div>
    </div>
  );
}
