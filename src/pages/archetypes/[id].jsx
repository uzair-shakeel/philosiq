import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaStar,
  FaLightbulb,
  FaUsers,
  FaComments,
} from "react-icons/fa";

export default function ArchetypeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [currentArchetype, setCurrentArchetype] = useState(null);

  const archetypes = {
    elpsg: {
      id: "the-utopian",
      name: "The Utopian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "Imagine boldly. Innovate freely. Uplift all.",
      introduction:
        "As an ELPSG (The Utopian), you likely envision a world shaped by fairness, freedom, and progress. You tend to support reducing economic inequality, protecting personal liberties, and embracing change as a path toward a better future. With a generally secular outlook and a broad, global perspective, you often see cooperation and innovation as important tools for addressing the world's challenges. Your ideal society is probably one where individuals can thrive without oppressive systems, and where justice is thoughtfully balanced with opportunity.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
      famousPeople: [
        {
          name: "Ted Lasso",
          role: "Ted Lasso",
          image: "/images/famous-people/ted-lasso.png",
        },
        { name: "Aang", 
          role: "Avatar: The Last Airbender",
          image: "/images/famous-people/aang.png",
        },
        { name: "Hermione Granger", 
         role: "Harry Potter", 
         image: "/images/famous-people/hermione-granger.png",
        },
        { name: "Galadriel", 
         role: "The Rings of Power", 
         image: "/images/famous-people/galadriel.png",        
        }
      ],

      color: "from-blue-600 to-green-500",
    },
    elpsn: {
      id: "reformer",
      name: "The Reformer",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      description: "Progress with roots. Freedom with unity.",
      introduction:
        "As an ELPSN (The Reformer), you likely value equity, personal freedom, and progress, while maintaining a strong sense of national identity. You tend to support policies that promote fairness and social change, but within the context of preserving cultural or national cohesion. With a generally secular worldview, you're probably more focused on practical solutions than tradition, and you often see reform as the path to a better future—balancing innovation with a grounded sense of belonging.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
          famousPeople: [
            {
              name: "Atticus Finch",
              role: "To Kill a Mockingbird",
              image: "/images/famous-people/atticus-finch.png",
            },
            {
              name: "Sam Seaborn",
              role: "The West Wing",
              image: "/images/famous-people/sam-seaborn.png",
            },
            {
              name: "Peggy Olson",
              role: "Mad Men",
              image: "/images/famous-people/peggy-olson.png",
            },
            {
              name: "T'Challa",
              role: "Black Panther",
              image: "/images/famous-people/tchalla.png",
            }
          ],
      
      color: "from-green-600 to-blue-400",
    },
    elprg: {
      id: "prophet",
      name: "The Prophet",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      description: "Guided by faith. Driven by justice.",
      introduction:
        "As an ELPRG (The Prophet), you likely believe in a future shaped by equity, freedom, and progress, guided by a strong moral or spiritual foundation. You tend to see personal liberty and global cooperation as essential to building a just world, and your religious or spiritual beliefs may inspire a deep sense of purpose and vision for what society could become. With a progressive mindset and a global outlook, you often view change not just as necessary, but as a calling—something rooted in both compassion and conviction.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
        famousPeople: [
          {
            name: "Morpheus",
            role: "The Matrix",
            image: "/images/famous-people/morpheus.png",
          },
          {
            name: "Bran Stark",
            role: "Game of Thrones",
            image: "/images/famous-people/bran-stark.png",
          },
          {
            name: "Obi-Wan Kenobi",
            role: "Star Wars",
            image: "/images/famous-people/obi-wan-kenobi.png",
          },
          {
            name: "Gandalf",
            role: "The Lord of the Rings",
            image: "/images/famous-people/gandalf.png",
          }
        ],
     
      color: "from-indigo-700 to-purple-500",
    },
    elprn: {
      id: "firebrand",
      name: "The Firebrand",
      traits: [
        "Equity",
        "Libertarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      description: "Change the world by conviction and fire.",
      introduction:
        "As an ELPRN (The Firebrand), you likely champion equity, freedom, and progress, while drawing strength from your religious or spiritual beliefs and a strong sense of national identity. You may see reform and justice as moral imperatives, driven by both personal conviction and a desire to uplift your community or nation. With a passion for change and a clear sense of purpose, you tend to challenge the status quo—believing that a better society is possible when values, tradition, and liberty work together.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
          famousPeople: [
            {
              name: "V",
              role: "V for Vendetta",
              image: "/images/famous-people/v.png",
            },
            {
              name: "Katniss Everdeen",
              role: "The Hunger Games",
              image: "/images/famous-people/katniss-everdeen.png",
            },
            {
              name: "Killmonger",
              role: "Black Panther",
              image: "/images/famous-people/killmonger.png",
            },
            {
              name: "Ragnar Lothbrok",
              role: "Vikings",
              image: "/images/famous-people/ragnar-lothbrok.png",
            }
          ],

      color: "from-red-600 to-orange-500",
    },
    elcsg: {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Libertarian", "Conservative", "Secular", "Globalist"],
      description: "Balance reason with purpose. Think deeper.",
      introduction:
        "As an ELCSG (The Philosopher), you likely value equity and individual freedom, while leaning toward a more cautious, thoughtful approach to change. With a secular perspective and a global outlook, you may believe that reason, dialogue, and shared responsibility are key to creating a stable and just society. You tend to appreciate tradition where it serves the common good, but you're also open to ideas that promote fairness and long-term progress. Your vision is often guided by a balance of principle, pragmatism, and curiosity about the bigger picture.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
          famousPeople: [
            {
              name: "Jean-Luc Picard",
              role: "Star Trek: TNG",
              image: "/images/famous-people/jean-luc-picard.png",
            },
            {
              name: "Lisa Simpson",
              role: "The Simpsons",
              image: "/images/famous-people/lisa-simpson.png",
            },
            {
              name: "Chidi Anagonye",
              role: "The Good Place",
              image: "/images/famous-people/chidi-anagonye.png",
            },
            {
              name: "Simone",
              role: "The Good Place",
              image: "/images/famous-people/simone.png",
            }
          ],

      color: "from-gray-600 to-blue-400",
    },
    elcsn: {
      id: "localist",
      name: "The Localist",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      description: "Change begins at home. Tradition with care.",
      introduction:
        "As an ELCSN (The Localist), you likely value equity and personal freedom, while placing importance on tradition, community, and national identity. With a secular mindset, you may approach social issues through a practical and reasoned lens, favoring solutions that respect both individual rights and cultural cohesion. You tend to believe that meaningful change happens close to home, and that preserving local values can coexist with a commitment to fairness and opportunity. Your perspective often blends caution with care—seeking progress that's grounded and sustainable.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Ron Swanson",
                role: "Parks and Recreation",
                image: "/images/famous-people/ron-swanson.png",
              },
              {
                name: "John Dutton",
                role: "Yellowstone",
                image: "/images/famous-people/john-dutton.png",
              },
              {
                name: "Hank Hill",
                role: "King of the Hill",
                image: "/images/famous-people/hank-hill.png",
              },
              {
                name: "Andy Taylor",
                role: "The Andy Griffith Show",
                image: "/images/famous-people/andy-taylor.png",
              }
            ],

      color: "from-yellow-700 to-orange-400",
    },
    elcrg: {
      id: "missionary",
      name: "The Missionary",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      description: "Serve with purpose. Lead with compassion.",
      introduction:
        "As an ELCRG (The Missionary), you likely believe in equity and individual freedom, guided by a strong moral or religious framework. You may value tradition and personal responsibility, while also embracing a global perspective that emphasizes compassion, service, and shared human dignity. With a thoughtful balance between faith and principle, you tend to see progress as something best achieved through purpose-driven action—uplifting others while staying true to core beliefs. Your vision often blends timeless values with a hope for a more just and connected world.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Wonder Woman",
                role: "Wonder Woman",
                image: "/images/famous-people/wonder-woman.png",
              },
              {
                name: "Jon Snow",
                role: "Game of Thrones",
                image: "/images/famous-people/jon-snow.png",
              },
              {
                name: "Leslie Knope",
                role: "Parks and Recreation",
                image: "/images/famous-people/leslie-knope.png",
              },
              {
                name: "Alma Garret",
                role: "Deadwood",
                image: "/images/famous-people/alma-garret.png",
              }
            ],

      color: "from-teal-600 to-green-400",
    },
    elcrn: {
      id: "guardian",
      name: "The Guardian",
      traits: [
        "Equity",
        "Libertarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      description: "Honor the past. Protect the future.",
      introduction:
        "As an ELCRN (The Guardian), you likely hold equity and personal freedom in high regard, while also valuing tradition, faith, and a strong sense of national identity. Guided by a moral or religious framework, you may see your role as protecting what matters—whether it's community, culture, or foundational values. You tend to believe that a just society is one that honors both individual dignity and collective responsibility. Your outlook often blends conviction with care, aiming to preserve what works while ensuring everyone has a fair chance to thrive.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Brienne of Tarth",
                role: "Game of Thrones",
                image: "/images/famous-people/brienne-of-tarth.png",
              },
              {
                name: "Hopper",
                role: "Stranger Things",
                image: "/images/famous-people/hopper.png",
              },
              {
                name: "Uncle Iroh",
                role: "Avatar: The Last Airbender",
                image: "/images/famous-people/uncle-iroh.png",
              },
              {
                name: "Teal'c",
                role: "Stargate SG-1",
                image: "/images/famous-people/tealc.png",
              }
            ],

      color: "from-amber-700 to-red-400",
    },
    eapsg: {
      id: "technocrat",
      name: "The Technocrat",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      description: "Lead with data. Build with vision.",
      introduction:
        "As an EAPSG (The Technocrat), you likely believe in equity and progress, with a focus on structure, expertise, and large-scale solutions. With a secular and globally-minded perspective, you may see data, science, and organized systems as key tools for building a fairer, more efficient society. You tend to value order and coordination when addressing complex challenges, aiming for outcomes that serve the greater good. Your approach often reflects a belief that meaningful progress comes from informed planning, innovation, and collective responsibility.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Spock",
                role: "Star Trek",
                image: "/images/famous-people/spock.png",
              },
              {
                name: "Harold Finch",
                role: "Person of Interest",
                image: "/images/famous-people/harold-finch.png",
              },
              {
                name: "J.A.R.V.I.S.",
                role: "Iron Man",
                image: "/images/famous-people/jarvis.png",
              },
              {
                name: "Chloe O’Brian",
                role: "24",
                image: "/images/famous-people/chloe-obrian.png",
              }
            ],

      color: "from-sky-600 to-cyan-400",
    },
    eapsn: {
      id: "enforcer",
      name: "The Enforcer",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      description: "Discipline for justice. Order for equity.",
      introduction:
        "As an EAPSN (The Enforcer), you likely believe in equity and progress, paired with a strong sense of national identity and the importance of order. With a secular outlook, you may approach social change through a practical and structured lens, favoring decisive action and collective discipline to achieve fairness and stability. You tend to see a just society as one that protects its people, upholds shared values, and ensures that no one is left behind—even if that requires firm guidance and clear rules. Your vision often blends idealism with a focus on security and cohesion.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Jack Bauer",
                role: "24",
                image: "/images/famous-people/jack-bauer.png",
              },
              {
                name: "Vic Mackey",
                role: "The Shield",
                image: "/images/famous-people/vic-mackey.png",
              },
              {
                name: "Frank Castle",
                role: "The Punisher",
                image: "/images/famous-people/frank-castle.png",
              },
              {
                name: "Elliot Stabler",
                role: "Law & Order: SVU",
                image: "/images/famous-people/elliot-stabler.png",
              }
            ],

      color: "from-slate-700 to-gray-400",
    },
    eaprg: {
      id: "zealot",
      name: "The Zealot",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      description: "Faith fuels progress. Purpose drives power.",
      introduction:
        "As an EAPRG (The Zealot), you likely believe in equity and progress, driven by a deep moral or spiritual conviction. With a global perspective, you may see your values as part of a broader mission to uplift humanity and correct injustice. You tend to favor strong, coordinated efforts to bring about meaningful change, believing that structure and purpose are essential in achieving a better world. Your vision often blends faith, idealism, and determination—seeking transformation that reflects both moral clarity and a commitment to the common good.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "John Locke",
                role: "Lost",
                image: "/images/famous-people/john-locke.png",
              },
              {
                name: "Eli Sunday",
                role: "There Will Be Blood",
                image: "/images/famous-people/eli-sunday.png",
              },
              {
                name: "Lysa Arryn",
                role: "Game of Thrones",
                image: "/images/famous-people/lysa-arryn.png",
              },
              {
                name: "Serena Joy Waterford",
                role: "The Handmaid’s Tale",
                image: "/images/famous-people/serena-joy-waterford.png",
              }
            ],
      color: "from-purple-700 to-pink-500",
    },
    eaprn: {
      id: "purist",
      name: "The Purist",
      traits: [
        "Equity",
        "Authoritarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      description: "Moral clarity. National strength.",
      introduction:
        "As an EAPRN (The Purist), you likely believe in equity and progress, guided by strong moral or religious principles and a deep sense of national identity. You may see structure, discipline, and shared values as essential to building a just and unified society. With a focus on moral clarity and collective purpose, you tend to support firm action in pursuit of what you see as a better, more righteous future. Your vision often blends conviction, tradition, and reform—seeking to uplift your community while holding true to the beliefs that ground it.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Dolores Umbridge",
                role: "Harry Potter",
                image: "/images/famous-people/dolores-umbridge.png",
              },
              {
                name: "Margaery Tyrell",
                role: "Game of Thrones",
                image: "/images/famous-people/margaery-tyrell.png",
              },
              {
                name: "Ned Flanders",
                role: "The Simpsons",
                image: "/images/famous-people/ned-flanders.png",
              },
              {
                name: "Sybil Crawley",
                role: "Downton Abbey",
                image: "/images/famous-people/sybil-crawley.png",
              }
            ],

      color: "from-rose-700 to-red-500",
    },
    eacsg: {
      id: "commander",
      name: "The Commander",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      description: "Order, strength, and strategic vision.",
      introduction:
        "As an EACSG (The Commander), you likely value equity and stability, favoring order, structure, and strategic leadership to maintain social cohesion. With a secular and globally-minded perspective, you may see strong institutions and coordinated efforts as essential to addressing complex challenges. You tend to prefer steady, disciplined approaches to progress—believing that fairness is best achieved when systems are well-organized and responsibly managed. Your vision often combines a respect for tradition with a readiness to lead, especially when clarity and control are needed.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Amanda Waller",
                role: "Peacemaker",
                image: "/images/famous-people/amanda-waller.png",
              },
              {
                name: "General Leia",
                role: "Star Wars",
                image: "/images/famous-people/general-leia.png",
              },
              {
                name: "Commander Shepard",
                role: "Mass Effect",
                image: "/images/famous-people/commander-shepard.png",
              },
              {
                name: "William Adama",
                role: "Battlestar Galactica",
                image: "/images/famous-people/william-adama.png",
              }
            ],

      color: "from-blue-800 to-gray-600",
    },
    eacsn: {
      id: "steward",
      name: "The Steward",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      description: "Preserve what works. Guide what grows.",
      introduction:
        "As an EACSN (The Steward), you likely believe in equity and order, with a strong respect for tradition, responsibility, and national cohesion. With a secular and pragmatic outlook, you may see your role as one of careful guidance—protecting what works while ensuring fairness and stability within your community or country. You tend to value structure and discipline, believing that a just society requires strong leadership and shared values. Your vision often emphasizes preservation with purpose—maintaining balance while looking out for the common good.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Samwise Gamgee",
                role: "LOTR",
                image: "/images/famous-people/samwise-gamgee.png",
              },
              {
                name: "Jim Halpert",
                role: "The Office",
                image: "/images/famous-people/jim-halpert.png",
              },
              {
                name: "Ben Wyatt",
                role: "Parks and Recreation",
                image: "/images/famous-people/ben-wyatt.png",
              },
              {
                name: "Carson",
                role: "Downton Abbey",
                image: "/images/famous-people/carson.png",
              }
            ],

      color: "from-amber-700 to-lime-500",
    },
    eacrg: {
      id: "shepherd",
      name: "The Shepherd",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      description: "Lead with faith. Guard with wisdom.",
      introduction:
        "As an EACRG (The Shepherd), you likely value equity and stability, guided by a strong moral or religious framework and a global sense of responsibility. You may believe that lasting order and fairness come from a combination of tradition, structure, and compassionate leadership. With a focus on guiding others and upholding shared values, you tend to support well-organized systems that serve the common good. Your vision often blends care and conviction—seeking to lead with purpose, protect what matters, and uplift society through faith and principled direction.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Father Brown",
                role: "Father Brown",
                image: "/images/famous-people/father-brown.png",
              },
              {
                name: "Reverend TimTom",
                role: "The Middle",
                image: "/images/famous-people/reverend-timtom.png",
              },
              {
                name: "Claire Fraser",
                role: "Outlander",
                image: "/images/famous-people/claire-fraser.png",
              },
              {
                name: "John Book",
                role: "Witness",
                image: "/images/famous-people/john-book.png",
              }
            ],

      color: "from-green-700 to-teal-400",
    },
    eacrn: {
      id: "high-priest",
      name: "The High Priest",
      traits: [
        "Equity",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      description: "Tradition guides us. Faith unites us. Order protects us.",
      introduction:
        "As an EACRN (The High Priest), you likely value economic fairness, strong leadership, traditional values, and religious principles, all while maintaining a strong sense of national identity. You may see yourself as a guardian of both moral and social order, believing that structure and faith provide the foundation for a just society. With a respect for established institutions and a belief in the importance of cultural cohesion, you often advocate for policies that protect communal values and provide stability. Your outlook combines conviction with care—seeking to preserve what's sacred while ensuring the community's needs are met.",
      strengths: [
        "Equity-minded individuals are deeply empathetic, prioritizing fairness, dignity, and social responsibility for all members of society, often advocating for the marginalized and disadvantaged.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Equity-minded individuals may overestimate the ability of centralized systems to engineer fairness, sometimes underappreciating the complexity and unintended consequences of interventionist policies.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Reverend Matt Jamison",
                role: "The Leftovers",
                image: "/images/famous-people/reverend-matt-jamison.png",
              },
              {
                name: "Gaius",
                role: "Battlestar Galactica",
                image: "/images/famous-people/gaius.png",
              },
              {
                name: "Mother Abbess",
                role: "The Sound of Music",
                image: "/images/famous-people/mother-abbess.png",
              },
              {
                name: "Sister Aloysius",
                role: "Doubt",
                image: "/images/famous-people/sister-aloysius.png",
              }
            ],

      color: "from-purple-700 to-red-600",
    },
    flpsg: {
      id: "futrist",
      name: "The Futurist",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      description: "Invent the future. Believe in potential.",
      introduction:
        "As a FLPSG (The Futurist), you likely believe in individual freedom, innovation, and progress, with a focus on global cooperation and a secular outlook. You may see open markets and technological advancement as key drivers of positive change, helping to create a more dynamic and equitable world. With a forward-looking mindset, you tend to embrace new ideas and bold solutions, trusting that creativity and personal liberty can work hand in hand to shape a better future. Your vision often blends optimism, openness, and a belief in human potential.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Dolores Abernathy",
                role: "Westworld",
                image: "/images/famous-people/dolores-abernathy.png",
              },
              {
                name: "Michael Burnham",
                role: "Star Trek: Discovery",
                image: "/images/famous-people/michael-burnham.png",
              },
              {
                name: "Nathan Bateman",
                role: "Ex Machina",
                image: "/images/famous-people/nathan-bateman.png",
              },
              {
                name: "Angela Abar",
                role: "Watchmen",
                image: "/images/famous-people/angela-abar.png",
              }
            ],

      color: "from-cyan-500 to-blue-400",
    },
    flpsn: {
      id: "mavrick",
      name: "The Maverick",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      description: "Think boldly. Speak freely. Stand firm.",
      introduction:
        "As a FLPSN (The Maverick), you likely value personal freedom, innovation, and progress, while also holding a strong appreciation for national identity and cultural roots. With a secular and independent mindset, you may favor open markets and individual choice as engines for growth and change. You tend to challenge convention and think outside the box, believing that real progress happens when people are free to experiment, speak their minds, and chart their own path—within a framework that still honors community and country. Your vision often blends boldness with a grounded sense of belonging.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Malcolm Reynolds",
                role: "Firefly",
                image: "/images/famous-people/malcolm-reynolds.png",
              },
              {
                name: "Tony Stark",
                role: "Iron Man",
                image: "/images/famous-people/tony-stark.png",
              },
              {
                name: "Jessica Jones",
                role: "Jessica Jones",
                image: "/images/famous-people/jessica-jones.png",
              },
              {
                name: "Geralt of Rivia",
                role: "The Witcher",
                image: "/images/famous-people/geralt-of-rivia.png",
              }
            ],

      color: "from-orange-600 to-yellow-400",
    },
    flprg: {
      id: "evangelist",
      name: "The Evangelist",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      description: "Inspire through belief. Empower with vision.",
      introduction:
        "As a FLPRG (The Evangelist), you likely believe in personal freedom, innovation, and global cooperation, all guided by a strong moral or religious foundation. You may see open markets and individual empowerment as tools for uplifting communities and driving meaningful progress. With a blend of spiritual conviction and forward-thinking ideals, you tend to promote change that honors both personal belief and collective well-being. Your vision often combines purpose, optimism, and outreach—seeking to inspire others and build a better world through both faith and freedom.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Elphaba",
                role: "Wicked",
                image: "/images/famous-people/elphaba.png",
              },
              {
                name: "Saul Goodman",
                role: "Better Call Saul",
                image: "/images/famous-people/saul-goodman.png",
              },
              {
                name: "Harriet Tubman",
                role: "Underground",
                image: "/images/famous-people/harriet-tubman.png",
              },
              {
                name: "Kunta Kinte",
                role: "Roots",
                image: "/images/famous-people/kunta-kinte.png",
              }
            ],

      color: "from-teal-600 to-blue-400",
    },
    flprn: {
      id: "dissenter",
      name: "The Dissenter",
      traits: [
        "Free Market",
        "Libertarian",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      description: "Defy the norm. Stand with conviction.",
      introduction:
        "As a FLPRN (The Dissenter), you likely value personal freedom, innovation, and progress, while being grounded in your faith and a strong sense of national identity. You may see individual empowerment and open markets as essential to human flourishing, but you also believe that moral conviction and cultural heritage have an important role to play in shaping society. With a spirit of independence, you tend to challenge dominant narratives—pushing for change that aligns with both your principles and your community's values. Your vision often blends courage, belief, and a commitment to charting your own path.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Lisbeth Salander",
                role: "The Girl with the Dragon Tattoo",
                image: "/images/famous-people/lisbeth-salander.png",
              },
              {
                name: "Clarisse McClellan",
                role: "Fahrenheit 451",
                image: "/images/famous-people/clarisse-mcclellan.png",
              },
              {
                name: "Howard Beale",
                role: "Network",
                image: "/images/famous-people/howard-beale.png",
              },
              {
                name: "Elliot Alderson",
                role: "Mr. Robot",
                image: "/images/famous-people/elliot-alderson.png",
              }
            ],

      color: "from-red-600 to-rose-400",
    },
    flcsg: {
      id: "globalist",
      name: "The Globalist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      description: "Freedom with cooperation. Tradition with progress.",
      introduction:
        "As a FLCSG (The Globalist), you likely value personal freedom, open markets, and time-tested principles, all within a globally connected framework. With a secular and pragmatic outlook, you may believe that prosperity and stability come from responsible individualism, free enterprise, and international cooperation. You tend to favor gradual progress rooted in tradition, seeing global engagement as a way to promote opportunity, peace, and mutual benefit. Your vision often blends practicality with a broad perspective—seeking a world where freedom and order can thrive side by side.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "President Jed Bartlet",
                role: "The West Wing",
                image: "/images/famous-people/president-jed-bartlet.png",
              },
              {
                name: "Jean-Michel Basquiat",
                role: "Basquiat",
                image: "/images/famous-people/jean-michel-basquiat.png",
              },
              {
                name: "Maeve Millay",
                role: "Westworld",
                image: "/images/famous-people/maeve-millay.png",
              },
              {
                name: "Lara Croft",
                role: "Tomb Raider",
                image: "/images/famous-people/lara-croft.png",
              }
            ],

      color: "from-blue-500 to-green-400",
    },
    flcsn: {
      id: "patriot",
      name: "The Patriot",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      description: "Pride in nation. Strength in liberty.",
      introduction:
        "As a FLCSN (The Patriot), you likely value personal freedom, free markets, and traditional values, grounded in a strong sense of national pride and cultural identity. With a secular and pragmatic approach, you may see individual responsibility and economic liberty as keys to a thriving society. You tend to believe that preserving national character and sovereignty is important—even as the world changes—favoring a steady, principled path forward. Your vision often blends independence, heritage, and a belief in the strength of a self-reliant people.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Jack Ryan",
                role: "Jack Ryan",
                image: "/images/famous-people/jack-ryan.png",
              },
              {
                name: "Steve Rogers",
                role: "Captain America",
                image: "/images/famous-people/steve-rogers.png",
              },
              {
                name: "Francis Underwood",
                role: "House of Cards",
                image: "/images/famous-people/francis-underwood.png",
              },
              {
                name: "George Washington",
                role: "Turn: Washington’s Spies",
                image: "/images/famous-people/george-washington.png",
              }
            ],

      color: "from-red-700 to-blue-600",
    },
    flcrg: {
      id: "industrialist",
      name: "The Industrialist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      description: "Work with values. Build across borders.",
      introduction:
        "As a FLCRG (The Industrialist), you likely believe in personal freedom, open markets, and traditional values, guided by a strong moral or religious foundation and a global perspective. You may see enterprise, innovation, and discipline as driving forces behind prosperity—not just for individuals, but for society as a whole. With a focus on both principle and progress, you tend to support systems that reward effort, uphold values, and connect communities across borders. Your vision often blends faith, ambition, and pragmatism—seeking to build a better world through hard work and enduring ideals.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Tony Stark Sr.",
                role: "Marvel Universe",
                image: "/images/famous-people/tony-stark-sr.png",
              },
              {
                name: "Hank Rearden",
                role: "Atlas Shrugged",
                image: "/images/famous-people/hank-rearden.png",
              },
              {
                name: "Lucious Lyon",
                role: "Empire",
                image: "/images/famous-people/lucious-lyon.png",
              },
              {
                name: "Logan Roy",
                role: "Succession",
                image: "/images/famous-people/logan-roy.png",
              }
            ],

      color: "from-yellow-600 to-gray-400",
    },
    flcrn: {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: [
        "Free Market",
        "Libertarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      description: "Preserve the sacred. Empower the individual.",
      introduction:
        "As a FLCRN (The Traditionalist), you likely value personal freedom, open markets, and enduring moral or religious principles, all rooted in a strong sense of national identity. You may believe that a healthy society thrives when individuals are empowered, communities are grounded in shared values, and cultural heritage is preserved. With a respect for time-tested ways and a belief in personal responsibility, you tend to favor steady progress that honors both faith and tradition. Your vision often blends independence, conviction, and a deep commitment to preserving what matters most.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Libertarian-minded individuals are fiercely principled defenders of individual liberty, believing that personal freedom, voluntary association, and minimal coercion are essential to a just society.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Libertarian-minded individuals may struggle to address large-scale collective challenges—such as infrastructure, public health, or environmental crises—that require coordinated action beyond individual choice.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Cora Crawley",
                role: "Downton Abbey",
                image: "/images/famous-people/cora-crawley.png",
              },
              {
                name: "Robert Crawley",
                role: "Downton Abbey",
                image: "/images/famous-people/robert-crawley.png",
              },
              {
                name: "Marilla Cuthbert",
                role: "Anne with an E",
                image: "/images/famous-people/marilla-cuthbert.png",
              },
              {
                name: "Red Forman",
                role: "That '70s Show",
                image: "/images/famous-people/red-forman.png",
              }
            ],

      color: "from-amber-700 to-emerald-500",
    },
    fapsg: {
      id: "overlord",
      name: "The Overlord",
      traits: [
        "Free Market",
        "Authority",
        "Progressive",
        "Secular",
        "Globalist",
      ],
      description: "Control the chaos. Command the future.",
      introduction:
        "As a FAPSG (The Overlord), you likely believe in progress and global cooperation, with an emphasis on structure, efficiency, and economic freedom. With a secular perspective and a strong belief in coordinated leadership, you may see centralized systems and strategic planning as essential tools for driving innovation and large-scale improvement. You tend to support bold, top-down solutions that aim to solve complex problems and elevate society. Your vision often blends ambition, order, and forward-thinking—focused on creating a more advanced and equitable world through strong direction and purposeful control.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Tywin Lannister",
                role: "Game of Thrones",
                image: "/images/famous-people/tywin-lannister.png",
              },
              {
                name: "Miranda Priestly",
                role: "The Devil Wears Prada",
                image: "/images/famous-people/miranda-priestly.png",
              },
              {
                name: "Lord Vetinari",
                role: "Discworld",
                image: "/images/famous-people/lord-vetinari.png",
              },
              {
                name: "Frank Underwood Sr.",
                role: "Fan theory/extension",
                image: "/images/famous-people/frank-underwood-sr.png",
              }
            ],

      color: "from-black to-gray-700",
    },
    fapsn: {
      id: "corporatist",
      name: "The Corporatist",
      traits: [
        "Free Market",
        "Authority",
        "Progressive",
        "Secular",
        "Nationalist",
      ],
      description: "Strategize for power. Govern for progress.",
      introduction:
        "As a FAPSN (The Corporatist), you likely value economic freedom and national strength, paired with a belief in structured, top-down approaches to progress. With a secular outlook and a focus on efficiency and order, you may see coordinated leadership—especially between state and industry—as key to driving innovation and stability. You tend to favor pragmatic solutions that serve both the nation and its economy, believing that prosperity and unity can be achieved through strategic planning and disciplined governance. Your vision often blends progress with control, aiming to build a strong and forward-moving society.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Raymond Reddington",
                role: "The Blacklist",
                image: "/images/famous-people/raymond-reddington.png",
              },
              {
                name: "Daniel Plainview",
                role: "There Will Be Blood",
                image: "/images/famous-people/daniel-plainview.png",
              },
              {
                name: "Christina Yang",
                role: "Grey's Anatomy",
                image: "/images/famous-people/christina-yang.png",
              },
              {
                name: "Arthur Jensen",
                role: "Network",
                image: "/images/famous-people/arthur-jensen.png",
              }
            ],

      color: "from-gray-700 to-blue-400",
    },
    faprg: {
      id: "moralizer",
      name: "The Moralizer",
      traits: [
        "Free Market",
        "Authority",
        "Progressive",
        "Religious",
        "Globalist",
      ],
      description: "Construct with purpose. Lead with faith.",
      introduction:
        "As a FAPRG (The Moralizer), you likely believe in progress and global cooperation, guided by strong moral or religious convictions and a belief in structured, purposeful leadership. You may see economic freedom and innovation as tools to uplift society—so long as they align with clear ethical principles. With a focus on discipline, order, and a higher sense of purpose, you tend to support firm but value-driven approaches to change. Your vision often blends faith, structure, and ambition—seeking to shape a better world through both moral clarity and decisive action.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Sheldon Cooper",
                role: "The Big Bang Theory",
                image: "/images/famous-people/sheldon-cooper.png",
              },
              {
                name: "Judge Claude Frollo",
                role: "Hunchback of Notre Dame",
                image: "/images/famous-people/judge-claude-frollo.png",
              },
              {
                name: "Skyler White",
                role: "Breaking Bad",
                image: "/images/famous-people/skyler-white.png",
              },
              {
                name: "Monk",
                role: "Monk",
                image: "/images/famous-people/monk.png",
              }
            ],

      color: "from-purple-800 to-rose-600",
    },
    faprn: {
      id: "builder",
      name: "The Builder",
      traits: [
        "Free Market",
        "Authority",
        "Progressive",
        "Religious",
        "Nationalist",
      ],
      description: "Build with resolve. Shape with strength.",
      introduction:
        "As a FAPRN (The Builder), you likely believe in progress and national strength, guided by a strong moral or religious foundation and a commitment to order and structure. You may see economic freedom and personal ambition as powerful forces—best harnessed through disciplined leadership and shared values. With a focus on development, tradition, and unity, you tend to support purposeful action that reinforces both moral principles and national identity. Your vision often blends faith, structure, and a hands-on drive to construct a society where strength and virtue go hand in hand.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Progressive-minded individuals are forward-thinking and adaptive, embracing innovation, social reform, and the pursuit of a better future through continual improvement and openness to new ideas.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Progressive-minded individuals may too readily discard valuable traditions and historical lessons, sometimes embracing change for its own sake without fully considering long-term consequences.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Bob the Builder",
                role: "Bob the Builder",
                image: "/images/famous-people/bob-the-builder.png",
              },
              {
                name: "Fix-It Felix",
                role: "Wreck-It Ralph",
                image: "/images/famous-people/fix-it-felix.png",
              },
              {
                name: "Frank",
                role: "Hearts Beat Loud",
                image: "/images/famous-people/frank-hearts-beat-loud.png",
              },
              {
                name: "Mike Baxter",
                role: "Last Man Standing",
                image: "/images/famous-people/mike-baxter.png",
              }
            ],

      color: "from-amber-700 to-yellow-400",
    },
    facsg: {
      id: "executive",
      name: "The Executive",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Globalist",
      ],
      description: "Structure. Efficiency. Vision.",
      introduction:
        "As a FACSG (The Executive), you likely value order, efficiency, and economic freedom, with a pragmatic, secular outlook and a global perspective. You may believe that well-structured systems and strong leadership are essential for maintaining stability and driving prosperity. With a preference for clear rules and strategic coordination, you tend to support disciplined approaches to governance and business alike. Your vision often blends tradition with ambition—seeking a world where productivity, responsibility, and long-term planning lead the way.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Olivia Pope",
                role: "Scandal",
                image: "/images/famous-people/olivia-pope.png",
              },
              {
                name: "Logan Roy Jr.",
                role: "Succession",
                image: "/images/famous-people/logan-roy-jr.png",
              },
              {
                name: "Harvey Specter",
                role: "Suits",
                image: "/images/famous-people/harvey-specter.png",
              },
              {
                name: "Joan Holloway",
                role: "Mad Men",
                image: "/images/famous-people/joan-holloway.png",
              }
            ],

      color: "from-gray-800 to-blue-500",
    },
    facsn: {
      id: "ironhand",
      name: "The Ironhand",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Secular",
        "Nationalist",
      ],
      description: "Structure. Efficiency. Vision.",
      introduction:
        "As a FACSN (The Ironhand), you likely believe in strength, order, and economic freedom, grounded in a secular worldview and a strong sense of national pride. You may see discipline, structure, and decisive leadership as essential to maintaining stability and protecting the values you hold dear. With a preference for tradition and strategic control, you tend to support firm but focused governance that prioritizes national unity and self-reliance. Your vision often blends authority with responsibility—aiming to build a society that is secure, resilient, and built to last.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Secular-minded individuals approach the world through critical thinking and empirical evidence, relying on rational inquiry, scientific understanding, and objective reasoning to guide decisions.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Secular-minded individuals may undervalue the emotional, cultural, and ethical frameworks provided by religious traditions, sometimes alienating those who seek meaning beyond empirical reasoning.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Gustavo Fring",
                role: "Breaking Bad",
                image: "/images/famous-people/gustavo-fring.png",
              },
              {
                name: "Amanda Waller",
                role: "Suicide Squad (alt version)",
                image: "/images/famous-people/amanda-waller-alt.png",
              },
              {
                name: "Judge Dredd",
                role: "Dredd",
                image: "/images/famous-people/judge-dredd.png",
              },
              {
                name: "Tywin Lannister",
                role: "Game of Thrones (alt interpretation)",
                image: "/images/famous-people/tywin-lannister-alt.png",
              }
            ],

      color: "from-slate-800 to-red-600",
    },
    facrg: {
      id: "regent",
      name: "The Regent",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Globalist",
      ],
      description: "Rule with wisdom. Preserve with strength.",
      introduction:
        "As a FACRG (The Regent), you likely value order, faith, and economic freedom, guided by a strong moral framework and a global perspective. You may believe that prosperity and stability come from disciplined leadership, time-tested values, and responsible stewardship of both markets and institutions. With a focus on preserving what works while engaging with the wider world, you tend to support structured approaches that honor tradition while promoting long-term growth. Your vision often blends faith, structure, and purpose—seeking to uphold enduring principles in a rapidly changing world.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Globalist-minded individuals are globally aware and culturally flexible, recognizing interconnectedness across nations and embracing cooperation, mutual benefit, and diverse human experiences.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Globalist-minded individuals may underestimate the significance of national identity, local governance, and the unique challenges faced by distinct communities, risking overreach in pursuit of universal ideals.",
      ],
            famousPeople: [
              {
                name: "Queen Elizabeth II",
                role: "The Crown",
                image: "/images/famous-people/queen-elizabeth-ii.png",
              },
              {
                name: "King T’Chaka",
                role: "Black Panther",
                image: "/images/famous-people/king-tchaka.png",
              },
              {
                name: "Prince Zuko",
                role: "Avatar: The Last Airbender",
                image: "/images/famous-people/prince-zuko.png",
              },
              {
                name: "Viserys",
                role: "House of the Dragon",
                image: "/images/famous-people/viserys.png",
              }
            ],

      color: "from-indigo-800 to-emerald-500",
    },
    facrn: {
      id: "crusader",
      name: "The Crusader",
      traits: [
        "Free Market",
        "Authoritarian",
        "Conservative",
        "Religious",
        "Nationalist",
      ],
      description: "Defend your values. Stand your ground.",
      introduction:
        "As a FACRN (The Crusader), you likely value strength, tradition, and economic freedom, rooted in deep moral or religious convictions and a strong sense of national identity. You may believe that a just and stable society is built through disciplined leadership, cultural preservation, and a firm commitment to shared values. With a focus on order and purpose, you tend to support decisive action in defense of both faith and country. Your vision often blends conviction, structure, and loyalty—seeking to protect and uphold a way of life you believe is worth preserving.",
      strengths: [
        "Free Market-minded individuals are highly entrepreneurial and innovative, valuing personal initiative, competition, and the freedom to create wealth and drive progress without excessive external interference.",
        "Authoritarian-minded individuals are pragmatic and order-driven, capable of mobilizing resources and coordinating complex efforts quickly, especially in times of crisis or large-scale societal challenges.",
        "Conservative-minded individuals are grounded in tradition and cautious by nature, valuing the hard-earned wisdom of past generations and striving to preserve stability, order, and social cohesion.",
        "Religious-minded individuals are deeply rooted in moral conviction and community, drawing from faith-based principles that provide meaning, resilience, and a sense of shared purpose across generations.",
        "Nationalist-minded individuals are deeply loyal and community-oriented, prioritizing national sovereignty, cultural heritage, and the protection of local traditions and interests against outside forces.",
      ],
      weaknesses: [
        "Free Market-minded individuals may downplay systemic inequalities and external harms, assuming that free competition alone will correct imbalances without considering broader social costs.",
        "Authoritarian-minded individuals may suppress dissent and critical thought, risking the erosion of personal freedoms and fostering environments where power can be abused without accountability.",
        "Conservative-minded individuals may resist necessary reforms or fail to adapt to changing realities, risking stagnation or the entrenchment of outdated social structures.",
        "Religious-minded individuals may impose rigid moral frameworks on diverse populations, sometimes limiting pluralism and suppressing differing viewpoints in the pursuit of religious orthodoxy.",
        "Nationalist-minded individuals may foster exclusionary attitudes, resisting beneficial global cooperation and viewing external influences as inherently threatening rather than potentially enriching.",
      ],
            famousPeople: [
              {
                name: "Buffy Summers",
                role: "Buffy the Vampire Slayer",
                image: "/images/famous-people/buffy-summers.png",
              },
              {
                name: "Arya Stark",
                role: "Game of Thrones",
                image: "/images/famous-people/arya-stark.png",
              },
              {
                name: "Maximus",
                role: "Gladiator",
                image: "/images/famous-people/maximus.png",
              },
              {
                name: "Kara Danvers / Supergirl",
                role: "Supergirl",
                image: "/images/famous-people/kara-danvers-supergirl.png",
              }
            ],

      color: "from-red-800 to-amber-600",
    },
  };

  // This effect will run whenever the id parameter changes
  useEffect(() => {
    if (id) {
      // Find the matching archetype based on the ID
      const archetypeKey = Object.keys(archetypes).find(
        (key) =>
          key === id.toLowerCase() || archetypes[key].id === id.toLowerCase()
      );

      if (archetypeKey) {
        setCurrentArchetype(archetypes[archetypeKey]);
      }
    }
  }, [id]);

  // If the page is still loading or no archetype is found
  if (!currentArchetype && id) {
    return (
      <Layout title="Loading Archetype...">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Loading archetype information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${currentArchetype?.name} - Political Archetype | PhilosiQ`}
    >
      <div className="pt-24 pb-16 min-h-screen bg-neutral-light">
        <div className="container-custom">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/archetypes"
              className="inline-flex items-center text-secondary-darkBlue hover:text-primary-maroon transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to All Archetypes
            </Link>
          </div>

          {/* Hero section */}
          <div
            className={`bg-gradient-to-r ${currentArchetype?.color} text-white rounded-lg shadow-lg p-8 mb-8 relative overflow-hidden`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
              <div className="md:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {currentArchetype?.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentArchetype?.traits?.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-xl">{currentArchetype?.description}</p>
              </div>
              <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center items-center">
                <div className="w-64 h-64 relative">
                  {/* Character image */}
                  <img
                    src={`/images/archetypes/${currentArchetype?.id}.png`}
                    alt={currentArchetype?.name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/images/archetypes/placeholder.png`;
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Add a subtle overlay pattern */}
            <div
              className="absolute inset-0 opacity-10 z-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Introduction */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-secondary-darkBlue flex items-center">
                <FaLightbulb className="mr-3 text-primary-maroon" />{" "}
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {currentArchetype?.introduction}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 py-4">
            {/* Strengths and Weaknesses */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue">
                  Strengths and Weaknesses
                </h2>

                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  Strengths
                </h3>
                <ul className="mb-8 space-y-2">
                  {currentArchetype?.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-red-600">
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {currentArchetype?.weaknesses?.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Famous People */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue flex items-center">
                  <FaUsers className="mr-3 text-primary-maroon" /> Fictional Characters
                </h2>
                <div className="space-y-8">
                  {currentArchetype?.famousPeople?.map((person, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-32 h-32 mb-4 overflow-hidden flex items-center justify-center">
                        {person.image ? (
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gray-400">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg">{person.name}</h3>
                      <p className="text-gray-600 text-sm">{person.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Axis Breakdown Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Axis Breakdown
            </h2>

            <div className="space-y-8">
              {/* Economic Axis: Equity vs. Free Market */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-600">
                  {currentArchetype?.traits &&
                  currentArchetype.traits[0] === "Equity"
                    ? "Equity: Balance the scales. Ensure fairness for all."
                    : "Free Market: Freedom to compete. Freedom to succeed."}
                </h3>
                <p className="text-gray-700">
                  {currentArchetype?.traits &&
                  currentArchetype?.traits[0] === "Equity"
                    ? currentArchetype?.axisDescriptions?.equity ||
                      "As someone who leans toward the Equity side of the axis, you believe that economic systems should prioritize fairness and equality. You likely support policies that reduce wealth disparities through government intervention, such as progressive taxation, social welfare programs, and labor protections. You view systemic inequalities as issues that require correction through collective action and policy. For you, a fair distribution of resources and opportunities is essential to a functioning society, and you believe that unchecked market forces often lead to exploitation and inequality. While you recognize the value of economic freedom, you prioritize ensuring that all individuals, regardless of their background, have access to essential services and a reasonable quality of life."
                    : currentArchetype?.axisDescriptions?.markets ||
                      "As someone who leans toward the Free Market side of the axis, you likely believe that economic prosperity thrives best when individuals and businesses operate with minimal interference from the government. You may see market forces, such as competition and entrepreneurship, as key drivers of innovation and economic growth. For you, the idea of success is often tied to the freedom to operate within an open market where supply and demand determine wages, prices, and policies. You might feel that too much government intervention can stifle productivity, limit personal ambition, and create inefficiencies. While you recognize the existence of inequalities, you may believe that the free market, with its emphasis on individual choice and competition, is the most effective way to generate wealth, improve quality of life, and promote overall prosperity."}
                </p>
              </div>

              {/* Authority Axis: Libertarian vs. Authoritarian */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">
                  {currentArchetype?.traits &&
                  currentArchetype.traits[1] === "Libertarian"
                    ? "Libertarian: The fewer the chains, the freer the mind."
                    : "Authoritarian: Order through structure. Security through strength."}
                </h3>
                <p className="text-gray-700">
                  {currentArchetype?.traits &&
                  currentArchetype?.traits[1] === "Libertarian"
                    ? currentArchetype?.axisDescriptions?.libertarian ||
                      "As someone who leans toward the Libertarian side of the axis, you likely place a high value on individual freedom and autonomy. You believe that people should have the right to make their own choices, without excessive interference from the government. Personal liberties, such as freedom of speech, the right to privacy, and the ability to engage in activities that don't harm others, are fundamental to your worldview. You may advocate for a minimal government that focuses only on protecting those rights, rather than regulating people's lives or intervening in markets. For you, the ideal society is one where individuals are free to pursue their interests and passions, express dissent, and live as they see fit—without the burden of state control or authoritarian oversight."
                    : currentArchetype?.axisDescriptions?.authoritarian ||
                      "As someone who leans toward the Authoritarian side of the axis, you believe in the importance of a strong, centralized authority to maintain order, security, and stability. You likely value decisive leadership and clear structures that guide society toward common goals. In your view, individual freedoms may sometimes need to be limited for the greater good, ensuring that the collective needs of society are met. You might support strong national security measures, centralized economic planning, and robust institutions that can efficiently implement policies. For you, a well-functioning society requires a firm hand to protect it from both external threats and internal disorder. While you recognize the value of certain personal freedoms, you prioritize the security and stability that comes from having clear leadership and defined social order."}
                </p>
              </div>

              {/* Social Axis: Progressive vs. Conservative */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-600">
                  {currentArchetype?.traits &&
                  currentArchetype.traits[2] === "Progressive"
                    ? "Progressive: Tomorrow doesn't wait. Neither should we."
                    : "Conservative: Honor what works. Protect what matters."}
                </h3>
                <p className="text-gray-700">
                  {currentArchetype?.traits &&
                  currentArchetype?.traits[2] === "Progressive"
                    ? currentArchetype?.axisDescriptions?.progressive ||
                      "As someone who leans toward the Progressive side of the axis, you tend to view societal change as not only inevitable but also necessary for a better future. You believe that social, cultural, and technological advancements should be embraced, even if they challenge long-standing traditions and norms. You value inclusivity, equality, and innovation, often advocating for policies that address systemic issues like inequality, environmental degradation, and discrimination. To you, progress is about creating a more just and compassionate society where everyone, regardless of their background, has the opportunity to thrive. You may support initiatives that promote sustainability, social justice, and the expansion of rights to marginalized groups."
                    : currentArchetype?.axisDescriptions?.conservative ||
                      "As someone who leans toward the Conservative side of the axis, you value the preservation of traditions, cultural heritage, and established institutions. You believe that societies function best when they build upon time-tested values and practices rather than pursuing rapid change. For you, traditional frameworks—whether in family structure, governance, education, or social norms—provide a sense of stability, continuity, and meaning. You are likely cautious about social experiments and rapid transformations, preferring incremental changes that respect historical wisdom and cultural identity. You may see traditional values as anchors that help society weather challenges and believe that innovations should be adopted carefully and thoughtfully, ensuring they don't undermine the foundations that have sustained communities across generations."}
                </p>
              </div>

              {/* Religion Axis: Secular vs. Religious */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-red-600">
                  {currentArchetype?.traits &&
                  currentArchetype.traits[3] === "Secular"
                    ? "Secular: Reason is our compass. Evidence is our guide."
                    : "Religious: Faith illuminates the path to truth."}
                </h3>
                <p className="text-gray-700">
                  {currentArchetype?.traits &&
                  currentArchetype?.traits[3] === "Secular"
                    ? currentArchetype?.axisDescriptions?.secular ||
                      "As someone who leans toward the Secular side of the axis, you believe in the separation of religion and public life, advocating for policies that prioritize reason, science, and universal human rights over religious doctrines. You view government, education, and societal institutions as spaces where all individuals—regardless of their religious beliefs—should be treated equally and fairly. For you, morality can be grounded in humanistic and secular principles that are based on logic, empathy, and shared values, rather than religious teachings. You believe that decisions regarding laws, public policies, and social matters should be based on objective reasoning and evidence, ensuring that they reflect the diverse, pluralistic nature of society."
                    : currentArchetype?.axisDescriptions?.religious ||
                      "As someone who leans toward the Religious side of the axis, you believe that faith and spiritual principles provide essential guidance for both personal morality and societal organization. You likely view religious values as timeless foundations that offer wisdom, purpose, and ethical frameworks that have sustained communities for generations. For you, a transcendent moral order exists beyond human creation, and religious teachings help illuminate this truth. You may advocate for the protection of religious freedom and the recognition of faith's role in shaping culture, education, and even governance. While you might respect the diversity of beliefs, you see religious principles as providing crucial moral anchors that help society distinguish right from wrong and maintain a sense of purpose and meaning in an increasingly complex world."}
                </p>
              </div>

              {/* International Axis: Globalist vs. Nationalist */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-600">
                  {currentArchetype?.traits &&
                  currentArchetype.traits[4] === "Globalist"
                    ? "Globalist: We're stronger when we act as one world."
                    : "Nationalist: A nation's first duty is to its people."}
                </h3>
                <p className="text-gray-700">
                  {currentArchetype?.traits &&
                  currentArchetype?.traits[4] === "Globalist"
                    ? currentArchetype?.axisDescriptions?.globalist ||
                      "As someone who leans toward the Globalist side of the axis, you believe that cooperation and interconnectedness between nations are crucial for addressing the world's most pressing issues. You see global challenges like climate change, economic inequality, and international security as problems that transcend national borders and require collective action. You advocate for open borders, free trade, and the free flow of ideas and resources, believing that these connections ultimately lead to greater prosperity, peace, and innovation for all. Your perspective emphasizes the importance of cultural exchange and understanding, and you see diversity as an asset rather than a threat. In your view, global cooperation is essential for tackling issues that cannot be solved by any one nation alone."
                    : currentArchetype?.axisDescriptions?.nationalist ||
                      "As someone who leans toward the Nationalist side of the axis, you prioritize your nation's sovereignty, identity, and the interests of its citizens above international concerns. You believe that a country should maintain strong borders, protect its cultural heritage, and ensure that its policies benefit its own people first and foremost. For you, national identity provides a crucial sense of belonging and shared purpose, and you may view certain aspects of globalization as potential threats to this identity. You likely support economic policies that protect domestic industries and workers, and you may be cautious about international agreements that could compromise national decision-making. While you might value beneficial international relationships, you believe that a nation's primary responsibility is to safeguard the wellbeing, security, and prosperity of its own citizens."}
                </p>
              </div>
            </div>
          </div>

          {/* Comments section (placeholder) */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue flex items-center">
              <FaComments className="mr-3 text-primary-maroon" /> Comments
            </h2>
            <div className="bg-neutral-light p-8 rounded-lg text-center">
              <p className="text-gray-600">
                Comments will be available after you create an account and log
                in.
              </p>
              <Link href="/login" className="btn-primary inline-block mt-4">
                Log In to Comment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
