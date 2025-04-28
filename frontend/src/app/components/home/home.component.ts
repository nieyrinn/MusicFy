import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Album, Artist, Song } from '../../models/content.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
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
    // Load featured albums
    this.contentService.getAlbums().subscribe({
      next: (albums) => {
        this.featuredAlbums = albums.slice(0, 4); // Take first 4 albums
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading albums', err);
        this.error = 'Failed to load featured albums. Please try again later.';
        this.loading = false;
      }
    });

    // Load popular songs
    this.contentService.getSongs().subscribe({
      next: (songs) => {
        this.popularSongs = songs.slice(0, 6); // Take first 6 songs
      },
      error: (err) => {
        console.error('Error loading songs', err);
        this.error = 'Failed to load popular songs. Please try again later.';
      }
    });

    // Load featured artists
    this.contentService.getArtists().subscribe({
      next: (artists) => {
        this.featuredArtists = artists.slice(0, 3); // Take first 3 artists
      },
      error: (err) => {
        console.error('Error loading artists', err);
        this.error = 'Failed to load featured artists. Please try again later.';
      }
    });
  }
}
