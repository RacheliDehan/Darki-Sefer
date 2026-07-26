import { environment } from '../../../environments/environment';

export const EMAIL_SERVICE_ID = environment.emailJs.serviceId;
export const EMAIL_PUBLIC_KEY = environment.emailJs.publicKey;
export const EMAIL_ADMIN_TEMPLATE_ID = environment.emailJs.adminTemplateId;
export const EMAIL_CUSTOMER_TEMPLATE_ID = environment.emailJs.customerTemplateId;
export const EMAIL_ADMIN_ADDRESS = environment.emailJs.adminEmail;

export const EMAIL_CONFIG = {
  SERVICE_ID: EMAIL_SERVICE_ID,
  PUBLIC_KEY: EMAIL_PUBLIC_KEY,
  ADMIN_TEMPLATE_ID: EMAIL_ADMIN_TEMPLATE_ID,
  CUSTOMER_TEMPLATE_ID: EMAIL_CUSTOMER_TEMPLATE_ID,
  ADMIN_EMAIL: EMAIL_ADMIN_ADDRESS
} as const;
