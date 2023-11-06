import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AES, enc } from 'crypto-js';
import { SHA256 } from 'crypto-js';
import { TransportService } from 'src/app/services/transport.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scratchpad',
  templateUrl: './scratchpad.component.html',
  styleUrls: ['./scratchpad.component.css'],
})
export class ScratchpadComponent implements OnInit {
  form: FormGroup;
  alerts?: any[];
  tabbedContent: any[] = [];
  addingTab: boolean = false;
  activeTabNumber: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private transportService: TransportService,
    private toastr: ToastrService
  ) {
    this.form = fb.group({
      plainText: ['', Validators.required],
      password: ['', Validators.required],
      initialHash: [''],
      website: ['redrover1', Validators.required],
      newTabName: [''],
    });
  }
  disableLoadSiteButton(): boolean {
    return (
      !this.form.controls.password.valid || !this.form.controls.website.valid
    );
  }

  disableSaveButton(): boolean {
    return (
      !this.form.controls.password.valid ||
      !this.form.controls.website.valid ||
      !this.anyTabHasContent()
    );
  }

  anyTabHasContent(): boolean {
    return this.tabbedContent.filter((x) => x.content.length).length > 0;
  }

  onChange(): void {
    this.tabbedContent.find((x) => x.id === this.activeTabNumber).content =
      this.form.controls.plainText.value;
  }
  ngOnInit(): void {
    console.log(this.router.url);
    this.tabbedContent.push({
      id: 0,
      tabName: 'Default',
      content: '',
    });
    this.displayContent(0);
  }

  load(): void {
    this.tabbedContent = [];
    this.form.controls.plainText.setValue('');
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
          this.tabbedContent = [];
          this.tabbedContent = JSON.parse(content);
          console.log(this.tabbedContent);
          this.activeTabNumber = 0;
          this.displayContent(this.activeTabNumber);
          this.form.controls.initialHash.setValue(initContentSHA);
        } catch (e) {
          this.toastr.error('The website could not be decrypted.');
        }
      });
  }
  startAddNewTab(): void {
    this.addingTab = true;
  }
  displayContent(tabNumber: number): void {
    let s = this.tabbedContent.find((x) => x.id === tabNumber).content;
    this.form.controls.plainText.setValue(s);
    this.activeTabNumber = tabNumber;
  }
  private getNextTabNumber(): number {
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
    let tabId = this.getNextTabNumber();
    this.tabbedContent.push({
      id: tabId,
      tabName: this.form.controls.newTabName.value,
      content: ``,
    });
    this.activeTabNumber = tabId;
    this.displayContent(this.activeTabNumber);
    this.form.controls.newTabName.setValue(``);
  }

  save(): void {
    let content = JSON.stringify(this.tabbedContent);
    let shaOfContent = SHA256(content).toString();
    this.transportService
      .uploadData(this.form.controls.website.value, {
        encryptedContent: AES.encrypt(
          content + shaOfContent,
          this.form.controls.password.value
        ).toString(),
        currentHashContent: shaOfContent,
        initialHashContent: this.form.controls.initialHash.value,
      })
      .subscribe((response) => {
        this.toastr.success('Website saved.');
      });
  }
}
