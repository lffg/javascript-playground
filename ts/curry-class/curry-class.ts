type Class<P, N = unknown> = {
  prototype: P;
  new (): N;
};

type Obj = Record<string | symbol, unknown>;

type CurriedClass<P, Exclude extends string> = {
  [K in keyof P]: P[K] extends (...args: infer Args) => infer Return
    ? // Is method
      K extends Exclude
      ? // Is a filtered out method
        P[K]
      : // Is a valid method to curry:
        Curried<Args, Return>
    : // Not a function
      P[K];
};

type CurryClassOptions<E> = {
  exclude?: E[];
};

function curryClass<P, E extends string>(
  targetClass: Class<P>,
  options: CurryClassOptions<E> = {}
): Class<any, CurriedClass<P, E>> {
  const excludedMethods = new Set(options.exclude || []);
  excludedMethods.add('constructor' as E);

  let currentProto: any = targetClass.prototype;
  while (currentProto !== null && currentProto !== Object.prototype) {
    for (const prop of Object.getOwnPropertyNames(currentProto)) {
      if (
        typeof currentProto[prop] === 'function' &&
        !excludedMethods.has(prop as E)
      ) {
        currentProto[prop] = curry(currentProto[prop]);
      }
    }
    currentProto = Reflect.getPrototypeOf(currentProto);
  }

  return (targetClass as any) as Class<any, CurriedClass<P, E>>;
}

//
// Testando
////////////////////////////////////////////////////////////////////////////////

class Parent {
  parentAdd(a: number, b: number): number {
    return a + b;
  }
}

class Calculator extends Parent {
  prop: string = 'foo';

  add(a: number, b: number): number {
    return a + b;
  }

  sub = (a: number, b: number): number => {
    return a + b;
  };
}

// Um problema é que, embora a nível de tipos o TypeScript faça métodos definidos
// como "class field" (https://github.com/tc39/proposal-class-fields), não é
// possível modificá-los via alteração prototípica antes da instanciação da classe.
//
// Não encontrei nenhum jeito de impedir a "detecção" de métodos definidos através
// de class fields a nível do TypeScript, por isso incluí `sub` na lista de excluídos.
const CurriedCalculator = curryClass(Calculator, {
  exclude: ['sub']
});

const x = new CurriedCalculator();
const a: number = x.add(5)(1); // ok :)
const b: number = x.add(5, 1); // ok :)
const c: number = x.sub(5, 1); // ok :)
// const d: number = x.sub(5)(1); // não ok; `sub` foi excluído
const e: string = x.prop; // não foi alterada
const f: number = x.parentAdd(5)(1);

//
// O código abaixo veio de:
// https://stackoverflow.com/a/63905763/7445826
////////////////////////////////////////////////////////////////////////////////

type SameLength<T extends any[]> = Extract<{ [K in keyof T]: any }, any[]>;

type Curried<A extends any[], R> = <P extends Partial<A>>(
  ...args: P
) => P extends A
  ? R
  : A extends [...SameLength<P>, ...infer S]
  ? S extends any[]
    ? Curried<S, R>
    : never
  : never;

function curry<A extends any[], R>(fn: (...args: A) => R): Curried<A, R> {
  return (...args: any[]): any =>
    args.length >= fn.length
      ? fn(...(args as any))
      : curry((fn as any).bind(undefined, ...args));
}
