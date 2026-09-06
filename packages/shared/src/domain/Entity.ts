import { UniqueId } from '../common/UniqueId';

export abstract class Entity<Props> {
  protected readonly _id: UniqueId;
  protected readonly props: Props;

  constructor(props: Props, id?: UniqueId) {
    this._id = id ?? new UniqueId();
    this.props = props;
  }

  get id(): UniqueId {
    return this._id;
  }

  equals(entity?: Entity<Props>): boolean {
    if (entity === null || entity === undefined) return false;
    if (this === entity) return true;
    if (!(entity instanceof Entity)) return false;
    return this._id.equals(entity._id);
  }
}
