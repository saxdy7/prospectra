/**
 * Demo local-business results — the shape a Google Maps-style search would
 * return. Used to preview the local-business search form and to seed the
 * one-click demo table. Fictional listings.
 */

export interface DemoLocalBusiness {
  name: string;
  category: string;
  phone: string;
  address: string;
  city: string;
  rating: number;
  reviews: number;
  website: string;
}

export const DEMO_LOCAL_BUSINESSES: DemoLocalBusiness[] = [
  { name: 'Hotel Cherry', category: 'Boutique Hotel', phone: '+91 99582 67395', address: 'Old Manali Road', city: 'Manali, IN', rating: 4.9, reviews: 812, website: 'hotelcherry.example' },
  { name: 'Cafe Mistral', category: 'Cafe', phone: '+91 98104 22873', address: '14th Cross, Indiranagar', city: 'Bengaluru, IN', rating: 4.7, reviews: 1204, website: 'cafemistral.example' },
  { name: 'Studio Verde', category: 'Design Studio', phone: '+91 90045 71190', address: 'Koregaon Park', city: 'Pune, IN', rating: 4.8, reviews: 96, website: 'studioverde.example' },
  { name: 'Bluepoint Dental Care', category: 'Dental Clinic', phone: '+91 98765 43210', address: 'Bandra West', city: 'Mumbai, IN', rating: 4.6, reviews: 388, website: 'bluepointdental.example' },
  { name: 'Ridgeline Outdoor Co.', category: 'Sporting Goods Store', phone: '+1 303 555 0142', address: '812 Pearl Street', city: 'Boulder, US', rating: 4.8, reviews: 540, website: 'ridgelineoutdoor.example' },
  { name: 'Marchetti’s Trattoria', category: 'Italian Restaurant', phone: '+1 212 555 0187', address: '212 Mulberry St', city: 'New York, US', rating: 4.5, reviews: 2310, website: 'marchettistrattoria.example' },
  { name: 'The Reading Nook', category: 'Bookstore', phone: '+44 161 555 0173', address: '48 Deansgate', city: 'Manchester, UK', rating: 4.9, reviews: 276, website: 'thereadingnook.example' },
  { name: 'Sunburst Yoga Collective', category: 'Yoga Studio', phone: '+61 3 5550 1442', address: '22 Chapel Street', city: 'Melbourne, AU', rating: 4.9, reviews: 615, website: 'sunburstyoga.example' },
  { name: 'Copperleaf Barbershop', category: 'Barbershop', phone: '+1 512 555 0166', address: '901 S Congress Ave', city: 'Austin, US', rating: 4.7, reviews: 892, website: 'copperleafbarber.example' },
  { name: 'Jaipur Spice Market', category: 'Grocery Store', phone: '+91 94140 88213', address: 'Chandpole Bazaar', city: 'Jaipur, IN', rating: 4.4, reviews: 431, website: 'jaipurspicemarket.example' },
  { name: 'Northgate Auto Repair', category: 'Auto Repair Shop', phone: '+1 416 555 0129', address: '1180 Bloor St W', city: 'Toronto, CA', rating: 4.6, reviews: 349, website: 'northgateauto.example' },
  { name: 'Lotus Wellness Spa', category: 'Day Spa', phone: '+91 98450 19827', address: 'Jubilee Hills', city: 'Hyderabad, IN', rating: 4.8, reviews: 703, website: 'lotuswellness.example' },
  { name: 'Kestrel Coffee Roasters', category: 'Coffee Roaster', phone: '+61 2 5550 3391', address: '55 York Street', city: 'Sydney, AU', rating: 4.9, reviews: 1088, website: 'kestrelroasters.example' },
  { name: 'Marina Bay Dental Studio', category: 'Dental Clinic', phone: '+65 8234 1190', address: '10 Bayfront Ave', city: 'Singapore, SG', rating: 4.7, reviews: 219, website: 'marinabaydental.example' },
  { name: 'The Copper Kettle', category: 'Tea House', phone: '+44 131 555 0154', address: '9 Victoria Street', city: 'Edinburgh, UK', rating: 4.8, reviews: 502, website: 'thecopperkettle.example' },
  { name: 'Fernwood Veterinary Clinic', category: 'Veterinary Clinic', phone: '+91 99870 44562', address: 'Anna Nagar', city: 'Chennai, IN', rating: 4.9, reviews: 367, website: 'fernwoodvet.example' },
  { name: 'Dune & Palm Realty', category: 'Real Estate Agency', phone: '+971 4 555 0198', address: 'Sheikh Zayed Road', city: 'Dubai, AE', rating: 4.5, reviews: 128, website: 'duneandpalm.example' },
  { name: 'Ember & Oak Grill', category: 'Steakhouse', phone: '+1 617 555 0143', address: '77 Newbury St', city: 'Boston, US', rating: 4.6, reviews: 941, website: 'emberandoak.example' }
];
