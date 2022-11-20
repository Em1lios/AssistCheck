import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {
  AlumnoDetalle,
  Clase,
  Seccion,
  SeccionHome,
  Usuario,
} from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-detalle-seccion',
  templateUrl: './detalle-seccion.page.html',
  styleUrls: ['./detalle-seccion.page.scss'],
})
export class DetalleSeccionPage implements OnInit {

  scanedCode = null;
  clases: Clase[];

  usuario: Usuario;

  profesor: Usuario;

  seccion: Seccion;

  alumnos: AlumnoDetalle[];

  secciones: SeccionHome[];

  constructor(
    private actRoute: ActivatedRoute,
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService,
    private scanner: BarcodeScanner
  ) {}

  ngOnInit() {
    this.getUsuario();
  }

  async getUsuario(){
    await this.db.getAuthUser().then((res) =>
      this.db.getDoc<Usuario>('usuarios', res.uid).subscribe((res) => {
        this.usuario = res;
        this.ejecuta();
      })
    );
  }

  ejecuta() {
    this.actRoute.paramMap.subscribe((paramMap) => {
      this.db.getDoc<Seccion>('secciones', paramMap.get('id1')).subscribe(
        (res) => {
          this.seccion = res;
          this.db.getDoc<Usuario>('usuarios', res.profesor).subscribe((res) => {
            this.profesor = res;
          });
          var AlumnosTemp = [];
          res.alumno.forEach((aux) => {
            var alumnoTemp = {
              id: '',
              nombre: '',
              rut: '',
            };
            this.db.getDoc<Usuario>('usuarios', aux).subscribe((res) => {
              alumnoTemp.id = res.id;
              alumnoTemp.nombre = res.nombre;
              alumnoTemp.rut = res.rut;
            });
            AlumnosTemp.push(alumnoTemp);
          });
          this.alumnos = AlumnosTemp;
        }
      );
      this.db.getSubCollection<Clase>('secciones','clases',paramMap.get('id1')).subscribe(
        (res) =>{
          const clasesTemp  = res.sort((p1, p2) => (p1.numero < p2.numero) ? 1 : (p1.numero > p2.numero) ? -1 : 0);
          this.clases = clasesTemp
        }
      );
    });
  }

  createClase() {
    var claseTemp = {id: '',alumnos: [],fecha: '',numero: 0,
    };
    var alumnosClaseTemp = []
    const idClase = this.db.getId();
    this.alumnos.forEach(
      (aux)=>{ 
        var alumnoClaseTemp = {id_Alumno: '',nombre: '',rut: '', asistencia: '' 
        };  
        console.log(aux)
        alumnoClaseTemp.id_Alumno = aux.id
        alumnoClaseTemp.nombre = aux.nombre
        alumnoClaseTemp.rut = aux.rut
        alumnoClaseTemp.asistencia = 'ausente'
        alumnosClaseTemp.push(alumnoClaseTemp)
      }
    )
    claseTemp.alumnos = alumnosClaseTemp
    var d = new Date();
    let day = d.toLocaleString();
    claseTemp.fecha = day
    claseTemp.id = idClase;
    claseTemp.numero = this.clases.length.valueOf() + 1;
    this.db.createSubCollDoc(claseTemp,'secciones','clases',this.seccion.id,idClase
    ).then(
      () => {
      this.goClase(idClase);
      }
    );
  }

  goClase(id:string){
    this.router.navigateByUrl('/home/' + this.seccion.id + '/clase/' + id
    );
  }
  
  scanCode() {
    this.scanner.scan().then(
      barcodeData =>  {
          this.scanedCode = barcodeData.text;
      })
  }

}
