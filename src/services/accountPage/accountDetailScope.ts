import type { AccountData } from '../account/types';
import type { TradeType } from '../tradelog/types';


export function accountDetailTradeTypes(
  account?: Pick<AccountData, 'propChallenge'>
): TradeType[] {
  return account?.propChallenge ? ['regular'] : ['regular', 'backtest'];
}
