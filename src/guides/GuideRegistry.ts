import { GuideDefinition } from './types';

export class GuideRegistry {
  private guidesById = new Map<string, GuideDefinition>();
  private guidesByViewType = new Map<string, GuideDefinition[]>();

  registerGuide(definition: GuideDefinition): void {
    if (!definition.id || !definition.viewType) {
      throw new Error('Guide definition must include id and viewType');
    }

    if (!definition.steps.length) {
      throw new Error(`Guide ${definition.id} must include at least one step`);
    }

    const initialStepExists = definition.steps.some(
      (step) => step.id === definition.initialStepId
    );

    if (!initialStepExists) {
      throw new Error(
        `Guide ${definition.id} initialStepId does not exist in steps`
      );
    }

    this.guidesById.set(definition.id, definition);

    const existing = this.guidesByViewType.get(definition.viewType) || [];
    const withoutDuplicate = existing.filter(
      (guide) => guide.id !== definition.id
    );
    withoutDuplicate.push(definition);

    withoutDuplicate.sort((a, b) => {
      const aPriority = a.priority ?? Number.MAX_SAFE_INTEGER;
      const bPriority = b.priority ?? Number.MAX_SAFE_INTEGER;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      return a.id.localeCompare(b.id);
    });

    this.guidesByViewType.set(definition.viewType, withoutDuplicate);
  }

  getGuideById(guideId: string): GuideDefinition | null {
    return this.guidesById.get(guideId) ?? null;
  }

  getGuidesForView(viewType: string): GuideDefinition[] {
    return [...(this.guidesByViewType.get(viewType) || [])];
  }

  getPrimaryGuideForView(viewType: string): GuideDefinition | null {
    const guides = this.guidesByViewType.get(viewType);
    if (!guides || guides.length === 0) {
      return null;
    }

    return guides[0];
  }
}
