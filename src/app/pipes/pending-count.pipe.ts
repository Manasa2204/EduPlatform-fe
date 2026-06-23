import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pendingCount' })
export class PendingCountPipe implements PipeTransform {
  transform(applications: any[]): number {
    return (applications || []).filter(a => a.status === 'pending').length;
  }
}
