import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FireAuth } from '../interface/models';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {}

  createDoc(data: any, path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).set(data);
  }

  createSubCollDoc(data: any, path: string,subPath, id: string,idClase: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).collection(subPath).doc(idClase).set(data);
  }

  prueba( path: string,subPath, id: string,idClase: string) {
    const collection = this.db.collection(path);
    const clase = collection.doc(id).collection(subPath).doc(idClase);
    return clase.valueChanges()
  }
  
  getDoc<tipo>(path: string, id: string) {
    const collection = this.db.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }
  
  getSubCollDoc<tipo>(path: string,subPath:string, id: string,idClase: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).collection<tipo>(subPath).doc(idClase).valueChanges();
  }

  getSubCollDocOnce<tipo>(path: string,subPath:string, id: string,idClase: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).collection<tipo>(subPath).doc(idClase).get();
  }


  getSeccionUsuario<tipo>(id: string, tipoUser: string) {
    const secciones = this.db.collection<tipo>('secciones', (ref) => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
        if (tipoUser === 'profesor') {
          query = query.where('profesor', '==', id);
        } else {
          query = query.where('alumno', 'array-contains', id);
        }
        return query;
      }).valueChanges();
      return secciones;
  }

  deleteDoc(path: string, id: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).delete();
  }

  getId() {
    return this.db.createId();
  }

  getCollection<tipo>(path: string) {
    return this.db.collection<tipo>(path).valueChanges();
  }
  getSubCollection<tipo>(path: string,subPath:string, id:string) {
    const collection = this.db.collection(path);
    return collection.doc(id).collection<tipo>(subPath).valueChanges();
  }

  addAlumnoSeccion(id: string, alumno: string) {
    this.db
      .collection('secciones')
      .doc(id)
      .update({
        alumno: firebase.firestore.FieldValue.arrayUnion(alumno),
      });
  }
  deleteAlumnoSeccion(id: string, alumno: string) {
    this.db
      .collection('secciones')
      .doc(id)
      .update({
        alumno: firebase.firestore.FieldValue.arrayRemove(alumno),
      });
  }

  UpdateAlumnoClase(data: any, path: string,subPath, id: string,idClase: string) {
    const collection = this.db.collection(path);
    return collection.doc(id).collection(subPath).doc(idClase).update({
      alumnos: data,
    });
  }

  async login(correo, psw) {
    const { user } = await this.auth.signInWithEmailAndPassword(correo, psw);
    return user;
  }

  async logout() {
    await this.auth.signOut();
  }

  async verificacion() {
    return (await this.auth.currentUser).sendEmailVerification();
  }

  async registrar(correo, psw) {
    const { user } = await this.auth.createUserWithEmailAndPassword(
      correo,
      psw
    );
    await this.verificacion();
    return user;
  }

  async getAuthUser() {
    const aux: FireAuth = await this.auth.currentUser;
    return aux;
  }

 
}
