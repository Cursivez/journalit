

import { getPluginInstance } from '../../../utils/pluginContext';


const CSS_CLASSES = {
  calendarGrid: 'journalit-calendar-grid-fix',
  calendarWeekRow: 'journalit-calendar-week-row',
  calendarWeekRowWeekdays: 'journalit-calendar-week-row-weekdays',
  calendarDayCell: 'journalit-calendar-day-cell',
  todayDayCell: 'journalit-calendar-today-cell',
  dayNumber: 'journalit-calendar-day-num',
  pnlValue: 'journalit-calendar-pnl-val',
  calendarHeader: 'journalit-calendar-header-grid',
  calendarHeaderWeekdays: 'journalit-calendar-header-weekdays',
  weekdayLabel: 'journalit-calendar-weekday-label',
  hiddenWeekend: 'journalit-calendar-hidden-weekend',
  calendarContainer: 'journalit-calendar-container-flex',
  calendarHeaderGrid: 'journalit-calendar-header-columns',
  calendarHeaderGridWeekdays: 'journalit-calendar-header-columns-weekdays',
  calendarWeekRowGrid: 'journalit-calendar-week-columns',
  calendarWeekRowGridWeekdays: 'journalit-calendar-week-columns-weekdays',
  weeklyPnlCell: 'journalit-calendar-weekly-pnl-cell',
  weekNumberPosition: 'journalit-calendar-week-num-pos',
  weeklyPnlValue: 'journalit-calendar-weekly-pnl-val',
  responsiveCell: 'journalit-calendar-responsive-cell',
  responsiveDayNumber: 'journalit-calendar-responsive-day-num',
  responsivePnlValue: 'journalit-calendar-responsive-pnl',
  responsiveTradeCount: 'journalit-calendar-responsive-trades',
  responsiveWeekNumber: 'journalit-calendar-responsive-week-num',
  responsiveWeekLabel: 'journalit-calendar-responsive-week-label',
  responsiveWeekPnl: 'journalit-calendar-responsive-week-pnl',
  responsiveWeekTrades: 'journalit-calendar-responsive-week-trades',
  weeklyPnlRelative: 'journalit-calendar-weekly-relative',
  monthLabel: 'journalit-dashboard-calendar-month-label',
};

const CALENDAR_RESPONSIVE_SIZE_CLASSES = [
  'journalit-calendar-size-xxs',
  'journalit-calendar-size-xs',
  'journalit-calendar-size-sm',
  'journalit-calendar-size-md',
  'journalit-calendar-size-lg',
  'journalit-calendar-size-xl',
  'journalit-calendar-size-xxl',
] as const;

type CalendarResponsiveSizeClass =
  (typeof CALENDAR_RESPONSIVE_SIZE_CLASSES)[number];

