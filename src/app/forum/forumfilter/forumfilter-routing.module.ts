import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { ForumfilterPage } from './forumfilter.page';

const routes: Routes = [
  {
    path: '',
    component: ForumfilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule , ReactiveFormsModule],
  exports: [RouterModule],
})
export class ForumfilterPageRoutingModule {}
