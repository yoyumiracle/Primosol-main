import { ClipboardDocumentIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { IHoldingToken } from "../../interface";
import millify from "millify";
import Skeleton from "react-loading-skeleton";

interface HoldingProps {
  data: IHoldingToken[] | null | undefined
  isFetching: boolean
};

export default function HoldingTable(props: HoldingProps) {

  const HoldingSkeletonRow = () => {
    return (
      <div className="row px-4 md:px-6 py-2 md:py-4 gap-4">
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <div></div>
      </div>
    )
  }

  return (
    <div className="holdingTable flex flex-col w-full min-w-max">
      <div className="row text-gray px-4 md:px-6 py-2 border-b border-light-gray">
        <div>Token</div>
        <div>Invested</div>
        <div>Remaining</div>
        <div>Sold</div>
        <div>Change in P&L</div>
        <div></div>
      </div>
      <div className="body flex flex-col gap-1">
        {props.isFetching ? (
          <>
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
            <HoldingSkeletonRow />
          </>
        ) : props.data?.map((item) => (
          <>
            <div className="row px-4 md:px-6 py-2 md:py-4">
              <div className="flex items-center gap-2">
                <Link to="#" className="text-primary">{item.symbol}</Link>
                <ClipboardDocumentIcon className="size-4 text-gray cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                <img src="/assets/icons/solana.png" className="size-5" />
                <span>{item.invest}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src={item.logo} className="size-5" />
                  <span>{millify(item.remain, { precision: 3 })}</span>
                </div>
                <span className="text-sm text-gray">0</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>{millify(item.sold, { precision: 3 })}</span>
                </div>
                <span className="text-sm text-gray">1M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-red">{millify(item.pnl)}%</span>
                <span className="text-red text-sm">{millify(item.sold - item.invest, { precision: 3 })}</span>
              </div>
              <div className="grid grid-cols-2 items-center text-gray">
                <span>Sold</span>
                <div className="flex justify-end">
                  <EyeIcon className="size-4" />
                </div>
                {/* <EyeSlashIcon className="size-4" /> */}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
