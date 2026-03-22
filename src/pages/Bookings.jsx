import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import ServiceStep from "../components/ServiceStep";
import DateStep from "../components/DateStep";
import TimeStep from "../components/TimeStep";
import UserDetailsStep from "../components/UserDetailsStep";
import { db } from "../firebase/config";

const Booking = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slotId, setSlotId] = useState("");

  const SLOT_CAPACITY = 3;

  const generateSlotId = ({ selectedService, selectedDate, selectedTime }) => {
    const cleanTime = selectedTime.replace(":", "");
    return `${selectedService.id}_${selectedDate}_${cleanTime}`;
  };

  const loadBookedSlots = async (selectedDate, selectedService) => {
    const dailyAppointmentsQuery = query(
      collection(db, "appointments"),
      where("date", "==", selectedDate)
    );

    const snapshot = await getDocs(dailyAppointmentsQuery);
    const counters = {};

    snapshot.forEach((docSnapshot) => {
      const appointment = docSnapshot.data();
      const sameService = appointment?.service?.id === selectedService.id;
      const activeStatus = appointment?.status !== "denied";
      if (!sameService || !activeStatus) {
        return;
      }

      counters[appointment.time] = (counters[appointment.time] || 0) + 1;
    });

    setBookedSlots(counters);
  };

  const handleServiceNext = (selectedService) => {
    setService(selectedService);
    setStep(2);
  };

  const handleDateNext = async (selectedDate) => {
    setError("");

    try {
      await loadBookedSlots(selectedDate, service);
      setDate(selectedDate);
      setStep(3);
    } catch (loadError) {
      setError(loadError.message || "Failed to load available slots.");
    }
  };

  const handleTimeNext = (selectedTime) => {
    setTime(selectedTime);
    setStep(4);
  };

  const handleUserDetailsNext = async (details) => {
    setSaving(true);
    setError("");

    try {
      const generatedSlotId = generateSlotId({
        selectedService: service,
        selectedDate: date,
        selectedTime: time,
      });

      const appointment = {
        service,
        date,
        time,
        userDetails: details,
        slotId: generatedSlotId,
        status: "pending",
        reminderStatus: "not_sent",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "appointments"), appointment);

      // Update slot occupancy
      const slotRef = doc(db, "slots", generatedSlotId);
      const currentCount = (bookedSlots[time] || 0) + 1;
      await setDoc(slotRef, {
        serviceId: service.id,
        date,
        time,
        occupancy: currentCount,
        capacity: SLOT_CAPACITY,
        isFull: currentCount >= SLOT_CAPACITY,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setSlotId(generatedSlotId);
      setUserDetails(details);
      setStep(5); // Booking complete step
    } catch (saveError) {
      setError(saveError.message || "Could not save booking.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          fontSize: "14px",
          cursor: "pointer",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        ← Back
      </button>
      {step === 0 && (
        <div>
          <p>Book your passport or ID appointment online</p>
          <button
            style={{
              padding: "15px 30px",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "20px",
            }}
            onClick={() => setStep(1)}
          >
            Start Booking
          </button>
        </div>
      )}

      {step === 1 && <ServiceStep onNext={handleServiceNext} />}

      {step === 2 && (
        <DateStep onNext={handleDateNext} onBack={() => setStep(1)} />
      )}

      {step === 3 && (
        <TimeStep
          service={service}
          bookedSlots={bookedSlots}
          slotCapacity={SLOT_CAPACITY}
          onNext={handleTimeNext}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <UserDetailsStep
          onNext={handleUserDetailsNext}
          onBack={() => setStep(3)}
          isSubmitting={saving}
        />
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === 5 && (
        <div>
          <h2>Booking Complete!</h2>
          <p>
            Service: {service.name} <br />
            Date: {date} <br />
            Time: {time} <br />
            Slot ID: {slotId} <br />
            Name: {userDetails.name} <br />
            Phone: {userDetails.phone} <br />
            Country: {userDetails.country}
          </p>
          <p>Thank you for booking your appointment online!</p>
          <button
            onClick={() => {
              setStep(0);
              setService(null);
              setDate(null);
              setTime(null);
              setUserDetails(null);
              setSlotId("");
              onBack();
            }}
            style={{
              padding: "12px 30px",
              fontSize: "16px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;
