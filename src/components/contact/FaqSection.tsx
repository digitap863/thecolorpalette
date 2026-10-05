"use client";

import React, { useState } from "react";
import { ArrowUp, ArrowRight } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    question: "How can I book an appointment?",
    answer:
      "You can easily reserve your slot by filling out our online booking form below, calling our reception at +91 8547977486, or visiting our salon location at Geo Centre, Kochi.",
  },
  {
    id: "faq-2",
    question: "How often do you update your services menu?",
    answer:
      "We regularly review and update our beauty, aesthetic, and skincare treatments every season to incorporate the latest proven techniques and organic product innovations.",
  },
  {
    id: "faq-3",
    question: "How can I change or cancel my booking?",
    answer:
      "To reschedule or cancel your appointment, please give us a call or contact us via email at least 24 hours prior to your scheduled booking time.",
  },
  {
    id: "faq-4",
    question: "What special packages or offers are available?",
    answer:
      "We offer bespoke bridal packages, comprehensive skin aesthetic bundles, and seasonal hair treatment passes. Contact our team to request our current package menu.",
  },
  {
    id: "faq-5",
    question: "What hair & skin care products do you use?",
    answer:
      "At The Color Palette, we exclusively utilize dermatologist-certified, premium, cruelty-free hair care and aesthetic skincare formulations tailored to your unique skin and hair texture.",
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
      className="w-full bg-[#f7f1eb] text-[#1e2617] py-8 sm:py-8 px-6 sm:px-12 md:px-16 overflow-hidden"
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

      </div>
    </section>
  );
}
