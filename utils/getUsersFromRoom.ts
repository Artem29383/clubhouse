export const getUsersFromRoom = (rooms: Record<string, any>, roomId: number) => Object.values(rooms)
  .filter((obj) => obj.roomId === roomId)
  .map((obj) => ({ ...obj.user, roomId: Number(roomId) }));
