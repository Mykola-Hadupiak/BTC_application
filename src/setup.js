import { Email } from './models/email.js';
import { Rate } from './models/rate.js';

Email.sync({ force: true });
Rate.sync({ force: true });
