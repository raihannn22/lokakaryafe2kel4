import { Routes } from '@angular/router';
import { UserComponent } from './component/user/list/user.component';
import { LoginComponent } from './component/login/login.component';
import { AchievementComponent } from './component/achievement/achievement.component';
import { GroupAchievementComponent } from './component/group-achievement/group-achievement.component';
import { GroupAttitudeSkillComponent } from './component/group-attitude-skill/group-attitude-skill.component';
import { AttitudeSkillComponent } from './component/attitude-skill/attitude-skill.component';
import { EmpSuggestionComponent } from './component/emp-suggestion/emp-suggestion.component';
import { DivisiComponent } from './component/divisi/list/divisi.component';
import { EmpAchievementSkillComponent } from './component/emp-achievement-skill/emp-achievement-skill.component';
import { MenuManagementComponent } from './component/menu-management/menu-management.component';
import { ProfilComponent } from './profil/profil.component';



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
        path: 'emp-achievement-skill',
        component: EmpAchievementSkillComponent
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
    },
    {
        path: 'divisi',
        component: DivisiComponent
    },
    {
        path: 'menu-management',
        component: MenuManagementComponent
    },
    {
        path: 'profile',
        component: ProfilComponent
    }
    
];
