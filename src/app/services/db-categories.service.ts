import { Injectable } from '@angular/core';
import { CategoryInterface } from '../interface/category-interface';
import { Logger } from './logger';

@Injectable({
  providedIn: 'root'
})
export class DbCategoriesService {
  constructor(
    private readonly _logger: Logger
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
        this._logger.log('Database opened successfully: ' + this.dbName);
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event: Event) => {
        this._logger.log('⚠️ Database error: ' + (event.target as IDBOpenDBRequest).error);
        console.error('Database error:', (event.target as IDBOpenDBRequest).error);
        window.alert('Error al abrir la base de datos de categorías');
        this.db = null;
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  public addCategory(name: string): Promise<CategoryInterface> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
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
        this._logger.log('✅ Category added successfully: ' + categoryData.uniqueId+' - '+categoryData.name);
        console.log('Category added successfully:', categoryData);
        window.alert('Categoría añadida correctamente');
        resolve(categoryData);
      };

      request.onerror = (event: Event) => {
        this._logger.log('Error adding category: ' + (event.target as IDBRequest).error);
        console.error('Error adding category:', (event.target as IDBRequest).error);
        window.alert('Error al añadir la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getCategory(uniqueId: string): Promise<CategoryInterface | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.get(uniqueId);

      request.onsuccess = () => {
        resolve(request.result as CategoryInterface);
      };

      request.onerror = (event: Event) => {
        this._logger.log('Error retrieving category: ' + (event.target as IDBRequest).error);
        console.error('Error retrieving category:', (event.target as IDBRequest).error);
        window.alert('Error al recuperar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public getAllCategories(): Promise<CategoryInterface[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();

      request.onsuccess = () => {
        this._logger.log('✅ Categories retrieved successfully');
        console.log('Categories retrieved successfully');
        resolve(request.result as CategoryInterface[]);
      };

      request.onerror = (event: Event) => {
        this._logger.log('⚠️ Error retrieving categories: ' + (event.target as IDBRequest).error);
        console.error('Error retrieving categories:', (event.target as IDBRequest).error);
        window.alert('Error al recuperar las categorías');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public updateCategory(category: CategoryInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.put(category);

      request.onsuccess = () => {
        this._logger.log('✅ CATEGORY UPDATED: ' + category.uniqueId+' - '+category.name);
        window.alert('Categoría actualizada correctamente');
        resolve();
      };

      request.onerror = (event: Event) => {
        this._logger.log('⚠️ Error updating category: ' + (event.target as IDBRequest).error);
        console.error('⚠️ Error updating category:', (event.target as IDBRequest).error);
        window.alert('Error al actualizar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public deleteCategory(uniqueId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.delete(uniqueId);

      request.onsuccess = () => {
        this._logger.log('✅ Category deleted successfully: ' + uniqueId);
        window.alert('Categoría eliminada correctamente');
        resolve();
      };

      request.onerror = (event: Event) => {
        this._logger.log('⚠️ Error deleting category: ' + (event.target as IDBRequest).error);
        console.error('⚠️ Error deleting category:', (event.target as IDBRequest).error);
        window.alert('Error al eliminar la categoría');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  public clearCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
        reject('⚠️ Database is not initialized');
        return;
      }

      const transaction = this.db.transaction('categories', 'readwrite');
      const store = transaction.objectStore('categories');
      const request = store.clear();

      request.onsuccess = () => {
        this._logger.log('✅ All categories cleared successfully');
        window.alert('Todas las categorías han sido eliminadas correctamente');
        resolve();
      };

      request.onerror = (event: Event) => {
        this._logger.log('⚠️ Error clearing categories: ' + (event.target as IDBRequest).error);
        console.error('Error clearing categories:', (event.target as IDBRequest).error);
        window.alert('Error al eliminar todas las categorías');
        reject((event.target as IDBRequest).error);
      };
    });
  }

  importMultipleCategories(categories: CategoryInterface[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this._logger.log('⚠️ Database is not initialized');
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
          this._logger.log('✅ All categories imported successfully');
          window.alert('Categorías importadas correctamente');
          resolve();
        })
        .catch(error => {
          this._logger.log('⚠️ Error importing categories: ' + error);
          console.error('Error importing categories:', error);
          window.alert('Error al importar las categorías');
          reject(error);
        });
    });
  }
}
