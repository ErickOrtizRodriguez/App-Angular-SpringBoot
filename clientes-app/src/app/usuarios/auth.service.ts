import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
    
  ) { }

  login(usuario:Usuario): Observable<any>{
    const url = 'http://localhost:800/oauth/token';

    const credencial = btoa('angularapp'+':'+'12345');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencode',
    'Autorization':'Basic '+ credencial});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password',usuario.password);
    return this.http.post<any>(url,params,{headers:httpHeaders});
  }
}
