import { Button } from "@headlessui/react";
import { Link, NavLink } from "react-router-dom";
import { useAccountInfo } from "../providers/AppContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { 
  ArrowRightStartOnRectangleIcon, 
  Cog8ToothIcon, 
  CurrencyDollarIcon, 
  DocumentIcon, 
  UserCircleIcon, 
  UsersIcon, 
  WalletIcon 
} from "@heroicons/react/24/solid";
import { useState } from "react";
import millify from "millify";
import { isMobile } from 'react-device-detect';

export default function Header({ openModal }: { openModal: () => void }) {
  type NavLinkProps = {
    isActive: boolean;
  };

  const { connected } = useWallet();
  const { useUserInfo, isSign, disconnectWallet } = useAccountInfo();
  const [show, setShow] = useState(false);
  const { data: userInfo } = useUserInfo()

  const getActiveLinkClass = ({ isActive }: NavLinkProps) => (isActive ? "active" : "");

  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between py-3 md:gap-5">
        <Link to={connected && isSign ? "/discover" : "/"} className="flex items-center cursor-pointer select-none">
          <img src="/assets/icons/logo.svg" alt="logo" className="mr-1" />
          <span className="futura text-[26px]">PRIMOSOL</span>
        </Link>

        {(connected && isSign) ?
        <nav className="top-bar text-gray text-sm">
          <NavLink to="/discover" className={getActiveLinkClass}>
            New Pairs
          </NavLink>
          <NavLink to="/trending" className={getActiveLinkClass}>
            Trending
          </NavLink>
          <NavLink to="/order" className={getActiveLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/holding" className={getActiveLinkClass}>
            Holdings
          </NavLink>
          <NavLink to="/leaderboard" className={getActiveLinkClass}>
            LeaderBoard
          </NavLink>
        </nav> : null}

        <div className="flex-grow"></div>

        <div className="items-center flex gap-2">
          {(connected && isSign) ? (
            <div className="flex gap-5 items-center">
              <Link to={"/transfer_funds"} className="flex items-center gap-2">
                <WalletIcon className="size-6" />
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <img src="/assets/icons/solana.png" className="size-4" />
                    <span className="text-sm">{millify(userInfo ? userInfo?.sol_balance || 0 : 0, { precision: 4})}</span>
                  </div>
                  <span className="text-xs text-gray">SOL</span>
                </div>
              </Link>
              <div className="relative" onMouseLeave={() => {if (!isMobile) setShow(false);}}>
                <UserCircleIcon className="size-6 cursor-pointer" onMouseOver={() => setShow(true)} />
                {show && 
                <div className="popover-menu" onClick={() => setShow(false)}>
                  <Link to={"/referral"} className="flex gap-2 hover:bg-light-gray hover:bg-opacity-70 p-2 rounded-md">
                    <UsersIcon className="size-6" />
                    <span>Referral Tracking</span>
                  </Link>
                  <Link to={"/transfer_funds"} className="flex gap-2 hover:bg-light-gray hover:bg-opacity-70 p-2 rounded-md">
                    <CurrencyDollarIcon className="size-6" />
                    <span>Transfer Funds</span>
                  </Link>
                  {/* <Link to={""} className="flex gap-2 hover:bg-light-gray hover:bg-opacity-70 p-2 rounded-md">
                    <Cog8ToothIcon className="size-6" />
                    <span>Settings</span>
                  </Link> */}
                  <Link to={""} className="flex gap-2 hover:bg-light-gray hover:bg-opacity-70 p-2 rounded-md" target="_blank">
                    <DocumentIcon className="size-6" />
                    <span>Documentation</span>
                  </Link>
                  <div 
                    className="flex gap-2 hover:bg-light-gray hover:bg-opacity-70 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                      disconnectWallet();
                    }}
                  >
                    <ArrowRightStartOnRectangleIcon className="size-6" />
                    <span>Logout</span>
                  </div>
                </div>}
              </div>
            </div>
          ) : (<Button className="primary" onClick={openModal}>Connect Wallet</Button>)}
        </div>
      </div>

    </header>
  );
}
