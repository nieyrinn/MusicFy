import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Album, Artist, Song, Lyrics, Content } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/artists/`);
  }

  getArtist(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/artists/${id}/`);
  }

  getAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/albums/`);
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/albums/${id}/`);
  }

  getAlbumsByArtist(artistId: number): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/artists/${artistId}/albums/`);
  }

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/songs/`);
  }

  getSong(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/songs/${id}/`);
  }

  getSongsByAlbum(albumId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/albums/${albumId}/songs/`);
  }

  getSongsByArtist(artistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/artists/${artistId}/songs/`);
  }

  getLyrics(songId: number): Observable<Lyrics> {
    return this.http.get<Lyrics>(`${this.apiUrl}/songs/${songId}/lyrics/`);
  }

  getContentByType(contentType: string): Observable<Content[]> {
    return this.http.get<Content[]>(`${this.apiUrl}/content/?type=${contentType}`);
  }

  getContentItem(id: number): Observable<Content> {
    return this.http.get<Content>(`${this.apiUrl}/content/${id}/`);
  }
}
