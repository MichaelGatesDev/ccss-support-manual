export interface Phone {
  /**
   * The last 4 digits of the phone number
   */
  extension: string;

  /**
   * If the phone has a display
   */
  hasDisplay: boolean;

  /**
   * If the phone has a speaker
   */
  hasSpeaker: boolean;
}
