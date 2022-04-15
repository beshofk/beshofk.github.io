import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private fb:FormBuilder,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.registerForm=this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.maxLength(6)]],
      first_name: ['',Validators.required],
      last_name: ['', Validators.required]
    })
  }
  
  async register(){
    let loading=await this.loadingCtrl.create({
      message:'Loading...'
    });

    await loading.present();

    this.auth.signUp(this.registerForm.value).then(async res=>{
      loading.dismiss();
      let toast=await this.toastCtrl.create({
        duration:3000,
        message: 'Successfully created new Account'
      });
      toast.present();
      this.router.navigateByUrl('/login');
    },async err=>{
      loading.dismiss();
      let alert=await this.alertCtrl.create({
        header:'Error',
        message:err.message,
        buttons:['OK']
      });
      alert.present();
    })
  }
}
