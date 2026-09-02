import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
    FormGroup
} from '@angular/forms';

import { OrderService } from '../../services/order.service';

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

    private fb = inject(FormBuilder);
    private orderService = inject(OrderService);


    loading = signal(false);

    successMessage = signal<string | null>(null);

    errorMessage = signal<string | null>(null);


    books = [
        {
            id: '1',
            name: 'ספר בראשית'
        },
        {
            id: '2',
            name: 'ספר חשבון'
        },
        {
            id: '3',
            name: 'ספר אנגלית'
        },
        {
            id: '4',
            name: 'ספר מדעים'
        }
    ];


    form: FormGroup = this.fb.group({

        customerName: [
            '',
            Validators.required
        ],

        institutionName: [
            '',
            Validators.required
        ],

        bookId: [
            '',
            Validators.required
        ],

        quantity: [
            1,
            [
                Validators.required,
                Validators.min(1)
            ]
        ],

        delivery: [
            true
        ],

        phone: [
            '',
            Validators.required
        ],

        email: [
            '',
            [
                Validators.required,
                Validators.email
            ]
        ],

        notes: [
            ''
        ],
        city: [
            ''
        ]

    });

    private resetForm(): void {
        this.form.reset({
            quantity: 1,
            delivery: true
        });
    }

    async submit(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.loading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        try {
            const formValue = this.form.getRawValue();
            const selectedBook = this.books.find(
               book => book.id === formValue.bookId
            );
            if (!selectedBook) {
                throw new Error('לא נבחר ספר');
            }
  await this.orderService.sendQuoteRequest({
        customerId: crypto.randomUUID(),
        bookIds: [
            selectedBook.id
        ],
        quantities: [
            formValue.quantity
        ],
        currency: 'ILS',
        requestedAt: new Date().toISOString(),
        notes: '',
        customerName: formValue.customerName,
        institutionName: formValue.institutionName,
        bookName: selectedBook.name,
        quantity: formValue.quantity,
        delivery: formValue.delivery,
        phone: formValue.phone,
        email: formValue.email,
        city: formValue.city
    });
            this.successMessage.set(
                'הבקשה נשלחה בהצלחה! נחזור אליך בהקדם.'
            );
            this.resetForm();
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'אירעה שגיאה בשליחת הבקשה';
            this.errorMessage.set(message);
        } finally {

           this.loading.set(false);
        }
    }
}