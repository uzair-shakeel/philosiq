import React from "react";
import Layout from "../components/Layout";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Image from "next/image";
import {
  FaChartBar,
  FaUsers,
  FaLightbulb,
  FaBalanceScale,
} from "react-icons/fa";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import QuizSections from "../components/QuizSections";
import AdSense from "../components/AdSense";

export default function Home() {
  return (
    <>
      <Analytics />
      <Layout title="Philosiq - Home">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-darkBlue to-primary-darkMaroon opacity-80 z-10"></div>
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/red_sky_y.png"
              alt="Political landscape background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="container-custom relative z-20 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover Your Political Identity
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Reveal the ideology behind your instincts. Our quiz maps your
                political DNA and introduces you to the archetype that fits you
                best.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quiz"
                  className="btn-primary text-center text-lg px-8 py-3"
                >
                  Take the Quiz
                </Link>
                <Link
                  href="/archetypes"
                  className="btn-outline border-white text-white hover:bg-white hover:text-secondary-darkBlue text-center text-lg px-8 py-3"
                >
                  Explore Archetypes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <Stats />

        {/* Our Six Axes Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Five Pillars of Politics
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our test measures your political beliefs across these five
                fundamental axes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const axes = [
                  "Equity vs. Free Market",
                  "Libertarian vs. Authoritarian",
                  "Progressive vs. Conservative",
                  "Secular vs. Religious",
                  "Globalist vs. Nationalist",
                ];

                return (
                  <>
                    {/* Render boxes 1–3 normally */}
                    {axes.slice(0, 3).map((axis, index) => (
                      <div
                        key={index}
                        className="bg-neutral-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary-maroon flex flex-col items-center text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-maroon to-secondary-darkBlue flex items-center justify-center text-white font-bold text-xl mb-4">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-secondary-darkBlue">
                          {axis}
                        </h3>
                        <p className="text-gray-600">
                          Measures your stance on the spectrum between{" "}
                          {axis.split(" vs. ")[0].toLowerCase()} and{" "}
                          {axis.split(" vs. ")[1].toLowerCase()}
                        </p>
                      </div>
                    ))}

                    {/* Wrap boxes 4 & 5 in a centered flex container that spans all columns */}
                    <div className="col-span-full flex justify-center gap-6 lg:col-span-3">
                      {axes.slice(3).map((axis, index) => (
                        <div
                          key={index + 3}
                          className="bg-neutral-light p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-primary-maroon flex flex-col items-center text-center w-full max-w-md"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-maroon to-secondary-darkBlue flex items-center justify-center text-white font-bold text-xl mb-4">
                            {index + 4}
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-secondary-darkBlue">
                            {axis}
                          </h3>
                          <p className="text-gray-600">
                            Measures your stance on the spectrum between{" "}
                            {axis.split(" vs. ")[0].toLowerCase()} and{" "}
                            {axis.split(" vs. ")[1].toLowerCase()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Quiz Sections */}
        <QuizSections />

        {/* How It Works Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover where you truly stand—Importiq makes understanding your
                political views quick, accurate, and surprisingly revealing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Take the Quiz",
                  description:
                    "Your responses help us map your values and beliefs with precision.",
                  number: "01",
                },
                {
                  title: "Get Your Results",
                  description:
                    "Importiq analyzes your answers and scores you on five major ideological axes.",
                  number: "02",
                },
                {
                  title: "Discover Your Archetype",
                  description:
                    "Explore how your unique combination of values forms a powerful political identity.",
                  number: "03",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="absolute -top-6 -left-6 text-8xl font-bold text-gray-100 z-0">
                    {step.number}
                  </div>
                  <div className="relative z-10 bg-white p-8 rounded-lg shadow-md h-full">
                    <h3 className="text-xl font-bold mb-4 text-secondary-darkBlue">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/quiz" className="btn-primary text-lg px-8 py-3">
                Start Quiz
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-maroon to-secondary-darkBlue text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Discover Your Political Identity?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of others who have gained insight into their
              political beliefs through our comprehensive quiz.
            </p>
            <Link
              href="/quiz"
              className="bg-white text-primary-maroon hover:bg-gray-100 font-bold text-lg px-8 py-3 rounded transition-all duration-300"
            >
              Take the Quiz Now
            </Link>
          </div>
        </section>
      </Layout>
    </>
  );
}
