import React from "react";
import Link from "next/link";
import { FaUsers, FaQuestionCircle, FaChartLine } from "react-icons/fa";

export default function Stats() {
  const statsData = [
    {
      title: "1,000+",
      description:
        "Our test has been taken over 1,000 times by people all over the world, resulting in each person receiving an Archetype.",
      buttonText: "Values",
      buttonLink: "/archetypes",
      icon: <FaUsers className="text-white text-4xl" />,
      color: "from-primary-maroon to-primary-darkMaroon",
    },
    {
      title: "~100",
      description:
        "Our quiz features around 100 unique questions designed to gauge your perspective across five distinct axes!",
      buttonText: "Take the Quiz",
      buttonLink: "/quiz",
      icon: <FaQuestionCircle className="text-white text-4xl" />,
      color: "from-secondary-darkBlue to-secondary-blue",
    },
    {
      title: "92%",
      description:
        "Test takers rated our test as accurate or very accurate! Have feedback? Click below to complete a contact form!",
      buttonText: "Contact Us",
      buttonLink: "/contact-us",
      icon: <FaChartLine className="text-white text-4xl" />,
      color: "from-primary-lightMaroon to-primary-maroon",
    },
  ];

  return (
    <section className="section-padding bg-neutral-light">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col h-full">
              <div
                className={`bg-gradient-to-r ${stat.color} rounded-t-lg p-6 flex items-center`}
              >
                <div className="bg-white/20 p-4 rounded-full mr-4">
                  {stat.icon}
                </div>
                <h2 className="text-4xl font-bold text-white">{stat.title}</h2>
              </div>
              <div className="bg-white rounded-b-lg p-6 shadow-md flex flex-col flex-grow">
                <p className="text-gray-700 mb-6 flex-grow">
                  {stat.description}
                </p>
                <Link
                  href={stat.buttonLink}
                  className={`self-start btn-primary ${
                    index === 1
                      ? "bg-secondary-darkBlue hover:bg-secondary-blue"
                      : index === 2
                      ? "bg-primary-lightMaroon hover:bg-primary-maroon"
                      : ""
                  }`}
                >
                  {stat.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
