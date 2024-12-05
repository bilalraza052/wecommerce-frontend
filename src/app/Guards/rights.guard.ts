
import { Injectable } from "@angular/core";
import {ActivatedRouteSnapshot,CanActivate,CanActivateChild,Router,RouterStateSnapshot} from "@angular/router";
import { BaseController } from "../base.controller";
import { MainServiceService } from "../services/main-service.service";
@Injectable({
    providedIn: 'root'
  })
export class RightsGuard extends BaseController<any> implements CanActivateChild {
    usersInfo: any;
    constructor(public main:MainServiceService) {
        super();
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      const info = localStorage.getItem('user');
      if(info){
        this.usersInfo = JSON.parse(info)
        if(!this.usersInfo) return true

        const rightObj = this.main?.routes?.find(x=>'/'+x.route == state.url);
        if(this.usersInfo?.roleId && rightObj.roleId?.includes(Number(this.usersInfo?.roleId))){
          return true

        }
        this.route?.navigate(['/group'])
        return false
      }
      return true


    }
}
