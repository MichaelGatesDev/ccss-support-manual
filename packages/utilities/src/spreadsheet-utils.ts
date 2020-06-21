export class SpreadsheetUtils {
  public static GooglePattern = /([A-Za-z0-9\-\\_]{44})/g;

  public static stripGoogleID(url: string): string | undefined {
    const matches = url.match(SpreadsheetUtils.GooglePattern);
    if (matches == null || matches.length === 0) {
      return undefined;
    }
    const firstGroup = matches[0];
    return firstGroup;
  }
}
