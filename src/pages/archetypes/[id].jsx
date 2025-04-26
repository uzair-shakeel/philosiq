import React from "react";
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

  const archetypes = {
    utopian: {
      id: "the-utopian",
      name: "The Utopian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "Imagine boldly. Innovate freely. Uplift all.",
      introduction:
        "As an ELPSG (The Utopian), you likely envision a world shaped by fairness, freedom, and progress. You tend to support reducing economic inequality, protecting personal liberties, and embracing change as a path toward a better future. With a generally secular outlook and a broad, global perspective, you often see cooperation and innovation as important tools for addressing the world’s challenges. Your ideal society is probably one where individuals can thrive without oppressive systems, and where justice is thoughtfully balanced with opportunity.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Jean-Luc Picard", role: "Star Trek: TNG" },
        { name: "Aang", role: "Avatar: The Last Airbender" },
        { name: "Hermione Granger", role: "Harry Potter" },
        { name: "Lisa Simpson", role: "The Simpsons" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-blue-600 to-green-500",
    },
    reformer: {
      id: "reformer",
      name: "The Reformer",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Nationalist"],
      description: "Progress with roots. Freedom with unity.",
      introduction:
        "As an ELPSN (The Reformer), you likely value equity, personal freedom, and progress, while maintaining a strong sense of national identity. You tend to support policies that promote fairness and social change, but within the context of preserving cultural or national cohesion. With a generally secular worldview, you’re probably more focused on practical solutions than tradition, and you often see reform as the path to a better future—balancing innovation with a grounded sense of belonging.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Katniss Everdeen", role: "The Hunger Games" },
        { name: "Steve Rogers", role: "Captain America" },
        { name: "Moana", role: "Moana" },
        { name: "Jon Snow", role: "Game of Thrones" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-green-600 to-blue-400",
    },
    prophet: {
      id: "prophet",
      name: "The Prophet",
      traits: ["Equity", "Libertarian", "Progressive", "Religious", "Globalist"],
      description: "Guided by faith. Driven by justice.",
      introduction:
        "As an ELPRG (The Prophet), you likely believe in a future shaped by equity, freedom, and progress, guided by a strong moral or spiritual foundation. You tend to see personal liberty and global cooperation as essential to building a just world, and your religious or spiritual beliefs may inspire a deep sense of purpose and vision for what society could become. With a progressive mindset and a global outlook, you often view change not just as necessary, but as a calling—something rooted in both compassion and conviction.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Gandalf", role: "The Lord of the Rings" },
        { name: "Obi-Wan Kenobi", role: "Star Wars" },
        { name: "Aslan", role: "The Chronicles of Narnia" },
        { name: "Samwise Gamgee", role: "The Lord of the Rings" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-indigo-700 to-purple-500",
    },
    firebrand: {
      id: "firebrand",
      name: "The Firebrand",
      traits: ["Equity", "Libertarian", "Progressive", "Religious", "Nationalist"],
      description: "Change the world by conviction and fire.",
      introduction:
        "As an ELPRN (The Firebrand), you likely champion equity, freedom, and progress, while drawing strength from your religious or spiritual beliefs and a strong sense of national identity. You may see reform and justice as moral imperatives, driven by both personal conviction and a desire to uplift your community or nation. With a passion for change and a clear sense of purpose, you tend to challenge the status quo—believing that a better society is possible when values, tradition, and liberty work together.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Prince Zuko", role: "Avatar: The Last Airbender" },
        { name: "Aragorn", role: "The Lord of the Rings" },
        { name: "Wonder Woman", role: "Wonder Woman" },
        { name: "Eowyn", role: "The Lord of the Rings" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-red-600 to-orange-500",
    },
    philosopher: {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Libertarian", "Conservative", "Secular", "Globalist"],
      description: "Balance reason with purpose. Think deeper.",
      introduction:
        "As an ELCSG (The Philosopher), you likely value equity and individual freedom, while leaning toward a more cautious, thoughtful approach to change. With a secular perspective and a global outlook, you may believe that reason, dialogue, and shared responsibility are key to creating a stable and just society. You tend to appreciate tradition where it serves the common good, but you're also open to ideas that promote fairness and long-term progress. Your vision is often guided by a balance of principle, pragmatism, and curiosity about the bigger picture.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Tyrion Lannister", role: "Game of Thrones" },
        { name: "Data", role: "Star Trek: TNG" },
        { name: "Dr. Ian Malcolm", role: "Jurassic Park" },
        { name: "Sherlock Holmes", role: "BBC Sherlock" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-gray-600 to-blue-400",
    },
    localist: {
      id: "localist",
      name: "The Localist",
      traits: ["Equity", "Libertarian", "Conservative", "Secular", "Nationalist"],
      description: "Change begins at home. Tradition with care.",
      introduction:
        "As an ELCSN (The Localist), you likely value equity and personal freedom, while placing importance on tradition, community, and national identity. With a secular mindset, you may approach social issues through a practical and reasoned lens, favoring solutions that respect both individual rights and cultural cohesion. You tend to believe that meaningful change happens close to home, and that preserving local values can coexist with a commitment to fairness and opportunity. Your perspective often blends caution with care—seeking progress that’s grounded and sustainable.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Ron Swanson", role: "Parks and Recreation" },
        { name: "Dwight Schrute", role: "The Office" },
        { name: "Ned Stark", role: "Game of Thrones" },
        { name: "Hank Hill", role: "King of the Hill" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-yellow-700 to-orange-400",
    },
    missionary: {
      id: "missionary",
      name: "The Missionary",
      traits: ["Equity", "Libertarian", "Conservative", "Religious", "Globalist"],
      description: "Serve with purpose. Lead with compassion.",
      introduction:
        "As an ELCRG (The Missionary), you likely believe in equity and individual freedom, guided by a strong moral or religious framework. You may value tradition and personal responsibility, while also embracing a global perspective that emphasizes compassion, service, and shared human dignity. With a thoughtful balance between faith and principle, you tend to see progress as something best achieved through purpose-driven action—uplifting others while staying true to core beliefs. Your vision often blends timeless values with a hope for a more just and connected world.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Uncle Iroh", role: "Avatar: The Last Airbender" },
        { name: "Shepherd Book", role: "Firefly" },
        { name: "Galadriel", role: "The Lord of the Rings" },
        { name: "Master Splinter", role: "Teenage Mutant Ninja Turtles" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-teal-600 to-green-400",
    },
    guardian: {
      id: "guardian",
      name: "The Guardian",
      traits: ["Equity", "Libertarian", "Conservative", "Religious", "Nationalist"],
      description: "Honor the past. Protect the future.",
      introduction:
        "As an ELCRN (The Guardian), you likely hold equity and personal freedom in high regard, while also valuing tradition, faith, and a strong sense of national identity. Guided by a moral or religious framework, you may see your role as protecting what matters—whether it’s community, culture, or foundational values. You tend to believe that a just society is one that honors both individual dignity and collective responsibility. Your outlook often blends conviction with care, aiming to preserve what works while ensuring everyone has a fair chance to thrive.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Eddard Stark", role: "Game of Thrones" },
        { name: "Faramir", role: "The Lord of the Rings" },
        { name: "Mufasa", role: "The Lion King" },
        { name: "Optimus Prime", role: "Transformers" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-amber-700 to-red-400",
    },
    technocrat: {
      id: "technocrat",
      name: "The Technocrat",
      traits: ["Equity", "Authoritarian", "Progressive", "Secular", "Globalist"],
      description: "Lead with data. Build with vision.",
      introduction:
        "As an EAPSG (The Technocrat), you likely believe in equity and progress, with a focus on structure, expertise, and large-scale solutions. With a secular and globally-minded perspective, you may see data, science, and organized systems as key tools for building a fairer, more efficient society. You tend to value order and coordination when addressing complex challenges, aiming for outcomes that serve the greater good. Your approach often reflects a belief that meaningful progress comes from informed planning, innovation, and collective responsibility.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Shuri", role: "Black Panther" },
        { name: "Mr. Spock", role: "Star Trek" },
        { name: "Lucius Fox", role: "The Dark Knight Trilogy" },
        { name: "Bruce Banner", role: "Marvel MCU" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-sky-600 to-cyan-400",
    },
    enforcer: {
      id: "enforcer",
      name: "The Enforcer",
      traits: ["Equity", "Authoritarian", "Progressive", "Secular", "Nationalist"],
      description: "Discipline for justice. Order for equity.",
      introduction:
        "As an EAPSN (The Enforcer), you likely believe in equity and progress, paired with a strong sense of national identity and the importance of order. With a secular outlook, you may approach social change through a practical and structured lens, favoring decisive action and collective discipline to achieve fairness and stability. You tend to see a just society as one that protects its people, upholds shared values, and ensures that no one is left behind—even if that requires firm guidance and clear rules. Your vision often blends idealism with a focus on security and cohesion.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Stannis Baratheon", role: "Game of Thrones" },
        { name: "Mace Windu", role: "Star Wars" },
        { name: "Amanda Waller", role: "Suicide Squad Animated" },
        { name: "Brienne of Tarth", role: "Game of Thrones" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-slate-700 to-gray-400",
    },
    zealot: {
      id: "zealot",
      name: "The Zealot",
      traits: ["Equity", "Authoritarian", "Progressive", "Religious", "Globalist"],
      description: "Faith fuels progress. Purpose drives power.",
      introduction:
        "As an EAPRG (The Zealot), you likely believe in equity and progress, driven by a deep moral or spiritual conviction. With a global perspective, you may see your values as part of a broader mission to uplift humanity and correct injustice. You tend to favor strong, coordinated efforts to bring about meaningful change, believing that structure and purpose are essential in achieving a better world. Your vision often blends faith, idealism, and determination—seeking transformation that reflects both moral clarity and a commitment to the common good.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Obi-Wan Kenobi", role: "Star Wars" },
        { name: "Samwise Gamgee", role: "The Lord of the Rings" },
        { name: "Eowyn", role: "The Lord of the Rings" },
        { name: "Albus Dumbledore", role: "Harry Potter" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-purple-700 to-pink-500",
    },
    purist: {
      id: "purist",
      name: "The Purist",
      traits: ["Equity", "Authoritarian", "Progressive", "Religious", "Nationalist"],
      description: "Moral clarity. National strength.",
      introduction:
        "As an EAPRN (The Purist), you likely believe in equity and progress, guided by strong moral or religious principles and a deep sense of national identity. You may see structure, discipline, and shared values as essential to building a just and unified society. With a focus on moral clarity and collective purpose, you tend to support firm action in pursuit of what you see as a better, more righteous future. Your vision often blends conviction, tradition, and reform—seeking to uplift your community while holding true to the beliefs that ground it.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Captain America", role: "Marvel — WWII" },
        { name: "Mulan", role: "Mulan" },
        { name: "Maximus Decimus Meridius", role: "Gladiator" },
        { name: "Ned Flanders", role: "The Simpsons" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-rose-700 to-red-500",
    },
    commander: {
      id: "commander",
      name: "The Commander",
      traits: ["Equity", "Authoritarian", "Conservative", "Secular", "Globalist"],
      description: "Order, strength, and strategic vision.",
      introduction:
        "As an EACSG (The Commander), you likely value equity and stability, favoring order, structure, and strategic leadership to maintain social cohesion. With a secular and globally-minded perspective, you may see strong institutions and coordinated efforts as essential to addressing complex challenges. You tend to prefer steady, disciplined approaches to progress—believing that fairness is best achieved when systems are well-organized and responsibly managed. Your vision often combines a respect for tradition with a readiness to lead, especially when clarity and control are needed.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Jeanine Matthews", role: "Divergent" },
        { name: "Grand Moff Tarkin", role: "Star Wars" },
        { name: "Admiral Adama", role: "Battlestar Galactica" },
        { name: "Okabe Rintarou", role: "Steins;Gate" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-blue-800 to-gray-600",
    },
    steward: {
      id: "steward",
      name: "The Steward",
      traits: ["Equity", "Authoritarian", "Conservative", "Secular", "Nationalist"],
      description: "Preserve what works. Guide what grows.",
      introduction:
        "As an EACSN (The Steward), you likely believe in equity and order, with a strong respect for tradition, responsibility, and national cohesion. With a secular and pragmatic outlook, you may see your role as one of careful guidance—protecting what works while ensuring fairness and stability within your community or country. You tend to value structure and discipline, believing that a just society requires strong leadership and shared values. Your vision often emphasizes preservation with purpose—maintaining balance while looking out for the common good.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Tywin Lannister", role: "Game of Thrones" },
        { name: "Lord Vetinari", role: "Discworld" },
        { name: "Minister Rufus Scrimgeour", role: "Harry Potter" },
        { name: "King Théoden", role: "The Lord of the Rings" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-amber-700 to-lime-500",
    },
    shepherd: {
      id: "shepherd",
      name: "The Shepherd",
      traits: ["Equity", "Authoritarian", "Conservative", "Religious", "Globalist"],
      description: "Lead with faith. Guard with wisdom.",
      introduction:
        "As an EACRG (The Shepherd), you likely value equity and stability, guided by a strong moral or religious framework and a global sense of responsibility. You may believe that lasting order and fairness come from a combination of tradition, structure, and compassionate leadership. With a focus on guiding others and upholding shared values, you tend to support well-organized systems that serve the common good. Your vision often blends care and conviction—seeking to lead with purpose, protect what matters, and uplift society through faith and principled direction.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Gandalf", role: "The Lord of the Rings" },
        { name: "Professor X", role: "X-Men" },
        { name: "Jonathan Kent", role: "Smallville" },
        { name: "Master Splinter", role: "Teenage Mutant Ninja Turtles" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-green-700 to-teal-400",
    },
    highPriest: {
      id: "high-priest",
      name: "The High Priest",
      traits: ["Equity", "Authoritarian", "Conservative", "Religious", "Nationalist"],
      description: "Guard the sacred. Govern with virtue.",
      introduction:
        "As an EACRN (The High Priest), you likely value equity and order, deeply rooted in tradition, faith, and a strong sense of national identity. You may believe that a just and harmonious society is built through shared moral foundations, structured leadership, and cultural cohesion. With a guiding sense of purpose, you tend to support firm, principled action to preserve values and protect the community. Your vision often blends spiritual conviction with a sense of duty—seeking to uphold what’s sacred while ensuring fairness and stability for those you serve.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "King Théoden", role: "The Lord of the Rings" },
        { name: "Obi-Wan Kenobi", role: "Star Wars" },
        { name: "Commander Shepard", role: "Mass Effect — Paragon" },
        { name: "Samwise Gamgee", role: "The Lord of the Rings" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-indigo-800 to-violet-600",
    },
    futurist: {
      id: "futurist",
      name: "The Futurist",
      traits: ["Free Market", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "Invent the future. Believe in potential.",
      introduction:
        "As a FLPSG (The Futurist), you likely believe in individual freedom, innovation, and progress, with a focus on global cooperation and a secular outlook. You may see open markets and technological advancement as key drivers of positive change, helping to create a more dynamic and equitable world. With a forward-looking mindset, you tend to embrace new ideas and bold solutions, trusting that creativity and personal liberty can work hand in hand to shape a better future. Your vision often blends optimism, openness, and a belief in human potential.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Tony Stark", role: "Iron Man" },
        { name: "Rick Sanchez", role: "Rick and Morty" },
        { name: "Lucius Fox", role: "The Dark Knight Trilogy" },
        { name: "Hank Pym", role: "Marvel MCU" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-cyan-500 to-blue-400",
    },
    maverick: {
      id: "maverick",
      name: "The Maverick",
      traits: ["Free Market", "Libertarian", "Progressive", "Secular", "Nationalist"],
      description: "Think boldly. Speak freely. Stand firm.",
      introduction:
        "As a FLPSN (The Maverick), you likely value personal freedom, innovation, and progress, while also holding a strong appreciation for national identity and cultural roots. With a secular and independent mindset, you may favor open markets and individual choice as engines for growth and change. You tend to challenge convention and think outside the box, believing that real progress happens when people are free to experiment, speak their minds, and chart their own path—within a framework that still honors community and country. Your vision often blends boldness with a grounded sense of belonging.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Han Solo", role: "Star Wars" },
        { name: "Malcolm Reynolds", role: "Firefly" },
        { name: "Indiana Jones", role: "Indiana Jones" },
        { name: "Peter Quill", role: "Guardians of the Galaxy" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-orange-600 to-yellow-400",
    },
    evangelist: {
      id: "evangelist",
      name: "The Evangelist",
      traits: ["Free Market", "Libertarian", "Progressive", "Religious", "Globalist"],
      description: "Inspire through belief. Empower with vision.",
      introduction:
        "As a FLPRG (The Evangelist), you likely believe in personal freedom, innovation, and global cooperation, all guided by a strong moral or religious foundation. You may see open markets and individual empowerment as tools for uplifting communities and driving meaningful progress. With a blend of spiritual conviction and forward-thinking ideals, you tend to promote change that honors both personal belief and collective well-being. Your vision often combines purpose, optimism, and outreach—seeking to inspire others and build a better world through both faith and freedom.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Charles Xavier", role: "X-Men" },
        { name: "Shepherd Book", role: "Firefly" },
        { name: "Morpheus", role: "The Matrix" },
        { name: "Professor Oak", role: "Pokémon" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-teal-600 to-blue-400",
    },
    dissenter: {
      id: "dissenter",
      name: "The Dissenter",
      traits: ["Free Market", "Libertarian", "Progressive", "Religious", "Nationalist"],
      description: "Defy the norm. Stand with conviction.",
      introduction:
        "As a FLPRN (The Dissenter), you likely value personal freedom, innovation, and progress, while being grounded in your faith and a strong sense of national identity. You may see individual empowerment and open markets as essential to human flourishing, but you also believe that moral conviction and cultural heritage have an important role to play in shaping society. With a spirit of independence, you tend to challenge dominant narratives—pushing for change that aligns with both your principles and your community’s values. Your vision often blends courage, belief, and a commitment to charting your own path.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Sirius Black", role: "Harry Potter" },
        { name: "William Wallace", role: "Braveheart" },
        { name: "Finn", role: "Star Wars" },
        { name: "Ezio Auditore", role: "Assassin’s Creed" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-red-600 to-rose-400",
    },
    globalist: {
      id: "globalist",
      name: "The Globalist",
      traits: ["Free Market", "Libertarian", "Conservative", "Secular", "Globalist"],
      description: "Freedom with cooperation. Tradition with progress.",
      introduction:
        "As a FLCSG (The Globalist), you likely value personal freedom, open markets, and time-tested principles, all within a globally connected framework. With a secular and pragmatic outlook, you may believe that prosperity and stability come from responsible individualism, free enterprise, and international cooperation. You tend to favor gradual progress rooted in tradition, seeing global engagement as a way to promote opportunity, peace, and mutual benefit. Your vision often blends practicality with a broad perspective—seeking a world where freedom and order can thrive side by side.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Bruce Wayne", role: "Batman" },
        { name: "Nick Fury", role: "Marvel" },
        { name: "Sherlock Holmes", role: "BBC Sherlock" },
        { name: "Lara Croft", role: "Tomb Raider" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-blue-500 to-green-400",
    },
    patriot: {
      id: "patriot",
      name: "The Patriot",
      traits: ["Free Market", "Libertarian", "Conservative", "Secular", "Nationalist"],
      description: "Pride in nation. Strength in liberty.",
      introduction:
        "As a FLCSN (The Patriot), you likely value personal freedom, free markets, and traditional values, grounded in a strong sense of national pride and cultural identity. With a secular and pragmatic approach, you may see individual responsibility and economic liberty as keys to a thriving society. You tend to believe that preserving national character and sovereignty is important—even as the world changes—favoring a steady, principled path forward. Your vision often blends independence, heritage, and a belief in the strength of a self-reliant people.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Captain America", role: "Marvel" },
        { name: "James Bond", role: "007 Franchise" },
        { name: "Jack Bauer", role: "24" },
        { name: "Jason Bourne", role: "Bourne Series" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-red-700 to-blue-600",
    },
    industrialist: {
      id: "industrialist",
      name: "The Industrialist",
      traits: ["Free Market", "Libertarian", "Conservative", "Religious", "Globalist"],
      description: "Work with values. Build across borders.",
      introduction:
        "As a FLCRG (The Industrialist), you likely believe in personal freedom, open markets, and traditional values, guided by a strong moral or religious foundation and a global perspective. You may see enterprise, innovation, and discipline as driving forces behind prosperity—not just for individuals, but for society as a whole. With a focus on both principle and progress, you tend to support systems that reward effort, uphold values, and connect communities across borders. Your vision often blends faith, ambition, and pragmatism—seeking to build a better world through hard work and enduring ideals.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Howard Stark", role: "Marvel MCU" },
        { name: "Tony Stark", role: "comics version" },
        { name: "Bruce Wayne", role: "business side — comics" },
        { name: "Lucius Fox", role: "tech/finance side" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-yellow-600 to-gray-400",
    },
    traditionalist: {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: ["Free Market", "Libertarian", "Conservative", "Religious", "Nationalist"],
      description: "Preserve the sacred. Empower the individual.",
      introduction:
        "As a FLCRN (The Traditionalist), you likely value personal freedom, open markets, and enduring moral or religious principles, all rooted in a strong sense of national identity. You may believe that a healthy society thrives when individuals are empowered, communities are grounded in shared values, and cultural heritage is preserved. With a respect for time-tested ways and a belief in personal responsibility, you tend to favor steady progress that honors both faith and tradition. Your vision often blends independence, conviction, and a deep commitment to preserving what matters most.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Ron Swanson", role: "Parks and Recreation" },
        { name: "King Théoden", role: "The Lord of the Rings" },
        { name: "Arthur Morgan", role: "Red Dead Redemption 2" },
        { name: "William Adama", role: "Battlestar Galactica" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-amber-700 to-emerald-500",
    },
    overlord: {
      id: "overlord",
      name: "The Overlord",
      traits: ["Free Market", "Authoritarian", "Progressive", "Secular", "Globalist"],
      description: "Control the chaos. Command the future.",
      introduction:
        "As a FAPSG (The Overlord), you likely believe in progress and global cooperation, with an emphasis on structure, efficiency, and economic freedom. With a secular perspective and a strong belief in coordinated leadership, you may see centralized systems and strategic planning as essential tools for driving innovation and large-scale improvement. You tend to support bold, top-down solutions that aim to solve complex problems and elevate society. Your vision often blends ambition, order, and forward-thinking—focused on creating a more advanced and equitable world through strong direction and purposeful control.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Ozymandias", role: "Watchmen" },
        { name: "Robert Ford", role: "Westworld" },
        { name: "Sarek", role: "Star Trek" },
        { name: "Lord Cutler Beckett", role: "Pirates of the Caribbean" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-black to-gray-700",
    },
    corporatist: {
      id: "corporatist",
      name: "The Corporatist",
      traits: ["Free Market", "Authoritarian", "Progressive", "Secular", "Nationalist"],
      description: "Strategize for power. Govern for progress.",
      introduction:
        "As a FAPSN (The Corporatist), you likely value economic freedom and national strength, paired with a belief in structured, top-down approaches to progress. With a secular outlook and a focus on efficiency and order, you may see coordinated leadership—especially between state and industry—as key to driving innovation and stability. You tend to favor pragmatic solutions that serve both the nation and its economy, believing that prosperity and unity can be achieved through strategic planning and disciplined governance. Your vision often blends progress with control, aiming to build a strong and forward-moving society.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Tywin Lannister", role: "Game of Thrones" },
        { name: "Amanda Waller", role: "Suicide Squad Animated" },
        { name: "Hank Scorpio", role: "The Simpsons" },
        { name: "Frank Underwood", role: "House of Cards" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-gray-700 to-blue-400",
    },
    moralizer: {
      id: "moralizer",
      name: "The Moralizer",
      traits: ["Free Market", "Authoritarian", "Progressive", "Religious", "Globalist"],
      description: "Construct with purpose. Lead with faith.",
      introduction:
        "As a FAPRG (The Moralizer), you likely believe in progress and global cooperation, guided by strong moral or religious convictions and a belief in structured, purposeful leadership. You may see economic freedom and innovation as tools to uplift society—so long as they align with clear ethical principles. With a focus on discipline, order, and a higher sense of purpose, you tend to support firm but value-driven approaches to change. Your vision often blends faith, structure, and ambition—seeking to shape a better world through both moral clarity and decisive action.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Optimus Prime", role: "Transformers" },
        { name: "Gandalf", role: "23rd U.S. President" },
        { name: "Commander Shepard", role: "Mass Effect — Paragon" },
        { name: "Jean-Luc Picard", role: "Star Trek TNG" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-purple-800 to-rose-600",
    },
    builder: {
      id: "builder",
      name: "The Builder",
      traits: ["Free Market", "Authoritarian", "Progressive", "Religious", "Nationalist"],
      description: "Construct with purpose. Lead with faith.",
      introduction:
        "As a FAPRN (The Builder), you likely believe in progress and national strength, guided by a strong moral or religious foundation and a commitment to order and structure. You may see economic freedom and personal ambition as powerful forces—best harnessed through disciplined leadership and shared values. With a focus on development, tradition, and unity, you tend to support purposeful action that reinforces both moral principles and national identity. Your vision often blends faith, structure, and a hands-on drive to construct a society where strength and virtue go hand in hand.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Aragorn", role: "The Lord of the Rings" },
        { name: "T’Challa", role: "Black Panther" },
        { name: "Mulan", role: "Mulan" },
        { name: "King Théoden", role: "The Lord of the Rings" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-amber-700 to-yellow-400",
    },
    executive: {
      id: "executive",
      name: "The Executive",
      traits: ["Free Market", "Authoritarian", "Conservative", "Secular", "Globalist"],
      description: "Structure. Efficiency. Vision.",
      introduction:
        "As a FACSG (The Executive), you likely value order, efficiency, and economic freedom, with a pragmatic, secular outlook and a global perspective. You may believe that well-structured systems and strong leadership are essential for maintaining stability and driving prosperity. With a preference for clear rules and strategic coordination, you tend to support disciplined approaches to governance and business alike. Your vision often blends tradition with ambition—seeking a world where productivity, responsibility, and long-term planning lead the way.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Miranda Priestly", role: "The Devil Wears Prada" },
        { name: "Tywin Lannister", role: "Game of Thrones" },
        { name: "Gus Fring", role: "Breaking Bad" },
        { name: "Irene Adler", role: "BBC Sherlock" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-gray-800 to-blue-500",
    },
    ironhand: {
      id: "ironhand",
      name: "The Ironhand",
      traits: ["Free Market", "Authoritarian", "Conservative", "Secular", "Nationalist"],
      description: "Structure. Efficiency. Vision.",
      introduction:
        "As a FACSN (The Ironhand), you likely believe in strength, order, and economic freedom, grounded in a secular worldview and a strong sense of national pride. You may see discipline, structure, and decisive leadership as essential to maintaining stability and protecting the values you hold dear. With a preference for tradition and strategic control, you tend to support firm but focused governance that prioritizes national unity and self-reliance. Your vision often blends authority with responsibility—aiming to build a society that is secure, resilient, and built to last.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Darth Vader", role: "Star Wars" },
        { name: "Judge Dredd", role: "Judge Dredd" },
        { name: "Brienne of Tarth", role: "Game of Thrones" },
        { name: "Amanda Waller", role: "Suicide Squad Animated" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-slate-800 to-red-600",
    },
    regent: {
      id: "regent",
      name: "The Regent",
      traits: ["Free Market", "Authoritarian", "Conservative", "Religious", "Globalist"],
      description: "Rule with wisdom. Preserve with strength.",
      introduction:
        "As a FACRG (The Regent), you likely value order, faith, and economic freedom, guided by a strong moral framework and a global perspective. You may believe that prosperity and stability come from disciplined leadership, time-tested values, and responsible stewardship of both markets and institutions. With a focus on preserving what works while engaging with the wider world, you tend to support structured approaches that honor tradition while promoting long-term growth. Your vision often blends faith, structure, and purpose—seeking to uphold enduring principles in a rapidly changing world.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Denethor", role: "The Lord of the Rings" },
        { name: "Magneto", role: "X-Men" },
        { name: "Robert Baratheon", role: "Game of Thrones" },
        { name: "Lord Shen", role: "Kung Fu Panda 2" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-indigo-800 to-emerald-500",
    },
    crusader: {
      id: "crusader",
      name: "The Crusader",
      traits: ["Free Market", "Authoritarian", "Conservative", "Religious", "Nationalist"],
      description: "Defend your values. Stand your ground.",
      introduction:
        "As a FACRN (The Crusader), you likely value strength, tradition, and economic freedom, rooted in deep moral or religious convictions and a strong sense of national identity. You may believe that a just and stable society is built through disciplined leadership, cultural preservation, and a firm commitment to shared values. With a focus on order and purpose, you tend to support decisive action in defense of both faith and country. Your vision often blends conviction, structure, and loyalty—seeking to protect and uphold a way of life you believe is worth preserving.",
      strengths: [
        "Equity-minded individuals are highly empathetic, valuing fairness and social responsibility.",
        "Libertarian-minded individuals are highly principled and value personal freedom, resisting unnecessary control over others.",
        "Progressive-minded individuals are open-minded and innovative, embracing change and new ideas.",
        "Secular-minded individuals are rational and evidence-driven, relying on logic and scientific reasoning.",
        "Globalist-minded individuals are cosmopolitan and adaptable, seeing themselves as part of a larger human community.",
      ],
      weaknesses: [
        "Equity-minded individuals may sometimes overestimate the effectiveness of government intervention and underestimate unintended consequences.",
        "Libertarian-minded individuals may struggle with collective action problems, finding it difficult to coordinate large-scale solutions to social issues.",
        "Progressive-minded individuals may dismiss traditional wisdom too quickly, assuming that all change is inherently good.",
        "Secular-minded individuals may lack appreciation for the emotional and communal aspects of faith, underestimating its importance in people’s lives.",
        "Globalist-minded individuals may underestimate the importance of local cultures and national identity, assuming that globalization is universally beneficial.",
      ],
      famousPeople: [
        { name: "Jon Snow", role: "Game of Thrones" },
        { name: "Achilles", role: "Troy 2004 movie" },
        { name: "Thor", role: "Marvel" },
        { name: "Leonidas", role: "300 movie" },
      ],
      axisPositions: [
        {
          axis: "Equality vs. Markets",
          position: 85,
          description: "Strongly favors equality-based policies",
        },
        {
          axis: "Democracy vs. Authority",
          position: 80,
          description: "Strongly supports democratic institutions",
        },
        {
          axis: "Progress vs. Tradition",
          position: 90,
          description: "Highly progressive outlook",
        },
        {
          axis: "Secular vs. Religious",
          position: 85,
          description: "Strongly secular worldview",
        },
        {
          axis: "Globalism vs. Nationalism",
          position: 90,
          description: "Strongly globalist perspective",
        },
      ],
      color: "from-red-800 to-amber-600",
    },
  };

  const archetype = archetypes[id];

  if (!archetype) {
    return (
      <Layout title="Loading Archetype - PhilosiQ">
        <div className="pt-24 pb-16 min-h-screen bg-neutral-light flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-maroon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Loading archetype information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${archetype.name} - Political Archetype | PhilosiQ`}>
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
            className={`bg-gradient-to-r ${archetype.color} text-white rounded-lg shadow-lg p-8 mb-8`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {archetype.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {archetype?.traits?.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-3 py-1 rounded-full text-sm"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <p className="text-xl">{archetype.description}</p>
              </div>
              <div className="mt-6 md:mt-0 w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                {/* Placeholder for archetype icon/image */}
                <span className="text-6xl font-bold">
                  {archetype.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>

          {/* Axis positions */}
          {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue">
              Political Axis Positions
            </h2>
            <div className="space-y-6">
              {archetype.axisPositions.map((axis, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{axis.axis}</span>
                    <span className="text-sm text-gray-500">
                      {axis.description}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        axis.axis.includes("Equality")
                          ? "bg-blue-500"
                          : axis.axis.includes("Democracy")
                          ? "bg-green-500"
                          : axis.axis.includes("Progress")
                          ? "bg-purple-500"
                          : axis.axis.includes("Secular")
                          ? "bg-yellow-500"
                          : axis.axis.includes("Military")
                          ? "bg-red-500"
                          : "bg-indigo-500"
                      }`}
                      style={{ width: `${axis.position}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{axis.axis.split(" vs. ")[1]}</span>
                    <span>{axis.axis.split(" vs. ")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Introduction */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-secondary-darkBlue flex items-center">
                  <FaLightbulb className="mr-3 text-primary-maroon" />{" "}
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {archetype.introduction}
                </p>
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue">
                  Strengths and Weaknesses
                </h2>

                <h3 className="text-xl font-semibold mb-4 text-green-600">
                  Strengths
                </h3>
                <ul className="mb-8 space-y-2">
                  {archetype?.strengths?.map((strength, index) => (
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
                  {archetype?.weaknesses?.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Famous People */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-8 h-full">
                <h2 className="text-2xl font-bold mb-6 text-secondary-darkBlue flex items-center">
                  <FaUsers className="mr-3 text-primary-maroon" /> Famous People
                </h2>
                <div className="space-y-8">
                  {archetype?.famousPeople?.map((person, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-32 h-32 mb-4 overflow-hidden flex items-center justify-center">
                        {person.image ? (
                          <img
                            src={person.image}
                            alt={person.name}
                            className="w-full h-auto"
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
              {/* Equity vs. Free Market */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-600">
                  Free Market: Freedom to compete. Freedom to succeed.
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.markets ||
                    "As someone who leans toward the Free Market side of the axis, you likely believe that economic prosperity thrives best when individuals and businesses operate with minimal interference from the government. You may see market forces, such as competition and entrepreneurship, as key drivers of innovation and economic growth. For you, the idea of success is often tied to the freedom to operate within an open market where supply and demand determine wages, prices, and policies. You might feel that too much government intervention can stifle productivity, limit personal ambition, and create inefficiencies. While you recognize the existence of inequalities, you may believe that the free market, with its emphasis on individual choice and competition, is the most effective way to generate wealth, improve quality of life, and promote overall prosperity."}
                </p>
              </div>

              {/* Libertarian vs. Authoritarian */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-blue-600">
                  Libertarian: The fewer the chains, the freer the mind.
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.democracy ||
                    "As someone who leans toward the Libertarian side of the axis, you likely place a high value on individual freedom and autonomy. You believe that people should have the right to make their own choices, without excessive interference from the government. Personal liberties, such as freedom of speech, the right to privacy, and the ability to engage in activities that don't harm others, are fundamental to your worldview. You may advocate for a minimal government that focuses only on protecting those rights, rather than regulating people's lives or intervening in markets. For you, the ideal society is one where individuals are free to pursue their interests and passions, express dissent, and live as they see fit—without the burden of state control or authoritarian oversight. You may view government restrictions, surveillance, and censorship as unnecessary encroachments on personal freedoms that stifle creativity, progress, and individual responsibility."}
                </p>
              </div>

              {/* Progressive vs. Conservative */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-600">
                  Progressive: Tomorrow doesn’t wait. Neither should we
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.secular ||
                    "As someone who leans toward the Progressive side of the axis, you tend to view societal change as not only inevitable but also necessary for a better future. You believe that social, cultural, and technological advancements should be embraced, even if they challenge long-standing traditions and norms. You value inclusivity, equality, and innovation, often advocating for policies that address systemic issues like inequality, environmental degradation, and discrimination. To you, progress is about creating a more just and compassionate society where everyone, regardless of their background, has the opportunity to thrive. You may support initiatives that promote sustainability, social justice, and the expansion of rights to marginalized groups. You see societal norms as flexible and adaptable, and you believe that embracing new ideas and reforms is crucial to fostering a society that is both resilient and fair. For you, the ideal society is one that evolves to meet the needs of its people and the planet, ensuring that progress and tradition can coexist in a way that benefits all."}
                </p>
              </div>

              {/* Secular vs. Religious */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-red-600">
                  Secular: Reason is our compass. Evidence is our guide.
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.nationalism ||
                    "As someone who leans toward the Secular side of the axis, you believe in the separation of religion and public life, advocating for policies that prioritize reason, science, and universal human rights over religious doctrines. You view government, education, and societal institutions as spaces where all individuals—regardless of their religious beliefs—should be treated equally and fairly. For you, morality can be grounded in humanistic and secular principles that are based on logic, empathy, and shared values, rather than religious teachings. You believe that decisions regarding laws, public policies, and social matters should be based on objective reasoning and evidence, ensuring that they reflect the diverse, pluralistic nature of society. While respecting individual freedom of belief, you see religious influence in public spaces—such as schools, government buildings, or public policy—as something that can hinder equality and inclusivity. In your ideal society, religion plays a private role in the lives of individuals, but it does not shape or impose on the broader public sphere."}
                </p>
              </div>

              {/* Globalism vs. Nationalism */}
              <div>
                <h3 className="text-xl font-bold mb-2 text-purple-600">
                  Globalist: We’re stronger when we act as one world
                </h3>
                <p className="text-gray-700">
                  {archetype.axisDescriptions?.progress ||
                    "As someone who leans toward the Globalist side of the axis, you believe that cooperation and interconnectedness between nations are crucial for addressing the world’s most pressing issues. You see global challenges like climate change, economic inequality, and international security as problems that transcend national borders and require collective action. You advocate for open borders, free trade, and the free flow of ideas and resources, believing that these connections ultimately lead to greater prosperity, peace, and innovation for all. Your perspective emphasizes the importance of cultural exchange and understanding, and you see diversity as an asset rather than a threat. In your view, global cooperation is essential for tackling issues that cannot be solved by any one nation alone. Whether it’s through international organizations, treaties, or joint efforts to combat global crises, you support the idea of nations working together to build a more sustainable and just world. Your ideal society values collaboration over isolation, where countries prioritize the common good of humanity as a whole, and where global solutions are seen as integral to national success. You recognize that while national sovereignty is important, addressing the interconnectedness of the world’s problems requires a commitment to shared goals and mutual respect among nations."}
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
