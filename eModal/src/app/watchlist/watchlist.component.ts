import { HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { JwtHelperService } from '@auth0/angular-jwt'
import { min } from 'rxjs'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private getData: DataStorageService, private fB: FormBuilder) { }

  recContainerData: any
  recUserWatchlistData: any
  private currentuser: any
  containerListForShow: any = []
  userWatchlistPostForm: any
  allContainerIdList: any = []

  fieldsForTable = [
    "Container #",
    "Trade Type",
    "Status",
    "Holds",
    "Pregate Ticket #",
    "Emodal Pregate Status",
    "Terminal Pregate Status",
    "Origin",
    "Destination",
    "Current Loc",
    "Line",
    "Vessel Name",
    "Vessel Code",
    "Voyage",
    "Size Type",
    "Fees",
    "LFD/GTD",
    "Tags"
  ]

  token = localStorage.getItem("jwt");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }

  userWatchlistPost(data: any) {
    this.userWatchlistPostForm.reset()
    if (this.containerListForShow.includes(data.containerid)) {
      alert("Container is available in watchlist already")
      return
    } else if (!this.allContainerIdList.includes(data.containerid)) {
      alert("Container is not available in database")
      return
    }
    let userid = this.currentuser
    data = { ...data, userid }

    this.getData.postDataUserWatchlist(data, this.httpOptions).subscribe((data) => {
    })
  }

  ngOnInit(): void {
    const tok = localStorage.getItem("jwt")
    if (tok && !this.jwtHelper.isTokenExpired(tok)) {
      this.currentuser = this.jwtHelper.decodeToken(tok).name
    }

    this.getData.getDataUserWatchlist(this.httpOptions).subscribe((data) => {
      this.recUserWatchlistData = data
      this.recUserWatchlistData.forEach((element: any) => {
        if (element.userid == this.currentuser) {
          this.containerListForShow.push(element.containerid)
        }

      })
    })

    this.getData.getDataContainer(this.httpOptions).subscribe((data) => {
      this.recContainerData = data
      this.recContainerData = this.recContainerData.Data
      for (let i = 0; i < this.recContainerData.length; i++) {
        this.allContainerIdList.push(this.recContainerData[i].id)
        if (!this.containerListForShow.includes(this.recContainerData[i].id)) {
          this.recContainerData.splice(i, 1)
          i--
        }
      }
    })

    this.userWatchlistPostForm = this.fB.group({
      "containerid": ["", [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
    })

  }
}
