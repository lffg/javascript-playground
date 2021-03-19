export type Result<T, E> = Ok<T> | Err<E>;

export type ResultType = 'ok' | 'err';

class $$ResultPrototype<T, E> {
  #innerValue;
  readonly $$type;

  constructor(value: unknown, type: ResultType) {
    this.#innerValue = value;
    this.$$type = type;
  }

  isOk(): this is Ok<T> {
    return this.$$type === 'ok';
  }

  isErr(): this is Err<E> {
    return this.$$type === 'err';
  }

  map<U>(fn: (data: T) => U): Result<U, E> {
    return this.match({
      ok: (data) => ok(fn(data)),
      err: (error) => err(error)
    });
  }

  match<Tr, Er>(matchMap: ResultMatchMap<T, Tr, E, Er>): Tr | Er {
    switch (this.$$type) {
      case 'ok':
        return matchMap.ok(this.#innerValue as T);
      case 'err':
        return matchMap.err(this.#innerValue as E);
      default:
        assertNever(this.$$type);
    }
  }
}

export class Ok<T> extends $$ResultPrototype<T, never> {
  #innerValue: T;
  readonly $$type = 'ok' as const;

  constructor(data: T) {
    super(data, 'ok');
    this.#innerValue = data;
  }

  data(): T {
    return this.#innerValue;
  }
}

export class Err<E> extends $$ResultPrototype<never, E> {
  #innerValue: E;
  readonly $$type = 'err' as const;

  constructor(error: E) {
    super(error, 'err');
    this.#innerValue = error;
  }

  error(): E {
    return this.#innerValue;
  }
}

function ok<T>(data: T): Result<T, never> {
  return new Ok<T>(data);
}

function err<E>(error: E): Result<never, E> {
  return new Err<E>(error);
}

type ResultMatchMap<T, Tr, E, Er> = {
  ok: (data: T) => Tr;
  err: (error: E) => Er;
};

function assertNever(val: never): never {
  void val;
  unreachable();
}

function unreachable(message?: string): never {
  throw new Error(!message ? 'Unreachable' : `Unreachable; ${message}`);
}

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                                API EXAMPLE                                 //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

const a: Result<number, string> = ok(123);
const b: Result<bigint, string> = err('Algo deu errado.');

if (a.isErr()) {
  assertType<string>(a.error());
  throw a.error();
}

assertType<number>(a.data());

if (b.isErr()) {
  assertType<string>(b.error());
  throw b.error();
}

assertType<bigint>(b.data());

// test api
function assertType<T>(param: T) {
  void param;
}
