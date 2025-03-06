import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Save, FileText, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserNotesProps {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  userStatus: string;
  joinDate: string;
}

const UserNotes: React.FC<UserNotesProps> = ({
  userId,
  userName,
  userEmail,
  userRole,
  userStatus,
  joinDate,
}) => {
  const { isAdmin } = useAuth();
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<
    Array<{ text: string; date: string }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  // In a real app, this would load notes from the database
  useEffect(() => {
    // Mock loading notes from database
    const loadedNotes = localStorage.getItem(`admin_notes_${userId}`);
    if (loadedNotes) {
      try {
        setSavedNotes(JSON.parse(loadedNotes));
      } catch (e) {
        console.error("Error parsing saved notes", e);
      }
    }
  }, [userId]);

  const handleSaveNote = () => {
    if (!notes.trim()) return;

    setIsSaving(true);

    // In a real app, this would save to the database
    setTimeout(() => {
      const newNote = {
        text: notes,
        date: new Date().toISOString(),
      };

      const updatedNotes = [newNote, ...savedNotes];
      setSavedNotes(updatedNotes);
      localStorage.setItem(
        `admin_notes_${userId}`,
        JSON.stringify(updatedNotes),
      );

      setNotes("");
      setIsSaving(false);

      // Show success message
      const message = document.createElement("div");
      message.className =
        "fixed top-4 right-4 p-4 rounded-md bg-green-100 text-green-800 border border-green-200 shadow-md z-50 animate-in fade-in slide-in-from-top-5 duration-300";
      message.innerHTML = `<div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>Admin note saved successfully</span>
      </div>`;
      document.body.appendChild(message);

      setTimeout(() => {
        message.classList.add("animate-out", "fade-out", "slide-out-to-top-5");
        setTimeout(() => document.body.removeChild(message), 300);
      }, 3000);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mt-4 border-purple/20">
      <CardHeader className="pb-2 bg-purple/5">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple" />
          Admin Notes for {userName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-medium mb-2">User Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Email:</span> {userEmail}
              </div>
              <div>
                <span className="font-medium">Role:</span> {userRole}
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge
                  variant="outline"
                  className={`ml-1 ${userStatus === "active" ? "bg-green-100 text-green-800" : userStatus === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Joined:</span> {joinDate}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="adminNotes"
              className="block text-sm font-medium mb-2"
            >
              Add Note
            </label>
            <Textarea
              id="adminNotes"
              placeholder="Add private admin notes about this user..."
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              onClick={handleSaveNote}
              className="mt-2 bg-purple hover:bg-purple/90"
              disabled={!notes.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </>
              )}
            </Button>
          </div>

          <div>
            <h3 className="font-medium mb-2">Previous Notes</h3>
            {savedNotes.length === 0 ? (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md border">
                <p>No notes have been added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(note.date)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserNotes;
