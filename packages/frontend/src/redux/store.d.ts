declare const rootReducer: import("redux").Reducer<{
    buildings: import("./buildings/types").BuildingsState;
    images: import("./images/types").ImagesState;
}, import("redux").AnyAction>;
export declare type AppState = ReturnType<typeof rootReducer>;
export declare const store: import("redux").Store<{
    buildings: import("./buildings/types").BuildingsState;
    images: import("./images/types").ImagesState;
}, import("redux").AnyAction> & {
    dispatch: unknown;
};
export {};
