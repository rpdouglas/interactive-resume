import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TimelineCard from './TimelineCard';

const TimelineContainer = ({ experienceData }) => {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* 📏 The Vertical Spine */}
      <div className="absolute left-[2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-50" />

      {/* List of Items with Animation */}
      <div className="flex flex-col space-y-2">
        <AnimatePresence mode='popLayout'>
          {experienceData.map((job, index) => (
            <TimelineCard key={job.id} data={job} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimelineContainer;
