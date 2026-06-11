

import { View, MarkdownView, TFile } from 'obsidian';


interface ViewWithFile extends View {
  file?: TFile | null;
}


interface ViewWithTFile extends View {
  file: TFile;
}


export function isViewWithFile(view: View): view is ViewWithFile {
  return 'file' in view && view.file !== undefined;
}


export function isViewWithTFile(view: View): view is ViewWithTFile {
  return isViewWithFile(view) && view.file instanceof TFile;
}


export function isMarkdownView(view: View): view is MarkdownView {
  return view.getViewType() === 'markdown';
}

export {};
