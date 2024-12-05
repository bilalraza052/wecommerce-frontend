import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { inject, Injector } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

export abstract class BaseController<T> {
    model:any={}
    public snackBar?:MatSnackBar;
    public route?:Router;
    public dialog?:MatDialog;

    protected activatedRoute?:ActivatedRoute
    public proxyUrl = 'https://bmexports.elitecoderstestlink.com/'
    constructor(){
        this.snackBar= inject(MatSnackBar)
        this.route=inject(Router)
        this.dialog=inject(MatDialog)
        this.activatedRoute = inject(ActivatedRoute)
    }
    showError(message:any){

        let errorMessage = message
        if(Array.isArray(errorMessage)){
           errorMessage =  errorMessage.join(',')
        }
        this.snackBar?.open(errorMessage || 'Validation Error Occured','Ok',{duration:4500})
    }
    validateEmail(event: Event): void {
      const inputValue = (event.target as HTMLInputElement).value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(inputValue)){
        this.showError('Email is not valid')
        this.model.email = null
      }
      // this.isEmailValid =
    }


    navigate(url:string,queryParams?:any){
      this.route?.navigate([''])
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
 });
      this.route?.navigate([url],{
        queryParams:queryParams
      })
    }

    isLogIn(){
      let token = localStorage.getItem('token');
      return !!token
    }







}
