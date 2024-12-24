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
import { EmpAttitudeSkillComponent } from './component/emp-attitude-skill/emp-attitude-skill.component';
import { TechnicalSkillComponent } from './component/technical-skill/technical-skill.component';
import { EmpTechnicalSkillComponent } from './component/emp-technical-skill/emp-technical-skill.component';
import { ProfilComponent } from './component/profil/profil.component';
import { DevplanComponent } from './component/devplan/list/devplan.component';
import { authGuard } from './guard/auth.guard';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EmpDevplanComponent } from './component/emp-devplan/emp-devplan.component';
import { ViewEmpdevplanComponent } from './component/view-empdevplan/view-empdevplan.component';
import { SummarySelfComponent } from './component/summary-self/summary-self.component';
import { FullAssSumComponent } from './component/full-ass-sum/full-ass-sum.component';
import { roleGuard } from './guard/role.guard';
import { isLoggedInGuard } from './guard/is-logged-in.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    
  },
  {
    path: 'login',
    canActivate: [isLoggedInGuard],
    component: LoginComponent,
  },
  {
    path: 'user-management',
    canActivate: [authGuard, roleGuard],
    component: UserComponent,
    data: {permission: 'user#all'}
  },
  {
    path: 'achievement',
    canActivate: [authGuard, roleGuard],
    component: AchievementComponent,
    data: {permission: 'achievement#all'}
  },
  {
    path: 'group-achievement',
    canActivate: [authGuard, roleGuard],
    component: GroupAchievementComponent,
    data: {permission: 'group-achievement#all'}
  },
  {
    path: 'emp-achievement-skill',
    canActivate: [authGuard, roleGuard],
    component: EmpAchievementSkillComponent,
    data: {permission: 'emp-achievement#all'}
  },
  {
    path: 'attitude-skill',
    canActivate: [authGuard, roleGuard],
    component: AttitudeSkillComponent,
    data: {permission: 'attitude-skill#all'}
  },
  {
    path: 'group-attitude-skill',
    canActivate: [authGuard, roleGuard],
    component: GroupAttitudeSkillComponent,
    data: {permission: 'group-attitude-skill#all'}
  },
  {
    path: 'emp-attitude-skill',
    canActivate: [authGuard, roleGuard],
    component: EmpAttitudeSkillComponent,
    data: {permission: 'emp-attitude-skill#all'}
  },
  {
    path: 'emp-suggestion',
    canActivate: [authGuard, roleGuard],
    component: EmpSuggestionComponent,
    data: {permission: 'emp-suggestion#all'}
  },
  {
    path: 'division-management',
    canActivate: [authGuard, roleGuard],
    component: DivisiComponent,
    data: {permission: 'division#all'}
  },
  {
    path: 'menu-management',
    canActivate: [authGuard, roleGuard],
    component: MenuManagementComponent,
    data: {permission: 'role-menu#all'}
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    component: ProfilComponent,
  },
  {
    path: 'technical-skill',
    canActivate: [authGuard, roleGuard],
    component: TechnicalSkillComponent,
    data: {permission: 'technical-skill#all'}
  },
  {
    path: 'emp-technical-skill',
    canActivate: [authGuard, roleGuard],
    component: EmpTechnicalSkillComponent,
    data: {permission: 'emp-technical-skill#all'}
  },
  {
    path: 'development-plan',
    canActivate: [authGuard, roleGuard],
    component: DevplanComponent,
    data: {permission: 'dev-plan#all'}
  },
  {
    path: 'employee-development-plan',
    canActivate: [authGuard, roleGuard],
    component: EmpDevplanComponent,
    data: {permission: 'emp-dev-plan#all'}
  },
  {
    path: 'view-user',
    canActivate: [authGuard, roleGuard],
    component: UserComponent,
    data: {permission: 'user#read'}
  },
  {
    path: 'view-empdevplan',
    canActivate: [authGuard, roleGuard],
    component: ViewEmpdevplanComponent,
    data: {permission: 'emp-dev-plan#read'}
  },
  {
    path: 'user/summary-view',
    canActivate: [authGuard, roleGuard],
    component: SummarySelfComponent,
    data: {permission: 'summary#read.self'}
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  }

];
