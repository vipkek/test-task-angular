import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[inputError]'
})

export class InputErrorDirective implements OnInit {
  @Input('inputErrorControl')
  controlName: string = '';

  @Input()
  formGroup: FormGroup = new FormGroup({});

  constructor(private el: ElementRef,
              private renderer: Renderer2) {}

  ngOnInit() {
    const control = this.formGroup.get(this.controlName) as AbstractControl;
    control.statusChanges.subscribe(() => {
      this.setErrorMessages(control);
    });
  }

  setErrorMessages(control: AbstractControl) {
    const errors = control.errors;
    const errorMessages = this.getErrorMessages(errors);
    this.displayErrorMessages(errorMessages);
  }

  getErrorMessages(errors: any): string[] {
    if (!errors) return [];

    const errorMessages: string[] = [];
    if (errors.required) {
      errorMessages.push('This field is required.');
    }

    if (errors.invalid) {
      errorMessages.push(`Please provide a correct ${this.controlName}`);
    }

    return errorMessages;
  }

  displayErrorMessages(errorMessages: string[]) {
    const parent = this.el.nativeElement.parentElement;
    const errorContainer = parent.querySelector('.error-messages');

    if (errorContainer) {
      this.renderer.setProperty(errorContainer, 'innerHTML', '');
      errorMessages.forEach(message => {
        const div = this.renderer.createElement('div');
        const text = this.renderer.createText(message);
        this.renderer.appendChild(div, text);
        this.renderer.appendChild(errorContainer, div);
      });
    }
  }
}
