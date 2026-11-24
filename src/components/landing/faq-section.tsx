"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "마이링크는 정말 무료로 이용할 수 있나요?",
    answer:
      "네, 맞습니다! 마이링크의 핵심 기능인 링크 무제한 등록, 인라인 실시간 편집, 실시간 클릭 통계, 나만의 고유 @URL 제공까지 모든 기본 기능을 무료로 자유롭게 이용하실 수 있습니다.",
  },
  {
    question: "등록할 수 있는 링크 개수에 제한이 있나요?",
    answer:
      "개수 제한 없이 원하는 만큼 마음껏 링크를 등록하실 수 있습니다. 인스타그램, 유튜브, 블로그, 포트폴리오, 오픈카톡 등 필요한 모든 링크를 깔끔하게 모아보세요.",
  },
  {
    question: "실시간 방문자와 클릭 통계는 어떻게 확인하나요?",
    answer:
      "로그인 후 상단 메뉴의 '통계' 페이지에서 날짜별 방문자 추이, 링크별 클릭 수, 최고 인기 링크 등의 데이터를 직관적인 시각화 차트로 실시간 확인할 수 있습니다.",
  },
  {
    question: "나만의 고유 아이디(@displayName)는 나중에 바꿀 수 있나요?",
    answer:
      "언제든지 변경 가능합니다! 프로필 카드에서 아이디를 클릭하면 즉시 중복 확인과 함께 새로운 고유 주소로 간편하게 수정하실 수 있습니다.",
  },
  {
    question: "모바일 스마트폰이나 태블릿에서도 잘 보이나요?",
    answer:
      "마이링크는 모바일 퍼스트(Mobile-First) 철학으로 설계되었습니다. 인스타그램이나 카카오톡 인앱 브라우저를 비롯해 모든 모바일 디바이스에서 최적화된 반응형 화면을 제공합니다.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[13px] font-semibold mb-4 border border-blue-100">
            <HelpCircle size={14} className="text-blue-500" />
            <span>자주 묻는 질문</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            궁금하신 점이 있으신가요?
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">
            마이링크 시작 전 많은 분들이 자주 질문해주신 내용을 모았습니다.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-[15px] sm:text-[16px] font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-[14px] text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100 animate-in fade-in-50 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
