import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, MapPin, MessageCircle, Settings } from "lucide-react";

const navItems = [
  { to: "", label: "Home", icon: Home },
  { to: "guide", label: "Guide", icon: BookOpen },
  { to: "area", label: "Explore", icon: MapPin },
  { to: "requests", label: "Requests", icon: MessageCircle },
  { to: "settings", label: "More", icon: Settings },
];

export const GuestBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-card flex items-center justify-around text-xs shadow-lg">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === ""}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive 
                ? "text-primary font-semibold" 
                : "text-muted-foreground hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-5 w-5 mb-1" />
          <span className="text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};