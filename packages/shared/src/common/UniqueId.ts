import { randomUUID } from 'crypto';

export class UniqueId {
  private readonly _value: string;

  constructor(id?: string) {
    this._value = id ?? randomUUID();
  }

  get value(): string {
    return this._value;
  }

  equals(id?: UniqueId): boolean {
    if (!id) return false;
    if (!(id instanceof UniqueId)) return false;
    return this._value === id._value;
  }

  toString(): string {
    return this._value;
  }
}
