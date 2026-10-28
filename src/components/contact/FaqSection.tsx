"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowRight } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    question: "What treatments does The Color Pallete offer?",
    answer:
      "We offer a comprehensive range of advanced aesthetic, skin, hair and scalp treatments, including medifacials, chemical peels, GFC, PRP, exosome therapy, mesotherapy, laser and RF treatments, LED light therapy, Korean Hair Spa, specialised scalp care, and professional makeup services.",
  },
  {
    id: "faq-2",
    question: "How do I know which treatment is right for me?",
    answer:
      "Our treatments are designed around individual skin, hair and aesthetic needs. A consultation can help determine the most suitable treatment approach based on your specific concerns and goals.",
  },
  {
    id: "faq-3",
    question: "Do I need a consultation before treatment?",
    answer:
      "For personalised aesthetic treatments, we recommend discussing your concerns with our professional team before proceeding so the treatment can be selected according to your individual needs.",
  },
  {
    id: "faq-4",
    question: "What skin treatments are available?",
    answer:
      "Our skin-focused treatments include medifacials, chemical peels, carbon laser, RF skin tightening, Oxy/Oxygen facials, microneedling and mesotherapy.",
  },
  {
    id: "faq-5",
    question: "What hair and scalp treatments do you offer?",
    answer:
      "Hair and scalp services include Korean Hair Spa, anti-dandruff treatment, hair spa, microneedling for hair and other specialised scalp treatments.",
  },
  {
    id: "faq-6",
    question: "What is the Korean Luxury Hair Spa?",
    answer:
      "It is a holistic hair and scalp ritual combining advanced scalp care with relaxation. The treatment includes a specially designed spa-bath experience and integrated massage, with a focus on scalp care, hydration, circulation and relaxation.",
  },
  {
    id: "faq-7",
    question: "Do you offer bridal beauty services?",
    answer:
      "Yes. The Color Pallete offers bridal makeup, HD Premium Makeup, Airbrush Makeup, Luxury Packages and pre-bridal treatments. Bridal services are designed around personalised consultation, skin preparation and the desired final look.",
  },
  {
    id: "faq-8",
    question: "How can I book an appointment?",
    answer:
      "You can contact The Color Pallete directly to enquire about treatments and appointment availability. We recommend booking in advance for specialised and bridal services.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [showAll, setShowAll] = useState<boolean>(false);

  const visibleFaqs = showAll ? FAQ_DATA : FAQ_DATA.slice(0, 4);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="w-full bg-[#f7f1eb] text-[#1e2617] py-8 sm:py-12 px-6 sm:px-12 md:px-16 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Cursive Subtitle */}
        <span className="font-script text-4xl sm:text-5xl md:text-6xl text-[#dfcca5] tracking-wide mb-1 select-none">
          questions
        </span>

        {/* Main Headline */}
        <h2 className="font-belleza text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-wider text-[#1e2617] leading-tight mb-12">
          Frequently Asked Questions
        </h2>

        {/* FAQ Accordion List */}
        <div className="w-full text-left space-y-4">
          {visibleFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div key={faq.id} className="w-full">
                {/* Accordion Header / Question Row */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className={`w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-300 ${
                    isOpen
                      ? "bg-[#dfcca5] text-[#1e2617] font-medium shadow-xs"
                      : "bg-transparent text-[#1e2617] border border-[#1e2617]/30 hover:border-[#1e2617]/60 hover:bg-[#dfcca5]/15"
                  }`}
                >
                  <span className="font-belleza text-base sm:text-lg md:text-xl font-medium tracking-wide pr-4">
                    {faq.question}
                  </span>

                  <span className="shrink-0 text-[#1e2617]">
                    {isOpen ? (
                      <ArrowUp className="w-5 h-5" strokeWidth={1.8} />
                    ) : (
                      <ArrowRight className="w-5 h-5" strokeWidth={1.8} />
                    )}
                  </span>
                </button>

                {/* Accordion Answer Paragraph (visible directly below open header) */}
                {isOpen && (
                  <div className="py-5 px-2 sm:px-3 text-sm sm:text-base font-light text-[#1e2617]/85 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Action Button: MORE QUESTIONS */}
        <div className="mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="font-belleza px-8 py-3 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-[#f7f1eb] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer"
          >
            {showAll ? "FEWER QUESTIONS" : "MORE QUESTIONS"}
          </button>
        </div>

        {/* CTA Container below FAQ */}
        <div className="w-full mt-16 p-8 sm:p-12 bg-white/80 backdrop-blur-xs border border-[#1e2617]/15 text-center flex flex-col items-center shadow-xs">
          <h3 className="font-belleza text-2xl sm:text-3xl font-light uppercase tracking-wider text-[#1e2617] mb-3">
            Still have questions?
          </h3>
          <p className="text-sm sm:text-base font-light text-[#1e2617]/80 max-w-lg mb-8 leading-relaxed">
            Our team is happy to help you find the right treatment for your needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto font-belleza px-8 py-3.5 bg-[#1e2617] text-[#f7f1eb] hover:bg-[#dfcca5] hover:text-[#1e2617] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 text-center"
            >
              Book a Consultation
            </Link>

            <a
              href="https://wa.me/918547977486"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto font-belleza px-8 py-3.5 border border-[#1e2617] text-[#1e2617] hover:bg-[#1e2617] hover:text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-medium transition-all duration-300 text-center"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
