
"use client";

import { useMemo, useState } from "react";

type Language = "bn" | "en";
type OfficeType = "embassy" | "consulate" | "other";

type Office = {
  id: string;
  country: string;
  city: string;
  type: OfficeType;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  phone?: string;
  email?: string;
  website: string;
  source: string;
  mapQuery: string;
};

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
  "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czechia", "Democratic Republic of the Congo",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti",
  "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar",
  "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
  "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand",
  "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia",
  "Zimbabwe",
];

const offices: Office[] = [
  {
    id: "riyadh-embassy",
    country: "Saudi Arabia",
    city: "Riyadh",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, রিয়াদ",
    nameEn: "Embassy of Bangladesh, Riyadh",
    descriptionBn:
      "সৌদি আরবে বাংলাদেশি নাগরিকদের দূতাবাস ও কনস্যুলার সেবার তথ্যের জন্য সরকারি ওয়েবসাইট দেখুন।",
    descriptionEn:
      "Visit the official website for embassy and consular services for Bangladeshi citizens in Saudi Arabia.",
    phone: "+966 11 419 5661",
    email: "mission.riyadh@mofa.gov.bd",
    website: "https://riyadh.mofa.gov.bd/",
    source: "https://mofa.gov.bd/pages/static-pages/6940329e35ce18e1c055f712",
    mapQuery: "Embassy of Bangladesh Riyadh Saudi Arabia",
  },
  {
    id: "jeddah-consulate",
    country: "Saudi Arabia",
    city: "Jeddah",
    type: "consulate",
    nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, জেদ্দা",
    nameEn: "Consulate General of Bangladesh, Jeddah",
    descriptionBn:
      "পাসপোর্ট ও কনস্যুলার সেবার তথ্যের জন্য সরকারি কনস্যুলেট ওয়েবসাইট দেখুন।",
    descriptionEn:
      "Visit the official consulate website for passport and consular services.",
    phone: "+966 54 397 4848",
    email: "hoc.jeddah@mofa.gov.bd",
    website: "https://jeddah.mofa.gov.bd/",
    source: "https://mofa.gov.bd/pages/static-pages/6940329e35ce18e1c055f712",
    mapQuery: "Consulate General of Bangladesh Jeddah Saudi Arabia",
  },


  {
    id: "uae-abu-dhabi-embassy",
    country: "United Arab Emirates",
    city: "Abu Dhabi",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, আবুধাবি",
    nameEn: "Embassy of Bangladesh, Abu Dhabi",
    descriptionBn: "ঠিকানা: Villa 46 ও 48, Sector 19, Zone W31, Al Jawwalah Street, Al Saadah Area, Abu Dhabi, UAE।",
    descriptionEn: "Address: Villa 46 and 48, Sector 19, Zone W31, Al Jawwalah Street, Al Saadah Area, Abu Dhabi, UAE.",
    phone: "+971 2 446 5100",
    email: "mission.abudhabi@mofa.gov.bd",
    website: "https://abudhabi.mofa.gov.bd/",
    source: "https://abudhabi.mofa.gov.bd/pages/static-pages/6952669335ce18e1c05aa248",
    mapQuery: "Embassy of Bangladesh Abu Dhabi UAE"
  },
  {
    id: "uae-dubai-consulate",
    country: "United Arab Emirates",
    city: "Dubai",
    type: "consulate",
    nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, দুবাই",
    nameEn: "Consulate General of Bangladesh, Dubai",
    descriptionBn: "ঠিকানা: Villa 36 ও 145, Abdulla Hussain Al Malik Villa, 123/3 Street, Abu Hail Road, Al Wuheida, Deira, Dubai, UAE।",
    descriptionEn: "Address: Villas 36 and 145, Abdulla Hussain Al Malik Villa, 123/3 Street, Abu Hail Road, Al Wuheida, Deira, Dubai, UAE.",
    phone: "+971 4 238 8199, +971 4 265 1116",
    email: "mission.dubai@mofa.gov.bd",
    website: "https://dubai.mofa.gov.bd/",
    source: "https://dubai.mofa.gov.bd/pages/static-pages/6952669935ce18e1c05aa471",
    mapQuery: "Consulate General of Bangladesh Dubai UAE"
  },
  {
    id: "qatar-doha-embassy",
    country: "Qatar",
    city: "Doha",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, দোহা",
    nameEn: "Embassy of Bangladesh, Doha",
    descriptionBn: "ঠিকানা: Building 153, Street 820, Zone 43, New Al-Hilal, Doha, Qatar; P.O. Box 2080।",
    descriptionEn: "Address: Building 153, Street 820, Zone 43, New Al-Hilal, Doha, Qatar; P.O. Box 2080.",
    phone: "+974 4467 1927",
    email: "mission.doha@mofa.gov.bd",
    website: "https://doha.mofa.gov.bd/",
    source: "https://doha.mofa.gov.bd/pages/static-pages/6952667335ce18e1c05a9345",
    mapQuery: "Embassy of Bangladesh Doha Qatar"
  },
  {
    id: "kuwait-city-embassy",
    country: "Kuwait",
    city: "Kuwait City",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, কুয়েত",
    nameEn: "Embassy of Bangladesh, Kuwait",
    descriptionBn: "ঠিকানা: Messila, Block 7, Street 16, House 91 ও 93, Kuwait; P.O. Box 22344, Safat 13084।",
    descriptionEn: "Address: Messila, Block 7, Street 16, Houses 91 and 93, Kuwait; P.O. Box 22344, Safat 13084.",
    phone: "+965 2390 0913",
    email: "mission.kuwait@mofa.gov.bd",
    website: "https://kuwait.mofa.gov.bd/",
    source: "https://kuwait.mofa.gov.bd/pages/static-pages/6952667b35ce18e1c05a9765",
    mapQuery: "Embassy of Bangladesh Messila Kuwait"
  },
  {
    id: "bahrain-manama-embassy",
    country: "Bahrain",
    city: "Manama",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, মানামা",
    nameEn: "Embassy of Bangladesh, Manama",
    descriptionBn: "ঠিকানা: House 71, Qufool Avenue, Salihiya, Road 5653, Block 356, Manama, Bahrain; P.O. Box 26718।",
    descriptionEn: "Address: House 71, Qufool Avenue, Salihiya, Road 5653, Block 356, Manama, Bahrain; P.O. Box 26718.",
    phone: "+973 1723 3925",
    email: "mission.manama@mofa.gov.bd",
    website: "https://manama.mofa.gov.bd/",
    source: "https://manama.mofa.gov.bd/pages/static-pages/695266b535ce18e1c05aae4e",
    mapQuery: "Embassy of Bangladesh Manama Bahrain"
  },
  {
    id: "oman-muscat-embassy",
    country: "Oman",
    city: "Muscat",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, মাস্কাট",
    nameEn: "Embassy of Bangladesh, Muscat",
    descriptionBn: "ঠিকানা: Building 4207, Way 3052, Shatti Al Qurum, Muscat, Oman।",
    descriptionEn: "Address: Building 4207, Way 3052, Shatti Al Qurum, Muscat, Oman.",
    phone: "+968 2469 8336, +968 2469 8098, +968 2463 4798",
    email: "mission.muscat@mofa.gov.bd",
    website: "https://muscat.mofa.gov.bd/",
    source: "https://muscat.mofa.gov.bd/pages/static-pages/695266a335ce18e1c05aa7e2",
    mapQuery: "Embassy of Bangladesh Muscat Oman"
  },
  {
    id: "jordan-amman-embassy",
    country: "Jordan",
    city: "Amman",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, আম্মান",
    nameEn: "Embassy of Bangladesh, Amman",
    descriptionBn: "ঠিকানা: Ibrahim Al Ghozlani Street, Villa 7, Um Uthaina, Amman, Jordan।",
    descriptionEn: "Address: Ibrahim Al Ghozlani Street, Villa 7, Um Uthaina, Amman, Jordan.",
    phone: "+962 6 552 9192, +962 6 552 9193",
    email: "mission.amman@mofa.gov.bd",
    website: "https://amman.mofa.gov.bd/",
    source: "https://amman.mofa.gov.bd/pages/static-pages/6952669935ce18e1c05aa470",
    mapQuery: "Embassy of Bangladesh Amman Jordan"
  },
  {
    id: "iran-tehran-embassy",
    country: "Iran",
    city: "Tehran",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, তেহরান",
    nameEn: "Embassy of Bangladesh, Tehran",
    descriptionBn: "ঠিকানা: No. 7, 12 Metri Esdasi, 1st Alley, 64th Street, North of Yousef Abad, Tehran, Iran; Postal Code 1436843713।",
    descriptionEn: "Address: No. 7, 12 Metri Esdasi, 1st Alley, 64th Street, North of Yousef Abad, Tehran, Iran; Postal Code 1436843713.",
    phone: "+98 21 8860 1781",
    email: "bangladoot.tehran@gmail.com",
    website: "https://tehran.mofa.gov.bd/",
    source: "https://tehran.mofa.gov.bd/pages/static-pages/695266a335ce18e1c05aa822",
    mapQuery: "Embassy of Bangladesh Tehran Iran"
  },
  {
    id: "iraq-baghdad-embassy",
    country: "Iraq",
    city: "Baghdad",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, বাগদাদ",
    nameEn: "Embassy of Bangladesh, Baghdad",
    descriptionBn: "বাগদাদের দূতাবাসের বর্তমান রাস্তার ঠিকানা নিশ্চিত করতে সরকারি ওয়েবসাইট দেখুন।",
    descriptionEn: "Check the official website for the current street address of the embassy in Baghdad.",
    email: "mission.baghdad@mofa.gov.bd",
    website: "https://baghdad.mofa.gov.bd/",
    source: "https://baghdad.mofa.gov.bd/",
    mapQuery: "Embassy of Bangladesh Baghdad Iraq"
  },
  {
    id: "lebanon-beirut-embassy",
    country: "Lebanon",
    city: "Beirut",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, বৈরুত",
    nameEn: "Embassy of Bangladesh, Beirut",
    descriptionBn: "বৈরুতের দূতাবাসের বর্তমান ঠিকানা ও যোগাযোগের তথ্য সরকারি ওয়েবসাইটে যাচাই করুন।",
    descriptionEn: "Check the official website for the current address and contact details of the embassy in Beirut.",
    website: "https://beirut.mofa.gov.bd/",
    source: "https://beirut.mofa.gov.bd/",
    mapQuery: "Embassy of Bangladesh Beirut Lebanon"
  },


  {
    id: "africa-algeria-algiers",
    country: "Algeria",
    city: "Algiers",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, আলজিয়ার্স",
    nameEn: "Embassy of Bangladesh, Algiers",
    descriptionBn: "ঠিকানা: 24, Chemin Cheikh Bachir El Ibrahimi, Poirson, El Biar, Algiers, Algeria।",
    descriptionEn: "Address: 24, Chemin Cheikh Bachir El Ibrahimi, Poirson, El Biar, Algiers, Algeria.",
    phone: "+213 23 05 03 01",
    email: "mission.algiers@mofa.gov.bd",
    website: "https://algiers.mofa.gov.bd/",
    source: "https://algiers.mofa.gov.bd/pages/static-pages/6952668f35ce18e1c05aa0a2",
    mapQuery: "Embassy of Bangladesh Algiers Algeria"
  },
  {
    id: "africa-egypt-cairo",
    country: "Egypt",
    city: "Cairo",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, কায়রো",
    nameEn: "Embassy of Bangladesh, Cairo",
    descriptionBn: "ঠিকানা: House No. 03, Street No. 259, New Maadi, Cairo, Egypt।",
    descriptionEn: "Address: House No. 03, Street No. 259, New Maadi, Cairo, Egypt.",
    phone: "+20 2 2516 2808",
    email: "mission.cairo@mofa.gov.bd",
    website: "https://cairo.mofa.gov.bd/",
    source: "https://cairo.mofa.gov.bd/pages/static-pages/6952667635ce18e1c05a949a",
    mapQuery: "Embassy of Bangladesh New Maadi Cairo Egypt"
  },
  {
    id: "africa-ethiopia-addis-ababa",
    country: "Ethiopia",
    city: "Addis Ababa",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, আদ্দিস আবাবা",
    nameEn: "Embassy of Bangladesh, Addis Ababa",
    descriptionBn: "ইথিওপিয়া ছাড়াও সুদান, দক্ষিণ সুদান ও বুরুন্ডির জন্য দূতাবাসটি দায়িত্ব পালন করে।",
    descriptionEn: "The embassy is also accredited to Sudan, South Sudan and Burundi.",
    phone: "+251 11 369 2477",
    email: "mission.addisababa@mofa.gov.bd",
    website: "https://addisababa.mofa.gov.bd/",
    source: "https://addisababa.mofa.gov.bd/pages/officers-profile",
    mapQuery: "Embassy of Bangladesh Addis Ababa Ethiopia"
  },
  {
    id: "africa-kenya-nairobi",
    country: "Kenya",
    city: "Nairobi",
    type: "other",
    nameBn: "বাংলাদেশ হাইকমিশন, নাইরোবি",
    nameEn: "Bangladesh High Commission, Nairobi",
    descriptionBn: "ঠিকানা: House No. 201, Nicole Drive, Runda Mumwe, Runda, Nairobi, Kenya।",
    descriptionEn: "Address: House No. 201, Nicole Drive, Runda Mumwe, Runda, Nairobi, Kenya.",
    phone: "+254 758 705137",
    email: "nairobi.mission@mofa.gov.bd",
    website: "https://nairobi.mofa.gov.bd/",
    source: "https://nairobi.mofa.gov.bd/pages/static-pages/6952669135ce18e1c05aa162",
    mapQuery: "Bangladesh High Commission 201 Nicole Drive Runda Nairobi Kenya"
  },
  {
    id: "africa-libya-tripoli",
    country: "Libya",
    city: "Tripoli",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, ত্রিপোলি",
    nameEn: "Embassy of Bangladesh, Tripoli",
    descriptionBn: "ঠিকানা: Al-Haddad Street, Al-Hadba Al-Khadra, Tripoli, Libya।",
    descriptionEn: "Address: Al-Haddad Street, Al-Hadba Al-Khadra, Tripoli, Libya.",
    phone: "+218 21 491 1199",
    email: "mission.tripoli@mofa.gov.bd",
    website: "https://tripoli.mofa.gov.bd/",
    source: "https://tripoli.mofa.gov.bd/pages/static-pages/6952668335ce18e1c05a9b12",
    mapQuery: "Embassy of Bangladesh Al Haddad Street Tripoli Libya"
  },
  {
    id: "africa-mauritius-port-louis",
    country: "Mauritius",
    city: "Port Louis",
    type: "other",
    nameBn: "বাংলাদেশ হাইকমিশন, পোর্ট লুইস",
    nameEn: "Bangladesh High Commission, Port Louis",
    descriptionBn: "ঠিকানা: 8th Floor, Hennessy Court, Pope Hennessy Street, Port Louis, Mauritius।",
    descriptionEn: "Address: 8th Floor, Hennessy Court, Pope Hennessy Street, Port Louis, Mauritius.",
    phone: "+230 212 9527",
    email: "mission.portlouis@mofa.gov.bd",
    website: "https://portlouis.mofa.gov.bd/",
    source: "https://portlouis.mofa.gov.bd/pages/static-pages/695266af35ce18e1c05aac47",
    mapQuery: "Bangladesh High Commission Hennessy Court Port Louis Mauritius"
  },
  {
    id: "africa-morocco-rabat",
    country: "Morocco",
    city: "Rabat",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, রাবাত",
    nameEn: "Embassy of Bangladesh, Rabat",
    descriptionBn: "ঠিকানা ও সাধারণ যোগাযোগের বিস্তারিত তথ্যের জন্য সরকারি দূতাবাসের ওয়েবসাইট দেখুন।",
    descriptionEn: "Visit the official embassy website for the latest address and general contact details.",
    phone: "+212 5377 66731",
    email: "hoc.rabat@mofa.gov.bd",
    website: "https://rabat.mofa.gov.bd/",
    source: "https://rabat.mofa.gov.bd/pages/officers-profile",
    mapQuery: "Embassy of Bangladesh Rabat Morocco"
  },
  {
    id: "africa-nigeria-abuja",
    country: "Nigeria",
    city: "Abuja",
    type: "other",
    nameBn: "বাংলাদেশ হাইকমিশন, আবুজা",
    nameEn: "Bangladesh High Commission, Abuja",
    descriptionBn: "কনস্যুলার, বাণিজ্যিক ও বাংলাদেশি নাগরিকদের সহায়তার জন্য আলাদা যোগাযোগের ব্যবস্থা রয়েছে।",
    descriptionEn: "Separate contacts are available for consular, commercial and Bangladeshi citizen services.",
    phone: "+234 818 779 7283, +234 907 385 9213",
    email: "mission.abuja@mofa.gov.bd",
    website: "https://abuja.mofa.gov.bd/",
    source: "https://abuja.mofa.gov.bd/pages/static-pages/6952668835ce18e1c05a9d9a",
    mapQuery: "Bangladesh High Commission Abuja Nigeria"
  },
  {
    id: "africa-south-africa-pretoria",
    country: "South Africa",
    city: "Pretoria",
    type: "other",
    nameBn: "বাংলাদেশ হাইকমিশন, প্রিটোরিয়া",
    nameEn: "Bangladesh High Commission, Pretoria",
    descriptionBn: "ভিসা-সংক্রান্ত সরকারি পাতায় 410, Farenden Street, Sunnyside, 0002, Pretoria ঠিকানা দেওয়া আছে। যাওয়ার আগে বর্তমান অফিসের ঠিকানা যাচাই করুন।",
    descriptionEn: "The official visa page lists 410, Farenden Street, Sunnyside, 0002, Pretoria. Verify the current office location before visiting.",
    website: "https://pretoria.mofa.gov.bd/",
    source: "https://pretoria.mofa.gov.bd/pages/static-pages/6952667f35ce18e1c05a9977",
    mapQuery: "Bangladesh High Commission 410 Farenden Street Sunnyside Pretoria South Africa"
  },
  {
    id: "africa-sudan-khartoum",
    country: "Sudan",
    city: "Khartoum",
    type: "embassy",
    nameBn: "বাংলাদেশ দূতাবাস, খার্তুম",
    nameEn: "Embassy of Bangladesh, Khartoum",
    descriptionBn: "সুদান-সংক্রান্ত কনস্যুলার সহায়তা ও যোগাযোগের জন্য সরকারি দূতাবাসের ওয়েবসাইট দেখুন।",
    descriptionEn: "Visit the official embassy website for Sudan-related consular assistance and contact information.",
    website: "https://khartoum.mofa.gov.bd/",
    source: "https://khartoum.mofa.gov.bd/",
    mapQuery: "Embassy of Bangladesh Khartoum Sudan"
  },
{
  id: "europe-austria-vienna",
  country: "Austria",
  city: "Vienna",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস ও স্থায়ী মিশন, ভিয়েনা",
  nameEn: "Embassy and Permanent Mission of Bangladesh, Vienna",
  descriptionBn: "অস্ট্রিয়ায় বাংলাদেশি নাগরিকদের কনস্যুলার ও সরকারি সেবার জন্য যোগাযোগ করুন।",
  descriptionEn: "Contact the mission for consular and official services for Bangladeshis in Austria.",
  phone: "+43 1 3681111",
  email: "mission.vienna@mofa.gov.bd",
  website: "https://vienna.mofa.gov.bd/",
  source: "https://vienna.mofa.gov.bd/pages/static-pages/695266a335ce18e1c05aa80f",
  mapQuery: "Embassy of Bangladesh Peter Jordan Strasse 50 Vienna Austria"
},
{
  id: "europe-belgium-brussels",
  country: "Belgium",
  city: "Brussels",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ব্রাসেলস",
  nameEn: "Embassy of Bangladesh, Brussels",
  descriptionBn: "বেলজিয়াম, লুক্সেমবার্গ ও ইউরোপীয় ইউনিয়ন-সংশ্লিষ্ট বিষয়ে দূতাবাসের সরকারি ওয়েবসাইট দেখুন।",
  descriptionEn: "The embassy covers Bangladesh's relations with Belgium, Luxembourg and the European Union.",
  website: "https://brussels.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Brussels Belgium"
},
{
  id: "europe-denmark-copenhagen",
  country: "Denmark",
  city: "Copenhagen",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, কোপেনহেগেন",
  nameEn: "Embassy of Bangladesh, Copenhagen",
  descriptionBn: "ডেনমার্কে বসবাসরত বাংলাদেশিদের কনস্যুলার ও অন্যান্য সরকারি সেবার তথ্য।",
  descriptionEn: "Official consular and other government service information for Bangladeshis in Denmark.",
  website: "https://copenhagen.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Copenhagen Denmark"
},
{
  id: "europe-france-paris",
  country: "France",
  city: "Paris",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, প্যারিস",
  nameEn: "Embassy of Bangladesh, Paris",
  descriptionBn: "ফ্রান্সে বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in France.",
  website: "https://paris.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Paris France"
},
{
  id: "europe-germany-berlin",
  country: "Germany",
  city: "Berlin",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, বার্লিন",
  nameEn: "Embassy of Bangladesh, Berlin",
  descriptionBn: "পাসপোর্ট, জন্মনিবন্ধন ও কনস্যুলার সেবার জন্য সরকারি নির্দেশনা ও যোগাযোগ দেখুন।",
  descriptionEn: "Check official guidance for passport, birth registration and consular services.",
  email: "consular.berlin@mofa.gov.bd",
  website: "https://berlin.mofa.gov.bd/",
  source: "https://berlin.mofa.gov.bd/pages/static-pages",
  mapQuery: "Embassy of Bangladesh Berlin Germany"
},
{
  id: "europe-greece-athens",
  country: "Greece",
  city: "Athens",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, এথেন্স",
  nameEn: "Embassy of Bangladesh, Athens",
  descriptionBn: "গ্রিসে বসবাসরত বাংলাদেশিদের কনস্যুলার ও সরকারি সেবার তথ্য।",
  descriptionEn: "Consular and official service information for Bangladeshis living in Greece.",
  website: "https://athens.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Athens Greece"
},
{
  id: "europe-italy-milan",
  country: "Italy",
  city: "Milan",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, মিলান",
  nameEn: "Consulate General of Bangladesh, Milan",
  descriptionBn: "মিলান ও সংশ্লিষ্ট অঞ্চলে কনস্যুলার সেবার সরকারি তথ্য।",
  descriptionEn: "Official consular service information for Milan and the relevant region.",
  website: "https://milan.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Consulate General of Bangladesh Milan Italy"
},
{
  id: "europe-italy-rome",
  country: "Italy",
  city: "Rome",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, রোম",
  nameEn: "Embassy of Bangladesh, Rome",
  descriptionBn: "ইতালিতে বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in Italy.",
  website: "https://rome.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Rome Italy"
},
{
  id: "europe-netherlands-hague",
  country: "Netherlands",
  city: "The Hague",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, দ্য হেগ",
  nameEn: "Embassy of Bangladesh, The Hague",
  descriptionBn: "নেদারল্যান্ডসে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবার তথ্য।",
  descriptionEn: "Official government and consular service information for Bangladeshis in the Netherlands.",
  website: "https://hague.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh The Hague Netherlands"
},
{
  id: "europe-portugal-lisbon",
  country: "Portugal",
  city: "Lisbon",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, লিসবন",
  nameEn: "Embassy of Bangladesh, Lisbon",
  descriptionBn: "পর্তুগালে বসবাসরত বাংলাদেশিদের কনস্যুলার ও অন্যান্য সরকারি সেবার তথ্য।",
  descriptionEn: "Consular and other official service information for Bangladeshis in Portugal.",
  website: "https://lisbon.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Lisbon Portugal"
},
{
  id: "europe-spain-madrid",
  country: "Spain",
  city: "Madrid",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, মাদ্রিদ",
  nameEn: "Embassy of Bangladesh, Madrid",
  descriptionBn: "স্পেনে বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in Spain.",
  website: "https://madrid.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Madrid Spain"
},
{
  id: "europe-sweden-stockholm",
  country: "Sweden",
  city: "Stockholm",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, স্টকহোম",
  nameEn: "Embassy of Bangladesh, Stockholm",
  descriptionBn: "সুইডেনে বাংলাদেশি নাগরিকদের কনস্যুলার ও সরকারি সেবার তথ্য।",
  descriptionEn: "Consular and official service information for Bangladeshis in Sweden.",
  website: "https://stockholm.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Embassy of Bangladesh Stockholm Sweden"
},
{
  id: "europe-switzerland-geneva",
  country: "Switzerland",
  city: "Geneva",
  type: "other",
  nameBn: "জাতিসংঘ ও আন্তর্জাতিক সংস্থায় বাংলাদেশের স্থায়ী মিশন, জেনেভা",
  nameEn: "Permanent Mission of Bangladesh to the UN Office and Other International Organizations, Geneva",
  descriptionBn: "জেনেভায় জাতিসংঘ ও অন্যান্য আন্তর্জাতিক সংস্থায় বাংলাদেশের স্থায়ী মিশন।",
  descriptionEn: "Bangladesh's permanent mission to the UN Office and other international organizations in Geneva.",
  website: "https://geneva.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Permanent Mission of Bangladesh Geneva Switzerland"
},
{
  id: "europe-uk-birmingham",
  country: "United Kingdom",
  city: "Birmingham",
  type: "other",
  nameBn: "বাংলাদেশ সহকারী হাইকমিশন, বার্মিংহাম",
  nameEn: "Assistant High Commission of Bangladesh, Birmingham",
  descriptionBn: "বার্মিংহাম অঞ্চলে বাংলাদেশি নাগরিকদের জন্য সহকারী হাইকমিশনের সরকারি সেবা।",
  descriptionEn: "Official Assistant High Commission services for Bangladeshis in the Birmingham region.",
  website: "https://birmingham.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Bangladesh Assistant High Commission Birmingham United Kingdom"
},
{
  id: "europe-uk-london",
  country: "United Kingdom",
  city: "London",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, লন্ডন",
  nameEn: "Bangladesh High Commission, London",
  descriptionBn: "যুক্তরাজ্যে বাংলাদেশি নাগরিকদের জন্য হাইকমিশনের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official High Commission and consular services for Bangladeshis in the United Kingdom.",
  website: "https://london.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Bangladesh High Commission London United Kingdom"
},
{
  id: "europe-uk-manchester",
  country: "United Kingdom",
  city: "Manchester",
  type: "other",
  nameBn: "বাংলাদেশ সহকারী হাইকমিশন, ম্যানচেস্টার",
  nameEn: "Assistant High Commission of Bangladesh, Manchester",
  descriptionBn: "ম্যানচেস্টার অঞ্চলে বাংলাদেশি নাগরিকদের জন্য সরকারি ও কনস্যুলার সেবার তথ্য।",
  descriptionEn: "Official and consular service information for Bangladeshis in the Manchester region.",
  website: "https://manchester.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329a35ce18e1c055f343",
  mapQuery: "Bangladesh Assistant High Commission Manchester United Kingdom"
},
{
  id: "europe-poland-warsaw",
  country: "Poland",
  city: "Warsaw",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ওয়ারশ",
  nameEn: "Embassy of Bangladesh, Warsaw",
  descriptionBn: "পোল্যান্ডে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবার তথ্য।",
  descriptionEn: "Official government and consular service information for Bangladeshis in Poland.",
  website: "https://warsaw.mofa.gov.bd/",
  source: "https://warsaw.mofa.gov.bd/pages/static-pages",
  mapQuery: "Embassy of Bangladesh Warsaw Poland"
},
{
  id: "europe-romania-bucharest",
  country: "Romania",
  city: "Bucharest",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, বুখারেস্ট",
  nameEn: "Embassy of Bangladesh, Bucharest",
  descriptionBn: "রোমানিয়ায় বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in Romania.",
  website: "https://bucharest.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032da35ce18e1c0563708",
  mapQuery: "Embassy of Bangladesh Bucharest Romania"
},
{
  id: "europe-russia-moscow",
  country: "Russia",
  city: "Moscow",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, মস্কো",
  nameEn: "Embassy of Bangladesh, Moscow",
  descriptionBn: "রাশিয়ায় বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবার তথ্য।",
  descriptionEn: "Official government and consular service information for Bangladeshis in Russia.",
  website: "https://moscow.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032da35ce18e1c0563708",
  mapQuery: "Embassy of Bangladesh Moscow Russia"
},
{
  id: "europe-turkey-ankara",
  country: "Turkey",
  city: "Ankara",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, আঙ্কারা",
  nameEn: "Embassy of Bangladesh, Ankara",
  descriptionBn: "তুরস্কে বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in Türkiye.",
  website: "https://ankara.mofa.gov.bd/",
  source: "https://ankara.mofa.gov.bd/pages/static-pages/",
  mapQuery: "Embassy of Bangladesh Ankara Turkey"
},
{
  id: "europe-turkey-istanbul",
  country: "Turkey",
  city: "Istanbul",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, ইস্তাম্বুল",
  nameEn: "Consulate General of Bangladesh, Istanbul",
  descriptionBn: "ইস্তাম্বুলে কনস্যুলার সেবা, প্রয়োজনীয় নথি ও যোগাযোগের জন্য সরকারি ওয়েবসাইট দেখুন।",
  descriptionEn: "Visit the official website for consular services, required documents and contact information in Istanbul.",
  website: "https://istanbul.mofa.gov.bd/",
  source: "https://istanbul.mofa.gov.bd/pages/static-pages",
  mapQuery: "Consulate General of Bangladesh Istanbul Turkey"
},
{
  id: "europe-uzbekistan-tashkent",
  country: "Uzbekistan",
  city: "Tashkent",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, তাশখন্দ",
  nameEn: "Embassy of Bangladesh, Tashkent",
  descriptionBn: "উজবেকিস্তানে বাংলাদেশি নাগরিকদের জন্য দূতাবাসের সরকারি সেবা ও যোগাযোগের তথ্য।",
  descriptionEn: "Official embassy services and contact information for Bangladeshis in Uzbekistan.",
  website: "https://tashkent.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032da35ce18e1c0563708",
  mapQuery: "Embassy of Bangladesh Tashkent Uzbekistan"
},

  {
  id: "asia-bhutan-thimphu",
  country: "Bhutan",
  city: "Thimphu",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, থিম্পু",
  nameEn: "Embassy of Bangladesh, Thimphu",
  descriptionBn: "ভুটানে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Bhutan.",
  website: "https://thimphu.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Embassy of Bangladesh Thimphu Bhutan"
},
{
  id: "asia-india-agartala",
  country: "India",
  city: "Agartala",
  type: "other",
  nameBn: "বাংলাদেশ সহকারী হাইকমিশন, আগরতলা",
  nameEn: "Assistant High Commission of Bangladesh, Agartala",
  descriptionBn: "আগরতলা অঞ্চলে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in the Agartala region.",
  website: "https://agartala.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Assistant High Commission Agartala India"
},
{
  id: "asia-india-chennai",
  country: "India",
  city: "Chennai",
  type: "other",
  nameBn: "বাংলাদেশ ডেপুটি হাইকমিশন, চেন্নাই",
  nameEn: "Deputy High Commission of Bangladesh, Chennai",
  descriptionBn: "চেন্নাই অঞ্চলে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in the Chennai region.",
  website: "https://chennai.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Deputy High Commission Chennai India"
},
{
  id: "asia-india-guwahati",
  country: "India",
  city: "Guwahati",
  type: "other",
  nameBn: "বাংলাদেশ সহকারী হাইকমিশন, গুয়াহাটি",
  nameEn: "Assistant High Commission of Bangladesh, Guwahati",
  descriptionBn: "গুয়াহাটি অঞ্চলে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in the Guwahati region.",
  website: "https://guwahati.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Assistant High Commission Guwahati India"
},
{
  id: "asia-india-kolkata",
  country: "India",
  city: "Kolkata",
  type: "other",
  nameBn: "বাংলাদেশ ডেপুটি হাইকমিশন, কলকাতা",
  nameEn: "Deputy High Commission of Bangladesh, Kolkata",
  descriptionBn: "কলকাতায় বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Kolkata.",
  website: "https://kolkata.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Deputy High Commission Kolkata India"
},
{
  id: "asia-india-mumbai",
  country: "India",
  city: "Mumbai",
  type: "other",
  nameBn: "বাংলাদেশ ডেপুটি হাইকমিশন, মুম্বাই",
  nameEn: "Deputy High Commission of Bangladesh, Mumbai",
  descriptionBn: "মুম্বাই অঞ্চলে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Mumbai.",
  website: "https://mumbai.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Deputy High Commission Mumbai India"
},
{
  id: "asia-india-new-delhi",
  country: "India",
  city: "New Delhi",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, নয়াদিল্লি",
  nameEn: "High Commission of Bangladesh, New Delhi",
  descriptionBn: "ভারতে বাংলাদেশের প্রধান হাইকমিশন এবং সরকারি কনস্যুলার সেবা।",
  descriptionEn: "Bangladesh's High Commission in India and its official consular services.",
  website: "https://newdelhi.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh High Commission New Delhi India"
},
{
  id: "asia-maldives-male",
  country: "Maldives",
  city: "Male",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, মালে",
  nameEn: "Embassy of Bangladesh, Male",
  descriptionBn: "মালদ্বীপে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in the Maldives.",
  website: "https://male.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Embassy of Bangladesh Male Maldives"
},
{
  id: "asia-nepal-kathmandu",
  country: "Nepal",
  city: "Kathmandu",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, কাঠমান্ডু",
  nameEn: "Embassy of Bangladesh, Kathmandu",
  descriptionBn: "নেপালে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Nepal.",
  website: "https://kathmandu.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Embassy of Bangladesh Kathmandu Nepal"
},
{
  id: "asia-pakistan-islamabad",
  country: "Pakistan",
  city: "Islamabad",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, ইসলামাবাদ",
  nameEn: "High Commission of Bangladesh, Islamabad",
  descriptionBn: "পাকিস্তানে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Pakistan.",
  website: "https://islamabad.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh High Commission Islamabad Pakistan"
},
{
  id: "asia-pakistan-karachi",
  country: "Pakistan",
  city: "Karachi",
  type: "other",
  nameBn: "বাংলাদেশ ডেপুটি হাইকমিশন, করাচি",
  nameEn: "Deputy High Commission of Bangladesh, Karachi",
  descriptionBn: "করাচিতে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Karachi.",
  website: "https://karachi.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh Deputy High Commission Karachi Pakistan"
},
{
  id: "asia-sri-lanka-colombo",
  country: "Sri Lanka",
  city: "Colombo",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, কলম্বো",
  nameEn: "High Commission of Bangladesh, Colombo",
  descriptionBn: "শ্রীলঙ্কায় বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Sri Lanka.",
  website: "https://colombo.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032af35ce18e1c056083b",
  mapQuery: "Bangladesh High Commission Colombo Sri Lanka"
},

  {
  id: "asia-brunei-bandar-seri-begawan",
  country: "Brunei",
  city: "Bandar Seri Begawan",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, বন্দর সেরি বেগাওয়ান",
  nameEn: "High Commission of Bangladesh, Bandar Seri Begawan",
  descriptionBn: "ব্রুনেইয়ে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Brunei.",
  website: "https://bandarseribegawan.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Bangladesh High Commission Bandar Seri Begawan Brunei"
},
{
  id: "asia-indonesia-jakarta",
  country: "Indonesia",
  city: "Jakarta",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, জাকার্তা",
  nameEn: "Embassy of Bangladesh, Jakarta",
  descriptionBn: "ইন্দোনেশিয়ায় বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Indonesia.",
  website: "https://jakarta.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Embassy of Bangladesh Jakarta Indonesia"
},
{
  id: "asia-malaysia-kuala-lumpur",
  country: "Malaysia",
  city: "Kuala Lumpur",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, কুয়ালালামপুর",
  nameEn: "High Commission of Bangladesh, Kuala Lumpur",
  descriptionBn: "মালয়েশিয়ায় বাংলাদেশি নাগরিকদের সরকারি, কনস্যুলার ও প্রাসঙ্গিক শ্রমিক-সেবা সংক্রান্ত তথ্য।",
  descriptionEn: "Official, consular and relevant worker-service information for Bangladeshis in Malaysia.",
  website: "https://kualalumpur.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Bangladesh High Commission Kuala Lumpur Malaysia"
},
{
  id: "asia-myanmar-sittwe",
  country: "Myanmar",
  city: "Sittwe",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট, সিত্তে",
  nameEn: "Consulate of Bangladesh, Sittwe",
  descriptionBn: "মিয়ানমারের সিত্তে শহরে বাংলাদেশ কনস্যুলেটের সরকারি তথ্য। কার্যক্রমের বর্তমান অবস্থা যাচাই করে যোগাযোগ করুন।",
  descriptionEn: "Official information for Bangladesh's consulate in Sittwe. Verify its current operating status before contacting or visiting.",
  website: "https://sittwe.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Bangladesh Consulate Sittwe Myanmar"
},
{
  id: "asia-myanmar-yangon",
  country: "Myanmar",
  city: "Yangon",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ইয়াঙ্গুন",
  nameEn: "Embassy of Bangladesh, Yangon",
  descriptionBn: "মিয়ানমারে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Myanmar.",
  website: "https://yangon.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Embassy of Bangladesh Yangon Myanmar"
},
{
  id: "asia-philippines-manila",
  country: "Philippines",
  city: "Manila",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ম্যানিলা",
  nameEn: "Embassy of Bangladesh, Manila",
  descriptionBn: "ফিলিপাইনে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in the Philippines.",
  website: "https://manila.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Embassy of Bangladesh Manila Philippines"
},
{
  id: "asia-singapore-singapore",
  country: "Singapore",
  city: "Singapore",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, সিঙ্গাপুর",
  nameEn: "High Commission of Bangladesh, Singapore",
  descriptionBn: "সিঙ্গাপুরে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Singapore.",
  website: "https://singapore.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Bangladesh High Commission Singapore"
},
{
  id: "asia-thailand-bangkok",
  country: "Thailand",
  city: "Bangkok",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ব্যাংকক",
  nameEn: "Embassy of Bangladesh, Bangkok",
  descriptionBn: "থাইল্যান্ডে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Thailand.",
  website: "https://bangkok.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Embassy of Bangladesh Bangkok Thailand"
},
{
  id: "asia-vietnam-hanoi",
  country: "Vietnam",
  city: "Hanoi",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, হ্যানয়",
  nameEn: "Embassy of Bangladesh, Hanoi",
  descriptionBn: "ভিয়েতনামে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Vietnam.",
  website: "https://hanoi.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/6940329835ce18e1c055f0f8",
  mapQuery: "Embassy of Bangladesh Hanoi Vietnam"
},

  {
  id: "americas-brazil-brasilia",
  country: "Brazil",
  city: "Brasilia",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ব্রাসিলিয়া",
  nameEn: "Embassy of Bangladesh, Brasilia",
  descriptionBn: "ব্রাজিলে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Brazil.",
  website: "https://brasilia.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Embassy of Bangladesh Brasilia Brazil"
},
{
  id: "americas-canada-ottawa",
  country: "Canada",
  city: "Ottawa",
  type: "other",
  nameBn: "বাংলাদেশ হাইকমিশন, অটোয়া",
  nameEn: "High Commission of Bangladesh, Ottawa",
  descriptionBn: "কানাডায় বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Canada.",
  website: "https://ottawa.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Bangladesh High Commission Ottawa Canada"
},
{
  id: "americas-canada-toronto",
  country: "Canada",
  city: "Toronto",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, টরন্টো",
  nameEn: "Consulate General of Bangladesh, Toronto",
  descriptionBn: "টরন্টো অঞ্চলে বাংলাদেশি নাগরিকদের কনস্যুলার সেবা।",
  descriptionEn: "Consular services for Bangladeshis in the Toronto region.",
  website: "https://toronto.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Consulate General of Bangladesh Toronto Canada"
},
{
  id: "americas-mexico-mexico-city",
  country: "Mexico",
  city: "Mexico City",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, মেক্সিকো সিটি",
  nameEn: "Embassy of Bangladesh, Mexico City",
  descriptionBn: "মেক্সিকোতে বাংলাদেশি নাগরিকদের সরকারি ও কনস্যুলার সেবা।",
  descriptionEn: "Official and consular services for Bangladeshis in Mexico.",
  website: "https://mexico.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Embassy of Bangladesh Mexico City Mexico"
},
{
  id: "americas-usa-los-angeles",
  country: "United States",
  city: "Los Angeles",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, লস অ্যাঞ্জেলেস",
  nameEn: "Consulate General of Bangladesh, Los Angeles",
  descriptionBn: "লস অ্যাঞ্জেলেস অঞ্চলে বাংলাদেশি নাগরিকদের কনস্যুলার সেবা।",
  descriptionEn: "Consular services for Bangladeshis in the Los Angeles region.",
  website: "https://losangeles.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Consulate General of Bangladesh Los Angeles USA"
},
{
  id: "americas-usa-new-york-consulate",
  country: "United States",
  city: "New York",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, নিউইয়র্ক",
  nameEn: "Consulate General of Bangladesh, New York",
  descriptionBn: "নিউইয়র্কে বাংলাদেশি নাগরিকদের কনস্যুলার ও সরকারি সেবা।",
  descriptionEn: "Consular and official services for Bangladeshis in New York.",
  website: "https://newyork.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Consulate General of Bangladesh New York USA"
},
{
  id: "americas-usa-new-york-un",
  country: "United States",
  city: "New York",
  type: "other",
  nameBn: "জাতিসংঘে বাংলাদেশের স্থায়ী মিশন, নিউইয়র্ক",
  nameEn: "Permanent Mission of Bangladesh to the United Nations, New York",
  descriptionBn: "জাতিসংঘে বাংলাদেশের স্থায়ী মিশন। এটি সাধারণ কনস্যুলেট থেকে আলাদা প্রতিষ্ঠান।",
  descriptionEn: "Bangladesh's Permanent Mission to the United Nations, separate from the general consulate.",
  website: "https://bdun.org/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Permanent Mission of Bangladesh to the United Nations New York"
},
{
  id: "americas-usa-florida",
  country: "United States",
  city: "Florida",
  type: "consulate",
  nameBn: "বাংলাদেশ কনস্যুলেট জেনারেল, ফ্লোরিডা",
  nameEn: "Consulate General of Bangladesh, Florida",
  descriptionBn: "ফ্লোরিডায় বাংলাদেশি নাগরিকদের কনস্যুলার ও সরকারি সেবা।",
  descriptionEn: "Consular and official services for Bangladeshis in Florida.",
  website: "https://florida.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Consulate General of Bangladesh Florida USA"
},
{
  id: "americas-usa-washington-dc",
  country: "United States",
  city: "Washington, DC",
  type: "embassy",
  nameBn: "বাংলাদেশ দূতাবাস, ওয়াশিংটন ডিসি",
  nameEn: "Embassy of Bangladesh, Washington, DC",
  descriptionBn: "যুক্তরাষ্ট্রে বাংলাদেশের দূতাবাস এবং সরকারি কনস্যুলার সেবা।",
  descriptionEn: "Bangladesh's embassy and official consular services in the United States.",
  website: "https://washington.mofa.gov.bd/",
  source: "https://mofa.gov.bd/pages/static-pages/694032aa35ce18e1c05602c1",
  mapQuery: "Embassy of Bangladesh Washington DC USA"
},

];

