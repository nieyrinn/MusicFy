import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchResult } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  search(query: string): Observable<SearchResult> {
    const params = new HttpParams().set('q', query);
    return this.http.get<SearchResult>(`${this.apiUrl}/search/`, { params });
  }

  searchSongs(query: string): Observable<SearchResult['songs']> {
    const params = new HttpParams().set('q', query).set('type', 'song');
    return this.http.get<SearchResult['songs']>(`${this.apiUrl}/search/songs/`, { params });
  }

  searchAlbums(query: string): Observable<SearchResult['albums']> {
    const params = new HttpParams().set('q', query).set('type', 'album');
    return this.http.get<SearchResult['albums']>(`${this.apiUrl}/search/albums/`, { params });
  }

  searchArtists(query: string): Observable<SearchResult['artists']> {
    const params = new HttpParams().set('q', query).set('type', 'artist');
    return this.http.get<SearchResult['artists']>(`${this.apiUrl}/search/artists/`, { params });
  }
}
