import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';

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

  async succesSweet(mensaje: string) {
    await Swal.fire({
      icon: 'success',
      title:mensaje ,
      showConfirmButton: false,
      timer: 2000,
      heightAuto: false
    })
  }

  async errorSweet(mensaje: string) {
    await Swal.fire({
      icon: 'error',
      title:  mensaje ,
      showConfirmButton: false,
      timer: 2000,
      heightAuto: false
    })
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