const translations = {
  bn: {
    back: "সার্ভিস পেইজ",
    eyebrow: "প্রবাসীদের জন্য সরকারি তথ্য",
    title: "দূতাবাস ও সরকারি সেবা অফিস",
    subtitle:
      "দেশের নাম লিখে দেশ নির্বাচন করুন। এরপর ওই দেশে বাংলাদেশের তালিকাভুক্ত দূতাবাস, কনস্যুলেট ও অন্যান্য সেবা অফিসের তথ্য দেখুন।",
    country: "দেশের নাম লিখুন",
    chooseCountry: "দেশের নাম লিখুন, তারপর তালিকা থেকে নির্বাচন করুন",
    noCountryMatch: "কোনো মিল থাকা দেশ পাওয়া যায়নি।",
    service: "অফিসের ধরন",
    allTypes: "সকল ধরন",
    embassy: "দূতাবাস",
    consulate: "কনস্যুলেট",
    other: "অন্যান্য সরকারি সেবা অফিস",
    results: "টি অফিস পাওয়া গেছে",
    phone: "ফোন",
    email: "ইমেইল",
    website: "সরকারি ওয়েবসাইট খুলুন",
    source: "তথ্যের উৎস",
    map: "Google Maps-এ দেখুন",
    official: "সরকারি অফিস",
    noResults: "এই দেশের অফিসের তথ্য তালিকায় নেই",
    noResultsDesc:
      "এই দেশের জন্য বর্তমানে এখানে কোনো অফিসের তথ্য যোগ করা হয়নি। সঠিক তথ্য জানতে বাংলাদেশের পররাষ্ট্র মন্ত্রণালয়ের সরকারি ওয়েবসাইট দেখুন।",
    mofa: "বাংলাদেশ পররাষ্ট্র মন্ত্রণালয়",
    reset: "অফিসের ধরন মুছুন",
    noticeTitle: "গুরুত্বপূর্ণ নোটিশ",
    notice:
      "যোগাযোগের তথ্য পরিবর্তিত হতে পারে। অফিসে যাওয়ার আগে সংশ্লিষ্ট সরকারি ওয়েবসাইটে ফোন, ইমেইল ও অবস্থান যাচাই করে নিন।",
    sourceNote:
      "শুধু এই তালিকায় যোগ করা অফিসগুলো দেখানো হয়। কোনো দেশের তথ্য এখানে না থাকলে তার অর্থ এই নয় যে সেই দেশে বাংলাদেশের কোনো অফিস নেই।",
    selectNotice: "অফিসের তথ্য দেখতে প্রথমে একটি দেশ নির্বাচন করুন।",
  },
  en: {
    back: "Services",
    eyebrow: "Official information for expatriates",
    title: "Embassies & Government Service Offices",
    subtitle:
      "Type a country name and select it to view listed Bangladesh embassies, consulates and other service offices in that country.",
    country: "Enter a country name",
    chooseCountry: "Type a country name, then select from the suggestions",
    noCountryMatch: "No matching country found.",
    service: "Office type",
    allTypes: "All types",
    embassy: "Embassy",
    consulate: "Consulate",
    other: "Other government service office",
    results: "office(s) found",
    phone: "Phone",
    email: "Email",
    website: "Open official website",
    source: "Information source",
    map: "View on Google Maps",
    official: "Government office",
    noResults: "No office information listed for this country",
    noResultsDesc:
      "No office information has been added here for this country yet. Check the official Bangladesh Ministry of Foreign Affairs website for reliable information.",
    mofa: "Bangladesh Ministry of Foreign Affairs",
    reset: "Clear office type",
    noticeTitle: "Important notice",
    notice:
      "Contact details may change. Verify phone numbers, email addresses and locations on the relevant official website before visiting.",
    sourceNote:
      "Only offices included in this list are shown. If a country has no entry here, that does not necessarily mean Bangladesh has no office there.",
    selectNotice: "Select a country to view office information.",
  },
};

