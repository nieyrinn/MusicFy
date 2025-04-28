import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Annotation } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all annotations for a lyrics
  getAnnotations(lyricsId: number): Observable<Annotation[]> {
    return this.http.get<Annotation[]>(`${this.apiUrl}/lyrics/${lyricsId}/annotations/`);
  }

  // Get a specific annotation
  getAnnotation(id: number): Observable<Annotation> {
    return this.http.get<Annotation>(`${this.apiUrl}/annotations/${id}/`);
  }

  // Create a new annotation
  createAnnotation(annotation: Omit<Annotation, 'id' | 'created_at' | 'updated_at'>): Observable<Annotation> {
    return this.http.post<Annotation>(`${this.apiUrl}/annotations/`, annotation);
  }

  // Update an existing annotation
  updateAnnotation(id: number, annotation: Partial<Annotation>): Observable<Annotation> {
    return this.http.patch<Annotation>(`${this.apiUrl}/annotations/${id}/`, annotation);
  }

  // Delete an annotation
  deleteAnnotation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/annotations/${id}/`);
  }
}
