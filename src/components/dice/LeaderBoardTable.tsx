interface LeaderboardData {
  rank: number;
  player: string;
  bets: number;
  spent: number;
  won: number;
}

interface LeaderboardTableProps {
  leaderBoardModal: boolean;
  data: LeaderboardData[];
}

const LeaderboardTable = ({
  leaderBoardModal,
  data,
}: LeaderboardTableProps) => {
  return (
    <div>
      <table
        className={`w-full border-separate ${
          leaderBoardModal ? "border-spacing-y-3" : "border-spacing-y-1"
        } `}
      >
        <thead>
          <tr>
            <th className="text-white/80 font-[300] tracking-[1.4px] text-[14px] text-start pl-[17px]">
              Rank
            </th>
            <th className="text-white/80 font-[300] tracking-[1.4px] text-[14px] text-start">
              Player
            </th>
            <th className="text-white/80 font-[300] tracking-[1.4px] text-[14px] text-start">
              Bets
            </th>
            <th className="text-white/80 font-[300] tracking-[1.4px] text-[14px] text-start">
              Spent
            </th>
            <th className="text-white/80 font-[300] tracking-[1.4px] text-[14px] text-start pr-[17px]">
              Payout
            </th>
          </tr>
        </thead>

        <tbody className="">
          {data?.map((dt, i) => (
            <tr key={i} className="">
              <td
                className={`text-[white]/60 text-[12px] tracking-[1.2px] font-semibold text-center py-[10px] flex justify-center  bg-[#072015] ${
                  leaderBoardModal
                    ? " rounded-l-[8px]"
                    : "  border-[#012C11] border-r-0 border"
                } `}
              >
                {dt?.rank <= 3 ? (
                  <img
                    className="py-[2px]"
                    src={`assets/images/rank${dt?.rank}.svg`}
                    alt={`Rank ${dt?.rank}`}
                  />
                ) : (
                  <p className="mb-1">{i + 1}</p>
                )}
              </td>

              <td
                className={`text-[white]/60 text-[12px] tracking-[1.2px] font-semibold  bg-[#072015] ${
                  leaderBoardModal ? " " : " border-[#012C11] border-y"
                }`}
              >
                {dt.player}
              </td>
              <td
                className={`text-[white]/60 text-[12px] tracking-[1.2px] font-semibold  bg-[#072015] ${
                  leaderBoardModal ? " " : " border-[#012C11] border-y"
                }`}
              >
                {dt.bets}
              </td>
              <td
                className={`text-[white]/60 text-[12px] tracking-[1.2px] font-semibold  bg-[#072015] ${
                  leaderBoardModal ? " " : " border-[#012C11] border-y"
                }`}
              >
                {dt.spent}
              </td>
              <td
                className={`text-[white]/60 text-[12px] tracking-[1.2px] font-semibold   bg-[#072015]  ${
                  leaderBoardModal
                    ? " rounded-r-[8px]"
                    : " border-[#012C11] border border-l-0"
                }`}
              >
                {Number(dt.won).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
