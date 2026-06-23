import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zoomCount' })
export class ZoomCountPipe implements PipeTransform {
  transform(schedule: any[]): number {
    return (schedule || []).filter(s => s.zoomLink).length;
  }
}
