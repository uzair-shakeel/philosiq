import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

export default function Testimonials() {
  const testimonialsData = [
    {
      name: "Sarah Johnson",
      role: "Political Analyst",
      text: "PhilosiQ's survey gave me incredible insights into my political beliefs. The results were surprisingly accurate and helped me understand my stance on various issues.",
      stars: 5,
      avatar: "/images/testimonial-1.jpg",
    },
    {
      name: "Michael Anderson",
      role: "University Student",
      text: "I was skeptical at first, but the depth of analysis in my results was impressive. PhilosiQ excels at capturing the nuances of political thought.",
      stars: 4,
      avatar: "/images/testimonial-2.jpg",
    },
    {
      name: "Emily Williams",
      role: "Social Activist",
      text: "Taking the PhilosiQ survey was eye-opening. It helped me articulate beliefs I've held but struggled to define. Highly recommended for anyone interested in politics.",
      stars: 5,
      avatar: "/images/testimonial-3.jpg",
    },
    {
      name: "John Doe",
      role: "Educator",
      text: "The quiz was thought-provoking and made me reconsider some of my positions. The archetype I received accurately reflected my political outlook.",
      stars: 4,
      avatar: "/images/testimonial-4.jpg",
    },
    {
      name: "Jane Smith",
      role: "Policy Researcher",
      text: "PhilosiQ offers a comprehensive analysis that goes beyond the typical left-right spectrum. I learned a lot about the complexity of political ideology.",
      stars: 5,
      avatar: "/images/testimonial-5.jpg",
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-neutral-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how PhilosiQ has helped people understand their political identity
          </p>
        </div>

        <div className="relative px-10">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper py-10"
          >
            {testimonialsData.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col relative transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 border-primary-maroon">
                  <div className="absolute -top-6 -left-6 bg-primary-maroon rounded-full p-3 text-white">
                    <FaQuoteLeft size={24} />
                  </div>
                  
                  <div className="flex text-primary-maroon mb-4 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < testimonial.stars ? "text-primary-maroon" : "text-gray-300"}
                        size={18}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic mb-6 flex-grow leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center mt-4">
                    <div className="w-12 h-12 bg-secondary-darkBlue rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-secondary-darkBlue">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="swiper-button-prev !text-primary-maroon after:!text-2xl"></div>
          <div className="swiper-button-next !text-primary-maroon after:!text-2xl"></div>
        </div>
      </div>
    </section>
  );
} 