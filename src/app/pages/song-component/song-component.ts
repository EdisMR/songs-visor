import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SongInterface } from '../../interface/song-interface';
import { DbSongsService } from '../../services/db-songs.service';

@Component({
  selector: 'app-song-component',
  standalone: false,
  templateUrl: './song-component.html',
  styleUrl: './song-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SongComponent implements OnDestroy {
  constructor(
    private readonly _songsSvc: DbSongsService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _Router: Router,
    private readonly _cd: ChangeDetectorRef
  ) {
    this.activatedRouteSubscription = this._activatedRoute.params.subscribe(params => {
      this._songsSvc.openDatabase().then(() => {
        this.songId = params['id'] || '';
        this.getSongInfo();
      });
    });
  }

  @ViewChild('songMaximizationArea') songMaximizationArea!: ElementRef<HTMLElement>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'm' || event.key === 'M') {
      this.requestFullscreen();
    }
    if (event.key === '+') {
      this.transposedValue++
    }
    if (event.key === '-') {
      this.transposedValue--
    }
    if (event.key === '0') {
      this.resetTransposition()
    }
  }

  private requestFullscreen(): void {
    const elem = this.songMaximizationArea.nativeElement;

    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { // Safari
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { // IE/Edge
        (elem as any).msRequestFullscreen();
      }
    } catch (err) {
      console.error('Error al intentar fullscreen:', err);
    }
  }

  getSongInfo() {
    this._songsSvc.getAllSongs().then(songs => {
      this.otherSongsLinks = songs.map(song => song.shortId);
      this.otherSongsLinks.sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })
      if (this.songId) {
        this.rawSong = songs.find(song => song.shortId === this.songId) || {} as SongInterface
        this.relatedLinksProcessed = this.rawSong.relatedLinks.split(',') || []
        if(this.relatedLinksProcessed.length == 1 && this.relatedLinksProcessed[0] == ''){
          this.relatedLinksProcessed = []
        }
        if (!this.rawSong.name) {
          this._Router.navigate([''])
        }
      } else {
        this._Router.navigate([''])
      }
      this._cd.markForCheck();
    })
  }

  private activatedRouteSubscription: Subscription
  private songId: string = ''

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

  public closeFullscreen(): void {
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
