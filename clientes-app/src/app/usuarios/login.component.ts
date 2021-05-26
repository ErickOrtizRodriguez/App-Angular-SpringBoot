import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;

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
  
  constructor() {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
  }

  login(): void {
    console.log("usuario",this.usuario);
    if(this.usuario.username == ""  || this.usuario.password == ""){
      this.Toast.fire({
        icon: 'error',
        title: `Usuario o Contraseña estan Vacios`
      });
      return;
    }
  }

}
