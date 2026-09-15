import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';
import { SUPPORTED_LANGUAGES, LangCode } from '../../../core/models/lang.model';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-language-switcher',
  imports: [DropdownMenu, TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  i18n = inject(I18nService);
  languages = SUPPORTED_LANGUAGES;

  choose(code: string): void {
    this.i18n.setLang(code as LangCode);
  }
}