const CALENDAR_RESPONSIVE_STYLES = `
.journalit-calendar-grid-fix {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.journalit-calendar-week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr) 1fr;
  gap: 4px;
  margin-bottom: 4px;
  width: 100%;
  justify-content: stretch;
}

.journalit-calendar-week-row-weekdays {
  grid-template-columns: repeat(5, 1fr) 1fr;
}

.journalit-calendar-day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 4px;
  border-radius: 4px;
  width: 100%;
}

.journalit-calendar-today-cell {
  position: relative;
  z-index: 2;
}

.journalit-calendar-day-num {
  position: absolute;
  top: 4px;
  left: 4px;
  text-align: left;
}

.journalit-calendar-pnl-val {
  font-size: 14px;
  margin-top: 0;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.journalit-calendar-header-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr) 1fr;
  gap: 4px;
  margin-bottom: 8px;
  position: sticky;
  top: 0;
  background-color: var(--background-primary);
  z-index: 5;
  padding: 4px 0;
  width: 100%;
  justify-content: stretch;
}

.journalit-calendar-header-weekdays {
  grid-template-columns: repeat(5, 1fr) 1fr;
}

.journalit-calendar-weekday-label {
  width: 100%;
  text-align: center;
}

.journalit-calendar-hidden-weekend {
  display: none;
}

.journalit-calendar-container-flex {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.journalit-calendar-header-columns {
  grid-template-columns: repeat(7, 1fr) 1fr;
  width: 100%;
}

.journalit-calendar-header-columns-weekdays {
  grid-template-columns: repeat(5, 1fr) 1fr;
}

.journalit-calendar-week-columns {
  grid-template-columns: repeat(7, 1fr) 1fr;
  width: 100%;
}

.journalit-calendar-week-columns-weekdays {
  grid-template-columns: repeat(5, 1fr) 1fr;
}

.journalit-calendar-weekly-pnl-cell {
  position: relative;
  display: flex;
  flex-direction: column;
}

.journalit-calendar-week-num-pos {
  position: absolute;
  top: 4px;
  left: 4px;
  text-align: left;
  margin-bottom: 0;
}

.journalit-calendar-weekly-pnl-val {
  font-size: 12px;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.journalit-calendar-responsive-cell {
  position: relative;
  display: flex;
}

.journalit-calendar-responsive-day-num {
  position: absolute;
  top: 4px;
  left: 4px;
  text-align: left;
  font-size: clamp(0.65rem, 1.2vw, 0.85rem);
  font-weight: 500;
}

.journalit-calendar-responsive-pnl {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  margin-top: 0;
  font-size: clamp(0.7rem, 1.4vw, 1rem);
  font-weight: 600;
  text-align: center;
}

.journalit-calendar-responsive-trades {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(0.6rem, 1vw, 0.75rem);
  color: var(--text-muted);
}

.journalit-calendar-responsive-week-num,
.journalit-calendar-responsive-week-label,
.journalit-calendar-responsive-week-pnl,
.journalit-calendar-responsive-week-trades {
  font-size: clamp(0.6rem, 1vw, 0.8rem);
}

.journalit-dashboard-calendar.journalit-calendar-size-xxs .journalit-calendar-responsive-day-num {
  font-size: 8px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xxs .journalit-calendar-responsive-pnl {
  top: 40% !important;
  font-size: 7px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xxs .journalit-calendar-responsive-trades {
  top: 78% !important;
  bottom: auto !important;
  font-size: 6px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xs .journalit-calendar-responsive-day-num {
  font-size: 9px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xs .journalit-calendar-responsive-pnl {
  top: 40% !important;
  font-size: 9px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xs .journalit-calendar-responsive-trades {
  top: 78% !important;
  bottom: auto !important;
  font-size: 7px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-sm .journalit-calendar-responsive-day-num {
  font-size: 11px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-sm .journalit-calendar-responsive-pnl {
  top: 42% !important;
  font-size: 10px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-sm .journalit-calendar-responsive-trades {
  top: 75% !important;
  bottom: auto !important;
  font-size: 8px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-md .journalit-calendar-responsive-day-num {
  font-size: 12px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-md .journalit-calendar-responsive-pnl {
  top: 44% !important;
  font-size: 11px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-md .journalit-calendar-responsive-trades {
  top: 73% !important;
  bottom: auto !important;
  font-size: 9px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-lg .journalit-calendar-responsive-day-num {
  font-size: 14px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-lg .journalit-calendar-responsive-pnl {
  top: 48% !important;
  font-size: 13px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-lg .journalit-calendar-responsive-trades {
  top: 68% !important;
  bottom: auto !important;
  font-size: 11px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xl .journalit-calendar-responsive-day-num {
  font-size: 15px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xl .journalit-calendar-responsive-pnl {
  top: 48% !important;
  font-size: 14px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xl .journalit-calendar-responsive-trades {
  top: 68% !important;
  bottom: auto !important;
  font-size: 11px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xxl .journalit-calendar-responsive-day-num {
  font-size: 16px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xxl .journalit-calendar-responsive-pnl {
  top: 48% !important;
  font-size: 15px !important;
}

.journalit-dashboard-calendar.journalit-calendar-size-xxl .journalit-calendar-responsive-trades {
  top: 68% !important;
  bottom: auto !important;
  font-size: 12px !important;
}

.journalit-calendar-weekly-relative {
  position: relative;
}

.journalit-dashboard-calendar-month-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-normal);
  padding: 12px 0 8px 0;
  border-bottom: 2px solid var(--background-modifier-border);
  margin-bottom: 8px;
  margin-top: 0;
  z-index: 1;
}

.journalit-dashboard-calendar-month-label:not(:first-child) {
  margin-top: 8px;
}
`;


function injectCalendarStyles(): void {
  return;
}

function getCalendarResponsiveSizeClass(
  cellWidth: number
): CalendarResponsiveSizeClass {
  if (cellWidth < 25) return 'journalit-calendar-size-xxs';
  if (cellWidth < 30) return 'journalit-calendar-size-xs';
  if (cellWidth < 40) return 'journalit-calendar-size-sm';
  if (cellWidth < 50) return 'journalit-calendar-size-md';
  if (cellWidth > 90) return 'journalit-calendar-size-xxl';
  if (cellWidth > 80) return 'journalit-calendar-size-xl';
  return 'journalit-calendar-size-lg';
}

