import { Timestamp } from 'firebase/firestore';

export interface Ad {
    id?: string;
    title: string;
    description: string;
    createdBy: string;
    createdAt?: Timestamp;
    className: string;
    // typeName: "sale" | "buy";
    typeName: string;
    country: string;
    city: string;
  }

export const classNameList = {
    RealEstate: 'Real estate', 
    WorkAndBusiness: 'Work and business', 
    MobileAndComputer: 'Mobile and computer'
};

export const cityNameList = {
    Bagdad: 'Bagdad',
    Babylon: 'Babylon',
    Karbala: 'Karbala'
}