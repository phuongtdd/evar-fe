import microsoft from "../../../../assets/icons/auth/login_method/microsoft.png";
import google from "../../../../assets/icons/auth/login_method/google.png";
import telegram from"../../../../assets/icons/auth/login_method/telegram.png";
interface Props{
    flag: "login" | "register";
    handleFunction: (value: string) => void;
}

const SocialLogin = ({handleFunction,flag}: Props) => {
  return (
    <>
      <div className="social-login">
        <button
          type="button"
          className="social-btn"
          onClick={() => handleFunction("Microsoft")}
          aria-label="Login with Microsoft"
        >
          <img src={microsoft} alt="Microsoft" />
        </button>
        <button
          type="button"
          className="social-btn"
          onClick={() => handleFunction("Google")}
          aria-label="Login with Google"
        >
          <img src={google} alt="Google" />
        </button>
        <button
          type="button"
          className="social-btn"
          onClick={() => handleFunction("Telegram")}
          aria-label="Login with Telegram"
        >
          <img src={telegram} alt="Telegram" />
        </button>
      </div>
    </>
  );
};

export default SocialLogin;
