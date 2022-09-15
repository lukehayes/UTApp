import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/auth.guard';
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'workoutselection',
        loadChildren: () => import('../workoutselection/workoutselection.module').then(m => m.WorkoutselectionPageModule)
      },
      {
        path: 'my-workouts',
        loadChildren: () => import('../my-workouts/my-workouts.module').then(m => m.MyWorkoutsPageModule)
      },
      {
        path: 'calender',
        loadChildren: () => import('../calender/calender.module').then(m => m.CalenderPageModule)
      },
      {
        path: 'nutrition',
        loadChildren: () => import('../nutrition/nutrition.module').then(m => m.NutritionPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'exercises',
        loadChildren: () => import('../exercises-list/exercises-list.module').then(m => m.ExercisesListPageModule)
      },	
      
      {
        path: '',
        redirectTo: '/tabs/workoutselection',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/workoutselection',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
