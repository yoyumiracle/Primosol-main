import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import DataSecurity from "./DataSecurity";
import PoolInfo from "./PoolInfo";
import PoolStatus from "./PoolStatus";
import SwapToken from "./SwapToken";
import { TRENDING_PAIRS } from "../../data";
import { IPairInfo } from '../../types/index';
import { useTokenData } from "../../providers/TokenData";
import { useWebsocket } from "../../providers/WebsocketProvider";
import { ALLOWED_RESOLUTIONS } from "../../helpers/chartingDatafeed";
import { TVChart } from "../../components/common/TVChart";
import TradeList from "../../components/tokendetail/trading/TradeList";
import { copyToClipboard } from "../../libs/utils";
import { IChartingLibraryWidget } from "../../../dist/tradingview/charting_library/charting_library";
import { useAccountInfo } from "../../providers/AppContext";
import { removeLimitOrder, updateLimitOrder } from "../../libs/fetches";
import { ILimitOrder } from "../../interface";

export default function Pair() {
  const { pathname } = useLocation();
  const { usePoolDetail } = useTokenData();
  const queryClient = useQueryClient();
  const { ws_pool } = useWebsocket();
  const { useInfiniteOrdersHistory } = useAccountInfo();
  const { data: orders } = useInfiniteOrdersHistory(20, {
    active: true,
    success: false,
    failed: false,
    buyDip: true,
    stopLoss: true,
    takeProfit: true,
  });

  const poolAddress = 'FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo'

  const { data: poolInfo } = usePoolDetail(poolAddress);

  const [price, setPrice] = useState<number | undefined>();
  const [widget, setWidget] = useState<IChartingLibraryWidget | undefined>();

  useEffect(() => {
    if (!ws_pool) return;

    ws_pool.sendMessage('subscribe',
      {
        type: 'PRICE_REALTIME',
        data: {
          type: ALLOWED_RESOLUTIONS['1'],
          address: poolAddress,
          address_type: 'pair'
        },
      });

    const listenerId = ws_pool?.registerListener('PRICE_REALTIME_DATA', data => {
      if (data.type === 'PRICE_REALTIME_DATA') {
        if (data.address === poolAddress) {
          queryClient.setQueryData(['TOKEN_PRICE', poolAddress], data.data);
          setPrice(data.data);
        }
      }
    });

    return () => ws_pool?.removeListener(listenerId);
  }, [ws_pool, queryClient, poolAddress]);

  const handleCopyTokenAddress = () => {
    if (poolInfo) {
      copyToClipboard(poolInfo.baseMint, () => {
        toast.success('Successfuly copied');
      });
    }
  }

  const handleCopyPoolAddress = () => {
    if (poolInfo) {
      copyToClipboard(poolInfo.poolAddress, () => {
        toast.success('Successfuly copied');
      });
    }
  }

  const addTPLine = (order: ILimitOrder) => {
    if (!widget || !widget.chart()) return;
    console.log("addTPLine", order)
    const lineAdapter = widget?.chart()?.createOrderLine()
      .setTooltip("Take Profit")
      .setModifyTooltip("Modify order")
      .setCancelTooltip("Cancel order")
      .onMove(() => {
        const newPrice = lineAdapter.getPrice();
        updateLimitOrder({
          ...order,
          target_price: newPrice,
        }).then(data => {
          console.log(data);
          toast.success("Order updated successfully!");
        })
      })
      .onModify("onModify called", (text: string) => {
        console.log(text);
      })
      .onCancel("onCancel called", (text: string) => {
        console.log(text);
        lineAdapter.remove();
        if (order.order_id) {
          removeLimitOrder(order.order_id)
            .then(data => {
              console.log(data);
              toast.success("Order canceled successfully!");
            })
        }
      })
      .setText("Take Profit")
      .setQuantity(`${order.amount}`)
      .setPrice(order.target_price || 0)
      .setExtendLeft(false)
	    .setLineStyle(1)
	    .setLineLength(50)
      .setLineColor('#31F79B')
      .setBodyTextColor('#31F79B')
      .setBodyBorderColor('#31F79B')
      .setBodyBackgroundColor('#00000000')
      .setQuantityTextColor('#31F79B')
      .setQuantityBorderColor('#31F79B')
      .setQuantityBackgroundColor('#00000000')
      .setCancelButtonBorderColor('#31F79B')
      .setCancelButtonIconColor('#31F79B')
      .setCancelButtonBackgroundColor('#00000000')
  }

  const addSLLine = (order: ILimitOrder) => {
    if (!widget || !widget.chart()) return;
    console.log("addSLLine", order)
    const lineAdapter = widget?.chart()?.createOrderLine()
      .setTooltip("Stop Loss")
      .setModifyTooltip("Modify order")
      .setCancelTooltip("Cancel order")
      .onMove(() => {
        const newPrice = lineAdapter.getPrice();
        updateLimitOrder({
          ...order,
          target_price: newPrice,
        }).then(data => {
          console.log(data);
          toast.success("Order updated successfully!");
        })
      })
      .onModify("onModify called", (text: string) => {
        console.log(text);
      })
      .onCancel("onCancel called", (text: string) => {
        console.log(text);
        lineAdapter.remove();
        if (order.order_id) {
          removeLimitOrder(order.order_id)
            .then(data => {
              console.log(data);
              toast.success("Order canceled successfully!");
            })
          }
      })
      .setText("Stop Loss")
      .setQuantity(`${order.amount}`)
      .setPrice(order.target_price || 0)
      .setExtendLeft(false)
	    .setLineStyle(1)
	    .setLineLength(50)
      .setLineColor('#F6475D')
      .setBodyTextColor('#F6475D')
      .setBodyBorderColor('#F6475D')
      .setBodyBackgroundColor('#00000000')
      .setQuantityTextColor('#F6475D')
      .setQuantityBorderColor('#F6475D')
      .setQuantityBackgroundColor('#00000000')
      .setCancelButtonBorderColor('#F6475D')
      .setCancelButtonIconColor('#F6475D')
      .setCancelButtonBackgroundColor('#00000000')
  }

  useEffect(() => {
    if (!orders || !widget) return;
    setTimeout(() => {
      orders.pages[0]?.items.map(item => {
        if (item.status === 0) {
          if (item.order_type === 1 && item.type === 0) {
            addTPLine(item);
          } else if (item.order_type === 1 && item.type === 1) {
            addSLLine(item);
          }
        }
      })
    }, 3000)
  }, [orders, widget])

  return (
    <div className="flex flex-col -mx-5 md:-mx-12 border-collapse">
      <div className="marquee-container flex h-6 border w-full border-light-gray gap-5 overflow-x-hidden relative">
        <div className="marquee-bar flex gap-3 text-sm whitespace-nowrap animate-marquee hover:animation-paused px-3">
        {TRENDING_PAIRS.map((trend: IPairInfo) => (
          <div className="flex gap-2" key={trend.id}>
            <span>{trend.tokenInfo.symbol}</span>
            <span className="text-primary">{trend.tokenInfo.priceChange}</span>
            <span className="text-gray">${trend.tokenInfo.price}</span>
          </div>
        ))}
        </div>
        <div className="marquee-bar flex gap-3 text-sm whitespace-nowrap animate-marquee2 absolute top-0 px-3">
        {TRENDING_PAIRS.map((trend: IPairInfo) => (
          <div className="flex gap-2" key={trend.id}>
            <span>{trend.tokenInfo.symbol}</span>
            <span className="text-primary">{trend.tokenInfo.priceChange}</span>
            <span className="text-gray">${trend.tokenInfo.price}</span>
          </div>
        ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[1fr_400px] border-collapse">
        <div className="flex flex-col">
          <div className="flex flex-col w-full border-b border-light-gray">
            <div className="flex gap-5 items-center px-4 py-2 border-b border-light-gray">
              <div className="flex gap-2 items-center">
                {poolInfo?.baseImage && <img className="size-6 rounded-full" src={poolInfo?.baseImage} alt="logo" />}
                <span className="text-xl font-bold">{poolInfo?.baseName}</span>
              </div>
              <div className="flex gap-2 text-sm font-sm text-gray items-end">
                <div className="flex gap-1 items-center hover:text-soft-white cursor-pointer" onClick={handleCopyTokenAddress}>
                  <span>Token</span>
                  <ClipboardDocumentIcon className="size-4" />
                </div>
                <span className="text-gray">|</span>
                <div className="flex gap-1 items-center hover:text-soft-white cursor-pointer" onClick={handleCopyPoolAddress}>
                  <span>Pair</span>
                  <ClipboardDocumentIcon className="size-4" />
                </div>
              </div>
            </div>
            {poolInfo ? <TVChart widget={widget} setWidget={setWidget} data={poolInfo} /> : <Skeleton className="min-h-[500px] w-full" />}
          </div>
          <div className="w-full min-h-[300px] flex-grow border-b md:border-none border-light-gray">
            {poolInfo ? <TradeList poolInfo={poolInfo} poolAddress={poolInfo.poolAddress} /> : <Skeleton className="min-h-[300px] w-full" /> }
          </div>
        </div>
        <div className="flex flex-col border-l border-light-gray">
          <div className="flex flex-col border-b border-light-gray">
            <SwapToken poolInfo={poolInfo} addTPLine={addTPLine} addSLLine={addSLLine} />
          </div>
          <div className="flex flex-col border-b border-light-gray">
            <DataSecurity poolInfo={poolInfo} />
          </div>
          <div className="flex flex-col border-b border-light-gray bg-background">
            <PoolInfo 
              poolInfo={poolInfo ? {
                ...poolInfo,
                price: price || poolInfo.price,
              } : undefined} 
              onCopy={handleCopyTokenAddress} 
            />
          </div>
          <div className="flex flex-col bg-background">
            <PoolStatus poolInfo={poolInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
