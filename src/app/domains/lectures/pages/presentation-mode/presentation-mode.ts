import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { MockDataService } from '../../../../infrastructure/mock-services/mock-data.service';
import { Slide } from '../../../../infrastructure/mock-data/models';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-presentation-mode',
  imports: [TranslatePipe],
  templateUrl: './presentation-mode.html',
  styleUrl: './presentation-mode.scss',
})
export class PresentationMode {
  private route = inject(ActivatedRoute);
  private data = inject(MockDataService);
  private i18n = inject(I18nService);
  router = inject(Router);

  lectureId = this.route.snapshot.paramMap.get('lectureId') ?? 'lec-normalization';
  slides = signal<Slide[]>(this.data.getSlides(this.lectureId));
  index = signal(0);
  slide = computed(() => this.slides()[this.index()]);
  total = computed(() => this.slides().length);

  showNotes = signal(false);
  timerRunning = signal(false);
  seconds = signal(0);
  private timerHandle: ReturnType<typeof setInterval> | null = null;

  toastMsg = signal<string | null>(null);

  next(): void { if (this.index() < this.total() - 1) this.index.update(i => i + 1); }
  prev(): void { if (this.index() > 0) this.index.update(i => i - 1); }

  toggleTimer(): void {
    if (this.timerRunning()) {
      this.timerRunning.set(false);
      if (this.timerHandle) clearInterval(this.timerHandle);
    } else {
      this.timerRunning.set(true);
      this.timerHandle = setInterval(() => this.seconds.update(s => s + 1), 1000);
    }
  }

  resetTimer(): void {
    this.seconds.set(0);
  }

  formattedTime = computed(() => {
    const s = this.seconds();
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  flash(key: string): void {
    const map: Record<string, string> = {
      askAi: 'presentation.askAiFlash',
      video: 'presentation.videoFlash',
      example: 'presentation.exampleFlash',
      results: 'presentation.resultsFlash',
    };
    this.toastMsg.set(this.i18n.translate(map[key] ?? key));
    setTimeout(() => this.toastMsg.set(null), 1800);
  }

  generateQuestion(): void {
    this.router.navigateByUrl('/app/quiz/' + this.lectureId);
  }

  exit(): void {
    if (this.timerHandle) clearInterval(this.timerHandle);
    this.router.navigateByUrl('/app/lecture/' + this.lectureId + '/slides');
  }
}
