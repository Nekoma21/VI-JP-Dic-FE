import type { FC } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import Logo from "../../assets/image/logo.svg";
import FacebookIcon from "../../assets/icon/icon-facebook.svg";
import MessengerIcon from "../../assets/icon/icon-message.svg";
import InstagramIcon from "../../assets/icon/icon-instagram.svg";
import TictokIcon from "../../assets/icon/icon-tiktok.svg";
import YoutubeIcon from "../../assets/icon/icon-youtube.svg";
import ChormeIcon from "../../assets/icon/icon-ggchorme.svg";
import SafariIcon from "../../assets/icon/icon-safari.svg";
import FireFoxIcon from "../../assets/icon/icon-firefox.svg";

const Footer: FC = () => {
  return (
    <footer className="bg-white py-6 px-6 md:px-6 rounded-2xl mr-4 ml-4 shadow-sm">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="text-primary mr-2">
                <img src={Logo} alt="Logo" className="w-22 h-22" />
              </div>
              <span
                className="text-secondary font-bold text-xl"
                style={{ color: "#343C6A" }}
              >
                KODOMO
              </span>
            </div>
            <p className="text-secondary mb-4 font-bold">
              Kodomo - Bạn đồng hành tiếng Nhật tin cậy
            </p>

            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-2 mt-0.5" />
                <span className="text-text-gray">
                  74/2 Ngô Sĩ Liên, Hòa Minh, Liên Chiểu, Đà Nẵng
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-2" />
                <a
                  href="mailto:support@kodomo.net"
                  className="text-text-gray hover:text-primary"
                >
                  support@kodomo.net
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-2" />
                <a
                  href="tel:0325006036"
                  className="text-text-gray hover:text-primary"
                >
                  0325006036
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-secondary font-medium text-lg mb-4">
              Mạng xã hội
            </h3>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={FacebookIcon} className="w-9 h-9" />
              </a>
              {/* Messenger */}
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={MessengerIcon} className="w-9 h-9" />
              </a>
              {/* Instagram */}
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={InstagramIcon} className="w-9 h-9" />
              </a>
              {/* TikTok */}
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={TictokIcon} className="w-9 h-9" />
              </a>
              {/* YouTube */}
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={YoutubeIcon} className="w-9 h-9" />
              </a>
            </div>
          </div>

          {/* App Download */}
          <div>
            <h3 className="text-secondary font-medium text-lg mb-4">
              Tải ứng dụng
            </h3>
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black h-14 rounded-xl cursor-pointer"
              >
                <div className="mr-3">
                  <svg viewBox="0 0 384 512" width="30">
                    <path
                      fill="currentColor"
                      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">
                    App Store
                  </div>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg h-14 cursor-pointer"
              >
                <div className="mr-3">
                  <svg viewBox="30 336.7 120.9 129.2" width="30">
                    <path
                      fill="#FFD400"
                      d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                    ></path>
                    <path
                      fill="#FF3333"
                      d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#48FF48"
                      d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                    ></path>
                    <path
                      fill="#3BCCFF"
                      d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="-mt-1 font-sans text-xl font-semibold">
                    Google Play
                  </div>
                </div>
              </button>
            </div>

            <h3 className="text-secondary font-medium text-lg mt-6 mb-4">
              Tiện ích
            </h3>
            <div className="flex space-x-3">
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={ChormeIcon} className="w-9 h-9" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={SafariIcon} className="w-9 h-9" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                <img src={FireFoxIcon} className="w-9 h-9" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
