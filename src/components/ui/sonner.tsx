"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-tds-text-primary group-[.toaster]:border-tds-border-default group-[.toaster]:shadow-tds-3 group-[.toaster]:rounded-tds-xl font-sans",
          description: "group-[.toast]:text-tds-text-secondary text-[13px]",
          actionButton:
            "group-[.toast]:bg-tds-fill-brand group-[.toast]:text-white group-[.toast]:rounded-tds-m font-semibold text-[13px]",
          cancelButton:
            "group-[.toast]:bg-tds-fill-secondary group-[.toast]:text-tds-text-secondary group-[.toast]:rounded-tds-m",
        },
      }}
      {...props}
    />
  );
}
