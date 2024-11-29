import { Routes } from '@angular/router';
import { UserComponent } from './component/user/list/user.component';
import { LoginComponent } from './component/login/login.component';
import { AchievementComponent } from './component/achievement/achievement.component';
import { GroupAchievementComponent } from './component/group-achievement/group-achievement.component';
import { GroupAttitudeSkillComponent } from './component/group-attitude-skill/group-attitude-skill.component';
import { AttitudeSkillComponent } from './component/attitude-skill/attitude-skill.component';
import { EmpSuggestionComponent } from './component/emp-suggestion/emp-suggestion.component';

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
    },
    {
        path: 'attitude-skill',
        component: AttitudeSkillComponent
    },
    {
        path: 'group-attitude-skill',
        component: GroupAttitudeSkillComponent
    },
    {
        path: 'emp-suggestion',
        component: EmpSuggestionComponent
    }
    
];
