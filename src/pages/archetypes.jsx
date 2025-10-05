import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function ArchetypePage() {
  // Define trait pairs (opposites)
  const traitPairs = [
    ["Equity", "Free Market"],
    ["Libertarian", "Authoritarian"],
    ["Progressive", "Conservative"],
    ["Secular", "Religious"],
    ["Globalist", "Nationalist"],
  ];

  // State for selected filters
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Comprehensive list of all 32 unique archetypes
  const allArchetypes = [
    {
      id: "utopian",
      name: "The Utopian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      slug: "elpsg",
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
      slug: "elpsn",
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
      slug: "elprg",
    },
    {
      id: "firebrand",
      name: "The Firebrand",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "elprn",
    },
    {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Libertarian", "Conservative", "Secular", "Globalist"],
      slug: "elcsg",
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
      slug: "elcsn",
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
      slug: "elcrg",
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
      slug: "elcrn",
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
      slug: "eapsg",
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
      slug: "eapsn",
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
      slug: "eaprg",
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
      slug: "eaprn",
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
      slug: "eacsg",
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
      slug: "eacsn",
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
      slug: "eacrg",
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
      slug: "eacrn",
    },
    {
      id: "futurist",
      name: "The Futurist",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      slug: "flpsg",
    },
    {
      id: "maverick",
      name: "The Maverick",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      slug: "flpsn",
    },
    {
      id: "evangelist",
      name: "The Evangelist",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      slug: "flprg",
    },
    {
      id: "dissenter",
      name: "The Dissenter",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "flprn",
    },
    {
      id: "globalist",
      name: "The Globalist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      slug: "flcsg",
    },
    {
      id: "patriot",
      name: "The Patriot",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "flcsn",
    },
    {
      id: "industrialist",
      name: "The Industrialist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "flcrg",
    },
    {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      slug: "flcrn",
    },
    {
      id: "overlord",
      name: "The Overlord",
      traits: [
        "Free Market",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      slug: "fapsg",
    },
    {
      id: "corporatist",
      name: "The Corporatist",
      traits: [
        "Free Market",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      slug: "fapsn",
    },
    {
      id: "moralizer",
      name: "The Moralizer",
      traits: [
        "Free Market",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      slug: "faprg",
    },
    {
      id: "builder",
      name: "The Builder",
      traits: [
        "Free Market",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      slug: "faprn",
    },
    {
      id: "executive",
      name: "The Executive",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      slug: "facsg",
    },
    {
      id: "ironhand",
      name: "The Ironhand",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      slug: "facsn",
    },
    {
      id: "regent",
      name: "The Regent",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      slug: "facrg",
    },
    {
      id: "crusader",
      name: "The Crusader",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      slug: "facrn",
    },
  ];

  // Extract all unique traits for filter options
  const allTraits = useMemo(() => {
    const traits = new Set();
    allArchetypes.forEach((archetype) => {
      archetype.traits.forEach((trait) => {
        traits.add(trait);
      });
    });
    return Array.from(traits).sort();
  }, [allArchetypes]);

  // Filter archetypes based on selected filters
  const filteredArchetypes = useMemo(() => {
    if (selectedFilters.length === 0) {
      return allArchetypes;
    }

    return allArchetypes.filter((archetype) => {
      return selectedFilters.every((filter) =>
        archetype.traits.includes(filter)
      );
    });
  }, [allArchetypes, selectedFilters]);

  // Handle filter selection
  const handleFilterClick = (trait) => {
    setSelectedFilters((prev) => {
      if (prev.includes(trait)) {
        return prev.filter((f) => f !== trait);
      } else {
        // Find if there's an opposite trait already selected
        const oppositeSelected = traitPairs.find((pair) => {
          return (
            pair.includes(trait) &&
            pair.some((p) => prev.includes(p) && p !== trait)
          );
        });

        // If an opposite is selected, replace it
        if (oppositeSelected) {
          const oppositeTraits = oppositeSelected.filter((p) => p !== trait);
          const oppositeInSelection = oppositeTraits.find((p) =>
            prev.includes(p)
          );

          if (oppositeInSelection) {
            return [...prev.filter((f) => f !== oppositeInSelection), trait];
          }
        }

        return [...prev, trait];
      }
    });
  };

  // Check if a trait is disabled (opposite of a selected trait)
  const isTraitDisabled = (trait) => {
    if (selectedFilters.includes(trait)) return false;

    // Check if any of its opposites are selected
    return traitPairs.some((pair) => {
      return (
        pair.includes(trait) &&
        pair.some((p) => selectedFilters.includes(p) && p !== trait)
      );
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <Layout title="Discover Archetypes - Philosiq">
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Discover Archetypes</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the various political archetypes that represent different
              ideological positions across the political spectrum.
            </p>
          </div>

          {/* Filter Section */}
         <div className="grid grid-cols-5 gap-4">
  {traitPairs.map(([first, second], index) => (
    <div key={index} className="flex flex-col gap-2 items-center">
      {[first, second].map((trait) => (
        <button
          key={trait}
          onClick={() => handleFilterClick(trait)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all w-full text-center ${
              selectedFilters.includes(trait)
                ? "bg-primary-maroon text-white"
                : isTraitDisabled(trait)
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          disabled={isTraitDisabled(trait)}
        >
          {trait}
        </button>
      ))}
    </div>
  ))}
  {/* Clear Button */}
  {selectedFilters.length > 0 && (
    <div className="mt-4 col-span-5 text-center">
      <button
        onClick={clearFilters}
        className="px-6 py-2 bg-primary-maroon text-white rounded-md hover:bg-primary-maroon/90 transition-all"
      >
        Clear All Filters
      </button>
    </div>
  )}
</div>

          {/* All Archetypes Grid */}
          <div className="mb-20">
            <h2 className="mt-12 text-3xl font-bold text-center text-secondary-darkBlue mb-8">
              {selectedFilters.length > 0
                ? `Filtered Archetypes (${filteredArchetypes.length})`
                : "All Political Archetypes"}
            </h2>


            {filteredArchetypes.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">
                  No archetypes match your selected filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary-maroon text-white rounded-md hover:bg-primary-maroon/90"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredArchetypes.map((archetype) => (
                  <Link
                    href={`/archetypes/${archetype.slug}`}
                    key={archetype.id}
                    className="flex p-8 flex-col h-full bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-102 hover:shadow-lg"
                    shallow={false}
                  >
                    <h3 className="text-xl font-bold mb-4 text-primary-maroon">
                      {archetype.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 mb-3">Key traits:</p>
                      <ul className="space-y-2">
                        {archetype.traits.map((trait, index) => (
                          <li key={index} className="flex items-center">
                            <span
                              className={`w-2 h-2 rounded-full mr-2 ${
                                selectedFilters.includes(trait)
                                  ? "bg-primary-maroon"
                                  : "bg-gray-400"
                              }`}
                            ></span>
                            <span
                              className={
                                selectedFilters.includes(trait)
                                  ? "font-medium"
                                  : ""
                              }
                            >
                              {trait}
                            </span>
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
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
