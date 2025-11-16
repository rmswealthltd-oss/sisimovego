// src/modules/notifications/socket.service.ts
import { getIO } from "../../socket";

export const SocketService = {
  /**
   * Emit to a specific user
   */
  emitToUser(userId: string, event: string, data: any) {
    try {
      const io = getIO();
      io.to(`user_${userId}`).emit(event, data);
    } catch (e) {}
  },

  /**
   * Emit to a trip room
   */
  emitToTrip(tripId: string, event: string, data: any) {
    try {
      const io = getIO();
      io.to(`trip_${tripId}`).emit(event, data);
    } catch (e) {}
  },

  /**
   * Emit to driver
   */
  emitToDriver(driverId: string, event: string, data: any) {
    try {
      const io = getIO();
      io.to(`driver_${driverId}`).emit(event, data);
    } catch (e) {}
  }
};
