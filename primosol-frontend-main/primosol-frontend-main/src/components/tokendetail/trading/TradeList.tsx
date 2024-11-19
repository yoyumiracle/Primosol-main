import { useQueryClient } from "@tanstack/react-query";
import { IAMMInfos, IPoolOverview, ITokenTrading } from "../../../interface";
import { useWebsocket } from "../../../providers/WebsocketProvider";
import { useTokenData } from "../../../providers/TokenData";
import { useEffect, useMemo, useState } from "react";
import { FilterCriterion } from "../../../helpers/useFilter";
import { TRADE_TYPES } from "../../../constants";
import { DEFAULT_TOKEN } from "../../../helpers/config";
import InfiniteGridTable, { TableColumn } from "../../common/InfiniteGrid";
import { getTradeSide, shortenAddress, shortenString } from "../../../libs/utils";
import millify from "millify";
import { FaArrowRightArrowLeft, FaCheck, FaFilter } from "react-icons/fa6";
import ReactTimeAgo from "react-time-ago";
import DateFormatter from "../../common/DateFormatter";
import { cn } from "../../../helpers/utils";
import FormattedNumber from "../../common/FormattedNumber";
import { BsCircle, BsCircleFill, BsXLg } from "react-icons/bs";
import Dropdown, { DropdownItem } from "../../common/Dropdown";
import DebouncedInput from "../../common/DebounceInput";
import { Typography } from "../../common/Typography";
import GetSvg from "../../common/GetSvg";
import CopyContent from "../../common/CopyContent";

type Props = {
  poolAddress: string;
  poolInfo: IPoolOverview;
};

