import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { LanguageSwitcher } from '../../../shared/components/language-switcher/language-switcher';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';
import { DropdownMenu } from '../../../shared/components/dropdown-menu/dropdown-menu';
import { AiChatWidget } from '../../../domains/ai-assistant/components/ai-chat-widget/ai-chat-widget';

interface NavItem {
  key: string;
  icon: string;
  link: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { key: 'nav.dashboard', icon: '🏠', link: '/app/dashboard' },
  { key: 'nav.courses', icon: '📚', link: '/app/courses' },
  { key: 'nav.questionBank', icon: '🧠', link: '/app/question-bank' },
  { key: 'nav.analytics', icon: '📊', link: '/app/analytics' },
  { key: 'nav.reports', icon: '📄', link: '/app/reports' },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe, Avatar, LanguageSwitcher, ThemeToggle, DropdownMenu, AiChatWidget],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  auth = inject(AuthService);
  private router = inject(Router);

  navItems = NAV_ITEMS;
  sidebarCollapsed = signal(false);
  mobileOpen = signal(false);
  aiOpen = signal(false);

  user = computed(() => this.auth.currentUser());

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  startLecture(): void {
    this.router.navigateByUrl('/app/lecture/new');
    this.closeMobile();
  }

  logout(id: string): void {
    if (id === 'logout') this.auth.logout();
    if (id === 'settings') this.router.navigateByUrl('/app/dashboard');
  }
}
