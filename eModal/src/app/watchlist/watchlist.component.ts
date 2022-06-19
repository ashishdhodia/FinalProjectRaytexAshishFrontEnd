import { HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(private jwtHelper: JwtHelperService, private getData: DataStorageService, private fB: FormBuilder, private router: Router) { }

  recContainerData: any
  recUserWatchlistData: any
  private currentuser: any
  containerListForShow: any = []
  userWatchlistPostForm: any
  userPaymentForm: any
  transactionData: any
  allContainerIdList: any = []

  fieldsForTable = [
    "Container#",
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
    "Fees",
    // "LFD/GTD",
    // "Tags",
    "Pay",
    "Size Type"
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
    if (this.containerListForShow.includes(data.containerId)) {
      alert("Container is available in watchlist already")
      return
    } else if (!this.allContainerIdList.includes(data.containerId)) {
      alert("Container is not available in database")
      return
    }
    let userId = this.currentuser
    data = { ...data, userId }

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
    data["txnTime"] = ""
    this.getData.postTransactionData(data, this.httpOptions).subscribe((data) => {
    })
    setTimeout(() => {
      this.router.navigate(['transaction-success'])
    }, 1500)
    // location.reload()
  }

  payFees(item: any) {
    this.userPaymentForm.patchValue({
      "containerId": item.id,
      "containerFees": item.fees,
      "userId": this.currentuser
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

  sortBy(event: any) {
    if (event.target.value == "Id (A-Z)") {
      this.recContainerData.sort((a: any, b: any) => (a.id > b.id) ? 1 : -1)
    } else if (event.target.value == "Id (Z-A)") {
      this.recContainerData.sort((a: any, b: any) => (a.id < b.id) ? 1 : -1)
    } else if (event.target.value == "Fees (High-Low)") {
      this.recContainerData.sort((a: any, b: any) => (a.fees < b.fees) ? 1 : -1)
    } else if (event.target.value == "Fees (Low-High)") {
      this.recContainerData.sort((a: any, b: any) => (a.fees > b.fees) ? 1 : -1)
    }
  }

  ngOnInit(): void {
    const tok = localStorage.getItem("jwt")
    if (tok && !this.jwtHelper.isTokenExpired(tok)) {
      this.currentuser = this.jwtHelper.decodeToken(tok).unique_name

    }

    this.getData.getDataUserWatchlist(this.httpOptions).subscribe((data) => {
      this.recUserWatchlistData = data
      this.recUserWatchlistData.forEach((element: any) => {
        if (element.userId == this.currentuser) {
          this.containerListForShow.push(element.containerId)
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
            if (element.id == elementTxn.containerId) {
              element.fees = `Fees paid by ${elementTxn.userId}`
              element.feesPaid = 'true'
            }
          })
        })
      })
    })



    this.userWatchlistPostForm = this.fB.group({
      "containerId": ["", [Validators.required, Validators.minLength(10), Validators.maxLength(11)]]
    })

    this.userPaymentForm = this.fB.group({
      "containerId": [""],
      "containerFees": [""],
      "userId": [""],
      "cardOwnerName": ["", [Validators.required]],
      "cardType": ["Credit", [Validators.required]],
      "cardNumber": ["", [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      "cardExp": ["", [Validators.required]],
      "cardCVV": ["", [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      "txnTime": ["Time", [Validators.required]]
    })

  }
}
