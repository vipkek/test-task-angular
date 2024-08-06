import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Country } from './core/enum/country';
import { formattedTime } from './core/utils/date';
import { CustomValidatorsService } from './core/services/custom-validators.service';
import { UserService } from './core/services/user.service';
import { SubmitFormResponseData } from './core/interface/responses';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  form: FormGroup;
  countrySuggestions: string[] = [];
  countries = Object.values(Country);

  errorMessage = '';
  timerStarted = false;
  timeLeft: number = 60;
  interval: any;

  formattedTime = formattedTime;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private customValidators: CustomValidatorsService
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
      country: ['', [Validators.required, this.customValidators.countryValidator()]],
      username: ['', Validators.required, this.customValidators.usernameValidator()],
      birthday: ['', [Validators.required, this.customValidators.futureDateValidator()]]
    });

    this.forms.push(newForm);
    this.errorMessage = '';
  }

  removeForm(index: number) {
    this.forms.removeAt(index);
    this.errorMessage = '';
  }

  filterCountries(event: any) {
    this.countrySuggestions = this.countries.filter((country: Country) =>
      event?.data && country.toLowerCase().includes(event.data.toLowerCase())
    );
  }

  getInvalidControlCount(): number {
    let invalidCount = 0;

    this.forms.controls.forEach(control => {
      if (control.invalid) {
        invalidCount++;
      }
    });

    return invalidCount;
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

        this.userService.createUser(this.forms)
          .subscribe((res: SubmitFormResponseData) => {
            console.log('res', res)
            this.errorMessage = '';
            this.clearForm();

            this.form.enable({ emitEvent: false });
            this.form.markAsPristine();
            this.form.markAsUntouched();
          })

      }
    }, 1000);
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Check form fields!';
      this.form.enable();
      return;
    }

    this.errorMessage = '';

    this.disableForm();
    this.timerStarted = true;
    this.startTime();
  }

  onCancel(): void {
    this.timerStarted = false;
    clearInterval(this.interval);
    this.form.enable({ emitEvent: false });
  }

}
