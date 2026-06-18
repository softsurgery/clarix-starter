// storage.interface.ts
import { ReadStream } from 'fs';
import { StorageEntity } from '../entities/storage.entity';
import { StorageRepository } from '../repositories/storage.repository';
import { Logger } from '@nestjs/common';
import { AbstractCrudService } from '@/shared/database/services/abstract-crud.service';

export abstract class StorageService extends AbstractCrudService<StorageEntity> {
  storageRepository: StorageRepository;
  logger = new Logger(StorageService.name);
  constructor(storageRepository: StorageRepository) {
    super(storageRepository);
    this.storageRepository = storageRepository;
  }

  abstract getStorageType(): string;

  async findBySlug(slug: string): Promise<StorageEntity> {
    const upload = await this.storageRepository.findOne({ where: { slug } });
    if (!upload) {
      throw new Error(`Storage with slug ${slug} is not found`);
    }
    return upload;
  }

  // Store files
  abstract store(
    file: Express.Multer.File,
    isTemporary?: boolean,
    isPrivate?: boolean,
  ): Promise<StorageEntity>;
  abstract storeMultipleFiles(
    files: Express.Multer.File[],
    isTemporary?: boolean,
    isPrivate?: boolean,
  ): Promise<StorageEntity[]>;

  async expose(id: number): Promise<StorageEntity> {
    const upload = (await this.findOneById(id)) as StorageEntity;
    upload.isPrivate = false;
    return await this.storageRepository.save(upload);
  }

  async hide(id: number): Promise<StorageEntity> {
    const upload = (await this.findOneById(id)) as StorageEntity;
    upload.isPrivate = true;
    return await this.storageRepository.save(upload);
  }

  async confirm(id: number): Promise<StorageEntity> {
    const upload = (await this.findOneById(id)) as StorageEntity;
    upload.isTemporary = false;
    return await this.storageRepository.save(upload);
  }

  async unconfirm(id: number): Promise<StorageEntity> {
    const upload = (await this.findOneById(id)) as StorageEntity;
    upload.isTemporary = true;
    return await this.storageRepository.save(upload);
  }

  async findTemporary(): Promise<StorageEntity[]> {
    const uploads = await this.storageRepository.findAll({
      where: { isTemporary: true },
    });
    return uploads;
  }

  // Load file from storage
  abstract loadResource(slug: string): Promise<ReadStream>;

  // Duplicate
  abstract duplicate(id: number): Promise<StorageEntity>;
  abstract duplicateMany(ids: number[]): Promise<StorageEntity[]>;

  // Delete
  abstract delete(id: number): Promise<StorageEntity>;
  abstract deleteBySlug(slug: string): Promise<StorageEntity>;
  abstract deleteMany(ids: number[]): Promise<void>;

  async getTotal(): Promise<number> {
    return this.storageRepository.getTotalCount();
  }
}
