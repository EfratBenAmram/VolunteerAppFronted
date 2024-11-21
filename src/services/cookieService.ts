import Cookies from 'js-cookie';
import { Volunteer } from '../models/volunteers';

export const setUserCookie = (user: Volunteer) => {
    Cookies.set('currentVolunteer', JSON.stringify(user), { expires: 7 }); 
};

export const getUserFromCookie = (): Volunteer | null => {
    const user = Cookies.get('currentVolunteer');
    return user ? JSON.parse(user) : null;
};

export const removeUserCookie = () => {
    Cookies.remove('currentVolunteer');
};
