import { Router } from "express";
import { optionalAuthenticateToken } from "../middleware/auth";
import {
  getDashboardStats,
  getBookings,
  createAdminBooking,
  updateAdminBooking,
  getRooms,
  updateRoomStatus,
  getPricing,
  updatePricing,
  createSeasonalRule,
  deleteSeasonalRule,
  getBanquetEnquiries,
  updateBanquetEnquiry,
  getRestaurantItems,
  createRestaurantItem,
  updateRestaurantItem,
  deleteRestaurantItem,
  getRestaurantEnquiries,
  updateRestaurantEnquiry,
  getCoupons,
  createCoupon,
  updateCoupon,
  getSecurityLogs,
  getHotelSettings,
  updateHotelSettings,
  getStaff,
  getNotifications,
  updateNotification,
  getCmsContent,
  updateCmsContent
} from "../controllers/admin.controller";

const router = Router();

// Middleware: optionally attach user if present
router.use(optionalAuthenticateToken);

// 1. Dashboard
router.get("/dashboard", getDashboardStats);

// 2. Bookings
router.get("/bookings", getBookings);
router.post("/bookings", createAdminBooking);
router.put("/bookings", updateAdminBooking);

// 3. Physical Rooms & Inventory
router.get("/rooms", getRooms);
router.put("/rooms", updateRoomStatus);

// 4. Pricing & Seasons
router.get("/pricing", getPricing);
router.put("/pricing", updatePricing);
router.post("/pricing/seasonal", createSeasonalRule);
router.delete("/pricing/seasonal/:id", deleteSeasonalRule);

// 5. Banquet
router.get("/banquet", getBanquetEnquiries);
router.put("/banquet", updateBanquetEnquiry);

// 6. Restaurant
router.get("/restaurant", getRestaurantItems);
router.post("/restaurant", createRestaurantItem);
router.put("/restaurant", updateRestaurantItem);
router.delete("/restaurant/:id", deleteRestaurantItem);
router.get("/restaurant/enquiries", getRestaurantEnquiries);
router.put("/restaurant/enquiries", updateRestaurantEnquiry);

// 7. Coupons & Offers
router.get("/offers", getCoupons);
router.post("/offers", createCoupon);
router.put("/offers", updateCoupon);

// 8. Security & Audit Logs
router.get("/security", getSecurityLogs);

// 9. Hotel Settings
router.get("/settings", getHotelSettings);
router.put("/settings", updateHotelSettings);

// 10. Staff Directory
router.get("/staff", getStaff);

// 11. Notification Templates
router.get("/notifications", getNotifications);
router.put("/notifications", updateNotification);

// 12. CMS Content
router.get("/content/:sectionId", getCmsContent);
router.put("/content/:sectionId", updateCmsContent);

export default router;
