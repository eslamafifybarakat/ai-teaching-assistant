import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

@Pipe({ name: 'translate', pure: false, standalone: true })
export class TranslatePipe implements PipeTransform {
  private i18n = inject(I18nService);

  transform(key: string | null | undefined, params?: Record<string, string | number>): string {
    if (!key) return '';
    return this.i18n.translate(key, params);
  }
}
