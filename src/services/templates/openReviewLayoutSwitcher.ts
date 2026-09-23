import { Notice, TFile } from 'obsidian';
import type JournalitPlugin from '../../main';
import { t } from '../../lang/helpers';
import type { ReviewTemplate } from '../../types/reviewV2';

interface ReviewLayoutContext {
  templateType: ReviewTemplate['type'];
  displayType: string;
  defaultTemplateId: string | undefined;
}

function getStringValue(
  record: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
}

function resolveReviewLayoutContext(
  plugin: JournalitPlugin,
  noteType: string | undefined
): ReviewLayoutContext | undefined {
  switch (noteType) {
    case 'drc':
      return {
        templateType: 'drc',
        displayType: t('template.review-type.drc'),
        defaultTemplateId: plugin.settings.templates?.defaultDrc,
      };
    case 'weekly-review':
      return {
        templateType: 'weekly',
        displayType: t('template.review-type.weekly'),
        defaultTemplateId: plugin.settings.templates?.defaultWeekly,
      };
    case 'monthly-review':
      return {
        templateType: 'monthly',
        displayType: t('template.review-type.monthly'),
        defaultTemplateId: plugin.settings.templates?.defaultMonthly,
      };
    case 'quarterly-review':
      return {
        templateType: 'quarterly',
        displayType: t('template.review-type.quarterly'),
        defaultTemplateId: plugin.settings.templates?.defaultQuarterly,
      };
    case 'yearly-review':
      return {
        templateType: 'yearly',
        displayType: t('template.review-type.yearly'),
        defaultTemplateId: plugin.settings.templates?.defaultYearly,
      };
    default:
      return undefined;
  }
}

export async function openReviewLayoutSwitcher(
  plugin: JournalitPlugin,
  filePath: string
): Promise<void> {
  try {
    const file = plugin.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      new Notice(t('notice.error.file-not-found', { path: filePath }));
      return;
    }

    const cachedFrontmatter =
      plugin.app.metadataCache.getFileCache(file)?.frontmatter;
    const frontmatter =
      cachedFrontmatter &&
      typeof cachedFrontmatter === 'object' &&
      !Array.isArray(cachedFrontmatter)
        ? cachedFrontmatter
        : undefined;
    const context = resolveReviewLayoutContext(
      plugin,
      getStringValue(frontmatter, 'type')
    );

    if (!context) {
      new Notice(t('notice.error.no-template-support'));
      return;
    }

    const [{ ReviewTemplateService }, { openTemplatePickerModal }] =
      await Promise.all([
        import('./ReviewTemplateService'),
        import('../../components/modals/TemplatePickerModal'),
      ]);
    const templateService = new ReviewTemplateService(plugin);
    const templates = templateService.getTemplates(context.templateType);
    if (templates.length === 0) {
      new Notice(t('notice.error.no-templates'));
      return;
    }

    openTemplatePickerModal(
      plugin.app,
      templates,
      getStringValue(frontmatter, 'templateId'),
      t('template.switch-review-title', { type: context.displayType }),
      async (template) => {
        if (template.type === 'trade') return;

        try {
          const { TemplateTransformationService } =
            await import('./TemplateTransformationService');
          const transformService = new TemplateTransformationService(plugin);
          const success = await transformService.applyTemplate(
            file.path,
            template,
            true
          );

          if (success) {
            new Notice(t('notice.template-switched', { name: template.name }));
          }
        } catch (error) {
          console.error('Failed to switch review layout:', error);
          new Notice(
            t('notice.error.switch-template', {
              error: error instanceof Error ? error.message : String(error),
            })
          );
        }
      },
      context.defaultTemplateId
    );
  } catch (error) {
    console.error('Failed to open review layout switcher:', error);
    new Notice(
      t('notice.error.switch-template', {
        error: error instanceof Error ? error.message : String(error),
      })
    );
  }
}
