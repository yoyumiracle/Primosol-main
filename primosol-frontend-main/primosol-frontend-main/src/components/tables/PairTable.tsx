import { Button } from "@headlessui/react";
import { IPairInfo } from "../../types";
import { copyToClipboard, shortenAddress } from "../../libs/utils";
import { ClipboardDocumentIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { PAIR_INFOS } from "../../data";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";

export default function PairTable() {

  const onQuickBuy = (pair: IPairInfo) => {
    console.log(pair);

  }

  const handleCopyTokenAddress = (e: any) => {
    copyToClipboard('PRIMOSOL', () => {
      toast.success('Successfuly copied');
    });
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="pairTable flex flex-col w-full min-w-max">
      <div className="header row">
        <div className="w-0"></div>
        <div className="pl-4">Pair Info</div>
        <div className="w-20">Created</div>
        <div>Liquidity</div>
        <div>Initial Liquidity</div>
        <div>MKT CAP</div>
        <div>TXNS</div>
        <div>Volume</div>
        {/* <div>Buy/Sell Tax</div> */}
        <div>Audit Results</div>
        <div className="text-center">Action</div>
      </div>
      <div className="body flex flex-col gap-1">
        {/* <div className="row h-16">
          <div></div>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
          <Skeleton className="h-12 w-full"/>
        </div> */}
        {PAIR_INFOS.map((pair: IPairInfo) => {
          return (
            <Link to={`/pair/${pair.poolAddress}`} className="row" key={pair.id}>
              <div className="h-16"></div>
              <div className="flex items-center gap-2">
                <img src="/assets/icons/solana.png" className="w-8 h-8" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">$PRIMOSOL<span className="text-gray"> / SOL</span></span>
                  <div className="flex items-center text-xs text-gray">
                    <span>{shortenAddress(pair.tokenInfo.address)}</span>
                    <ClipboardDocumentIcon className="size-3 cursor-pointer" onClick={handleCopyTokenAddress} />
                  </div>
                  <div className="flex gap-1 pt-1 items-center">
                    <Link to="">
                      <img src="/assets/icons/website.svg" className="w-3" />
                    </Link>
                    <Link to="">
                      <img src="/assets/icons/twitter.svg" className="w-3" />
                    </Link>
                    <Link to="">
                      <img src="/assets/icons/telegram.svg" className="w-3" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                <span className="text-sm">9m</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <img src="/assets/icons/solana.png" className="size-4" />
                  <span className="text-sm">1.1B</span>
                  <span className="text-sm"> / $171B</span>
                </div>
                <span className="text-primary text-xs">+ 123%</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/assets/icons/solana.png" className="size-4" />
                <span className="text-sm">60</span>
                <span className="text-sm"> / $9.5K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">$159.01B</span>
                <span className="text-xs text-gray">$159.0142</span>
              </div>
              <div>-</div>
              <div>-</div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  {pair.audit.mintAuth ? (<>
                    <XCircleIcon className="size-4 text-red" />
                    <span className="text-xs text-gray">Mint Auth Enabled</span>
                  </>) : (<>
                    <CheckCircleIcon className="size-4 text-primary" />
                    <span className="text-xs">Mint Auth Disabled</span>
                  </>)}
                </div>
                <div className="flex flex-col gap-1">
                  {pair.audit.freezeAuth ? (<>
                    <XCircleIcon className="size-4 text-red" />
                    <span className="text-xs text-gray">Freeze Auth Enabled</span>
                  </>) : (<>
                    <CheckCircleIcon className="size-4 text-primary" />
                    <span className="text-xs">Freeze Auth Disabled</span>
                  </>)}
                </div>
                <div className="flex flex-col gap-1">
                  {pair.audit.lpBurned ? (<>
                    <CheckCircleIcon className="size-4 text-primary" />
                    <span className="text-xs">LP Burned</span>
                  </>) : (<>
                    <XCircleIcon className="size-4 text-red" />
                    <span className="text-xs text-gray">LP Burned</span>
                  </>)}
                </div>
                <div className="flex flex-col gap-1">
                  {pair.audit.top10Holders ? (<>
                    <CheckCircleIcon className="size-4 text-primary" />
                    <span className="text-xs">Top 10 Holders</span>
                  </>) : (<>
                    <XCircleIcon className="size-4 text-red" />
                    <span className="text-xs text-gray">Top 10 Holders</span>
                  </>)}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button className="primary" onClick={(e: any) => {
                  onQuickBuy(pair);
                  e.preventDefault();
                  e.stopPropagation();
                }}> Buy </Button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
