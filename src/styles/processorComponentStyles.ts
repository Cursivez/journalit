


const processorComponentCSS = `



.journalit-component-container {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  display: block;
  box-sizing: border-box;
}


.journalit-calendar-cell-relative {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 4px;
}

.journalit-calendar-day-number {
  position: absolute;
  top: 4px;
  left: 4px;
  text-align: left;
}

.journalit-calendar-pnl-centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  margin-top: 0;
  text-align: center;
}

.journalit-calendar-trade-count {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}


.journalit-grid-weekdays-5 {
  display: grid;
  grid-template-columns: repeat(5, 1fr) 1fr;
  gap: 4px;
}

.journalit-grid-weekdays-7 {
  display: grid;
  grid-template-columns: repeat(7, 1fr) 1fr;
  gap: 4px;
}


.journalit-calendar-responsive {
  --cell-day-number-size: 12px;
  --cell-pnl-size: 12px;
  --cell-trade-size: 10px;
}

@media (max-width: 600px) {
  .journalit-calendar-responsive {
    --cell-day-number-size: 10px;
    --cell-pnl-size: 10px;
    --cell-trade-size: 8px;
  }
}


.journalit-calendar-day {
  container-type: inline-size;
  container-name: calendar-cell;
}

@container calendar-cell (max-width: 30px) {
  .journalit-calendar-day-number { font-size: 8px; }
  .journalit-calendar-pnl-centered { font-size: 8px; }
  .journalit-calendar-trade-count { font-size: 7px; }
}

@container calendar-cell (min-width: 31px) and (max-width: 50px) {
  .journalit-calendar-day-number { font-size: 10px; }
  .journalit-calendar-pnl-centered { font-size: 10px; }
  .journalit-calendar-trade-count { font-size: 8px; }
}

@container calendar-cell (min-width: 51px) {
  .journalit-calendar-day-number { font-size: 12px; }
  .journalit-calendar-pnl-centered { font-size: 12px; }
  .journalit-calendar-trade-count { font-size: 10px; }
}
`;

export function injectProcessorComponentStyles(): void {
  return;
}

export function removeProcessorComponentStyles(): void {
  return;
}
