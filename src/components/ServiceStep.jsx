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
        style={{
          padding: "12px 30px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: selectedService ? "pointer" : "not-allowed",
          background: selectedService
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          transition: "all 0.3s ease",
          opacity: selectedService ? 1 : 0.6,
        }}
        onMouseEnter={(e) => {
          if (selectedService) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "none";
        }}
      >
        Next
      </button>
    </div>
  );
};

export default ServiceStep;
