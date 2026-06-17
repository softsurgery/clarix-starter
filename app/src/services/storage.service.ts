import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface StorageFileData {
  buffer: number[];
  originalname: string;
  mimetype: string;
  size: number;
}

export interface StorageResponse {
  id: number;
  slug: string;
  filename: string;
  relativePath: string;
  mimetype: string;
  size: number;
  isTemporary: boolean;
  isPrivate: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  store(file: File): Observable<StorageResponse> {
    return from(this.storeAsync(file));
  }

  private async storeAsync(file: File): Promise<StorageResponse> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Array.from(new Uint8Array(arrayBuffer));

    const fileData: StorageFileData = {
      buffer,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    };

    return window.electronAPI!.storage.store(fileData);
  }

  findOneById(id: number): Observable<StorageResponse> {
    return from(window.electronAPI!.storage.findOneById(id));
  }

  getFilePath(id: number): Observable<string> {
    return from(window.electronAPI!.storage.getFilePath(id));
  }

  delete(id: number): Observable<StorageResponse> {
    return from(window.electronAPI!.storage.delete(id));
  }
}
