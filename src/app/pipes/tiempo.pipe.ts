import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempo',
  standalone: true
})
export class TiempoPipe implements PipeTransform {
  transform(minutos: number): string {
    if (minutos < 60) {
      return `${minutos} minutos`;
    } else {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      if (mins === 0) {
        return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
      }
      return `${horas}h ${mins}min`;
    }
  }
}