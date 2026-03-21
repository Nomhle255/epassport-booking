import { useState } from "react";
import ServiceStep from "../components/ServiceStep";
import DateStep from "../components/DateStep";
import TimeStep from "../components/TimeStep";
import UserDetailsStep from "../components/UserDetailsStep";

const Booking = () => {
  const [step, setStep] = useState(0); 
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const handleServiceNext = (selectedService) => {
    setService(selectedService);
    setStep(2);
  };

  const handleDateNext = (selectedDate) => {
    setDate(selectedDate);
    setStep(3);
  };

  const handleTimeNext = (selectedTime) => {
    setTime(selectedTime);
    setStep(4);
  };

  const handleUserDetailsNext = (details) => {
    setUserDetails(details);
    setStep(5); // Booking complete step
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
          onNext={handleTimeNext}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <UserDetailsStep
          onNext={handleUserDetailsNext}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <div>
          <h2>Booking Complete!</h2>
          <p>
            Service: {service.name} <br />
            Date: {date} <br />
            Time: {time} <br />
            Name: {userDetails.name} <br />
            Phone: {userDetails.phone} <br />
            National ID: {userDetails.nationalId}
          </p>
          <p>Thank you for booking your appointment online!</p>
        </div>
      )}
    </div>
  );
};

export default Booking;
