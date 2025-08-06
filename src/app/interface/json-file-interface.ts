import { CategoryInterface } from "./category-interface"
import { SongInterface } from "./song-interface"

export interface JsonFileInterface {
	version:string
	lastUpdate:string
	creationDate:string
	songs:SongInterface[]
	categories:CategoryInterface[]
}