function applyResponsiveSizeClass(
  calendar: HTMLElement,
  firstCell: HTMLElement
): void {
  calendar.classList.remove(...CALENDAR_RESPONSIVE_SIZE_CLASSES);
  calendar.classList.add(getCalendarResponsiveSizeClass(firstCell.clientWidth));
}


function applyCalendarGridFix(): void {
  
  
  const plugin = getPluginInstance();
  const skipWeekends = plugin?.settings?.trade?.skipWeekends ?? true;

  
  const calendarGrids = document.querySelectorAll(
    '.journalit-dashboard-calendar-grid'
  );

  calendarGrids.forEach((grid) => {
    
    if (grid instanceof HTMLElement) {
      grid.classList.add(CSS_CLASSES.calendarGrid);

      
      const weekRows = grid.querySelectorAll(
        '.journalit-dashboard-calendar-week'
      );
      weekRows.forEach((weekRow) => {
        if (weekRow instanceof HTMLElement) {
          weekRow.classList.add(CSS_CLASSES.calendarWeekRow);
          if (skipWeekends) {
            weekRow.classList.add(CSS_CLASSES.calendarWeekRowWeekdays);
            weekRow.classList.add('hide-weekends');
          } else {
            weekRow.classList.remove(CSS_CLASSES.calendarWeekRowWeekdays);
            weekRow.classList.remove('hide-weekends');
          }
        }
      });

      
      const dayCells = grid.querySelectorAll(
        '.journalit-dashboard-calendar-day'
      );
      dayCells.forEach((dayCell, _index) => {
        
        if (dayCell instanceof HTMLElement) {
          dayCell.classList.add(CSS_CLASSES.calendarDayCell);

          
          if (dayCell.classList.contains('today')) {
            dayCell.classList.add(CSS_CLASSES.todayDayCell);
          }

          
          const dayNumber = dayCell.querySelector(
            '.journalit-dashboard-calendar-day-number'
          );
          if (dayNumber instanceof HTMLElement) {
            dayNumber.classList.add(CSS_CLASSES.dayNumber);
          }

          
          const pnlValue = dayCell.querySelector(
            '.journalit-dashboard-calendar-day-pnl'
          );
          if (pnlValue instanceof HTMLElement) {
            pnlValue.classList.add(CSS_CLASSES.pnlValue);
          }
        }
      });
    }
  });
}


function applyCalendarHeaderFix(): void {
  
  
  const plugin = getPluginInstance();
  const skipWeekends = plugin?.settings?.trade?.skipWeekends ?? true;

  const calendarHeaders = document.querySelectorAll(
    '.journalit-dashboard-calendar-header'
  );

  calendarHeaders.forEach((header) => {
    if (header instanceof HTMLElement) {
      
      header.classList.add(CSS_CLASSES.calendarHeader);
      if (skipWeekends) {
        header.classList.add(CSS_CLASSES.calendarHeaderWeekdays);
        header.classList.add('hide-weekends');
      } else {
        header.classList.remove(CSS_CLASSES.calendarHeaderWeekdays);
        header.classList.remove('hide-weekends');
      }

      
      
      

      
      const weekdayLabels = header.querySelectorAll(
        '.journalit-dashboard-calendar-weekday'
      );
      weekdayLabels.forEach((label) => {
        if (label instanceof HTMLElement) {
          
          label.classList.add(CSS_CLASSES.weekdayLabel);
        }
      });

      
      if (skipWeekends) {
        
        
        const weekdayLabels = header.querySelectorAll(
          '.journalit-dashboard-calendar-weekday'
        );

        weekdayLabels.forEach((label) => {
          if (label instanceof HTMLElement) {
            
            const day = label.getAttribute('data-day');
            if (day === 'Sun' || day === 'Sat') {
              label.classList.add(CSS_CLASSES.hiddenWeekend);
            } else {
              
              label.classList.remove(CSS_CLASSES.hiddenWeekend);
            }
          }
        });
      }
    }
  });
}



const calendarStyleUpdateListener = () => {
  applyCalendarGridFix();
  applyCalendarHeaderFix();
  applyCalendarCellStyling(); 
};


