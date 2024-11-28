import { Routes } from '@angular/router';
import { UserComponent } from './component/user/list/user.component';
import { LoginComponent } from './component/login/login.component';
import { AchievementComponent } from './component/achievement/achievement.component';
import { GroupAchievementComponent } from './component/group-achievement/group-achievement.component';

export const routes: Routes =  [
    {
        path : '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'achievement',
        component: AchievementComponent
    },
    {
        path: 'group-achievement',
        component: GroupAchievementComponent
    }
    
];
