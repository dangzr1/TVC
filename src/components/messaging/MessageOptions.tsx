import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, Archive, Flag, Ban } from "lucide-react";

interface MessageOptionsProps {
  participantId: string;
  onArchive: () => void;
}

const MessageOptions: React.FC<MessageOptionsProps> = ({
  participantId,
  onArchive,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Conversation Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // Open the profile in a new tab
            const profileUrl = `/profile/${participantId}`;
            window.open(profileUrl, "_blank");
          }}
        >
          <User className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive}>
          <Archive className="mr-2 h-4 w-4" />
          <span>Archive Conversation</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Flag className="mr-2 h-4 w-4" />
          <span>Report User</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">
          <Ban className="mr-2 h-4 w-4" />
          <span>Block User</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageOptions;
