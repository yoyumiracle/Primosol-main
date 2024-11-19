import { useEffect, useRef, useState } from "react";
import { IPoolOverview } from "../../interface";
import { formatPercent } from '../../libs/utils';
import millify from 'millify';

type Props = {
  poolInfo?: IPoolOverview;
};

export default function PoolStatus(props: Props) {
  const TYPE_5M = 0;
  const TYPE_1H = 1;
  const TYPE_6H = 2;
  const TYPE_24H = 3;
  const TYPE_LABEL = [
    '5M',
    '1H',
    '6H',
    '24H',
  ]

  const [type, setType] = useState(TYPE_5M);

  const txnsRef = useRef(null);
  const volumeRef = useRef(null);
  const makerRef = useRef(null);

  const getTotalTxns = () => {
    if (type === TYPE_5M) return props.poolInfo?.trade5m;
    if (type === TYPE_1H) return props.poolInfo?.trade1h;
    if (type === TYPE_6H) return props.poolInfo?.trade6h;
    if (type === TYPE_24H) return props.poolInfo?.trade24h;
    return '-'
  }

  const getBuyTxns = () => {
    if (type === TYPE_5M) return props.poolInfo?.buy5m;
    if (type === TYPE_1H) return props.poolInfo?.buy1h;
    if (type === TYPE_6H) return props.poolInfo?.buy6h;
    if (type === TYPE_24H) return props.poolInfo?.buy24h;
    return '-'
  }

  const getSellTxns = () => {
    if (type === TYPE_5M) return props.poolInfo?.sell5m;
    if (type === TYPE_1H) return props.poolInfo?.sell1h;
    if (type === TYPE_6H) return props.poolInfo?.sell6h;
    if (type === TYPE_24H) return props.poolInfo?.sell24h;
    return '-'
  }

  const getSellTxnsPercent = () => {
    const sellTxns = Number(getSellTxns());
    const buyTxns = Number(getBuyTxns());
    if (!sellTxns) return 0;
    return Math.floor(sellTxns * 100 / (sellTxns + buyTxns));
  }

  const getTotalVolume = () => {
    if (type === TYPE_5M) return props.poolInfo?.v5m;
    if (type === TYPE_1H) return props.poolInfo?.v1h;
    if (type === TYPE_6H) return props.poolInfo?.v6h;
    if (type === TYPE_24H) return props.poolInfo?.v24h;
    return '-'
  }

  const getBuyVolume = () => {
    if (type === TYPE_5M) return props.poolInfo?.vBuy5m;
    if (type === TYPE_1H) return props.poolInfo?.vBuy1h;
    if (type === TYPE_6H) return props.poolInfo?.vBuy6h;
    if (type === TYPE_24H) return props.poolInfo?.vBuy24h;
    return '-'
  }

  const getSellVolume = () => {
    if (type === TYPE_5M) return props.poolInfo?.vSell5m;
    if (type === TYPE_1H) return props.poolInfo?.vSell1h;
    if (type === TYPE_6H) return props.poolInfo?.vSell6h;
    if (type === TYPE_24H) return props.poolInfo?.vSell24h;
    return '-'
  }

  const getSellVolumePercent = () => {
    const sellVolume = Number(getSellVolume());
    const buyVolume = Number(getBuyVolume());
    if (!sellVolume) return 0;
    return Math.floor(sellVolume * 100 / (sellVolume + buyVolume));
  }

  const getTotalMaker = () => {
    if (type === TYPE_5M) return props.poolInfo?.uniqueWallet5m;
    if (type === TYPE_1H) return props.poolInfo?.uniqueWallet1h;
    if (type === TYPE_6H) return props.poolInfo?.uniqueWallet6h;
    if (type === TYPE_24H) return props.poolInfo?.uniqueWallet24h;
    return '-'
  }

  const getBuyMaker = () => {
    if (type === TYPE_5M) return props.poolInfo?.buyUniqueWallet5m;
    if (type === TYPE_1H) return props.poolInfo?.buyUniqueWallet1h;
    if (type === TYPE_6H) return props.poolInfo?.buyUniqueWallet6h;
    if (type === TYPE_24H) return props.poolInfo?.buyUniqueWallet24h;
    return '-'
  }

  const getSellMaker = () => {
    if (type === TYPE_5M) return props.poolInfo?.sellUniqueWallet5m;
    if (type === TYPE_1H) return props.poolInfo?.sellUniqueWallet1h;
    if (type === TYPE_6H) return props.poolInfo?.sellUniqueWallet6h;
    if (type === TYPE_24H) return props.poolInfo?.sellUniqueWallet24h;
    return '-'
  }

  const getSellMakerPercent = () => {
    const sellMaker = Number(getSellMaker());
    const buyMaker = Number(getBuyMaker());
    if (!sellMaker) return 0;
    return Math.floor(sellMaker * 100 / (sellMaker + buyMaker));
  }

  const PoolStatusItem = ({ _type }: { _type: number }) => {
    const percent =
      _type === TYPE_5M ? formatPercent(props?.poolInfo?.priceChange5mPercent) :
        _type === TYPE_1H ? formatPercent(props?.poolInfo?.priceChange1hPercent) :
          _type === TYPE_6H ? formatPercent(props?.poolInfo?.priceChange6hPercent) :
            _type === TYPE_24H ? formatPercent(props?.poolInfo?.priceChange24hPercent) : 'N/A';

    return (
      <div
        className={"flex flex-col items-center justify-center p-4 border-r border-light-gray cursor-pointer " + (type === _type ? 'bg-mid-gray' : '')}
        onClick={() => setType(_type)}
      >
        <span className="text-xs text-gray">{TYPE_LABEL[_type]}</span>
        <span className="text-sm">{percent}</span>
      </div>
    )
  }

  useEffect(() => {
    if (txnsRef && txnsRef.current) {
      (txnsRef.current as any).style.width = `${getSellTxnsPercent()}%`;
    }
    if (volumeRef && volumeRef.current) {
      (volumeRef.current as any).style.width = `${getSellVolumePercent()}%`;
    }
    if (makerRef && makerRef.current) {
      (makerRef.current as any).style.width = `${getSellMakerPercent()}%`;
    }
  }, [props.poolInfo, txnsRef, volumeRef, makerRef, type]);

  return (
    <div
      className={`flex flex-col`}
    >
      <div className="grid grid-cols-4 border-collapse border-b border-light-gray">
        <PoolStatusItem _type={TYPE_5M} />
        <PoolStatusItem _type={TYPE_1H} />
        <PoolStatusItem _type={TYPE_6H} />
        <PoolStatusItem _type={TYPE_24H} />
      </div>
      <div className="flex flex-col items-center p-4 border-b border-light-gray">
        <div className="grid grid-cols-[60px_1fr] w-full">
          <div className="flex flex-col border-r border-light-gray px-4 items-center justify-center">
            <span className="text-xs text-gray">TXNS</span>
            <span className="text-sm">{getTotalTxns()}</span>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <div className="flex justify-between text-xs text-gray">
              <span>BUYS</span>
              <span>SELLS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{getBuyTxns()}</span>
              <span>{getSellTxns()}</span>
            </div>
            <div className="flex gap-1">
              <div className={`h-1 bg-primary flex-grow`}></div>
              <div className={`h-1 bg-red`} ref={txnsRef}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[60px_1fr] w-full py-4">
          <div className="flex flex-col border-r border-light-gray px-4 items-center justify-center -my-4">
            <span className="text-xs text-gray">Volume</span>
            <span className="text-sm">${millify(Number(getTotalVolume()))}</span>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <div className="flex justify-between text-xs text-gray">
              <span>BUY VOL</span>
              <span>SELL VOL</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>${millify(Number(getBuyVolume()))}</span>
              <span>${millify(Number(getSellVolume()))}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-1 bg-primary flex-grow"></div>
              <div className={`h-1 bg-red`} ref={volumeRef}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[60px_1fr] w-full">
          <div className="flex flex-col border-r border-light-gray px-4 items-center justify-center">
            <span className="text-xs text-gray">Makers</span>
            <span className="text-sm">{millify(Number(getTotalMaker()))}</span>
          </div>
          <div className="flex flex-col gap-1 px-4">
            <div className="flex justify-between text-xs text-gray">
              <span>BUYERS</span>
              <span>SELLERS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{millify(Number(getBuyMaker()))}</span>
              <span>{millify(Number(getSellMaker()))}</span>
            </div>
            <div className="flex gap-1">
              <div className="h-1 flex-grow bg-primary"></div>
              <div className="h-1 bg-red" ref={makerRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
