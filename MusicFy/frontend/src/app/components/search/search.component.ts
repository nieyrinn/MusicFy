import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { SearchResult } from '../../models/content.model';

@Component({
  standalone: false,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults: SearchResult | null = null;
  loading: boolean = false;
  error: string | null = null;
  noResults: boolean = false;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.searchControl.setValue(query);
        this.performSearch(query);
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.trim().length < 2) {
          this.searchResults = null;
          this.noResults = false;
          this.error = null;
          return of(null);
        }
        
        this.loading = true;
        this.error = null;
        
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: query },
          queryParamsHandling: 'merge'
        });
        
        return this.searchService.search(query).pipe(
          catchError(err => {
            console.error('Search error:', err);
            this.error = 'An error occurred while searching. Please try again.';
            this.loading = false;
            return of(null);
          })
        );
      })
    ).subscribe(results => {
      this.loading = false;
      
      if (results) {
        this.searchResults = results;
        this.noResults = !results.songs.length && !results.albums.length && !results.artists.length;
      }
    });
  }

  performSearch(query: string): void {
    if (!query || query.trim().length < 2) {
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    this.searchService.search(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.noResults = !results.songs.length && !results.albums.length && !results.artists.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error:', err);
        this.error = 'An error occurred while searching. Please try again.';
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchResults = null;
    this.noResults = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: null },
      queryParamsHandling: 'merge'
    });
  }
}
