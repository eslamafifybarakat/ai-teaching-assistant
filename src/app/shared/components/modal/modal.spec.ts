import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Modal } from './modal';

// Hosts the modal so its `open` input can be set — Modal is closed by default
// and renders nothing at all until it is opened.
@Component({
  imports: [Modal],
  template: `<app-modal [open]="true" title="Test dialog" (closed)="closedCount = closedCount + 1">
    <p class="body-content">Body</p>
  </app-modal>`,
})
class HostComponent {
  closedCount = 0;
}

describe('Modal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('creates', () => {
    const fixture = TestBed.createComponent(Modal);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders projected content when open', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.body-content')).toBeTruthy();
  });

  // Guards the accessibility restructure: the click-outside veil is a real
  // <button> sitting BESIDE the dialog rather than wrapping it, so a click
  // inside the dialog can never bubble into the close handler. If someone
  // nests the veil around the dialog again, the second assertion fails.
  it('closes when the backdrop veil is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.modal-backdrop__veil').click();
    expect(fixture.componentInstance.closedCount).toBe(1);
  });

  it('does not close when content inside the dialog is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.body-content').click();
    expect(fixture.componentInstance.closedCount).toBe(0);
  });

  it('exposes the backdrop veil as a focusable button with an accessible name', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const veil = fixture.nativeElement.querySelector('.modal-backdrop__veil');
    expect(veil.tagName).toBe('BUTTON');
    expect(veil.getAttribute('aria-label')).toBeTruthy();
  });
});
