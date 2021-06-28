import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { RegistrationService } from '../../services/registration/registration.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isAdmin : boolean = false;
  constructor(private router : Router, private rs : RegistrationService, private as : AuthService) { }
  id;
  clear$;

  ngOnInit(): void {
    this.id = localStorage.getItem('userId');
    if( this.id == 'admin'){
      this.isAdmin = true;
    }

  }

  logout(){
    this.as.logout();
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }

  clearData(){
    if(this.isAdmin){
      var ans = confirm("Are you sure you want to delete all data?");
      if(ans){
      this.clear$ = this.rs.clearRegisteredData();
      this.clear$.subscribe(res => {
        if(res.msg == 'removed'){
          console.log('data removed');
        }else{
          console.log('unsuccess');
        }
      })
    }
    }else{
      alert('you are not allowed to clear data!! only admin can')
    }
  }

}
