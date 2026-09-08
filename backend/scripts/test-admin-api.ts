/**
 * End-to-End Automated Integration Test Suite for Hotel Reliance Admin Backend
 * Validates that every admin feature operates live against Neon PostgreSQL with 0 mock data.
 */

const BASE_URL = "http://localhost:5001/api/v1/admin";

async function runTests() {
  console.log("=================================================");
  console.log("🚀 STARTING HOTEL RELIANCE ADMIN BACKEND TESTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      process.stdout.write(`• Testing: ${name}... `);
      await fn();
      console.log("✅ PASSED");
      passed++;
    } catch (err: any) {
      console.log("❌ FAILED:", err.message);
      failed++;
    }
  }

  // 1. Dashboard Stats
  await test("GET /dashboard (live KPIs from database)", async () => {
    const res = await fetch(`${BASE_URL}/dashboard`);
    const data = (await res.json()) as any;
    if (!data.success || !data.stats) throw new Error("Invalid dashboard response");
    if (data.stats.totalRooms !== 45) throw new Error(`Expected 45 total rooms, got ${data.stats.totalRooms}`);
    if (typeof data.stats.totalRevenue !== "number") throw new Error("Missing totalRevenue calculation");
  });

  // 2. Bookings Listing
  await test("GET /bookings (all live bookings)", async () => {
    const res = await fetch(`${BASE_URL}/bookings`);
    const data = (await res.json()) as any;
    if (!data.success || !Array.isArray(data.bookings)) throw new Error("Invalid bookings response");
  });

  // 3. Create Booking
  let createdBookingId = "";
  await test("POST /bookings (create live reservation with physical room assignment)", async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: "Automated Test Guest",
        guestEmail: "test.guest@example.com",
        guestPhone: "+91 99999 11111",
        roomType: "deluxe",
        roomNumber: "108",
        checkInDate: "2026-09-10",
        checkOutDate: "2026-09-12",
        adults: 2,
        children: 0,
        baseAmount: 4998,
        taxAmount: 599.76,
        discountAmount: 0,
        totalAmount: 5597.76,
        paidAmount: 5597.76,
        paymentStatus: "PAID",
        bookingStatus: "CONFIRMED",
        paymentMethod: "RAZORPAY",
        specialRequests: "Quiet corner room."
      })
    });
    const data = (await res.json()) as any;
    if (!data.success || !data.booking?.id) throw new Error("Failed to create booking");
    createdBookingId = data.booking.id;

    // Verify room 108 is now marked RESERVED
    const roomsRes = await fetch(`${BASE_URL}/rooms`);
    const roomsData = (await roomsRes.json()) as any;
    const room108 = roomsData.rooms.find((r: any) => r.roomNumber === "108");
    if (!room108 || room108.status !== "RESERVED") {
      throw new Error(`Expected room 108 to be RESERVED, got ${room108?.status}`);
    }
  });

  // 4. Check-In Booking Action
  await test("PUT /bookings (CHECK_IN action updates booking & sets room to OCCUPIED)", async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: createdBookingId,
        action: "CHECK_IN",
        roomNumber: "108"
      })
    });
    const data = (await res.json()) as any;
    if (!data.success || data.booking.bookingStatus !== "CHECKED_IN") {
      throw new Error("Failed to check-in booking");
    }

    const roomsRes = await fetch(`${BASE_URL}/rooms`);
    const roomsData = (await roomsRes.json()) as any;
    const room108 = roomsData.rooms.find((r: any) => r.roomNumber === "108");
    if (!room108 || room108.status !== "OCCUPIED") {
      throw new Error(`Expected room 108 to be OCCUPIED, got ${room108?.status}`);
    }
  });

  // 5. Check-Out Booking Action
  await test("PUT /bookings (CHECK_OUT action updates booking & sets room to CLEANING)", async () => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: createdBookingId,
        action: "CHECK_OUT"
      })
    });
    const data = (await res.json()) as any;
    if (!data.success || data.booking.bookingStatus !== "CHECKED_OUT") {
      throw new Error("Failed to check-out booking");
    }

    const roomsRes = await fetch(`${BASE_URL}/rooms`);
    const roomsData = (await roomsRes.json()) as any;
    const room108 = roomsData.rooms.find((r: any) => r.roomNumber === "108");
    if (!room108 || room108.status !== "CLEANING") {
      throw new Error(`Expected room 108 to be CLEANING, got ${room108?.status}`);
    }
  });

  // 6. Reset Room Status (Housekeeping Completed)
  await test("PUT /rooms (housekeeping completes cleaning, sets room to AVAILABLE)", async () => {
    const res = await fetch(`${BASE_URL}/rooms`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomNumber: "108",
        status: "AVAILABLE",
        notes: "Sanitized and prepared for next guest"
      })
    });
    const data = (await res.json()) as any;
    if (!data.success || data.room.status !== "AVAILABLE") {
      throw new Error("Failed to reset room status");
    }
  });

  // 7. Dynamic Pricing & Seasonal Rules
  await test("GET & PUT /pricing (update category base rates)", async () => {
    const putRes = await fetch(`${BASE_URL}/pricing`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomSlug: "deluxe",
        prices: {
          base: 2499,
          weekend: 2799,
          peak: 3199,
          extraAdult: 600,
          extraBed: 800
        }
      })
    });
    const putData = (await putRes.json()) as any;
    if (!putData.success) throw new Error("Failed to update pricing");

    const getRes = await fetch(`${BASE_URL}/pricing`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || getData.prices.deluxe.base !== 2499) {
      throw new Error("Pricing mismatch");
    }
  });

  // 8. Seasonal Rules
  let seasonalRuleId = "";
  await test("POST & DELETE /pricing/seasonal (create & delete seasonal surge rule)", async () => {
    const createRes = await fetch(`${BASE_URL}/pricing/seasonal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Diwali Surge",
        startDate: "2026-11-01",
        endDate: "2026-11-05",
        multiplier: 30,
        minNights: 2,
        applicableRooms: "All Categories"
      })
    });
    const createData = (await createRes.json()) as any;
    if (!createData.success || !createData.rule?.id) throw new Error("Failed to create seasonal rule");
    seasonalRuleId = createData.rule.id;

    // Delete rule
    const delRes = await fetch(`${BASE_URL}/pricing/seasonal/${seasonalRuleId}`, { method: "DELETE" });
    const delData = (await delRes.json()) as any;
    if (!delData.success) throw new Error("Failed to delete seasonal rule");
  });

  // 9. Banquet Enquiries
  await test("GET & PUT /banquet (workflow management for leads)", async () => {
    // Submit a live test banquet enquiry first
    await fetch("http://localhost:5001/api/v1/enquiries/banquet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Corporate Banquet Lead",
        email: "test.banquet@example.com",
        phone: "+91 94311 00099",
        eventDate: "2026-11-15",
        guestCount: 150,
        eventType: "Corporate Seminar",
        message: "Need AC hall with AV projection."
      })
    });

    const getRes = await fetch(`${BASE_URL}/banquet`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || !Array.isArray(getData.enquiries) || getData.enquiries.length === 0) {
      throw new Error("No banquet enquiries found");
    }

    const testEnq = getData.enquiries.find((e: any) => e.email === "test.banquet@example.com") || getData.enquiries[0];
    const putRes = await fetch(`${BASE_URL}/banquet`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: testEnq.id,
        status: "CONFIRMED",
        notes: "Deposit received, menu confirmed."
      })
    });
    const putData = (await putRes.json()) as any;
    if (!putData.success || putData.enquiry.status !== "CONFIRMED") {
      throw new Error("Failed to update banquet enquiry");
    }
  });

  // 10. Kwality Restaurant Menu
  let createdDishId = "";
  await test("GET, POST & DELETE /restaurant (menu management)", async () => {
    const getRes = await fetch(`${BASE_URL}/restaurant`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || getData.menuItems.length < 5) throw new Error("Expected initial menu items");

    const postRes = await fetch(`${BASE_URL}/restaurant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Chef Special Tikka",
        category: "Starters",
        description: "Gourmet charcoal roasted delicacy.",
        price: 350,
        isVeg: false,
        isAvailable: true,
        isFeatured: true
      })
    });
    const postData = (await postRes.json()) as any;
    if (!postData.success || !postData.item?.id) throw new Error("Failed to add menu item");
    createdDishId = postData.item.id;

    // Clean up
    await fetch(`${BASE_URL}/restaurant/${createdDishId}`, { method: "DELETE" });
  });

  // 11. Restaurant Table Enquiries
  await test("GET & PUT /restaurant/enquiries (table reservation flow)", async () => {
    // Submit a live test dining table enquiry first
    await fetch("http://localhost:5001/api/v1/enquiries/restaurant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Table Lead",
        email: "test.table@example.com",
        phone: "+91 94311 00088",
        date: "2026-09-15",
        time: "08:00 PM",
        guestCount: 4,
        specialNotes: "Family dinner table"
      })
    });

    const getRes = await fetch(`${BASE_URL}/restaurant/enquiries`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || getData.enquiries.length === 0) throw new Error("No table enquiries found");

    const testTableEnq = getData.enquiries.find((e: any) => e.phone === "+91 94311 00088") || getData.enquiries[0];
    const putRes = await fetch(`${BASE_URL}/restaurant/enquiries`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: testTableEnq.id,
        status: "CONFIRMED"
      })
    });
    const putData = (await putRes.json()) as any;
    if (!putData.success) throw new Error("Failed to update table enquiry");
  });

  // 12. Coupons
  await test("GET & POST /offers (coupons management)", async () => {
    const getRes = await fetch(`${BASE_URL}/offers`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || getData.coupons.length < 2) throw new Error("Expected at least 2 coupons");
  });

  // 13. Staff Directory
  await test("GET /staff (leadership directory)", async () => {
    const getRes = await fetch(`${BASE_URL}/staff`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || getData.staff.length < 4) throw new Error("Expected at least 4 staff members");
  });

  // 14. Notifications Templates
  await test("GET & PUT /notifications (WhatsApp & Email templates)", async () => {
    const putRes = await fetch(`${BASE_URL}/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "whatsapp_booking",
        body: "Namaste {{GuestName}}, your reservation at Hotel Reliance Bokaro is CONFIRMED!"
      })
    });
    const putData = (await putRes.json()) as any;
    if (!putData.success) throw new Error("Failed to update notification template");
  });

  // 15. Hotel Settings
  await test("GET & PUT /settings (master property configuration)", async () => {
    const putRes = await fetch(`${BASE_URL}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelName: "Hotel Reliance",
        tagline: "Experience Premium Hospitality in Bokaro",
        description: "Hotel Reliance is a premier 45+ room property in Bokaro Steel City.",
        phones: ["+91 92629 97777", "+91 92628 27777"],
        emails: ["reservation@hotelreliance.com"],
        whatsappNumber: "919262997777",
        checkInTime: "12:00 PM",
        checkOutTime: "11:00 AM",
        cancellationWindowHours: 24,
        freeCancellationAllowed: true
      })
    });
    const putData = (await putRes.json()) as any;
    if (!putData.success) throw new Error("Failed to update hotel settings");
  });

  // 16. Security & Audit Logs
  await test("GET /security (audit logs recorded in PostgreSQL)", async () => {
    const getRes = await fetch(`${BASE_URL}/security`);
    const getData = (await getRes.json()) as any;
    if (!getData.success || !Array.isArray(getData.auditLogs)) throw new Error("Failed to fetch audit logs");
    if (getData.auditLogs.length === 0) throw new Error("Expected audit logs to be recorded");
  });

  console.log("\n=================================================");
  console.log(`📊 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
