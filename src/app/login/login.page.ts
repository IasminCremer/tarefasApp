import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formLogin: FormGroup;

  public mensagens_validacao = {
    email: [
      { tipo: 'required', mensagem: 'O campo Email é obrigatório!' },
      { tipo: 'email', mensagem: 'Email inválido!' }
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo Senha é obrigatório!' },
      { tipo: 'minlenght', mensagem: 'A Senha deve ter pelo menos 6 caracteres!' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private toastController: ToastController,
    private alertController: AlertController

  ) {
    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      manterLogado: [false]
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    const usuarioLogado = await this.usuariosService.buscarUsuarioLogado();
    if(usuarioLogado && usuarioLogado.manterLogado){
      this.router.navigateByUrl('/home');
      this.presentToast();
    } else{
      this.usuariosService.removerUsuatioLogado();
    }
  }

  public async login() {
    if (this.formLogin.valid) {

      const usuario = await this.usuariosService.login(this.formLogin.value.email, this.formLogin.value.senha);

      if (usuario) {
        usuario.manterLogado = this.formLogin.value.manterLogado;
        this.usuariosService.salvarUsuarioLogado(usuario);
        this.router.navigateByUrl('/home');
        this.presentToast();
      } else {
        this.presentAlert('ADVERTÊNCIA!', 'USUÁRIO OU SENHA INVÁLIDOS');
      }

    } else {
      this.presentAlert('ERRO!', 'Formulário inválido, confira os campos!');
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Login efetuado com sucesso!',
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
