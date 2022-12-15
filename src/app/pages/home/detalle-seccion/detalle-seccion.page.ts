import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {
  AlumnoDetalle,
  Clase,
  ClaseAl,
  Seccion,
  SeccionHome,
  Usuario,
} from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

declare var google;

@Component({
  selector: 'app-detalle-seccion',
  templateUrl: './detalle-seccion.page.html',
  styleUrls: ['./detalle-seccion.page.scss'],
})
export class DetalleSeccionPage implements OnInit {
  scanedCode = null;
  isModalOpen = false;
  mapageo: any;
  mapa: any;
  clases: Clase[];
  clasesAl: ClaseAl[];

  usuario: Usuario;

  profesor: Usuario;

  seccion: Seccion;
  codigoClase: string;

  alumnos: AlumnoDetalle[];

  secciones: SeccionHome[];

  constructor(
    private actRoute: ActivatedRoute,
    private db: FirebaseService,
    private router: Router,
    private interactions: InteractionService,
    private scanner: BarcodeScanner
  ) {}

  async ngOnInit() {
    this.getUsuario();
  }
  async ionViewWillEnter() {
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
        });
      console.log(this.usuario.tipo)
      if(this.usuario.tipo === 'alumno'){
      this.db.getSubCollection<Clase>('secciones', 'clases', paramMap.get('id1')).subscribe(
        (res) => {
          var clasesAlumnoTemp = [];
          res.forEach(element => {
            var claseAlumnoTemp = { id: '', alumnos: [], fecha: '', numero: 0, asistencia: ''};
            claseAlumnoTemp.id = element.id;
            claseAlumnoTemp.alumnos = element.alumnos;
            claseAlumnoTemp.fecha = element.fecha;
            claseAlumnoTemp.numero = element.numero;
            element.alumnos.forEach(element => {
               if(element.id_Alumno === this.usuario.id){
                claseAlumnoTemp.asistencia = element.asistencia
               }
            });
            clasesAlumnoTemp.push(claseAlumnoTemp)
          });
          const clasesTemp = clasesAlumnoTemp.sort((p1, p2) =>
            p1.numero < p2.numero ? 1 : p1.numero > p2.numero ? -1 : 0
          );
          this.clasesAl = clasesTemp;
          console.log(this.clasesAl)
        });
      }else{
        this.db.getSubCollection<Clase>('secciones', 'clases', paramMap.get('id1')).subscribe(
        (res) => {
          const clasesTemp = res.sort((p1, p2) =>
            p1.numero < p2.numero ? 1 : p1.numero > p2.numero ? -1 : 0
        );
        this.clases = clasesTemp;
        console.log(this.clases )
      });
    }});
  }

  createClase() {
    var claseTemp = { id: '', alumnos: [], fecha: '', numero: 0 };
    var alumnosClaseTemp = [];
    const idClase = this.db.getId();
    this.alumnos.forEach((aux) => {
      var alumnoClaseTemp = {
        id_Alumno: '',
        nombre: '',
        rut: '',
        asistencia: '',
      };
      console.log(aux);
      alumnoClaseTemp.id_Alumno = aux.id;
      alumnoClaseTemp.nombre = aux.nombre;
      alumnoClaseTemp.rut = aux.rut;
      alumnoClaseTemp.asistencia = 'ausente';
      alumnosClaseTemp.push(alumnoClaseTemp);
    });
    claseTemp.alumnos = alumnosClaseTemp;
    var d = new Date();
    let day = d.toLocaleString();
    claseTemp.fecha = day;
    claseTemp.id = idClase;
    claseTemp.numero = this.clases.length.valueOf() + 1;
    this.db
      .createSubCollDoc(
        claseTemp,
        'secciones',
        'clases',
        this.seccion.id,
        idClase
      )
      .then(() => {
        this.goClase(idClase);
      });
  }

  goClase(id: string) {
    this.router.navigateByUrl('/home/' + this.seccion.id + '/clase/' + id);
  }

  scanCode() {
    this.interactions.showLoading('marcando asistencia...');
    this.scanner.scan().then((barcodeData) => {
      this.actRoute.paramMap.subscribe((aux) => {
        var seccionId = '';
        var claseId = '';
        var myArray = barcodeData.text.split('|');
        var distanciaSede = 0;

        claseId = myArray[0];
        seccionId = myArray[1];
        this.getUbicacionActual().then((res) => {
          var miUbicacion = new google.maps.LatLng(
            res.coords.latitude,
            res.coords.longitude
          );
          var sedeCoords = new google.maps.LatLng(
            this.usuario.sede.localizacion.latitude,
            this.usuario.sede.localizacion.longitude
          );
          distanciaSede = google.maps.geometry.spherical.computeDistanceBetween(
            miUbicacion,
            sedeCoords
          );
          if (seccionId != aux.get('id1')) {
            this.interactions.closeLoading();
            return this.interactions.errorSweet('QR de otra seccion');
          }

          if (distanciaSede >= 70) {
            this.interactions.closeLoading();
            this.setOpen(true);
            this.mapafunc();
            return this.interactions.errorSweet(
              'Error te encuentras a ' +
                distanciaSede.toFixed(0) +
                ' de la sede '
            );
          }

          return this.cambiarAsistenciaAlumno(seccionId, claseId).then(
            (res) => {
              this.interactions.closeLoading();
              this.interactions.succesSweet('presente!');
            }
          );
        });
      });
    });
  }

  async cambiarAsistenciaAlumno(seccionId: string, claseId: string) {
    await this.db
      .getSubCollDocOnce<Clase>('secciones', 'clases', seccionId, claseId)
      .subscribe((res) => {
        const alumnos = res.data().alumnos;
        const alumnosTemp = [];
        alumnos.forEach((aux) => {
          if (aux['id_Alumno'] == this.usuario.id) {
            const alumnoClaseTemp = {
              id_Alumno: aux['id_Alumno'],
              nombre: aux['nombre'],
              rut: aux['rut'],
              asistencia: 'presente',
            };
            alumnosTemp.push(alumnoClaseTemp);
          } else {
            alumnosTemp.push(aux);
          }
        });
        this.db.UpdateAlumnoClase(
          alumnosTemp,
          'secciones',
          'clases',
          seccionId,
          res.id
        ).then((res)=>{
          return true
        }).catch((err)=>{return false});
      });
  }

  marcarAsistencia(){
    this.actRoute.paramMap.subscribe((aux) => {
      this.db.getSubCollDocOnce<Clase>('secciones','clases',aux.get('id1'),this.codigoClase).subscribe((res)=>{
        this.getUbicacionActual().then((res) => {
          var miUbicacion = new google.maps.LatLng(
            res.coords.latitude,
            res.coords.longitude
          );
          var sedeCoords = new google.maps.LatLng(
            this.usuario.sede.localizacion.latitude,
            this.usuario.sede.localizacion.longitude
          );
          let distanciaSede = google.maps.geometry.spherical.computeDistanceBetween(
            miUbicacion,
            sedeCoords
          );
          if (distanciaSede <= 70) {
            this.interactions.closeLoading();
            this.setOpen(true);
            this.mapafunc();
            return this.interactions.errorSweet(
              'Error te encuentras a ' +
                distanciaSede.toFixed(0) +
                ' de la sede '
            );
          }
          
          return this.cambiarAsistenciaAlumno(aux.get('id1'),this.codigoClase).then(
            (res) => {
              console.log(res)
              this.interactions.closeLoading();
              this.codigoClase ='';
              this.interactions.succesSweet('presente!');
            },
            (error)=>{ 
              console.log('codigo invalido!');
            }
          );
        });
      },
      (error)=>{ 
       console.log('invalido')
      }
      );
    });
  }

  /* metodo que devuelve la ubicacion actual del usuario */
  getUbicacionActual(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  /*   metodo que instancia el mapa */
  mapInitgeo(coords, map) {
    this.mapageo = new google.maps.Map(map, {
      center: coords,
      zoom: 18,
    });
  }
  /* metodo que dinuja el mapa en el modal de alerta */
  mapafunc() {
    this.getUbicacionActual().then((res) => {
      var bounds = new google.maps.LatLngBounds();
      let miUbicacion = new google.maps.LatLng(
        res.coords.latitude,
        res.coords.longitude
      );
      let sedeCoords = new google.maps.LatLng(
        this.usuario.sede.localizacion.latitude,
        this.usuario.sede.localizacion.longitude
      );
      console.log(miUbicacion + res);
      const map: HTMLElement = document.getElementById('mapGeo');

      this.mapInitgeo(miUbicacion, map);

      var pin1 = new google.maps.Marker({
        position: miUbicacion,
        map: this.mapageo,
        title: 'mi ubicacion',
        zIndex: 1,
        optimized: false,
      });
      bounds.extend(pin1.getPosition());
      this.mapageo.fitBounds(bounds);

      var pin2 = new google.maps.Marker({
        position: sedeCoords,
        map: this.mapageo,
        title: 'Sede',
        zIndex: 2,
        optimized: false,
      });
      bounds.extend(pin2.getPosition());
      this.mapageo.fitBounds(bounds);

      const linea = new google.maps.Polyline({
        path: [miUbicacion, sedeCoords],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });

      linea.setMap(this.mapageo);
      this.mapageo.fitBounds(bounds);
    });
  }
  /* metodo que muestra la alertaq */
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
}