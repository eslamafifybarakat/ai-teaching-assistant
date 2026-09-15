import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { I18nService } from '../../../../core/services/i18n.service';

interface ChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const CANNED_RESPONSES = [
  'بالتأكيد! إليك شرحًا أبسط: فكّر في الأمر كتقسيم جدول كبير إلى جداول أصغر مترابطة لتفادي تكرار البيانات.',
  'مثال إضافي: تخيل جدول طلبات يحتوي اسم العميل وعنوانه مكررين في كل طلب — الحل هو فصلهما في جدول عملاء منفصل.',
  'يمكنك إضافة سؤال بصيغة "اختيار من متعدد" بمستوى صعوبة متوسط حول هذا المفهوم مباشرة من الشريحة الحالية.',
  'غالبًا ما يخطئ الطلاب هنا لأنهم يخلطون بين الاعتماد الجزئي والاعتماد الانتقالي — يفيد توضيح الفرق بمخطط بسيط.',
  'هذا نشاط صفي جيد: اطلب من الطلاب في مجموعات ثنائية تصحيح جدول غير مطبّع خلال 5 دقائق ثم ناقشوا الحلول معًا.',
];

@Component({
  selector: 'app-ai-chat-widget',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './ai-chat-widget.html',
  styleUrl: './ai-chat-widget.scss',
})
export class AiChatWidget {
  private i18n = inject(I18nService);
  open = input(false);
  closed = output<void>();

  draft = signal('');
  thinking = signal(false);
  messages = signal<ChatMessage[]>([]);
  private nextId = 1;
  private responseCursor = 0;

  suggestionKeys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'];

  useSuggestion(key: string): void {
    const text = this.i18n.translate('aiAssistant.' + key);
    this.draft.set(text);
    this.send();
  }

  send(): void {
    const text = this.draft().trim();
    if (!text || this.thinking()) return;
    this.messages.update(list => [...list, { id: this.nextId++, role: 'user', text }]);
    this.draft.set('');
    this.thinking.set(true);
    const reply = CANNED_RESPONSES[this.responseCursor % CANNED_RESPONSES.length];
    this.responseCursor++;
    setTimeout(() => {
      this.messages.update(list => [...list, { id: this.nextId++, role: 'ai', text: reply }]);
      this.thinking.set(false);
    }, 900 + Math.random() * 500);
  }
}
