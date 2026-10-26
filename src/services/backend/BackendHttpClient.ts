import {
  requestUrl,
  type RequestUrlParam,
  type RequestUrlResponsePromise,
} from 'obsidian';

export const JOURNALIT_PLUGIN_VERSION_HEADER = 'X-Journalit-Plugin-Version';


export class BackendHttpClient {
  private static pluginVersion: string | null = null;

  static configurePluginVersion(version: string | null): void {
    const normalized = version?.trim() ?? '';
    this.pluginVersion = normalized.length > 0 ? normalized : null;
  }

  static headers(
    providedHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const [name, value] of Object.entries(providedHeaders)) {
      if (
        name.toLowerCase() !== JOURNALIT_PLUGIN_VERSION_HEADER.toLowerCase()
      ) {
        headers[name] = value;
      }
    }
    if (this.pluginVersion) {
      headers[JOURNALIT_PLUGIN_VERSION_HEADER] = this.pluginVersion;
    }
    return headers;
  }

  static request(request: RequestUrlParam): RequestUrlResponsePromise {
    return requestUrl({
      ...request,
      headers: this.headers(request.headers),
    });
  }
}
