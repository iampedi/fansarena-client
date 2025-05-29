// src/pages/profile/DeleteUserDialog.jsx
import { API_URL } from "@/config/api";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// UI Imports
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

const DeleteUserDialog = ({ open, onOpenChange }) => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/users/${user._id}`);
      logOut();
      navigate("/");
      toast.success("User Deleted Successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to delete user");
      console.error("🔥 DELETE USER ERROR:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold capitalize">
            Dear {user?.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            Are you sure you want to{" "}
            <span className="text-red-600">delete</span> your account?
            <br className="hidden md:inline" />
            Your data will be{" "}
            <span className="text-red-600">removed permanently</span>, and your
            supported club{" "}
            <span className="text-red-600">will lose one fan</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No, Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={handleDelete}>
            <Trash2Icon /> Yes, I'm Sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
