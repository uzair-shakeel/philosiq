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
        { name: "Atticus Finch", role: "To Kill a Mockingbird" },
        { name: "'Aang", role: "Avatar: The Last Airbender" },
        { name: "Amélie", role: "Amélie" },
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
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    prophet: {
      id: "prophet",
      name: "The Prophet",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    firebrand: {
      id: "firebrand",
      name: "The Firebrand",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    philosopher: {
      id: "philosopher",
      name: "The Philosopher",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    localist: {
      id: "localist",
      name: "The Localist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    missionary: {
      id: "missionary",
      name: "The Missionary",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    guardian: {
      id: "guardian",
      name: "The Guardian",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    technocrat: {
      id: "technocrat",
      name: "The Technocrat",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    enforcer: {
      id: "enforcer",
      name: "The Enforcer",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    zealot: {
      id: "zealot",
      name: "The Zealot",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    purist: {
      id: "purist",
      name: "The Purist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    commander: {
      id: "commander",
      name: "The Commander",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    steward: {
      id: "steward",
      name: "The Steward",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    shepherd: {
      id: "shepherd",
      name: "The Shepherd",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    highPriest: {
      id: "high-priest",
      name: "The High Priest",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    futurist: {
      id: "futurist",
      name: "The Futurist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    maverick: {
      id: "maverick",
      name: "The Maverick",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    evangelist: {
      id: "evangelist",
      name: "The Evangelist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    dissenter: {
      id: "dissenter",
      name: "The Dissenter",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    globalist: {
      id: "globalist",
      name: "The Globalist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    patriot: {
      id: "patriot",
      name: "The Patriot",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    industrialist: {
      id: "industrialist",
      name: "The Industrialist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    traditionalist: {
      id: "traditionalist",
      name: "The Traditionalist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    overlord: {
      id: "overlord",
      name: "The Overlord",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    corporatist: {
      id: "corporatist",
      name: "The Corporatist",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    moralizer: {
      id: "moralizer",
      name: "The Moralizer",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    builder: {
      id: "builder",
      name: "The Builder",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    executive: {
      id: "executive",
      name: "The Executive",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    ironhand: {
      id: "ironhand",
      name: "The Ironhand",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    regent: {
      id: "regent",
      name: "The Regent",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
    crusader: {
      id: "crusader",
      name: "The Crusader",
      traits: ["Equity", "Libertarian", "Progressive", "Secular", "Globalist"],
      description: "ELPSG",
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
        { name: "Bernie Sanders", role: "U.S. Senator" },
        { name: "Franklin D. Roosevelt", role: "23rd U.S. President" },
        { name: "Karl Marx", role: "Political Theorist" },
        { name: "Alexandria Ocasio-Cortez", role: "U.S. Representative" },
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
