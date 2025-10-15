import { Button } from "antd";
import React from "react";
import Link from "antd/es/typography/Link";
const NotFound = () => {
  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
  };
  const redirectLink = isLoggedIn() ? "/" : "/auth/login";
  const redirectText = isLoggedIn() ? "Về trang chủ" : "Tới trang đăng nhập";

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className="bg-white font-arvo"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-9xl font-semibold text-black ">404</h1>
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            Không tìm thấy trang
          </h3>
          <p className="mb-6">
            Trang mà bạn muốn tìm kiếm hiện không khả dụng !
          </p>
          <Link
            href={redirectLink}
            className="inline-block bg-[#406AB9] font-semibold mt-5 px-4 py-3 rounded-2xl border border-[#406AB9] hover:bg-blue-700 transition-colors"
          >
           {redirectText}
          </Link>
        </div>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Animated Illustration"
          className="bg-center bg-no-repeat bg-cover flex items-center justify-center"
        />
      </div>
    </>
  );
};

export default NotFound;
