import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TeamsService } from './teams.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedIn: BehaviorSubject<boolean>;
  private employee: BehaviorSubject<boolean>;
  private empRid: any;

  redirectUrl: string;

  constructor(private teamService: TeamsService,
    private router: Router,
  ) {
    this.loggedIn = new BehaviorSubject<boolean>(
      sessionStorage.getItem('login') ? true : false,
    );
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isLoggedInValue() {
    return this.loggedIn.getValue();
  }

  // get isEmployee() {
  //   return this.employee.asObservable();
  // }

  // get isEmployeeValue() {
  //   return this.employee.getValue();
  // }

  login(uname: string, pass: string, auto: boolean): Observable<any> {
    let cred;
    if (auto) {
      cred = localStorage.getItem('cred');
    } else {
      cred = btoa(uname + ':' + pass);
    }
    return this.teamService
      .login(cred)
      .pipe(tap(res => {
        this.setLoggedInVal(res)
        // this.setFeatures(res)
      }));
  }

  setLoggedInVal(res: any) {
    if (res.body.status === 0) {
      if (res.body.data.user.isFirstLogin === 0) {
        this.loggedIn.next(true);
      }
    } else {
      this.loggedIn.next(false);
    }
    return res;
  }

  // setFeatures(res: any) {
  //   if (res.body.status === 0) {
  //     const arr: any[] = [];
  //     res.body.data.features.forEach(f => {
  //       arr.push(f.featureRid);
  //     })
  //     if(arr.length == 1) {
  //       this.employee.next(true);
  //     } else {
  //       this.employee.next(false);
  //     }
  //   } 
  //   return res;
  // }



  logout() {
    localStorage.removeItem('autologin');
    // localStorage.removeItem('role');
    sessionStorage.removeItem('login');
    localStorage.removeItem('cred');
    // localStorage.removeItem('features');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.router.navigate(['login'], { replaceUrl: true });

  }
}
