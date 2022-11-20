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

  async getUsuario() {
    await this.db.getAuthUser().then((res) =>
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
      })
    );
  }

  mapInit(lat_ = 0, lon_ = 0, map) {
    this.mapa = new google.maps.Map(map, {
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
  miUbicacion() {
    this.getUbicacionActual().then((res) => {
      var mapGeo: HTMLElement = document.getElementById('mapGeo');

      this.mapInit(res.coords.latitude, res.coords.longitude, mapGeo);
      this.cargarMarcador(res.coords.latitude, res.coords.longitude);

      console.log('se ejecuta')
    });
  }

  getUbicacionActual(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}
