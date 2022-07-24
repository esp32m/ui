import { debounce } from 'lodash';
import WebSocket from 'reconnecting-websocket';
import { Action, AnyAction, Dispatch, Middleware } from 'redux';

import { registerPlugin } from './plugins';

export const Name = 'backend';

interface IEsp32m {
  backend?: {
    host?: string;
  };
}

declare global {
  interface Window {
    esp32m: IEsp32m;
  }
}

const config = typeof window === 'undefined' ? undefined : window.esp32m;

/* eslint-disable @typescript-eslint/no-explicit-any*/
export type Data = any;

interface IRequestMessage {
  type: string;
  name: string;
  seq: number;
  target?: string;
  data?: Data;
}

export interface IResponse {
  name: string;
  source: string;
  partial: boolean;
  data?: Data;
}

type PendingRequestResolver = (response: IResponse) => void;
type PendingRequestRejector = (error: any) => void;
type PendingRequestPartialResponse = (response: IResponse) => void;

interface IPendingRequest {
  request: IRequestMessage;
  resolve: PendingRequestResolver;
  reject: PendingRequestRejector;
  partial: PendingRequestPartialResponse;
  promise: Promise<IResponse>;
  queued: number;
  sent?: number;
}

export const enum SocketState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}

export interface IModuleState {
  seq: number;
  stamp: number;
  data: any;
}

export interface IModuleConfig {
  seq: number;
  stamp: number;
  data: any;
}

export interface IModuleStates {
  [key: string]: IModuleState;
}

export interface IState {
  socket: SocketState;
  error?: string;
  states: IModuleStates;
  config: { [key: string]: IModuleConfig };
}

const DefaultState: IState = {
  socket: SocketState.Disconnected,
  states: {},
  config: {},
};

const url =
  'ws://' +
  (config?.backend?.host ||
    (typeof window === 'undefined' ? 'localhost' : window.location.host)) +
  '/ws';

const ws = new WebSocket(url, undefined, { startClosed: true });

const pendingRequests: { [key: number]: IPendingRequest } = {};

export const middleware: Middleware = (api) => {
  ws.onopen = () => {
    api.dispatch({ type: 'backend/connected' });
  };
  ws.onclose = () => {
    api.dispatch({ type: 'backend/connecting' });
  };
  ws.onerror = (e) => {
    api.dispatch({ type: 'backend/error', payload: e.message || e.error });
  };
  ws.onmessage = (msg: MessageEvent) => {
    const parsed = JSON.parse(msg.data);
    if (parsed) {
      const { type, ...payload } = parsed;
      api.dispatch({ type: 'backend/' + type, payload });
      if (type == 'response') {
        const pending = pendingRequests[payload.seq];
        if (pending)
          if (parsed.partial) pending.partial(parsed);
          else if (parsed.error) pending.reject(parsed.error);
          else pending.resolve(parsed);
      }
    }
  };
  return (next: Dispatch) => (action: Action) => next(action);
};

export const start = (dispatch: Dispatch): void => {
  dispatch({ type: 'backend/connecting' });
  ws.reconnect();
};

export interface IRootState {
  backend: IState;
}

export const select = (state: IRootState): IState => {
  return state && state.backend;
};

export const selectState = <T>(state: IRootState, name: string): T => {
  return state?.backend?.states?.[name]?.data;
};

export const selectConfig = <T>(state: IRootState, name: string): T => {
  return state?.backend?.config?.[name]?.data;
};

const reducer = (state = DefaultState, { type, payload }: AnyAction) => {
  switch (type) {
    case 'backend/connected':
      return { ...state, socket: SocketState.Connected };
    case 'backend/connecting':
      return { ...state, socket: SocketState.Connecting };
    case 'backend/disconnected':
      return { ...state, socket: SocketState.Disconnected };
    case 'backend/response':
      if (!payload) break;
      {
        const { name, source, data, ...rest } = payload;
        if (source && data)
          switch (name) {
            case 'state-get':
              return {
                ...state,
                states: {
                  ...state.states,
                  [source]: { stamp: Date.now(), data, ...rest },
                },
              };
            case 'config-get':
              return {
                ...state,
                config: {
                  ...state.config,
                  [source]: { stamp: Date.now(), data, ...rest },
                },
              };
          }
      }
      break;
    case 'backend/error':
      return { ...state, error: payload };
  }
  return state;
};

let seq: number = Math.floor(Math.random() * (Math.pow(2, 31) / 2));

const flushSendQueue = debounce(() => {
  const toSend = Object.values(pendingRequests).reduce((arr, pr) => {
    if (!pr.sent) {
      pr.sent = Date.now();
      arr.push(pr.request);
    }
    return arr;
  }, [] as Array<IRequestMessage>);
  if (!toSend.length) return;
  ws.send(JSON.stringify(toSend));
}, 100);

interface RequestOptions {
  timeout?: number;
}

export function request(
  target: string,
  name: string,
  data?: Data,
  options?: RequestOptions
): Promise<IResponse> {
  const existing = Object.values(pendingRequests).find(
    (pr) => pr.request.name === name && pr.request.target === target
  );
  if (existing) return existing.promise;
  seq++;
  const request: IRequestMessage = { type: 'request', target, name, seq, data };
  let resolve: PendingRequestResolver = () => undefined;
  let reject: PendingRequestRejector = () => undefined;
  let partial: PendingRequestPartialResponse = () => undefined;
  const promise = new Promise<IResponse>((resolveFn, rejectFn) => {
    const capturedSeq = seq;
    const startTimer = () =>
      setTimeout(() => {
        delete pendingRequests[capturedSeq];
        rejectFn('timeout');
      }, options?.timeout || 10000);
    let timer = startTimer();
    resolve = (response) => {
      clearTimeout(timer);
      delete pendingRequests[capturedSeq];
      resolveFn(response);
    };
    reject = (error) => {
      clearTimeout(timer);
      delete pendingRequests[capturedSeq];
      rejectFn(error);
    };
    partial = () => {
      clearTimeout(timer);
      timer = startTimer();
    };
  });
  pendingRequests[seq] = {
    request,
    resolve,
    reject,
    partial,
    promise,
    queued: Date.now(),
  };
  flushSendQueue();
  return promise;
}

export function requestState(target: string): Promise<IResponse> {
  return request(target, 'state-get');
}

export function requestConfig(target: string): Promise<IResponse> {
  return request(target, 'config-get');
}

export function setState(target: string, data?: Data): Promise<IResponse> {
  return request(target, 'state-set', data);
}

export async function setConfig(
  target: string,
  data?: Data
): Promise<IResponse> {
  const result = await request(target, 'config-set', data);
  requestConfig(target);
  return result;
}

registerPlugin({ name: Name, reducer });
