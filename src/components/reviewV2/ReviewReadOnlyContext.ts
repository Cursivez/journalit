import { createContext, useContext } from 'react';



export const ReviewReadOnlyContext = createContext(false);

export function useReviewReadOnly(): boolean {
  return useContext(ReviewReadOnlyContext);
}
