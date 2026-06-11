

import { TimeNode } from '../../services/tradelog/types';


export function getTradeIdsInRange(
  nodes: TimeNode[],
  startId: string,
  endId: string
): string[] {
  
  const tradesWithIndices: { id: string; index: number }[] = [];
  let currentIndex = 0;

  
  function collectTrades(nodeList: TimeNode[]): void {
    for (const node of nodeList) {
      if (node.type === 'trade') {
        if (node.trade?.isCopiedTrade) {
          continue;
        }

        
        const tradeId = node.trade?.filePath || node.trade?.path;

        if (tradeId) {
          tradesWithIndices.push({ id: tradeId, index: currentIndex });
          currentIndex++;
        }
      }

      
      if (node.children && node.children.length > 0) {
        collectTrades(node.children);
      }
    }
  }

  
  collectTrades(nodes);

  
  const startIndex = tradesWithIndices.findIndex((t) => t.id === startId);
  const endIndex = tradesWithIndices.findIndex((t) => t.id === endId);

  
  if (startIndex === -1 || endIndex === -1) {
    return [];
  }

  
  const lowerIndex = Math.min(startIndex, endIndex);
  const higherIndex = Math.max(startIndex, endIndex);

  
  return tradesWithIndices.slice(lowerIndex, higherIndex + 1).map((t) => t.id);
}
