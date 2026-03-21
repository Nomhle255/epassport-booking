import { useState } from "react";

const services = [
  { id: "passport_new", name: "New Passport Application", duration: 30 },
  { id: "passport_renewal", name: "Passport Renewal", duration: 30 },
  { id: "passport_lost", name: "Lost Passport Replacement", duration: 30 },
  { id: "id_new", name: "New ID Application", duration: 20 },
];

const ServiceStep = ({ onNext }) => {
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <h2>Select a Service</h2>

      {services.map((service) => (
        <div key={service.id}>
          <button
            onClick={() => setSelectedService(service)}
            style={{
              margin: "10px",
              padding: "10px",
              background:
                selectedService?.id === service.id ? "#007bff" : "#eee",
              color:
                selectedService?.id === service.id ? "white" : "black",
            }}
          >
            {service.name} ({service.duration} mins)
          </button>
        </div>
      ))}

      <br />

      <button
        disabled={!selectedService}
        onClick={() => onNext(selectedService)}
      >
        Next
      </button>
    </div>
  );
};

export default ServiceStep;
