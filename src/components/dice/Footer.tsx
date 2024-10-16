import { Link } from "react-router-dom";
import {
  ArrowUp,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../Icons";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scroll smooth
    });
  };
  return (
    <footer className="xl:pt-[217px] pt-[50px] sm:lg-[70px] dice-footer">
      <div className="container">
        <div className="flex justify-between items-center flex-col md:flex-row gap-3">
          <Link
            to=""
            className="text-white text-[24px] md:text-[36px] font-bold"
          >
            <span className="text-[#3BAA56]">TITAN</span> Games
          </Link>

          <div className="flex items-center gap-[20px]">
            <p className="text-white text-[16px] font-normal">Our Socials</p>

            <div className="flex items-center gap-[13px]">
              <Link to="/">
                <TelegramIcon />
              </Link>
              <Link to="/">
                <DiscordIcon />
              </Link>
              <Link to="/">
                <TwitterIcon />
              </Link>
              <Link to="/">
                <YoutubeIcon />
              </Link>
            </div>
          </div>
        </div>

        <div
          className="w-full h-[1px] sm:mt-[25px] mt-[15px]"
          style={{
            background:
              "linear-gradient(270deg, rgba(1, 167, 85, 0.00) 0%, #01723A 52%, rgba(0, 65, 33, 0.00) 100%)",
          }}
        ></div>

        <div className="flex justify-between flex-col-reverse sm:flex-row items-center sm:py-[26px] py-[15px] gap-3">
          <p className=" text-white sm:text-[16px] text-[14px] text-center sm:text-left sm:leading-[26px] font-medium ">
            Copyright © 2024 TITAN Games. All rights reserved.
          </p>

          <Link
            onClick={scrollToTop}
            to="/"
            className="w-[40px] h-[40px] rounded-[8px] border border-[#64E180] bg-gradient-to-r from-[#69E885] to-[#39A753] flex justify-center items-center"
          >
            <ArrowUp />
          </Link>
        </div>
      </div>
    </footer>
  );
}
