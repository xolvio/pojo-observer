declare type Model = {
    constructor: any;
    __observableId?: string;
    __proxyAttached?: boolean;
    hash?: () => string;
};
export declare function useUniqueId(): string;
declare function useObserver<T extends Model>(model: T): T;
export declare function pureObserver<T extends Model>(model: T, callback: Function): T;
export default useObserver;
