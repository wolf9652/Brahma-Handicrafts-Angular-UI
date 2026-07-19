import { Component, signal } from '@angular/core';
import { ShellComponent } from './shared/components/shell/shell.component';

@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Brahma Handicrafts');
}
