import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing/testing';

import { SharingProgressPage } from './sharing-progress.page';

describe('SharingProgressPage', () => {
  let component: SharingProgressPage;
  let fixture: ComponentFixture<SharingProgressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharingProgressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
