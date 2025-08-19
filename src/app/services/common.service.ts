import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CategoryInterface } from '../interface/category-interface';
import { JsonFileInterface } from '../interface/json-file-interface';
import { SongInterface } from '../interface/song-interface';
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

  downloadDatabase(songs: SongInterface[], categories: CategoryInterface[]) {
    let downloadableFile: JsonFileInterface = {
      version: "1.0.0",
      lastUpdate: new Date().toISOString(),
      creationDate: "2025-08-06T13:29:55.704Z",
      songs: songs,
      categories: categories
    }

    const fileName = 'songs-database.json';
    const jsonString = JSON.stringify(downloadableFile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    });
  }

  verifyDatabaseFileVersion(): Observable<any> {
    const urlBase: string = environment.baseUrl;
    const fileName: string = environment.hashSongsFile;
    console.log("verifyDatabaseFileVersion", urlBase, fileName)
    return this._http.get(`${urlBase}${fileName}`)
  }

  importDatabaseFromUrl(): Observable<JsonFileInterface> {
    const urlBase: string = environment.baseUrl;
    const fileName: string = environment.songsFile;
    console.log("importDatabaseFromUrl", urlBase, fileName)
    return this._http.get<JsonFileInterface>(`${urlBase}${fileName}`, { responseType: 'json' });
  }
}
