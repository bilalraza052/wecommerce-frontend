import { MainServiceService } from './../services/main-service.service';
import { routes } from './../app.routes';
import { Component, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet,MatToolbarModule,MatSidenavModule,MatIconModule,MatButtonModule,MatListModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  isMobile: boolean = window.innerWidth < 768;
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
  usersInfo: any;
  constructor(public router: Router,private sanitizer: DomSanitizer,public service:MainServiceService) {
    console.log(router.url);
  }


  isUserHasRights(item:any){
    return item.roleId?.includes(Number(this.usersInfo?.roleId))
  }
  getSafeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  navigate(route:string){
    this.router.navigate([route])
  }
  ngOnInit(){
    const info = localStorage.getItem('user');
    if(info){
      this.usersInfo = JSON.parse(info)
    }
  }
}
