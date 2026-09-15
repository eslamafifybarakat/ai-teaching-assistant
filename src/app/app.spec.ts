import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // App's template contains <router-outlet>, so a router must be provided
      // even though no route is exercised here.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the root component', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders without throwing', () => {
    const fixture = TestBed.createComponent(App);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
