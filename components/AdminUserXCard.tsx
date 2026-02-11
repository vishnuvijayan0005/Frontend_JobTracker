"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldX,
  Eye,
  Trash2,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
export type UserStatus = "active" | "blocked";

export interface AdminUser {
  _id: string; // userId
  userId: {
    email: string;
    isblocked:boolean
  };

  role: "user" | "company" | "admin";
  status: UserStatus;
  createdAt: string;

  firstName: string;
  lastName: string;
  headline?: string;
  phone?: string;
  photoUrl?: string;

  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

interface Props {
  user: AdminUser;
  onView: (id: string) => void;
  onBlock?: (id: string) => void;
  onUnblock?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function AdminUserCard({
  user,
  onView,
  onBlock,
  onUnblock,
//   onDelete,
}: Props) {
  const fullName = `${user.firstName} ${user.lastName}`;

  const location = user.location
    ? [user.location.city, user.location.state, user.location.country]
        .filter(Boolean)
        .join(", ")
    : null;


  return (
    <div className="bg-white border rounded-2xl p-5 sm:p-6 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-slate-500" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {fullName}
            </h3>

            {user.headline && (
              <p className="text-sm text-slate-500 truncate">{user.headline}</p>
            )}

            <p className="text-xs text-slate-400 capitalize mt-1">
              Role: {user.role}
            </p>

            {location && (
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        {user.userId.isblocked === false ? (
          <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">
            <ShieldX className="h-4 w-4" />
            Blocked
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-slate-100" />

      {/* Contact */}
      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <Mail className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="break-all">{user.userId.email}</span>
        </div>

        {user.phone && (
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{user.phone}</span>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mt-6">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(user._id)}
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>

        {user.userId.isblocked === false && onBlock && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onBlock(user._id)}
            className="gap-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            <UserX className="h-4 w-4" />
            Block
          </Button>
        )}

        {user.userId.isblocked === true && onUnblock && (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onUnblock(user._id)}
          >
            Unblock
          </Button>
        )}

        {/* {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(user._id)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )} */}
      </div>
    </div>
  );
}
