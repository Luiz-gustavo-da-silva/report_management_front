import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  put<T>(key: string, it: T): void {
    localStorage.setItem(key, JSON.stringify(it));
  }

  get<T>(key: string): T | null {
    try {
      return JSON.parse(localStorage.getItem(key)!);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
