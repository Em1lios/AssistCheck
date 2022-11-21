import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = new FormGroup({
    correo: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    psw: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
  });

  constructor( private db: FirebaseService, private router : Router, private interactions : InteractionService ) { }

  ngOnInit() {
  }

  login(){
    this.db.login(this.usuario.value.correo,this.usuario.value.psw).then(
      () => {
        this.router.navigateByUrl('/home')
        this.interactions.succesSweet('usuario ingresado con exito!')
    },
      (Error) => {
        this.interactions.errorSweet('Error usuario o contraseña incorrectos!')
      }
    )
  }

  
}
