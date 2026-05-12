import React from "react";
import "./HowItWorks.css";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: "bi bi-search",
      title: "Choose Your Event",
      description:
        "Browse through our wide range of events including concerts, sports, and parties.",
    },
    {
      id: 2,
      icon: "bi bi-ticket-perforated",
      title: "Get Your Tickets",
      description:
        "Select your preferred seats and purchase tickets securely through our platform.",
    },
    {
      id: 3,
      icon: "bi bi-qr-code-scan",
      title: "Enjoy the Moment",
      description:
        "Receive your digital ticket via email and show it at the entrance to join the fun.",
    },
    {
      id: 4,
      icon: "bi bi-heart",
      title: "Share & Enjoy",
      description:
        "Share your experience with friends and collect memories from the best events.",
    },
  ];

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h2 className="fw-bold section-title text-uppercase mb-2">
          How It Works
        </h2>

        <p className="text-muted small mb-0">
          Follow these simple steps to book your next unforgettable experience.
        </p>

        <div className="row g-4 mt-3">
          {steps.map((step) => (
            <div
              className="col-lg-3 col-md-6 col-sm-12 text-center"
              key={step.id}
            >
              <div className="step-card p-4">
                <div className="step-number">{step.id}</div>
                <div className="icon-box mb-4">
                  <i className={`${step.icon}`}></i>
                </div>
                <h4 className="fw-bold mb-3">{step.title}</h4>
                <p className="text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
