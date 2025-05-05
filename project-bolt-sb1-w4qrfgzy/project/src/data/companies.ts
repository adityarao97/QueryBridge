import { Company } from '../types';

export const companies: Company[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "The world's largest online marketplace and cloud computing platform.",
    searchDescription: "Search for products across Amazon's vast catalog.",
    apiStructure: "{ \"query\": \"string\" }"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Professional networking platform connecting businesses and professionals.",
    searchDescription: "Search for jobs, companies, and professionals.",
    apiStructure: "{ \"query\": \"string\", \"filters\": { \"jobType\": \"string\" } }"
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: "https://images.pexels.com/photos/1470587/pexels-photo-1470587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "Online travel agency for lodging reservations.",
    searchDescription: "Find hotels, apartments, and other accommodations.",
    apiStructure: "{ \"query\": \"string\", \"dates\": { \"checkIn\": \"date\", \"checkOut\": \"date\" } }"
  },
  {
    id: "google",
    name: "Google",
    logo: "https://images.pexels.com/photos/4549416/pexels-photo-4549416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    description: "The world's most popular search engine.",
    searchDescription: "Search the web for anything.",
    apiStructure: "{ \"query\": \"string\" }"
  }
];