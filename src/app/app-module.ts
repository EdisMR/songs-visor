import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { FooterComponent } from './components/footer-component/footer-component';
import { DebugComponent } from './pages/debug-component/debug-component';
import { HomeComponent } from './pages/home-component/home-component';
import { SongComponent } from './pages/song-component/song-component';
import { ParseDatePipe } from './pipes/parse-date-pipe';
import { ProcessedCategoriesTextPipe } from './pipes/processed-categories-text-pipe';
import { ProcessedSongTextPipe } from './pipes/processed-song-text-pipe';

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
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
