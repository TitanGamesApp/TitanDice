import { useState } from "react";
import LeaderboardTable from "./LeaderBoardTable";

interface LeaderboardModalProps {
  data: Array<any>; // You can replace 'any' with the appropriate type for 'data'
}

export default function LeaderboardModal({ data }: LeaderboardModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  //pagination tab
  const [activePagination, setActivePagination] = useState("1");

  return (
    <div>
      {/* Button to toggle the modal */}

      <button
        onClick={toggleModal}
        className="text-[#001009] border border-[#64E180] py-[4px] px-[10px] rounded-[8px] text-xs"
        style={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, #69E885 0%, #39A753 100%)",
        }}
      >
        Full Table
      </button>
      {/* Modal Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ease-out"
          onClick={toggleModal}
        >
          {/* Modal */}
          <div
            className={` py-4 shadow-lg transform transition-transform duration-300 ease-out md:w-[530px] w-[300px] ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#001009] rounded-[24px] md:p-6 p-3">
              <h2 className="text-center font-bold text-[#01A755] text-[24px] sm:text-[32px] mb-[38px]">
                Leaderboard
              </h2>

              <div className="overflow-y-scroll scrollbar-hide">
                <div className="max-h-[80vh]">
                  <LeaderboardTable
                    data={data.slice(0, 10)}
                    leaderBoardModal={true}
                  />

                  {/* pagination */}
                  <div className="flex justify-center gap-[5px] items-center">
                    <button className="text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center hover:bg-[#3FAE59]">
                      {"<"}
                    </button>
                    <button
                      onClick={() => setActivePagination("1")}
                      className={`text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center ${
                        activePagination === "1" ? "bg-[#3FAE59]" : ""
                      }`}
                    >
                      1
                    </button>
                    <button
                      onClick={() => setActivePagination("2")}
                      className={`text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center ${
                        activePagination === "2" ? "bg-[#3FAE59]" : ""
                      }`}
                    >
                      2
                    </button>
                    <button className="text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px]  flex justify-center items-center">
                      ...
                    </button>
                    <button
                      onClick={() => setActivePagination("3")}
                      className={`text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center ${
                        activePagination === "3" ? "bg-[#3FAE59]" : ""
                      }`}
                    >
                      3
                    </button>
                    <button
                      onClick={() => setActivePagination("4")}
                      className={`text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center ${
                        activePagination === "4" ? "bg-[#3FAE59]" : ""
                      }`}
                    >
                      4
                    </button>
                    <button className="text-white text-[12px] tracking-[1.2px] font-semibold p-[10px] rounded-[8px] bg-[#072015] w-[33px] h-[28px] flex justify-center items-center hover:bg-[#3FAE59]">
                      {">"}
                    </button>
                  </div>
                  <button
                    className="mt-4 px-[44px] py-[9px] bg-gradient-to-r from-[#69E885]  to-[#39A753] text-[#001009] rounded-lg border-[0.5px] border-[#64E180] w-fit mx-auto block text-[14px] font-semibold transition-all duration-100 ease-linear hover:border-[#64E180] hover:from-[#021D11] hover:to-[#021D11] hover:text-[#64E180]"
                    onClick={toggleModal}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
