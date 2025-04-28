import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Song, Album, Artist } from '../../models/content.model';

@Component({
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
      // Load album details
      this.contentService.getAlbum(this.albumId).subscribe({
        next: (album) => {
          this.album = album;
        },
        error: (err) => {
          console.error('Error loading album', err);
          this.error = 'Failed to load album details. Please try again later.';
          this.loading = false;
        }
      });

      // Load songs by album
      this.contentService.getSongsByAlbum(this.albumId).subscribe({
        next: (songs) => {
          this.songs = songs;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs by album', err);
          this.error = 'Failed to load songs. Please try again later.';
          this.loading = false;
        }
      });
    } else if (this.artistId) {
      // Load artist details
      this.contentService.getArtist(this.artistId).subscribe({
        next: (artist) => {
          this.artist = artist;
        },
        error: (err) => {
          console.error('Error loading artist', err);
          this.error = 'Failed to load artist details. Please try again later.';
          this.loading = false;
        }
      });

      // Load songs by artist
      this.contentService.getSongsByArtist(this.artistId).subscribe({
        next: (songs) => {
          this.songs = songs;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading songs by artist', err);
          this.error = 'Failed to load songs. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      // Load all songs
      this.contentService.getSongs().subscribe({
        next: (songs) => {
          this.songs = songs;
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
