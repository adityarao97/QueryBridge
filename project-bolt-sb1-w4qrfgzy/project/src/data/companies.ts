import { Company } from '../types';

export const companies: Company[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://images.pexels.com/photos/4560039/pexels-photo-4560039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "The world's largest online marketplace and cloud computing platform.",
    searchDescription: "Search for products across Amazon's vast catalog.",
    apiStructure: "{ \"query\": \"string\" }"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "https://images.pexels.com/photos/15406295/pexels-photo-15406295/free-photo-of-close-up-of-a-smartphone-displaying-linkedin-application.jpeg",
    description: "Professional networking platform connecting businesses and professionals.",
    searchDescription: "Search for jobs, companies, and professionals.",
    apiStructure: "{ \"query\": \"string\", \"filters\": { \"jobType\": \"string\" } }"
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: "https://images.unsplash.com/photo-1695742265305-14f0373cd9dc?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Online travel agency for lodging reservations.",
    searchDescription: "Find hotels, apartments, and other accommodations.",
    apiStructure: "{ \"query\": \"string\", \"dates\": { \"checkIn\": \"date\", \"checkOut\": \"date\" } }"
  },
  {
    id: "walmart",
    name: "Walmart",
    logo: "https://images.unsplash.com/photo-1648091855110-77a1c3dead63?q=80&w=2708&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "America's largest retail chain offering a wide range of products.",
    searchDescription: "Search for products available at Walmart.",
    apiStructure: "{ \"query\": \"string\", \"filters\": { \"category\": \"string\", \"price\": \"number\" } }"
  }
];