import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CartStore } from './store/cart.store';
import { OrderService } from '../../services/order.service';
import { BookOrderComponent } from '../book-order/book-order';

@Component({
  selector: 'app-cart',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookOrderComponent
  ],

  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  private fb = inject(FormBuilder);

  store = inject(CartStore);

  private orderService = inject(OrderService);

  loading = signal(false);

  successMessage = signal<string | null>(null);

  errorMessage = signal<string | null>(null);


  form = this.fb.group({

    firstName: ['', [Validators.required]],

    lastName: ['', [Validators.required]],

    institutionName: ['', [Validators.required]],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{9,10}$/)
      ]
    ],

    phone2: [''],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    city: [''],

    address: ['', [Validators.required]],
    principalName: [''],
    invoiceName: ['', [Validators.required]],

    notes: [''],

    delivery: [true, [Validators.required]]

  });


  async submit(): Promise<void> {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    // לא מאפשרים לשלוח הזמנה בלי ספרים
    if (this.store.totalBooks() === 0) {

      this.errorMessage.set(
        'יש לבחור לפחות ספר אחד'
      );

      return;
    }


    this.loading.set(true);

    this.errorMessage.set(null);

    this.successMessage.set(null);


    try {

      const formValue = this.form.getRawValue();

      const items = this.store.items();

      const booksDetails = items
        .map(item => `${item.book?.title} — ${item.quantity} יח׳`)
        .join('\n');
      await this.orderService.sendQuoteRequest({

        customerId: crypto.randomUUID(),

        customerName:
          `${formValue.firstName} ${formValue.lastName}`,

        institutionName:
          formValue.institutionName!,

        bookIds:
          items.map(item => item.bookId),

        // bookName:
        //   items
        //     .map(item => item.book?.title)
        //     .join(', '),
        bookName: booksDetails,

        quantities:
          items.map(item => item.quantity),

        quantity:
          this.store.totalBooks(),

        delivery:
          formValue.delivery!,

        phone:
          formValue.phone!,

        email:
          formValue.email!,

        currency: 'ILS',

        requestedAt:
          new Date().toISOString(),

        notes:
          formValue.notes ?? ''

      });


      this.successMessage.set(
        'ההזמנה נשלחה בהצלחה!'
      );


      this.form.reset({
        delivery: true
      });


      alert(
        'ההזמנה נשלחה בהצלחה! נציג יחזור אליך בהקדם'
      );


    } catch (err) {

      this.errorMessage.set(
        err instanceof Error
          ? err.message
          : 'אירעה שגיאה'
      );

    } finally {

      this.loading.set(false);

    }

  }

}