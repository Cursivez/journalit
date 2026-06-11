

const REACT_VIEW_STYLES = `
  
  .react-view-container {
    height: 100% !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
  }

  
  .react-view-container > .view-content {
    padding: 0 !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
  }

  
  .react-view-container > .view-content > .journalit-react-view-root {
    display: flex;
    flex-direction: column;
    overflow: visible;
    flex: 1 1 auto !important;
    min-height: 0;
  }
`;


function injectReactViewStyles(): void {
  return;
}


export function ensureReactViewStyles(): void {}
