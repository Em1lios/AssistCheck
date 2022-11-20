import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sede, Usuario } from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.page.html',
  styleUrls: ['./admin-user.page.scss'],
})
export class AdminUserPage implements OnInit {

  usuario = new FormGroup({
    rut: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,2}.[0-9]{3}.[0-9]{3}-[0-9kK]{1}')]),
    correo: new FormControl('',[Validators.required,Validators.pattern('[A-Za-z]{1,4}.[A-Za-z]{1,20}@[A-Za-z]{1,20}.[A-Za-z]{1,4}|[A-Za-z]{1,4}.[A-Za-z]{1,20}@profesor.duoc.cl')]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    sede: new FormControl(''),
    psw: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
  });

  sedes: Sede[] = [];
  usuarios: Usuario[] = [];


  constructor( private db: FirebaseService, private router : Router, private interactions : InteractionService) { }


  ngOnInit() {
    this.cargarSedes();
  }


  cargarSedes(){
    this.db.getCollection<Sede>('sedes').subscribe(
      (res) => {
        this.sedes = res;
      }
    )
  }

  registrarse(){
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
            this.interactions.succesToast('usuario registrado con exito!!')
          }
        )
      },
      (error) =>{
        console.log('estamos eror')
        this.interactions.closeLoading();
        this.interactions.succesToast('error, no se pudo registrar usuario')  
      }
    )
  }
  obtenerDominio(correo:string){
    const index = correo.lastIndexOf('@');
    return correo.slice(index+1,correo.length)
  }

}
