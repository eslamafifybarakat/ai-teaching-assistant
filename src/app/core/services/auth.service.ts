import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppUser, SchoolStage, UserRole } from '../models/user.model';

const STORAGE_KEY = 'ata_user';

export const DEMO_ACCOUNTS: AppUser[] = [
  { id: 'u1', name: 'د. أحمد المصري', email: 'professor@demo.edu', role: 'professor', avatarInitials: 'أم', avatarColor: '#4f5fd6', title: 'roles.professor' },
  { id: 'u2', name: 'م. سارة حسن', email: 'ta@demo.edu', role: 'ta', avatarInitials: 'سح', avatarColor: '#10b981', title: 'roles.ta' },
  { id: 'u3', name: 'أ. منى إبراهيم', email: 'teacher@demo.edu', role: 'schoolTeacher', avatarInitials: 'مإ', avatarColor: '#f59e0b', title: 'roles.schoolTeacher' },
  { id: 'u4', name: 'د. محمود عبد الله', email: 'head@demo.edu', role: 'head', avatarInitials: 'مع', avatarColor: '#8b5cf6', title: 'roles.head' },
  { id: 'u5', name: 'يوسف كريم', email: 'student@demo.edu', role: 'student', avatarInitials: 'يك', avatarColor: '#ef4444', title: 'roles.student' },
];

export const DEMO_PASSWORD = '123456';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AppUser | null>(this.readInitial());
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly role = computed<UserRole | null>(() => this.currentUser()?.role ?? null);

  private readonly router = inject(Router);

  private readInitial(): AppUser | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  }

  private persist(user: AppUser | null): void {
    if (typeof localStorage === 'undefined') return;
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async login(email: string, password: string): Promise<{ ok: boolean; user?: AppUser }> {
    await this.delay(700);
    const user = DEMO_ACCOUNTS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || password !== DEMO_PASSWORD) return { ok: false };
    this.currentUser.set(user);
    this.persist(user);
    return { ok: true, user };
  }

  loginAsDemo(user: AppUser): AppUser {
    this.currentUser.set(user);
    this.persist(user);
    return user;
  }

  setStage(stage: SchoolStage): void {
    const u = this.currentUser();
    if (!u) return;
    const updated = { ...u, stage };
    this.currentUser.set(updated);
    this.persist(updated);
  }

  logout(): void {
    this.currentUser.set(null);
    this.persist(null);
    this.router.navigateByUrl('/auth/login');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
