import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TimesheetDisplayComponent} from '../app/timesheet-display/timesheet-display.component';
import {AddTimesheetComponent} from '../app/add-timesheet/add-timesheet.component'; 
import {LoginComponent} from './login/login.component';
import { from } from 'rxjs';

const routes: Routes = [{
  path:'timesheet-display',
  component:TimesheetDisplayComponent
},
{
  path:'',
  component:LoginComponent
},{
  path:'add-timesheet',
  component:AddTimesheetComponent
},{
  path:'login',
  component:LoginComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
