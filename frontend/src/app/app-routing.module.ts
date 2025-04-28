import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { SongListComponent } from './components/song-list/song-list.component';
import { LyricsViewComponent } from './components/lyrics-view/lyrics-view.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'albums', component: AlbumListComponent },
  { path: 'albums/:albumId/songs', component: SongListComponent },
  { path: 'songs', component: SongListComponent },
  { path: 'songs/:songId', component: LyricsViewComponent },
  { path: 'artists/:artistId/albums', component: AlbumListComponent },
  { path: 'artists/:artistId/songs', component: SongListComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect to home for invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
