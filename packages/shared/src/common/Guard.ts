export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: unknown;
  argumentName: string;
}

export class Guard {
  static againstNullOrUndefined(
    argument: unknown,
    argumentName: string,
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} نباید خالی باشه` };
    }
    return { succeeded: true };
  }

  static againstNullOrUndefinedBulk(args: IGuardArgument[]): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }
    return { succeeded: true };
  }

  static isEmpty(value: string): boolean {
    return value === undefined || value === null || value.trim().length === 0;
  }

  static inRange(value: number, min: number, max: number, argumentName: string): IGuardResult {
    if (value < min || value > max) {
      return {
        succeeded: false,
        message: `${argumentName} باید بین ${min} تا ${max} باشه`,
      };
    }
    return { succeeded: true };
  }
}
