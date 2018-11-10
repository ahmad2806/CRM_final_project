import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { VolunteersService } from '../volunteers.service';
import { VolunteerModel } from '../volunteer.model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-vol-list',
  templateUrl: './vol-list.component.html',
  styleUrls: ['./vol-list.component.css']
})
export class VolListComponent implements OnInit {
  volunteersToView: VolunteerModel[] = [];
  pdisabled = "previous disabled";
  ndisabled = "next"
  lenght = this.volservice.volunteers.length;
  number = this.lenght / 15;
  bakiNumber = this.lenght % 15;
  CurrentPageNumber = 0;
  previousPage = 0;
  nextPage = 1;
  Pages: number[] = [];
  thereIsBaki = false;
  editingVolunteer: VolunteerModel;
  DeletedVolunteer = 0;
  mdlSampleIsOpen = false;
  index = 0;
  imageClicked;
  imageVolunteer;
  searchFor = 'volunteer';
  noVolunteers = true;


  // @ViewChild('jj') fileInput: ElementRef;




  constructor(public volservice: VolunteersService) {

  }

  ngOnInit() {
    if (this.volservice.volunteers.length > 0) {

      this.imageVolunteer = this.volservice.volunteers[0];

      // this.lenght=this.volservice.volunteers.length;
      // this.number =this.lenght/15;
      // this.bakiNumber=(this.lenght%15);

      this.editingVolunteer = this.volservice.volunteers[0];

      if (this.number < 1) {
        if (this.bakiNumber > 0) {


          for (let i = 0; i < this.bakiNumber; i++) {
            this.volunteersToView[i] = this.volservice.volunteers[i];
            // console.log(this.v)


          }
        }
      }
      else {
        for (let i = 0; i < 15; i++) {
          this.volunteersToView[i] = this.volservice.volunteers[i];

        }
      }
      if (this.bakiNumber > 0) {
        // this.number++;
        this.thereIsBaki = true;
      }

      for (let i = 0; i < this.number; i++) {
        this.Pages[i] = i + 1;

      }
    } else {
      this.noVolunteers = false;
    }

  }

  // setArr(search){

  //     this.volunteersToView=this.volservice.volunteers;

  // }

  viewImage(ImageBtn, item) {
    this.imageClicked = item.avatar;
    this.imageVolunteer = item;
    ImageBtn.click();

  }
  image(im) {
    this.imageVolunteer.avatar = im.target.files[0];

    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageVolunteer.avatar = e.target.result;
      // this.imageClicked  = e.target.result;
    }

    reader.readAsDataURL(im.target.files[0]);



    this.imageClicked = this.imageVolunteer.avatar;
    // im.target.files=[];
    //im.target.files[0]="";
    // this.form.get('avatar').setValue(null);
    // this.fileInput.nativeElement.value = '';

    //this.imageVolunteer.avatar  =this.imageClicked;;


  }
  setDeletedVolunteer(item) {
    this.DeletedVolunteer = this.volservice.volunteers.indexOf(item);

  }
  removeVolunteer() {
    this.volservice.volunteers.splice(this.DeletedVolunteer, 1);
    this.ChangePage(this.CurrentPageNumber);
  }

  volunteerForEdit(item, button) {
    this.index = this.volservice.volunteers.indexOf(item);
    this.editingVolunteer = item;

    button.click();
  }

  days(sunday, monday, tuesday, wednesday, thursday, friday, car, incar, back) {

    this.editingVolunteer.freeDays.sunday = sunday;
    this.editingVolunteer.freeDays.monday = monday;
    this.editingVolunteer.freeDays.tuesday = tuesday;
    this.editingVolunteer.freeDays.wednesday = wednesday;
    this.editingVolunteer.freeDays.thursday = thursday;
    this.editingVolunteer.freeDays.friday = friday;

    this.editingVolunteer.hasCar = car;
    this.editingVolunteer.agreeToLeft = incar;

//TODO bug in volunteering days for volunteer when editing
    this.volservice.volunteers[this.index] = this.editingVolunteer;
    back.click();
  }
  onSubmit(form: NgForm) {
    this.editingVolunteer.name = form.value.name;
    this.editingVolunteer.id = form.value.ID;
    this.editingVolunteer.address = form.value.address;
    this.editingVolunteer.phone = form.value.extranum;
    this.editingVolunteer.telePhone = form.value.phonenum;
    this.editingVolunteer.homePhone = form.value.homenum;
    this.editingVolunteer.job = form.value.job;
    this.editingVolunteer.email = form.value.email;
    this.editingVolunteer.volunteerType = form.value.type;




  }

  ChangePage(pressedPage) {
    //TODO bug in next and prev page...index out of range
    this.CurrentPageNumber = pressedPage;
    this.previousPage = pressedPage - 1;
    this.nextPage = pressedPage + 1;

    if (pressedPage == this.Pages.length - 1) {
      this.ndisabled = "next disabled";
    }
    else {
      this.ndisabled = "next";
    }
    if (this.CurrentPageNumber == 0) {
      this.pdisabled = "previous disabled";
    } else {
      this.pdisabled = "previous";
    }

    let n = 15;
    if (pressedPage == this.Pages.length - 1) {
      if (this.thereIsBaki == true) {
        n = this.bakiNumber;
      }
    }
    this.volunteersToView = [];
    for (let i = 0; i < n; i++) {
      if (this.volservice.volunteers[i + (pressedPage * 15)] != undefined)
        this.volunteersToView[i] = this.volservice.volunteers[i + (pressedPage * 15)];

    }

  }

}
