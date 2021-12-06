import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {
  login!: FormGroup;
  register!: FormGroup;
  authentification = 'sign_in'

  constructor(
    private _formBuilder: FormBuilder,
    private _api: ApiService,
    private _toastr: ToastrService,
    private _router: Router
  ) {
    const pwdValidators: ValidatorFn[] = [Validators.required, Validators.minLength(6), Validators.maxLength(20)];
  }

  ngOnInit(): void {
    this.login = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.register = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async logIn() {
    console.log(this.login.value)
    try {
      const result: any = await this._api.sendLogin(this.login.value);
      console.log(result)
      this._toastr.success('Success Login');
      this.login.reset(); // reset form
      localStorage.setItem('token', result); //save token from backend
      this._router.navigate(['main']);
    } catch (error) {
      console.log('there is some err on server', error);
      this._toastr.error('ERROR, There is no user registered');
    }
  }

  async signUp() {
    try {
      const registerData = {
        name: this.register.controls.name.value,
        email: this.register.controls.email.value,
        password: this.register.controls.password.value
      }
      console.log(registerData, '- registerData') // working correct
      // checked validation
      if (!this.register.valid) {
        this._toastr.error('Please fill out the form!');
        return
      } else {
        const fromServer = await this._api.sendUserRegistretion(registerData); //move data to api service - work

        //localStorage.setItem('token', fromServer);  // don't understand why token does not work???

        console.log(fromServer, '- this is fromServer -');
        this._toastr.success('Your profile has been created, Have fun!');
        this.register.reset()
      }
    } catch (error) {
      console.log('there is some err on server', error);
      this._toastr.error('error, please try again');
    }
  }


  //check email
  private mailValidator(): ValidatorFn {
    const error_message = { mailValidator: { msg: `Invalid email` } };
    const pattern: RegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return (control: AbstractControl) => {
      const isValid = pattern.test(control.value);
      return isValid ? null : error_message
    }

  }


}
