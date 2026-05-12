import React from "react";
import "./CategorySection.css";

const categories = [
  {
    id: 1,
    name: "EVENTS",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
    color: "rgba(46, 204, 113, 0.8)",
  },
  {
    id: 2,
    name: "SPORTS",
    image: "https://images.unsplash.com/photo-1461896646984-81ae67b48674",
    color: "rgba(231, 76, 60, 0.8)",
  },
  {
    id: 3,
    name: "PARTIES",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    color: "rgba(155, 89, 182, 0.8)",
  },
  {
    id: 4,
    name: "COMMUNITIES",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
    color: "rgba(230, 126, 34, 0.8)",
  },
  {
    id: 5,
    name: "THEATERS",
    image: "https://images.unsplash.com/photo-1503095394557-84f67f5979af",
    color: "rgba(52, 152, 219, 0.8)",
  },
  {
    id: 6,
    name: "CONCERTS",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    color: "rgba(232, 67, 147, 0.8)",
  },
];

const CategorySection = () => {
  return (
    <div className="container my-5">
      <div className="mb-4">
        <h2 className="fw-bold section-title text-uppercase mb-2">
          Events by Category
        </h2>
        <p className="text-muted small mb-0">
          Browse popular event categories and discover what fits your mood.
        </p>
      </div>
      <div className="row g-3">
        {" "}
        {/* g-3 කියන්නේ cards අතර ඉඩ */}
        {categories.map((cat) => (
          <div className="col-md-4 col-sm-6" key={cat.id}>
            <div
              className="category-card"
              style={{ backgroundImage: `url(${cat.image})` }}
            >
              {/* පාට overlay එක මෙතන තියෙන්නේ */}
              <div
                className="category-overlay"
                style={{ backgroundColor: cat.color }}
              >
                <h3 className="category-name">{cat.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
