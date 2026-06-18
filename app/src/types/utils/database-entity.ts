export interface DatabaseEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeletionRestricted?: boolean;
}
