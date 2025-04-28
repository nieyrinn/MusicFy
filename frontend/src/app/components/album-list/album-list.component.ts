import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Album, Artist } from '../../models/content.model';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  albums: Album[] = [];
  artist: Artist | null = null;
  loading: boolean = true;
  error: string | null = null;
  artistId: number | null = null;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artistId = params['artistId'] ? +params['artistId'] : null;
      this.loadAlbums();
    });
  }

  loadAlbums(): void {
    this.loading = true;
    this.error = null;

    if (this.artistId) {
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

      // Load albums by artist
      this.contentService.getAlbumsByArtist(this.artistId).subscribe({
        next: (albums) => {
          this.albums = albums;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading albums by artist', err);
          this.error = 'Failed to load albums. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      // Load all albums
      this.contentService.getAlbums().subscribe({
        next: (albums) => {
          this.albums = albums;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading albums', err);
          this.error = 'Failed to load albums. Please try again later.';
          this.loading = false;
        }
      });
    }
  }
}
