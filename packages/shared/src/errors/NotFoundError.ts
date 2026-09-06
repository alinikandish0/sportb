import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} با شناسه‌ی ${id} پیدا نشد`);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
