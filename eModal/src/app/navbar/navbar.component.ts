import { Component, OnInit } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private getData: DataStorageService) { }

  isUserAuthenticated() {
    const token = localStorage.getItem("jwt")
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true
    }
    else {
      return false
    }
  }

  logOut() {
    localStorage.removeItem("jwt")
  }

  ngOnInit(): void {
  }

}
