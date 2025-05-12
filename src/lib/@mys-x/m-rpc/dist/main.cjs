var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  MRpc: () => MRpc,
  MRpcCommonMsgPort: () => MRpcCommonMsgPort
});
module.exports = __toCommonJS(main_exports);

// node_modules/.pnpm/@jsr+okikio__transferables@1.0.2/node_modules/@jsr/okikio__transferables/src/mod.js
var TypedArray = Object.getPrototypeOf(Int8Array);
var AudioData = globalThis.AudioData;
var ImageBitmap = globalThis.ImageBitmap;
var VideoFrame = globalThis.VideoFrame;
var OffscreenCanvas = globalThis.OffscreenCanvas;
var RTCDataChannel = globalThis.RTCDataChannel;
var MessageChannel = globalThis.MessageChannel;
var ReadableStream = globalThis.ReadableStream;
var WritableStream = globalThis.WritableStream;
var TransformStream = globalThis.TransformStream;
var ReadableStreamExists = "ReadableStream" in globalThis;
var WritableStreamExists = "WritableStream" in globalThis;
var TransformStreamExists = "TransformStream" in globalThis;
var StreamExists = ReadableStreamExists && WritableStreamExists && TransformStreamExists;
var MessageChannelExists = "MessageChannel" in globalThis;
var MessagePortExists = "MessagePort" in globalThis;
var ArrayBufferExists = "ArrayBuffer" in globalThis;
var AudioDataExists = "AudioData" in globalThis;
var ImageBitmapExists = "ImageBitmap" in globalThis;
var VideoFrameExists = "VideoFrame" in globalThis;
var OffscreenCanvasExists = "OffscreenCanvas" in globalThis;
var RTCDataChannelExists = "RTCDataChannel" in globalThis;
var structuredCloneExists = "structuredClone" in globalThis;
async function isSupported() {
  async function getChannels() {
    try {
      if (!MessageChannelExists)
        return false;
      const msgChanl = new MessageChannel();
      const obj = {
        port1: msgChanl.port1
      };
      const clonedObj = structuredCloneExists ? structuredClone(obj, {
        transfer: [
          msgChanl.port1
        ]
      }) : obj;
      const messageChannel = new MessageChannel();
      const obj1 = {
        port1: clonedObj.port1
      };
      await new Promise((resolve) => {
        messageChannel.port1.postMessage(obj1, [
          obj1.port1
        ]);
        messageChannel.port1.onmessage = () => {
          resolve();
        };
        messageChannel.port2.onmessage = ({ data }) => {
          messageChannel.port2.postMessage(data, [
            data.port1
          ]);
        };
      });
      messageChannel.port1.close();
    } catch (e) {
      return false;
    }
    return true;
  }
  async function getStreams() {
    try {
      if (!StreamExists)
        return false;
      if (!MessageChannelExists && !structuredCloneExists)
        return false;
      const streams2 = {
        readonly: new ReadableStream(),
        writeonly: new WritableStream(),
        tranformonly: new TransformStream()
      };
      const clonedObj = structuredCloneExists ? structuredClone(streams2, {
        transfer: [
          streams2.readonly,
          streams2.writeonly,
          streams2.tranformonly
        ]
      }) : streams2;
      if (MessageChannelExists) {
        const messageChannel = new MessageChannel();
        const streams1 = clonedObj;
        await new Promise((resolve) => {
          messageChannel.port1.postMessage(streams1, [
            streams1.readonly,
            streams1.writeonly,
            streams1.tranformonly
          ]);
          messageChannel.port1.onmessage = () => {
            resolve();
          };
          messageChannel.port2.onmessage = ({ data }) => {
            messageChannel.port2.postMessage(data, [
              data.readonly,
              data.writeonly,
              data.tranformonly
            ].filter((x) => x !== void 0));
          };
        });
        messageChannel.port1.close();
      }
    } catch (e) {
      return false;
    }
    return true;
  }
  const [channel, streams] = await Promise.all([
    getChannels(),
    getStreams()
  ]);
  return {
    channel,
    streams
  };
}
function isObject(obj) {
  return typeof obj === "object" && obj !== null || typeof obj === "function";
}
function isTypedArray(obj) {
  return ArrayBuffer.isView(obj);
}
function isStream(obj) {
  return ReadableStreamExists && obj instanceof ReadableStream || WritableStreamExists && obj instanceof WritableStream || TransformStreamExists && obj instanceof TransformStream;
}
function isMessageChannel(obj) {
  return MessageChannelExists && obj instanceof MessageChannel;
}
function isTransferable(obj) {
  return ArrayBufferExists && obj instanceof ArrayBuffer || MessagePortExists && obj instanceof MessagePort || AudioDataExists && obj instanceof AudioData || ImageBitmapExists && obj instanceof ImageBitmap || VideoFrameExists && obj instanceof VideoFrame || OffscreenCanvasExists && obj instanceof OffscreenCanvas || RTCDataChannelExists && obj instanceof RTCDataChannel;
}
function getTransferables(obj, streams = false, maxCount = 1e4) {
  const result = /* @__PURE__ */ new Set([]);
  const queues = [
    [
      obj
    ]
  ];
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    const len = queue.length;
    for (let j = 0; j < len; j++) {
      const item = queue[j];
      if (isTypedArray(item)) {
        result.add(item.buffer);
      } else if (isTransferable(item) || streams && isStream(item)) {
        result.add(item);
      } else if (isMessageChannel(item)) {
        result.add(item.port1);
        result.add(item.port2);
      } else if (!isStream(item) && isObject(item)) {
        const values = Array.isArray(item) ? item : Object.values(item);
        if (values.length)
          queues.push(values);
      }
      if (--maxCount <= 0)
        break;
    }
  }
  return Array.from(result);
}

