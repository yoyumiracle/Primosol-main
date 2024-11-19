'use client';

import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import ChevronUpDownIcon from '@heroicons/react/20/solid/ChevronUpDownIcon';
import ChevronUpIcon from '@heroicons/react/20/solid/ChevronUpIcon';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import useFilteredItems, { FilterCriterion } from '../../helpers/useFilter';
import { Order } from './Sort';
import { cn } from '../../helpers/utils';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  filter?: (key: keyof T, index: number) => React.ReactNode;
  fixed?: boolean;
  className?: string;
  headerClassName?: string;
  width?: string | number;
  header?: (key: keyof T, index: number) => React.ReactNode;
  render?: (item: T) => React.ReactNode;
}

export interface GridTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  className?: string;
  headerClassName?: string;
  gridRowClassName?: string;
  gridColClassName?: string;
  hasNextPage: boolean;
  fetchNextPage: any;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  setScrolled: any;
  scrolled: boolean;
  filters: FilterCriterion[];
  useButton?: boolean;
  sortBy?: (sort?: { key: string; order: Order }) => void; // Callback prop
  onRowSelect?: (item: T) => void;
}

function InfiniteGridTable<T>(props: GridTableProps<T>) {
  const {
    columns,
    data,
    className,
    filters,
    gridColClassName,
    gridRowClassName,
    headerClassName,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    onRowSelect,
    setScrolled,
    sortBy,
    useButton,
    scrolled,
  } = props;

  const [sortStates, setSortStates] = useState<{ [key: string]: Order }>({});
  const filteredItems = useFilteredItems(data, filters);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const gridTemplateColumns = columns.map(col => col.width).join(' ');

  const onSort = (key: string) => {
    const currentOrder = sortStates[key] || 'normal';
    let nextOrder: Order = 'desc';

    if (currentOrder === 'desc') {
      nextOrder = 'asc';
    } else if (currentOrder === 'asc') {
      nextOrder = 'normal';
    }

    let updatedSortStates = Object.keys(sortStates).reduce(
      (acc, _key) => {
        acc[key] = _key === key ? nextOrder : 'normal';
        return acc;
      },
      {} as { [key: string]: Order }
    );
    updatedSortStates = { ...updatedSortStates, [key]: nextOrder };

    setSortStates(updatedSortStates);
    sortBy && sortBy({ key, order: nextOrder });
  };

  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 38,
    overscan: 8,
  });

  useEffect(() => {
    const [firstItem] = [...rowVirtualizer.getVirtualItems()];
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (firstItem) {
      setScrolled(firstItem.index != 0);
    }

    if (!lastItem) {
      return;
    }

    if (!useButton && lastItem.index >= filteredItems.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, filteredItems.length, isFetchingNextPage, rowVirtualizer.getVirtualItems()]);

  return (
    <>
      <div className='flex h-full w-full overflow-x-auto overflow-y-auto'>
        <div className={cn(className, 'min-w-max w-full h-full flex-grow')}>
          <div className='relative grid' style={{ gridTemplateColumns }}>
            {/* Header */}
            {columns.map((col, index) => {
              const sortKey = col.key as any;
              return (
                <div
                  key={index}
                  className={cn(headerClassName, col.headerClassName, 'flex items-center gap-1 py-2 font-bold md:px-3', col.fixed ? 'sticky left-0 z-10' : '')}
                  style={col.fixed ? { left: `${index * 100}px` } : {}}>
                  {col.header ? col.header(col.key, index) : <span className='text-nowrap'>{col.title}</span>}
                  {col.sortable &&
                    (sortStates[sortKey] === 'desc' ? (
                      <ChevronDownIcon onClick={() => onSort(sortKey)} className='h-3 w-3 shrink-0 md:h-4 md:w-4' />
                    ) : sortStates[sortKey] === 'asc' ? (
                      <ChevronUpIcon onClick={() => onSort(sortKey)} className='h-3 w-3 shrink-0 md:h-4 md:w-4' />
                    ) : (
                      <ChevronUpDownIcon onClick={() => onSort(sortKey)} className='h-3 w-3 shrink-0 md:h-4 md:w-4' />
                    ))}

                  {col.filter && col.filter(col.key, index)}
                </div>
              );
            })}
          </div>
          {/* Rows */}

          <div className='relative h-full overflow-hidden'>
            <div ref={parentRef} className='custom-scrollbar h-full w-full overflow-auto contain-strict 4xl:h-[1000px]'>
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}>
                {rowVirtualizer.getVirtualItems().map(virtualRow => {
                  const isLoaderRow = virtualRow.index > data.length - 1;
                  const row = filteredItems[virtualRow.index];
                  const rowIndex = virtualRow.index;

                  return (
                    <div
                      key={rowIndex}
                      className={cn(`trade-row group grid overflow-hidden `, gridRowClassName)}
                      style={{
                        gridTemplateColumns,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onClick={() => onRowSelect && onRowSelect(row)}>
                      {columns.map((col, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={cn(
                            col.className,
                            gridColClassName,
                            'grid__item relative flex h-full items-center overflow-ellipsis whitespace-nowrap py-2.5 md:px-3',
                            col.fixed ? 'sticky left-0 z-10' : ''
                          )}
                          style={col.fixed ? { left: `${colIndex * 100}px` } : {}}>
                          {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {filteredItems && filteredItems.length === 0 && (
                <div className='flex h-[50%] w-full items-center justify-center py-5'>
                  <div className='rounded-md px-8 py-4'>No data to display</div>
                </div>
              )}

              {filteredItems && filteredItems.length > 0 && hasNextPage && useButton && (
                <div className='mt-4 flex justify-center'>
                  <button className='gap-2 !text-xs uppercase text-gray' onClick={fetchNextPage}>
                    {isFetching ? "loading" : <FaChevronDown />}
                    load-more
                  </button>
                </div>
              )}
            </div>
            {/* {isLoading && <LoadingOverlay />} */}
            <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfiniteGridTable;
