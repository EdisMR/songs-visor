import { Injectable } from '@angular/core';
import { CategoryInterface } from '../interface/category-interface';
import { AlertifySvc } from './alertify';

@Injectable({
  providedIn: 'root'
})
export class DbCategoriesService {
  constructor(
    private readonly _alert: AlertifySvc
  ) {
    this.openDatabase();
  }

  private dbName = 'categoriesDatabase';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  public openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        if (!this.db.objectStoreNames.contains('categories')) {
          let obstore = this.db.createObjectStore('categories', { keyPath: 'uniqueId' });
          obstore.createIndex('name', 'name', { unique: false });
          obstore.createIndex('uniqueId', 'uniqueId', { unique: true });
        }
      };

      request.onsuccess = (event: Event) => {
        console.log('Database opened successfully:', this.dbName);
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('Database error:', (event.target as IDBOpenDBRequest).error);
        this._alert.error('Error al abrir la base de datos de categorías');
        this.db = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public addCategory(name: string): Promise<CategoryInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      let categoryData: CategoryInterface = {
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        name: name,
        uniqueId: window.crypto.randomUUID().substring(0, 8)
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.add(categoryData);

      request.onsuccess = () => {
        console.log('Category added successfully:', categoryData);
        resolve(categoryData);
      };

      request.onerror = (event: Event) => {
        console.error('Error adding category:', (event.target as IDBRequest).error);
        this._alert.error('Error al añadir la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getCategory(uniqueId: string): Promise<CategoryInterface | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.get(uniqueId);

      request.onsuccess = () => {
        console.log('Category retrieved successfully:', request.result);
        resolve(request.result as CategoryInterface);
      };

      request.onerror = (event: Event) => {
        console.error('Error retrieving category:', (event.target as IDBRequest).error);
        this._alert.error('Error al recuperar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getAllCategories(): Promise<CategoryInterface[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();

      request.onsuccess = () => {
        console.log('Categories retrieved successfully');
        resolve(request.result as CategoryInterface[]);
      };

      request.onerror = (event: Event) => {
        console.error('Error retrieving categories:', (event.target as IDBRequest).error);
        this._alert.error('Error al recuperar las categorías');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public updateCategory(category: CategoryInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.put(category);

      request.onsuccess = () => {
        console.log('Category updated successfully:', category);
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error updating category:', (event.target as IDBRequest).error);
        this._alert.error('Error al actualizar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public deleteCategory(uniqueId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.delete(uniqueId);

      request.onsuccess = () => {
        console.log('Category deleted successfully:', uniqueId);
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('⚠️ Error deleting category:', (event.target as IDBRequest).error);
        this._alert.error('Error al eliminar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public clearCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Categories cleared successfully');
        resolve();
      };

      request.onerror = (event: Event) => {
        console.error('Error clearing categories:', (event.target as IDBRequest).error);
        this._alert.error('Error al eliminar todas las categorías');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  importMultipleCategories(categories: CategoryInterface[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');

      const promises = categories.map(category => {
        return new Promise((res, rej) => {
          const request = store.put(category);
          request.onsuccess = () => res(category);
          request.onerror = (event: Event) => rej((event.target as IDBRequest).error);
        });
      });

      Promise.all(promises)
        .then(() => {
          console.log('Categories imported successfully');
          this._alert.success('Categorías importadas correctamente');
          resolve();
        })
        .catch(error => {
          console.error('Error importing categories:', error);
          this._alert.error('Error al importar las categorías');
          reject(error);
        });
    });
  }
}
