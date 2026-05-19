import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../shared-data.service';

interface Note {
  id: number;
  title: string;
  content: string;
  x: number;
  y: number;
  color: string;
  isPinned: boolean;
  lastModified: Date;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  dueDay: string;
  attachments: string[];
}

@Component({
  selector: 'app-sticky-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.css']
})
export class StickyNotesComponent implements OnInit {
  notes: Note[] = [];
  colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  composer = {
    title: '',
    content: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    dueDay: this.weekDays[new Date().getDay()],
    attachments: [] as string[]
  };
  
  draggedNote: Note | null = null;
  offsetX = 0;
  offsetY = 0;

  highPriorityNotes: Note[] = [];
  mediumPriorityNotes: Note[] = [];
  lowPriorityNotes: Note[] = [];

  constructor(private sharedData: SharedDataService) { }

  ngOnInit(): void {
    this.generateHeavyData();
    this.refreshPriorityBuckets();
  }

  generateHeavyData() {
    for (let i = 0; i < 8; i++) {
      this.notes.push({
        id: i,
        title: `Note #${i}`,
        content: `This is a heavy content for note number ${i}. We are testing the rendering performance of multiple sticky notes on a board. ${'lorem ipsum '.repeat(10)}`,
        x: Math.random() * 800,
        y: Math.random() * 600,
        color: this.colors[i % this.colors.length],
        isPinned: Math.random() > 0.8,
        lastModified: new Date(),
        tags: ['stress-test', 'angular-16', 'heavy-data'],
        priority: i % 3 === 0 ? 'high' : (i % 3 === 1 ? 'medium' : 'low'),
        dueDay: this.weekDays[i % this.weekDays.length],
        attachments: []
      });
    }
  }

  addNote() {
    if (!this.composer.title.trim() && !this.composer.content.trim()) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: this.composer.title || 'New Note',
      content: this.composer.content,
      x: 100,
      y: 100,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      isPinned: false,
      lastModified: new Date(),
      tags: [],
      priority: this.composer.priority,
      dueDay: this.composer.dueDay,
      attachments: [...this.composer.attachments]
    };
    this.notes.push(newNote);
    this.appendToPriorityBucket(newNote);
    this.syncNoteWithCalendar(newNote);
    this.composer = { title: '', content: '', priority: 'low', dueDay: this.weekDays[new Date().getDay()], attachments: [] };
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.removeFromPriorityBuckets(id);
  }

  onMouseDown(event: MouseEvent, note: Note) {
    if (note.isPinned) return;
    this.draggedNote = note;
    this.offsetX = event.clientX - note.x;
    this.offsetY = event.clientY - note.y;
  }

  onMouseMove(event: MouseEvent) {
    if (this.draggedNote) {
      this.draggedNote.x = event.clientX - this.offsetX;
      this.draggedNote.y = event.clientY - this.offsetY;
      this.draggedNote.lastModified = new Date();
    }
  }

  onMouseUp() {
    this.draggedNote = null;
  }

  trackByNoteId(index: number, note: Note) {
    return note.id;
  }

  moveNoteToPriority(note: Note) {
    note.lastModified = new Date();
    this.removeFromPriorityBuckets(note.id);
    this.appendToPriorityBucket(note);
    this.syncNoteWithCalendar(note);
  }

  getPinnedCount() {
    return this.notes.filter(n => n.isPinned).length;
  }

  updateNoteContent(note: Note, event: any) {
    note.content = event.target.value;
    note.lastModified = new Date();
    this.syncNoteWithCalendar(note);
  }

  togglePin(note: Note) {
    note.isPinned = !note.isPinned;
  }

  changeColor(note: Note) {
    const currentIndex = this.colors.indexOf(note.color);
    note.color = this.colors[(currentIndex + 1) % this.colors.length];
  }

  handleComposerFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).map(file => file.name);
    this.composer.attachments = files;
  }

  handleNoteFiles(note: Note, event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).map(file => file.name);
    note.attachments = [...note.attachments, ...files];
    note.lastModified = new Date();
    this.syncNoteWithCalendar(note);
    input.value = '';
  }

  syncNoteWithCalendar(note: Note) {
    const date = this.sharedData.dayNameToDate(note.dueDay);
    const eventEntry = this.sharedData.createDayEvent({
      title: note.title,
      details: note.content || `Sticky note (${note.priority})`,
      date,
      source: 'sticky',
      editable: true,
      dayOfWeek: note.dueDay,
      attachments: note.attachments,
      priority: note.priority
    });

    this.sharedData.saveCalendarEvent(eventEntry);
    this.sharedData.saveSchedulerEvent(eventEntry);
  }

  private appendToPriorityBucket(note: Note) {
    if (note.priority === 'high') {
      this.highPriorityNotes.push(note);
      return;
    }

    if (note.priority === 'medium') {
      this.mediumPriorityNotes.push(note);
      return;
    }

    this.lowPriorityNotes.push(note);
  }

  private removeFromPriorityBuckets(id: number) {
    this.highPriorityNotes = this.highPriorityNotes.filter(note => note.id !== id);
    this.mediumPriorityNotes = this.mediumPriorityNotes.filter(note => note.id !== id);
    this.lowPriorityNotes = this.lowPriorityNotes.filter(note => note.id !== id);
  }

  private refreshPriorityBuckets() {
    this.highPriorityNotes = this.notes.filter(note => note.priority === 'high');
    this.mediumPriorityNotes = this.notes.filter(note => note.priority === 'medium');
    this.lowPriorityNotes = this.notes.filter(note => note.priority === 'low');
  }
}
