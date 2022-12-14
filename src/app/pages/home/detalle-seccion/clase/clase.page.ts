import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlumnoClase,
  Clase,
  SeccionHome,
  Usuario,
} from 'src/app/interface/models';
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-clase',
  templateUrl: './clase.page.html',
  styleUrls: ['./clase.page.scss'],
})
export class ClasePage implements OnInit {
  clase: Clase;

  title = 'app';
  errorCorrectionLevel =  NgxQrcodeErrorCorrectionLevels.QUARTILE;
  elementType = 'url';
  value = '';

  usuario: Usuario;

  alumnos: AlumnoClase[];

  profesor: Usuario;

  secciones: SeccionHome[];

  constructor(
    private actRoute: ActivatedRoute,
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService
  ) {}

  async ngOnInit() {
    this.getUsuario();
  }
  async ionViewWillEnter(){
    this.getUsuario();
  }


  async getUsuario() {
    await this.db.getAuthUser().then((res) =>
      this.db.getDoc<Usuario>('usuarios', res.uid).subscribe((res) => {
        this.usuario = res;
        this.ejecuta();
      })
    ).catch(
      (error)=>{
        this.router.navigateByUrl('/login');
        this.interactions.alertSwee('s')
      }
    );
  }

  ejecuta() {
    this.actRoute.paramMap.subscribe((paramMap) => {
      this.db
        .getSubCollDoc<Clase>(
          'secciones',
          'clases',
          paramMap.get('id1'),
          paramMap.get('id2')
        )
        .subscribe((res) => {
          
          this.clase = res;
          const codQRtemp = paramMap.get('id2')+'|'+paramMap.get('id1');
          this.value = codQRtemp;
        });
    });
  }

  handleChange(e) {
    var idAlumno = '';
    var estado = '';
    const myArray = e.detail.value.split('|');
    idAlumno = myArray[0];
    estado = myArray[1];
    const alumnos = this.clase.alumnos;

    const alumnosTemp = [];
    alumnos.forEach((aux) => {
      if (aux['id_Alumno'] == idAlumno) {
        const alumnoClaseTemp = {
          id_Alumno: aux['id_Alumno'],
          nombre: aux['nombre'],
          rut: aux['rut'],
          asistencia: estado,
        };

        alumnosTemp.push(alumnoClaseTemp);
      } else {
        alumnosTemp.push(aux);
      }
    });

    this.actRoute.paramMap.subscribe(
      (aux)=>{
        this.db.UpdateAlumnoClase(alumnosTemp,'secciones','clases',aux.get('id1'),aux.get('id2')).then(
    () => {}
    );
    })

  }

}
