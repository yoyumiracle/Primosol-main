import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import Card from "../../components/common/Card";
import OrderFilter from "../../components/filters/OrderFilter";
import OrderTable from "../../components/tables/OrderTable";
import { useAccountInfo } from "../../providers/AppContext";
import { IOrderFilter } from "../../interface";

export default function Order() {
  const { useInfiniteOrdersHistory } = useAccountInfo();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState<IOrderFilter>({
    active: true,
    success: true,
    failed: true,
    buyDip: true,
    stopLoss: true,
    takeProfit: true,
  });

  const { data: orders, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage, refetch: orderRefretch } = useInfiniteOrdersHistory(20, filters);


  const refFilter = useRef(null);
  
  const refetch = () => {
    orderRefretch()
  }

  useEffect(() => {
    console.log(filters);
    refetch()
    
  }, [filters]);

  useEffect(() => {
    setData(history => {
      // Extract new items from the latest page
      const newItems = orders?.pages[orders.pages.length - 1]?.items || [];
      // Create a Map to ensure uniqueness by txHash
      // const dataMap = new Map(history.map(item => [item.order_id, item]));
      const dataMap = new Map();

      // Add new items to the Map, automatically handling duplicates
      newItems.forEach(item => dataMap.set(item.order_id, item));

      // Convert Map back to array and sort by blockUnixTime in descending order
      const updatedData = Array.from(dataMap.values()).sort((a, b) => b.timeStamp - a.timeStamp);

      return updatedData;
    });
  }, [orders]);

  useClickAway(refFilter, () => setShowFilter(false));

  return (
    <div className="flex flex-col gap-4 w-full py-2">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">My Orders</span>
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
              <OrderFilter filters={filters} setFilters={setFilters} />
            </div>
          </div>
        </div>
      </div>

      <Card className="flex flex-col gap-5 min-h-56 rounded-xl">
        <div className="w-full overflow-auto">
          <OrderTable data={data} isFetching={isFetching} refetch={refetch} />
        </div>
      </Card>
    </div>
  );
}
