import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegistrationService } from '../../services/registration/registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form : FormGroup;
  regObj$;

  constructor(private fb : FormBuilder, private rs : RegistrationService, private router : Router, private toaster : ToastrService ) {

    this.form = this.fb.group({
      name: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      password: ['',[Validators.required,Validators.minLength(8)]]
    })
   }

  ngOnInit(): void {
  }

  get formData(){
    return this.form.controls;
  }

  onSubmit(formData){
    //alert('success');
    console.log(this.form.value);
    console.log(formData);
    const data = { name:this.form.value.name,
                   email:this.form.value.email,
                   password:this.form.value.password }
    this.regObj$ = this.rs.registerUser(data);
    this.regObj$.subscribe( res => {
      if(res.msg == "successful"){
        console.log('success')
        alert('You have been regostered successfully!')
        this.router.navigate(['/login'])

      }
      else if(res.msg == "User exits!!"){
        console.log('user exists')
        this.toaster.error('User exists')
      }
      else{
        console.log('error')
        this.toaster.error('Error! Please try again!')
      }
    })
    this.form.reset();
  }

}
