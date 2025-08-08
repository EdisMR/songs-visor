import { Pipe, PipeTransform } from '@angular/core';
import { DbCategoriesService } from '../services/db-categories.service';

@Pipe({
  name: 'processedCategoriesText',
  standalone: false
})
export class ProcessedCategoriesTextPipe implements PipeTransform {

  constructor(
    private readonly categoriesSvc: DbCategoriesService
  ) { }

  transform(value: string): Promise<string> {
    console.log('Value for pipe categories: ', value)
    if (value == '') return new Promise<string>((resolve, reject) => resolve(''))
    let categoriesArray = []
    let result = ''

    categoriesArray = value.split(',')

    let promise = new Promise<string>((resolve, reject) => {
      this.categoriesSvc.openDatabase()
      this.categoriesSvc.getAllCategories().then(categories => {
        categories.forEach(category => {
          categoriesArray.forEach(elm => {
            if (elm === category.uniqueId) {
              result += category.name + ', '
            }
          })
        })
        return resolve(result.slice(0, -2))
      })
    })
    return promise

  }

}
