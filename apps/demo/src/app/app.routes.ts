import { Route } from '@angular/router';
import { SeparateResourcesExample } from './separate/separate-resources';
import { ComputedResourceExample } from './computed/computed-resource';

export const appRoutes: Route[] = [
  { path: 'separate-resources', component: SeparateResourcesExample },
  { path: 'computed-resource', component: ComputedResourceExample },
];
