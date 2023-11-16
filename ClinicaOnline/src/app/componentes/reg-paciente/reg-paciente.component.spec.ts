import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegPacienteComponent } from './reg-paciente.component';

describe('RegPacienteComponent', () => {
  let component: RegPacienteComponent;
  let fixture: ComponentFixture<RegPacienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegPacienteComponent]
    });
    fixture = TestBed.createComponent(RegPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
