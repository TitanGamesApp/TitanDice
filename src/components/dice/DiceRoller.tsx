import { useState, useEffect } from "react";
import { useDice } from "../provider/DiceProvider";

// Winnig Sound
import audio from "../../assets/winning.mp3";

const DiceRoller = () => {
  const {
    result,
    isSingleBet,
    isMultiBet,
    setSingleBet,
    setMultiBet,
    numberOfBets,
  } = useDice();
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (result && isSingleBet) {
      if (localStorage.getItem("isEnabledAnime") === "true") {
        if (localStorage.getItem("isEnabledSound") === "true")
          new Audio(audio).play();
        setNumber(0);
        let count = 0;
        const target = Number(result[result.length - 1].payout) / 10 ** 6;

        const divider = target / 25;
        const interval = setInterval(() => {
          setNumber((prevNumber: any) => Number(prevNumber) + divider);
          count++;
          if (count > 24) {
            // Roll for 50 frames
            clearInterval(interval);
            setSingleBet(false);
          }
        }, 60); // Update every 50ms for smooth animation

        return () => clearInterval(interval); // Cleanup the interval
      } else {
        setNumber(Number(result[result.length - 1].payout) / 10 ** 6);
      }
    }
  }, [isSingleBet]);

  useEffect(() => {
    if (result && isMultiBet) {
      if (localStorage.getItem("isEnabledAnime") === "true") {
        const updateNumbers = async () => {
          for (
            let i = numberOfBets >= 50 ? 0 : 50 - numberOfBets;
            i < 50;
            i++
          ) {
            if (localStorage.getItem("isEnabledSound") === "true")
              new Audio(audio).play();
            setNumber(0);
            let count = 0;
            const target = Number(result[i].payout) / 10 ** 6;

            const divider = target / 25;

            await new Promise((resolve) => {
              const interval = setInterval(() => {
                setNumber((prevNumber: any) => Number(prevNumber) + divider);
                count++;
                if (count > 24) {
                  clearInterval(interval); // Clear the interval after 50 frames
                  resolve(null); // Resolve the promise to continue the loop
                }
              }, 60); // Update every 60ms for smooth animation
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          setMultiBet(false); // Set isMultiBet to false once the loop is done
        };

        updateNumbers(); // Call the asynchronous function
      } else {
        const updateNumbers = async () => {
          for (
            let i = 49;
            i > 49 - (numberOfBets > 50 ? 50 : numberOfBets);
            i--
          ) {
            const target = Number(result[i].payout) / 10 ** 6;
            setNumber(target); // Update the state with each target number

            // Wait for 1 second before continuing the loop
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          setMultiBet(false); // Set isMultiBet to false once the loop is done
        };

        updateNumbers(); // Call the asynchronous function
      }
    }
  }, [isMultiBet]);

  return (
    <div className="flex-1 border border-[#00C565] bg-[#001009] rounded-[24px]">
      <h2 className="text-center md:text-[96px] text-[72px] font-black not-italic leading-none text-[#00C565] stroke-[1px] stroke-[#00C565] bg-gradient-to-b from-[#00C565] to-[#005F31] bg-clip-text text-transparent p-[20px]">
        {number.toFixed(2)}
      </h2>
    </div>
  );
};

export default DiceRoller;
