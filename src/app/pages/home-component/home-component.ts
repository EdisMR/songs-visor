import { Component } from '@angular/core';
import { SongInterface } from '../../interface/song-interface';
import { CategoryInterface } from '../../interface/category-interface';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss'
})
export class HomeComponent {
  songs:SongInterface[]=[
    {
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    },
    {
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    },
    {
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    },{
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    },{
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    },{
      author:'author 1',
      categories:'1234,1234',
      dateCreated:'12343',
      dateUpdated:'1234',
      name:'song 1',
      relatedLinks:'',
      shortId:'1234',
      songText:'',
      uniqueId:'1234'
    }
  ]

  categories:CategoryInterface[]=[
    {
      dateCreated:'1234',
      dateUpdated:'1234',
      name:'category 1',
      uniqueId:'1234'
    },{
      dateCreated:'1234',
      dateUpdated:'1234',
      name:'category 1',
      uniqueId:'1234'
    },{
      dateCreated:'1234',
      dateUpdated:'1234',
      name:'category 1',
      uniqueId:'1234'
    },{
      dateCreated:'1234',
      dateUpdated:'1234',
      name:'category 1',
      uniqueId:'1234'
    },{
      dateCreated:'1234',
      dateUpdated:'1234',
      name:'category 1',
      uniqueId:'1234'
    }
  ]
}
