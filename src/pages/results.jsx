import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaDownload,
  FaEnvelope,
  FaArrowRight,
  FaTwitter,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

export default function ResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  // In a real app, this would come from the quiz results or API
  const results = {
    archetype: {
      id: "free-market-patriot",
      name: "Free Market Patriot",
      description: "You believe in economic freedom within a framework of national identity and democratic values.",
      traits: ["Markets", "Authority", "Progress", "Secular", "Military", "Globalism"],
      color: "from-red-500 to-blue-400",
    },
    axisResults: [
      {
        name: "Equality vs. Markets",
        score: 75,
        userPosition: "Markets",
        description: "You strongly favor market-based solutions and economic freedom over centralized economic planning. You believe that free markets, with limited government intervention, lead to greater prosperity and innovation."
      },
      {
        name: "Democracy vs. Authority",
        score: 60,
        userPosition: "Authority",
        description: "You lean toward strong leadership and efficient governance, while still valuing democratic processes. You believe that decisive leadership is often necessary to implement effective policies."
      },
      {
        name: "Progress vs. Tradition",
        score: 65,
        userPosition: "Progress",
        description: "You favor forward-thinking approaches and embrace change, particularly in economic and technological domains. You believe innovation drives society forward."
      },
      {
        name: "Secular vs. Religious",
        score: 70,
        userPosition: "Secular",
        description: "You prefer policy decisions based on secular reasoning rather than religious principles. You believe in the separation of church and state."
      },
      {
        name: "Military vs. Pacifist",
        score: 80,
        userPosition: "Military",
        description: "You strongly support military strength and preparedness as essential for national security. You believe a strong defense is necessary in today's world."
      },
      {
        name: "Globalism vs. Nationalism",
        score: 55,
        userPosition: "Globalism",
        description: "You slightly favor international cooperation and global engagement, while still valuing national sovereignty. You believe in strategic global participation that benefits national interests."
      }
    ],
    secondaryArchetypes: [
      {
        name: "Libertarian Cosmopolitan",
        match: "85% match",
        traits: ["Markets", "Democracy", "Secular", "Globalism"],
      },
      {
        name: "Nationalist Industrialist",
        match: "78% match",
        traits: ["Markets", "Authority", "Secular", "Nationalism"],
      }
    ]
  };

  useEffect(() => {
    // Simulate loading results
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send an API request to email the results
    console.log(`Sending results to ${userEmail}`);
    
    // Simulate email sending
    setTimeout(() => {
      setEmailSent(true);
    }, 1000);
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log("Downloading PDF...");
    alert("PDF download functionality would be implemented here");
  };

  if (isLoading) {
    return (
      <Layout title="Analyzing Results - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Responses</h2>
            <p className="text-gray-600">Please wait while we calculate your political archetype...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Your Results: ${results.archetype.name} - PhilosiQ`}>
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {/* Logo for PDF sharing */}
          <div className="absolute top-28 right-8 opacity-70">
            <img src="/whitelogo.png" alt="PhilosiQ" className="h-10 w-auto" />
          </div>
          
          {/* Main Results Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">Your Quiz Results</h1>
            <p className="text-lg text-gray-600">
              Based on your responses, we've identified your political archetype
            </p>
          </div>

          {/* Primary Archetype Card */}
          <div className="mb-16">
            <div className={`bg-gradient-to-r ${results.archetype.color} rounded-lg shadow-xl overflow-hidden`}>
              <div className="p-8 text-white text-center">
                <h2 className="text-5xl font-bold mb-4">{results.archetype.name}</h2>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {results.archetype.traits.map((trait, index) => (
                    <span key={index} className="bg-white/20 px-4 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-xl max-w-3xl mx-auto">{results.archetype.description}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-b-lg shadow-lg p-6 text-center">
              <Link 
                href={`/archetypes/${results.archetype.id}`}
                className="btn-primary inline-flex items-center"
              >
                Learn More About Your Archetype <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Secondary Archetypes */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Secondary Archetypes</h2>
            <p className="text-center text-gray-600 mb-8">
              You also show strong alignment with these political archetypes
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {results.secondaryArchetypes.map((archetype, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-secondary-darkBlue">{archetype.name}</h3>
                      <span className="bg-secondary-lightBlue text-white px-3 py-1 rounded-full text-sm">
                        {archetype.match}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {archetype.traits.map((trait, i) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                          {trait}
                        </span>
                      ))}
                    </div>
                    <Link 
                      href={`/archetypes/${archetype.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-primary-maroon hover:underline inline-flex items-center text-sm font-medium"
                    >
                      View Details <FaArrowRight className="ml-1 text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Axis Breakdown */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Your Political Axis Breakdown</h2>
            <p className="text-center text-gray-600 mb-8">
              See where you stand on each of the six political dimensions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {results.axisResults.map((axis, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-secondary-darkBlue">{axis.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${
                      axis.name.includes("Equality") ? "bg-blue-500" :
                      axis.name.includes("Democracy") ? "bg-green-500" :
                      axis.name.includes("Progress") ? "bg-purple-500" :
                      axis.name.includes("Secular") ? "bg-yellow-500" :
                      axis.name.includes("Military") ? "bg-red-500" :
                      "bg-indigo-500"
                    }`}>
                      {axis.userPosition}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{axis.name.split(" vs. ")[1]}</span>
                      <span>{axis.name.split(" vs. ")[0]}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          axis.name.includes("Equality") ? "bg-blue-500" :
                          axis.name.includes("Democracy") ? "bg-green-500" :
                          axis.name.includes("Progress") ? "bg-purple-500" :
                          axis.name.includes("Secular") ? "bg-yellow-500" :
                          axis.name.includes("Military") ? "bg-red-500" :
                          "bg-indigo-500"
                        }`}
                        style={{ width: `${axis.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm">{axis.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Share Results */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Share Your Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Results */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaEnvelope className="mr-2 text-primary-maroon" /> Email Your Results
                </h3>
                
                {!emailSent ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-maroon"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary py-2"
                    >
                      Send Results
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4">
                      Results sent successfully!
                    </div>
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-primary-maroon hover:underline"
                    >
                      Send to another email
                    </button>
                  </div>
                )}
              </div>
              
              {/* Download PDF */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaDownload className="mr-2 text-primary-maroon" /> Download Your Results
                </h3>
                <p className="text-gray-600 mb-6">
                  Get a PDF copy of your results to save or print for future reference.
                </p>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full btn-primary py-2 flex items-center justify-center"
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3">Share on social media:</p>
                  <div className="flex space-x-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaFacebook size={24} />
                    </button>
                    <button className="text-blue-400 hover:text-blue-600">
                      <FaTwitter size={24} />
                    </button>
                    <button className="text-blue-700 hover:text-blue-900">
                      <FaLinkedin size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Take Another Quiz */}
          <div className="text-center">
            <Link href="/quiz" className="btn-outline inline-block">
              Take Another Quiz
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 