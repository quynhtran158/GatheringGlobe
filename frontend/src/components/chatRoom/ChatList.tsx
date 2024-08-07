import { Pencil, Search, Trash2 } from "lucide-react";
import { CreateRoom } from "../modals/create-room-modal";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { cn } from "@/lib/utils";
import { Room } from "@/types/room";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";

interface ChatListProps {
  userId: string | "";
  roomId: string | undefined;
  username: string;
  rooms: Room[];
  socket: Socket;
}
const ChatList: React.FC<ChatListProps> = ({
  roomId,
  userId,
  username,
  rooms,
  socket,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { onOpen } = useModal();
  const handleRoomClick = (room: Room) => {
    if (room._id && username) {
      if (roomId && roomId !== room._id) {
        socket.emit("leave_room", { room: roomId, userId });
      }
      socket.emit("join_room", { userId, username, roomId: room._id });
      navigate(`/messages/c/${room.owner?._id}/t/${room._id}`);
    }
  };

  const handleEditClick = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering room click
    onOpen("editRoom", { room }); // Assuming 'editRoom' is a valid modal type
  };

  const handleDeleteClick = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen("deleteRoom", { room });
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <aside className="w-96 bg-white flex-shrink-0 overflow-y-auto sticky top-0 pb-10 border-r border-gray-200">
      <div className="flex flex-col space-y-4 flex-grow p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <CreateRoom />
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 bg-gray-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Community Chat"
          />
        </div>
        <h2 className="font-semibold mb-2">Your Communities Chats</h2>
        {filteredRooms.map((room, index) => (
          <div
            key={index}
            onClick={() => handleRoomClick(room)}
            className={cn(
              "flex flex-col p-3 rounded-md cursor-pointer hover:bg-gray-100 transition",
              room._id === roomId
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "",
            )}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold">{room.name}</p>

                <h3 className="text-md text-gray-600">
                  {room.owner?.username || "Unknown User"}
                </h3>
              </div>
              {userId === room.owner?._id && (
                <div className="flex gap-x-2">
                  <button
                    onClick={(e) => handleEditClick(room, e)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(room, e)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatList;
