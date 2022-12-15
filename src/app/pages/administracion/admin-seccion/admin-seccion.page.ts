import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnoDetalle, ProfeDetalle, Seccion, Sede, Usuario } from 'src/app/interface/models';
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
  alumnos: AlumnoDetalle[] = [];
  profesores:  ProfeDetalle[] = [];

  constructor(
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService
  ) {}

  ngOnInit() {
    this.getUsuario();
  }

  async getUsuario() {
    await this.db.getAuthUser().then((res) =>{
     this.cargarSecciones();
     this.cargarProfesAlumnos();
  }
    ).catch(
      
      (error)=>{
        this.router.navigateByUrl('/login');
        this.interactions.alertSwee('s')
      }
    );
  }

  cargarSecciones() {
    this.db.getCollection<Seccion>('secciones').subscribe((res) => {
      this.secciones = res;
    });
  }

  cargarProfesAlumnos() {
    this.db.getUsuarioTipo<Usuario>('profesor').subscribe(
      (res) => {
        var profesorestemp = []
        res.forEach(aux => {
          var profesortemp = {
            id: '',
            nom_completo: '',
            rut: '',
          };
          profesortemp.id = aux.id;
          profesortemp.nom_completo = aux.nombre;
          profesortemp.rut = aux.rut;
          profesorestemp.push(profesortemp);
        });
        console.log(profesorestemp)
        this.profesores = profesorestemp;
      }
    )
    this.db.getUsuarioTipo<Usuario>('alumno').subscribe(
      (res) => {
        var alumnostemp = []
        res.forEach(element => {
          var alumnotemp = {
            id: '',
            nom_completo: '',
            rut: '',
          };
          alumnotemp.id = element.id;
          alumnotemp.nom_completo = element.nombre;
          alumnotemp.rut = element.rut;
          alumnostemp.push(alumnotemp);
        });
        this.alumnos = alumnostemp;
      }
    )
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

  compareWith(o1, o2) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

}
