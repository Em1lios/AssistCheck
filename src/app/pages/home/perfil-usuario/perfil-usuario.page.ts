import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sede, Usuario } from 'src/app/interface/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { InteractionService } from 'src/app/services/interaction.service';

import firebase from 'firebase/compat/app';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';

declare var google;

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  usuario: Usuario;

  mapa: any;
  mapageo: any;
  emailVeri:boolean;
  distancia: number;

  geoPointUbicacion: { lat: any; lng: any };

  constructor(
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
  
  sendVeri(){
    this.db.verificacion().then(
      (res)=>{
        this.interactions.succesSweet('correo de verificacion enviado')
      }
    );
  }
  async getUsuario() {
    await this.db.getAuthUser().then((res) =>{
      this.emailVeri = res.emailVerified
      this.db.getDoc<Usuario>('usuarios', res.uid).subscribe((res) => {
        this.usuario = res;
        var map: HTMLElement = document.getElementById('map');
        this.mapInit(
          this.usuario.sede.localizacion.latitude,
          this.usuario.sede.localizacion.longitude,
          map
        );
        this.cargarMarcador(
          this.usuario.sede.localizacion.latitude,
          this.usuario.sede.localizacion.longitude
        );
        this.getUbicacionActual().then((res) => {
          var miUbicacion = new google.maps.LatLng(res.coords.latitude, res.coords.longitude);
          var sede = new google.maps.LatLng(this.usuario.sede.localizacion.latitude, this.usuario.sede.localizacion.longitude);
          console.log(google.maps.geometry.spherical.computeDistanceBetween(miUbicacion, sede))
    
          
        });
      })
  }).catch(
      (error)=>{
        this.router.navigateByUrl('/login');
        this.interactions.alertSwee('s')
      }
    );
  }

  mapInit(lat_ = 0, lon_ = 0, map) {
    this.mapa = new google.maps.Map(map, {
      center: { lat: lat_, lng: lon_ },
      zoom: 18,
    });
  }
  mapInitgeo(lat_ = 0, lon_ = 0, map) {
    this.mapageo = new google.maps.Map(map, {
      center: { lat: lat_, lng: lon_ },
      zoom: 18,
    });
  }

  cargarMarcador(lat_ = 0, lon_ = 0) {
    new google.maps.Marker({
      position: { lat: lat_, lng: lon_ },
      map: this.mapa,
    });
  }
  cargarMarcadormiUbicacion(lat_ = 0, lon_ = 0) {
    new google.maps.Marker({
      position: { lat: lat_, lng: lon_ },
      map: this.mapageo,
    });
  }
  miUbicacion() {
    this.getUbicacionActual().then((res) => {
      var mapGeo: HTMLElement = document.getElementById('mapGeo');
      this.mapInitgeo(res.coords.latitude, res.coords.longitude, mapGeo);
      this.cargarMarcadormiUbicacion(res.coords.latitude, res.coords.longitude);
    });
  }

  getUbicacionActual(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}
