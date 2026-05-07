import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PageInfo {
  title: string;
  subtitle: string;
}

@Injectable({ providedIn: 'root' })
export class PageService {
  private pageSubject = new BehaviorSubject<PageInfo>({
    title: 'Dashboard',
    subtitle: 'Suivi du trafic aérien en temps réel'
  });

  public page$ = this.pageSubject.asObservable();
  public currentPage = 'dashboard';

  setPage(page: string, title: string, subtitle: string) {
    this.currentPage = page;
    this.pageSubject.next({ title, subtitle });
  }

  getPage(): PageInfo {
    return this.pageSubject.value;
  }
}
