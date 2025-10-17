"use client";

import { PrismicNextLink } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import { motion } from "framer-motion";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

interface JobCardProps {
  job: Content.JobDocument;
  index: number;
  isFeatured?: boolean;
}

export function JobCard({ job, index, isFeatured = false }: JobCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <PrismicNextLink 
        document={job}
        className="block"
      >
        <div 
          className="relative transition-all bg-neutral-200 p-[1.25px]"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
          }}
        >
          <div 
            className="relative p-6 lg:p-8 bg-white "
            style={{
              clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
            }}
          >
            {/* Main horizontal layout */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
              
              {/* Left side: Title and Summary */}
              <div className="flex-1 min-w-0">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {/* Department Badge */}
                  {job.data.department && (
                    <span 
                      className="inline-block text-green-200 text-xs font-bold tracking-wider uppercase px-3 py-1.5 bg-mach1-green rounded-2xl"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                    >
                      {job.data.department}
                    </span>
                  )}

                  {/* Featured Badge */}
                  {isFeatured && (
                    <span 
                      className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1.5 bg-dark-blue text-white rounded-full"
                      style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}
                    >
                      Featured
                    </span>
                  )}
                </div>

                {/* Experience Level - Separate line */}
                {job.data.experience_level && (
                  <div className="text-xs text-neutral-600 uppercase tracking-wide mb-2">
                    {job.data.experience_level}
                  </div>
                )}

                {/* Job Title with hover icon */}
                <h3 className="text-neutral-800 text-xl lg:text-2xl font-semibold leading-tight mb-2">
                  <span className="inline border-b-2 border-transparent group-hover:border-neutral-800 transition">
                    {job.data.title}
                  </span>
                  <span className="inline-block align-baseline ml-2">
                    <ExternalLinkIcon
                      className="w-[13px] h-[13px] opacity-0 group-hover:opacity-100 transition"
                      color="#262626"
                    />
                  </span>
                </h3>

                
              </div>

              {/* Right side: Meta Information in columns */}
              <div className="flex gap-8 lg:gap-12 flex-shrink-0">
                {/* Location */}
                {job.data.location && (
                  <div className="flex flex-col gap-1 min-w-[140px]">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 uppercase tracking-wide mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </div>
                    <div className="text-sm text-neutral-800 font-medium">
                      {job.data.location}
                    </div>
                  </div>
                )}

                {/* Employment Type */}
                {job.data.employment_type && (
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 uppercase tracking-wide mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Type
                    </div>
                    <div className="text-sm text-neutral-800 font-medium">
                      {job.data.employment_type}
                    </div>
                  </div>
                )}

                {/* Salary */}
                {job.data.salary_range && (
                  <div className="flex flex-col gap-1 min-w-[140px]">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 uppercase tracking-wide mb-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Salary
                    </div>
                    <div className="text-sm text-neutral-800 font-semibold">
                      {job.data.salary_range}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PrismicNextLink>
    </motion.article>
  );
}
