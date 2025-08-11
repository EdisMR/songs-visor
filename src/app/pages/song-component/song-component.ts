import { Component, OnDestroy } from '@angular/core';
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
export class SongComponent implements OnDestroy {
  constructor(
    private readonly _songsSvc: DbSongsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _Router: Router
  ) {
    this.activatedRouteSubscription = this._activatedRoute.params.subscribe(params => {
      this._songsSvc.openDatabase().then(() => {
        this.songId = params['id'] || '';
        this._songsSvc.getAllSongs().then(songs => {
          this.otherSongsLinks = songs.map(song => song.shortId);
          if (this.songId) {
            this.rawSong = songs.find(song => song.shortId === this.songId) || {} as SongInterface
            this.relatedLinksProcessed = this.rawSong.relatedLinks.split(',') || []
            if (!this.rawSong.name) {
              this._Router.navigate([''])
            }
          } else {
            this._Router.navigate([''])
          }
        })
      });
    });
  }

  activatedRouteSubscription: Subscription
  songId: string = ''

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

  public relatedLinksProcessed: string[] = []

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

  ngOnDestroy(): void {
    this.activatedRouteSubscription?.unsubscribe();
  }
}
