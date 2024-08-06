import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { Country } from '../enum/country';

@Injectable({ providedIn: 'root' })
export class CustomValidatorsService {
  constructor(private userService: UserService) {}

  countryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const countries = Object.values(Country);
      return countries.includes(control.value) ? null : { invalid: true };
    };
  }

  usernameValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(200),
        switchMap(value =>
          this.userService.checkUser(value)
            .pipe(
              map(response => (response.isAvailable ? null : { invalid: true })),
              catchError(() => of(null))
            )
          )
      );
    };
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const currentDate = new Date();
      const selectedDate = new Date(control.value);

      return selectedDate < currentDate ? null : { invalid: true };
    };
  }
}
