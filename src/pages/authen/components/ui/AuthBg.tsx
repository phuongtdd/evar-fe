import React from "react";

import auth_img1 from "../../../../assets/icons/auth/auth_img1.png";
import auth_img2 from "../../../../assets/icons/auth/auth_img2.png";
import auth_img3 from "../../../../assets/icons/auth/auth_img3.png";
import auth_img4 from "../../../../assets/icons/auth/auth_img4.svg";
const AuthBg = () => {
  return (
    <>
      <div className="decorative-element rocket-1" aria-hidden="true">
        <img
          src={auth_img3}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="decorative-element globe" aria-hidden="true">
        <img
          src={auth_img1}
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="decorative-element candy" aria-hidden="true">
        <img
          src="/3d-graduation-cap-wrapped-blue-orange.png"
          alt=""
          aria-hidden="true"
        />
      </div>
      <div className="decorative-element cards" aria-hidden="true">
        <img src={auth_img2} alt="" aria-hidden="true" />
      </div>
      <div className="decorative-element rocket-2" aria-hidden="true">
        <img src={auth_img4} alt="" aria-hidden="true" />
      </div>
    </>
  );
};

export default AuthBg;
