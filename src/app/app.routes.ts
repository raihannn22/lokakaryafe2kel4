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
import { EmpAttitudeSkillComponent } from './component/emp-attitude-skill/emp-attitude-skill.component';
import { TechnicalSkillComponent } from './component/technical-skill/technical-skill.component';
import { EmpTechnicalSkillComponent } from './component/emp-technical-skill/emp-technical-skill.component';
import { ProfilComponent } from './component/profil/profil.component';
import { DevplanComponent } from './component/devplan/list/devplan.component';
import { authGuard } from './guard/auth.guard';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EmpDevplanComponent } from './component/emp-devplan/emp-devplan.component';




export const routes: Routes =  [
    {
        path : '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'user-management',
        canActivate: [authGuard],
        component: UserComponent
    },
    {
        path: 'achievement',
        canActivate: [authGuard],
        component: AchievementComponent
    },
    {
        path: 'group-achievement',
        canActivate: [authGuard],
        component: GroupAchievementComponent
    },
    {
        path: 'emp-achievement-skill',
        canActivate: [authGuard],
        component: EmpAchievementSkillComponent
    },
    {
        path: 'attitude-skill',
        canActivate: [authGuard],
        component: AttitudeSkillComponent
    },
    {
        path: 'group-attitude-skill',
        canActivate: [authGuard],
        component: GroupAttitudeSkillComponent
    },
    {
        path: 'emp-attitude-skill',
        component: EmpAttitudeSkillComponent
    },
    {
        path: 'emp-suggestion',
        canActivate: [authGuard],
        component: EmpSuggestionComponent
    },
    {
        path: 'division-management',
        canActivate: [authGuard],
        component: DivisiComponent
    },
    {
        path: 'menu-management',
        canActivate: [authGuard],
        component: MenuManagementComponent
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        component: ProfilComponent
    },
    {
        path: 'technical-skill',
        component: TechnicalSkillComponent
    },
    {
        path: 'emp-technical-skill',
        component: EmpTechnicalSkillComponent
    }    
        path: 'development-plan',
        canActivate: [authGuard],
        component: DevplanComponent
    },
    {
        path: 'employee-development-plan',
        canActivate: [authGuard],
        component: EmpDevplanComponent
    }
];
