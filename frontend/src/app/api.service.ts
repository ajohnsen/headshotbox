import { Injectable } from '@angular/core';
import { Http, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/toPromise';

export class Player {
  steamid: string;
  name: string;
  demos: number;
  last_rank: number;
  last_timestamp: number;
  steam_info?: SteamInfo;
}

export class Players {
  player_count: number;
  players: Player[];
}

export class SteamInfo {
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  NumberOfVACBans: number;
  avatar: string;
  avatarfull: string;
  last_rank: number;
  personaname: string;
  timestamp: number;
}

export interface SteamInfoMap {
  [steamid: string]: SteamInfo;
}

function urlSearchParams(obj: any): URLSearchParams {
  let params = new URLSearchParams();
  for (let k of Object.keys(obj)) {
    params.set(k, String(obj[k]));
  }
  return params;
}

@Injectable()
export class ApiService {
  private folders: string[] = null;
  constructor(private http: Http) { }

  getPlayers(folder: string, offset: number, limit: number): Promise<Players> {
    let params = new URLSearchParams();
    params.set('offset', String(offset));
    params.set('limit', String(limit));
    if (folder !== null) {
      params.set('folder', folder);
    }
    return this.getPromise('/players', {search: params});
  }

  getSteamInfo(steamids: string[]): Promise<SteamInfoMap> {
    let params = new URLSearchParams();
    params.set('steamids', steamids.join(','));
    return this.getPromise('/steamids/info', {search: params});
  }

  getFolders(): Promise<string[]> {
    // Cache folders
    if (this.folders) {
      return new Promise(resolve => resolve(this.folders));
    } else {
      return this.getPromise('/folders').then(data => this.folders = data);
    }
  }

  getVersion(): Promise<{current: string, latest: string}> {
    return this.getPromise('/version');
  }

  getAuthorization(): Promise<{authorized: boolean, showLogin: boolean}> {
    return this.getPromise('/authorized');
  }

  private getPromise(path: string, options?: RequestOptionsArgs): Promise<any> {
    return this.http.get(environment.apiUrl + path, options).toPromise().then(r => r.json()).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}