import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    correo: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    sede: new FormControl(''),
    psw: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
  });

  sedes: any[] = [];

  verificar_password: string;




  constructor( private db: FirebaseService, private router : Router, private interactions : InteractionService ) { }

  ngOnInit() {
    this.cargarSedes();
  }


  cargarSedes(){
    this.db.getCollection('sedes').subscribe(
      (res) => {
        this.sedes = res;
      }
      )
    }
    
    registrarse(){
    
    if( this.usuario.value.psw === this.verificar_password){
      this.interactions.showLoading('Cargando...')
      const sede = this.sedes.find( item => item.sede === this.usuario.value.sede)
    const dominio = this.obtenerDominio(this.usuario.value.correo);
    var tipo = '';
    if( dominio ==='profesor.duoc.cl'){
      tipo = 'profesor'
    }
    else{
      tipo = 'alumno'
    } 
    
    this.db.registrar(this.usuario.value.correo,this.usuario.value.psw).then(
      (res)=>{ 
        const usuarioTemp = {
          id: res.uid,
          correo: this.usuario.value.correo,
          nombre: this.usuario.value.nombre,
          rut: this.usuario.value.rut,
          sede: sede,
          tipo: tipo
        }

        this.db.createDoc(usuarioTemp,'usuarios',res.uid).then(
          (res) =>{
            this.router.navigateByUrl('/login')
            this.interactions.closeLoading();
            this.interactions.succesSweet('usuario registrado con exito!!')
          }
        )
      },
      (error) =>{
        console.log('estamos error')
        this.interactions.closeLoading();
        this.interactions.errorSweet('error, no se pudo registrar usuario')  
      }
    )


    } else {
      this.interactions.errorSweet('contraseñas no coinciden!');
      
    }
    
  }
  obtenerDominio(correo:string){
    const index = correo.lastIndexOf('@');
    return correo.slice(index+1,correo.length)
  }

}
