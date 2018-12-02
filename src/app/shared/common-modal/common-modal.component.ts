import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'common-modal',
  templateUrl: './common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})


export class CommonModalComponent {
  @ViewChild('childModal') public childModal: ModalDirective;

  @Input() title: string;
  @Input() primaryButton: any;

  @Output() primaryButtonClicked: EventEmitter<any> = new EventEmitter();
  @Output() hideButtonClicked: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  show() {
    this.childModal.show();
  }

  hide() {
    this.childModal.show();
  }
}
