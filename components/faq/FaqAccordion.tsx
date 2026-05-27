'use client';

import { useState } from 'react';
import type { FaqItem } from '@/graphql/faq';

interface Props {
  items: FaqItem[];
}

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    width="15"
    height="9"
    viewBox="0 0 15 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
  >
    <path
      d="M6.65715 0.292893C7.04768 -0.097631 7.68084 -0.097631 8.07136 0.292893L14.4353 6.65685C14.8259 7.04738 14.8259 7.68054 14.4353 8.07107C14.0448 8.46159 13.4116 8.46159 13.0211 8.07107L7.36426 2.41421L1.7074 8.07107C1.31688 8.46159 0.683714 8.46159 0.29319 8.07107C-0.0973344 7.68054 -0.0973344 7.04738 0.29319 6.65685L6.65715 0.292893ZM7.36426 2.5L6.36426 2.5V1L7.36426 1L8.36426 1V2.5L7.36426 2.5Z"
      fill="black"
    />
  </svg>
);

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="bg-white rounded-[8px] overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-[30px] py-[30px] text-left cursor-pointer"
            >
              <span className="font-heading font-bold text-[20px] leading-[25px] text-black pr-4">
                {item.question}
              </span>
              <ArrowIcon open={isOpen} />
            </button>

            {isOpen && (
              <>
                <div className="h-px bg-black/15 mx-[30px]" />
                <p className="font-poppins font-normal text-[12px] leading-[20px] capitalize px-[30px] py-[30px] text-black">
                  {item.reponse}
                </p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
