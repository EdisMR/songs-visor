import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, Subscription } from 'rxjs';
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

    if (sessionStorage.getItem(this.SSVERIFICATIONNAME) == null) {
      this._commonSvc.verifyDatabaseFileVersion().subscribe({
        error: () => {
          this._commonSvc.importDatabaseFromUrl().subscribe(result => {
            this._commonSvc.importDatabaseFromJSONData(result).then(e => {
              this.getSongsAndCategories()
              sessionStorage.setItem(this.SSVERIFICATIONNAME, '1')
            })
          })
        },
        complete: () => {
          Promise.all([
            this._songsSvc.openDatabase(),
            this._categoriesSvc.openDatabase()
          ]).finally(() => {
            this.getSongsAndCategories()
          })
        }
      })
    } else {
      Promise.all([
        this._songsSvc.openDatabase(),
        this._categoriesSvc.openDatabase()
      ]).finally(() => {
        this.getSongsAndCategories()
      })
    }
  }
  private readonly SSVERIFICATIONNAME = "verifiedDatabaseVersion"
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


  private counterBehaviour: BehaviorSubject<string> = new BehaviorSubject<string>('')
  private counterBehaviour$ = this.counterBehaviour.asObservable()
  private workingPromise: boolean = false
  private counterBehaviourAdmin: Subscription = this.counterBehaviour$
    .pipe(
      debounceTime(1000)
    )
    .subscribe(result => {
      if (this.workingPromise) {
        return
      }
      this.workingPromise = true
      this.songs = []
      this._songsSvc.getAllSongs().then((songs: SongInterface[]) => {
        this.songs = songs.filter(song => {
          return song.songText.toLowerCase().includes(result) || song.name.toLowerCase().includes(result)
        })
        this.workingPromise = false
        this.sortItems()
        this._cd.markForCheck()
      })
    })
  public searchSong(event: any) {
    this.counterBehaviour.next(event.target.value.toLowerCase())
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

  private sortItems() {
    /* sort by shortId and names */
    this.songs.sort((a, b) => {
      return parseInt(a.shortId) - parseInt(b.shortId)
    })
    this.categories.sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
  }

  ngOnDestroy(): void {
    this.counterBehaviourAdmin?.unsubscribe()
  }
}
