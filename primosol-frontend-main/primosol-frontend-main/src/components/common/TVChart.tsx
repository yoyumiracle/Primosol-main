import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { formatNumber } from './FormattedNumber';
import { IPoolOverview } from '../../interface';
import { GetDatafeedProvider } from '../../helpers/chartingDatafeed';
import { useWebsocket } from '../../providers/WebsocketProvider';
import { cn } from '../../helpers/utils';
import { ChartingLibraryWidgetOptions, ResolutionString } from '../../../public/tradingview/charting_library/charting_library';
import { IChartingLibraryWidget } from '../../../dist/tradingview/charting_library/charting_library';

const defaultProps = {
  symbol: 'MEMETREND',
  libraryPath: '/tradingview/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  fullscreen: false,
  autosize: false,
};

interface TVChartProps {
  widget: IChartingLibraryWidget | undefined;
  setWidget: (_widget: IChartingLibraryWidget | undefined) => void;
  data: IPoolOverview;
  interval?: string;
  onHighlight?: (data: any) => void;
  onLoaded?: () => void;
}

export const TVChart = ({ widget, setWidget, data, interval = '5', onLoaded = undefined }: TVChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false); // All widget functions should be called only if chartReady is true
  const [lastChartValues, setLastChartValues] = useState<{ time: any; res: any }>({ time: null, res: null });
  const [lastClick, setLastClick] = useState<number | null>(null);
  const { ws_pool } = useWebsocket();

  const handleClick = () => {
    setLastClick(Date.now());
  };

  const handleResize = () => {
    chartContainerRef.current && (chartContainerRef.current.style.width = '100%');
  };

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);

  //   handleResize();

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [chartContainerRef.current, widget]);

  // Create widget, this code is only used once
  useEffect(() => {
    if (chartContainerRef && chartContainerRef.current && !widget && ws_pool) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        enabled_features: ["custom_resolutions"],
        overrides: {
          'mainSeriesProperties.statusViewStyle.showExchange': false,
          volumePaneSize: 'small',
          keep_object_tree_widget_in_right_toolbar: true,
        },
        studies_overrides: {
          'volume.volume.ma.visible': false,
        },
        loading_screen: {
          backgroundColor: '#000000',
        },
        theme: 'dark',
        symbol: defaultProps.symbol,
        datafeed: GetDatafeedProvider(data, ws_pool),
        container: chartContainerRef.current,
        library_path: defaultProps.libraryPath,
        interval: (interval || '5') as ResolutionString,
        locale: 'en',
        custom_css_url: '/tradingview/styles/custom.css',
        disabled_features: ['header_symbol_search', 'header_compare', 'display_market_status', 'header_saveload', 'chart_template_storage'],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: '1.1',
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        custom_formatters: {
          timeFormatter: {
            format: date => {
              const _format_str = '%h:%m';
              return _format_str
                .replace('%h', date.getHours().toString().padStart(2, '0'))
                .replace('%m', date.getMinutes().toString().padStart(2, '0'))
                .replace('%s', date.getSeconds().toString().padStart(2, '0'));
            },
            formatLocal: date => {
              const _format_str = '%h:%m';
              return _format_str
                .replace('%h', date.getHours().toString().padStart(2, '0'))
                .replace('%m', date.getMinutes().toString().padStart(2, '0'))
                .replace('%s', date.getSeconds().toString().padStart(2, '0'));
            },
          },
          dateFormatter: {
            format: date => {
              return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            },
            formatLocal: date => {
              return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            },
          },
          priceFormatterFactory: () => {
            return { format: price => formatNumber(price) };
          },
        },
      };

      setWidget(new window.TradingView.widget(widgetOptions as any));
    }

    return () => {
      if (widget) {
        widget.remove();
        setWidget(undefined);
      }
    };
  }, [widget, chartContainerRef, data, interval, ws_pool]);

  useEffect(() => {
    if (widget) {
      widget.onChartReady(() => {
        widget.applyOverrides({
          'mainSeriesProperties.visible': true,
          'mainSeriesProperties.style': 1,
          'paneProperties.backgroundType': 'solid',
          'paneProperties.background': '#121316', // Chart background color
          'paneProperties.vertGridProperties.color': '#1A1A1A', // Vertical grid lines color
          'paneProperties.horzGridProperties.color': '#1A1A1A', // Horizontal grid lines color
        });

        const savedChartState = localStorage.getItem('tradingViewDrawingState');
        if (savedChartState) widget.load(JSON.parse(savedChartState));

        widget.chart().getSeries().setChartStyleProperties(1, {
          upColor: '#31F79B',
          downColor: '#F6475D',
          borderUpColor: '#31F79B',
          borderDownColor: '#F6475D'
        });

        widget.subscribe('drawing_event', () => {
          widget.save((state: any) => {
            localStorage.setItem('tradingViewDrawingState', JSON.stringify(state));
          });
        });
        setChartReady(true);
      });
      console.log(widget)
    }
  }, [widget]);

  useEffect(() => {
    if (widget && chartReady) {
      if (onLoaded) onLoaded();
      widget.subscribe('mouse_up', handleClick);
    }
  }, [widget, chartReady]);

  return (
    <AnimatePresence>
      <motion.div
        key='chart'
        ref={chartContainerRef as any}
        className={cn('min-h-[500px] h-full w-full overflow-hidden rounded-md object-cover', chartReady ? 'opacity-100' : 'opacity-0')}
      />
    </AnimatePresence>
  );
};
