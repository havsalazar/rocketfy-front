import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  providers: [SessionService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  
  constructor(
    private formBuilder: FormBuilder,
    private session: SessionService,
    private router:Router
  ) {}

  submitted = false;
  isLoginFailed = false;
  errorMessage='';
  
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  private testUser:User={
    email:'test@test.com',
    id:'1-2-2-2',
    username:'Test'
  }

  ngOnInit(): void {
    if (this.session.isLogged()) { 
      this.router.navigate(['/panel'])
    }
    this.loginForm = this.formBuilder.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
      password: ['12345', [Validators.required, Validators.minLength(4)]],
    });
  }
  onSubmit() {
    this.submitted=true;

    const {email,password}=this.loginForm.value
    if(this.loginForm.invalid) return 

    if(email===this.testUser.email && password==='12345'){
      this.session.setUser(this.testUser)
      this.isLoginFailed=false;
      this.errorMessage=''; 
      this.router.navigate(['/panel'])
    }else {
      this.isLoginFailed=true;
      this.errorMessage='Invalid login email or password';
    }


  }
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
}
