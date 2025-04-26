import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function ArchetypePage() {
  // Comprehensive list of all 31 unique archetypes
  const allArchetypes = [
    {
      id: "utopian",
      name: "The Utopian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      slug: "utopian",
    },
    {
      id: "reformer",
      name: "The Reformer",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      slug: "reformer",
    },
    {
      id: "prophet",
      name: "The Prophet",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      slug: "prophet",
    },
    {
      id: "firebrand",
      name: "The Firebrand",
      traits: [
        "Equity",
        "Libertariany",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "firebrand",
    },
    {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Libertarian", "Conservative", "Secular", "Globalist"],
      slug: "philosopher",
    },
    {
      id: "localist",
      name: "The Localist",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "localist",
    },
    {
      id: "missionary",
      name: "The Missionary",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "missionary",
    },
    {
      id: "guardian",
      name: "The Guardian",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      slug: "guardian",
    },
    {
      id: "technocrat",
      name: "The Technocrat",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      slug: "technocrat",
    },
    {
      id: "enforcer",
      name: "The Enforcer",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      slug: "enforcer",
    },
    {
      id: "zealot",
      name: "The Zealot",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      slug: "zealot",
    },
    {
      id: "purist",
      name: "The Purist",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "purist",
    },
    {
      id: "commander",
      name: "The Commander",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      slug: "commander",
    },
    {
      id: "steward",
      name: "The Steward",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "steward",
    },
    {
      id: "shepherd",
      name: "The Shepherd",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "shepherd",
    },
    {
      id: "high-priest",
      name: "The High Priest",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      slug: "high-priest",
    },
    {
      id: "futurist",
      name: "The Futurist",
      traits: ["Markets", "Libertarian", "Progressive", "Secular", "Globalist"],
      slug: "futurist",
    },
    {
      id: "maverick",
      name: "The Maverick",
      traits: [
        "Markets",
        "Libertarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      slug: "maverick",
    },
    {
      id: "evangelist",
      name: "The Evangelist",
      traits: [
        "Markets",
        "Libertarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      slug: "evangelist",
    },
    {
      id: "dissenter",
      name: "The Dissenter",
      traits: [
        "Markets",
        "Libertarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "dissenter",
    },
    {
      id: "globalist",
      name: "The Globalist",
      traits: [
        "Markets",
        "Libertarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      slug: "globalist",
    },
    {
      id: "patriot",
      name: "The Patriot",
      traits: [
        "Markets",
        "Libertarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "patriot",
    },
    {
      id: "industrialist",
      name: "The Industrialist",
      traits: [
        "Markets",
        "Libertarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "industrialist",
    },
    {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: [
        "Markets",
        "Libertarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      slug: "traditionalist",
    },
    {
      id: "overlord",
      name: "The Overlord",
      traits: ["Markets", "Authority", "Progressive", "Secular", "Globalist"],
      slug: "overlord",
    },
    {
      id: "corporatist",
      name: "The Corporatist",
      traits: ["Markets", "Authority", "Progressive", "Secular", "Nationalist"],
      slug: "corporatist",
    },
    {
      id: "moralizer",
      name: "The Moralizer",
      traits: ["Markets", "Authority", "Progressive", "Religious", "Globalist"],
      slug: "moralizer",
    },
    {
      id: "builder",
      name: "The Builder",
      traits: [
        "Markets",
        "Authority",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "builder",
    },
    {
      id: "executive",
      name: "The Executive",
      traits: ["Markets", "Authority", "Conservative", "Secular", "Globalist"],
      slug: "executive",
    },
    {
      id: "ironhand",
      name: "The Ironhand",
      traits: [
        "Markets",
        "Authority",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "ironhand",
    },
    {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: [
        "Markets",
        "Authority",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "traditionalist",
    },
    {
      id: "crusader",
      name: "The Crusader",
      traits: [
        "Markets",
        "Authority",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
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
