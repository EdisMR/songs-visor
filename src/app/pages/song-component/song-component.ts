import { Component } from '@angular/core';
import { SongInterface } from '../../interface/song-interface';

@Component({
  selector: 'app-song-component',
  standalone: false,
  templateUrl: './song-component.html',
  styleUrl: './song-component.scss'
})
export class SongComponent {
  song: SongInterface = {
    author: 'author 1',
    categories: '1234,1234',
    dateCreated: '12343',
    dateUpdated: '1234',
    name: 'song 1',
    relatedLinks: '1234,1234,1234,12f',
    shortId: '1234',
    songText: 'this is the song text',
    uniqueId: '1234'
  }

  songTextProcessed:string='this is the song text';

  categoriesProcessed:string='this is the song categories'

  get relatedLinksProcessed():string[]{
    if(!this.song.relatedLinks) return [];
    return this.song.relatedLinks.split(',');
  }

  public get songsLinks():string[]{
    return []
  }
}
