/**
 * # Result<T, E>.
 *
 * `Result` is a type that represents either success (`Ok`) or failure (`Err`).
 *
 * For more details, refer to:
 * https://doc.rust-lang.org/std/result/index.html
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Union type with the two possible `Result` states.
 */
export type ResultType = 'ok' | 'err';

/**
 * Internal `Result` prototype.
 * This class should not be exported nor be used directly.
 */
class ResultPrototype<T, E> {
  #innerValue;
  readonly $$type;

  constructor(value: unknown, type: ResultType) {
    this.#innerValue = value;
    this.$$type = type;
  }

  /**
   * Returns `true` if the result is `Ok`.
   */
  isOk(): this is Ok<T> {
    return this.$$type === 'ok';
  }

  /**
   * Returns `true` if the result is `Err`.
   */
  isErr(): this is Err<E> {
    return this.$$type === 'err';
  }

  /**
   * Maps a `Result<T, E>` to `Result<U, E>` by applying a function (`fn`) to a
   * contained `Ok` value, leaving an `Err` value untouched. A new `Result`
   * instance is always created by this method.
   *
   * This method can be used to compose the results of two functions.
   */
  map<U>(fn: (data: T) => U): Result<U, E> {
    return this.match({
      ok: (data) => ok(fn(data)),
      err: (error) => err(error)
    });
  }

  /**
   * Returns the contained `Ok` value.
   *
   * @throws This method throws with given message if the value is an `Err`.
   */
  expect(message: string) {
    return this.match({
      ok: (data) => data,
      err: () => {
        throw new Error(message);
      }
    });
  }

  /**
   * Returns the contained `Ok` value.
   *
   * @throws This method throws if the value is an `Err`.
   *
   * @todo The throwed error should contain information about the wrapped `Err`
   *       value.
   */
  unwrap() {
    return this.expect('Called `Result.prototype.unwrap()` on an `Err` value');
  }

  /**
   * Matches the result to its variation. Returns a unwrapped value.
   *
   * The types returned by the matching may or may not be compatible, as there
   * are no restrictions about that in the method signature or implementation.
   */
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

/**
 * `Ok` is the result variation that contains the success value.
 */
export class Ok<T> extends ResultPrototype<T, never> {
  #innerValue: T;
  readonly $$type = 'ok' as const;

  constructor(data: T) {
    super(data, 'ok');
    this.#innerValue = data;
  }

  /**
   * Returns the success value.
   * This method is only implemented in `Err` instances.
   */
  data(): T {
    if (this.$$type !== 'ok') {
      unreachable('Impossible `Ok.prototype.data()` call');
    }
    return this.#innerValue;
  }
}

/**
 * `Err` is the result variation that contains the error value.
 */
export class Err<E> extends ResultPrototype<never, E> {
  #innerValue: E;
  readonly $$type = 'err' as const;

  constructor(error: E) {
    super(error, 'err');
    this.#innerValue = error;
  }

  /**
   * Returns the error value.
   * This method is only implemented in `Err` instances.
   */
  error(): E {
    if (this.$$type !== 'err') {
      unreachable('Impossible `Err.prototype.error()` call');
    }
    return this.#innerValue;
  }
}

/**
 * Creates a new `Ok` result, with type `Result<T, E = never>`.
 */
function ok<T, E = never>(data: T): Result<T, E> {
  return new Ok<T>(data);
}

/**
 * Creates a new `Err` result, with type `Result<T = never, E>`.
 */
function err<E, T = never>(error: E): Result<T, E> {
  return new Err<E>(error);
}

//
// Utility types.
//

type ResultMatchMap<T, Tr, E, Er> = {
  ok: (data: T) => Tr;
  err: (error: E) => Er;
};

//
// Utility functions.
//

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
