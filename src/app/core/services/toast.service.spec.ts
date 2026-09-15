import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('starts with no toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('adds a toast with the requested kind', () => {
    service.success('Saved');
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].kind).toBe('success');
    expect(service.toasts()[0].message).toBe('Saved');
  });

  it('gives each toast a distinct id', () => {
    service.info('one');
    service.info('two');
    const [a, b] = service.toasts();
    expect(a.id).not.toBe(b.id);
  });

  it('dismisses only the toast with the given id', () => {
    service.error('first');
    service.error('second');
    const keptId = service.toasts()[1].id;

    service.dismiss(service.toasts()[0].id);

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].id).toBe(keptId);
  });
});
