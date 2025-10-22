"use client";

import { useState } from "react";
import { PrismicNextImage } from "@prismicio/next";
import type { ImageField, RichTextField, KeyTextField, LinkField } from "@prismicio/client";
import { TeamMemberDialog } from "./team-member-dialog";
import { TeamNav } from "./team-nav";
import { ExternalLinkIcon } from "@/app/components/header/external-link-icon";

interface TeamMember {
  name: string;
  position: string;
  department: string;
  image: ImageField;
  bio: RichTextField;
  email: KeyTextField;
  linkedin: LinkField;
  index: number;
}

interface TeamGridProps {
  teamMembers: TeamMember[];
  enableDialog: boolean;
}

export function TeamGrid({ teamMembers, enableDialog }: TeamGridProps) {
  // Prepare nav data
  const navMembers = teamMembers.map((member) => ({
    name: member.name,
    department: member.department,
    index: member.index,
  }));

  // Group by department for filtering
  const membersByDepartment = teamMembers.reduce((acc, member) => {
    const dept = member.department;
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(member);
    return acc;
  }, {} as Record<string, typeof teamMembers>);

  const departments = Object.keys(membersByDepartment);
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || "");

  // Filter members based on selected department
  const filteredMembers = selectedDepartment
    ? membersByDepartment[selectedDepartment] || []
    : teamMembers;

  return (
    <>
      {/* Sticky Tab Navigation - Full Width */}
      <TeamNav
        teamMembers={navMembers}
        onDepartmentChange={setSelectedDepartment}
      />

      {/* Team Members Grid with Container */}
      <div className="w-full max-w-[110rem] mx-auto px-4 lg:px-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {filteredMembers.map((member) => (
          <div
            key={member.index}
            id={`team-member-${member.index}`}
            className="scroll-mt-40"
          >
            {enableDialog ? (
              <TeamMemberDialog member={member}>
                <div className="group">
                  {/* Team Member Image with Clipping Mask */}
                  <div
                    className="w-full aspect-square relative bg-neutral-200 p-[1.25px] overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                    }}
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
                      }}
                    >
                      {member.image && member.image.url ? (
                        <PrismicNextImage
                          field={member.image}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        // Placeholder when no image is provided
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-neutral-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Team Member Info with hover effects */}
                  <div className="mt-6">
                    <h3 className="text-neutral-800 text-xl font-semibold leading-tight">
                      <span className="inline border-b-2 border-transparent group-hover:border-neutral-800 transition-all duration-150">
                        {member.name}
                      </span>
                      <span className="inline-block align-baseline ml-2">
                        <ExternalLinkIcon
                          className="w-[13px] h-[13px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          color="#262626"
                        />
                      </span>
                    </h3>
                    <p className="text-neutral-600 text-base leading-relaxed mt-1">
                      {member.position}
                    </p>
                  </div>
                </div>
              </TeamMemberDialog>
            ) : (
              <div className="group">
                {/* Team Member Image with Clipping Mask */}
                <div
                  className="w-full aspect-square relative bg-neutral-200 p-[1.25px] overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                  }}
                >
                  <div
                    className="w-full h-full overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 19px 100%, 0 calc(100% - 19px))'
                    }}
                  >
                    {member.image && member.image.url ? (
                      <PrismicNextImage
                        field={member.image}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        alt=""
                      />
                    ) : (
                      // Placeholder when no image is provided
                      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-neutral-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Member Info without hover effects */}
                <div className="mt-6">
                  <h3 className="text-neutral-800 text-xl font-semibold leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-neutral-600 text-base leading-relaxed mt-1">
                    {member.position}
                  </p>
                </div>
              </div>
            )}
          </div>
          ))}
        </div>
      </div>
    </>
  );
}

