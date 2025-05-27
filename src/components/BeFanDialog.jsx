// components/DeleteConfirmModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogInIcon, UserRoundPenIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BeFanDialog = ({ auth, club, open, onOpenChange }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold capitalize">{`I want to be a fan of ${club}`}</DialogTitle>
          <DialogDescription className="text-base">
            {!auth?.isLoggedIn ? (
              "You must sign in to your account to choose your favorite club."
            ) : !auth.isComplete ? (
              "You must complete your profile to choose your favorite club."
            ) : (
              <span>
                You’re already with{" "}
                <span className="text-red-600 uppercase">
                  {auth.user?.favoriteClub}
                </span>
                . Changing your loyalty now? Well, traitors have access to the
                profile too! 😎
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!auth?.isLoggedIn ? (
            <Button onClick={() => navigate("/auth/signin")}>
              <LogInIcon /> Sign In
            </Button>
          ) : (
            <Button onClick={() => navigate("/profile")}>
              <UserRoundPenIcon /> Go To Profile
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BeFanDialog;
