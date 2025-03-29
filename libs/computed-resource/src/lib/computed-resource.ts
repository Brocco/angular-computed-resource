import {
  computed,
  resource,
  Resource,
  ResourceRef,
  ResourceStatus,
  Signal,
} from '@angular/core';

const resA: Resource<string | undefined> = resource({
  loader: () => Promise.resolve('A'),
});
const resB = resource({
  loader: () => Promise.resolve(2),
});

const map: ResourceMap = {
  a: resA,
  b: resB,
};

type ResourceMap = {
  [key: string]: Resource<unknown>;
};

export function computedResource(resources: ResourceMap) {
  type KEY = Exclude<keyof typeof resources, number>;
  type VALS = (typeof resources)[KEY] extends Resource<infer VALS>
    ? VALS
    : never;

  const value = computed(() => {
    // const result: { [key: KEY]: VALS } = {};
    const result: { [key: string]: unknown } = {};

    // create a computed value for each of the resources in the map
    for (const [key, resource] of Object.entries(resources)) {
      type VAL = typeof resource extends Resource<infer VAL> ? VAL : never;
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
  computedResource(map).value();

console.log(check);
