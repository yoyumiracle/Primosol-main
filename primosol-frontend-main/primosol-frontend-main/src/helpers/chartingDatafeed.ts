import { WebsocketClient } from './websocket';
import { IPoolOverview, ITokenPriceData } from '../interface';
import { SocketIOClient } from './socket_io';
import { getOHLCVInfo } from '../libs/fetches';

export const ALLOWED_RESOLUTIONS: { [key: string]: string } = {
  '1': '1m',
  '5': '5m',
  '15': '15m',
  '30': '30m',
  '60': '1h',
  '120': '2h',
  '360': '6h',
  '1D': '1d',
  '1W': '1w',
  '1M': '1M',
};

let listenerId: number | undefined;
// const curBarsCache = new Map();
const prevBarsCache = new Map();
// const firstBarCache = new Map();
let subscriptions: any[] = [];

const data_vars = {
  supported_resolutions: ['1', '5', '15', '30', '60', '120', '360', '1D', '1W', '1M'],
  intraday_multipliers: ['1', '5', '15', '30', '60', '120', '360'],
  exchanges: [],
  symbols_types: [],
  supports_marks: !0,
};

export function GetDatafeedProvider(data: IPoolOverview, ws_pool: SocketIOClient) {
  return {
    onReady: (callback: any) => {
      setTimeout(() => callback(data_vars));
    },
    searchSymbols: (userInput: any, exchange: any, symbolType: any, onResultReadyCallback: (arg0: never[]) => void) => {
      onResultReadyCallback([]);
    },
    resolveSymbol: async (symbolName: any, onSymbolResolvedCallback: (arg0: any) => void, onResolveErrorCallback: any, extension: any) => {
      const symbolInfo = {
        address: data.poolAddress,
        base_name: [`${data.baseSymbol}/USD`],
        legs: [`${data.baseSymbol}/USD`],
        dataType: 'usd',
        full_name: data.baseSymbol,
        ticker: `${data.baseMint}`,
        name: `${data.baseSymbol}/USD`,
        description: `${data.baseSymbol}/USD`,
        data_status: 'streaming',
        type: 'Crypto',
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: 'memetrend',
        minmov: 0.00000000001,
        pricescale: 10 ** 9,
        has_intraday: true,
        visible_plots_set: 'ohlcv',
        has_weekly_and_monthly: true,
        supported_resolutions: data_vars.supported_resolutions,
        intraday_multipliers: data_vars.intraday_multipliers,
        volume24h: data.v24hUSD,
        volume_precision: 4,
        liquidity: data.liquidity,
        pairAddress: '',
        source: 'All pairs',
      };
      setTimeout(() => onSymbolResolvedCallback(symbolInfo), 0);
    },
    getBars: async (
      symbolInfo: any,
      resolution: string,
      periodParams: { from: any; to: any; firstDataRequest: any },
      onHistoryCallback: (arg0: { time: number; low: any; high: any; open: any; close: any; volume: number }[], arg1: { noData: boolean }) => void,
      onErrorCallback: any
    ) => {
      const { from, to, firstDataRequest } = periodParams;
      console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
      try {
        const items = await getOHLCVInfo(symbolInfo.address, resolution, from, to);
        if (!items || items.length == 0) {
          onHistoryCallback([], { noData: true });
          return
        }
        let bars: any[] = [];

        items.forEach((item: ITokenPriceData) => {
          item.unixTime >= from && item.unixTime < to && (bars = [...bars, getBarData(item)]);
        });
        bars = bars.sort(function (a, b) {
          if (a.time < b.time) return -1;
          else if (a.time > b.time) return 1;
          return 0;
        });

        for (let i = 0; i < bars.length - 1; i++)
          bars[i].close = bars[i + 1].open;
        prevBarsCache.set(symbolInfo.address, bars[bars.length - 1]);
        // console.log("firstBarCahce", firstBarCache.get(symbolInfo.address))
        // if (!firstDataRequest && firstBarCache.get(symbolInfo.address)) {
        //   bars[bars.length - 1].close = firstBarCache.get(symbolInfo.address).open;
        // }
        // firstBarCache.set(symbolInfo.address, bars[0]);
        // firstDataRequest && curBarsCache.set(symbolInfo.address, { ...bars[bars.length - 1] });
        // const bars = items.map(getBarData);
        onHistoryCallback(bars, { noData: bars.length === 0 });
      } catch (error) {
        onErrorCallback(error);
      }
    },
    subscribeBars: async (symbolInfo: any, resolution: string, onRealtimeCallback: (arg0: any) => void, subscriberUID: any, onResetCacheNeededCallback: any) => {
      const messageReceived = (priceData: ITokenPriceData) => {
        let bar: any = getBarData(priceData);
        if (priceData.address !== symbolInfo.address || bar.time < prevBarsCache.get(symbolInfo.address).time) return;
        if (prevBarsCache.get(symbolInfo.address)) {
          bar.open = prevBarsCache.get(symbolInfo.address).close;
        }
        prevBarsCache.set(symbolInfo.address, bar);
        // bar.open = lastItem.close
        onRealtimeCallback(bar);
      };

      listenerId = ws_pool.registerListener('CHART_REALTIME_DATA', (data: any) => {
        if (data.type === 'CHART_REALTIME_DATA' && data.data) {
          messageReceived(data.data);
        }
      });
      subscriptions.push({ listener: listenerId, subscriberUID: subscriberUID });

      ws_pool.sendMessage('subscribe',
        {
          type: 'CHART_REALTIME',
          data: {
            type: ALLOWED_RESOLUTIONS[resolution],
            address: symbolInfo.address,
            address_type: 'pair'
          },
        });
    },
    unsubscribeBars: async (subscriberUID: any) => {
      const sub = subscriptions.find(sub => sub.subscriberUID == subscriberUID);

      if (sub) {
        ws_pool.removeListener(sub.listener);
        subscriptions = subscriptions.filter(sub => sub.subscriberUID !== subscriberUID);
      }
    },
  };
}

const getBarData = (price: ITokenPriceData) => {
  return {
    time: price.unixTime * 1000,
    low: price.l,
    high: price.h,
    open: price.o,
    close: price.c,
    volume: price.v,
    symbol: price.address,
  };
};