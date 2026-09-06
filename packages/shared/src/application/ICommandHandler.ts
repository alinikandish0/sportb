import { Command } from './Command';

export interface ICommandHandler<C extends Command, Result = void> {
  execute(command: C): Promise<Result>;
}
