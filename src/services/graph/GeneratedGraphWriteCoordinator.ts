import type JournalitPlugin from '../../main';
import { frontmatterSignature, normalizeFrontmatter } from './graphTypes';

type GeneratedMetadataMatch = 'none' | 'source' | 'generated' | 'external';

export class GeneratedGraphWriteCoordinator {
  private pendingPaths = new Set<string>();
  private projectedFrontmatterByPath = new Map<
    string,
    Record<string, unknown>
  >();
  private generatedSignaturesByPath = new Map<string, string>();
  private sourceSignaturesByPath = new Map<string, string>();
  private ignoredFileWatcherModifyPaths = new Set<string>();

  constructor(private readonly plugin: JournalitPlugin) {}

  public begin(filePath: string, source: Record<string, unknown>): void {
    this.pendingPaths.add(filePath);
    this.sourceSignaturesByPath.set(filePath, frontmatterSignature(source));
  }

  public armFileWatcher(filePath: string): void {
    if (this.ignoredFileWatcherModifyPaths.has(filePath)) return;
    const backend =
      this.plugin.serviceManager.getBackendIntegrationServiceIfInitialized();
    if (!backend) return;
    this.ignoredFileWatcherModifyPaths.add(filePath);
    backend.ignoreNextFileModification(filePath);
  }

  public capture(
    filePath: string,
    frontmatter: Record<string, unknown>
  ): Record<string, unknown> {
    const normalized = normalizeFrontmatter(frontmatter);
    this.projectedFrontmatterByPath.set(filePath, normalized);
    this.generatedSignaturesByPath.set(
      filePath,
      frontmatterSignature(normalized)
    );
    return normalized;
  }

  public sourceChanged(
    filePath: string,
    frontmatter: Record<string, unknown>
  ): boolean {
    return (
      frontmatterSignature(frontmatter) !==
      this.sourceSignaturesByPath.get(filePath)
    );
  }

  public inspect(
    filePath: string,
    frontmatter: Record<string, unknown> | undefined
  ): GeneratedMetadataMatch {
    if (!this.pendingPaths.has(filePath)) return 'none';
    if (!frontmatter) return 'external';
    const signature = frontmatterSignature(frontmatter);
    if (signature === this.sourceSignaturesByPath.get(filePath))
      return 'source';
    if (signature === this.generatedSignaturesByPath.get(filePath)) {
      return 'generated';
    }
    return 'external';
  }

  public getProjectedFrontmatter(
    filePath: string
  ): Record<string, unknown> | undefined {
    const projected = this.projectedFrontmatterByPath.get(filePath);
    return projected ? { ...projected } : undefined;
  }

  public isPending(filePath: string): boolean {
    return this.pendingPaths.has(filePath);
  }

  public getGeneratedSignature(filePath: string): string | undefined {
    return this.generatedSignaturesByPath.get(filePath);
  }

  public acknowledge(filePath: string): void {
    this.clearTracking(filePath);
    this.ignoredFileWatcherModifyPaths.delete(filePath);
  }

  public fail(filePath: string): void {
    this.clearTracking(filePath);
    this.cancelIgnoredModify(filePath);
  }

  public releaseExternal(filePath: string): void {
    this.clearTracking(filePath);
    this.cancelIgnoredModify(filePath);
  }

  public releaseUninitialized(filePath: string): void {
    this.cancelIgnoredModify(filePath);
  }

  public clearTracking(filePath: string): void {
    this.pendingPaths.delete(filePath);
    this.projectedFrontmatterByPath.delete(filePath);
    this.generatedSignaturesByPath.delete(filePath);
    this.sourceSignaturesByPath.delete(filePath);
  }

  public destroy(): void {
    for (const path of this.ignoredFileWatcherModifyPaths) {
      this.plugin.serviceManager
        .getBackendIntegrationServiceIfInitialized()
        ?.cancelIgnoredFileModification(path);
    }
    this.ignoredFileWatcherModifyPaths.clear();
    this.pendingPaths.clear();
    this.projectedFrontmatterByPath.clear();
    this.generatedSignaturesByPath.clear();
    this.sourceSignaturesByPath.clear();
  }

  private cancelIgnoredModify(filePath: string): void {
    if (!this.ignoredFileWatcherModifyPaths.delete(filePath)) return;
    this.plugin.serviceManager
      .getBackendIntegrationServiceIfInitialized()
      ?.cancelIgnoredFileModification(filePath);
  }
}
