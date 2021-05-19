import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente'
import { ClienteService } from '../cliente.service';





@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public clientes: Cliente =  new Cliente();
  public errores: String[] =[];

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
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute

  ) { }



  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params =>{
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe(
          cliente => this.clientes = cliente
          
        )
      }

    })
  }

  create(): void{
    this.clienteService.create(this.clientes).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
      this.Toast.fire({
        icon: 'success',
        title:  `Usuario ${this.clientes.nombre} Creado`
      })
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Codigo de error backend: '+ err.status);
      console.error(err.error.errors);
    }
    );
    console.log("Clicked");
    console.log(this.clientes);
  }

   update(): void{
    this.clienteService.update(this.clientes)
    .subscribe( cliente =>{
      this.router.navigate(['/clientes'])
      this.Toast.fire({
        icon: 'success',
        title: `Usuario ${this.clientes.nombre} Actualizado`
      })
      console.log(cliente.nombre);
    },
    err =>{
      this.errores = err.error.errors as string[];
      console.error('Codigo de error backend: '+ err.status);
      console.error(err.error.errors);
    }

    );
    
    console.log("Clicked");
    console.log(this.clientes);
  }

}
