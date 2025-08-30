import { Injectable } from '@angular/core';
import { SongInterface } from '../interface/song-interface';
import { AlertifySvc } from './alertify';

@Injectable({
  providedIn: 'root'
})
export class DbSongsService {
  constructor(
    private readonly _alert: AlertifySvc
  ) {
    this.openDatabase();
  }

  private dbName = 'songsDatabase';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  public openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        if (!this.db.objectStoreNames.contains('songs')) {
          let store = this.db.createObjectStore('songs', { keyPath: 'uniqueId' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('author', 'author', { unique: false });
          store.createIndex('shortId', 'shortId', { unique: true });
        }
      };

      request.onsuccess = (event: Event) => {
        console.log('Database opened successfully:', this.dbName);
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Database error:', (event.target as IDBOpenDBRequest).error);
        this._alert.error('Error al abrir la base de datos de cantos');
        this.db = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public addSong(): Promise<SongInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const song: SongInterface = {
        uniqueId: window.crypto.randomUUID().substring(0, 8),
        shortId: window.crypto.randomUUID().substring(0, 8),
        name: '',
        author: '',
        categories: '',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        relatedLinks: '',
        songText: ''
      }

      const transaction = this.db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.add(song);

      request.onsuccess = () => {
        console.log('Song added successfully:', song);
        resolve(song);
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error adding song:', (event.target as IDBRequest).error);
        this._alert.error('Error al añadir el canto');
        reject((event.target as IDBRequest).error);
      };
    });

  }

  public getSong(id: string): Promise<SongInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readonly');
      const store = transaction.objectStore('songs');
      const request = store.get(id);


      request.onsuccess = (event: Event) => {
        console.log('Song retrieved successfully:', (event.target as IDBRequest).result);
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error retrieving song:', (event.target as IDBRequest).error);
        this._alert.error('Error al recuperar el canto');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getByshortId(shortId: string): Promise<SongInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readonly');
      const store = transaction.objectStore('songs');
      const request = store.index('shortId').get(shortId);

      request.onsuccess = (event: Event) => {
        console.log('Song retrieved successfully:', (event.target as IDBRequest).result);
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error retrieving song:', (event.target as IDBRequest).error);
        this._alert.error('Error al recuperar el canto');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getAllSongs(): Promise<SongInterface[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readonly');
      const store = transaction.objectStore('songs');
      const request = store.getAll();

      request.onsuccess = (event: Event) => {
        console.log('Songs retrieved successfully');
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error retrieving all songs:', (event.target as IDBRequest).error);
        this._alert.error('Error al recuperar todos los cantos');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public updateSong(song: SongInterface): Promise<SongInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.put(song);

      request.onsuccess = () => {
        console.log('Song updated successfully:', song);
        resolve(song);
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error updating song:', (event.target as IDBRequest).error);
        this._alert.error('Error al actualizar el canto');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public deleteSong(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Song deleted successfully:', id);
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error deleting song:', (event.target as IDBRequest).error);
        this._alert.error('Error al eliminar el canto');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public clearSongs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Songs cleared successfully');
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error clearing songs:', (event.target as IDBRequest).error);
        this._alert.error('Error al eliminar todos los cantos');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  importMultipleSongs(songs: SongInterface[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('songs', 'readwrite');
      const store = transaction.objectStore('songs');

      const promises = songs.map(song => {
        return new Promise((res, rej) => {
          const request = store.put(song);
          request.onsuccess = () => res(song);
          request.onerror = (event: Event) => rej((event.target as IDBRequest).error);
        });
      });

      Promise.all(promises)
        .then(() => {
          console.log('Songs imported successfully');
          this._alert.success('Cantos importados correctamente');
          resolve();
        })
        .catch(error => {
          console.error('⚠️ Error importing songs:', error);
          this._alert.error('Error al importar los cantos');
          reject(error);
        });
    });
  }
}
