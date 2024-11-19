import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import PairFilter from "../../components/filters/PairFilter"
import { useRef, useState } from "react";
import DexesFilter from "../../components/filters/DexesFilter";
import ToggleButton from "../../components/buttons/ToggleButton";
import PairTable from "../../components/tables/PairTable";
import { useClickAway } from "react-use";
import { Button } from "@headlessui/react";

export default function Trending() {

  const [quickBuyAmount, setQuickBuyAmount] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showDexes, setShowDexes] = useState<boolean>(false);

  const refFilter = useRef(null);
  const refDexes = useRef(null);

  useClickAway(refFilter, () => setShowFilter(false));
  useClickAway(refDexes, () => setShowDexes(false));

  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Trending</span>
        <span className="text-gray font-medium text-sm">Top 100 trending token pairs based on transactions over the selected period.</span>
      </div>

      <div className="flex justify-between">
        <div className="grid md:grid-cols-[200px_120px_120px_1fr] w-full gap-2">
          <div className="flex border border-outline bg-dark-gray rounded-full items-center justify-center gap-2 text-gray">
            <Button className={`text-soft-white`}>1m</Button>
            <Button className={``}>5m</Button>
            <Button className={``}>20m</Button>
            <Button className={``}>1h</Button>
          </div>
          <div className="relative z-10">
            <div 
              className="flex items-center gap-1 border border-outline rounded-full px-4 py-2 cursor-pointer" 
              onClick={() => setShowFilter(prev => !prev)}
            >
              <AdjustmentsHorizontalIcon className="size-4" />
              <span className="font-semibold flex-grow">Filter</span>
              <ChevronDownIcon className="size-4" />
            </div>
            <div className="absolute z-20 left-0 top-11" hidden={!showFilter} ref={refFilter}>
              <PairFilter />
            </div>
          </div>
          
          <div className="relative z-10">
            <div 
              className="flex items-center gap-1 border border-outline rounded-full px-4 py-2 cursor-pointer" 
              onClick={() => setShowDexes(prev => !prev)}
            >
              <AdjustmentsHorizontalIcon className="size-4" />
              <span className="font-semibold flex-grow">Dexes</span>
              <ChevronDownIcon className="size-4" />
            </div>
            <div className="absolute z-20 left-0 top-11" hidden={!showDexes} ref={refDexes}>
              <DexesFilter />
            </div>
          </div>

          <div className="flex gap-2">
            <ToggleButton className="h-full">
              <span className="font-semibold">Quick Buy</span>
            </ToggleButton>
            <div className="w-32 border border-outline rounded-full flex items-center px-2 h-10 gap-1">
              <img src="/assets/icons/solana.png" className="h-6 w-6" />
              <input className="w-full bg-transparent outline-none mr-2" type="number" value={quickBuyAmount} onChange={e => setQuickBuyAmount(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <PairTable />
      </div>
    </div>
  );
}
