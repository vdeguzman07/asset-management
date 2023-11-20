import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword: boolean = false;
  credentials = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private sb: MatSnackBar
  ) {}

  ngOnInit(): void {}

  login() {
    this.loading = true;
    this.auth.login(this.credentials.getRawValue()).subscribe(
      (res: any) => {
        console.log(res);
        this.loading = false;
        const user = JSON.stringify(res.user);
        localStorage.setItem('BEARER_TOKEN', res.token);
        localStorage.setItem('USER', user);
        this.router.navigate(['/portal']);
      },
      (err) => {
        console.log(err);
        this.sb.open(`Incorrect Credentials`, 'Okay', { duration: 2500 });
        this.loading = false;
      }
    );
  }
}
