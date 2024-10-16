import { useState, useRef, useEffect } from "react";
import { SettingIcon } from "../../Icons";

function SettingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [sound, setSound] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("isEnabledAnime"))
      localStorage.getItem("isEnabledAnime") === "true"
        ? setAnimation(true)
        : setAnimation(false);
    else setAnimation(false);

    if (localStorage.getItem("isEnabledSound"))
      localStorage.getItem("isEnabledSound") === "true"
        ? setSound(true)
        : setSound(false);
    else setSound(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAnimation = () => {
    setAnimation(!animation);
    localStorage.setItem("isEnabledAnime", String(!animation));
  };

  const handleSound = () => {
    setSound(!sound);
    localStorage.setItem("isEnabledSound", String(!sound));
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        <SettingIcon />
      </button>

      <div
        className={`origin-top-right absolute right-0 mt-0 w-fit min-w-[265px] shadow-lg bg-[#001009] ring-1 rounded-[16px] ring-black ring-opacity-5 transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="py-1 flex flex-col gap-2"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-[20px] pr-[24px] pl-[20px]">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end gap-[17px] items-center">
                <h4 className="text-white font-semibold tracking-[1.4px] text-[14px] whitespace-nowrap">
                  Enable Animations
                </h4>

                <button
                  onClick={handleAnimation}
                  className={`w-[48px] h-[28px] border-[4px] rounded-[28px] p-1 flex items-center transition-all duration-300 ease-linear ${
                    animation
                      ? "border-[#64E180] justify-end"
                      : "border-[#787878]"
                  }`}
                >
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-[4px] ${
                      animation ? "border-[#64E180]" : "border-[#787878]"
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex justify-end gap-[17px] items-center">
                <h4 className="text-white font-semibold tracking-[1.4px] text-[14px] whitespace-nowrap">
                  Enable Sound Effects
                </h4>

                <button
                  onClick={handleSound}
                  className={`w-[48px] h-[28px] border-[4px] rounded-[28px] p-1 flex items-center transition-all duration-300 ease-linear ${
                    sound ? "border-[#64E180] justify-end" : "border-[#787878]"
                  }`}
                >
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-[4px] ${
                      sound ? "border-[#64E180]" : "border-[#787878]"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingPopup;
