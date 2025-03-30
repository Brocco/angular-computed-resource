import { Component, inject } from '@angular/core';
import { DataService } from '../data.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  template: `
    <button (click)="reload()">Reload</button>

    <h2>Customer</h2>
    @if(customerResource.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      <p>{{ customerResource.value()?.name }}</p>
      <p>{{ customerResource.value()?.phone }}</p>
    </div>
    }

    <h2>Addresses</h2>
    @if(customerAddressesResource.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(custAddr of customerAddressesResource.value(); track custAddr.id){
      <p>{{ custAddr.address }}</p>
      }
    </div>
    }

    <h2>Orders</h2>
    @if(ordersResource.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(order of ordersResource.value(); track order.id) {
      <p>{{ order.id }}</p>
      <p>{{ order.total | currency }}</p>
      a }
    </div>
    }

    <h2>Order Details</h2>
    @if(orderItemsResource.isLoading()) {
    <div class="loader"></div>
    } @else {
    <div>
      @for(orderItem of orderItemsResource.value(); track orderItem.id) {
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
export class SeparateResourcesExample {
  private dataService = inject(DataService);

  protected customerResource = this.dataService.getCustomerResource();
  protected customerAddressesResource = this.dataService.getCustomerAddressesResource();
  protected ordersResource = this.dataService.getOrdersResource();
  protected orderItemsResource = this.dataService.getOrderItemsResource();

  reload() {
    this.customerResource.reload();
    this.customerAddressesResource.reload();
    this.ordersResource.reload();
    this.orderItemsResource.reload();
  }
}
