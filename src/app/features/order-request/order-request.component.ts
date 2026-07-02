import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { QuoteRequestService } from '../../services/quote-request.service';

@Component({
    selector: 'app-order-request',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './order-request.component.html',
    styleUrls: ['./order-request.component.scss']
})
export class OrderRequestComponent {

    fb = inject(FormBuilder);

    quoteService = inject(QuoteRequestService);

    books = [

        { id:1,name:'ספר בראשית'},
        { id:2,name:'ספר חשבון'},
        { id:3,name:'ספר אנגלית'},
        { id:4,name:'ספר מדעים'}

    ];

    form = this.fb.group({

        customerName:['',Validators.required],

        institutionName:['',Validators.required],

        bookId:['',Validators.required],

        quantity:[1,[Validators.required,Validators.min(1)]],

        delivery:[true],

        phone:['',Validators.required],

        email:['',[Validators.required,Validators.email]]

    });

    submit(){

        if(this.form.invalid){

            this.form.markAllAsTouched();

            return;

        }

        // this.quoteService.sendRequest(this.form.value as any)
        //     .subscribe(()=>{

        //         alert("הבקשה נשלחה בהצלחה");

        //         this.form.reset({
        //             quantity:1,
        //             delivery:true
        //         });

        //     });

    }

}