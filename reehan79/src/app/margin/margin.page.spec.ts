import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginPage } from './margin.page';

describe('MarginPage', () => {
  let component: MarginPage;
  let fixture: ComponentFixture<MarginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
