import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "react-router-dom";

export default function Header() {
  // const [isOpen, setIsOpen] = useState(false);

  // const [connect, setConnect] = useState(false);

  return (
    <header className="xl:py-[47px] py-[20px] ">
      <div className="container">
        <div className=" flex justify-between">
          <Link to="/">
            <img
              className="lg:w-[260px] sm:w-[180px]  w-[150px]"
              src="assets/images/logo.svg"
              alt=""
            />
          </Link>
          <nav className="hidden lg:flex xl:gap-[60px] gap-[30px] items-center ">
            {navItems.map((ni, i) => (
              <Link
                key={i}
                className="text-white text-[18px] font-semibold tracking-[1.8px] hover:text-white/80"
                to={ni.to}
              >
                {ni.title}
              </Link>
            ))}
          </nav>

          {/* <w3m-button /> */}
          <ConnectButton />
          {/* <button
            onClick={() => setConnect(!connect)}
            style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.50)" }}
            className="hidden lg:block    bg-gradient-to-t hover:from-[#69E885] hover:to-[#39A753]  border border-[#64E180] font-semibold text-[16px] py-[10px] px-[21px]  rounded-[8px] text-[#42B35D] transition-all duration-100 ease-linear hover:border-[#64E180] from-[#fff]/0 to-[#fff]/0  hover:text-[#001009]"
          >
            {connect ? "0x45g....n57Kr" : "Connect Wallet"}
          </button>
          <div className="lg:hidden">
            <div className="lg:hidden" onClick={() => setIsOpen(true)}>
              <img src="assets/images/menu.svg" className="w-[28px]" alt="" />
            </div>

            <MobileMenu
              connect={connect}
              navItems={navItems}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              setConnect={setConnect}
            />
          </div> */}
        </div>
      </div>
    </header>
  );
}

const navItems = [
  {
    title: "DICE",
    to: "/",
  },
  {
    title: "STAKE",
    to: "/stake",
  },
  {
    title: "BURN",
    to: "/burn",
  },
];

// const MobileMenu = ({ setIsOpen, isOpen, connect, setConnect }) => {
//   const toggleDrawer = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleConnect = () => {
//     setIsOpen(false);
//     setConnect(!connect);
//   };
//   return (
//     <div className="lg:hidden">
//       <div
//         className={`fixed top-0 right-0 z-[10002] h-full w-64   p-6  transform transition-transform duration-300 ease-in-out bg-[#071913]  ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <button
//           onClick={() => setIsOpen(false)}
//           className="flex justify-end w-full "
//         >
//           <img src="assets/images/close.svg" className="w-[28px]" alt="" />
//         </button>
//         <div className="flex items-center flex-col gap-[24px]">
//           <nav className="flex items-center flex-col gap-[29.41px]">
//             {navItems.map((ni, i) => (
//               <Link
//                 key={i}
//                 className="text-white text-[18px] font-semibold tracking-[1.8px]"
//                 to={ni.to}
//                 onClick={() => setIsOpen(false)}
//               >
//                 {ni.title}
//               </Link>
//             ))}

//             <button
//               onClick={handleConnect}
//               style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.50)" }}
//               className="  p-[18px]  bg-gradient-to-t hover:from-[#69E885] hover:to-[#39A753]  border border-[#64E180] font-semibold text-[16px] py-[10px] px-[20px] rounded-[8px] text-[#42B35D] transition-all duration-100 ease-linear hover:border-[#64E180] from-[#fff]/0 to-[#fff]/0  hover:text-[#001009]"
//             >
//               {connect ? "0x45g....n57Kr" : "Connect Wallet"}
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Background overlay when drawer is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 backdrop-blur-[5px]  z-[1001]"
//           onClick={toggleDrawer}
//         ></div>
//       )}
//     </div>
//   );
// };
