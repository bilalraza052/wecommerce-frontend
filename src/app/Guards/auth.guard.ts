
import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot,CanActivate,CanActivateChild,Router,RouterStateSnapshot} from "@angular/router";
import { BaseController } from "../base.controller";
@Injectable({
    providedIn: 'root'
  })
export class AuthGuard extends BaseController<any> implements CanActivateChild {
    constructor() {
        super();
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const token = localStorage.getItem('token');
        if(!token){
            this.route?.navigate(['/auth'],{
                queryParams:{
                    returnUrl:state.url
                }
            })
            this.showError('You have already been Logout or Session Expired')
            return false
        }
        return true


    }
}
