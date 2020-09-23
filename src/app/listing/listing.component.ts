import { Component, OnInit } from '@angular/core';
import { Listing } from './listing.model';
import { ListingService } from './listing.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {} from 'googlemaps';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  private listingId: string;
  private fetchListSub: Subscription;
  listings: Listing[];
  listing: Listing;
  isLoading = false;
  @ViewChild('map', null) mapElement: any;
  map: google.maps.Map;

  constructor(
    public listingService: ListingService,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('listingId')){
        this.listingId = paramMap.get('listingId');
        this.isLoading = true;
        this.listings = this.listingService.listings.filter(listing => listing.id == this.listingId);
        this.listings.length > 0 ? this.listing = this.listings[0]: this.listing = null;
        const mapProperties = {
          center: new google.maps.LatLng(+this.listing.latitude, +this.listing.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
        this.isLoading = false;
      }
    });
  }


}
