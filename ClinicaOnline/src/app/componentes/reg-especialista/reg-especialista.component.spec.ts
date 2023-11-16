import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegEspecialistaComponent } from './reg-especialista.component';

describe('RegEspecialistaComponent', () => {
  let component: RegEspecialistaComponent;
  let fixture: ComponentFixture<RegEspecialistaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegEspecialistaComponent]
    });
    fixture = TestBed.createComponent(RegEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
