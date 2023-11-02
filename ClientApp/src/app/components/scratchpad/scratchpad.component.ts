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
  tabbedContent: any[] = [];
  addingTab: boolean = false;
  activeTabNumber: number = 0;

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
      newTabName: [''],
    });
  }
  ngOnInit(): void {
    console.log(this.router.url);
    this.tabbedContent.push({
      id: 0,
      tabName: 'Default',
      content: '',
    });
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
  startAddNewTab(): void {
    console.log('adding a new tab');
    this.addingTab = true;
  }
  displayContent(tabNumber: number): void {
    let s = this.tabbedContent.find((x) => x.id === tabNumber).content;

    //save the current text into the current tab

    this.tabbedContent.find((x) => x.id === this.activeTabNumber).content =
      this.form.controls.plainText.value;

    this.form.controls.plainText.setValue(s);
    this.activeTabNumber = tabNumber;
  }
  private getMaxTabNumber(): number {
    let maxNumber = 0;
    this.tabbedContent.forEach((x) => {
      if (maxNumber <= x.id) {
        maxNumber = x.id + 1;
      }
    });
    return maxNumber;
  }
  leaveTabAdd(): void {
    this.addingTab = false;
    if (this.form.controls.newTabName.value.trim().length == 0) return;
    let tabId = this.getMaxTabNumber();
    this.tabbedContent.push({
      id: tabId,
      tabName: this.form.controls.newTabName.value,
      content: ``,
    });
    this.activeTabNumber = tabId;
    this.form.controls.plainText.setValue(``);
    this.form.controls.newTabName.setValue(``);
  }
  save(): void {
    let shaOfPlaintext = SHA256(this.form.controls.plainText.value).toString();
    console.log(this.tabbedContent);
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
