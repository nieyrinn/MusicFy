import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Song, Album, Artist } from '../../models/content.model';

@Component({
  standalone: false,
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  album: Album | null = null;
  artist: Artist | null = null;
  loading: boolean = true;
  error: string | null = null;
  albumId: number | null = null;
  artistId: number | null = null;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.albumId = params['albumId'] ? +params['albumId'] : null;
      this.artistId = params['artistId'] ? +params['artistId'] : null;
      this.loadSongs();
    });
  }

  loadSongs(): void {
    this.loading = true;
    this.error = null;

    if (this.albumId) {
      this.contentService.getAlbum(this.albumId).subscribe({
        next: (album: Album | any) => {
          if (album && typeof album === 'object') {
            this.album = album;
          } else {
            console.error('Album response is not in expected format', album);
            this.album = null;
            this.error = 'Failed to load album details. Please try again later.';
          }
        },
        error: (err) => {
          console.error('Error loading album', err);
          this.error = 'Failed to load album details. Please try again later.';
          this.loading = false;
        }
      });

      this.contentService.getSongsByAlbum(this.albumId).subscribe({
        next: (songs: Song[] | any) => {
          if (Array.isArray(songs)) {
            this.songs = songs;
          } else if (songs && typeof songs === 'object') {
            this.songs = (songs as any).results || Object.values(songs);
          } else {
            console.error('Songs response is not in expected format', songs);
            this.songs = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs by album', err);
          this.error = 'Failed to load songs. Please try again later.';
          this.loading = false;
        }
      });
    } else if (this.artistId) {
      this.contentService.getArtist(this.artistId).subscribe({
        next: (artist: Artist | any) => {
          if (artist && typeof artist === 'object') {
            this.artist = artist;
          } else {
            console.error('Artist response is not in expected format', artist);
            this.artist = null;
            this.error = 'Failed to load artist details. Please try again later.';
          }
        },
        error: (err) => {
          console.error('Error loading artist', err);
          this.error = 'Failed to load artist details. Please try again later.';
          this.loading = false;
        }
      });

      this.contentService.getSongsByArtist(this.artistId).subscribe({
        next: (songs: Song[] | any) => {
          if (Array.isArray(songs)) {
            this.songs = songs;
          } else if (songs && typeof songs === 'object') {
            this.songs = (songs as any).results || Object.values(songs);
          } else {
            console.error('Songs response is not in expected format', songs);
            this.songs = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs by artist', err);
          this.error = 'Failed to load songs. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.contentService.getSongs().subscribe({
        next: (songs: Song[] | any) => {
          if (Array.isArray(songs)) {
            this.songs = songs;
          } else if (songs && typeof songs === 'object') {
            this.songs = (songs as any).results || Object.values(songs);
          } else {
            console.error('Songs response is not in expected format', songs);
            this.songs = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs', err);
          this.error = 'Failed to load songs. Please try again later.';
          this.loading = false;
        }
      });
    }
  }
}