export interface ImageAnnotation {
  tags: string[];
  notes?: string;
}

export type ImageAnnotations = Record<string, ImageAnnotation>;
