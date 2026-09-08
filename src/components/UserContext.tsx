"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  users: User[];
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          // Default to the first user
          setUser(data[0]);
        }
      })
      .catch((err) => console.error("Failed to load users", err));
  }, []);

  return (
    <UserContext.Provider value={{ user, users, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
