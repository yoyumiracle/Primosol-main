import { ArrowTopRightOnSquareIcon, ClipboardDocumentIcon, EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/solid";
import millify from "millify";
import { Link } from "react-router-dom";
import { ILimitOrder } from "../../interface";
import { removeLimitOrder } from "../../libs/fetches";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

interface OrderTableProps {
  data: any[] | null | undefined,
  refetch: Function,
  isFetching: boolean,
};

export default function OrderTable(props: OrderTableProps) {
  const getStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'Pending'
      case 1:
        return 'Failed'
      case 2:
        return 'Success'
    }
  }
  const getCondition = (item: any) => {
    if (item.order_type === 0) { //buy
      return 'Buy Dip'
    } else {
      if (item.type === 0) {//TP
        return `Take profit >= ${millify(Math.abs(item.target_price - item.created_price) / item.created_price * 100)}%`
      } else {
        return `Stop loss <= ${millify(Math.abs(item.created_price - item.target_price) / item.created_price * 100)}%`
      }
    }
  }

  const handleRemove = async (item: any) => {
    let ret = await removeLimitOrder(item.order_id)
    if (ret) {
      toast.success("Order removed successfully")
      props.refetch()
    } else {
      toast.error("Order remove failed")
    }
  }

  const OrderSkeletonRow = () => {
    return (
      <div className="row px-4 md:px-6 py-2 md:py-4 gap-4">
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
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
    <div className="orderTable flex flex-col w-full min-w-max">
      <div className="row text-gray px-4 md:px-6 py-4 border-b border-light-gray">
        <div></div>
        <div>Token</div>
        <div>Amount</div>
        <div>Condition</div>
        <div>Created When</div>
        <div>Target Price</div>
        <div>Triggered At</div>
        <div>Status</div>
        <div>Sllipage</div>
        <div>Priority</div>
        <div>Created</div>
        <div></div>
      </div>
      <div className="body flex flex-col gap-1">
        {props.isFetching ? (
          <>
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
            <OrderSkeletonRow />
          </>
        ) : 
          props.data?.map(item => (
            <div className="row px-4 md:px-6 py-2 md:py-4">
              <div className="flex items-center">
                <TrashIcon className="w-5 h-5 text-gray cursor-pointer" onClick={() => handleRemove(item)}/>
              </div>
              <div className="flex items-center gap-2">
                <Link to="#" className="text-primary">{item.symbol}</Link>
                <ClipboardDocumentIcon className="size-4 text-gray cursor-pointer" />
              </div>
              <div className="flex items-center gap-2">
                {item.order_type === 0 ? (
                  <img src="/assets/icons/solana.png" className="size-5" />
                ) : (
                  <img src={item.logo} className="size-5 rounded-md" />
                )}
                <span>{item.amount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray">{getCondition(item)}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>${millify(item.created_price, { precision: 6 })}</span>
                </div>
                <span className="text-sm text-gray">MC ${millify(item.created_mcap)}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <img src="/assets/icons/solana.png" className="size-5" />
                  <span>${millify(item.target_price, { precision: 6 })}</span>
                </div>
                <span className="text-sm text-gray">MC ${millify(item.target_mcap)}</span>
              </div>
              <div className="flex flex-col">
                {
                  item.triggeredAt ? `$${millify(item.triggeredAt, { precision: 6 })}` : 'N/A'
                }
              </div>
              <div className="flex flex-col">
                <span className="text-green">{getStatus(item.status)}</span>
              </div>
              <div className="flex flex-col">
                {item.slippage}%
              </div>
              <div className="flex flex-col">
                {item.trxPriority}
              </div>
              <div className="flex flex-col">
                {new Date(item.timeStamp).toLocaleString()}
              </div>
              <div className="flex flex-col">
                {item.trxId && <a href={`https://solscan.io/tx/` + item.trxId} target='_blank' className='flex gap-2 items-center md:hover:text-blue'>
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray" />
                </a>}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
