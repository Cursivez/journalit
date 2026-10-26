import type { ReviewTemplateService } from '../../services/templates/ReviewTemplateService';

interface ReloadReviewTemplatesHandlerOptions {
  service: Pick<ReviewTemplateService, 'reload'>;
  loadTemplates: () => void;
}

export function createReloadReviewTemplatesHandler({
  service,
  loadTemplates,
}: ReloadReviewTemplatesHandlerOptions): () => void {
  return () => {
    service.reload();
    loadTemplates();
  };
}
