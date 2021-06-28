import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url : any ="http://localhost:3003/";
  private loginResponse$ : any;
  private token : string;
  private name : string;
  private tokenTimer : any;

  constructor(private http : HttpClient, private toaster : ToastrService, private router : Router) { }

  loginUser(data){
    this.loginResponse$ = this.http.post(this.url+'login',data);
    this.loginResponse$.subscribe( res => {
      this.token = res.token;
      if(this.token){
        console.log(res);
        const expiresInDuration = res.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.name = res.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.name);
        localStorage.getItem("token");
        localStorage.getItem("expiration");
        localStorage.getItem("userId");
        this.router.navigate(['/profile']);
      }
      else{
        console.log(res.msg);
        this.toaster.error(res.msg);
      }
    });
  }
  // loginUser(data){
  //   return this.http.post(this.url+'login',data);
  // }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private setAuthTimer(duration: number) {

    this.tokenTimer = setTimeout(() => {
      console.log('times up');
      this.logout();
      alert('your session time is over.You will be automatically logged out');
      this.router.navigate(['/login']);
    }, duration * 1000);
  }

  public logout() {
    this.token = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    console.log('logging out');
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
}
