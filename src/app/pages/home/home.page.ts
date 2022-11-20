import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Seccion, SeccionHome, Usuario } from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario: Usuario;

  profeTemp: Usuario;

  secciones : SeccionHome[];

  constructor(
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService
  ) {
    this.getUsuario();
  }

  ngOnInit() {}

  async getUsuario() {
    await this.db.getAuthUser().then((res) =>
      this.db.getDoc<Usuario>('usuarios', res.uid).subscribe((res) => {
        this.usuario = res;
        this.ejecuta();
      })
    );
  }

  logOut() {
    this.db.logout();
    this.router.navigateByUrl('/login');
    this.interactions.succesToast('se ha cerrado la session con exito!');
  }

  ejecuta(){
    this.db.getSeccionUsuario<Seccion>(this.usuario.id, this.usuario.tipo).subscribe(
      (res) => {
        var seccionesTemp = []
        res.forEach((aux) => {
          var seccionHome = {
            id: '',nombre: '',codigo: '',sigla: '',
            alumno: [] ,profesor: { id: '', nombre: '', },
            num_alumnos: 0,
          };
          seccionHome.id = aux.id;
          seccionHome.nombre = aux.nombre;
          seccionHome.codigo = aux.codigo;
          seccionHome.sigla = aux.sigla;
          seccionHome.alumno = aux.alumno;
          this.db.getDoc<Usuario>('usuarios', aux.profesor).subscribe(
            (res) => {
            seccionHome.profesor.id = res.id;
            seccionHome.profesor.nombre = res.nombre;
          });
          seccionHome.num_alumnos = aux.alumno.length;
          seccionesTemp.push(seccionHome)
        });
        this.secciones = seccionesTemp
      });
  }
}
