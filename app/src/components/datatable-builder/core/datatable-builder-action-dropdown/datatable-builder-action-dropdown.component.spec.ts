import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableBuilderActionDropdownComponent } from './datatable-builder-action-dropdown.component';

describe('DatatableBuilderActionDropdownComponent', () => {
  let component: DatatableBuilderActionDropdownComponent;
  let fixture: ComponentFixture<DatatableBuilderActionDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatatableBuilderActionDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatatableBuilderActionDropdownComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
