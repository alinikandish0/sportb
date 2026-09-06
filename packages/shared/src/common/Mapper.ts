export interface Mapper<DomainEntity, Persistence, DTO = unknown> {
  toDomain(raw: Persistence): DomainEntity;
  toPersistence(entity: DomainEntity): Persistence;
  toDTO?(entity: DomainEntity): DTO;
}
