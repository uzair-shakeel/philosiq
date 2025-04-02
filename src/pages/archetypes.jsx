import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function ArchetypePage() {
  // Comprehensive list of all 31 unique archetypes
  const allArchetypes = [
    {
      id: "utopian",
      name: "The Utopian",
      traits: ["Equity", "Democracy", "Progressive", "Globalism", "Globalism"],
      slug: "utopian",
    },
    {
      id: "reformer",
      name: "The Reformer",
      traits: ["Equity", "Democracy", "Progressive", "Nationalism"],
      slug: "reformer",
    },
    {
      id: "prophet",
      name: "The Prophet",
      traits: ["Equity", "Democracy", "Religious", "Globalism"],
      slug: "prophet",
    },
    {   
      
      id: "firebrand",
      name: "The Firebrand",
      traits: ["Equity", "Democracy", "Progressive", "Nationalism"],
      slug: "firebrand",
    },
    {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Democracy", "Secular", "Globalism"],
      slug: "philosopher",
    },
    {
      id: "localist",
      name: "The Localist",
      traits: ["Equity", "Democracy", "Conservative", "Nationalism"],
      slug: "localist",
    },
    {
      id: "missionary",
      name: "The Missionary",
      traits: ["Equity", "Democracy", "Religious", "Globalism"],
      slug: "missionary",
    },
    {
      id: "guardian",
      name: "The Guardian",
      traits: ["Equity", "Authority", "Conservative", "Nationalism"],
      slug: "guardian",
    },
    {
      id: "technocrat",
      name: "The Technocrat",
      traits: ["Equity", "Authority", "Secular", "Globalism"],
      slug: "technocrat",
    },
    {
      id: "enforcer",
      name: "The Enforcer",
      traits: ["Equity", "Authority", "Secular", "Nationalism"],
      slug: "enforcer",
    },
    {
      id: "zealot",
      name: "The Zealot",
      traits: ["Equity", "Authority", "Religious", "Nationalism"],
      slug: "zealot",
    },
    {
      id: "purist",
      name: "The Purist",
      traits: ["Equity", "Authority", "Conservative", "Nationalism"],
      slug: "purist",
    },
    {
      id: "commander",
      name: "The Commander",
      traits: ["Markets", "Authority", "Secular", "Nationalism"],
      slug: "commander",
    },
    {
      id: "steward",
      name: "The Steward",
      traits: ["Markets", "Democracy", "Conservative", "Nationalism"],
      slug: "steward",
    },
    {
      id: "shepherd",
      name: "The Shepherd",
      traits: ["Markets", "Democracy", "Religious", "Nationalism"],
      slug: "shepherd",
    },
    {
      id: "high-priest",
      name: "The High Priest",
      traits: ["Markets", "Authority", "Religious", "Nationalism"],
      slug: "high-priest",
    },
    {
      id: "futurist",
      name: "The Futurist",
      traits: ["Markets", "Democracy", "Progressive", "Globalism"],
      slug: "futurist",
    },
    {
      id: "maverick",
      name: "The Maverick",
      traits: ["Markets", "Democracy", "Secular", "Nationalism"],
      slug: "maverick",
    },
    {
      id: "evangelist",
      name: "The Evangelist",
      traits: ["Markets", "Democracy", "Religious", "Globalism"],
      slug: "evangelist",
    },
    {
      id: "dissenter",
      name: "The Dissenter",
      traits: ["Markets", "Democracy", "Secular", "Nationalism"],
      slug: "dissenter",
    },
    {
      id: "globalist",
      name: "The Globalist",
      traits: ["Markets", "Democracy", "Secular", "Globalism"],
      slug: "globalist",
    },
    {
      id: "patriot",
      name: "The Patriot",
      traits: ["Markets", "Democracy", "Conservative", "Nationalism"],
      slug: "patriot",
    },
    {
      id: "industrialist",
      name: "The Industrialist",
      traits: ["Markets", "Authority", "Secular", "Nationalism"],
      slug: "industrialist",
    },
    {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: ["Markets", "Democracy", "Religious", "Nationalism"],
      slug: "traditionalist",
    },
    {
      id: "overlord",
      name: "The Overlord",
      traits: ["Markets", "Authority", "Secular", "Nationalism"],
      slug: "overlord",
    },
    {
      id: "corporatist",
      name: "The Corporatist",
      traits: ["Markets", "Authority", "Secular", "Globalism"],
      slug: "corporatist",
    },
    {
      id: "moralizer",
      name: "The Moralizer",
      traits: ["Markets", "Authority", "Religious", "Nationalism"],
      slug: "moralizer",
    },
    {
      id: "builder",
      name: "The Builder",
      traits: ["Markets", "Authority", "Progressive", "Nationalism"],
      slug: "builder",
    },
    {
      id: "executive",
      name: "The Executive",
      traits: ["Markets", "Authority", "Secular", "Globalism"],
      slug: "executive",
    },
    {
      id: "ironhand",
      name: "The Ironhand",
      traits: ["Markets", "Authority", "Secular", "Nationalism"],
      slug: "ironhand",
    },
    {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: ["Markets", "Authority", "Religious", "Nationalism"],
      slug: "traditionalist",
    },
    {
      id: "crusader",
      name: "The Crusader",
      traits: ["Markets", "Authority", "Religious", "Nationalism"],
      slug: "crusader",
    },
  ];

  return (
    <Layout title="Political Archetypes - PhilosiQ">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Political Archetypes</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the various political archetypes that represent different
              ideological positions across the political spectrum.
            </p>
          </div>

          {/* All Archetypes Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-secondary-darkBlue mb-8">
              All Political Archetypes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allArchetypes.map((archetype) => (
                <Link
                  href={`/archetypes/${archetype.slug}`}
                  key={archetype.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300 hover:border-primary-maroon bg-white"
                >
                  <h3 className="text-xl font-bold mb-4 text-primary-maroon">
                    {archetype.name}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 mb-3">Key traits:</p>
                    <ul className="space-y-2">
                      {archetype.traits.map((trait, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-primary-maroon rounded-full mr-2"></span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 text-sm text-primary-maroon font-medium">
                    View details →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Axis Categories Section */}
          {/* <div className="space-y-16">
            <h2 className="text-3xl font-bold text-center text-secondary-darkBlue mb-8">
              Political Axes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-green-600">
                  Equality vs. Markets
                </h3>
                <p className="text-gray-600">
                  This axis measures your economic views, from support for
                  equality-based policies to preference for free market
                  solutions.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-blue-600">
                  Democracy vs. Authority
                </h3>
                <p className="text-gray-600">
                  This axis measures your governance preferences, from
                  democratic processes to centralized authority.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-purple-600">
                  Progress vs. Tradition
                </h3>
                <p className="text-gray-600">
                  This axis measures your cultural outlook, from embracing
                  change and innovation to valuing tradition and stability.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-600">
                  Secular vs. Religious
                </h3>
                <p className="text-gray-600">
                  This axis measures your view on the role of religion in
                  society and governance.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-red-600">
                  Globalism vs. Nationalism
                </h3>
                <p className="text-gray-600">
                  This axis measures your perspective on international
                  cooperation versus national sovereignty.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}
