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
  userId: any
  recUserWatchlistData: any
  recTxnData: any
  containerListForShow: any = []

  token = localStorage.getItem("jwt");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }

  objectLength(obj: any) {
    var result = 0
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result++
      }
    }
    return result
  }

  listExists() {
    if (this.objectLength(this.containerListForShow) > 0) {
      return true
    } else {
      return false
    }
  }

  txnExists() {
    if (this.objectLength(this.recTxnData) > 0) {
      return true
    } else {
      return false
    }
  }

  deleteWatchlistEntry(id: any) {
    this.recUserWatchlistData.forEach((element: any) => {
      if (element.containerId == id) {
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
      this.currentuser = this.jwtHelper.decodeToken(tok).unique_name
      this.userId = this.currentuser
    }

    this.getData.getDataUserWatchlist(this.httpOptions).subscribe((data) => {
      this.recUserWatchlistData = data
      console.log(this.recUserWatchlistData); 
      this.recUserWatchlistData.forEach((element: any) => {
        if (element.userId == this.currentuser) {
          this.containerListForShow.push(element.containerId)
        }
      })
    })

    this.getData.getTransactionData(this.httpOptions).subscribe((data) => {
      this.recTxnData = data
      this.recTxnData.forEach((element: any) => {
        if (element.userId != this.currentuser) {
          delete element[0]
        }
      })

      for (let i = 0; i < this.recTxnData.length; i++) {
        if (this.recTxnData[i].userId != this.currentuser) {
          this.recTxnData.splice(i, 1)
          i--
        }
      }
    })
  }
}
