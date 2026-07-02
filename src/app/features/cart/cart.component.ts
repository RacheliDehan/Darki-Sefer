// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CartStore } from './store/cart.store';

// @Component({
//   selector: 'app-cart',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './cart.component.html',
//   styleUrls: ['./cart.component.scss']
// })
// export class CartComponent {
//   constructor(public readonly store: CartStore) {
    
//   }
  
 
// }


import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartStore } from './store/cart.store'; // תתאימי נתיב לפי שלך

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  private fb = inject(FormBuilder);
  store = inject(CartStore);

  form = this.fb.group({

    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],

    institutionName: ['', [Validators.required]],

    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,10}$/)]],
    phone2: [''],

    email: ['', [Validators.required, Validators.email]],

    city: [''],

    address: [''],

    invoiceName: ['', [Validators.required]],

    notes: [''],

    delivery: [true, [Validators.required]]

  });

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      customer: this.form.value,
      items: this.store.items(),
      totals: {
        books: this.store.totalBooks(),
        amount: this.store.totalAmount()
      }
    };

    console.log('ORDER:', payload);

    alert('ההזמנה נשלחה בהצלחה ✔');

    // this.store.clearCart?.(); // אם יש לך פונקציה כזו
    this.form.reset({ delivery: true });
  }
}
