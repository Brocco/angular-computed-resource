# Computed Resource

A computed resource is a way to combine multiple resources into a single resource. Aggregating values of `isLoading`, `hasValue` and most importantly `value`.

## Usage

Given three resources:

```typescript
const customerResource = resource<Customer>( ... );
const orderResource = resource<Order>( ... );
const shipmentResource = resource<Shipment>( ... );
```

They can be combined into one:

```typescript
import { computedResource } from 'computed-resource';

const posResource = computedResource({
  customer: customerResource,
  order: orderResource,
  shipment: shipmentResource,
});
```

The type of the value for the new resouce will be:

```typescript
posResource.value: Signal<{
  customer: Customer,
  order: Order,
  shipment: Shipment
}>
```
