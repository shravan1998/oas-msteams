import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamsService } from '../../service/teams.service';
import { LocationStrategy } from '@angular/common';
import { LoginService } from '../../service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  remember = false;
  formErrors = {
    loginName: '',
    loginPass: '',
  };

  validationMessages = {
    loginName: {
      required: 'Login name is required.',
      minlength: 'Name must be at least 4 characters long.',
      maxlength: 'Name cannot be more than 24 characters long.',
    },
    loginPass: {
      required: 'Password is required.',
      minlength: 'Password must be at least 6 characters long.',
      maxlength: 'Password cannot be more than 24 characters long.',
    },
  };

  logSub: any;

  options = [
    {
      value: 1,
      text: `Admin`,
    },
    {
      value: 2,
      text: `Partner`,
    },
    {
      value: 3,
      text: `Optom`,
    },
    {
      value: 4,
      text: `Super Admin`,
    },
  ];

  selectedOption: any = { value: 1, text: 'Admin' };

  fpClick = false;

  constructor(
    private router: Router,
    private authService: LoginService,
    private httpService: TeamsService,
    private fb: FormBuilder,
    private locationStrategy: LocationStrategy
  ) {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  ngOnInit() {
    this.logSub = this.authService.isLoggedIn.subscribe(logdin => {
      if (logdin) {
        this.router.navigate(['timesheet-display']);
      } else if (localStorage.getItem('autologin')) {
        this.authService.login('', '', true).subscribe(response => {
          if (response.body.status === 0) {       
              this.router.navigate(['timesheet-display'], { replaceUrl: true });
            
          }
        });
      }
      this.unsub();
    });
    this.buildForm();
  }

  unsub() {
    if (this.logSub) {
      this.logSub.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsub();
  }

  buildForm(): void {
    this.loginForm = this.fb.group({
      loginName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(24),
        ],
      ],
      loginPass: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(24),
        ],
      ],
    });
  }

  onSubmit(): void {
    this.fpClick = true;

    this.authService
      .login(
        this.loginForm.value.loginName,
        this.loginForm.value.loginPass,
        false,
      )
      .subscribe(response => {
        console.log(response);
        Swal.showLoading();
        if (response.body.status === 0) {
          if (response.body.data.user.isFirstLogin === 0) {
            if (this.remember) {
              localStorage.setItem('autologin', 'YES');
            }
            // if(response.body.data.user.empRid == 0) {
            //   this.router.navigate(['partner'], { replaceUrl: true });
            // } else {
            this.router.navigate(['timesheet-display'], { replaceUrl: true });

            // }
          } else {
            this.router.navigate(['change-password',
              {
                userRid: response.body.data.userRid,
                password: this.loginForm.value.loginPass,
              }
            ], { skipLocationChange: true });
          }
        }
        Swal.close();

      });
  }

  setRemember(event) {
    this.remember = event.checked;
  }

  dropSelect(option: any) {
    this.selectedOption = option;
  }

  forgotPassword() {
    this.fpClick = true;
    if (this.loginForm.value.loginName === '') {
      return;
    }

    const params = {
      loginId: this.loginForm.value.loginName
    };



  }

}