function countryName(country: string, language: Language) {
  if (language === "en") return country;

  const names: Record<string, string> = {
    Afghanistan: "আফগানিস্তান",
    Australia: "অস্ট্রেলিয়া",
    Bahrain: "বাহরাইন",
    Bangladesh: "বাংলাদেশ",
    Brazil: "ব্রাজিল",
    Canada: "কানাডা",
    China: "চীন",
    Egypt: "মিশর",
    France: "ফ্রান্স",
    Germany: "জার্মানি",
    Greece: "গ্রিস",
    India: "ভারত",
    Indonesia: "ইন্দোনেশিয়া",
    Iran: "ইরান",
    Iraq: "ইরাক",
    Italy: "ইতালি",
    Japan: "জাপান",
    Jordan: "জর্ডান",
    Kuwait: "কুয়েত",
    Lebanon: "লেবানন",
    Malaysia: "মালয়েশিয়া",
    Maldives: "মালদ্বীপ",
    Mexico: "মেক্সিকো",
    Morocco: "মরক্কো",
    Myanmar: "মিয়ানমার",
    Nepal: "নেপাল",
    Netherlands: "নেদারল্যান্ডস",
    Nigeria: "নাইজেরিয়া",
    Oman: "ওমান",
    Pakistan: "পাকিস্তান",
    Philippines: "ফিলিপাইন",
    Portugal: "পর্তুগাল",
    Qatar: "কাতার",
    Russia: "রাশিয়া",
    "Saudi Arabia": "সৌদি আরব",
    Singapore: "সিঙ্গাপুর",
    "South Africa": "দক্ষিণ আফ্রিকা",
    "South Korea": "দক্ষিণ কোরিয়া",
    Spain: "স্পেন",
    "Sri Lanka": "শ্রীলঙ্কা",
    Sweden: "সুইডেন",
    Switzerland: "সুইজারল্যান্ড",
    Syria: "সিরিয়া",
    Thailand: "থাইল্যান্ড",
    Turkey: "তুরস্ক",
    "United Arab Emirates": "সংযুক্ত আরব আমিরাত",
    "United Kingdom": "যুক্তরাজ্য",
    "United States": "যুক্তরাষ্ট্র",
    Vietnam: "ভিয়েতনাম",
    Yemen: "ইয়েমেন",
    "New Zealand": "নিউজিল্যান্ড",
  };

  return names[country] ?? country;
}

