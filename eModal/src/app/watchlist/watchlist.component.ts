import { HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { JwtHelperService } from '@auth0/angular-jwt'
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
  userPaymentForm: any
  transactionData: any
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
    // "LFD/GTD",
    // "Tags",
    "Pay"
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
    location.reload()
  }

  updatePaymentType(event: any) {
    this.userPaymentForm.patchValue({
      "cardType": event.target.value
    })
  }

  userPaymentPost(data: any) {
    delete data["cardExp"]
    delete data["cardCVV"]
    data.containerFees = parseInt(data.containerFees)
    data.cardNumber = data.cardNumber.slice(12)
    data.cardNumber = parseInt(data.cardNumber)
    this.getData.postTransactionData(data, this.httpOptions).subscribe((data) => {
    })
    location.reload()
  }

  payFees(item: any) {
    this.userPaymentForm.patchValue({
      "containerid": item.id,
      "containerFees": item.fees,
      "userid": this.currentuser
    })
  }

  sgExists(item: any) {
    try {
      if (item.SG[0].SG1 != null)
        return true
    } catch (error) {
      return false
    }
    return false
  }

  feesExists(item: any) {
    try {
      if (item.fees != '0' && item.feesPaid != 'true')
        return true
    } catch (error) {
      return false
    }
    return false
  }

  ngOnInit(): void {
    const tok = localStorage.getItem("jwt")
    if (tok && !this.jwtHelper.isTokenExpired(tok)) {
      this.currentuser = this.jwtHelper.decodeToken(tok).unique_name

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
      this.getData.getTransactionData(this.httpOptions).subscribe((data) => {
        this.transactionData = data
        this.recContainerData.forEach((element: any) => {
          this.transactionData.forEach((elementTxn: any) => {
            if (element.id == elementTxn.containerid) {
              element.fees = `Fees paid by ${elementTxn.userid}`
              element.feesPaid = 'true'
              console.log(element)

            }
          })
        })
      })
    })



    this.userWatchlistPostForm = this.fB.group({
      "containerid": ["", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
    })

    this.userPaymentForm = this.fB.group({
      "containerid": [""],
      "containerFees": [""],
      "userid": [""],
      "cardOwnerName": ["", [Validators.required]],
      "cardType": ["Credit", [Validators.required]],
      "cardNumber": ["", [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      "cardExp": ["", [Validators.required]],
      "cardCVV": ["", [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })

  }
}
