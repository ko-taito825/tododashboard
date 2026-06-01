"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session } = useSession();
  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-3">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt="avatar"
          width={28}
          height={28}
          className="rounded-full"
        />
      )}
      <span className="text-xs text-gray-400 hidden sm:block">
        {session.user.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-xs text-gray-500 hover:text-accent border border-gray-800 hover:border-accent/50 px-3 py-1.5 rounded-lg transition-colors"
      >
        ログアウト
      </button>
    </div>
  );
}
