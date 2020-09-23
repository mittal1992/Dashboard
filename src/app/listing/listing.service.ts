import { Listing } from './listing.model';
import { Injectable } from '@angular/core';
import { pipe, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/listings/';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

var numberwithCommas = function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
};

@Injectable({
  providedIn: 'root'
})
export class ListingService{
  constructor(
    private http: HttpClient,
    private router: Router
  ){}
  private listing: Listing = null;
  public listings: Listing[] = [];
  public totalListings;
  public origListings: Listing[] = [];
  private listingUpdated = new Subject<{listings:Listing[], listingCount: number}>();
  private listFetched = new Subject<{listing:Listing}>();

  getListings(postPerPage:number, currentPage: number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, listings: any[], maxListings: number}>(
      BACKEND_URL + queryParams
      )
      .pipe(map(listingData => {
        return {
          listings: listingData.listings.map(listing => {
            return {
              id : listing._id,
              street: listing.street,
              city: listing.city,zip: listing.zip,
              state: listing.state,
              beds: listing.beds,
              baths: listing.baths,
              sq_ft: numberwithCommas(listing.sq__ft),
              type: listing.type,
              sale_date: listing.sale_date,
              price: formatter.format(listing.price),
              latitude: listing.latitude,
              longitude: listing.longitude
            }
          }),
          maxListings: listingData.maxListings
        }
      }))
      .subscribe((transformedListings) => {
        this.listings = transformedListings.listings;
        this.totalListings = transformedListings.maxListings;
        this.origListings = [...this.listings];
        this.listingUpdated.next({
          listings: [...this.listings],
          listingCount: transformedListings.maxListings
        });
      });
      this.listings.map(pipe)
  }

  getListing(id: string){
    const queryParams = `?id=${id}`;
    return this.http.get(BACKEND_URL + id);
  }

  filterListings(str:string, city:string, state:string, zip:string){
    this.listings = [...this.origListings];
    let filteredListing: Listing[] = [];
    if(str != null){
      let filterStreetVal = str.toLowerCase().trim();
      if(filterStreetVal){
        for(let listing of this.listings){
          if(listing.street.toLowerCase().trim().includes(filterStreetVal)){
          filteredListing.push(listing);
          }
        }
        this.listings = filteredListing;
        filteredListing = [];
      }
    }

    if(city != null){
      let filterCityVal = city.toLowerCase().trim();
      if(filterCityVal){
        for(let listing of this.listings){
          if(listing.city.toLowerCase().trim().includes(filterCityVal)){
          filteredListing.push(listing);
          }
        }
        this.listings = filteredListing;
        filteredListing = [];
      }
    }

    if(state != null){
      let filterStateVal = state.toLowerCase().trim();
      if(filterStateVal){
        for(let listing of this.listings){
          if(listing.state.toLowerCase().trim().includes(filterStateVal)){
          filteredListing.push(listing);
          }
        }
        this.listings = filteredListing;
        filteredListing = [];
      }
    }

    if(zip != null){
      let filterZipVal = zip.toLowerCase().trim();
      if(filterZipVal){
        for(let listing of this.listings){
          if(listing.zip.toLowerCase().trim().includes(filterZipVal)){
          filteredListing.push(listing);
          }
        }
        this.listings = filteredListing;
        filteredListing = [];
      }
    }

    this.listingUpdated.next({
      listings: [...this.listings],
      listingCount: this.totalListings
    });
  }

  getListingUpdateListener() {
    return this.listingUpdated.asObservable();
  }

}
