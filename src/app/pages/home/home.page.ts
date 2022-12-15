import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Seccion, SeccionHome, Usuario } from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: Usuario;

  idioma:string;

  
  profeTemp: Usuario;
  emailVeri:boolean;
  secciones : SeccionHome[];
  langs: string[] = [];
  constructor(
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService,
    private translateService:TranslateService
  ) {
    this.langs = this.translateService.getLangs();
    this.getUsuario();
  }

  ngOnInit(
  ) {
    
  }

  async getUsuario() {
    await this.db.getAuthUser().then((res) =>{
      if (res.emailVerified){
        this.emailVeri = res.emailVerified
        this.db.getDoc<Usuario>('usuarios', res.uid).subscribe((res) => {
          this.usuario = res;
          this.ejecuta();
        })
      } else {
        console.log(res.emailVerified + ' else');
        this.emailVeri = res.emailVerified
      
      }
      
  }).catch(
      (error)=>{
        this.router.navigateByUrl('/login');
        this.interactions.alertSwee('s')
      }
    );
  }

  sendVeri(){
    this.db.verificacion().then(
      (res)=>{
        this.interactions.succesSweet('correo de verificacion enviado')
      }
    );
  }

  logOut() {
    this.db.logout();
    this.router.navigateByUrl('/login');
    this.interactions.succesSweet('se ha cerrado la session con exito!');
  }

  changeLang(event) {
    this.translateService.use(event.detail.value);
    this.idioma = event.detail.value
   /*  if(event.detail.value == 'profesor'){
      let correo = this.nombreusuario + '@profesor.duoc.cl'

      return this.usuariofrom = correo
    }
    if(event.detail.value == 'profesor'){
      let correo = this.nombreusuario + '@profesor.duoc.cl'

      return this.usuariofrom = correo
    }
    if(event.detail.value == 'profesor'){
      let correo = this.nombreusuario + '@profesor.duoc.cl'

      return this.usuariofrom = correo
    } */
  }

  ejecuta(){
    var usuTemp={
      id: this.usuario.id,
      nom_completo: this.usuario.nombre,
      rut: this.usuario.rut
    }
    this.db.getSeccionUsuario<SeccionHome>(this.usuario.tipo,usuTemp).subscribe(
      (res) => {
        
        var seccionesTemp = []
        res.forEach((aux) => {
          var seccionHome = {
            id: '',nombre: '',codigo: '',sigla: '',
            alumno: [] ,profesor: { id: '', nom_completo: '',rut:'' },
            num_alumnos: 0,
          };
          seccionHome.id = aux.id;
          seccionHome.nombre = aux.nombre;
          seccionHome.codigo = aux.codigo;
          seccionHome.sigla = aux.sigla;
          seccionHome.alumno = aux.alumno;
         seccionHome.profesor = aux.profesor;
          seccionHome.num_alumnos = aux.alumno.length;
          seccionesTemp.push(seccionHome)
          console.log(seccionHome)
        });
        this.secciones = seccionesTemp
        console.log(this.secciones)
      });
  }
}
