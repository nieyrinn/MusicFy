import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { AnnotationService } from '../../services/annotation.service';
import { Song, Lyrics, Annotation } from '../../models/content.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lyrics-view',
  templateUrl: './lyrics-view.component.html',
  styleUrls: ['./lyrics-view.component.scss']
})
export class LyricsViewComponent implements OnInit {
  song: Song | null = null;
  lyrics: Lyrics | null = null;
  annotations: Annotation[] = [];
  loading: boolean = true;
  error: string | null = null;
  songId: number = 0;
  
  selectedText: string = '';
  selectedStartIndex: number = -1;
  selectedEndIndex: number = -1;
  newAnnotation: string = '';
  showAnnotationForm: boolean = false;
  activeAnnotation: Annotation | null = null;

  constructor(
    private contentService: ContentService,
    private annotationService: AnnotationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.songId = +params['songId'];
      this.loadSongAndLyrics();
    });
  }

  loadSongAndLyrics(): void {
    this.loading = true;
    this.error = null;

    // Load song details
    this.contentService.getSong(this.songId).subscribe({
      next: (song) => {
        this.song = song;
        
        // Load lyrics after song is loaded
        this.contentService.getLyrics(this.songId).subscribe({
          next: (lyrics) => {
            this.lyrics = lyrics;
            this.loadAnnotations();
          },
          error: (err) => {
            console.error('Error loading lyrics', err);
            this.error = 'Failed to load lyrics. Please try again later.';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading song', err);
        this.error = 'Failed to load song details. Please try again later.';
        this.loading = false;
      }
    });
  }

  loadAnnotations(): void {
    if (!this.lyrics) {
      this.loading = false;
      return;
    }

    this.annotationService.getAnnotations(this.lyrics.id).subscribe({
      next: (annotations) => {
        this.annotations = annotations;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading annotations', err);
        this.snackBar.open('Failed to load annotations', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onTextSelection(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const lyricsElement = document.querySelector('.lyrics-content');
    
    if (!lyricsElement || !lyricsElement.contains(range.commonAncestorContainer)) {
      return;
    }
    
    // Get the selected text
    this.selectedText = selection.toString().trim();
    
    if (this.selectedText) {
      // Get the offsets (this is simplified and may need adjustment)
      const lyricsText = lyricsElement.textContent || '';
      const selectedText = this.selectedText;
      
      // Find the start position of selected text in lyrics content
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(lyricsElement);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      this.selectedStartIndex = preSelectionRange.toString().length;
      this.selectedEndIndex = this.selectedStartIndex + selectedText.length;
      
      this.showAnnotationForm = true;
    }
  }

  cancelAnnotation(): void {
    this.resetSelectionState();
  }

  saveAnnotation(): void {
    if (!this.lyrics || !this.selectedText || !this.newAnnotation) {
      return;
    }

    const newAnnotationData = {
      lyrics_id: this.lyrics.id,
      start_index: this.selectedStartIndex,
      end_index: this.selectedEndIndex,
      content: this.newAnnotation
    };

    this.annotationService.createAnnotation(newAnnotationData).subscribe({
      next: (annotation) => {
        this.annotations.push(annotation);
        this.snackBar.open('Annotation added successfully', 'Close', {
          duration: 3000
        });
        this.resetSelectionState();
      },
      error: (err) => {
        console.error('Error creating annotation', err);
        this.snackBar.open('Failed to add annotation', 'Close', {
          duration: 3000
        });
      }
    });
  }

  showAnnotation(annotation: Annotation): void {
    this.activeAnnotation = annotation;
  }

  hideAnnotation(): void {
    this.activeAnnotation = null;
  }

  private resetSelectionState(): void {
    this.selectedText = '';
    this.selectedStartIndex = -1;
    this.selectedEndIndex = -1;
    this.newAnnotation = '';
    this.showAnnotationForm = false;

    // Clear any text selection
    if (window.getSelection) {
      if (window.getSelection()?.empty) {
        window.getSelection()?.empty();
      } else if (window.getSelection()?.removeAllRanges) {
        window.getSelection()?.removeAllRanges();
      }
    }
  }

  getAnnotationClass(index: number): string[] {
    const classes = [];
    for (const annotation of this.annotations) {
      if (index >= annotation.start_index && index < annotation.end_index) {
        classes.push('annotated');
        if (this.activeAnnotation === annotation) {
          classes.push('active');
        }
      }
    }
    return classes;
  }

  // Helper to render the lyrics with annotation highlights
  get lyricsWithAnnotations(): { char: string, classes: string[], annotationId?: number }[] {
    if (!this.lyrics || !this.lyrics.content) {
      return [];
    }

    const result = [];
    const text = this.lyrics.content;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const classes = this.getAnnotationClass(i);
      
      let annotationId;
      for (const annotation of this.annotations) {
        if (i >= annotation.start_index && i < annotation.end_index) {
          annotationId = annotation.id;
          break;
        }
      }
      
      result.push({ char, classes, annotationId });
    }
    
    return result;
  }
}
