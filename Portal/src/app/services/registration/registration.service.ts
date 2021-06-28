import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  url='http://localhost:3003/';

  constructor(private http : HttpClient) { }

  registerUser(data){
    return this.http.post( this.url+'registration' , data);
  }

  

  clearRegisteredData(){
    return this.http.delete(this.url+'clearData');
  }

}
