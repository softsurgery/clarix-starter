import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { join } from 'path';
import { createReadStream, promises as fs } from 'fs';
import { constants } from 'fs';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { StorageRepository } from '../repositories/storage.repository';
import { StorageEntity } from '../entities/storage.entity';
import { StorageService } from './storage.service';
import { app } from 'electron';

@Injectable()
export class LocalStorageService extends StorageService {
  rootLocation: string;
  constructor() {
    super(new StorageRepository());
    this.rootLocation = join(app.getPath('userData'), '/upload');
  }

  getStorageType(): string {
    return 'local';
  }

  async store(
    file: Express.Multer.File,
    isTemporary = false,
    isPrivate = false,
  ): Promise<StorageEntity> {
    const slug = uuidv4();
    const filename = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;

    const extension = mime.extension(mimetype) || '';
    let relativePath = slug;

    if (extension) {
      relativePath = `${slug}.${extension}`;
    }

    const upload = this.storageRepository.save({
      slug,
      filename,
      mimetype,
      size,
      relativePath,
      isTemporary,
      isPrivate,
    });

    const destinationFile = join(this.rootLocation, relativePath);
    try {
      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('Failed to store empty file.');
      }

      await fs.mkdir(this.rootLocation, { recursive: true });
      await fs.writeFile(destinationFile, file.buffer);
    } catch (error) {
      throw new Error(`Failed to store file : ${error}`);
    }

    return upload;
  }

  async storeMultipleFiles(files: Express.Multer.File[], isTemporary = false, isPrivate = false) {
    const uploads = await Promise.all(
      files.map(async (file) => {
        return this.store(file, isTemporary, isPrivate);
      }),
    );
    return uploads;
  }

  async loadResource(slug: string): Promise<ReadStream> {
    const upload = await this.findBySlug(slug);
    const filePath = join(this.rootLocation, upload.relativePath);

    try {
      await fs.access(filePath, constants.F_OK);
      return createReadStream(filePath);
    } catch (error) {
      throw new Error(`File not found: ${error}`);
    }
  }

  async getFilePath(id: number): Promise<string> {
    const entity = await this.findOneById(id);
    if (!entity) throw new Error(`Storage with id ${id} not found`);
    const filePath = join(this.rootLocation, entity.relativePath);
    const fileBuffer = await fs.readFile(filePath);
    const base64 = fileBuffer.toString('base64');
    return `data:${entity.mimetype};base64,${base64}`;
  }

  async duplicate(id: number): Promise<StorageEntity> {
    //Find the original upload entity
    const originalUpload = (await this.findOneById(id)) as StorageEntity;

    //Generate a new slug and file path for the duplicate
    const newSlug = uuidv4();
    const originalFilePath = join(this.rootLocation, originalUpload.relativePath);
    const fileExtension = mime.extension(originalUpload.mimetype) || '';
    let newRelativePath = newSlug;

    if (fileExtension) {
      newRelativePath = `${newSlug}.${fileExtension}`;
    }

    const newFilePath = join(this.rootLocation, newRelativePath);

    //Copy the file on the filesystem
    try {
      await fs.copyFile(originalFilePath, newFilePath);
    } catch (error) {
      throw new Error(`Failed to duplicate file: ${error}`);
    }

    //Save the duplicated upload entity in the database
    const duplicatedUpload = await this.storageRepository.save({
      slug: newSlug,
      filename: originalUpload.filename,
      mimetype: originalUpload.mimetype,
      size: originalUpload.size,
      relativePath: newRelativePath,
    });

    return duplicatedUpload;
  }

  async duplicateMany(ids: number[]): Promise<StorageEntity[]> {
    const duplicatedUploads = await Promise.all(ids.map((id) => this.duplicate(id)));
    return duplicatedUploads;
  }

  async delete(id: number): Promise<StorageEntity> {
    const upload = (await this.findOneById(id)) as StorageEntity;
    const filePath = join(this.rootLocation, upload.relativePath);

    try {
      await fs.unlink(filePath);
      await this.storageRepository.softDelete(upload.id);
      return upload;
    } catch (error) {
      throw new Error(`Failed to delete file: ${upload.slug} ${error}`);
    }
  }

  async deleteBySlug(slug: string): Promise<StorageEntity> {
    const upload = await this.findBySlug(slug);
    return this.delete(upload.id);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}
