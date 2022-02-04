import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderApiPage } from './order-api.page';

describe('OrderApiPage', () => {
  let component: OrderApiPage;
  let fixture: ComponentFixture<OrderApiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderApiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
