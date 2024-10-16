import Result from "../components/dice/Result";
import LeaderBoard from "../components/dice/LeaderBoard";
import PreviousResults from "../components/dice/PreviousResults";
import Credits from "../components/dice/Credits";
import Bets from "../components/dice/Bets";
import Table from "../components/dice/Table";
import Footer from "../components/dice/Footer";
import Header from "../components/common/Header";

export default function Dice() {
  return (
    <div className="dice-page">
      <Header />
      <main className="xl:mt-[180px] sm:mt-[100px] mt-[30px] ">
        <div className="container">
          <div className="grid lg:grid-cols-[1fr,307px] grid-cols-1 gap-[16px]">
            <div className="flex flex-col gap-4">
              <Result />
              <PreviousResults />
            </div>
            <div>
              <LeaderBoard />
            </div>
          </div>

          <div className="grid lg:grid-cols-[360px,1fr] grid-cols-1 gap-x-[62px] gap-[30px] xl:mt-[112px] sm:mt-[70px] mt-[50px] xl:mb-[126px] mb-[50px] sm:mb-[70px]">
            <Credits />
            <Bets />
          </div>

          <div>
            <Table />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
