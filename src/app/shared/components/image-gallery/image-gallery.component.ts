import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  templateUrl: './image-gallery.component.html'
})
export class ImageGalleryComponent {
  images = input.required<string[]>();
  alt = input('');
  // Two-way with the parent so the selected image survives re-renders and can be reset by the parent.
  selectedIndex = model(0);

  protected readonly current = computed(() => this.images()[this.selectedIndex()] ?? this.images()[0] ?? '');

  protected previous(): void {
    const total = this.images().length;
    this.selectedIndex.set((this.selectedIndex() - 1 + total) % total);
  }

  protected next(): void {
    this.selectedIndex.set((this.selectedIndex() + 1) % this.images().length);
  }
}