export default function EmbassyPage() {
  const [language, setLanguage] = useState<Language>("bn");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const t = translations[language];

  const matchingCountries = useMemo(() => {
    const query = countryInput.trim().toLocaleLowerCase();

    if (!query || selectedCountry) return [];

    return countries
      .filter((country) => {
        const englishName = country.toLocaleLowerCase();
        const localName = countryName(country, "bn").toLocaleLowerCase();

        return (
          englishName.includes(query) ||
          localName.includes(query)
        );
      })
      .slice(0, 10);
  }, [countryInput, selectedCountry]);

  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesCountry =
        selectedCountry !== "" && office.country === selectedCountry;

      const matchesType =
        selectedType === "" || office.type === selectedType;

      return matchesCountry && matchesType;
    });
  }, [selectedCountry, selectedType]);

  function chooseCountry(country: string) {
    setSelectedCountry(country);
    setCountryInput(countryName(country, language));
    setSelectedType("");
    setShowSuggestions(false);
  }

  function resetFilters() {
    setSelectedType("");
  }

  return (
    <main
      lang={language}
      className="min-h-screen bg-slate-50 text-slate-800"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <a
            href="/services"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:text-green-700"
          >
            ← {t.back}
          </a>

          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setLanguage("bn")}
              aria-pressed={language === "bn"}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                language === "bn"
                  ? "bg-green-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              বাংলা
            </button>

            <button
              type="button"
              onClick={() => setLanguage("en")}
              aria-pressed={language === "en"}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                language === "en"
                  ? "bg-green-700 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm">
          <header className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 px-5 py-8 text-white sm:px-8 sm:py-10">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl">
              🏛️
            </div>

            <p className="mb-2 text-sm font-semibold text-green-100">
              {t.eyebrow}
            </p>

            <h1 className="text-2xl font-bold leading-tight sm:text-4xl">
              {t.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
              {t.subtitle}
            </p>
          </header>

          <div className="p-4 sm:p-8">
            <div className="relative">
              <label
                htmlFor="country-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                {t.country}
              </label>

              <input
                id="country-filter"
                type="text"
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={
                  showSuggestions && matchingCountries.length > 0
                }
                aria-controls="country-suggestions"
                value={
                  selectedCountry
                    ? countryName(selectedCountry, language)
                    : countryInput
                }
                onFocus={() => setShowSuggestions(true)}
                onChange={(event) => {
                  setCountryInput(event.target.value);
                  setSelectedCountry("");
                  setSelectedType("");
                  setShowSuggestions(true);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Escape"
                  ) {
                    setShowSuggestions(false);
                  }

                  if (
                    event.key === "Enter" &&
                    matchingCountries.length > 0
                  ) {
                    event.preventDefault();
                    chooseCountry(matchingCountries[0]);
                  }
                }}
                placeholder={t.chooseCountry}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              {showSuggestions &&
                !selectedCountry &&
                countryInput.trim() !== "" && (
                  <div
                    id="country-suggestions"
                    role="listbox"
                    className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                  >
                    {matchingCountries.length > 0 ? (
                      matchingCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => chooseCountry(country)}
                          className="block w-full rounded-lg px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-green-50 hover:text-green-800"
                        >
                          {countryName(country, language)}
                          {language === "bn" && (
                            <span className="ml-2 text-xs text-slate-400">
                              {country}
                            </span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-slate-500">
                        {t.noCountryMatch}
                      </p>
                    )}
                  </div>
                )}

              {selectedCountry && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCountry("");
                    setCountryInput("");
                    setSelectedType("");
                    setShowSuggestions(true);
                  }}
                  className="mt-2 rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
                >
                  {language === "bn" ? "অন্য দেশ নির্বাচন করুন" : "Choose another country"}
                </button>
              )}
            </div>

            {selectedCountry && (
              <div className="mt-5">
                <label
                  htmlFor="type-filter"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  {t.service}
                </label>

                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={(event) =>
                    setSelectedType(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:max-w-md"
                >
                  <option value="">{t.allTypes}</option>
                  <option value="embassy">{t.embassy}</option>
                  <option value="consulate">{t.consulate}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
            )}

            {!selectedCountry ? (
              <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5 text-sm leading-7 text-green-900">
                🌍 {t.selectNotice}
              </div>
            ) : (
              <>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                  <p className="text-sm text-slate-600" aria-live="polite">
                    <span className="font-bold text-green-800">
                      {filteredOffices.length}
                    </span>{" "}
                    {t.results}
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50"
                  >
                    {t.reset}
                  </button>
                </div>

                {filteredOffices.length > 0 ? (
                  <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {filteredOffices.map((office) => (
                      <article
                        key={office.id}
                        className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-green-200 hover:shadow-md sm:p-6"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
                            {office.type === "embassy" ? "🏛️" : "🏢"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">
                              {t.official}
                            </span>

                            <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900">
                              {language === "bn"
                                ? office.nameBn
                                : office.nameEn}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                              {office.city},{" "}
                              {countryName(office.country, language)}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-7 text-slate-600">
                          {language === "bn"
                            ? office.descriptionBn
                            : office.descriptionEn}
                        </p>

                        <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
                          {office.phone && (
                            <div>
                              <p className="mb-1 text-xs font-semibold text-slate-500">
                                {t.phone}
                              </p>

                              <a
                                href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}
                                className="break-words text-sm font-medium text-green-800 hover:underline"
                              >
                                {office.phone}
                              </a>
                            </div>
                          )}

                          {office.email && (
                            <div>
                              <p className="mb-1 text-xs font-semibold text-slate-500">
                                {t.email}
                              </p>

                              <a
                                href={`mailto:${office.email}`}
                                className="break-all text-sm font-medium text-green-800 hover:underline"
                              >
                                {office.email}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="mt-auto flex flex-col gap-2 pt-5">
                          <a
                            href={office.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-800"
                          >
                            🌐 {t.website} ↗
                          </a>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-green-300 hover:bg-green-50"
                          >
                            📍 {t.map}
                          </a>

                          <a
                            href={office.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 text-center text-xs font-medium text-slate-500 underline underline-offset-4 hover:text-green-800"
                          >
                            {t.source} ↗
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-7">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        ℹ️
                      </span>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          {t.noResults}
                        </h2>

                        <p className="mt-2 text-sm leading-7 text-slate-700">
                          {t.noResultsDesc}
                        </p>

                        <a
                          href="https://mofa.gov.bd/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                        >
                          {t.mofa} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-amber-950">
            ⚠️ {t.noticeTitle}
          </h2>

          <p className="mt-2 text-sm leading-7 text-amber-900">
            {t.notice}
          </p>
        </section>

        <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-6 text-slate-500">
          {t.sourceNote}
        </p>

        <footer className="mt-8 border-t border-slate-200 py-5 text-center">
          <a
            href="https://mofa.gov.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-green-800 hover:underline"
          >
            {t.mofa} ↗
          </a>

          <p className="mt-2 text-xs text-slate-500">
            © {new Date().getFullYear()} Probasider Ovijog
          </p>
        </footer>
      </div>
    </main>
  );
}