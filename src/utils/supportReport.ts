export interface SupportErrorDetails {
  message: string;
  operation: string;
  endpoint?: string;
  statusCode?: number;
  timestamp: string;
}

export interface SupportReportSection {
  title: string;
  lines: string[];
}

export const formatSupportErrorDetails = (
  details: SupportErrorDetails
): string[] => [
  `Message: ${details.message}`,
  `Operation: ${details.operation}`,
  `Endpoint: ${details.endpoint || 'Unknown'}`,
  `Status code: ${details.statusCode ?? 'Unknown'}`,
  `Time: ${details.timestamp}`,
];

export const buildSupportReport = (
  title: string,
  metaLines: string[],
  sections: SupportReportSection[] = []
): string => {
  const lines = [title, ...metaLines];

  sections.forEach((section) => {
    if (!section.lines.length) {
      return;
    }

    lines.push('', section.title, ...section.lines);
  });

  return lines.join('\n');
};
