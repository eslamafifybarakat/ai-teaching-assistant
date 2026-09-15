import { TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Badge] }).compileComponents();
  });

  it('creates with the neutral tone by default', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.detectChanges();
    expect(fixture.componentInstance.tone()).toBe('neutral');
    expect(fixture.componentInstance.dot()).toBe(false);
  });

  it('accepts a tone input', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    expect(fixture.componentInstance.tone()).toBe('success');
  });
});
