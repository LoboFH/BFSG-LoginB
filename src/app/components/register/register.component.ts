import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../shared/password-match.directives';
import { AuthService } from '../../../services/auth.services';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../../interfaces/auth';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  })

  constructor(private fb: FormBuilder, private authService: AuthService, 
    private mensaje: MessageService, private router:Router) { }

  get fullName(){
    return this.registerForm.controls['fullName'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }

  get password(){
    return this.registerForm.controls['password'];
  }

  get confirmPassword(){
    return this.registerForm.controls['confirmPassword'];
  }

  enviarRegistro(){
    const data = {...this.registerForm.value};
  
    delete data.confirmPassword;
  
    if (data.password) {
      const hashedPassword = bcrypt.hashSync(data.password, 10);
      data.password = hashedPassword;
    }
  
    this.authService.registerUser(data as User).subscribe(
      response => {
        console.log(response)
        this.mensaje.add({ severity: 'success', summary: 'Success',
        detail: 'Registro Agregado'});
        this.router.navigate(['login']);
      },
      error => console.log(error)
    )
  }
  
  
togglePasswordVisibility(field: string) {
    if (field === 'password') {
        this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword;
    }
}
}
