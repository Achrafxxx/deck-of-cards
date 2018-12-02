import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResizeDetectorDirective} from './resize-detector/resize-detector.directive';
import {ConfirmComponent} from './confirm-modal/confirm.component';
import {BootstrapModalModule} from 'ng2-bootstrap-modal';
import { CommonModalComponent } from './common-modal/common-modal.component';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    ResizeDetectorDirective,
    ConfirmComponent,
    CommonModalComponent
  ],
  imports: [
    CommonModule,
    BootstrapModalModule.forRoot({container: document.body}),
    ModalModule.forRoot()
  ],
  entryComponents: [
    ConfirmComponent
  ],
  exports: [
    ResizeDetectorDirective,
    ConfirmComponent,
    CommonModalComponent
  ]
})
export class SharedModule {
}
