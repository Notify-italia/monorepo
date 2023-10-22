import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NfcAppComponentsComponent } from './nfc-app-components.component';

describe('NfcAppComponentsComponent', () => {
  let component: NfcAppComponentsComponent;
  let fixture: ComponentFixture<NfcAppComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NfcAppComponentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NfcAppComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
