import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Annotation } from '../../models/content.model';
import { AnnotationService } from '../../services/annotation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {
  @Input() annotation: Annotation | null = null;
  @Input() lyricsId: number | null = null;
  @Input() selectedText: string = '';
  @Input() selectedStartIndex: number = -1;
  @Input() selectedEndIndex: number = -1;
  @Input() isCreating: boolean = false;

  @Output() annotationCreated = new EventEmitter<Annotation>();
  @Output() annotationUpdated = new EventEmitter<Annotation>();
  @Output() annotationDeleted = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  annotationForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private annotationService: AnnotationService,
    private snackBar: MatSnackBar
  ) {
    this.annotationForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if (this.annotation && !this.isCreating) {
      this.annotationForm.patchValue({
        content: this.annotation.content
      });
    }
  }

  onSubmit(): void {
    if (this.annotationForm.invalid) return;

    const content = this.annotationForm.value.content;
    this.loading = true;

    if (this.isCreating && this.lyricsId) {
      // Create new annotation
      const newAnnotation = {
        lyrics_id: this.lyricsId,
        start_index: this.selectedStartIndex,
        end_index: this.selectedEndIndex,
        content: content
      };

      this.annotationService.createAnnotation(newAnnotation).subscribe({
        next: (annotation) => {
          this.snackBar.open('Annotation created successfully', 'Close', { duration: 3000 });
          this.annotationCreated.emit(annotation);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error creating annotation', err);
          this.error = 'Failed to create annotation. Please try again.';
          this.loading = false;
        }
      });
    } else if (this.annotation) {
      // Update existing annotation
      this.annotationService.updateAnnotation(this.annotation.id, { content }).subscribe({
        next: (annotation) => {
          this.snackBar.open('Annotation updated successfully', 'Close', { duration: 3000 });
          this.annotationUpdated.emit(annotation);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error updating annotation', err);
          this.error = 'Failed to update annotation. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  deleteAnnotation(): void {
    if (!this.annotation) return;

    if (confirm('Are you sure you want to delete this annotation?')) {
      this.loading = true;
      
      this.annotationService.deleteAnnotation(this.annotation.id).subscribe({
        next: () => {
          this.snackBar.open('Annotation deleted successfully', 'Close', { duration: 3000 });
          this.annotationDeleted.emit(this.annotation!.id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting annotation', err);
          this.error = 'Failed to delete annotation. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
