import { Injectable, resource } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  setDelay(delay: number) {
    this.delayTime = delay;
  }

  getCustomerResource() {
    return resource({
      loader: () => this.getCustomer(),
    });
  }
  async getCustomer() {
    await this.delay(this.delayTime * 1);
    return Promise.resolve(this.customer);
  }

  getCustomerAddressesResource() {
    return resource({
      loader: () => this.getCustomerAddresses(),
    });
  }
  async getCustomerAddresses() {
    await this.delay(this.delayTime * 3);
    return Promise.resolve(this.customerAddresses);
  }

  getOrdersResource() {
    return resource({
      loader: () => this.getOrders(),
    });
  }
  async getOrders() {
    await this.delay(this.delayTime * 2);
    return Promise.resolve(this.orders);
  }

  getOrderItemsResource() {
    return resource({
      loader: () => this.getOrderItems(),
    });
  }
  async getOrderItems() {
    await this.delay(this.delayTime * 4);
    return Promise.resolve(this.orderItems);
  }

  private customer = {
    id: '1234',
    name: 'John Doe',
    phone: '555-555-1234',
  };
  private customerAddresses = [
    {
      id: '999',
      customerId: '1234',
      address: '123 Main St Hometown, PA 15000',
    },
  ];
  private orders = [
    {
      id: '111',
      total: 123.45,
    },
    {
      id: '222',
      total: 2345.67,
    },
  ];
  private orderItems = [
    {
      id: '111-111',
      orderId: '111',
      title: 'Wrench',
      details: 'Crescent wrench',
      price: 100,
    },
    {
      id: '111-222',
      orderId: '111',
      title: 'Saw',
      details: 'Table saw',
      price: 20,
    },
    {
      id: '111-333',
      orderId: '111',
      title: 'Glue',
      details: 'Wood glue',
      price: 3.45,
    },
    {
      id: '222-444',
      orderId: '222',
      title: 'GPU',
      details: 'NVidia 5090',
      price: 2000,
    },
    {
      id: '222-555',
      orderId: '222',
      title: 'Keyboard',
      details: 'Mechanical w/ blue switches',
      price: 300,
    },
    {
      id: '222-666',
      orderId: '222',
      title: 'Mouse',
      details: 'Ergonomic mouse',
      price: 40,
    },
    {
      id: '222-777',
      orderId: '222',
      title: 'Usb cable',
      details: 'USB-C 3ft cable',
      price: 5.67,
    },
  ];

  private delayTime = 500;
  private delay(delayTime: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, delayTime);
    });
  }
}
