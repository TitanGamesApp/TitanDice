import { useDice } from "../provider/DiceProvider";

export default function PreviousResults() {
  const { result }: { result: any } = useDice();

  const prevResult: number[] = [];
  if (result && result.length === 50) {
    for (var i = 49; i > 39; i--) {
      prevResult.push(Number(result[i].payout) / 10 ** 6);
    }
  }

  return (
    <div className="box rounded-[24px] pt-[40px] xl:px-[30px] px-[20px]">
      <div className="flex justify-end items-center sm:gap-[14px] gap-2.5 flex-wrap">
        {prevResult.reverse().map((it, i) => {
          if (it !== 0)
            return (
              <div
                key={i}
                className="text-[#65746e] lg:p-[10px] p-[6px] text-[16px] sm:text-[24px] font-bold border border-[#256736] rounded-[8px] flex justify-center"
              >
                {it}
              </div>
            );
        })}
      </div>
      <p className="text-center text-[#00BF62] text-sm tracking-[1.4px] font-semibold py-[20px]">
        PREVIOUS RESULTS
      </p>
    </div>
  );
}
