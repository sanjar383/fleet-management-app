"use client";

import React from "react";

export default function DeleteButton({ message = "Haqiqatan ham o'chirmoqchimisiz?" }: { message?: string }) {
  return (
    <button 
      type="submit" 
      onClick={(e) => {
        if (!window.confirm(message)) {
          e.preventDefault();
        }
      }}
      style={{ 
        background: "rgba(245, 101, 101, 0.1)", 
        color: "#f56565", 
        border: "1px solid rgba(245, 101, 101, 0.2)", 
        padding: "0.5rem 1rem", 
        borderRadius: "6px", 
        cursor: "pointer", 
        fontSize: "0.85rem", 
        fontWeight: "bold" 
      }}
    >
      O'chirish
    </button>
  );
}
