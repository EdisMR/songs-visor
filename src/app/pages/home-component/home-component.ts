import { Component } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { CategoryInterface } from '../../interface/category-interface';
import { JsonFileInterface } from '../../interface/json-file-interface';
import { SongInterface } from '../../interface/song-interface';
import { CommonService } from '../../services/common.service';
import { DbCategoriesService } from '../../services/db-categories.service';
import { DbSongsService } from '../../services/db-songs.service';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  constructor(
    private readonly _songsSvc: DbSongsService,
    private readonly _categoriesSvc: DbCategoriesService,
    private readonly _commonSvc: CommonService
  ) {
    this._songsSvc.openDatabase().then(e => {
      this.getSongsAndCategories()
    })
    this._categoriesSvc.openDatabase().then(e => {
      this.getSongsAndCategories()
    })
  }
  public songs: SongInterface[] = []

  public categories: CategoryInterface[] = []

  public importData() {
    this._commonSvc.readDatabaseFile().then((data: JsonFileInterface) => {
      this._commonSvc.importDatabaseFromJSONData(data).then(e => {
        this.getSongsAndCategories()
      })
    })
  }

  public clearDatabase() {
    let confirmation = window.confirm('¿Desea borrar la base de datos?')
    if (!confirmation) {
      return
    }
    this._songsSvc.clearSongs().then(e => {
      this._categoriesSvc.clearCategories().then(e => {
        this.songs = []
        this.categories = []
      })
    })
  }

  private getSongsAndCategories() {
    this._songsSvc.getAllSongs().then(songs => {
      this.songs = songs
    })
    this._categoriesSvc.getAllCategories().then(categories => {
      this.categories = categories
    })
  }

  private filterTimeController: BehaviorSubject<number> = new BehaviorSubject<number>(0)
  private filterTime = this.filterTimeController.asObservable()
  public searchSong(event: any) {
    if (event.target.value.length == 0) {
      this.getSongsAndCategories()
      return
    }
    let stringToEvaluate = ((event.target.value as string).toLowerCase())
    this.filterTimeController.next(1)
    this.filterTime
      .pipe(
        debounceTime(1000)
      )
      .subscribe(e => {
        if (e == 1) {
          this._songsSvc.getAllSongs().then(songs => {
            this.songs = []
            songs.forEach(song => {
              if (song.name.toLowerCase().includes(stringToEvaluate)) {
                this.songs.push(song)
              }
              if (song.songText.toLowerCase().includes(stringToEvaluate)) {
                this.songs.push(song)
              }
            })
          })
          this.filterTimeController.next(0)
        }
      })
  }

  public filterByCategory(categoryId: string) {
    this._songsSvc.getAllSongs().then(songs => {
      this.songs = []
      if (categoryId == 'all') {
        this.songs = songs
        return
      }
      songs.forEach(song => {
        let categoriesIds = (song.categories).split(',')
        if (categoriesIds.includes(categoryId)) {
          this.songs.push(song)
        }
      })
    })
  }
}