export function applyConsistentGridStructure(): void {
  try {
    const plugin = getPluginInstance();
    const skipWeekends = plugin?.settings?.trade?.skipWeekends ?? true;

    
    const calendars = document.querySelectorAll(
      '.journalit-dashboard-calendar'
    );

    calendars.forEach((calendar) => {
      if (calendar instanceof HTMLElement) {
        
        if (skipWeekends) {
          calendar.classList.add('hide-weekends');
          calendar.classList.add('weekends-hidden'); 

          
          const allHeaders = calendar.querySelectorAll(
            '.journalit-dashboard-calendar-weekday'
          );
          allHeaders.forEach((header) => {
            if (header instanceof HTMLElement) {
              const day = header.getAttribute('data-day');
              if (day === 'Sun' || day === 'Sat') {
                header.classList.add(CSS_CLASSES.hiddenWeekend);
              } else {
                
                header.classList.remove(CSS_CLASSES.hiddenWeekend);
              }
            }
          });
        } else {
          calendar.classList.remove('hide-weekends');
          calendar.classList.remove('weekends-hidden');

          
          const allHeaders = calendar.querySelectorAll(
            '.journalit-dashboard-calendar-weekday'
          );
          allHeaders.forEach((header) => {
            if (header instanceof HTMLElement) {
              header.classList.remove(CSS_CLASSES.hiddenWeekend);
            }
          });
        }

        
        calendar.classList.add(CSS_CLASSES.calendarContainer);

        
        const header = calendar.querySelector(
          '.journalit-dashboard-calendar-header'
        );
        if (header instanceof HTMLElement) {
          header.classList.add(CSS_CLASSES.calendarHeaderGrid);
          if (skipWeekends) {
            header.classList.add(CSS_CLASSES.calendarHeaderGridWeekdays);
          } else {
            header.classList.remove(CSS_CLASSES.calendarHeaderGridWeekdays);
          }
        }

        
        const weekRows = calendar.querySelectorAll(
          '.journalit-dashboard-calendar-week'
        );
        weekRows.forEach((row) => {
          if (row instanceof HTMLElement) {
            row.classList.add(CSS_CLASSES.calendarWeekRowGrid);
            if (skipWeekends) {
              row.classList.add(CSS_CLASSES.calendarWeekRowGridWeekdays);
            } else {
              row.classList.remove(CSS_CLASSES.calendarWeekRowGridWeekdays);
            }

            
            const weeklyPnLCells = row.querySelectorAll(
              '.journalit-dashboard-calendar-weekly-pnl'
            );
            weeklyPnLCells.forEach((cell) => {
              if (cell instanceof HTMLElement) {
                cell.classList.add(CSS_CLASSES.weeklyPnlCell);

                
                const weekNumber = cell.querySelector(
                  '.journalit-dashboard-calendar-week-number'
                );
                if (weekNumber instanceof HTMLElement) {
                  weekNumber.classList.add(CSS_CLASSES.weekNumberPosition);
                }

                
                const pnlValue = cell.querySelector(
                  '.journalit-dashboard-calendar-weekly-pnl-value'
                );
                if (pnlValue instanceof HTMLElement) {
                  pnlValue.classList.add(CSS_CLASSES.weeklyPnlValue);
                }
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error applying consistent grid structure:', error);
  }
}


export function applyCalendarCellStyling(): void {
  try {
    
    const calendarContainers = document.querySelectorAll(
      '.journalit-dashboard-calendar'
    );
    if (calendarContainers.length === 0) return;

    calendarContainers.forEach((calendar) => {
      if (!(calendar instanceof HTMLElement)) return;

      const firstCell = calendar.querySelector(
        '.journalit-dashboard-calendar-day'
      );
      if (firstCell instanceof HTMLElement) {
        applyResponsiveSizeClass(calendar, firstCell);
      }
    });

    
    const dayCells = document.querySelectorAll(
      '.journalit-dashboard-calendar-day'
    );
    dayCells.forEach((cell) => {
      if (cell instanceof HTMLElement) {
        
        cell.classList.add(CSS_CLASSES.responsiveCell);

        
        const dayNumber = cell.querySelector(
          '.journalit-dashboard-calendar-day-number'
        );
        if (dayNumber instanceof HTMLElement) {
          dayNumber.classList.add(CSS_CLASSES.responsiveDayNumber);
        }

        const pnlValue = cell.querySelector(
          '.journalit-dashboard-calendar-day-pnl'
        );
        if (pnlValue instanceof HTMLElement) {
          pnlValue.classList.add(CSS_CLASSES.responsivePnlValue);
        }

        const tradeCount = cell.querySelector(
          '.journalit-dashboard-calendar-day-trades'
        );
        if (tradeCount instanceof HTMLElement) {
          tradeCount.classList.add(CSS_CLASSES.responsiveTradeCount);
        }
      }
    });

    
    const weekPnlCells = document.querySelectorAll(
      '.journalit-dashboard-calendar-weekly-pnl'
    );
    weekPnlCells.forEach((cell) => {
      if (cell instanceof HTMLElement) {
        
        cell.classList.add(CSS_CLASSES.weeklyPnlRelative);

        
        const weekNumber = cell.querySelector(
          '.journalit-dashboard-calendar-week-number'
        );
        if (weekNumber instanceof HTMLElement) {
          weekNumber.classList.add(CSS_CLASSES.responsiveWeekNumber);
        }

        
        const weekLabel = cell.querySelector(
          '.journalit-dashboard-calendar-week-total-label'
        );
        if (weekLabel instanceof HTMLElement) {
          weekLabel.classList.add(CSS_CLASSES.responsiveWeekLabel);
        }

        
        const pnlValue = cell.querySelector(
          '.journalit-dashboard-calendar-week-total-value'
        );
        if (pnlValue instanceof HTMLElement) {
          pnlValue.classList.add(CSS_CLASSES.responsiveWeekPnl);
        }

        const tradeCount = cell.querySelector(
          '.journalit-dashboard-calendar-week-trade-count'
        );
        if (tradeCount instanceof HTMLElement) {
          tradeCount.classList.add(CSS_CLASSES.responsiveWeekTrades);
        }
      }
    });
  } catch (error) {
    console.error('Error applying calendar cell styling:', error);
  }
}


export function setupCalendarResizeObserver(): void {
  try {
    
    if (typeof ResizeObserver === 'undefined') {
      console.warn(
        'ResizeObserver not supported in this browser. Calendar responsive text might not work.'
      );
      return;
    }

    
    if (window.__journalitCalendarResizeObserver) {
      window.__journalitCalendarResizeObserver.disconnect();
    }

    let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const lastCalendarSize = new WeakMap<
      HTMLElement,
      { width: number; height: number }
    >();

    
    const resizeObserver = new ResizeObserver((entries) => {
      
      
      if (resizeTimeoutId) {
        clearTimeout(resizeTimeoutId);
      }

      resizeTimeoutId = setTimeout(() => {
        
        entries.forEach((entry) => {
          if (entry.target instanceof HTMLElement) {
            
            const rect = entry.contentRect;
            const lastSize = lastCalendarSize.get(entry.target);

            if (
              lastSize &&
              Math.abs(rect.width - lastSize.width) < 5 &&
              Math.abs(rect.height - lastSize.height) < 5
            ) {
              return; 
            }

            
            lastCalendarSize.set(entry.target, {
              width: rect.width,
              height: rect.height,
            });
          }
        });

        
        applyCalendarCellStyling();
      }, 150); 
    });

    
    window.__journalitCalendarResizeObserver = resizeObserver;

    
    const calendars = document.querySelectorAll(
      '.journalit-dashboard-calendar'
    );
    calendars.forEach((calendar) => {
      resizeObserver.observe(calendar);
    });

    
    const widgets = document.querySelectorAll('.journalit-dashboard-widget');
    widgets.forEach((widget) => {
      
      if (widget.querySelector('.journalit-dashboard-calendar')) {
        resizeObserver.observe(widget);
      }
    });

    
    const gridItems = document.querySelectorAll('.react-grid-item');
    gridItems.forEach((item) => {
      if (item.querySelector('.journalit-dashboard-calendar')) {
        resizeObserver.observe(item);
      }
    });

    
    applyCalendarCellStyling();
    setTimeout(applyCalendarCellStyling, 50);
    setTimeout(applyCalendarCellStyling, 200);
  } catch (error) {
    console.error('Error setting up calendar resize observer:', error);
  }
}


export function applyAllCalendarFixes(): void {
  try {
    

    
    applyConsistentGridStructure();
    applyCalendarGridFix();
    applyCalendarHeaderFix();
    applyCalendarCellStyling();

    
    requestAnimationFrame(() => {
      applyCalendarCellStyling();
      
      if (!window.__journalitCalendarResizeObserver) {
        setupCalendarResizeObserver();
      }
    });

    
    document.removeEventListener(
      'dashboard-styles-updated',
      calendarStyleUpdateListener
    );
    document.addEventListener(
      'dashboard-styles-updated',
      calendarStyleUpdateListener
    );
  } catch (error) {
    console.error('Error applying calendar style fixes:', error);
  }
}
