import { HttpHeaders } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { DataStorageService } from '../data-storage.service'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(private getData: DataStorageService, private fB: FormBuilder) { }

  recData: any

  token = localStorage.getItem("jwt");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  };

  ngOnInit(): void {
    this.getData.getDataContainer(this.httpOptions).subscribe((data) => {
      this.recData = data
      console.log(data)
    })
  }

}
