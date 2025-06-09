import React from "react";
import Image from "next/image"; // ✅ ADD THIS
import { FaArrowRight, FaClipboardCheck, FaUserCheck, FaBalanceScale } from "react-icons/fa";
import Link from "next/link";

export default function QuizSections() {
  const sections = [
    {
      title: "Our Quiz",
      description: "...",
      icon: (
        <div className="relative w-24 h-24">
          <Image
            src="/red_sky_y.png" // ✅ FIXED
            alt="Archetypes Visual"
            fill
            className="object-cover rounded-full"
          />
          <FaUserCheck className="absolute inset-0 text-white text-4xl flex items-center justify-center" />
        </div>
      ),
      bgColor: "from-primary-maroon to-primary-darkMaroon", // ✅ RECOMMENDED
    },
    {
      title: "Archetypes",
      description:
        "The Archetypes are unique personality or character profiles crafted from your quiz results, offering a meaningful reflection of your values and perspectives. Each Archetype is designed to resonate with your core beliefs, highlighting your distinct approach to the world and its challenges. These profiles provide an engaging way to understand yourself and connect with others who share similar outlooks.",
      icon: <FaUserCheck className="text-white text-5xl" />,
      reverse: true,
      buttonLink: "/archetypes",
      bgColor: "from-secondary-darkBlue to-secondary-blue",
    },
    {
      title: "Importiq",
      description:
        "Importiq is Philosiq's weighting system, designed to assess the significance of each quiz question with precision and thoughtfulness. By analyzing the impact of your responses, Importiq ensures that key aspects of your values and beliefs are accurately reflected in your results. This innovative approach highlights the deeper importance behind every answer, providing a more meaningful and personalized experience. This system is ever-changing based on real-time feedback from people like you!",
      icon: <FaBalanceScale className="text-white text-5xl" />,
      reverse: false,
      buttonLink: "/quiz",
      bgColor: "from-primary-lightMaroon to-primary-maroon",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Philosiq Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive approach to understanding your political identity
          </p>
        </div>
        
        <div className="space-y-24">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                section.reverse ? "md:flex-row-reverse" : "md:flex-row"
              } items-center gap-8 md:gap-16`}
            >
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold mb-6 text-secondary-darkBlue">
                  {section.title}
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {section.description}
                </p>
                <Link
                  href={section.buttonLink}
                  className={`inline-flex items-center btn-primary ${
                    index === 1 ? 'bg-secondary-darkBlue hover:bg-secondary-blue' : 
                    index === 2 ? 'bg-primary-lightMaroon hover:bg-primary-maroon' : ''
                  }`}
                >
                  Learn More <FaArrowRight className="ml-2" />
                </Link>
              </div>
              <div className="w-full md:w-1/2">
                <div className={`bg-gradient-to-r ${section.bgColor} rounded-lg shadow-lg p-12 flex items-center justify-center h-64 md:h-80`}>
                  <div className="bg-white/20 p-8 rounded-full">
                    {section.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