// src/utils.ts
var transferableSupportFlags = isSupported();
async function getTransferables2(obj) {
  const streamsFlag = (await transferableSupportFlags).streams;
  return getTransferables(obj, streamsFlag);
}
function isMRpcCallMsg(val) {
  return (val == null ? void 0 : val.type) === "call";
}
function isMRpcRetMsg(val) {
  return (val == null ? void 0 : val.type) === "ret";
}
function jsonSerializer(msg) {
  if ("err" in msg && msg.err instanceof Error) {
    msg.err = msg.err.toString();
  }
  return JSON.stringify(msg);
}

// src/ports.ts
function onMsg(port, listener) {
  const evtName = "message";
  if (isMessagePort(port) || isWorker(port) || isWorkerGlobalScope(port)) {
    const l = (e) => listener(e.data);
    port.addEventListener(evtName, l);
    return () => port.removeEventListener(evtName, l);
  } else if (isNodeWorkerOrNodeMessagePort(port)) {
    const l = (msg) => listener(msg);
    port.on(evtName, l);
    return () => port.off(evtName, l);
  } else if (isWebSocket(port)) {
    const l = (e) => listener(JSON.parse(e.data));
    port.addEventListener(evtName, l);
    return () => port.removeEventListener(evtName, l);
  } else if (port instanceof MRpcCommonMsgPort) {
    const l = (e) => listener(port.deserializer(e.data));
    port.addEventListener(evtName, l);
    return () => port.removeEventListener(evtName, l);
  } else {
    throw new Error("Invalid port type.", { cause: port });
  }
}
async function sendMsg(options) {
  const { port, msg, transfer: tf, nodeTransfer: ntf, ctx } = options;
  if (isMessagePort(port) || isWorker(port) || isWorkerGlobalScope(port)) {
    const transfer = !tf ? void 0 : tf === true ? await getTransferables2(ctx) : Array.isArray(tf) ? tf : ctx && tf(ctx);
    port.postMessage(msg, { transfer });
  } else if (isNodeWorkerOrNodeMessagePort(port)) {
    const nodeTransfer = !ntf ? void 0 : Array.isArray(ntf) ? ntf : ctx && ntf(ctx);
    port.postMessage(msg, nodeTransfer);
  } else if (isWebSocket(port)) {
    port.send(jsonSerializer(msg));
  } else if (port instanceof MRpcCommonMsgPort) {
    port.postMessage(port.serializer(msg));
  } else {
    throw new Error("Invalid port type.", { cause: port });
  }
}
var MRpcCommonMsgPort = class {
  postMessage;
  addEventListener;
  removeEventListener;
  serializer;
  deserializer;
  constructor(options) {
    const {
      serializer = "json",
      deserializer = "json"
    } = options;
    this.postMessage = options.postMessage;
    this.addEventListener = options.addEventListener;
    this.removeEventListener = options.removeEventListener;
    this.serializer = serializer === "json" ? (data) => jsonSerializer(data) : serializer === "as-is" ? (data) => data : serializer;
    this.deserializer = deserializer === "json" ? (data) => JSON.parse(data) : deserializer === "as-is" ? (data) => data : deserializer;
  }
};
function isMessagePort(port) {
  return "MessagePort" in globalThis && port instanceof MessagePort && !("on" in port);
}
function isWebSocket(port) {
  return "WebSocket" in globalThis && port instanceof WebSocket;
}
function isWorker(port) {
  return "Worker" in globalThis && port instanceof Worker;
}
function isWorkerGlobalScope(port) {
  return port === globalThis;
}
function isNodeWorkerOrNodeMessagePort(port) {
  return "postMessage" in port && "on" in port && "off" in port;
}

