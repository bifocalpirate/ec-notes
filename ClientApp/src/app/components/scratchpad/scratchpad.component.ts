import { FormBuilder, Validators } from '@angular/forms';
import { AES, enc } from 'crypto-js';
import { SHA256 } from 'crypto-js';
import { TransportService } from 'src/app/services/transport.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scratchpad',
  templateUrl: './scratchpad.component.html',
  styleUrls: ['./scratchpad.component.css'],
})
export class ScratchpadComponent implements OnInit {
  form: any;

  alerts?: any[];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transportService: TransportService
  ) {
    this.form = fb.group({
      plainText: ['', Validators.required],
      password: ['password', Validators.required],
      initialHash: [''],
      website: [''],
    });
  }
  ngOnInit(): void {
    console.log(this.router.url);
  }

  load(): void {
    this.transportService
      .getWebsite(this.form.controls.website.value)
      .subscribe((data) => {
        let p: string = data.data;

        try {
          let decrypted = AES.decrypt(
            p,
            this.form.controls.password.value
          ).toString(enc.Utf8);
          let content = decrypted.substring(0, decrypted.length - 64);
          let initContentSHA = decrypted.substring(decrypted.length - 64);
          this.form.controls.plainText.setValue(content);
          this.form.controls.initialHash.setValue(initContentSHA);
        } catch (e) {
          console.error('Password is incorrect!');
        }
      });
  }
  save(): void {
    let shaOfPlaintext = SHA256(this.form.controls.plainText.value).toString();
    this.transportService
      .uploadData(this.form.controls.website.value, {
        encryptedContent: AES.encrypt(
          this.form.controls.plainText.value + shaOfPlaintext,
          this.form.controls.password.value
        ).toString(),
        currentHashContent: shaOfPlaintext,
        initialHashContent: this.form.controls.initialHash.value,
      })
      .subscribe((response) => {
        console.log(response);
      });
  }
}
