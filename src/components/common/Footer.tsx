export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div
          className="w-full h-[1px] "
          style={{
            background:
              "linear-gradient(270deg, rgba(1, 167, 85, 0.00) 0%, #01723A 52%, rgba(0, 65, 33, 0.00) 100%)",
          }}
        ></div>
        <p className="text-center text-white text-[14px] sm:text-[16px] sm:leading-[26px] font-medium md:py-[26px] py-[15px]">
          Copyright © 2024 TITAN Games. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
