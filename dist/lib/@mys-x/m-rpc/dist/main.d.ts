declare class MRpcCommonMsgPort {
    postMessage: MRpcCommonMsgPortOptions["postMessage"];
    addEventListener: MRpcCommonMsgPortOptions["addEventListener"];
    removeEventListener: MRpcCommonMsgPortOptions["removeEventListener"];
    serializer: (data: any) => any;
    deserializer: (data: any) => any;
    constructor(options: MRpcCommonMsgPortOptions);
}

type AnyFn = (...args: any[]) => any;
type AwaitedRet<FN extends AnyFn> = Awaited<ReturnType<FN>>;
type RemoteRet<FN extends AnyFn> = Promise<AwaitedRet<FN>>;
type RemoteFn<FN extends AnyFn> = (...args: Parameters<FN>) => RemoteRet<FN>;
type RemoteFns<FNS extends Record<string, AnyFn>> = {
    [P in keyof FNS]: RemoteFn<FNS[P]>;
};
/**
 * The options for MRpcCommonMsgPort.
 */
interface MRpcCommonMsgPortOptions {
    postMessage: (message: any) => void;
    addEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
    removeEventListener: (type: "message", listener: (event: MessageEvent) => void) => void;
    /**
     * @default "json"
     */
    serializer?: "json" | "as-is" | ((data: any) => any);
    /**
     * @default "json"
     */
    deserializer?: "json" | "as-is" | ((data: any) => any);
}
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope
 */
interface WorkerGlobalScope {
    self: WorkerGlobalScope;
    postMessage: Worker["postMessage"];
    addEventListener: Worker["addEventListener"];
    removeEventListener: Worker["removeEventListener"];
}
interface NodeWorkerOrNodeMessagePort {
    postMessage(value: any, transferList?: any[]): void;
    on(event: "message", listener: (value: any) => void): NodeWorkerOrNodeMessagePort;
    off(event: "message", listener: (value: any) => void): NodeWorkerOrNodeMessagePort;
}
/**
 * The message port for MRpc.
 */
type MRpcMsgPort = MessagePort | WebSocket | Worker | WorkerGlobalScope | NodeWorkerOrNodeMessagePort | MRpcCommonMsgPort;
/**
 * The options for remote function calls.
 */
interface MRpcCallOptions<FN extends AnyFn = AnyFn> {
    /**
     * The timeout for remote function calls in milliseconds.
     * @default 3000
     */
    timeout?: number;
    /**
     * The number of retries for timed out remote function calls.
     * @default 0
     */
    retry?: number;
    /**
     * The transferable objects. Available for MessagePort, Worker and WorkerGlobalScope.
     * @default false
     */
    transfer?: boolean | Transferable[] | ((ctx: {
        args: Parameters<FN>;
    }) => Transferable[]);
    /**
     * The transferable objects for Node.js Worker.
     * @default undefined
     */
    nodeTransfer?: any[] | ((ctx: {
        args: Parameters<FN>;
    }) => any[]);
}
/**
 * The options for local function definitions.
 */
interface MRpcDefineOptions<FN extends AnyFn = AnyFn> {
    /**
     * The transferable objects. Available for MessagePort, Worker and WorkerGlobalScope.
     * @default false
     */
    transfer?: boolean | Transferable[] | ((ctx: {
        ret: ReturnType<FN>;
    }) => Transferable[]);
    /**
     * The transferable objects for Node.js Worker.
     * @default undefined
     */
    nodeTransfer?: any[] | ((ctx: {
        ret: ReturnType<FN>;
    }) => any[]);
}
/**
 * The options for MRpc constructor.
 */
interface MRpcOptions {
    /**
     * The namespace of the MRpc instance.
     * @default "default"
     */
    namespace?: string;
    /**
     * The options for remote function calls. Same as the options passed to `callRemoteFn`, but it's priority is lower.
     */
    callOptions?: MRpcCallOptions;
    /**
     * The options for local function definitions. Same as the options passed to `defineLocalFn`, but it's priority is lower.
     */
    defineOptions?: MRpcDefineOptions;
}

/**
 * The agent for message based remote procedure calls.
 */
declare class MRpc {
    #private;
    get namespace(): string;
    get disposed(): boolean;
    constructor(port: MRpcMsgPort, options?: MRpcOptions);
    /**
     * Define a local function.
     */
    defineLocalFn<FN extends AnyFn>(name: string, fn: FN, options?: MRpcDefineOptions<FN>): void;
    /**
     * Define local functions.
     */
    defineLocalFns<FNS extends Record<string, AnyFn>>(fns: FNS, options?: {
        [K in keyof FNS]?: MRpcDefineOptions<FNS[K]>;
    }): void;
    /**
     * Call a remote function.
     */
    callRemoteFn<FN extends AnyFn>(name: string, args: Parameters<FN>, options?: MRpcCallOptions<FN>): RemoteRet<FN>;
    /**
     * Use a remote function.
     */
    useRemoteFn<FN extends AnyFn>(name: string, options?: MRpcCallOptions<FN>): RemoteFn<FN>;
    /**
     * Use remote functions.
     */
    useRemoteFns<FNS extends Record<string, AnyFn>>(options?: {
        [K in keyof FNS]?: MRpcCallOptions<FNS[K]>;
    }): RemoteFns<FNS>;
    /**
     * Get the names of the local functions.
     */
    getLocalFnNames(): string[];
    /**
     * Get the names of the remote functions.
     */
    getRemoteFnNames(): Promise<string[] | undefined>;
    /**
     * Add an onDisposed callback.
     */
    onDisposed(cb: () => void): void;
    /**
     * Dispose the MRpc instance. The port won't be stopped.
     */
    dispose(): void;
    static ensureMRpc(port: MRpcMsgPort, namespace?: string): MRpc;
    static getMRpc(port: MRpcMsgPort, namespace?: string): MRpc | undefined;
}

export { MRpc, type MRpcCallOptions, MRpcCommonMsgPort, type MRpcCommonMsgPortOptions, type MRpcDefineOptions, type MRpcMsgPort, type MRpcOptions, type NodeWorkerOrNodeMessagePort, type RemoteFn, type RemoteFns, type WorkerGlobalScope };
