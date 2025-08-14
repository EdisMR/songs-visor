import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDate',
  standalone: false
})
export class ParseDatePipe implements PipeTransform {

  transform(value: string): string {
    let date = new Date(parseInt(value, 36))

    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, '0')
    let day = date.getDate().toString().padStart(2, '0')
    let hours = date.getHours().toString().padStart(2, '0')
    let minutes = date.getMinutes().toString().padStart(2, '0')
    let seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

}
