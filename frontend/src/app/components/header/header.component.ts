import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchControl = new FormControl('');
  isSearchActive = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.trim().length >= 2) {
          this.navigateToSearch(value);
        }
      });
  }

  navigateToSearch(query: string): void {
    this.router.navigate(['/search'], { queryParams: { q: query } });
    this.searchControl.setValue('');
    this.isSearchActive = false;
  }

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      setTimeout(() => {
        const searchInput = document.querySelector('.header-search-input input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 0);
    } else {
      this.searchControl.setValue('');
    }
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchControl.value?.trim();
    if (query && query.length >= 2) {
      this.navigateToSearch(query);
    }
  }
}
