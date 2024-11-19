import { AdjustmentsHorizontalIcon, ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import ToggleButton from "../../components/buttons/ToggleButton";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import HoldingFilter from "../../components/filters/HoldingFilter";
import Card from "../../components/common/Card";
import HoldingTable from "../../components/tables/HoldingTable";
import { Button } from "@headlessui/react";
import { useAccountInfo } from "../../providers/AppContext";
import { IHoldingFilter } from "../../interface";

export default function Holding() {
  const { useHoldingTokens } = useAccountInfo();
  const [filters, setFilters] = useState<IHoldingFilter>({
    remainToken: false,
    hidden: false,
  })

  const { data: holdingData, refetch: holdingRefresh, isFetching } = useHoldingTokens(filters)
  const [showFilter, setShowFilter] = useState<boolean>(false);
 
  const refFilter = useRef(null);

  useEffect(() => {
    console.log(filters);
    // refetch with filters
    holdingRefresh()
  }, [filters]);

  useClickAway(refFilter, () => setShowFilter(false));

  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Holdings</span>
        <span className="text-gray font-medium text-sm">Review the tokens you’ve bought or sold on PrimoSol.</span>
      </div>

      <div className="flex justify-between gap-5">
        <div className="grid md:grid-cols-[120px_1fr] w-full gap-2">
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
              <HoldingFilter filters={filters} setFilters={setFilters} />
            </div>
          </div>

          <ToggleButton className="h-full" initialEnabled={filters.hidden} onSwitchChange={enabled => setFilters({...filters, hidden: enabled})}>
            <span className="font-semibold">Show Hidden</span>
          </ToggleButton>
        </div>
        <div className="flex items-end">
          <Button className="third" onClick={() => holdingRefresh()}>
            <ArrowPathIcon className="size-4" />
            <span className="w-max">Refresh Token</span>
          </Button>
        </div>
      </div>

      <Card className="flex flex-col gap-5 min-h-56 rounded-xl">
        <span className="font-bold px-4 md:px-6 pt-4">Holdings</span>
        <hr className="text-light-gray" />
        {/* <span className="text-gray text-sm px-4 md:px-6">You currently do not have any token holdings in your PrimoSol trading wallet.</span> */}
        <div className="w-full overflow-auto">
          <HoldingTable data={holdingData} isFetching={isFetching} />
        </div>
      </Card>
    </div>
  );
}
