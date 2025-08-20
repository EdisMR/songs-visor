import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JsonFileInterface } from '../interface/json-file-interface';
import { DbCategoriesService } from './db-categories.service';
import { DbSongsService } from './db-songs.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private _dbSongsSvc: DbSongsService,
    private _dbCategoriesSvc: DbCategoriesService,
    private readonly _http: HttpClient
  ) {
  }

  readDatabaseFile(): Promise<JsonFileInterface> {
    /* create an input and catch file */
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';

    return new Promise((resolve, reject) => {
      fileInput.onchange = () => {
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const reader = new FileReader();

          reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result;
            if (typeof result !== 'string') {
              reject(new Error('File content is not a string'));
              return;
            }
            try {
              const jsonData = JSON.parse(result) as JsonFileInterface;
              resolve(jsonData);
            } catch {
              reject(new Error('Error parsing JSON file'));
            }
          };

          reader.onerror = () => {
            reject(new Error('Error reading file'));
          };

          reader.readAsText(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      fileInput.click();
    });
  }

  importDatabaseFromJSONData(jsonData: JsonFileInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      /* open DB */
      Promise.all([
        this._dbSongsSvc.openDatabase(),
        this._dbCategoriesSvc.openDatabase()
      ]).finally(() => {
        if (!jsonData || !jsonData.songs || !jsonData.categories) {
          reject(new Error('Invalid JSON data'));
          return;
        }
        this._dbCategoriesSvc.clearCategories()
          .then(() => this._dbSongsSvc.clearSongs())
          .then(() => this._dbCategoriesSvc.importMultipleCategories(jsonData.categories))
          .then(() => this._dbSongsSvc.importMultipleSongs(jsonData.songs))
          .then(() => resolve())
          .catch(reject);
      })
    })
  }

  importDatabaseFromServedUrl(): Observable<JsonFileInterface> {
    const urlBase: string = environment.baseUrl;
    const fileName: string = environment.songsFile;
    console.log("importDatabaseFromUrl", urlBase, fileName)
    return this._http.get<JsonFileInterface>(`${urlBase}${fileName}`, { responseType: 'json' });
  }
}
