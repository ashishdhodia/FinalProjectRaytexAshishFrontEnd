import { HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { JwtHelperService } from '@auth0/angular-jwt'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private getData: DataStorageService, private fB: FormBuilder) { }

  private currentuser: any
  userid: any
  recUserWatchlistData: any
  containerListForShow: any = []

  token = localStorage.getItem("jwt");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }

  deleteWatchlistEntry(id: any) {
    console.log(id)
    this.recUserWatchlistData.forEach((element: any) => {
      if (element.containerid == id) {
        let index = this.containerListForShow.indexOf(id)
        this.getData.deleteDataUserWatchlist(element.id, this.httpOptions).subscribe((data) => {
          this.containerListForShow.splice(index, 1)
        })
      }
    })

  }


  ngOnInit(): void {
    const tok = localStorage.getItem("jwt")
    if (tok && !this.jwtHelper.isTokenExpired(tok)) {
      this.currentuser = this.jwtHelper.decodeToken(tok).name
      this.userid = this.currentuser
    }

    this.getData.getDataUserWatchlist(this.httpOptions).subscribe((data) => {
      this.recUserWatchlistData = data
      this.recUserWatchlistData.forEach((element: any) => {
        if (element.userid == this.currentuser) {
          this.containerListForShow.push(element.containerid)
        }
      })
    })
  }

}
