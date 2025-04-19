import { Bell, Info, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/contexts/NotificationContext";

export function NotificationDropdown() {
  const { notifications, loading, markAsViewed } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    markAsViewed(notification);
    navigate('/profile');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6 text-[#3a4b3c] hover:text-[#6cbc8b] transition-colors duration-200" />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center">
              <span className="animate-ping absolute h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
              <Badge className="relative h-3 w-3 rounded-full bg-red-500" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 shadow-lg rounded-xl border-[#6cbc8b]/20" align="end">
        <div className="bg-[#3a4b3c]/5 p-3 border-b border-[#6cbc8b]/10">
          <h3 className="font-semibold text-[#3a4b3c] flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Notifications
          </h3>
        </div>
        <div className="max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="w-8 h-8 animate-spin rounded-full border-3 border-[#6cbc8b] border-t-transparent mx-auto" />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div 
                key={index} 
                className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-[#6cbc8b]/5 transition-colors duration-200"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#3a4b3c] leading-snug">
                      {notification.rejectionReason}
                    </p>
                    <p className="text-xs text-[#3a4b3c]/60 mt-1.5 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3a4b3c]/30" />
                      {new Date(notification.rejectedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-[#3a4b3c]/60">
              <Info className="h-8 w-8 mx-auto mb-3 text-[#6cbc8b]" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm mt-1">No new notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}