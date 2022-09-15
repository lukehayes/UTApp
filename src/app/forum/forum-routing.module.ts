import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonServiceModule } from '../services/common-service/common-service.module';
import { ForumPage } from './forum.page';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: ForumPage
  },
  {
    path: 'forumcomments/:id',
    loadChildren: () => import('./forumcomments/forumcomments.module').then( m => m.ForumcommentsPageModule)
  },
  {
    path: 'forumfilter',
    loadChildren: () => import('./forumfilter/forumfilter.module').then( m => m.ForumfilterPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),FormsModule , ReactiveFormsModule,CommonServiceModule],
  exports: [RouterModule,CommonServiceModule],
})
export class ForumPageRoutingModule {}
