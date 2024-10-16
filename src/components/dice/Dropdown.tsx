import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  setNumberOfData: (num: number) => void;
  numberOfData: number;
}

export default function Dropdown({
  setNumberOfData,
  numberOfData,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdown = (num: number) => {
    setNumberOfData(num);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center text-[16px] font-semibold text-white px-4 py-[14px] text-sm bg-[#071913] w-[78px] rounded-[8px]"
      >
        {numberOfData}
        <svg
          className={`ml-2 h-5 w-5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`origin-top-right absolute right-0 mt-2 w-[78px] rounded-md shadow-lg bg-[#071913] ring-1 ring-black ring-opacity-5 transition-opacity duration-200 ${
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
          {[10, 15, 20, 50].map((dt, i) => (
            <div
              key={i}
              className="text-center cursor-pointer text-white"
              onClick={() => handleDropdown(dt)}
            >
              {dt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
