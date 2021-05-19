import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service'
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

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
    private clienteService:ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }

  clientes: Cliente[] = [];
  paginador:any;
  clienteSeleccionado: Cliente = new Cliente;

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params =>{
      let page:any = params.get('page');

      if(!page){
        page = 0;
      }
    this.clienteService.getClientes(page)
    .pipe(
      tap(response =>{
        console.log("clienteCompnent tap 3");
        (response.content as Cliente[]).forEach(cliente =>
          {
            console.log(response.nombre);
          });
      })

    ).subscribe(
      response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });

    }); 
  }

 delete(cliente: Cliente){
    Swal.fire({
      title: 'Esta Seguro?',
      text: `Seguro que desea eliminar el usuario! ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          data =>{
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            this.Toast.fire({
              icon: 'success',
              title:  `Usuario ${cliente.nombre} Eliminado`
            })

          });
      }
    })
  }

  abrirModal(cliente:Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
