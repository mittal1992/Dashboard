import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListingService } from '../listing/listing.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  form: FormGroup;
  constructor(public listingService: ListingService) { }

  ngOnInit() {
    this.form = new FormGroup({
      street: new FormControl(null),
      city: new FormControl(null),
      state: new FormControl(null),
      zip: new FormControl(null)
    });
  }

  onFilter() {
    this.listingService.filterListings(this.form.value.street, this.form.value.city, this.form.value.state, this.form.value.zip);
  }

}
