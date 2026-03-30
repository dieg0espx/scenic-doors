"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Calendar, ArrowLeft } from "lucide-react";
import AppointmentScheduler from "@/components/AppointmentScheduler";

export default function BookAppointmentPage() {
  const [booked, setBooked] = useState(false);
  const [bookedDate, setBookedDate] = useState("");

  return (
    <div className="min-h-screen bg-ocean-50">
      {/* Header */}
      <header className="bg-white border-b border-ocean-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://cdn.prod.website-files.com/6822c3ec52fb3e27fdf7dedc/682a4a63c3ae6524b8363ebc_Scenic%20Doors%20dark%20logo.avif"
              alt="Scenic Doors & Windows"
              width={150}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-sm text-ocean-500 hover:text-ocean-700 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {booked ? (
          <div className="bg-white rounded-2xl border border-ocean-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-3">
              Appointment Confirmed!
            </h1>
            <p className="text-ocean-500 mb-2">
              Your consultation has been scheduled for:
            </p>
            <p className="text-lg font-semibold text-ocean-800 mb-6">{bookedDate}</p>
            <p className="text-sm text-ocean-400 mb-8">
              You&apos;ll receive a confirmation email shortly with the details.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            {/* Title */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-primary-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-ocean-900 mb-2">
                Book a Free Consultation
              </h1>
              <p className="text-ocean-500 text-sm sm:text-base max-w-md mx-auto">
                Schedule a 15-minute call with our team to discuss your project, get expert advice, and explore your options.
              </p>
            </div>

            {/* Scheduler */}
            <div className="bg-white rounded-2xl border border-ocean-200 p-5 sm:p-8 shadow-sm">
              <AppointmentScheduler
                clientName=""
                showClientFields
                bookedBy="client"
                onBooked={(_id, scheduledAt) => {
                  const d = new Date(scheduledAt);
                  setBookedDate(
                    d.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) +
                    " at " +
                    d.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  );
                  setBooked(true);
                }}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
        <p className="text-xs text-ocean-400">
          Scenic Doors & Windows &middot; <a href="tel:8184276690" className="hover:text-ocean-600">818-427-6690</a>
        </p>
      </footer>
    </div>
  );
}
