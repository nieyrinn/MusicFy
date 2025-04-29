import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content.service';
import { Album, Artist } from '../../models/content.model';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss'],
  standalone: false
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
      this.contentService.getArtist(this.artistId).subscribe({
        next: (artist) => {
          if (artist && typeof artist === 'object') {
            this.artist = artist;
          } else {
            console.error('Artist response is not in expected format', artist);
            this.artist = null;
          }
        },
        error: (err) => {
          console.error('Error loading artist', err);
          this.error = 'Failed to load artist details. Please try again later.';
          this.loading = false;
        }
      });

      this.contentService.getAlbumsByArtist(this.artistId).subscribe({
        next: (albums: Album[] | any) => {
          if (Array.isArray(albums)) {
            this.albums = albums;
          } else if (albums && typeof albums === 'object') {
            this.albums = (albums as any).results || Object.values(albums);
          } else {
            console.error('Albums response is not in expected format', albums);
            this.albums = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading albums by artist', err);
          this.error = 'Failed to load albums. Please try again later.';
          this.loading = false;
        }
      });
    } else {
      this.contentService.getAlbums().subscribe({
        next: (albums: Album[] | any) => {
          if (Array.isArray(albums)) {
            this.albums = albums;
          } else if (albums && typeof albums === 'object') {
            this.albums = (albums as any).results || Object.values(albums);
          } else {
            console.error('Albums response is not in expected format', albums);
            this.albums = [];
          }
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
