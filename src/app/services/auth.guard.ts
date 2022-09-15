// Angular
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './apiservice.service';

// NGRX

@Injectable()
export class AuthGuard implements CanActivate {
  errors: any = ['', null, undefined, 'undefined', 'null'];
  userdata: any;
  constructor(private router: Router, public apiService: ApiService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
    // if (!this.apiService.gettoken()) {
    //   this.router.navigateByUrl("/");
    // }
    // return this.apiService.gettoken();

    console.log('this.router----', this.router.url);

    var token = localStorage.getItem('userId');
    this.userdata = JSON.parse(localStorage.getItem('userObj'));
    console.log('this.userdata----', this.userdata);
    console.log('token----', token);
    if (this.errors.indexOf(token) == -1) {
      return true;
    } else {
      // if(this.errors.indexOf(this.userdata) == -1){
      //     if(this.errors.indexOf(this.userdata.gender) >= 0 && this.userdata.not_choose != 'notchoose'){

      //         return this.router.navigate(['/gender']);

      //     }else if(this.errors.indexOf(this.userdata.weight) >= 0){

      //         return this.router.navigate(['/weight']);

      //     }else if(this.errors.indexOf(this.userdata.height) >= 0){

      //         return this.router.navigate(['/height']);

      //     }else if(this.errors.indexOf(this.userdata.age) >= 0){

      //         return this.router.navigate(['/age']);

      //     }else if(this.errors.indexOf(this.userdata.activity_level) >= 0){

      //         return this.router.navigate(['/activitylevel']);

      //     }else if(this.errors.indexOf(this.userdata.image) >= 0 && localStorage.getItem('skip') == '0'){

      //         return this.router.navigate(['/uploadimage']);
      //     }else{
      //         return this.router.navigate(['/readytogo']);
      //     }
      // }else{
      //    return this.router.navigate(['/login']);
      // }
      return this.router.navigate(['/login']);
    }
  }
}
