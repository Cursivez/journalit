import type { TFile } from 'obsidian';



export interface ReviewCreationReceipt {
  readonly file: TFile;
  readonly created: boolean;
}

export interface ReviewInitialContent {
  readonly summary?: string;
  readonly reviewQuestions?: Readonly<Record<string, string>>;
  readonly goals?: readonly string[];
  
  readonly frontmatter?: Readonly<Record<string, unknown>>;
}

export type ReviewFrontmatterGuard = (
  frontmatter: Readonly<Record<string, unknown>>
) => void;

export function applyReviewInitialContent(
  frontmatter: Record<string, unknown>,
  initialContent: ReviewInitialContent | undefined,
  goalField: string,
  goalStatusField: string
): void {
  if (!initialContent) return;
  if (initialContent.summary !== undefined) {
    frontmatter.summary = initialContent.summary;
  }
  if (initialContent.reviewQuestions !== undefined) {
    frontmatter.reviewQuestions = { ...initialContent.reviewQuestions };
  }
  if (initialContent.goals !== undefined) {
    const goals = [...initialContent.goals];
    const goalStatus: Record<string, boolean> = {};
    goals.forEach((_, index) => {
      goalStatus[`goal_${index}`] = false;
    });
    frontmatter[goalField] = goals;
    frontmatter[goalStatusField] = goalStatus;
  }
  if (initialContent.frontmatter !== undefined) {
    applyReviewFrontmatterUpdates(frontmatter, {
      ...initialContent.frontmatter,
    });
  }
}

export function applyReviewFrontmatterUpdates(
  frontmatter: Record<string, unknown>,
  updates: Partial<Record<string, unknown>>
): void {
  const { imagesByWidget, ...rest } = updates;
  Object.assign(frontmatter, rest);

  if (
    imagesByWidget &&
    typeof imagesByWidget === 'object' &&
    !Array.isArray(imagesByWidget)
  ) {
    const currentImagesByWidget = frontmatter.imagesByWidget;
    const existingByWidget =
      currentImagesByWidget &&
      typeof currentImagesByWidget === 'object' &&
      !Array.isArray(currentImagesByWidget)
        ? currentImagesByWidget
        : {};
    frontmatter.imagesByWidget = {
      ...existingByWidget,
      ...imagesByWidget,
    };
  } else if (imagesByWidget !== undefined) {
    frontmatter.imagesByWidget = imagesByWidget;
  }
}
