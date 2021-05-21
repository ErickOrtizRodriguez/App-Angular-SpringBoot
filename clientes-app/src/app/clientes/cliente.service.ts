import { Injectable } from '@angular/core';
// import { CLIENTES } from './clientes.json'
import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { catchError, map, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe, formatDate, registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:8080/api/clientes'
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.url + '/regiones');
  }

  getClientes(page:number): Observable<any>{
    // return of(CLIENTES);
    
    // return this.http.get<Cliente[]>(this.url);
     return this.http.get(this.url +'/page/'+ page).pipe(
       tap((response: any) => {
        
        console.log("clienteservice 1: tap 1");
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        });
       }),
       map((response: any) => {
        
        (response.content as Cliente[]).map(
          cliente =>{
            cliente.nombre = cliente.nombre.toUpperCase();
            
            // cliente.createAt = formatDate(cliente.createAt,'EEEE dd/MMM/yyyy','es');
            
            // let datePipe = new DatePipe('en-US');
            // cliente.createAt = datePipe.transform(cliente.createAt,'dd/MM/yyyy');
            return cliente;
          });
        return response;
       }),
       tap((response:any) =>{
        console.log("clienteservice: tap 2");
        (response.content as Cliente[]).forEach(cliente =>{
          console.log(cliente.nombre);
        });

       })
     );
  }

  create(cliente:Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.url, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e =>{

        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje);
        this.Toast.fire({
          icon: 'error',
          title: `Error al Crear ${e.error.mensaje}`
        })
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.url}/${id}`).pipe(
      catchError(e =>{

        if(e.status == 400){
          return throwError(e);
        }

        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        this.Toast.fire({
          icon: 'error',
          title: `Error al Mostrar ${e.error.mensaje}`
        })
      //   Swal('Error al Editar',e.error.message,'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.url}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        this.Toast.fire({
          icon: 'error',
          title: `Error al Actualizar ${e.error.mensaje}`
        })
      //   Swal('Error al Editar',e.error.message,'error');
        return throwError(e);
      })
      
      );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.url}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        this.Toast.fire({
          icon: 'error',
          title: `Error al Eliminar ${e.error.mensaje}`
        })
      //   Swal('Error al Editar',e.error.message,'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id:any): Observable<HttpEvent<{}>>{
    let formData = new  FormData();
    formData.append("archivo", archivo);//mismo nombre de parametro que esta en el back-end
    formData.append("id",id);

    const req = new HttpRequest('POST', `${this.url}/upload/`, formData, {
      reportProgress: true
    });

    return this.http.request(req);


    // metodo para subir las imagenes antes de la barra de progreso
    // return this.http.post(`${this.url}/upload/`, formData).pipe(
    //   map((response:any)=> response.cliente as Cliente),
    //   catchError(e =>{
    //     console.error(e.error.mensaje);
    //     this.Toast.fire({
    //       icon: 'error',
    //       title: `Error al Subir la Imagen ${e.error.mensaje}`
    //     })
    //   //   Swal('Error al Editar',e.error.message,'error');
    //     return throwError(e);
    //   })
    // );


  }
}
