import { useNavigate } from 'react-router-dom';
import { Button } from "@headlessui/react";
import TrendTokens from "./TrendTokens";
import Card from "../../components/common/Card";
import CheckBox from "../../components/common/CheckBox";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../../providers/AppContext";

export default function Home() {
  const { connected } = useWallet();
  const { isSign } = useAccountInfo();
  const navigate = useNavigate();

  if (connected && isSign) {
    navigate('/discover');
  }
  
  return (
    <div className="home__page w-full my-14 md:my-44 ">
      <div className="flex flex-col md:flex-row relative z-10 justify-between md:px-8 w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-5">
          <div className="text-4xl md:text-7xl font-bold">Swap Tokens</div>
          <div className="text-primary text-4xl md:text-7xl font-bold">Faster Than Ever</div>
          <div className="text-2xl md:text-3xl font-medium">Explore, Track, Swap</div>
          <div className="text-lg">
            <Button className="primary">Connect Wallet</Button>
          </div>
        </div>
        <div className="mt-10 md:mt-0">
          <TrendTokens />
        </div>
      </div>

      <Card className="hidden md:flex flex-col items-center w-full p-24 relative z-10 min-h-[500px] my-14 md:my-44 gap-2 max-w-[1440px] mx-auto rounded-3xl">
        <span className="text-5xl font-semibold">Wallets We Support</span>
        <span className="text-2xl font-medium">Trade with world’s most trusted and fastest wallets</span>
        <div className="grid grid-flow-col auto-cols-max justify-between py-12 w-full mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="wallet-icon">
              <img src="/assets/icons/phantom.png" />
            </div>
            <span className="text-xs">Phantom</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="wallet-icon">
              <img src="/assets/icons/ledger.png" />
            </div>
            <span className="text-xs">Ledger</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="wallet-icon">
              <img src="/assets/icons/coin98.png" />
            </div>
            <span className="text-xs">Coin98</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="wallet-icon">
              <img src="/assets/icons/sky.png" />
            </div>
            <span className="text-xs">Sky</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="wallet-icon">
              <img src="/assets/icons/neko.png" />
            </div>
            <span className="text-xs">Neko</span>
          </div>
        </div>
        <CheckBox>
          <div>By connecting, I agree to the <span className="text-primary">Terms & Privacy</span></div>
        </CheckBox>
      </Card>

      <div className="w-full relative z-10 text-4xl md:text-7xl font-bold gap-2 flex flex-col items-center md:inline-block text-center my-5">
        Developed by
        <span className="text-primary"> Trading Experts </span>
      </div>
 
      <div className="flex flex-col relative z-10 gap-16 md:gap-32 items-center">
        <div className="grid md:grid-cols-[1fr_320px] gap-6 md:flex-row relative z-10">
          <img src="/assets/images/pairs.png" alt="pairs" />
          <div className="flex flex-col min-w-[320px] text-center md:text-left justify-center gap-2">
            <span className="font-bold text-2xl md:text-4xl">Explore</span>
            <p className="text-sm md:text-xl text-[#CFCFCF]">Dive into a sea of tokens and customize your search to fit your needs.</p>
          </div>
        </div>

        <hr className="text-light-gray mx-auto w-1/2" />
        
        <div className="grid md:grid-cols-[320px_1fr] gap-6 md:flex-row relative z-10">
          <div className="flex flex-col min-w-[320px] text-center md:text-left justify-center gap-2">
            <span className="font-bold text-2xl md:text-4xl">Track</span>
            <p className="text-sm md:text-xl text-[#CFCFCF]">Access real-time data and effortlessly track your portfolio.</p>
          </div>
          <img src="/assets/images/track.png" alt="pairs" />
        </div>

        <hr className="text-light-gray mx-auto w-1/2" />
        
        <div className="grid md:grid-cols-[1fr_320px] gap-6 md:flex-row relative z-10">
          <img src="/assets/images/swap.png" alt="pairs" />
          <div className="flex flex-col min-w-[320px] text-center md:text-left justify-center gap-2">
            <span className="font-bold text-2xl md:text-4xl">Swap</span>
            <p className="text-sm md:text-xl text-[#CFCFCF]">Trade on PrimoSol with unparalleled speed, maximizing every opportunity.</p>
          </div>
        </div>

        <hr className="text-light-gray mx-auto w-1/2" />
        
        <div className="grid md:grid-cols-2 gap-20 md:flex-row relative z-10">
          <div className="flex w-full justify-end">
            <TrendTokens />
          </div>
          <div className="flex flex-col gap-8">
            <div className="text-4xl md:text-7xl font-bold flex flex-col">Ready to <span className="text-primary">Start Trading?</span></div>
            <div>
              <Button className="primary">Connect Wallet</Button>
            </div>
            <div className="flex">
              <CheckBox>
                <div>By connecting, I agree to the <span className="text-primary">Terms & Privacy</span></div>
              </CheckBox>
            </div>
          </div>
        </div>
      </div>

      <div className="background">
        <div className="desktop-bg"></div>
      </div>
    </div>
  );
}