// src/mrpc.ts
var MRpc = class _MRpc {
  /* -------------------------------------------------- properties -------------------------------------------------- */
  static #NAMESPACE_DEFAULT = "0";
  static #NAMESPACE_INTERNAL = "#";
  static #ports = /* @__PURE__ */ new WeakMap();
  #port;
  #namespace;
  #callOptions;
  #defineOptions;
  #localFns = /* @__PURE__ */ new Map();
  // name -> LocalFnInfo
  #remoteCalls = /* @__PURE__ */ new Map();
  // key -> RemoteCallInfo
  #onDisposedCallbacks = /* @__PURE__ */ new Set();
  #callCnt = 0;
  // call counter
  #disposed = false;
  get namespace() {
    return this.#namespace;
  }
  get disposed() {
    return this.#disposed;
  }
  /* -------------------------------------------------- constructor -------------------------------------------------- */
  constructor(port, options = {}) {
    const {
      namespace = _MRpc.#NAMESPACE_DEFAULT,
      callOptions = {},
      defineOptions = {}
    } = options;
    this.#port = port;
    this.#namespace = namespace;
    this.#callOptions = callOptions;
    this.#defineOptions = defineOptions;
    this.#init();
  }
  /* -------------------------------------------------- public methods -------------------------------------------------- */
  /**
   * Define a local function.
   */
  defineLocalFn(name, fn, options) {
    const {
      transfer = false,
      nodeTransfer
    } = {
      ...this.#defineOptions,
      ...options
    };
    if (this.#localFns.has(name)) {
      throw new Error(`The function name "${name}" has already been defined.`);
    }
    this.#localFns.set(name, { fn, transfer, nodeTransfer });
  }
  /**
   * Define local functions.
   */
  defineLocalFns(fns, options) {
    for (const [name, fn] of Object.entries(fns)) {
      this.defineLocalFn(name, fn, options == null ? void 0 : options[name]);
    }
  }
  /**
   * Call a remote function.
   */
  callRemoteFn(name, args, options = {}) {
    const {
      timeout = 3e3,
      retry = 0,
      transfer = false,
      nodeTransfer
    } = {
      ...this.#callOptions,
      ...options
    };
    const key = ++this.#callCnt;
    const ret = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.#remoteCalls.delete(key);
        if (retry > 0) {
          this.callRemoteFn(name, args, {
            ...options,
            retry: retry - 1
          }).then(resolve, reject);
        } else {
          reject(
            new Error(`The call of the remote function "${name}" timed out.`)
          );
        }
      }, timeout);
      this.#remoteCalls.set(key, {
        resolve: (ret2) => {
          clearTimeout(timeoutId);
          resolve(ret2);
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      });
    });
    sendMsg({
      port: this.#port,
      msg: {
        type: "call",
        ns: this.#namespace,
        key,
        name,
        args
      },
      ctx: { args },
      transfer,
      nodeTransfer
    });
    return ret;
  }
  /**
   * Use a remote function.
   */
  useRemoteFn(name, options) {
    return (...args) => this.callRemoteFn(name, args, options);
  }
  /**
   * Use remote functions.
   */
  useRemoteFns(options) {
    const fns = new Proxy({}, {
      get: (target, name) => {
        if (typeof name !== "string") {
          throw new Error(`The name is not a string.`, { cause: name });
        }
        if (target[name]) {
          return target[name];
        }
        const fn = this.useRemoteFn(name, options == null ? void 0 : options[name]);
        target[name] = fn;
        return fn;
      }
    });
    return fns;
  }
  /**
   * Get the names of the local functions.
   */
  getLocalFnNames() {
    return Array.from(this.#localFns.keys());
  }
  /**
   * Get the names of the remote functions.
   */
  getRemoteFnNames() {
    const internalMrpc = this.#ensureInternalMRpc();
    return internalMrpc.callRemoteFn("$names", [
      this.#namespace
    ]);
  }
  /**
   * Add an onDisposed callback.
   */
  onDisposed(cb) {
    this.#disposed ? cb() : this.#onDisposedCallbacks.add(cb);
  }
  /**
   * Dispose the MRpc instance. The port won't be stopped.
   */
  dispose() {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    _MRpc.#deletePortNamespace(this.#port, this.#namespace);
    for (const cb of this.#onDisposedCallbacks) {
      cb();
    }
    this.#onDisposedCallbacks.clear();
  }
  /* -------------------------------------------------- private methods -------------------------------------------------- */
  #ensureInternalMRpc() {
    return _MRpc.ensureMRpc(this.#port, _MRpc.#NAMESPACE_INTERNAL);
  }
  #init() {
    _MRpc.#addPortNamespace(this.#port, this.#namespace, this);
    this.#ensureInternalMRpc();
    if (this.#namespace === _MRpc.#NAMESPACE_INTERNAL) {
      const internalFns = {
        $names: (namespace) => {
          var _a;
          return (_a = _MRpc.getMRpc(this.#port, namespace)) == null ? void 0 : _a.getLocalFnNames();
        }
      };
      this.defineLocalFns(internalFns);
    }
    this.#startListening();
  }
  #startListening() {
    const listener = async (msg) => {
      if (isMRpcCallMsg(msg)) {
        const { ns, name, key, args } = msg;
        if (ns !== this.#namespace) {
          return;
        }
        const localFnInfo = this.#localFns.get(name);
        if (!localFnInfo) {
          sendMsg({
            port: this.#port,
            msg: {
              type: "ret",
              ns: this.#namespace,
              name,
              key,
              err: new Error(`The function name "${name}" is not defined.`)
            }
          });
          return;
        }
        const { fn, transfer, nodeTransfer } = localFnInfo;
        try {
          const ret = await fn(...args);
          sendMsg({
            port: this.#port,
            msg: {
              type: "ret",
              ns: this.#namespace,
              name,
              key,
              ret
            },
            ctx: { ret },
            transfer,
            nodeTransfer
          });
        } catch (err) {
          sendMsg({
            port: this.#port,
            msg: {
              type: "ret",
              ns: this.#namespace,
              name,
              key,
              err: err instanceof Error ? err : String(err)
            }
          });
        }
      } else if (isMRpcRetMsg(msg)) {
        const { ns, name, key, ret, err } = msg;
        if (ns !== this.#namespace) {
          return;
        }
        const remoteCallInfo = this.#remoteCalls.get(key);
        if (!remoteCallInfo) {
          return;
        }
        const { resolve, reject } = remoteCallInfo;
        if (!err) {
          resolve(ret);
        } else {
          reject(
            new Error(
              `The remote threw an error when calling the function "${name}".`,
              { cause: err }
            )
          );
        }
        this.#remoteCalls.delete(key);
      }
    };
    const stop = onMsg(this.#port, listener);
    this.onDisposed(() => {
      stop();
    });
  }
  /* -------------------------------------------------- static methods -------------------------------------------------- */
  static ensureMRpc(port, namespace = _MRpc.#NAMESPACE_DEFAULT) {
    return _MRpc.getMRpc(port, namespace) || new _MRpc(port, { namespace });
  }
  static getMRpc(port, namespace = _MRpc.#NAMESPACE_DEFAULT) {
    return _MRpc.#ensurePortStates(port).namespaces.get(namespace);
  }
  static #addPortNamespace(port, namespace, mrpc) {
    const { namespaces } = _MRpc.#ensurePortStates(port);
    if (namespaces.has(namespace)) {
      throw new Error(
        `The namespace "${namespace}" has already been used by another MRpc instance on this port.`
      );
    }
    namespaces.set(namespace, mrpc);
  }
  static #deletePortNamespace(port, namespace) {
    const { namespaces } = _MRpc.#ensurePortStates(port);
    namespaces.delete(namespace);
  }
  static #ensurePortStates(port) {
    let states = _MRpc.#ports.get(port);
    if (!states) {
      states = {
        namespaces: /* @__PURE__ */ new Map()
      };
      _MRpc.#ports.set(port, states);
    }
    return states;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MRpc,
  MRpcCommonMsgPort
});
