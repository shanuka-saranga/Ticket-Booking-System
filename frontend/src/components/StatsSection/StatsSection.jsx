import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import "./StatsSection.css";

const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Stop observing after it becomes visible once
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const stats = [
    { id: 1, end: 598, label: "EVENTS ORGANIZED" },
    { id: 2, end: 16173, label: "ACTIVE USERS" },
    { id: 3, end: 136874, label: "TICKETS SOLD" },
  ];

  return (
    <div className="stats-container" ref={containerRef}>
      <div className="stats-overlay">
        <div className="container">
          <div className="row text-center text-white">
            {stats.map((stat) => (
              <div className="col-md-4 mb-4" key={stat.id}>
                <h1 className="stat-number">
                  {inView ? (
                    <CountUp end={stat.end} duration={2.5} separator="," />
                  ) : (
                    "0"
                  )}
                </h1>
                <div className="stat-divider"></div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
