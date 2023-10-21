import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenTimerComponent } from './token-timer.component';

describe('TokenTimerComponent', () => {
  let component: TokenTimerComponent;
  let fixture: ComponentFixture<TokenTimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenTimerComponent]
    });
    fixture = TestBed.createComponent(TokenTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
