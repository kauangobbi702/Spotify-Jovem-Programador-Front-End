import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { HumorComponent } from './humor.component';

describe('HumorComponent', () => {
  let component: HumorComponent;
  let fixture: ComponentFixture<HumorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumorComponent],
      providers: [provideHttpClient(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
