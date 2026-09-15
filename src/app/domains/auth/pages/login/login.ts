import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, DEMO_ACCOUNTS, DEMO_PASSWORD } from '../../../../core/services/auth.service';
import { AppUser, SchoolStage } from '../../../../core/models/user.model';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { Button } from '../../../../shared/components/button/button';
import { Avatar } from '../../../../shared/components/avatar/avatar';
import { Modal } from '../../../../shared/components/modal/modal';
import { LanguageSwitcher } from '../../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, TranslatePipe, Button, Avatar, Modal, LanguageSwitcher, ThemeToggle],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  demoAccounts = DEMO_ACCOUNTS;

  mode = signal<'signin' | 'reset'>('signin');
  email = signal('');
  password = signal('');
  rememberMe = signal(true);
  loading = signal(false);
  errorMsg = signal('');
  resetSent = signal(false);

  stagePickerOpen = signal(false);
  pendingTeacher = signal<AppUser | null>(null);

  passwordHint = DEMO_PASSWORD;

  canSubmit = computed(() => this.email().trim().length > 3 && this.password().length > 0 && !this.loading());

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.errorMsg.set('');
    const result = await this.auth.login(this.email(), this.password());
    this.loading.set(false);
    if (!result.ok || !result.user) {
      this.errorMsg.set('auth.invalidCredentials');
      return;
    }
    this.afterLogin(result.user);
  }

  loginAsDemo(user: AppUser): void {
    if (user.role === 'schoolTeacher' && !user.stage) {
      this.pendingTeacher.set(user);
      this.stagePickerOpen.set(true);
      return;
    }
    const logged = this.auth.loginAsDemo(user);
    this.afterLogin(logged);
  }

  pickStage(stage: SchoolStage): void {
    const teacher = this.pendingTeacher();
    if (!teacher) return;
    const logged = this.auth.loginAsDemo(teacher);
    this.auth.setStage(stage);
    this.stagePickerOpen.set(false);
    this.afterLogin(logged);
  }

  private afterLogin(user: AppUser): void {
    this.toast.success(`${user.name} 👋`);
    if (user.role === 'student') this.router.navigateByUrl('/student/performance');
    else this.router.navigateByUrl('/app/dashboard');
  }

  goReset(): void {
    this.mode.set('reset');
    this.resetSent.set(false);
  }

  goSignIn(): void {
    this.mode.set('signin');
  }

  sendReset(): void {
    this.resetSent.set(true);
  }

  roleLabelKey(role: string): string {
    return 'roles.' + role;
  }
}
