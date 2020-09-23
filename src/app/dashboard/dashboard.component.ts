import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ListingService } from '../listing/listing.service';
import { Listing } from '../listing/listing.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading = false;
  listings: Listing[] = [];
  totalListings = 0;
  listingsPerPage = 10;
  pageSizeOptions = [10,20,40];
  currentPage = 1;
  sorted = false;
  displayColumns: string[] = [
    'street',
    'city',
    'state',
    'zip',
    'type',
    'saleDate',
    'squareFeet',
    'price'
  ];
  dataSource = new MatTableDataSource<Listing>(this.listings);
  private listSub: Subscription;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  constructor(
    public listingService: ListingService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.listingService.getListings(this.listingsPerPage, this.currentPage);
    this.listSub = this.listingService.getListingUpdateListener()
    .subscribe(
      (listData:{listings: Listing[], listingCount: number}) => {
        this.isLoading = false;
        this.listings = listData.listings;
        this.totalListings = listData.listingCount;
        this.dataSource = new MatTableDataSource(this.listings);
      });

    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(){
    this.listSub.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.listingsPerPage = pageData.pageSize;
    this.listingService.getListings(this.listingsPerPage, this.currentPage);
  }

  sortData(sortBy: string){
    if(!this.sorted){
      this.listings.sort((a, b) => {
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        var aA = a[sortBy].replace(reA, "");
        var bA = b[sortBy].replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a[sortBy].replace(reN, ""), 10);
          var bN = parseInt(b[sortBy].replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        }
        else {
          return aA > bA ? 1 : -1;
        }
      });
    }
    else{
      this.listings.sort((a, b) => {
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        var aA = a[sortBy].replace(reA, "");
        var bA = b[sortBy].replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a[sortBy].replace(reN, ""), 10);
          var bN = parseInt(b[sortBy].replace(reN, ""), 10);
          return bN === aN ? 0 : aN > bN ? 1 : -1;
        }
        else {
          return bA > aA ? 1 : -1;
        }
      });
    }
    this.sorted = !this.sorted
    this.dataSource = new MatTableDataSource(this.listings);
  }

  sortAlphaNum(a, b) {
    var reA = /[^a-zA-Z]/g;
    var reN = /[^0-9]/g;
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");
    if (aA === bA) {
      var aN = parseInt(a.replace(reN, ""), 10);
      var bN = parseInt(b.replace(reN, ""), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  }
}
