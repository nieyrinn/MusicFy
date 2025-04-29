import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Album, Artist, Song } from '../../models/content.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  featuredAlbums: Album[] = [];
  popularSongs: Song[] = [];
  featuredArtists: Artist[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
    this.loadFeaturedContent();
  }

  loadFeaturedContent(): void {
    this.contentService.getAlbums().subscribe({
      next: (albums: Album[] | any) => {
        if (Array.isArray(albums)) {
          this.featuredAlbums = albums.slice(0, 5); 
        } else if (albums && typeof albums === 'object') {
          const albumsArray = (albums as any).results || Object.values(albums);
          this.featuredAlbums = albumsArray.slice(0, 5);
        } else {
          console.error('Albums response is not in expected format', albums);
          this.featuredAlbums = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading albums', err);
        this.error = 'Failed to load featured albums. Please try again later.';
        this.loading = false;
      }
    });

    this.contentService.getSongs().subscribe({
      next: (songs: Song[] | any) => {
        if (Array.isArray(songs)) {
          this.popularSongs = songs.slice(1, 6); 
        } else if (songs && typeof songs === 'object') {
          const songsArray = (songs as any).results || Object.values(songs);
          this.popularSongs = songsArray.slice(1, 6);
        } else {
          console.error('Songs response is not in expected format', songs);
          this.popularSongs = [];
        }
      },
      error: (err) => {
        console.error('Error loading songs', err);
        this.error = 'Failed to load popular songs. Please try again later.';
      }
    });

    this.contentService.getArtists().subscribe({
      next: (artists: Artist[] | any) => {
        if (Array.isArray(artists)) {
          this.featuredArtists = artists.slice(0, 5); 
        } else if (artists && typeof artists === 'object') {
          const artistsArray = (artists as any).results || Object.values(artists);
          this.featuredArtists = artistsArray.slice(0, 5);
        } else {
          console.error('Artists response is not in expected format', artists);
          this.featuredArtists = [];
        }
      },
      error: (err) => {
        console.error('Error loading artists', err);
        this.error = 'Failed to load featured artists. Please try again later.';
      }
    });
  }
}
