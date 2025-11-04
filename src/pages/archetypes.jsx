import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

export default function ArchetypePage() {
  // Trait color map (active state BG colors)
  const traitColor = {
    Equity: "bg-blue-600",
    "Free Market": "bg-green-600",
    Libertarian: "bg-teal-500",
    Authoritarian: "bg-orange-500",
    Progressive: "bg-sky-500",
    Conservative: "bg-red-500",
    Secular: "bg-yellow-400",
    Religious: "bg-purple-500",
    Globalist: "bg-lime-500",
    Nationalist: "bg-rose-500",
  };

  // Override colors specifically for dots and selected indicators without changing global card theming
  const dotColor = {
    Equity: "bg-blue-600",
    "Free Market": "bg-green-600",
    Libertarian: "bg-teal-500",
    Authoritarian: "bg-orange-500",
    Progressive: "bg-sky-500",
    Conservative: "bg-red-500",
    Secular: "bg-yellow-400",
    Religious: "bg-purple-500",
    Globalist: "bg-lime-500",
    Nationalist: "bg-rose-500",
  };

  // Hex colors for each trait for inline gradients (ensures no Tailwind purge issues)
  const traitHex = {
    Equity: "#10B981", // emerald-500
    "Free Market": "#F59E0B", // amber-500
    Libertarian: "#06B6D4", // cyan-500
    Authoritarian: "#8B5CF6", // purple-500
    Progressive: "#3B82F6", // blue-500
    Conservative: "#F97316", // orange-500
    Secular: "#64748B", // slate-500
    Religious: "#EC4899", // pink-500
    Globalist: "#6366F1", // indigo-500
    Nationalist: "#EF4444", // red-500
  };

  // Explicit class maps to avoid Tailwind purging dynamic classes
  const fromSoft = {
    Equity: "from-emerald-50",
    "Free Market": "from-amber-50",
    Libertarian: "from-cyan-50",
    Authoritarian: "from-purple-50",
    Progressive: "from-blue-50",
    Conservative: "from-orange-50",
    Secular: "from-slate-50",
    Religious: "from-pink-50",
    Globalist: "from-indigo-50",
    Nationalist: "from-red-50",
  };
  const toSoft = {
    Equity: "to-emerald-100",
    "Free Market": "to-amber-100",
    Libertarian: "to-cyan-100",
    Authoritarian: "to-purple-100",
    Progressive: "to-blue-100",
    Conservative: "to-orange-100",
    Secular: "to-slate-100",
    Religious: "to-pink-100",
    Globalist: "to-indigo-100",
    Nationalist: "to-red-100",
  };
  const fromStrong = {
    Equity: "from-emerald-100",
    "Free Market": "from-amber-100",
    Libertarian: "from-cyan-100",
    Authoritarian: "from-purple-100",
    Progressive: "from-blue-100",
    Conservative: "from-orange-100",
    Secular: "from-slate-100",
    Religious: "from-pink-100",
    Globalist: "from-indigo-100",
    Nationalist: "from-red-100",
  };
  const toStrong = {
    Equity: "to-emerald-200",
    "Free Market": "to-amber-200",
    Libertarian: "to-cyan-200",
    Authoritarian: "to-purple-200",
    Progressive: "to-blue-200",
    Conservative: "to-orange-200",
    Secular: "to-slate-200",
    Religious: "to-pink-200",
    Globalist: "to-indigo-200",
    Nationalist: "to-red-200",
  };
  const viaSoft = {
    Equity: "via-emerald-100",
    "Free Market": "via-amber-100",
    Libertarian: "via-cyan-100",
    Authoritarian: "via-purple-100",
    Progressive: "via-blue-100",
    Conservative: "via-orange-100",
    Secular: "via-slate-100",
    Religious: "via-pink-100",
    Globalist: "via-indigo-100",
    Nationalist: "via-red-100",
  };
  const viaStrong = {
    Equity: "via-emerald-200",
    "Free Market": "via-amber-200",
    Libertarian: "via-cyan-200",
    Authoritarian: "via-purple-200",
    Progressive: "via-blue-200",
    Conservative: "via-orange-200",
    Secular: "via-slate-200",
    Religious: "via-pink-200",
    Globalist: "via-indigo-200",
    Nationalist: "via-red-200",
  };
  const getGradient = (traitA, traitB, traitC, strength = "soft") => {
    const base = "bg-gradient-to-br";
    const f = strength === "strong" ? fromStrong : fromSoft;
    const v = strength === "strong" ? viaStrong : viaSoft;
    const t = strength === "strong" ? toStrong : toSoft;
    const fromCls = f[traitA] || "from-gray-50";
    const viaCls = v[traitC] || "via-gray-100";
    const toCls = t[traitB] || "to-gray-100";
    return `${base} ${fromCls} ${viaCls} ${toCls}`;
  };

  const traitSoft = {
    Equity: "bg-blue-100",
    "Free Market": "bg-green-100",
    Libertarian: "bg-teal-100",
    Authoritarian: "bg-orange-100",
    Progressive: "bg-sky-100",
    Conservative: "bg-red-100",
    Secular: "bg-yellow-100",
    Religious: "bg-purple-100",
    Globalist: "bg-lime-100",
    Nationalist: "bg-rose-100",
  };
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

  const traitBgSoft = {
    Equity: "bg-emerald-50",
    "Free Market": "bg-amber-50",
    Libertarian: "bg-cyan-50",
    Authoritarian: "bg-purple-50",
    Progressive: "bg-blue-50",
    Conservative: "bg-orange-50",
    Secular: "bg-slate-50",
    Religious: "bg-pink-50",
    Globalist: "bg-indigo-50",
    Nationalist: "bg-red-50",
  };

  const traitBorderSoft = {
    Equity: "border-blue-200",
    "Free Market": "border-green-200",
    Libertarian: "border-teal-200",
    Authoritarian: "border-orange-200",
    Progressive: "border-sky-200",
    Conservative: "border-red-200",
    Secular: "border-yellow-200",
    Religious: "border-purple-200",
    Globalist: "border-lime-200",
    Nationalist: "border-rose-200",
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all w-full text-center focus:outline-none focus:ring-2 ${
              selectedFilters.includes(trait)
                ? `${traitColor[trait] || "bg-primary-maroon"} text-white shadow`
                : isTraitDisabled(trait)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : `bg-gray-100 ${traitSoft[trait] || "text-gray-700 ring-gray-300 hover:ring-gray-400"} ring-1`
            }`}
            disabled={isTraitDisabled(trait)}
            aria-pressed={selectedFilters.includes(trait)}
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
                {filteredArchetypes.map((archetype) => {
                  const activeTrait = selectedFilters.find((t) => archetype.traits.includes(t));
                  const firstTrait = archetype.traits?.[0];
                  const secondTrait = archetype.traits?.[1] || firstTrait;
                  const thirdTrait = archetype.traits?.[2] || secondTrait;
                  const softGrad = getGradient(firstTrait, secondTrait, thirdTrait, "soft");
                  const softRing = traitBorderSoft[firstTrait] || "border-gray-200";
                  // When filtered, use active + next two traits for richer gradient
                  const strongGrad = activeTrait ? getGradient(activeTrait, secondTrait, thirdTrait, "strong") : softGrad;
                  const strongRing = activeTrait ? (traitBorderSoft[activeTrait] || softRing) : softRing;
                  const cardBg = "bg-white";
                  const cardBorder = selectedFilters.length === 0 ? softRing : (activeTrait ? strongRing : "border-gray-200");
                  return (
                  <Link
                    href={`/archetypes/${archetype.slug}`}
                    key={archetype.id}
                    className={`group flex p-0 flex-col h-full rounded-xl border ${cardBorder} ${cardBg} shadow-sm overflow-hidden transform transition-all hover:scale-[1.02] hover:shadow-md`}
                    shallow={false}
                  >
                    <div className={`h-1 w-full ${selectedFilters.length === 0 ? (traitColor[firstTrait] || "bg-primary-maroon") : (activeTrait ? (traitColor[activeTrait] || "bg-primary-maroon") : "bg-gray-200")}`}></div>
                    <div className={`p-8 bg-transparent`}>
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
                                  ? (dotColor[trait] || traitColor[trait] || "bg-primary-maroon")
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
                    </div>
                  </Link>
                );})}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
