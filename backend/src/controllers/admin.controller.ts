import { Request, Response } from "express";
import { prisma } from "../services/prisma";

// Helper to log administrative actions to PostgreSQL
async function recordAuditLog(
  adminUser: string,
  action: string,
  entity: string,
  entityId: string,
  newValue?: string,
  oldValue?: string,
  ipAddress?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        adminUser,
        action,
        entity,
        entityId,
        newValue,
        oldValue,
        ipAddress
      }
    });
  } catch (err) {
    console.error("Failed to record audit log:", err);
  }
}

// ----------------------------------------------------
// 1. DASHBOARD KPIS & OVERVIEW
// ----------------------------------------------------
export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Total physical room units
    const totalRooms = await prisma.roomUnit.count();

    // Counts by room status
    const statusGroups = await prisma.roomUnit.groupBy({
      by: ["status"],
      _count: { _all: true }
    });

    const roomCounts = {
      available: 0,
      occupied: 0,
      reserved: 0,
      cleaning: 0,
      maintenance: 0,
      outOfService: 0
    };

    statusGroups.forEach((g) => {
      const s = g.status.toUpperCase();
      if (s === "AVAILABLE") roomCounts.available = g._count._all;
      else if (s === "OCCUPIED") roomCounts.occupied = g._count._all;
      else if (s === "RESERVED") roomCounts.reserved = g._count._all;
      else if (s === "CLEANING") roomCounts.cleaning = g._count._all;
      else if (s === "MAINTENANCE") roomCounts.maintenance = g._count._all;
      else if (s === "OUT_OF_SERVICE") roomCounts.outOfService = g._count._all;
    });

    // Occupancy percentage based on occupied + reserved
    const occupiedOrReserved = roomCounts.occupied + roomCounts.reserved;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedOrReserved / totalRooms) * 100) : 0;

    // Today's arrivals (Check-in date is today)
    const todayArrivals = await prisma.booking.count({
      where: {
        checkInDate: {
          gte: today,
          lt: tomorrow
        },
        status: { in: ["CONFIRMED", "PENDING"] }
      }
    });

    // Today's departures (Check-out date is today)
    const todayDepartures = await prisma.booking.count({
      where: {
        checkOutDate: {
          gte: today,
          lt: tomorrow
        },
        status: "CHECKED_IN"
      }
    });

    // Total Revenue (Sum of totalAmount from non-cancelled bookings)
    const revenueAgg = await prisma.booking.aggregate({
      where: {
        status: { in: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] }
      },
      _sum: {
        totalAmount: true,
        paidAmount: true
      }
    });

    // Recent 6 bookings
    const recentBookings = await prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { room: true }
    });

    res.json({
      success: true,
      stats: {
        totalRooms,
        occupancyRate,
        occupiedRooms: roomCounts.occupied,
        availableRooms: roomCounts.available,
        cleaningRooms: roomCounts.cleaning,
        maintenanceRooms: roomCounts.maintenance,
        todayArrivals,
        todayDepartures,
        totalRevenue: Number(revenueAgg._sum.totalAmount || 0),
        totalPaid: Number(revenueAgg._sum.paidAmount || 0),
        roomCounts
      },
      recentBookings: recentBookings.map((b) => ({
        id: b.id,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        guestPhone: b.guestPhone,
        roomType: b.room.slug,
        roomNumber: b.roomNumber,
        checkInDate: b.checkInDate.toISOString().split("T")[0],
        checkOutDate: b.checkOutDate.toISOString().split("T")[0],
        totalAmount: Number(b.totalAmount),
        paidAmount: Number(b.paidAmount),
        bookingStatus: b.status,
        paymentStatus: b.paymentStatus,
        paymentMethod: b.paymentMethod || "PAY_AT_HOTEL",
        createdAt: b.createdAt.toISOString()
      }))
    });
  } catch (err: any) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 2. BOOKINGS & LIFECYCLE (CHECK-IN / OUT / CANCEL)
