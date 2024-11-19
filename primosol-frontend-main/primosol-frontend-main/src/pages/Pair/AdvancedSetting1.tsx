import { ChevronDownIcon, ChevronUpIcon, Cog8ToothIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import Tooltip from "../../components/common/Tooltip";
import Input from "../../components/common/Input";
import { Button } from "@headlessui/react";
import ToggleButton from "../../components/buttons/ToggleButton";
import { useAccountInfo } from "../../providers/AppContext";

export default function AdvancedSetting() {

  const { slippage, priority, setSlippage, setPriority } = useAccountInfo();

  const [show, setShow] = useState<boolean>(false);
  const ref = useRef(null);

  const toggleShow = () => {
    if (!ref || !ref.current) return;

    if (show) {
        (ref.current as any).style.maxHeight = '0';
    } else {
      (ref.current as any).style.maxHeight = (ref.current as any).scrollHeight + 'px';
    }

    setShow(prev => !prev);
  }

  return (
    <div
      className={`flex flex-col font-semibold`}
    >
      <div className="flex border-t border-b border-light-gray text-gray text-sm py-2">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-1">
            <Cog8ToothIcon className="size-4" />
            <span>Advanced Settings</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center text-red">
              <InformationCircleIcon className="size-4" />
              Warning
            </span>
            <ChevronDownIcon onClick={toggleShow} className={`size-4 cursor-pointer ${show?'hidden':''}`} />
            <ChevronUpIcon onClick={toggleShow} className={`size-4 cursor-pointer ${show?'':'hidden'}`} />
          </div>
        </div>
      </div>
      
      <div className={`flex flex-col gap-4 transition-all duration-300 ease-in-out max-h-0 ${!show?'overflow-hidden':''}`} ref={ref}>
        <div className="flex mt-4 gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-gray">Slippage %</span>
            <Input type="number" value={slippage} onChange={e => setSlippage(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-1">
              <span className="text-sm text-gray">Smart-Mev protection</span>
              <Tooltip position="left" content={(
                <div className="text-left w-[320px]">
                  <p>Fast: Send to the next available validator for the highest change of success</p>
                  <p>Secure: Send with MEV protection. This may be slower as we will only send to a JITO validator</p>
                </div>
              )}>
                <InformationCircleIcon className="size-3 text-gray" />
              </Tooltip>
            </div>
            <div className="flex text-gray pt-2">
              <span>Fast</span>
              <ToggleButton />
              <span>Secure</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray">Set Speed</span>
          <Button className="third w-fit">Default</Button>
          <span className="text-sm text-gray mt-1">Priority</span>
          <Input><span className="text-sm">SOL</span></Input>
          <span className="text-sm text-gray mt-1">Bribery Amount</span>
          <Input><span className="text-sm">SOL</span></Input>
        </div>
      </div>
    </div>
  );
}
