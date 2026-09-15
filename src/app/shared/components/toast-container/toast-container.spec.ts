import { TestBed } from '@angular/core/testing';
import { ToastContainer } from './toast-container';
import { ToastService } from '../../../core/services/toast.service';

describe('ToastContainer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastContainer] }).compileComponents();
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('maps each toast kind to its own icon, falling back to info', () => {
    const component = TestBed.createComponent(ToastContainer).componentInstance;
    const icons = ['success', 'error', 'warning'].map((k) => component.iconFor(k));
    expect(new Set(icons).size).toBe(3);
    expect(component.iconFor('anything-else')).toBe(component.iconFor('info'));
  });

  it('renders a toast pushed through the service', () => {
    const fixture = TestBed.createComponent(ToastContainer);
    TestBed.inject(ToastService).success('Lecture saved');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Lecture saved');
  });
});
