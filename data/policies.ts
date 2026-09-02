import { PolicySection } from "@/types";

export const policiesData: PolicySection[] = [
  {
    id: "checkin-checkout",
    title: "Check-in & Check-out Timings",
    iconName: "Clock",
    summary: "Standard schedules, early arrival requests, and late departures.",
    rules: [
      "Standard Check-in Time: 12:00 PM (Noon).",
      "Standard Check-out Time: 11:00 AM.",
      "Early check-in from 08:00 AM to 12:00 PM is subject to room availability upon arrival and may attract nominal hourly charges.",
      "Late check-out up to 02:00 PM can be extended complimentary based on availability with prior front desk notice; late departure beyond 02:00 PM is subject to a 50% day tariff.",
      "Express front desk check-in available 24/7."
    ]
  },
  {
    id: "cancellation-refund",
    title: "Cancellation & Refund Policy",
    iconName: "RefreshCw",
    summary: "Flexible booking cancellations, modifications, and refund turnaround.",
    rules: [
      "Free cancellation is allowed up to 24 hours prior to the scheduled check-in date (12:00 PM).",
      "Cancellations made within 24 hours of arrival or failure to arrive (No-Show) will incur a cancellation charge equivalent to the first night's room tariff.",
      "Refunds for prepaid bookings or advances will be processed back to the original payment source within 5 to 7 business banking days.",
      "For special festive dates, wedding blocks, and seasonal bulk bookings, custom cancellation schedules stipulated on the reservation voucher will apply."
    ]
  },
  {
    id: "id-requirements",
    title: "Government ID & Verification",
    iconName: "ShieldCheck",
    summary: "Mandatory identification documents for Indian and International guests.",
    rules: [
      "As per government regulations, every adult guest staying in the room must present a valid original government-issued photo ID at check-in.",
      "Acceptable IDs for Indian nationals: Aadhaar Card, Passport, Voter ID Card, or Driving License. (PAN Cards are not accepted as address proof).",
      "Foreign nationals and NRI guests are mandatory required to present a valid Passport along with an active Indian Tourist/Business Visa or OCI card and complete Form C registration.",
      "Digital soft copies on DigiLocker are accepted for verification."
    ]
  },
  {
    id: "child-extra-bed",
    title: "Child & Extra Occupancy Policy",
    iconName: "Users",
    summary: "Guidelines for families traveling with children and additional guests.",
    rules: [
      "Up to two children under 6 years of age can stay complimentary sharing existing parent bedding.",
      "Children aged 6 to 12 years are charged at ₹500/night for extra mattress/bedding.",
      "Guests aged 12 years and above are treated as adult occupants and require an extra rollaway bed at ₹800/night.",
      "Maximum occupancy per room category: Deluxe (2 Adults + 1 Child), Executive (2 Adults + 1 Child), Premium (2 Adults + 1 Child), Family Room (4 Adults + 1 Extra Bed)."
    ]
  },
  {
    id: "payment-billing",
    title: "Payment Methods & Tariff Billing",
    iconName: "CreditCard",
    summary: "Transparent billing, payment options, and tax compliance.",
    rules: [
      "We accept Cash, UPI (Google Pay, PhonePe, Paytm), Major Credit/Debit Cards (Visa, MasterCard, RuPay), and NEFT/IMPS corporate bank transfers.",
      "Room tariffs displayed on the website are exclusive of applicable Goods & Services Tax (GST: 12% for tariffs up to ₹7,500/night).",
      "A preliminary security deposit or card pre-authorization may be requested at check-in for incidentals and room dining service."
    ]
  },
  {
    id: "guest-conduct",
    title: "House Rules & Guest Conduct",
    iconName: "AlertCircle",
    summary: "Creating a serene, secure, and respectful environment for all residents.",
    rules: [
      "Hotel Reliance maintains 100% smoke-free guest rooms. Designated outdoor smoking zones are provided on premises.",
      "Quiet hours are observed between 10:30 PM and 07:00 AM in guest floor corridors.",
      "Visitors are welcomed in the hotel reception lobby and Kwality Restaurant. Non-registered visitors are not permitted in guest room floors after 09:00 PM for guest security.",
      "Gambling, prohibited substances, or hazardous equipment are strictly prohibited on hotel grounds."
    ]
  },
  {
    id: "pet-policy",
    title: "Pet Policy",
    iconName: "Heart",
    summary: "Hotel pet guidelines and service animals.",
    rules: [
      "In order to maintain strict allergy-free and hygienic standards for all travelers, pets are currently not permitted inside guest accommodation rooms.",
      "Certified service guide dogs assisting differently-abled guests are welcomed with prior front office notification."
    ]
  },
  {
    id: "events-banquet",
    title: "Banquet & Lawn Event Rules",
    iconName: "Calendar",
    summary: "Procedures for weddings, corporate summits, and social gatherings.",
    rules: [
      "A 30% advance deposit is required to confirm banquet hall and celebration lawn date bookings.",
      "Loud music and outdoor DJ setups on the celebration lawn must adhere to local municipal sound curfew regulations (10:00 PM).",
      "Outside catering is subject to prior management approval; our in-house Kwality Restaurant catering provides customized multi-cuisine buffets.",
      "Complimentary green rooms / dressing suites are provided with full-day wedding lawn reservations."
    ]
  }
];
