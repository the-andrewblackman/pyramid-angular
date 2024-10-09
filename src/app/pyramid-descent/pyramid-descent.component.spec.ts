import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidDescentComponent } from './pyramid-descent.component';

describe('PyramidDescentComponent', () => {
  let component: PyramidDescentComponent;
  let fixture: ComponentFixture<PyramidDescentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PyramidDescentComponent]
    });
    fixture = TestBed.createComponent(PyramidDescentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
