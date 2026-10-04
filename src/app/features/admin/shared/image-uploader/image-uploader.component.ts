import { Component, input, model, signal } from '@angular/core';
import { ImageDraft } from '../product-form.models';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent {
  images = model<ImageDraft[]>([]);
  editable = input(true);

  protected readonly dropzoneOpen = signal(false);

  protected toggleDropzone(): void {
    this.dropzoneOpen.update((open) => !open);
  }

  protected setPrimary(index: number): void {
    this.images.update((list) => list.map((image, i) => ({ ...image, isPrimary: i === index })));
  }

  protected removeImage(index: number): void {
    this.images.update((list) => list.filter((_, i) => i !== index));
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.addFiles(event.dataTransfer?.files ?? null);
  }

  protected onFilesSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.addFiles(fileInput.files);
    fileInput.value = '';
  }

  private addFiles(files: FileList | null): void {
    if (!files) {
      return;
    }

    const added: ImageDraft[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file, i) => ({
        key: `local-${Date.now()}-${i}`,
        src: URL.createObjectURL(file),
        altText: file.name,
        isPrimary: false,
        file
      }));

    this.images.update((list) => [...list, ...added]);
    this.dropzoneOpen.set(false);
  }
}
