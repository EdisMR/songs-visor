import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HomeComponent } from './pages/home-component/home-component';
import { SongComponent } from './pages/song-component/song-component';
import { DebugComponent } from './pages/debug-component/debug-component';
import { FooterComponent } from './components/footer-component/footer-component';
import { ProcessedSongTextPipe } from './pipes/processed-song-text-pipe';
import { ProcessedCategoriesTextPipe } from './pipes/processed-categories-text-pipe';
import { ParseDatePipe } from './pipes/parse-date-pipe';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    SongComponent,
    DebugComponent,
    FooterComponent,
    ProcessedSongTextPipe,
    ProcessedCategoriesTextPipe,
    ParseDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
