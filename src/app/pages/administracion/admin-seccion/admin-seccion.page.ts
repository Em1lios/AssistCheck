import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Seccion, Sede, Usuario } from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-admin-seccion',
  templateUrl: './admin-seccion.page.html',
  styleUrls: ['./admin-seccion.page.scss'],
})
export class AdminSeccionPage implements OnInit {
  seccion = new FormGroup({
    id: new FormControl(''),
    codigo: new FormControl('', [
      Validators.required,
      Validators.pattern('[A-Za-z]{1,5}[0-9]{4}'),
    ]),
    alumno: new FormControl([]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(6)]),
    profesor: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    sigla: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{3}[A-Za-z]{1}'),
    ]),
  });

  newAlumno:string;

  sedes: Sede[] = [];
  secciones: Seccion[] = [];
  alumnos: any;

  constructor(
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService
  ) {}

  ngOnInit() {
    this.cargarSecciones();
  }

  cargarSecciones() {
    this.db.getCollection<Seccion>('secciones').subscribe((res) => {
      this.secciones = res;
    });
  }

  agregar() {
    if (this.seccion.value.id === '' || this.seccion.value.id === null ) {
      const idtemp = this.db.getId();
      this.seccion.value.id = idtemp;
      this.db.createDoc(this.seccion.value, 'secciones', idtemp).then((res) => {
        this.interactions.closeLoading();
        this.interactions.succesSweet('usuario registrado con exito!!');
      });
    } else {
      this.db
        .createDoc(this.seccion.value, 'secciones', this.seccion.value.id)
        .then((res) => {
          this.interactions.closeLoading();
          this.interactions.succesSweet('usuario registrado con exito!!');
        });
    }
  }

  eliminar(id: string) {
    this.db.deleteDoc('secciones', id).then(() => {
      this.interactions.succesSweet('eliminado con exito');
    });
  }
  async buscar(id: string) {
    this.db.getDoc<Seccion>('secciones', id).subscribe((res) => {
      this.seccion.setValue(res);
      this.alumnos = res.alumno;
      (console.log(this.alumnos))
    });
  }

  limpiar(){
    this.seccion.reset();
  }
  agregarAlumno(){
    this.db.addAlumnoSeccion(this.seccion.value.id,this.newAlumno)

  }
  eliminarAlumno(id:string){
    this.db.deleteAlumnoSeccion(this.seccion.value.id,id)
  }
}
