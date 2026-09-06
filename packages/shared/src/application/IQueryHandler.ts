import { Query } from './Query';

export interface IQueryHandler<Q extends Query, Result> {
  execute(query: Q): Promise<Result>;
}
