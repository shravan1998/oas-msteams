import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs/index";
import { MatSnackBar } from "@angular/material/snack-bar";
import { APIResponse } from "../app/models/APIResponse";
import {Router} from '@angular/router';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  // public API = 'http://localhost:8080/web/';
  token = "xoxp-969360925856-959248215649-961978930499-a904c8c1d0a605767f151794e4a68fdb";
  public serverUrl = "http://localhost:8080/web/";
  //  serverUrl = 'http://localhost:8080/web/';

  constructor(private http: HttpClient, private snackBar: MatSnackBar,private router:Router) {}

  login(basic: string): Observable<boolean> {
    const url = this.serverUrl + "login";
    const headers: HttpHeaders = new HttpHeaders();
    headers.set("Authorization", "Basic " + basic);
    headers.set("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(url, "", {
        headers: {
          Authorization: "Basic " + basic,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        observe: "response"
      })
      .pipe(
        tap((response: any) => {
          const apires: APIResponse = response.body;
          let result = false;
          if (apires.status === 0) {
            localStorage.setItem("token", response.headers.get("x-auth-token"));
            // console.log(
            //   'after login response token: ' +
            //   response.headers.get('x-auth-token'),
            // );
            const emp: any = apires.data;
            // console.log(emp)
            if (emp.user.isFirstLogin === 0) {
              // localStorage.setItem('role', emp.systemRole);
              localStorage.setItem("cred", basic);
              // localStorage.setItem('features', JSON.stringify(emp.features));
              localStorage.setItem("user", JSON.stringify(emp));
              sessionStorage.setItem("login", "true");
             // console.log(localStorage.getItem("user"));
          
              
            
            }
            result = true;
          } else {
            result = false;
            this.openSnack(apires.description, "OK");
          }

          return result;
        }),
        catchError(this.handleError())
      );
      
  }

  private openSnack(message: string, label: string) {
    this.snackBar.open(message, label, {
      duration: 2000
    });
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // console.log('-----error-----');
      // TODO: send the error to remote logging infrastructure
      // console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      // return of(result as T);
      this.openSnack("Failed. Try again.", "OK");
      // return Observable.throw(result);
      return throwError(result);
    };
  }

  httpGet(
    queryUrl: string,
    myparams: any,
    showSnack = true,
    showProgress = true
  ): Observable<any> {
    const url = this.serverUrl + queryUrl;
    if (showProgress) {
      // Swal.showLoading();
    }
    return this.http
      .get(url, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "X-Requested-With": "XMLHttpRequest"
        },
        params: myparams
      })
      .pipe(
        tap((data: APIResponse) => {
          // this.pd.dismissProgressDialog();
          // return this.extractGetData(data);
          if (data.status === 0) {
            return data.data;
          }
        }),
        catchError((error: any) => {
          if (error.status === 401) {
            this.silentLogin().subscribe(res => {});
            return null;
          } else {
            if (showSnack) {
              const err = this.handleError(error);
              return throwError(err);
            } else {
              return null;
            }
            // return Observable.throw(err);
          }
        })
      );
  }
  httpPost(
    queryUrl: string,
    object: any,
    params: any,
    showSnack = true
  ): Observable<any> {
    // this.pd.showProgressDialog('Please wait...');
    const body = JSON.stringify(object);
    const url = this.serverUrl + queryUrl;
    this.token = localStorage.getItem("token");
    const options = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
        "X-Requested-With": "XMLHttpRequest"
      }),
      params
    };
    // const options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options).pipe(
      tap((response: any) => {
        // this.pd.dismissProgressDialog();
        if (response.status === 0) {
          if (showSnack) {
            this.openSnack(response.description, "OK");
          }
          return response;
        } else if (response.status === 401) {
          this.silentLogin().subscribe(res => {});
          return false;
        } else {
          if (showSnack) {
            this.openSnack(response.description, "OK");
          }
          return false;
        }
      }),
      catchError(this.handleError())
      // catchError((error: any) => {
      //   // this.pd.dismissProgressDialog();
      //   if (error.status === 401) {
      //     this.silentLogin().subscribe(res => { });
      //     return null;
      //   } else {
      //     if (showSnack) {
      //       const err = this.handleError(error);
      //       return throwError(err);
      //     } else {
      //       return null;
      //     }
      //     // return Observable.throw(err);
      //   }
      // }),
    );
  }

  httpFileUpload(queryUrl: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append("file", file, file.name);
    const url = this.serverUrl + queryUrl;
    const options = {
      headers: new HttpHeaders({
        Accept: "application/json",
        "x-auth-token": localStorage.getItem("token")
      })
    };
    return this.http.post(url, formData, options).pipe(
      tap((response: APIResponse) => {
        if (response.status === 0) {
          return response.data;
        } else {
          return null;
        }
      })
      // catchError(
      //   (error, caught): ObservableInput<any> => {
      //     this.pd.dismissProgressDialog();
      //     if (error.status === 401) {
      //       this.silentLogin().subscribe(res => { });
      //       return null;
      //     } else {
      //       return throwError(error);
      //     }
      //   },
      // ),
    );
  }

  silentLogin(): Observable<boolean> {
    this.openSnack("Session expired. Logging in", "OK");
    // this.pd.showProgressDialog('Please wait...');
    const url = this.serverUrl + "login";
    const basic = localStorage.getItem("cred");
    if (!basic) {
      return;
    }
    const headers: HttpHeaders = new HttpHeaders();
    headers.set("Authorization", "Basic " + basic);
    headers.set("Content-Type", "application/x-www-form-urlencoded");
    return this.http
      .post(url, "", {
        headers: {
          Authorization: "Basic " + basic,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        observe: "response"
      })
      .pipe(
        tap((response: any) => {
          // this.pd.dismissProgressDialog();
          const apires: APIResponse = response.body;
          let result = false;
          if (apires.status === 0) {
            // this.token = response.headers.get('x-auth-token');
            localStorage.setItem("token", response.headers.get("x-auth-token"));

            sessionStorage.setItem("login", "true");
            result = true;
          } else {
            result = false;
          }
          return result;
        }),
        catchError((error: any) => {

          return throwError(error);
        })
      );
  }
  
  
  // this.close();
    
    //return window.close();
  
  //close(){
    //window.close();
 // }
}
