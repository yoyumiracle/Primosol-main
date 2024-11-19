import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { InfiniteData, UseInfiniteQueryResult, UseQueryResult, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import AppContext from './AppContext';
import { IAMMInfos, IRecentTokens, IPoolOverview, ITokenTrading } from '../interface';
import { fetchAMMInfo, fetchRecentTokens, fetchSortedPools, fetchPoolInfo, fetchTokenPrice, fetchTrendingTokens, searchTokens, fetchPoolTrades, fetchTokenBalance } from '../libs/fetches';
import { TRADE_TYPES } from '../constants';
import { Order } from '../components/common/Sort';
import { DEFAULT_TOKEN, USDC_TOKEN_ADDRESS } from '../helpers/config';

export const TokenDataContext = createContext<{
  solBalance: number | undefined;
  // trendingTokens: TokenOverview[];
  useSortPoolsData: (queryKey: string, key: keyof IPoolOverview, sort: Order, skip: number, limit: number, enabled?: boolean) => UseQueryResult<{ itemsCount: number; result: IPoolOverview[] }, Error>;
  useSearchTokens: (searchText: string) => UseQueryResult<IPoolOverview[], Error>;
  useRecentSearchTokens: () => UseQueryResult<IRecentTokens[], Error>;
  useTokenPrice: (tokenAddress: string, targetTokenAddress?: string, refetchInterval?: number, enabled?: boolean) => UseQueryResult<number, Error>;
  usePoolDetail: (poolAddress: string, refetchInterval?: number) => UseQueryResult<IPoolOverview, Error>;
  useTokenTradingHistory: (address: string, txType: TRADE_TYPES, skip?: number, limit?: number) => UseQueryResult<ITokenTrading[], Error>;
  useInfiniteTokenTradingHistory: (
    address: string,
    txType: TRADE_TYPES,
    limit?: number
  ) => UseInfiniteQueryResult<InfiniteData<{ hasNext: boolean; nextCursor: number; items: ITokenTrading[] }, unknown>, Error>;
  useTokenBalance: (wallet?: string, tokenAddress?: string, decimals?: number) => UseQueryResult<number, Error>;
  // useAMM: () => UseQueryResult<AMMInfos[]>;
} | null>(null);

export const useTokenData = () => {
  const context = useContext(TokenDataContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokensProvider');
  }
  return context;
};

export const TokenDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { publicKey } = useWallet();
  const { isSign } = useContext(AppContext);

  // const [trendingTokens, setTrendingTokens] = useState<TokenOverview[]>([]);

  const getSortedPools = async (key: keyof IPoolOverview, sort: Order, skip: number, limit: number): Promise<{ itemsCount: number; result: IPoolOverview[] } | null> => {
    const data = await fetchSortedPools(key, sort, skip, limit);
    return data;
  };

  // TODO: move this to backend please
  const fetchTokenTrades = async (address: string, txType: TRADE_TYPES, limit: number, offset: number): Promise<{ hasNext: boolean; nextCursor: number; items: ITokenTrading[] }> => {
    const data = await fetchPoolTrades(address, txType, limit, offset);
    let tradeData: any = {}
    if (data) {
      tradeData.items = data.data.map((item: any) => {
        const newItem: ITokenTrading = {
          address: item.from.address,
          account: item.owner,
          date: item.blockUnixTime,
          order: item.from.type,
          usdPrice: item.from.nearestPrice,
          amount: item.from.uiAmount,
          solAmount: item.to.uiAmount,
          token: item.from.address,
          volumeUSD: item.volumeUSD || 0,
          others: item.source,
          txHash: item.txHash,
        };
        newItem.volumeUSD = item.volumeUSD || newItem.usdPrice * newItem.amount;
        return newItem;
      });

      if (data.data.length > 0) {
        tradeData.hasNext = true
        tradeData.nextCursor = offset + 1;
      }
    } else {
      tradeData.items = []
      tradeData.hasNext = false
      tradeData.nextCursor = offset
    }
    return tradeData;
  };


  const { data: solBalance } = useQuery<number>({
    queryKey: ['SOL_BALANCE'],
    queryFn: async () => await fetchTokenPrice(DEFAULT_TOKEN, USDC_TOKEN_ADDRESS),
  });

  // const { data: TRENDING_TOKENS } = useQuery<TokenOverview[]>({
  //   queryKey: ['TRENDING_TOKENS'],
  //   queryFn: async () => await fetchTrendingTokens(0, 30),
  //   staleTime: 1000 * 60 * 60, // 60 minutes
  // });

  // TODO: this should come from our configured featured tokens

  const useSearchTokens = (searchText: string) => {
    return useQuery<IPoolOverview[]>({
      queryKey: ['SEARCH_TOKENS', searchText],
      queryFn: () => searchTokens(searchText),
      enabled: !!(searchText && searchText.trim()),
    });
  };

  const useRecentSearchTokens = () => {
    return useQuery<IRecentTokens[]>({
      queryKey: ['RECENT_SEARCH_TOKENS', publicKey],
      queryFn: () => (isSign && publicKey ? fetchRecentTokens(publicKey.toString()) : Promise.resolve([])),
    });
  };

  /* const useTokenPrice = (tokenAddress: string, targetTokenAddress = USDC_TOKEN_ADDRESS, refetchInterval?: number, enabled?: boolean) => {
    return useQuery<number>({
      queryKey: ['TOKEN_BASE_QUOTE_PRICE', tokenAddress, targetTokenAddress],
      queryFn: async () => {
        if (targetTokenAddress !== tokenAddress) {
          return await fetchTokenPrice(tokenAddress, targetTokenAddress);
        }
        return 0;
      },
      enabled: !!tokenAddress && enabled,
      refetchInterval: refetchInterval ? (refetchInterval || 0) * 1000 : false,
    });
  }; */

  const useTokenPrice = () => {
    return useQuery<number>({
      queryKey: ['TOKEN_PRICE'],
    });
  };

  const usePoolDetail = (poolAddress?: string, refetchInterval?: number) => {
    return useQuery<IPoolOverview>({
      queryKey: ['POOL_DETAIL', poolAddress],
      queryFn: async () => ({ ...(await fetchPoolInfo(poolAddress!)) }),
      enabled: !!poolAddress,
      refetchInterval: refetchInterval ? (refetchInterval || 0) * 1000 : false,
    });
  };

  const useTokenBalance = (wallet?: string, tokenAddress?: string, decimals: number = 6) => {
    return useQuery<number>({
      queryKey: ['TOKEN_BALANCE', wallet, tokenAddress],
      queryFn: async () => {
        if (!decimals) {
          decimals = 9
        }
        if (wallet && tokenAddress) {
          return await fetchTokenBalance(wallet, tokenAddress, decimals);
        }
        return 0;
      }
    })
  }

  const useTokenTradingHistory = (address: string, txType: TRADE_TYPES, skip = 0, limit = 15) => {
    return useQuery<ITokenTrading[]>({
      queryKey: ['TOKEN_TRADING', address],
      queryFn: async () => (await fetchTokenTrades(address, txType, limit, skip)).items,
      enabled: !!address,
    });
  };

  const useInfiniteTokenTradingHistory = (address: string, txType: TRADE_TYPES, limit = 20) => {
    return useInfiniteQuery<{ hasNext: boolean; nextCursor: number; items: ITokenTrading[] }>({
      queryKey: ['TOKEN_TRADING', address],
      queryFn: async ({ pageParam }) => await fetchTokenTrades(address, txType, limit, pageParam as number),
      initialPageParam: 0,
      getNextPageParam: lastPage => lastPage.nextCursor ?? false,
      refetchOnWindowFocus: false,
      enabled: !!address,
    });
  };

  const useSortPoolsData = (queryKey: string, key: keyof IPoolOverview, sort: Order = 'normal', skip = 0, limit = 20, enabled = true) => {
    return useQuery<{ itemsCount: number; result: IPoolOverview[] }>({
      queryKey: [queryKey, key, sort, skip, limit],
      queryFn: async () => (await getSortedPools(key, sort, skip, limit)) ?? { itemsCount: 0, result: [] },
      enabled,
    });
  };

  // const useAMM = () => {
  //   return useQuery<AMMInfos[]>({
  //     queryKey: ['AMM'],
  //     queryFn: async () => await fetchAMMInfo(),
  //     staleTime: Infinity,
  //   });
  // };

  // useEffect(() => setTrendingTokens(TRENDING_TOKENS?.filter(item => item.per24hVolumeChangePercent).slice(0, 20) || []), [TRENDING_TOKENS]);
  // useEffect(() => setFeaturedTokens(FEATURED_TOKENS || []), [FEATURED_TOKENS]);

  const value = {
    solBalance,
    // trendingTokens,
    useSortPoolsData,
    useSearchTokens,
    useRecentSearchTokens,
    useTokenPrice,
    usePoolDetail,
    useTokenTradingHistory,
    useInfiniteTokenTradingHistory,
    useTokenBalance
    // useAMM,
  };

  return <TokenDataContext.Provider value={value}>{children}</TokenDataContext.Provider>;
};
export default TokenDataProvider;
