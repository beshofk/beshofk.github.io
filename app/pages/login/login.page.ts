import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    let loading = await this.loadingCtrl.create({
      message: 'جار التحميل...'
    });
    await loading.present();

    this.auth.signIn(this.loginForm.value).subscribe(
      user => {
        loading.dismiss();
        console.log('user:', user);
        let role = user['role'];
        if (role === 'USER') {
          this.router.navigateByUrl('/user');
        } else if (role === 'ADMIN') {
          this.router.navigateByUrl('/menu/admin');
        } else if (role === 'VIEWER') {
          this.router.navigateByUrl('/menu/admin');
        }
      },
      async err => {
        loading.dismiss();
        let alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.message,
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }
}
