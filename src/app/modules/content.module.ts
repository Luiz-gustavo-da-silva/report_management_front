import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '../features/content/content-routing.module';

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class contentModule {}
