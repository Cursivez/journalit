

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { AccountCard } from './AccountCard';
import { AccountData } from '../../../services/account/types';
import { cssVars, virtualItemStyle } from '../../../styles/inlineStylePolicy';

interface VirtualizedAccountListProps {
  accounts: AccountData[];
  openAccount: (accountName: string, accountData?: AccountData) => void;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  columns?: number; 
  minColumnWidth?: number; 
}


export const VirtualizedAccountList: React.FC<VirtualizedAccountListProps> =
  React.memo(
    ({
      accounts,
      openAccount,
      itemHeight = 140, 
      containerHeight = 600, 
      overscan = 3, 
      columns, 
      minColumnWidth = 300, 
    }) => {
      const [scrollTop, setScrollTop] = useState(0);
      const [containerWidth, setContainerWidth] = useState(0);
      const scrollElementRef = useRef<HTMLDivElement>(null);

      
      const actualColumns = useMemo(() => {
        if (columns) return columns;
        if (containerWidth === 0) return 1; 
        return Math.max(1, Math.floor(containerWidth / minColumnWidth));
      }, [columns, containerWidth, minColumnWidth]);

      
      const accountRows = useMemo(() => {
        const rows: AccountData[][] = [];
        for (let i = 0; i < accounts.length; i += actualColumns) {
          rows.push(accounts.slice(i, i + actualColumns));
        }
        return rows;
      }, [accounts, actualColumns]);

      
      const visibleRange = useMemo(() => {
        const start = Math.max(
          0,
          Math.floor(scrollTop / itemHeight) - overscan
        );
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const end = Math.min(
          accountRows.length,
          start + visibleCount + overscan * 2
        );

        return { start, end };
      }, [
        scrollTop,
        itemHeight,
        containerHeight,
        accountRows.length,
        overscan,
      ]);

      
      const visibleRows = useMemo(
        () => accountRows.slice(visibleRange.start, visibleRange.end),
        [accountRows, visibleRange]
      );

      
      const handleScroll = useCallback(() => {
        if (scrollElementRef.current) {
          requestAnimationFrame(() => {
            if (scrollElementRef.current) {
              setScrollTop(scrollElementRef.current.scrollTop);
            }
          });
        }
      }, []);

      
      const totalHeight = accountRows.length * itemHeight;

      
      const offsetY = visibleRange.start * itemHeight;

      
      useEffect(() => {
        const scrollElement = scrollElementRef.current;
        if (!scrollElement) return;

        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            
            const width = entry.contentRect.width;
            setContainerWidth(width);

            
            handleScroll();
          }
        });

        resizeObserver.observe(scrollElement);

        
        setContainerWidth(scrollElement.clientWidth);

        return () => {
          resizeObserver.disconnect();
        };
      }, [handleScroll]);

      return (
        <div
          ref={scrollElementRef}
          className="virtualized-account-list"
          style={cssVars({
            '--journalit-account-list-height': `${containerHeight}px`,
          })}
          onScroll={handleScroll}
        >
          
          <div
            className="virtualized-account-list__spacer"
            style={cssVars({
              '--journalit-account-list-total-height': `${totalHeight}px`,
            })}
          >
            
            <div
              className="virtualized-account-list__rows"
              style={virtualItemStyle({
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              })}
            >
              {visibleRows.map((row, rowIndex) => (
                <div
                  key={visibleRange.start + rowIndex}
                  className="account-cards virtualized-account-list__row" 
                >
                  {row.map((account) => (
                    <AccountCard
                      key={account.id}
                      account={account}
                      onClick={() => openAccount(account.name, account)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => {
      
      return (
        prevProps.accounts === nextProps.accounts &&
        prevProps.openAccount === nextProps.openAccount &&
        prevProps.itemHeight === nextProps.itemHeight &&
        prevProps.containerHeight === nextProps.containerHeight &&
        prevProps.overscan === nextProps.overscan &&
        prevProps.columns === nextProps.columns &&
        prevProps.minColumnWidth === nextProps.minColumnWidth
      );
    }
  );

VirtualizedAccountList.displayName = 'VirtualizedAccountList';
