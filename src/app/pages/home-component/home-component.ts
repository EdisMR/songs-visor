import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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
  styleUrl: './home-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnDestroy {
  constructor(
    private readonly _songsSvc: DbSongsService,
    private readonly _categoriesSvc: DbCategoriesService,
    private readonly _commonSvc: CommonService,
    private readonly _cd: ChangeDetectorRef
  ) {
    Promise.all([
      this._songsSvc.openDatabase(),
      this._categoriesSvc.openDatabase()
    ]).finally(() => {
      this.getSongsAndCategories()
    })
  }
  public songs: SongInterface[] = []
  public categories: CategoryInterface[] = []

  public importDataFromFile() {
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
    Promise.all([
      this._songsSvc.clearSongs(),
      this._categoriesSvc.clearCategories()
    ]).then(e => {
      this.getSongsAndCategories()
    })
  }

  private getSongsAndCategories() {
    Promise.all([
      this._songsSvc.getAllSongs(),
      this._categoriesSvc.getAllCategories()
    ]).then(([songs, categories]) => {
      this.songs = songs
      this.categories = categories
      this.sortItems()
      /* Remove unused categories */
      for (let category of this.categories) {
        let isCategoryUsed = false;
        for (let song of this.songs) {
          let categoriesIds = (song.categories).split(',');
          if (categoriesIds.includes(category.uniqueId)) {
            isCategoryUsed = true;
            break;
          }
        }
        if (!isCategoryUsed) {
          this.categories = this.categories.filter(c => c.uniqueId != category.uniqueId);
        }
      }
    }).finally(() => {
      this.filterByCategory('all')
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
        this.sortItems()
        this._cd.markForCheck()
        return
      }
      songs.forEach(song => {
        let categoriesIds = (song.categories).split(',')
        if (categoriesIds.includes(categoryId)) {
          this.songs.push(song)
        }
      })
      this.sortItems()
      this._cd.markForCheck()
    })
  }

  sortItems() {
    /* sort by shortId and names */
    this.songs.sort((a, b) => {
      return parseInt(a.shortId) - parseInt(b.shortId)
    })
    this.categories.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  ngOnDestroy(): void {
    this.filterTimeController.next(0)
    this.filterTimeController.unsubscribe()
    this.filterTimeController.closed
  }
}
