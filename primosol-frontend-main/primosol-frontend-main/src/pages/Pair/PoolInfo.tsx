import { ClipboardDocumentIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Tooltip from "../../components/common/Tooltip";
import { IPoolOverview } from "../../interface";
import { formatPrice } from '../../libs/utils';
import millify from 'millify';

type Props = {
  poolInfo?: IPoolOverview;
  onCopy?: () => void;
};

export default function PoolInfo(props: Props) {
  return (
    <div
      className={`flex flex-col p-4 gap-4 font-semibold`}
    >
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-lg">
          <span>{props.poolInfo?.baseName || 'N/A'}</span>
          <ClipboardDocumentIcon className="text-gray size-4 cursor-pointer" onClick={props.onCopy} />
          <Tooltip content={(
            <div className="grid grid-cols-[100px_1fr] gap-1">
              <span className="text-gray text-left">Mint Authority</span>   
              <span className="text-right">Disabled</span>
              <span className="text-gray text-left">Freeze Authority</span> 
              <span className="text-right">Disabled</span>
              <span className="text-gray text-left">LP Burned</span>        
              <span className="text-right">100.00%</span>
              <span className="text-gray text-left">Top 10 Holders</span>   
              <span className="text-right">23.23%</span>
            </div>
          )}>
            <InformationCircleIcon className="text-gray size-4 cursor-pointer" />
          </Tooltip>
        </div>
        <div className="flex gap-1 text-sm text-gray font-normal">
          <span>PumpFun</span>
          <span className="text-light-gray">|</span>
          <span>Verify Profile</span>
        </div>
      </div>

      <hr className="text-light-gray" />

      <div className="grid grid-cols-3 text-sm px-4">
        <div className="flex flex-col">
          <span className="text-gray text-xs">Price USD</span>
          <span>{props?.poolInfo ? formatPrice(props.poolInfo.price) : 'N/A'}</span>
        </div>
        {/* <div className="flex flex-col">
          <span className="text-gray text-xs">Price SOL</span>
          <span>{props?.poolInfo ? formatPrice(props.poolInfo.price) : 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray text-xs">Supply</span>
          <span>1B</span>
        </div>
      </div>

      <hr className="text-light-gray" />

      <div className="grid grid-cols-3 text-sm px-4"> */}
        <div className="flex flex-col">
          <span className="text-gray text-xs">Liquidity</span>
          <span>{props?.poolInfo ? `$${millify(props.poolInfo.liquidity)}` : 'N/A'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray text-xs">MKT CAP</span>
          <span>{props?.poolInfo ? `$${millify(props.poolInfo.mcap)}` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
