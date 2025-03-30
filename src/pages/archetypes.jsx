import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function ArchetypePage() {
  // Comprehensive list of all 32 archetypes
  const allArchetypes = [
    {
      id: "progressive-humanitarian",
      name: "The Progressive Humanitarian",
      traits: ["Equity", "Democracy", "Secular", "Globalism"],
      slug: "progressive-humanitarian",
    },
    {
      id: "faithful-global-reformer",
      name: "The Faith-Based Global Reformer",
      traits: ["Equity", "Democracy", "Religious", "Globalism"],
      slug: "faithful-global-reformer",
    },
    {
      id: "authoritarian-capitalist",
      name: "The Authoritarian Capitalist",
      traits: ["Markets", "Authority", "Secular", "Globalism"],
      slug: "authoritarian-capitalist",
    },
    {
      id: "progressive-technocrat",
      name: "The Progressive Technocrat",
      traits: ["Equity", "Authority", "Secular", "Globalism"],
      slug: "progressive-technocrat",
    },
    {
      id: "religious-internationalist",
      name: "The Religious Internationalist",
      traits: ["Equity", "Authority", "Religious", "Globalism"],
      slug: "religious-internationalist",
    },
    {
      id: "libertarian-cosmopolitan",
      name: "The Libertarian Cosmopolitan",
      traits: ["Markets", "Democracy", "Secular", "Globalism"],
      slug: "libertarian-cosmopolitan",
    },
    {
      id: "religious-capitalist",
      name: "The Religious Capitalist",
      traits: ["Markets", "Democracy", "Religious", "Globalism"],
      slug: "religious-capitalist",
    },
    {
      id: "religious-authoritarian",
      name: "The Religious Authoritarian",
      traits: ["Markets", "Authority", "Religious", "Globalism"],
      slug: "religious-authoritarian",
    },
    // Add all remaining archetypes here...
    {
      id: "social-democrat",
      name: "The Social Democrat",
      traits: ["Equity", "Democracy", "Secular", "Nationalism"],
      slug: "social-democrat",
    },
    {
      id: "religious-communitarian",
      name: "The Religious Communitarian",
      traits: ["Equity", "Democracy", "Religious", "Nationalism"],
      slug: "religious-communitarian",
    },
    {
      id: "secular-populist",
      name: "The Secular Populist",
      traits: ["Equity", "Authority", "Secular", "Nationalism"],
      slug: "secular-populist",
    },
    {
      id: "traditional-collectivist",
      name: "The Traditional Collectivist",
      traits: ["Equity", "Authority", "Religious", "Nationalism"],
      slug: "traditional-collectivist",
    },
    {
      id: "free-market-patriot",
      name: "The Free Market Patriot",
      traits: ["Markets", "Democracy", "Secular", "Nationalism"],
      slug: "free-market-patriot",
    },
    {
      id: "traditionalist-capitalist",
      name: "The Traditionalist Capitalist",
      traits: ["Markets", "Democracy", "Religious", "Nationalism"],
      slug: "traditionalist-capitalist",
    },
    {
      id: "nationalist-industrialist",
      name: "The Nationalist Industrialist",
      traits: ["Markets", "Authority", "Secular", "Nationalism"],
      slug: "nationalist-industrialist",
    },
    {
      id: "traditional-authoritarian",
      name: "The Traditional Authoritarian",
      traits: ["Markets", "Authority", "Religious", "Nationalism"],
      slug: "traditional-authoritarian",
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
