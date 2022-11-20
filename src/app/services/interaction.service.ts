import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;

  constructor(private toastController: ToastController,private load: LoadingController) { }



  async errorToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      icon: 'alert-circle-outline'
    });
    toast.present();
  }
  
  async succesToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      icon: 'checkmark-circle-outline'
    });
    toast.present();
  }

  async showLoading(mensaje:string) {
    this.loading = await this.load.create({
      message: mensaje,
    });

    await  this.loading.present();
  }
  
  async closeLoading() {
  
    await this.loading.dismiss();
  }

  

}