// ----------------------------------------------------
export async function getBookings(req: Request, res: Response): Promise<void> {
  try {
    const { status, roomType, search } = req.query;

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    if (roomType && roomType !== "ALL") {
      whereClause.room = { slug: String(roomType) };
    }
    if (search) {
      const q = String(search).trim();
      whereClause.OR = [
        { id: { contains: q, mode: "insensitive" } },
        { guestName: { contains: q, mode: "insensitive" } },
        { guestEmail: { contains: q, mode: "insensitive" } },
        { guestPhone: { contains: q, mode: "insensitive" } },
        { roomNumber: { contains: q, mode: "insensitive" } }
      ];
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { room: true }
    });

    res.json({
      success: true,
      total: bookings.length,
      bookings: bookings.map((b) => ({
        id: b.id,
        guestName: b.guestName,
        guestEmail: b.guestEmail,
        guestPhone: b.guestPhone,
        roomType: b.room.slug,
        roomNumber: b.roomNumber,
        checkInDate: b.checkInDate.toISOString().split("T")[0],
        checkOutDate: b.checkOutDate.toISOString().split("T")[0],
        nights: b.nights,
        adults: b.adults,
        children: b.children,
        baseAmount: Number(b.baseAmount),
        taxAmount: Number(b.taxAmount),
        discountAmount: Number(b.discountAmount),
        totalAmount: Number(b.totalAmount),
        paidAmount: Number(b.paidAmount),
        paymentStatus: b.paymentStatus,
        bookingStatus: b.status,
        paymentMethod: b.paymentMethod || "PAY_AT_HOTEL",
        transactionId: b.transactionId,
        specialRequests: b.specialRequests,
        cancellationReason: b.cancellationReason,
        refundAmount: b.refundAmount ? Number(b.refundAmount) : undefined,
        createdAt: b.createdAt.toISOString()
      }))
    });
  } catch (err: any) {
    console.error("Get bookings error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createAdminBooking(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    // Lookup room by slug
    const room = await prisma.room.findFirst({
      where: {
        OR: [{ slug: data.roomType }, { id: data.roomType }]
      }
    });

    if (!room) {
      res.status(400).json({ success: false, error: "Invalid room category specified." });
      return;
    }

    const newId = `HR-${Math.floor(10000 + Math.random() * 90000)}`;
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

    const baseAmount = Number(data.baseAmount) || Number(room.pricePerNight) * nights;
    const taxAmount = Number(data.taxAmount) || Math.round(baseAmount * 0.12 * 100) / 100;
    const discountAmount = Number(data.discountAmount) || 0;
    const totalAmount = Number(data.totalAmount) || baseAmount + taxAmount - discountAmount;
    const paidAmount = Number(data.paidAmount) || (data.paymentStatus === "SUCCESS" || data.paymentStatus === "PAID" ? totalAmount : 0);

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          id: newId,
          roomId: room.id,
          roomNumber: data.roomNumber || null,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          nights,
          adults: Number(data.adults) || 1,
          children: Number(data.children) || 0,
          baseAmount,
          taxAmount,
          discountAmount,
          totalAmount,
          paidAmount,
          status: data.bookingStatus || "CONFIRMED",
          paymentStatus: paidAmount >= totalAmount ? "PAID" : "PENDING",
          paymentMethod: data.paymentMethod || "PAY_AT_HOTEL",
          specialRequests: data.specialRequests || null
        },
        include: { room: true }
      });

      // If roomNumber specified, mark that physical room unit as RESERVED
      if (data.roomNumber) {
        await tx.roomUnit.updateMany({
          where: { roomNumber: data.roomNumber },
          data: {
            status: "RESERVED",
            assignedGuest: data.guestName,
            currentBookingId: newId,
            isOccupied: false
          }
        });
      }

      return created;
    });

    await recordAuditLog(
      adminUser,
      "CREATE_BOOKING",
      "Booking",
      booking.id,
      `Created booking for ${booking.guestName} (${room.name})`,
      undefined,
      req.ip
    );

    res.json({
      success: true,
      booking: {
        id: booking.id,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        roomType: booking.room.slug,
        roomNumber: booking.roomNumber,
        checkInDate: booking.checkInDate.toISOString().split("T")[0],
        checkOutDate: booking.checkOutDate.toISOString().split("T")[0],
        totalAmount: Number(booking.totalAmount),
        paidAmount: Number(booking.paidAmount),
        bookingStatus: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentMethod: booking.paymentMethod
      }
    });
  } catch (err: any) {
    console.error("Create booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateAdminBooking(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const { id, action, roomNumber, reason, refundAmount } = data;
    const adminUser = (req as any).user?.name || "Admin";

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { room: true }
    });

    if (!booking) {
      res.status(404).json({ success: false, error: "Booking record not found." });
      return;
    }

    const prevStatus = booking.status;

    const updated = await prisma.$transaction(async (tx) => {
      if (action === "CHECK_IN") {
        const assignedUnit = roomNumber || booking.roomNumber;
        const result = await tx.booking.update({
          where: { id },
          data: {
            status: "CHECKED_IN",
            roomNumber: assignedUnit
          },
          include: { room: true }
        });

        if (assignedUnit) {
          await tx.roomUnit.updateMany({
            where: { roomNumber: assignedUnit },
            data: {
              status: "OCCUPIED",
              isOccupied: true,
              assignedGuest: booking.guestName,
              currentBookingId: id
            }
          });
        }
        return result;
      } else if (action === "CHECK_OUT") {
        const { additionalCharges, settlePayment, paymentMethod } = data;
        const addCharge = Number(additionalCharges || 0);
        const finalTotal = Number(booking.totalAmount) + addCharge;
        const shouldSettle = settlePayment !== false; // Settle by default on check-out

        const updateData: any = {
          status: "CHECKED_OUT"
        };
        if (addCharge > 0) {
          updateData.totalAmount = finalTotal;
        }
        if (shouldSettle) {
          updateData.paidAmount = finalTotal;
          updateData.paymentStatus = "PAID";
          if (paymentMethod) {
            updateData.paymentMethod = paymentMethod;
          }
        }

        const result = await tx.booking.update({
          where: { id },
          data: updateData,
          include: { room: true }
        });

        if (booking.roomNumber) {
          await tx.roomUnit.updateMany({
            where: { roomNumber: booking.roomNumber },
            data: {
              status: "CLEANING",
              isOccupied: false,
              assignedGuest: null,
              currentBookingId: null
            }
          });
        }
        return result;
      } else if (action === "SETTLE_PAYMENT") {
        const finalTotal = Number(booking.totalAmount);
        const result = await tx.booking.update({
          where: { id },
          data: {
            paidAmount: finalTotal,
            paymentStatus: "PAID",
            paymentMethod: data.paymentMethod || booking.paymentMethod || "CASH"
          },
          include: { room: true }
        });
        return result;
      } else if (action === "CANCEL") {
        const result = await tx.booking.update({
          where: { id },
          data: {
            status: "CANCELLED",
            cancellationReason: reason || "Guest requested cancellation",
            refundAmount: refundAmount ? Number(refundAmount) : undefined,
            paymentStatus: refundAmount ? "REFUNDED" : booking.paymentStatus
          },
          include: { room: true }
        });

        if (booking.roomNumber) {
          await tx.roomUnit.updateMany({
            where: { roomNumber: booking.roomNumber },
            data: {
              status: "AVAILABLE",
              isOccupied: false,
              assignedGuest: null,
              currentBookingId: null
            }
          });
        }
        return result;
      } else {
        // General update
        const result = await tx.booking.update({
          where: { id },
          data: {
            guestName: data.guestName !== undefined ? data.guestName : booking.guestName,
            guestPhone: data.guestPhone !== undefined ? data.guestPhone : booking.guestPhone,
            guestEmail: data.guestEmail !== undefined ? data.guestEmail : booking.guestEmail,
            roomNumber: data.roomNumber !== undefined ? data.roomNumber : booking.roomNumber,
            specialRequests: data.specialRequests !== undefined ? data.specialRequests : booking.specialRequests,
            status: data.bookingStatus || booking.status
          },
          include: { room: true }
        });
        return result;
      }
    });

    await recordAuditLog(
      adminUser,
      action ? `${action}_BOOKING` : "UPDATE_BOOKING",
      "Booking",
      id,
      `Action: ${action || "UPDATE"}`,
      prevStatus,
      req.ip
    );

    res.json({
      success: true,
      booking: {
        id: updated.id,
        guestName: updated.guestName,
        guestEmail: updated.guestEmail,
        guestPhone: updated.guestPhone,
        roomType: (updated as any).room?.slug || booking.room?.slug || "deluxe",
        roomNumber: updated.roomNumber,
        checkInDate: updated.checkInDate.toISOString().split("T")[0],
        checkOutDate: updated.checkOutDate.toISOString().split("T")[0],
        nights: updated.nights,
        totalAmount: Number(updated.totalAmount),
        paidAmount: Number(updated.paidAmount),
        bookingStatus: updated.status,
        paymentStatus: updated.paymentStatus,
        paymentMethod: updated.paymentMethod
      }
    });
  } catch (err: any) {
    console.error("Update booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 3. ROOMS & PHYSICAL INVENTORY
// ----------------------------------------------------
export async function getRooms(req: Request, res: Response): Promise<void> {
  try {
    const roomUnits = await prisma.roomUnit.findMany({
      orderBy: [{ floor: "asc" }, { roomNumber: "asc" }],
      include: { room: true }
    });

    const counts = {
      available: 0,
      occupied: 0,
      reserved: 0,
      cleaning: 0,
      maintenance: 0
    };

    roomUnits.forEach((u) => {
      const s = u.status.toUpperCase();
      if (s === "AVAILABLE") counts.available++;
      else if (s === "OCCUPIED") counts.occupied++;
      else if (s === "RESERVED") counts.reserved++;
      else if (s === "CLEANING") counts.cleaning++;
      else if (s === "MAINTENANCE") counts.maintenance++;
    });

    res.json({
      success: true,
      total: roomUnits.length,
      counts,
      rooms: roomUnits.map((u) => ({
        id: u.id,
        roomNumber: u.roomNumber,
        roomType: u.room.slug,
        categoryName: u.room.name,
        floor: u.floor,
        status: u.status,
        currentBookingId: u.currentBookingId,
        assignedGuest: u.assignedGuest,
        notes: u.notes
      }))
    });
  } catch (err: any) {
    console.error("Get rooms error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateRoomStatus(req: Request, res: Response): Promise<void> {
  try {
    const { roomNumber, status, notes } = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const unit = await prisma.roomUnit.findUnique({
      where: { roomNumber }
    });

    if (!unit) {
      res.status(404).json({ success: false, error: `Room ${roomNumber} not found.` });
      return;
    }

    const prevStatus = unit.status;
    const isOccupied = status === "OCCUPIED";

    const updated = await prisma.roomUnit.update({
      where: { roomNumber },
      data: {
        status,
        isOccupied,
        notes: notes !== undefined ? notes : unit.notes,
        ...(status === "AVAILABLE" || status === "CLEANING"
          ? { assignedGuest: null, currentBookingId: null }
          : {})
      },
      include: { room: true }
    });

    await recordAuditLog(
      adminUser,
      "UPDATE_ROOM_STATUS",
      "Room",
      roomNumber,
      status,
      prevStatus,
      req.ip
    );

    res.json({
      success: true,
      room: {
        id: updated.id,
        roomNumber: updated.roomNumber,
        roomType: updated.room.slug,
        categoryName: updated.room.name,
        floor: updated.floor,
        status: updated.status,
        notes: updated.notes
      }
    });
  } catch (err: any) {
    console.error("Update room error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 4. DYNAMIC PRICING & SEASONAL RULES
// ----------------------------------------------------
export async function getPricing(req: Request, res: Response): Promise<void> {
  try {
    const roomPricing = await prisma.roomPricing.findMany();
    const seasonalRules = await prisma.seasonRule.findMany({
      orderBy: { createdAt: "desc" }
    });

    const prices: Record<string, any> = {};
    roomPricing.forEach((p) => {
      prices[p.roomSlug] = {
        base: Number(p.base),
        weekend: Number(p.weekend),
        peak: Number(p.peak),
        extraAdult: Number(p.extraAdult),
        extraBed: Number(p.extraBed)
      };
    });

    res.json({
      success: true,
      prices,
      seasonalRules: seasonalRules.map((s) => ({
        id: s.id,
        name: s.name,
        startDate: s.startDate,
        endDate: s.endDate,
        multiplier: Number(s.multiplier),
        minNights: s.minNights,
        applicableRooms: s.applicableRooms,
        isActive: s.isActive
      }))
    });
  } catch (err: any) {
    console.error("Get pricing error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updatePricing(req: Request, res: Response): Promise<void> {
  try {
    const { roomSlug, prices } = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    if (!roomSlug || !prices) {
      res.status(400).json({ success: false, error: "Missing roomSlug or prices payload." });
      return;
    }

    const updated = await prisma.roomPricing.upsert({
      where: { roomSlug },
      update: {
        base: Number(prices.base),
        weekend: Number(prices.weekend),
        peak: Number(prices.peak),
        extraAdult: Number(prices.extraAdult),
        extraBed: Number(prices.extraBed)
      },
      create: {
        roomSlug,
        base: Number(prices.base),
        weekend: Number(prices.weekend),
        peak: Number(prices.peak),
        extraAdult: Number(prices.extraAdult),
        extraBed: Number(prices.extraBed)
      }
    });

    // Also update Room.pricePerNight in the catalog
    await prisma.room.updateMany({
      where: { slug: roomSlug },
      data: { pricePerNight: Number(prices.base) }
    });

    await recordAuditLog(
      adminUser,
      "UPDATE_PRICING",
      "Pricing",
      roomSlug,
      `Base: ₹${prices.base}, Weekend: ₹${prices.weekend}`,
      undefined,
      req.ip
    );

    res.json({ success: true, updated });
  } catch (err: any) {
    console.error("Update pricing error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createSeasonalRule(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const rule = await prisma.seasonRule.create({
      data: {
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        multiplier: Number(data.multiplier) || 15.00,
        minNights: Number(data.minNights) || 1,
        applicableRooms: data.applicableRooms || "All Categories",
        isActive: true
      }
    });

    res.json({ success: true, rule });
  } catch (err: any) {
    console.error("Create seasonal rule error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteSeasonalRule(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.seasonRule.delete({ where: { id } });
    res.json({ success: true, message: "Rule deleted successfully." });
  } catch (err: any) {
    console.error("Delete seasonal rule error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 5. BANQUET ENQUIRIES
// ----------------------------------------------------
export async function getBanquetEnquiries(req: Request, res: Response): Promise<void> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: { type: "BANQUET" },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      enquiries: enquiries.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email,
        phone: e.phone,
        eventType: e.message,
        eventDate: e.date ? e.date.toISOString().split("T")[0] : undefined,
        guestCount: e.guestCount || 0,
        venue: e.venue || "AC Banquet Hall",
        budget: e.budget || "",
        status: e.status,
        notes: e.notes,
        createdAt: e.createdAt.toISOString()
      }))
    });
  } catch (err: any) {
    console.error("Get banquet enquiries error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateBanquetEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const { id, status, notes } = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {})
      }
    });

    await recordAuditLog(
      adminUser,
      "UPDATE_BANQUET_ENQUIRY",
      "BanquetEnquiry",
      id,
      `Status: ${status}`,
      undefined,
      req.ip
    );

    res.json({ success: true, enquiry: updated });
  } catch (err: any) {
    console.error("Update banquet enquiry error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 6. RESTAURANT MENU & TABLE ENQUIRIES
// ----------------------------------------------------
export async function getRestaurantItems(req: Request, res: Response): Promise<void> {
  try {
    const menuItems = await prisma.menuItem.findMany({
      orderBy: { createdAt: "asc" }
    });

    res.json({
      success: true,
      menuItems: menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        description: m.description,
        price: Number(m.price),
        image: m.image,
        isVeg: m.isVeg,
        isAvailable: m.isAvailable,
        isFeatured: m.isFeatured
      }))
    });
  } catch (err: any) {
    console.error("Get restaurant items error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createRestaurantItem(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const item = await prisma.menuItem.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        price: Number(data.price),
        image: data.image || "/images/restaurant/dum-biryani.png",
        isVeg: Boolean(data.isVeg),
        isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
        isFeatured: Boolean(data.isFeatured)
      }
    });

    await recordAuditLog(
      adminUser,
      "CREATE_MENU_ITEM",
      "Restaurant",
      item.id,
      `Added: ${item.name}`,
      undefined,
      req.ip
    );

    res.json({ success: true, item });
  } catch (err: any) {
    console.error("Create restaurant item error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateRestaurantItem(req: Request, res: Response): Promise<void> {
  try {
    const { id, isAvailable, price, name, description } = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const updated = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(isAvailable !== undefined ? { isAvailable: Boolean(isAvailable) } : {}),
        ...(price !== undefined ? { price: Number(price) } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {})
      }
    });

    await recordAuditLog(
      adminUser,
      "UPDATE_MENU_ITEM",
      "Restaurant",
      id,
      `Updated ${updated.name}`,
      undefined,
      req.ip
    );

    res.json({ success: true, item: updated });
  } catch (err: any) {
    console.error("Update restaurant item error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteRestaurantItem(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({ where: { id } });
    res.json({ success: true, message: "Item deleted." });
  } catch (err: any) {
    console.error("Delete restaurant item error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getRestaurantEnquiries(req: Request, res: Response): Promise<void> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: { type: "RESTAURANT_TABLE" },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      enquiries: enquiries.map((e) => ({
        id: e.id,
        name: e.name,
        phone: e.phone,
        guests: e.guestCount || 2,
        date: e.date ? e.date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        time: e.time || "08:00 PM",
        status: e.status
      }))
    });
  } catch (err: any) {
    console.error("Get restaurant enquiries error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateRestaurantEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const { id, status } = req.body;
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, enquiry: updated });
  } catch (err: any) {
    console.error("Update table enquiry error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 7. COUPONS & PROMOTIONS
// ----------------------------------------------------
export async function getCoupons(req: Request, res: Response): Promise<void> {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        minBookingAmount: Number(c.minBookingAmount),
        maxDiscount: Number(c.maxDiscount),
        startDate: c.startDate.toISOString().split("T")[0],
        endDate: c.endDate.toISOString().split("T")[0],
        usageLimit: c.usageLimit,
        usedCount: c.usedCount,
        isActive: c.isActive
      }))
    });
  } catch (err: any) {
    console.error("Get coupons error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createCoupon(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const created = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType || "PERCENTAGE",
        discountValue: Number(data.discountValue),
        minBookingAmount: Number(data.minBookingAmount) || 0,
        maxDiscount: Number(data.maxDiscount) || 0,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        usageLimit: Number(data.usageLimit) || 100,
        isActive: true
      }
    });

    await recordAuditLog(
      adminUser,
      "CREATE_COUPON",
      "Coupon",
      created.id,
      `Code: ${created.code}`,
      undefined,
      req.ip
    );

    res.json({ success: true, coupon: created });
  } catch (err: any) {
    console.error("Create coupon error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateCoupon(req: Request, res: Response): Promise<void> {
  try {
    const { id, isActive } = req.body;
    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: Boolean(isActive) }
    });

    res.json({ success: true, coupon: updated });
  } catch (err: any) {
    console.error("Update coupon error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 8. SECURITY & AUDIT LOGS
// ----------------------------------------------------
export async function getSecurityLogs(req: Request, res: Response): Promise<void> {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 100,
      orderBy: { timestamp: "desc" }
    });

    res.json({
      success: true,
      auditLogs: logs.map((l) => ({
        id: l.id,
        timestamp: l.timestamp.toISOString(),
        adminUser: l.adminUser,
        action: l.action,
        entity: l.entity,
        entityId: l.entityId,
        oldValue: l.oldValue,
        newValue: l.newValue,
        ipAddress: l.ipAddress
      }))
    });
  } catch (err: any) {
    console.error("Get security logs error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 9. HOTEL SETTINGS
// ----------------------------------------------------
export async function getHotelSettings(req: Request, res: Response): Promise<void> {
  try {
    let settings = await prisma.hotelSetting.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await prisma.hotelSetting.create({
        data: {
          id: "default",
          hotelName: "Hotel Reliance",
          tagline: "Experience Premium Hospitality in Bokaro",
          description: "Hotel Reliance is a premier 45+ room property in Bokaro Steel City.",
          phones: ["+91 92629 97777", "+91 92628 27777"],
          emails: ["reservation@hotelreliance.com"],
          whatsappNumber: "919262997777",
          fullAddress: "Plot No: NIHP-1, West Side of Co-Operative Colony, Bokaro Steel City, Jharkhand - 827001"
        }
      });
    }

    res.json({
      success: true,
      hotelSettings: {
        hotelName: settings.hotelName,
        tagline: settings.tagline,
        description: settings.description,
        phones: settings.phones,
        emails: settings.emails,
        whatsappNumber: settings.whatsappNumber,
        address: {
          plotNo: settings.plotNo,
          street: settings.street,
          city: settings.city,
          state: settings.state,
          pincode: settings.pincode,
          fullAddress: settings.fullAddress
        },
        checkInTime: settings.checkInTime,
        checkOutTime: settings.checkOutTime,
        cancellationWindowHours: settings.cancellationWindowHours,
        freeCancellationAllowed: settings.freeCancellationAllowed,
        googleMapUrl: settings.googleMapUrl,
        updatedAt: settings.updatedAt.toISOString()
      }
    });
  } catch (err: any) {
    console.error("Get settings error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateHotelSettings(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    const adminUser = (req as any).user?.name || "Admin";

    const updated = await prisma.hotelSetting.upsert({
      where: { id: "default" },
      update: {
        hotelName: data.hotelName,
        tagline: data.tagline,
        description: data.description,
        phones: data.phones,
        emails: data.emails,
        whatsappNumber: data.whatsappNumber,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        cancellationWindowHours: Number(data.cancellationWindowHours) || 24,
        freeCancellationAllowed: Boolean(data.freeCancellationAllowed),
        googleMapUrl: data.googleMapUrl,
        ...(data.address
          ? {
              plotNo: data.address.plotNo,
              street: data.address.street,
              city: data.address.city,
              state: data.address.state,
              pincode: data.address.pincode,
              fullAddress: data.address.fullAddress
            }
          : {})
      },
      create: {
        id: "default",
        hotelName: data.hotelName || "Hotel Reliance",
        tagline: data.tagline || "",
        description: data.description || "",
        phones: data.phones || [],
        emails: data.emails || [],
        whatsappNumber: data.whatsappNumber || "919262997777",
        fullAddress: data.address?.fullAddress || ""
      }
    });

    await recordAuditLog(
      adminUser,
      "UPDATE_HOTEL_SETTINGS",
      "Settings",
      "default",
      `Hotel settings updated`,
      undefined,
      req.ip
    );

    res.json({ success: true, hotelSettings: updated });
  } catch (err: any) {
    console.error("Update settings error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 10. STAFF DIRECTORY
// ----------------------------------------------------
export async function getStaff(req: Request, res: Response): Promise<void> {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { order: "asc" }
    });

    res.json({
      success: true,
      staff: staff.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        experience: s.experience,
        bio: s.bio,
        image: s.image,
        phone: s.phone,
        email: s.email,
        isActive: s.isActive
      }))
    });
  } catch (err: any) {
    console.error("Get staff error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 11. NOTIFICATIONS TEMPLATES
// ----------------------------------------------------
export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const templates = await prisma.notificationTemplate.findMany();
    const map: Record<string, any> = {};
    templates.forEach((t) => {
      map[t.id] = {
        name: t.name,
        channel: t.channel,
        subject: t.subject,
        body: t.body,
        updatedAt: t.updatedAt.toISOString()
      };
    });

    res.json({ success: true, templates: map });
  } catch (err: any) {
    console.error("Get notifications error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateNotification(req: Request, res: Response): Promise<void> {
  try {
    const { id, body, subject } = req.body;
    const updated = await prisma.notificationTemplate.upsert({
      where: { id },
      update: {
        ...(body ? { body } : {}),
        ...(subject ? { subject } : {})
      },
      create: {
        id,
        name: id,
        channel: id.includes("whatsapp") ? "WHATSAPP" : "EMAIL",
        body: body || "",
        subject: subject || ""
      }
    });

    res.json({ success: true, template: updated });
  } catch (err: any) {
    console.error("Update notification error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ----------------------------------------------------
// 12. CMS CONTENT
// ----------------------------------------------------
export async function getCmsContent(req: Request, res: Response): Promise<void> {
  try {
    const { sectionId } = req.params;
    const content = await prisma.cmsContent.findUnique({
      where: { id: sectionId }
    });

    res.json({
      success: true,
      content: content ? content.data : null
    });
  } catch (err: any) {
    console.error("Get CMS error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function updateCmsContent(req: Request, res: Response): Promise<void> {
  try {
    const { sectionId } = req.params;
    const data = req.body;

    const updated = await prisma.cmsContent.upsert({
      where: { id: sectionId },
      update: { data },
      create: { id: sectionId, data }
    });

    res.json({ success: true, content: updated.data });
  } catch (err: any) {
    console.error("Update CMS error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
