/**
 * Options related to data backup
 * 
 * If no options are specified, everything will be backed up
 */
export interface BackupOptions {
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
    buildings?: boolean;
    rooms?: boolean;
    troubleshooting?: boolean;
}

export interface ImageBackupOptions {
    buildingImages?: boolean;

    room_equipmentImages?: boolean;
    room_panoramicImages?: boolean;
    room_titleImages?: boolean;
    room_coverImages?: boolean;
}

export interface SettingsBackupOptions {
    applicationConfig?: boolean;
    imagesConfig?: boolean;
    classroomChecksSpreadsheetConfig?: boolean;
}
