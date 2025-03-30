import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { CurrencyPipe } from '@angular/common';
import { computedResource } from 'computed-resource';

@Component({
  template: `
    <button (click)="reload()">Reload</button>

    <h2>Customer</h2>
    @if(data.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      <p>{{ data.value().customer?.name }}</p>
      <p>{{ data.value().customer?.phone }}</p>
    </div>
    }

    <h2>Addresses</h2>
    @if(data.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(custAddr of data.value().customerAddresses; track custAddr.id){
      <p>{{ custAddr.address }}</p>
      }
    </div>
    }

    <h2>Orders</h2>
    @if(data.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(order of data.value().orders; track order.id) {
      <p>{{ order.id }}</p>
      <p>{{ order.total | currency }}</p>
      a }
    </div>
    }

    <h2>Order Details</h2>
    @if(data.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(orderItem of data.value().orderItems; track orderItem.id) {
      <p>({{ orderItem.id }}) {{ orderItem.title }} - {{ orderItem.details }}</p>
      }
    </div>
    }
  `,
  styles: `
    h2 + * {
      margin-left: 50px;
    }
  `,
  imports: [CurrencyPipe],
})
export class ComputedResourceExample {
  private dataService = inject(DataService);

  protected data = computedResource({
    customer: this.dataService.getCustomerResource(),
    customerAddresses: this.dataService.getCustomerAddressesResource(),
    orders: this.dataService.getOrdersResource(),
    orderItems: this.dataService.getOrderItemsResource(),
  });

  reload() {
    this.data.reload();
  }
}
