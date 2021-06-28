import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
//import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginform : FormGroup;
  loginMessage;
  invalidDetails : boolean = false;
  sub: any;
  obj$;

  constructor(private fb : FormBuilder, private router : Router, private toastr : ToastrService, private as : AuthService) {
    this.loginform = this.fb.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    })
    // interval(10000).subscribe(x => {
    //   //this.myFunctionThatDoesStuff();
    //   console.log('called')
  //});
   
   }

  ngOnInit(): void {
    localStorage.clear();
    //this.sub = Observable.interval(10000)
    //.subscribe((val) => { console.log('called'); });
  }

  get formData(){
    return this.loginform.controls;
  }

  onSubmit(formData){
    //alert('success');
    //console.log(this.form.value);
    console.log(formData);
    const data = { email:this.loginform.value.email,
                   password:this.loginform.value.password }
    // this.loginMessage = this.rs.loginUser(data);
    // if(this.loginMessage == 'Logged In'){
    //   this.router.navigate(['/profile']);
    // }else{
    //   this.toastr.error(this.loginMessage,'error')
    // }
    this.as.loginUser(data);
    // this.obj$.subscribe( res => {
    //   if(res.token){
    //     localStorage.setItem('token',res.token);

    //   }
    // })
    //this.as.loginUser(data);
  }

}
