import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class TrieNode {
  children = new Map<string, TrieNode>();
  rowIds = new Set<string>();
}

class SearchTrie {
  private root = new TrieNode();

  insert(text: string, rowId: string) {
    const normalized = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!normalized) return;

    for (const token of normalized.split(' ')) {
      if (!token) continue;
      let node = this.root;
      for (const char of token) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char)!;
        node.rowIds.add(rowId);
      }
    }
  }

  search(query: string): Set<string> {
    const normalized = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!normalized) {
      return new Set();
    }

    const tokens = normalized.split(' ').filter(Boolean);
    let result: Set<string> | null = null;

    for (const token of tokens) {
      let node = this.root;
      for (const char of token) {
        const next = node.children.get(char);
        if (!next) {
          return new Set();
        }
        node = next;
      }

      result = result
        ? new Set(Array.from(result as Set<string>).filter((id) => node.rowIds.has(id)))
        : new Set(Array.from(node.rowIds as Set<string>));
    }

    return result ?? new Set();
  }
}

interface GridRow {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'offline' | 'away';
  role: string;
  department: string;
  lastLogin: Date;
  efficiency: number;
  tags: string[];
  metadata: any;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {
  rows: GridRow[] = [];
  selectedRows: Set<string> = new Set();
  
  groupBy: string = 'department';
  filterText: string = '';
  filteredRows: GridRow[] = [];
  groupedRows: { [key: string]: GridRow[] } = {};
  private rowSearch = new SearchTrie();
  
  departments = ['Engineering', 'Security', 'Data Science', 'Product', 'DevOps', 'QA', 'Management'];

  constructor() { }

  ngOnInit(): void {
    this.generateHeavyData();
    this.applyFilters();
  }

  generateHeavyData() {
    const roles = ['System Architect', 'Security Lead', 'Data Scientist', 'UX Researcher', 'DevOps Engineer', 'Frontend Expert', 'Backend Developer'];
    const statuses: ('online' | 'busy' | 'offline' | 'away')[] = ['online', 'busy', 'offline', 'away'];

    for (let i = 0; i < 500; i++) {
      const row = {
        id: `UID-${1000 + i}`,
        name: `User ${i} - ${Math.random().toString(36).substring(7)}`,
        email: `user.${i}@enterprise-heavy-test.io`,
        status: statuses[i % statuses.length],
        role: roles[i % roles.length],
        department: this.departments[i % this.departments.length],
        lastLogin: new Date(),
        efficiency: Math.floor(Math.random() * 100),
        tags: ['active', 'test', 'heavy', 'migration-ready'],
        metadata: {
          browser: 'Chrome/124.0.0',
          os: 'Windows 11',
          session: Math.random().toString(16)
        }
      };

      this.rows.push(row);
      this.rowSearch.insert(`${row.name} ${row.email} ${row.role} ${row.department} ${row.status} ${row.tags.join(' ')}`, row.id);
    }
  }

  applyFilters() {
    const matches = this.filterText.trim() ? this.rowSearch.search(this.filterText) : new Set(this.rows.map(row => row.id));
    this.filteredRows = this.rows.filter(row => matches.has(row.id));
    this.groupedRows = this.filteredRows.reduce((groups, row) => {
      const value = String((row as any)[this.groupBy] ?? 'Ungrouped');
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(row);
      return groups;
    }, {} as { [key: string]: GridRow[] });
  }

  toggleSelection(id: string) {
    if (this.selectedRows.has(id)) {
      this.selectedRows.delete(id);
    } else {
      this.selectedRows.add(id);
    }
  }

  getGroupedRows() {
    return this.groupedRows;
  }

  getGroupKeys() {
    return Object.keys(this.groupedRows);
  }

  exportData() {
    console.log('Exporting 500 rows with complex metadata...');
    // Simulate heavy export processing
  }

  getInitials(name: string): string {
    return name.split(' ').filter(n => n.length > 0).map(n => n[0]).join('');
  }
}
