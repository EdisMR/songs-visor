import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SongInterface } from '../../interface/song-interface';
import { DbSongsService } from '../../services/db-songs.service';

@Component({
  selector: 'app-song-component',
  standalone: false,
  templateUrl: './song-component.html',
  styleUrl: './song-component.scss'
})
export class SongComponent {
  constructor(
    private readonly _songsSvc: DbSongsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _Router: Router
  ) {
    this.activatedRouteSubscription = this._activatedRoute.params.subscribe(params => {
      this._songsSvc.openDatabase().then(() => {
        this.songId = params['id'] || '';
        if (this.songId) {
          this.getCurrentSong(this.songId);
        } else {
          console.error('No se ha proporcionado un ID de canto válido.');
        }
        this._songsSvc.getAllSongs().then(songs => {
          this.otherSongsLinks = songs.map(song => song.shortId);
        })
      });
    });
  }
  activatedRouteSubscription: Subscription
  songId: string = ''

  getCurrentSong(songId: string) {
    console.log('value for songId: ', songId)
    this._songsSvc.getByshortId(songId).then(song => {
      if (!song) {
        this._Router.navigate([''])
      }
      this.rawSong = song
    })
  }

  public rawSong: SongInterface = {
    author: '',
    categories: '',
    dateCreated: '',
    dateUpdated: '',
    name: '',
    relatedLinks: '',
    shortId: '',
    songText: '',
    uniqueId: ''
  }

  get relatedLinksProcessed(): string[] {
    if (!this.rawSong.relatedLinks) return [];
    return this.rawSong.relatedLinks.split(',');
  }

  public otherSongsLinks: string[] = []

  public transposedValue: number = 0
  public transposedSong(q: number) {
    this.transposedValue += q
  }
  public resetTransposition() {
    this.transposedValue = 0
  }

  closeFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

}
