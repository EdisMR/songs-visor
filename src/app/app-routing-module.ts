import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from './pages/debug-component/debug-component';
import { HomeComponent } from './pages/home-component/home-component';
import { SongComponent } from './pages/song-component/song-component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'debug', component: DebugComponent },
  { path: 'song/:id', component: SongComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
