import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from '@/services/storage.service';
import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-picture-upload',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './picture-upload.component.html',
})
export class PictureUploadComponent implements OnInit {
  storageService = new StorageService();
  @Input() value?: Observable<number | null>;
  @Input() onChange?: (pictureId: number | null) => void;

  previewUrl: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  uploading = new BehaviorSubject(false);

  constructor() {}

  ngOnInit() {
    this.value?.subscribe((pictureId) => {
      if (pictureId) {
        this.loadPreview(pictureId);
      } else {
        this.previewUrl.next(null);
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile(input.files[0]);
    }
  }

  removePicture(event: Event) {
    event.stopPropagation();
    this.previewUrl.next(null);
    this.onChange?.(null);
  }

  private uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      return;
    }

    this.uploading.next(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.next(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.storageService.store(file).subscribe({
      next: (response) => {
        this.uploading.next(false);
        this.onChange?.(response.id);
      },
      error: () => {
        this.uploading.next(false);
        this.previewUrl.next(null);
      },
    });
  }

  private loadPreview(pictureId: number) {
    this.storageService.getFilePath(pictureId).subscribe({
      next: (dataUrl) => {
        this.previewUrl.next(dataUrl);
      },
      error: () => {
        this.previewUrl.next(null);
      },
    });
  }
}
