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


declare var google;

@Component({
  selector: 'app-detalle-seccion',
  templateUrl: './detalle-seccion.page.html',
  styleUrls: ['./detalle-seccion.page.scss'],
})
export class DetalleSeccionPage implements OnInit {

  scanedCode = null;
  mapa: any;
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

  async ngOnInit() {
    this.getUsuario();
  }
  async ionViewWillEnter(){
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
    this.scanner.scan().then((barcodeData) => {
      this.actRoute.paramMap.subscribe((aux) => {
        var seccionId = '';
        var claseId = '';
        var myArray = barcodeData.text.split('|');
        var distanciaSede = 0
        
        claseId = myArray[0];
        seccionId = myArray[1];
        this.getUbicacionActual().then((res) => {
          var miUbicacion = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
          var sede = new google.maps.LatLng(this.usuario.sede.localizacion.latitude, this.usuario.sede.localizacion.longitude);
          distanciaSede = google.maps.geometry.spherical.computeDistanceBetween(miUbicacion, sede);
          if(distanciaSede <= 70){
            if(seccionId === aux.get('id1')){
              this.cambiarAsistenciaAlumno(seccionId,claseId).then(
                (res)=>{this.interactions.succesSweet('presente!')}
              );
            } else {
              this.interactions.errorSweet('QR de otra seccion')
            }
  
          }else {
            var map: HTMLElement = document.getElementById('map');
            this.lineInit(res.coords.latitude,res.coords.longitude,this.usuario.sede.localizacion.latitude,this.usuario.sede.localizacion.longitude)
            this.mapInit(res.coords.latitude, res.coords.longitude,map);
            this.cargarMarcador(
              this.usuario.sede.localizacion.latitude,
              this.usuario.sede.localizacion.longitude
            );
            
          } 
        });
      });
    });
  }

  async cambiarAsistenciaAlumno(seccionId:string, claseId:string){
    await this.db.getSubCollDocOnce<Clase>('secciones',
      'clases',
      seccionId,
      claseId).subscribe(
        (res) => {
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
          var claseTemp = {
          id: res.data().id,
          alumnos: alumnosTemp,
          fecha: res.data().fecha,
          numero: res.data().numero,
          };

          const actualizacion =  this.db.createSubCollDoc(claseTemp,'secciones','clases',seccionId,res.id)
          return actualizacion
        });
  }
  cargarMarcador(lat_ = 0, lon_ = 0) {
    new google.maps.Marker({
      position: { lat: lat_, lng: lon_ },
      map: this.mapa,
    });
  }

  getUbicacionActual(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
  mapInit(lat_ = 0, lon_ = 0, map) {
    this.mapa = new google.maps.Map(map, {
      center: { lat: lat_, lng: lon_ },
      zoom: 18,
    });
  }

  lineInit(lat1 = 0, lng1 = 0,lat2 = 0, lng2 = 0) {

  const linea = new google.maps.Polyline({
    path: [
      { lat: lat1, lng: lng1 },
      { lat: lat2, lng: lng2 },
    ],
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  linea.setMap(this.mapa);
}
}
