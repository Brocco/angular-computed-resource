import {
  computed,
  resource,
  Resource,
  ResourceRef,
  ResourceStatus,
  Signal,
} from '@angular/core';
import { k } from '@angular/core/weak_ref.d-Bp6cSy-X';

const resA: Resource<string | undefined> = resource({
  loader: () => Promise.resolve('A'),
});
const resB = resource({
  loader: () => Promise.resolve(2),
});

const map = {
  a: resA,
  b: resB,
};
const output: {
  a: ReturnType<(typeof map)['a']['value']>;
  b: ReturnType<(typeof map)['b']['value']>;
} = {
  a: resA.value(),
  b: resB.value(),
};

type ResourceMap = {
  [key: string]: Resource<unknown>;
};

export function computedResourceOld(resources: ResourceMap) {
  type KEY = Exclude<keyof typeof resources, number>;
  type VALS = (typeof resources)[KEY] extends Resource<infer VALS>
    ? VALS
    : never;

  const value = computed(() => {
    // const result: { [key: KEY]: VALS } = {};
    const result: { [key: string]: unknown } = {};

    // create a computed value for each of the resources in the map
    for (const [key, resource] of Object.entries(resources)) {
      type VAL = typeof resource extends Resource<infer V> ? V : unknown;
      // type VAL = ReturnType<typeof resource.value>;
      result[key] = resource.value() as VAL;
    }

    return result;
  });

  return {
    value,
  };
}

// check if returned value matches expecting value() to be:
// { a: string; b: number; } OR
// { a: string | undefined; b: number | undefined; }
const check: { a: string | undefined; b: number | undefined } =
  computedResourceOld(map).value();

console.log(check);

function extractResourceValues<T extends ResourceMap>(
  resources: T
): {
  value: () => { [K in keyof T]: T[K] extends Resource<infer V> ? V : never };
} {
  const values: Partial<{
    [K in keyof T]: T[K] extends Resource<infer V> ? V : never;
  }> = {};

  // type VAL = T[keyof T] extends Resource<infer V> ? V : never };

  for (const [key, resource] of Object.entries(resources)) {
    values[key as keyof T] = resource.value() as T[keyof T] extends Resource<
      infer V
    >
      ? V
      : never;
  }

  return {
    value: () =>
      values as {
        [K in keyof T]: T[K] extends Resource<infer V> ? V : never;
      },
  };
}
const check2 = extractResourceValues(map).value();

type VAL<T> = T[keyof T] extends Resource<infer V> ? V : never;

// const x: Resource<string>;

/*
{
  value: () => { [K in keyof T]: T[K] extends Resource<infer V> ? V : never };
}
*/
// function computedResource<T>(resources: {
type MyResource<T> = Pick<Resource<T>, 'value'>;
// type MyResource<T> = {
//   value: () => T;
// };

function computedResourceX<
  T extends { [key: string]: Resource<unknown> },
  O extends { [K in keyof T]: T[K] extends Resource<infer V> ? V : never }
>(resources: T): MyResource<O> {
  const value = computed(() => {
    const result = Object.keys(resources).reduce((acc, key) => {
      acc[key as keyof O] = resources[key].value() as O[keyof O];
      return acc;
    }, {} as Partial<O>);

    return result as O;
  });

  return {
    value: value,
  };
}
const xxx = computedResourceX(map);
xxx.value().a = 'b';
xxx.value().b = 3;

function computedResource<
  V,
  T extends { [K in keyof T]: T[K] extends Resource<infer V> ? V : never }
>(resources: { [key: string]: Resource<unknown> }): Resource<V> {
  // }): Resource<{
  //   [K in keyof T]: T[K] extends Resource<infer V> ? V : never;
  // }> {
  const values: Partial<{
    [K in keyof T]: V;
  }> = {};
  for (const [key, resource] of Object.entries(resources)) {
    values[key as keyof T] = resource.value() as V;
    // values[key as keyof T] = resource.value() as T[keyof T] extends Resource<
    //   infer V
    // >
    //   ? V
    //   : never;
  }
  return {
    value: () =>
      values as {
        [K in keyof T]: T[K] extends Resource<infer V> ? V : never;
      },
  };
}

const shouldBe = computedResource(map);
console.log(shouldBe.value()); // should be { a: string | undefined; b: number | undefined; }
