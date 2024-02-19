import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.services';
import * as bcrypt from 'bcryptjs'; // Importa bcrypt para encriptar la contraseña

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrige 'styleUrl' a 'styleUrls'
})
export class LoginComponent {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private authService: AuthService,
              private messageService: MessageService,
              private router: Router) {
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
  }

  login() {
    console.log('login');
    const { email, password } = this.loginForm.value;

    // Verifica si password es nulo o indefinido antes de intentar encriptarlo
    if (password) {
      this.authService.getUserByEmail(email as string).subscribe(
        response => {
          if (response.length > 0) {
            const storedPassword = response[0].password; // Contraseña almacenada en la base de datos

            // Compara la contraseña ingresada con la contraseña almacenada en la base de datos sin encriptar
            if (bcrypt.compareSync(password, storedPassword)) {
              sessionStorage.setItem('email', email as string);
              this.router.navigate(['/home']);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email o Contraseña Incorrectos' });
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email no encontrado' });
          }
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar el usuario' });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Contraseña requerida' });
    }
  }
}

