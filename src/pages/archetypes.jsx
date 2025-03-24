import Layout from "../components/Layout";

export default function ArchetypePage() {
  // Original categories data
  const categories = [
    {
      id: 1,
      name: "Global Orientation",
      description:
        "Archetypes defined by their approach to global and national perspectives",
      archetypes: [
        {
          id: 101,
          name: "Globalist",
          traits: [
            "International cooperation",
            "Interconnected economies",
            "Cross-border solutions",
            "Global governance",
          ],
        },
        {
          id: 102,
          name: "Nationalist",
          traits: [
            "National priority",
            "Local solutions",
            "Cultural preservation",
            "Sovereign interests",
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Governance Approach",
      description:
        "Archetypes characterized by their stance on authority and democratic principles",
      archetypes: [
        {
          id: 201,
          name: "Democratic Pluralist",
          traits: [
            "Participatory governance",
            "Individual rights",
            "Diverse representation",
            "Consensual decision-making",
          ],
        },
        {
          id: 202,
          name: "Authoritarian Pragmatist",
          traits: [
            "Centralized leadership",
            "Efficient governance",
            "Strategic decision-making",
            "Controlled social dynamics",
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Economic Philosophy",
      description:
        "Archetypes defined by their economic beliefs and market interactions",
      archetypes: [
        {
          id: 301,
          name: "Market-Driven Capitalist",
          traits: [
            "Free enterprise",
            "Minimal regulation",
            "Private sector innovation",
            "Competitive markets",
          ],
        },
        {
          id: 302,
          name: "Equity-Focused Redistributionist",
          traits: [
            "Economic fairness",
            "Social welfare",
            "Wealth redistribution",
            "Regulated markets",
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Ideological Foundations",
      description:
        "Archetypes characterized by their fundamental belief systems",
      archetypes: [
        {
          id: 401,
          name: "Secular Rationalist",
          traits: [
            "Evidence-based thinking",
            "Scientific approach",
            "Separation of church and state",
            "Empirical decision-making",
          ],
        },
        {
          id: 402,
          name: "Faith-Guided Traditionalist",
          traits: [
            "Religious principles",
            "Moral absolutism",
            "Cultural preservation",
            "Spiritual governance",
          ],
        },
      ],
    },
  ];

  // Comprehensive archetypes data from the provided object
  const archetypeGroups = [
    {
      id: 5,
      name: "Visionaries",
      focus: "Globalist",
      description:
        "These archetypes emphasize global influence, cooperation, and interconnected prosperity.",
      archetypes: [
        {
          id: 501,
          name: "The Egalitarian Technocrat",
          traits: ["Equity", "Authority", "Secular", "Globalism"],
        },
        {
          id: 502,
          name: "The Faith-Based Free Trader",
          traits: ["Markets", "Democracy", "Religious", "Globalism"],
        },
        {
          id: 503,
          name: "The Authoritarian Capitalist",
          traits: ["Markets", "Authority", "Secular", "Globalism"],
        },
        {
          id: 504,
          name: "The Corporate Theocrat",
          traits: ["Markets", "Authority", "Religious", "Globalism"],
        },
      ],
      common_theme:
        "A focus on shaping the global order through economic and ideological frameworks.",
    },
    {
      id: 6,
      name: "Builders",
      focus: "Nationalist",
      description:
        "These archetypes prioritize strengthening their nation through enterprise and leadership.",
      archetypes: [
        {
          id: 601,
          name: "The National Welfare Advocate",
          traits: ["Equity", "Authority", "Secular", "Nationalism"],
        },
        {
          id: 602,
          name: "The Conservative Capitalist",
          traits: ["Markets", "Democracy", "Religious", "Nationalism"],
        },
        {
          id: 603,
          name: "The Nationalist Industrialist",
          traits: ["Markets", "Authority", "Secular", "Nationalism"],
        },
        {
          id: 604,
          name: "The Paternalistic Guardian",
          traits: ["Equity", "Authority", "Religious", "Nationalism"],
        },
      ],
      common_theme:
        "Rooted in national pride and the belief in structured, localized solutions to foster prosperity.",
    },
    {
      id: 7,
      name: "Idealists",
      focus: "Equity",
      description:
        "These archetypes champion fairness and inclusion, whether locally or globally.",
      archetypes: [
        {
          id: 701,
          name: "The Progressive Humanitarian",
          traits: ["Equity", "Democracy", "Secular", "Globalism"],
        },
        {
          id: 702,
          name: "The Faithful Global Reformer",
          traits: ["Equity", "Democracy", "Religious", "Globalism"],
        },
        {
          id: 703,
          name: "The Social Justice Patriot",
          traits: ["Equity", "Democracy", "Secular", "Nationalism"],
        },
        {
          id: 704,
          name: "The Compassionate Traditionalist",
          traits: ["Equity", "Democracy", "Religious", "Nationalism"],
        },
      ],
      common_theme:
        "A dedication to fairness and justice, whether focused on the global stage or within their home country.",
    },
    {
      id: 8,
      name: "Pragmatists",
      focus: "Market",
      description:
        "These archetypes see free enterprise and personal initiative as essential to progress.",
      archetypes: [
        {
          id: 801,
          name: "The Libertarian Cosmopolitan",
          traits: ["Markets", "Democracy", "Secular", "Globalism"],
        },
        {
          id: 802,
          name: "The Free Market Patriot",
          traits: ["Markets", "Democracy", "Secular", "Nationalism"],
        },
        {
          id: 803,
          name: "The Traditionalist Capitalist",
          traits: ["Markets", "Authority", "Religious", "Nationalism"],
        },
        {
          id: 804,
          name: "The Nationalist Industrialist",
          traits: ["Markets", "Authority", "Secular", "Nationalism"],
        },
      ],
      common_theme:
        "A belief in the transformative power of markets, guided by either global ambitions or national focus.",
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

          {/* Comprehensive Archetype Groups Section */}
          <div className="space-y-16 mb-20">
            <h2 className="text-3xl font-bold text-center text-secondary-darkBlue mb-8">
              Comprehensive Archetype Framework
            </h2>

            {archetypeGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-secondary-darkBlue">
                      {group.name}
                    </h2>
                    <p className="text-primary-maroon font-medium">
                      Focus: {group.focus}
                    </p>
                  </div>
                  <div className="mt-3 md:mt-0 md:ml-4 px-4 py-2 bg-gray-100 rounded-lg">
                    <p className="text-sm italic">{group.common_theme}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-8">{group.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {group.archetypes.map((archetype) => (
                    <div
                      key={archetype.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <h3 className="text-xl font-bold mb-4 text-primary-maroon">
                        {archetype.name}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 mb-3">
                          Key traits:
                        </p>
                        <ul className="space-y-2">
                          {archetype.traits.map((trait, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary-maroon rounded-full mr-2"></span>
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Original Categories Section */}
          <div className="space-y-16">
            <h2 className="text-3xl font-bold text-center text-secondary-darkBlue mb-8">
              Archetype Categories
            </h2>

            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold mb-3 text-secondary-darkBlue">
                  {category.name}
                </h2>
                <p className="text-gray-600 mb-8">{category.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.archetypes.map((archetype) => (
                    <div
                      key={archetype.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <h3 className="text-xl font-bold mb-4 text-primary-maroon">
                        {archetype.name}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 mb-3">
                          Key traits:
                        </p>
                        <ul className="space-y-2">
                          {archetype.traits.map((trait, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-2 h-2 bg-primary-maroon rounded-full mr-2"></span>
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
