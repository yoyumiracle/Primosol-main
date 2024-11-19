import { useEffect, useState } from "react";
import { Outlet, redirect, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import Loading from "../components/common/Loading";
import WalletModal from "../components/modal/WalletModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../providers/AppContext";

const PageTitleSetter = () => {
  const location = useLocation();

  const routeTitles = {
    "/": "Home",
    "/account": "Account",
    "/trade": "Trade",
    "/discover": "New Pairs",
    "/trending": "Trending",
    "/holding": "Holding",
    "/referral": "Referral",
  };

  useEffect(() => {
    const prevTitle = localStorage.getItem("title") || "PRIMOSOL";

    const pageTitle = routeTitles[location.pathname as keyof typeof routeTitles];
    const title = pageTitle ? `${pageTitle} | PRIMOSOL` : prevTitle;

    if (document.title === title) return;

    document.title = title;
    localStorage.setItem("title", title);
  }, [location]);

  return null;
};

export default function PageLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { isSign } = useAccountInfo();

  const [open, setOpen] = useState(false);

  if ((!connected || !isSign) && pathname != '/') {
    navigate('/');
  }

  return (
    <>
      <div className="px-5 md:px-12 flex flex-col h-full">
        <Loading />
        <ToastContainer
          theme="dark"
          position="top-center"
          pauseOnFocusLoss={false}
          autoClose={2000}
          hideProgressBar
          toastClassName="bg-toast"
          closeOnClick
          stacked
          className="z-[10000]"
        />

        <Header openModal={() => setOpen(true)} />
        <PageTitleSetter />
        <div className="w-full flex-grow relative">
          <Outlet />
        </div>
        <Footer />

        <WalletModal open={open} setOpen={setOpen} />
      </div>
    </>
  );
}
