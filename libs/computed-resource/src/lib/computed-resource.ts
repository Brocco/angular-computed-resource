import { computed, Resource, ResourceStatus, Signal } from '@angular/core';

export function computedResource<
  T extends { [key: string]: Resource<unknown> },
  V = { [K in keyof T]: T[K] extends Resource<infer V> ? V : never }
>(resources: T, options?: ComputedResourceOptions): ComputedResource<T, V> {
  return new ComputedResourceImpl<T, V>(resources, options);
}

export interface ComputedResourceOptions {
  isLoadingStrategy: 'some' | 'all';
  hasValueStrategy: 'some' | 'all';
}

export interface ComputedResource<
  T extends { [key: string]: Resource<unknown> },
  V = { [K in keyof T]: T[K] extends Resource<infer V> ? V : never }
> extends Resource<V> {
  partialValue: (key: keyof V) => Signal<V[keyof V]> | undefined;
  partialReload: (key: keyof V) => boolean | undefined;
}

class ComputedResourceImpl<
  T extends { [key: string]: Resource<unknown> },
  V = { [K in keyof T]: T[K] extends Resource<infer V> ? V : never }
> implements ComputedResource<T, V>
{
  private readonly options?: ComputedResourceOptions;
  private readonly resources: T;
  private readonly computedResourceOptionsDefault: ComputedResourceOptions = {
    isLoadingStrategy: 'all',
    hasValueStrategy: 'all',
  };

  constructor(resources: T, options?: ComputedResourceOptions) {
    this.resources = resources;
    this.options = {
      ...this.computedResourceOptionsDefault,
      ...(options ?? {}), // override default options with user-provided options
    };
  }

  // get a single resource's value
  partialValue(key: keyof V): Signal<V[keyof V]> | undefined {
    return this.resources[key as keyof T]?.value as Signal<V[keyof V]>;
  }

  readonly value = computed(() => {
    const result = Object.keys(this.resources).reduce((acc, key) => {
      acc[key as keyof V] = this.resources[key].value() as V[keyof V];
      return acc;
    }, {} as Partial<V>);

    return result as V;
  });

  readonly isLoading =
    this.options?.isLoadingStrategy === 'some'
      ? computed(() => !Object.values(this.resources).some((resource) => !resource.isLoading()))
      : computed(() => !Object.values(this.resources).every((resource) => !resource.isLoading()));

  hasValue(): this is Resource<Exclude<V, undefined>> {
    // return this.value() !== undefined;
    return this.options?.hasValueStrategy === 'some'
      ? Object.values(this.resources).some((resource) => resource.value() !== undefined)
      : Object.values(this.resources).every((resource) => resource.hasValue() !== undefined);
  }

  /**
   * TODO: Review this implementation
   */
  readonly status = computed(() => {
    const statusCounts = Object.values(this.resources).reduce((acc, resource) => {
      const count = acc.get(resource.status()) || 0;
      acc.set(resource.status(), count + 1);
      return acc;
    }, new Map());

    if (statusCounts.get(ResourceStatus.Error) || 0 > 0) {
      return ResourceStatus.Error;
    }
    if (statusCounts.get(ResourceStatus.Reloading) || 0 > 0) {
      return ResourceStatus.Reloading;
    }
    if (statusCounts.get(ResourceStatus.Loading) || 0 > 0) {
      return ResourceStatus.Loading;
    }
    if (statusCounts.get(ResourceStatus.Idle) || 0 === Object.keys(this.resources).length) {
      return ResourceStatus.Idle;
    }
    if (statusCounts.get(ResourceStatus.Resolved) || 0 === Object.keys(this.resources).length) {
      return ResourceStatus.Resolved;
    }
    return ResourceStatus.Local;
  });

  readonly error = computed(() => {
    return Object.entries(this.resources).reduce((acc, [key, resource]) => {
      if (!resource.error()) {
        return acc;
      }
      if (acc === undefined) {
        acc = {};
      }
      acc[key] = resource.error();
      return acc;
    }, undefined as { [key: string]: unknown } | undefined);
  });

  /**
   * TODO: Review this implementation
   *   - can we combine all results of reload calls?
   *   - what if some resources fail to reload?
   *   - do we care?
   */
  reload() {
    for (const resource of Object.values(this.resources)) {
      resource.reload();
    }
    return true;
  }

  partialReload(key: keyof V): boolean | undefined {
    return this.resources[key as keyof T]?.reload();
  }
}
