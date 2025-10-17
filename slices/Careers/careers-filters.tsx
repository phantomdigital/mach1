"use client";

import { useState, useMemo } from "react";
import type { Content } from "@prismicio/client";
import { JobCard } from "./job-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CareersFiltersProps {
  allJobs: Content.JobDocument[];
  enableLoadMore: boolean;
  initialCount: number;
  showFilters: boolean;
  isFeatured: boolean;
}

export function CareersFilters({
  allJobs,
  enableLoadMore,
  initialCount,
  showFilters,
  isFeatured,
}: CareersFiltersProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>("All");
  const [displayCount, setDisplayCount] = useState(initialCount);

  // Get unique departments, locations, and employment types
  const departments = useMemo(() => {
    const depts = new Set<string>();
    allJobs.forEach((job) => {
      if (job.data.department) depts.add(job.data.department);
    });
    return ["All", ...Array.from(depts).sort()];
  }, [allJobs]);

  const locations = useMemo(() => {
    const locs = new Set<string>();
    allJobs.forEach((job) => {
      if (job.data.location) locs.add(job.data.location);
    });
    return ["All", ...Array.from(locs).sort()];
  }, [allJobs]);

  const employmentTypes = useMemo(() => {
    const types = new Set<string>();
    allJobs.forEach((job) => {
      if (job.data.employment_type) types.add(job.data.employment_type);
    });
    return ["All", ...Array.from(types).sort()];
  }, [allJobs]);

  // Filter jobs based on selections
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Department filter
      if (selectedDepartment !== "All" && job.data.department !== selectedDepartment) {
        return false;
      }

      // Location filter
      if (selectedLocation !== "All" && job.data.location !== selectedLocation) {
        return false;
      }

      // Employment type filter
      if (selectedEmploymentType !== "All" && job.data.employment_type !== selectedEmploymentType) {
        return false;
      }

      return true;
    });
  }, [allJobs, selectedDepartment, selectedLocation, selectedEmploymentType]);

  // Jobs to display (for load more functionality)
  const displayedJobs = enableLoadMore
    ? filteredJobs.slice(0, displayCount)
    : filteredJobs;

  const hasMore = enableLoadMore && displayCount < filteredJobs.length;

  const handleLoadMore = () => {
    setDisplayCount(displayCount + initialCount);
  };

  return (
    <>
      {/* Filter Dropdowns - Only show if showFilters is true */}
      {showFilters && (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:mb-12">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Department
            </label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department === "All" ? "All Departments" : department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Location
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === "All" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Filter by Type
            </label>
            <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Jobs Count */}
      {showFilters && (
        <div className="mb-6 text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-800">{displayedJobs.length}</span> of <span className="font-semibold text-neutral-800">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'position' : 'positions'}
        </div>
      )}

      {/* Jobs List */}
      {displayedJobs.length > 0 ? (
        <div className="space-y-6">
          {displayedJobs.map((job, index) => (
            <JobCard key={job.id} job={job} index={index} isFeatured={isFeatured} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-600 text-lg">
            No positions found for the selected filters.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button variant="hero" onClick={handleLoadMore}>
            LOAD MORE POSITIONS
          </Button>
        </div>
      )}
    </>
  );
}