const TradeList = (props: Props) => {
  const { poolAddress } = props;
  const { ws_pool } = useWebsocket();
  const queryClient = useQueryClient();
  const { useInfiniteTokenTradingHistory } = useTokenData();
  // const [AMMInfos, setAMMInfos] = useState<AMMInfos[]>();
  const [data, setData] = useState<ITokenTrading[]>([]);
  const [dataQueue, setDataQueue] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<ITokenTrading[]>([]);
  const [filters, setFilters] = useState<FilterCriterion[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [toggleDate, setToggleDate] = useState(false);
  const solPrice = queryClient.getQueryData<number>(['SOL_BALANCE']) || 0;
  const price = queryClient.getQueryData<number>(['TOKEN_PRICE', poolAddress]) || 0;

  // For the pagination
  const [pageSize] = useState(20);

  const { data: TRADING_HISTORY, hasNextPage, isFetchingNextPage, isFetching, fetchNextPage } = useInfiniteTokenTradingHistory(poolAddress!, TRADE_TYPES.swap, pageSize);
  // const { data: AMM } = useAMM();

  useEffect(() => {
    setData(history => {
      // Extract new items from the latest page
      let newItems = TRADING_HISTORY?.pages[TRADING_HISTORY.pages.length - 1]?.items || [];
      // Create a Map to ensure uniqueness by txHash
      const dataMap = new Map(history.map(item => [item.txHash, item]));

      // Add new items to the Map, automatically handling duplicates
      newItems.forEach(item => dataMap.set(item.txHash, item));

      // Convert Map back to array and sort by blockUnixTime in descending order
      const updatedData = Array.from(dataMap.values()).sort((a, b) => b.date - a.date);

      return updatedData;
    });
  }, [TRADING_HISTORY]);

  // useEffect(() => {
  //   if (AMM) setAMMInfos(AMM);
  // }, [AMM]);

  const getIcons = (value: number) => {
    switch (true) {
      case value >= 1000 && value < 10000:
        return 'dolphin-icon';
      case value >= 10000:
        return 'whale-icon';
      default:
        return 'shrimp-icon';
    }
  };

  const getContentByIcon = (value: number) => {
    switch (true) {
      case value >= 1000 && value < 10000:
        return '$1K - $10K';
      case value >= 10000:
        return '> $10K';
      default:
        return '< $1K';
    }
  };

  useEffect(() => {
    if (!ws_pool || !poolAddress) return;
    ws_pool.sendMessage('subscribe', {
      type: 'TXS_REALTIME',
      data: { address: poolAddress },
    });

    const listenerId = ws_pool?.registerListener('TXS_REALTIME_DATA', data => {
      if (data.type === 'TXS_REALTIME_DATA' && data.data && data.data.length > 0) {
        let swapData = []
        for (let tx of data.data) {
          const newData: ITokenTrading = {
            address: tx.from.address,
            account: tx.owner,
            date: tx.blockUnixTime,
            order: tx.from.type,
            usdPrice: tx.from.nearestPrice,
            amount: tx.from.uiAmount,
            solAmount: tx.to.uiAmount,
            token: tx.from.address,
            volumeUSD: tx.volumeUSD || 0,
            others: tx.source,
            txHash: tx.txHash,
          };
          newData.volumeUSD = tx.volumeUSD || price * newData.amount;
          swapData.push(newData)
        }
        updateTradingHistory(swapData);

        queryClient.setQueryData<any, any>(['TRADING_HISTORY', poolAddress], () => dataQueue);
      }
    });

    return () => ws_pool?.removeListener(listenerId);
  }, [ws_pool, poolAddress]);

  const updateTradingHistory = (items: any) => {
    setDataQueue(prevQueue => [...items, ...prevQueue]);
  };

  useEffect(() => {
    if (!scrolled && dataQueue.length > 0) {
      setData(prevData => [...dataQueue, ...prevData]);
      setDataQueue([]);
    }
  }, [dataQueue, scrolled]);

  const toggleFilters = (addedFilters: FilterCriterion[], update?: boolean, clearAll?: string) => {
    let newFilters: FilterCriterion[] = [];

    setFilters(currentFilters => {
      newFilters = [...currentFilters];

      if (clearAll) {
        newFilters = newFilters.filter(item => item.prop !== clearAll);
      }

      addedFilters.forEach(filter => {
        const index = newFilters.findIndex(item => item.operator === filter.operator && item.prop === filter.prop);

        if (index > -1) {
          if (update) {
            newFilters.splice(index, 1, filter);
          } else {
            newFilters.splice(index, 1);
          }
        } else {
          newFilters.push(filter);
        }
      });
      return newFilters.filter(item => item.value);
    });
  };

  const filterBuySell = (prop: string) => {
    const filter = filters.find(item => item.prop === prop);
    let value: string = filter?.value;

    return (
      <Dropdown
        position='center'
        DropdownButton={(toggle: any) => <FaFilter onClick={toggle} className={filter ? 'text-blue' : ''} />}
        DropdownMenu={
          <div className='flex w-[160px] flex-col gap-2 font-normal normal-case'>
            <Typography level='h7' className='px-4 py-2'>
              Filter TX type
            </Typography>

            {['', 'buy', 'sell'].map(value => (
              <DropdownItem key={value} className='flex items-center justify-start gap-1 text-start uppercase text-sm' onClick={() => toggleFilters([{ operator: 'indexOf', prop, value }], true)}>
                {filter?.value === value ? <BsCircleFill /> : <BsCircle />} {value || 'all'}
              </DropdownItem>
            ))}

            {filter && (
              <div className='px-4'>
                <DropdownItem
                  className='bg-light-gray text-center uppercase hover:bg-mid-gray'
                  onClick={() => toggleFilters([{ operator: 'indexOf', prop, value }])}>
                  {'clear'}
                </DropdownItem>
              </div>
            )}
          </div>
        }
      />
    );
  };

  const filterValue = (prop: string) => {
    const filter = filters.find(item => item.prop === prop);
    let value: string = filter?.value;

    const filterValues = [1, 1000, 10000];

    const doFilter = (value: number) => {
      if (value === 10000) {
        toggleFilters(
          [
            { operator: '>=', prop, value: 10000 },
            { operator: '<=', prop, value: 1000 },
          ],
          false,
          prop
        );
      } else if (value === 1000) {
        toggleFilters(
          [
            { operator: '>=', prop, value: 1000 },
            { operator: '<', prop, value: 10000 },
          ],
          false,
          prop
        );
      } else if (value === 1) {
        toggleFilters([{ operator: '<', prop, value: 1000 }], false, prop);
      }
    };

    return (
      <Dropdown
        position='center'
        DropdownButton={(toggle: any) => <FaFilter onClick={toggle} className={filter ? 'text-blue-400' : ''} />}
        DropdownMenu={
          <div className='flex w-[160px] flex-col gap-2 font-normal normal-case'>
            <Typography level='h7' className='px-4 py-2'>
              Filter by value range
            </Typography>

            {filterValues.map((value, index) => (
              <DropdownItem key={value} className='flex items-center justify-start gap-2 text-start uppercase' onClick={() => doFilter(value)}>
                <GetSvg name={getIcons(value)} className='size-[18px]' /> {getContentByIcon(value)}
              </DropdownItem>
            ))}

            {filter && (
              <DropdownItem className='bg-light-gray text-center uppercase hover:bg-mid-gray' onClick={() => toggleFilters([], false, prop)}>
                {'clear'}
              </DropdownItem>
            )}
          </div>
        }
      />
    );
  };

  const filterSolAmount = (prop: string) => {
    const filter = filters.find(item => item.prop === prop);
    let value: string = filter?.value;

    const filterValues = [1, 5, 10, 100];

    const doFilter = (value: number) => {
      if (value === 100) {
        toggleFilters([{ operator: '>=', prop, value: 100 }], false, prop);
      } else if (value === 10) {
        toggleFilters([{ operator: '>=', prop, value: 10 }], false, prop);
      } else if (value === 5) {
        toggleFilters([{ operator: '>=', prop, value: 5 }], false, prop);
      } else if (value === 1) {
        toggleFilters([{ operator: '>=', prop, value: 1 }], false, prop);
      }
    };

    return (
      <Dropdown
        position='center'
        DropdownButton={(toggle: any) => <FaFilter onClick={toggle} className={filter ? 'text-blue-400' : ''} />}
        DropdownMenu={
          <div className='flex w-[160px] flex-col gap-2 font-normal normal-case'>
            <Typography level='h7' className='px-4 py-2'>
              Filter by SOL amount
            </Typography>

            {filterValues.map((value, index) => (
              <DropdownItem key={value} className='flex items-center justify-start gap-2 text-start uppercase' onClick={() => doFilter(value)}>
                {`> ${value}`}
              </DropdownItem>
            ))}

            {filter && (
              <DropdownItem className='bg-light-gray text-center uppercase hover:bg-mid-gray' onClick={() => toggleFilters([], false, prop)}>
                {'clear'}
              </DropdownItem>
            )}
          </div>
        }
      />
    );
  };

  const filterWalletContent = (prop: string) => {
    const filter = filters.find(item => item.prop === prop);
    let value: string = filter?.value;

    return (
      <Dropdown
        position='center'
        DropdownButton={(toggle: any) => <FaFilter onClick={toggle} className={filter ? 'text-blue' : ''} />}
        DropdownMenu={
          <div className='flex w-[300px] flex-col gap-2 px-4 py-2 font-normal normal-case'>
            <Typography level='h7'>Search by wallet address.</Typography>
            <Typography level='poppins7'>Search maker by name or at least 10 characters of a wallet ID</Typography>
            <DebouncedInput
              placeholder={'wallet'}
              value={value}
              className='rounded border border-outline bg-transparent px-3 py-2 text-xs !font-normal outline-none placeholder:text-gray'
              onChange={(value: any) => toggleFilters([{ operator: 'indexOf', prop, value }])}
            />
            {filter && <DropdownItem className='bg-light-gray text-center uppercase hover:bg-mid-gray'>{'clear'}</DropdownItem>}
          </div>
        }
      />
    );
  };

  const columns: TableColumn<ITokenTrading>[] = useMemo(
    () => [
      {
        key: 'date',
        title: 'date',
        width: 'minmax(150px, 0.6fr)',
        className: '!justify-start',
        headerClassName: '!justify-start',
        header: () => (
          <span className='flex items-center gap-2 text-nowrap'>
            {'date'} <FaArrowRightArrowLeft onClick={() => setToggleDate(bool => !bool)} />
          </span>
        ),
        render: item => (
          <div className={`items-center text-center ${getTradeSide(item.order)}`}>
            {toggleDate ? <ReactTimeAgo date={item.date * 1000} locale='en-US' /> : <DateFormatter timestamp={item.date * 1000} />}
          </div>
        ),
      },
      {
        key: 'order',
        title: 'type',
        width: 'minmax(80px, 0)',
        filter: prop => filterBuySell(prop),
        render: item => <div className={getTradeSide(item.order)}>{item.order}</div>,
      },
      {
        key: 'usdPrice',
        title: 'price',
        width: 'minmax(100px, 0.5fr)',
        render: item => {
          return <FormattedNumber className={getTradeSide(item.order)} value={item.usdPrice} options={{ precision: 4 }} isCurrency={true} />;
        },
      },
      {
        key: 'volumeUSD',
        title: 'usd value',
        width: 'minmax(100px, 0.5fr)',
        headerClassName: 'justify-end',
        className: 'justify-end',
        filter: prop => filterValue(prop),
        render: item => {
          return (
            <div className='flex items-center gap-1'>
              <FormattedNumber className={getTradeSide(item.order)} value={item.volumeUSD} options={{ precision: 2 }} isCurrency={true} />
              <GetSvg name={getIcons(item.volumeUSD)} className='size-[12px]' />
            </div>
          );
        },
      },
      {
        key: 'solAmount',
        title: 'sol amount',
        width: 'minmax(100px, 0.5fr)',
        headerClassName: 'justify-end',
        className: 'justify-end',
        filter: prop => filterSolAmount(prop),
        render: item => (
          <div className='flex gap-2'>
            <FormattedNumber className={getTradeSide(item.order)} value={item.solAmount} options={{ precision: 3 }} />
          </div>
        ),
      },
      {
        key: 'amount',
        title: 'amount',
        width: 'minmax(100px, 0.5fr)',
        headerClassName: 'justify-end',
        className: 'justify-end',
        render: item => (
          <div className='flex gap-2'>
            <FormattedNumber className={getTradeSide(item.order)} value={item.amount} options={{ precision: 3 }} />
          </div>
        ),
      },
      {
        key: 'account',
        title: `maker`,
        width: 'minmax(150px, 1fr)',
        filter: prop => filterWalletContent(prop),
        render: item => {
          const filter: FilterCriterion = { operator: 'indexOf', prop: 'account', value: item.account };
          const hasFilter = filters.findIndex(item => item.prop === 'account');

          return (
            <div className={`flex w-full items-center justify-between gap-1 ${getTradeSide(item.order)}`}>
              <a href={`https://solscan.io/account/` + item.account} target='_blank' className='flex gap-2 items-center md:hover:text-blue'>
                <span>{shortenAddress(item.account)}</span>
                <CopyContent value={item.account} copiedContent={<FaCheck className='rounded-sm border border-green text-green' />}>
                  <GetSvg name='copy-icon' className='size-3.5 md:hover:text-white' />
                </CopyContent>
              </a>
              <a href={`https://solscan.io/tx/` + item.txHash} target='_blank' className='flex gap-2 items-center md:hover:text-blue'>
                {hasFilter ? <FaFilter className="text-gray" /> : <BsXLg />}
              </a>
            </div>
          );
        },
      },
    ],
    [getIcons, data, DEFAULT_TOKEN]
  );

  const FilterTags = (
    <div className='flex gap-3 text-xs'>
      {filters.map((item, i) => (
        <span key={i} className='text-muted align-items-center flex gap-1 rounded bg-gray px-2 py-1'>
          <span>'by'</span>
          <span className=''>{item.prop}</span>
          <span> {item.operator}</span>
          {typeof item.value === 'string' ? <span>{shortenString(item.value)}</span> : <span>{millify(item.value)}</span>}
          <button className='btn btn-sm border-0 p-0' onClick={() => toggleFilters([item])}>
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className='flex w-full h-full flex-col'>
      {/* {FilterTags} */}
      <InfiniteGridTable
        data={data}
        columns={columns}
        scrolled={scrolled}
        setScrolled={setScrolled}
        filters={filters}
        onRowSelect={e => console.log(e)}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        useButton={false}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        headerClassName='uppercase text-gray text-xs'
        gridRowClassName='md:hover:bg-mid-gray'
        gridColClassName='items-center cursor-pointer text-sm !py-1.5 after:bg-transparent'
      />
    </div>
  );
};

export default TradeList;
