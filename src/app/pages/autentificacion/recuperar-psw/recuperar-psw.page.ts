import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-recuperar-psw',
  templateUrl: './recuperar-psw.page.html',
  styleUrls: ['./recuperar-psw.page.scss'],
})
export class RecuperarPswPage implements OnInit {
  correo:string;

  constructor(private db: FirebaseService, private interaction: InteractionService) { }

  ngOnInit() {
  }

  recupContra(){
    this.db.recupPass(this.correo).then((res)=>{
      this.interaction.succesSweet('correo de cambio de contraseña enviado');
  })
  }

  
}
