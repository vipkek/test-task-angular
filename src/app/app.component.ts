import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Country } from './core/enum/country';
import { formattedTime } from './core/utils/date';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  form: FormGroup;
  countrySuggestions: string[] = [];

  countries = Object.values(Country);

  timerStarted = false;
  timeLeft: number = 60;
  interval: any;

  formattedTime = formattedTime;

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      forms: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addForm();
  }

  get forms(): FormArray {
    return this.form.get('forms') as FormArray;
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  disableForm(): void {
    this.form.disable();
  }

  clearForm(): void {
    this.form.reset();
  }

  addForm() {
    const newForm = this.fb.group({
      country: ['', [Validators.required, this.countryValidator.bind(this)]],
      username: ['', Validators.required],
      birthday: ['', Validators.required]
    });

    newForm.get('country')?.valueChanges.subscribe(value => {
      this.filterCountries(value);
    });

    newForm.get('username')?.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe(() => {

    });

    this.forms.push(newForm);
  }

  removeForm(index: number) {
    this.forms.removeAt(index);
  }

  filterCountries(event: any) {
    this.countrySuggestions = this.countries.filter((country: Country) =>
      event?.data && country.toLowerCase().includes(event.data.toLowerCase())
    );
  }

  countryValidator(control: FormControl) {
    return this.countries.includes(control.value) ? null : { invalidCountry: true };
  }

  startTime(): void {
    this.timeLeft = 5;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timerStarted = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  onSubmit(): void {
    // if (!this.form.valid) {
    //   console.log('Form not Submitted', this.form.value);
    //   return;
    // }

    this.disableForm();
    this.timerStarted = true;
    this.startTime();

  }

  onCancel(): void {
    this.timerStarted = false;
    this.form.enable();
  }

}
