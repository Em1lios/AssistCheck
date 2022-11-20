export interface Seccion {
    id: string;
    alumno : [];
    codigo:string;
    nombre: string;
    profesor:string;
    sigla:string;
}

export interface  Clase{
    id: string;
    alumnos : [];
    fecha: string;
    numero: number;
}

export interface SeccionHome {
    id: string;
    alumno : any;
    codigo:string;
    nombre: string;
    profesor: {
        id:string,
        nombre: string,
    };
    num_alumnos: number;
    sigla:string;
}

export interface AlumnoDetalle {
    id: string;
    nombre: string;
    rut: string;
  };

  export interface AlumnoClase {
    
    asistencia:string
    id_Alumno:string,
    nombre:string,
    rut:string
    
  };

export interface Usuario {
    id:string;
    correo: string;
    nombre : string;
    rut: string;
    sede: {
        sede: string,
        localizacion: {
            latitude: number,
            longitude: number
        }
    };
    tipo: string;

}
export interface FireAuth {
    uid:string;
    email:string;
    displayName:string;
    emailVerified:boolean;


}
export interface Sede {
    sede: string;
    localizacion: any;
}

