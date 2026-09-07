/**
 * Room Concurrency & Inventory Lock Service
 * Implements double-booking prevention as detailed in Section 4 of BACKEND_INTEGRATION_GUIDE.md
 * Uses an in-memory lock store with TTL, easily replaceable with a Redis client.
 */

interface LockEntry {
  bookingId: string;
  expiresAt: number;
}

class InventoryLockService {
  private inMemoryLocks: Map<string, LockEntry> = new Map();

  /**
   * Acquire a 10-minute temporary lock on a room category for a date range
   * @param roomId e.g. "deluxe-room"
   * @param dateStr e.g. "2026-09-15"
   * @param bookingId temporary booking/session identifier
   * @param ttlSeconds lock expiration in seconds (default 600s = 10 mins)
   */
  public async acquireLock(
    roomId: string,
    dateStr: string,
    bookingId: string,
    ttlSeconds: number = 600
  ): Promise<boolean> {
    const key = `hold:inventory:${roomId}:${dateStr}`;
    const now = Date.now();
    const existing = this.inMemoryLocks.get(key);

    if (existing && existing.expiresAt > now) {
      if (existing.bookingId === bookingId) {
        // Same booking session re-extending lock
        existing.expiresAt = now + ttlSeconds * 1000;
        return true;
      }
      return false; // Currently locked by another guest
    }

    this.inMemoryLocks.set(key, {
      bookingId,
      expiresAt: now + ttlSeconds * 1000
    });
    return true;
  }

  /**
   * Release lock when reservation completes or is abandoned
   */
  public async releaseLock(roomId: string, dateStr: string, bookingId: string): Promise<void> {
    const key = `hold:inventory:${roomId}:${dateStr}`;
    const existing = this.inMemoryLocks.get(key);
    if (existing && existing.bookingId === bookingId) {
      this.inMemoryLocks.delete(key);
    }
  }

  /**
   * Check if a room is locked on a date
   */
  public isLocked(roomId: string, dateStr: string): boolean {
    const key = `hold:inventory:${roomId}:${dateStr}`;
    const existing = this.inMemoryLocks.get(key);
    if (!existing) return false;
    if (existing.expiresAt <= Date.now()) {
      this.inMemoryLocks.delete(key);
      return false;
    }
    return true;
  }
}

export const lockService = new InventoryLockService();
