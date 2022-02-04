import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAddressesPage } from './all-addresses.page';

describe('AllAddressesPage', () => {
  let component: AllAddressesPage;
  let fixture: ComponentFixture<AllAddressesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAddressesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAddressesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
