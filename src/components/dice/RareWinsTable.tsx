import { formatNumber } from "../../utils/formatNumber";
import { shortenAddress } from "../../utils/shrtenAddress";
import { IBet } from "../provider/DiceProvider";
import { AllBetsTableProps } from "./AllBetsTable";

export default function RareWinsTable({
  numberOfData,
  data,
}: AllBetsTableProps) {
  let tableContent;
  if (data) {
    const filteredData = data.sort(
      (a, b) => b.payout / b.betAmount - a.payout / a.betAmount
    );
    tableContent = filteredData
      .slice(0, numberOfData)
      .map((item: IBet, index: number) => {
        return (
          <tr
            key={index}
            className="   border last:border-b-none rounded-[8px]"
            style={{
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset",
            }}
          >
            <td className="text-[white] text-[14px] tracking-[1.4px] font-semibold  py-[16px] xl:pl-[38px] pl-[17px] border-[#012C11] border-r-0 border rounded-l-[8px] bg-[#072015]">
              DICE
            </td>
            <td className="text-[white] text-[14px] tracking-[1.4px] font-semibold  py-[16px] border-[#012C11] border-y bg-[#072015]">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(item.time * 1000))}
            </td>
            <td className="text-[white]/60 text-[14px] tracking-[1.4px] font-semibold  py-[16px] border-[#012C11] border-y bg-[#072015]">
              {shortenAddress(item.address, 5)}
            </td>
            <td className="text-[white] text-[14px] tracking-[1.4px] font-semibold  py-[16px] border-[#012C11] border-y bg-[#072015]">
              {formatNumber(item.betAmount)} CREDITS
            </td>
            <td className="text-[#3BAA56] text-[14px] tracking-[1.4px] font-semibold  py-[16px] border-[#012C11] border border-l-0 rounded-r-[8px] bg-[#072015]">
              {formatNumber(item.payout)} CREDITS
            </td>
          </tr>
        );
      });
  }

  return (
    <table className="w-full min-w-[714px] border-separate border-spacing-y-3 table-fixe2d ">
      <thead>
        <tr>
          <th className="text-[#3BAA56] font-[300] tracking-[1.4px] text-[14px] text-start xl:pl-[38px] pl-[17px]">
            GAME
          </th>
          <th className="text-[#3BAA56] font-[300] tracking-[1.4px] text-[14px] text-start ">
            TIME
          </th>
          <th className="text-[#3BAA56] font-[300] tracking-[1.4px] text-[14px] text-start ">
            PLAYER
          </th>
          <th className="text-[#3BAA56] font-[300] tracking-[1.4px] text-[14px] text-start ">
            BET AMOUNT
          </th>
          <th className="text-[#3BAA56] font-[300] tracking-[1.4px] text-[14px] text-start ">
            PAYOUT
          </th>
        </tr>
      </thead>

      <tbody className="">{tableContent}</tbody>
    </table>
  );
}
