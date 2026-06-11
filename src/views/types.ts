

import { View } from 'obsidian';
import { ReactNode } from 'react';


export interface ReactViewConfig {
  
  containerClass?: string;
  
  rootId?: string;
  
  displayPolicyPrivacyModeOverride?: boolean;
}


export type RenderFunction = () => ReactNode;


declare module 'obsidian' {
  interface WorkspaceLeaf {
    view: View;
  }
}

export {};
