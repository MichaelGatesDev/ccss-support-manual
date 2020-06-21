/**
 * Options related to data backup
 *
 * If no options are specified, everything will be backed up
 */
export interface BackupRestoreOptions {
  /**
   * The name to assign the backup (will be the folder name)
   */
  name: string;

  /**
   * Data-related backup options
   */
  data?: DataBackupOptions;

  /**
   * Image-related backup options
   */
  images?: ImageBackupOptions;

  /**
   * Settings-related backup options
   */
  settings?: SettingsBackupOptions;
}

export interface DataBackupOptions {
  all: boolean;

  buildings?: boolean;
  rooms?: boolean;
  troubleshooting?: boolean;
}

export interface ImageBackupOptions {
  all: boolean;

  buildingImages?: boolean;

  room_equipmentImages?: boolean;
  room_panoramicImages?: boolean;
  room_titleImages?: boolean;
  room_coverImages?: boolean;
}

export interface SettingsBackupOptions {
  all: boolean;

  applicationConfig?: boolean;
  imagesConfig?: boolean;
  troubleshootingKeywordsConfig?: boolean;
}
