import { IResponse, request } from '../backend';
import { Name, IRootState, ILocalState } from './types';

export const requestConnect = (
  ssid: string,
  bssid?: string,
  password?: string
): Promise<IResponse> => request(Name, 'connect', { ssid, bssid, password });

export const requestScan = (): Promise<IResponse> => request(Name, 'scan');
export const requestDeleteAp = (id: number): Promise<IResponse> =>
  request(Name, 'delete-ap', { id });

export const select = (state: IRootState): ILocalState => state?.[Name];
