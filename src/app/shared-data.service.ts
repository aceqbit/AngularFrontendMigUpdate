import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SharedCalendarEvent {
  id: number;
  date: string;
  title: string;
  details: string;
  editable: boolean;
  source: 'manual' | 'sticky' | 'scheduler';
  status?: 'confirmed' | 'pending' | 'cancelled';
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  resourceId?: string;
  attachments?: string[];
  priority?: 'low' | 'medium' | 'high';
}

export interface SystemPulse {
  timestamp: number;
  entropy: number;
  loadFactor: number;
  activeProcesses: number;
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private readonly calendarStorageKey = 'frontend-calendar-events';
  private readonly schedulerStorageKey = 'frontend-scheduler-events';

  private _pulse$ = new BehaviorSubject<SystemPulse>({
    timestamp: Date.now(),
    entropy: Math.random(),
    loadFactor: 0.5,
    activeProcesses: 10
  });

  private readonly calendarEventsSubject = new BehaviorSubject<SharedCalendarEvent[]>(this.readStorage<SharedCalendarEvent>(this.calendarStorageKey));
  private readonly schedulerEventsSubject = new BehaviorSubject<SharedCalendarEvent[]>(this.readStorage<SharedCalendarEvent>(this.schedulerStorageKey));

  public pulse$: Observable<SystemPulse> = this._pulse$.asObservable();
  public calendarEvents$ = this.calendarEventsSubject.asObservable();
  public schedulerEvents$ = this.schedulerEventsSubject.asObservable();

  constructor() {
    // Heavy global observable pulse to stress component Change Detection
    interval(2000).pipe(
      map(() => ({
        timestamp: Date.now(),
        entropy: Math.random() * 1000,
        loadFactor: Math.random(),
        activeProcesses: Math.floor(Math.random() * 500)
      }))
    ).subscribe(pulse => this._pulse$.next(pulse));
  }

  private readStorage<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T[] : [];
    } catch {
      return [];
    }
  }

  private writeStorage<T>(key: string, items: T[]) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // Ignore storage quota issues in the demo environment.
    }
  }

  private upsertEvent(subject: BehaviorSubject<SharedCalendarEvent[]>, storageKey: string, entry: SharedCalendarEvent) {
    const next = subject.value.filter(item => item.id !== entry.id).concat(entry).sort((left, right) => left.date.localeCompare(right.date) || left.id - right.id);
    subject.next(next);
    this.writeStorage(storageKey, next);
  }

  private removeEvent(subject: BehaviorSubject<SharedCalendarEvent[]>, storageKey: string, id: number) {
    const next = subject.value.filter(item => item.id !== id);
    subject.next(next);
    this.writeStorage(storageKey, next);
  }

  public saveCalendarEvent(entry: SharedCalendarEvent) {
    this.upsertEvent(this.calendarEventsSubject, this.calendarStorageKey, entry);
  }

  public deleteCalendarEvent(id: number) {
    this.removeEvent(this.calendarEventsSubject, this.calendarStorageKey, id);
  }

  public saveSchedulerEvent(entry: SharedCalendarEvent) {
    this.upsertEvent(this.schedulerEventsSubject, this.schedulerStorageKey, entry);
  }

  public deleteSchedulerEvent(id: number) {
    this.removeEvent(this.schedulerEventsSubject, this.schedulerStorageKey, id);
  }

  public createDayEvent(payload: {
    title: string;
    details: string;
    date: Date;
    source: 'manual' | 'sticky' | 'scheduler';
    editable?: boolean;
    status?: 'confirmed' | 'pending' | 'cancelled';
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    resourceId?: string;
    attachments?: string[];
    priority?: 'low' | 'medium' | 'high';
    id?: number;
  }) {
    const event: SharedCalendarEvent = {
      id: payload.id ?? Date.now(),
      date: payload.date.toISOString(),
      title: payload.title,
      details: payload.details,
      editable: payload.editable ?? true,
      source: payload.source,
      status: payload.status,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,
      resourceId: payload.resourceId,
      attachments: payload.attachments ?? [],
      priority: payload.priority,
    };

    return event;
  }

  public dayNameToDate(dayName: string, referenceDate: Date = new Date()): Date {
    const normalized = dayName.toLowerCase();
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(normalized);
    const next = new Date(referenceDate);
    const delta = (dayIndex - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + (delta === 0 ? 7 : delta));
    next.setHours(9, 0, 0, 0);
    return next;
  }

  // Complex cross-component communication method
  public broadcastEvent(origin: string, data: any) {
    console.log(`[GLOBAL_BROADCAST] From: ${origin}`, data);
    // Logic that could trigger updates in many components
  }

  // Large data fetch simulation (Heavy payload)
  public async getHeavySchema(): Promise<any> {
    return Array.from({ length: 100 }, (_, i) => ({
      key: `SCHEMA_REF_${i}`,
      definition: {
        type: 'OBJECT',
        props: Array.from({ length: 20 }, (_, j) => `Prop_${j}`)
      }
    }));
  }
}
