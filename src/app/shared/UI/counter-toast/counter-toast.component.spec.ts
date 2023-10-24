import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterToastComponent } from './counter-toast.component';

describe('CounterToastComponent', () => {
  let component: CounterToastComponent;
  let fixture: ComponentFixture<CounterToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterToastComponent]
    });
    fixture = TestBed.createComponent(CounterToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
