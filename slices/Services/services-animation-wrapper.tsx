"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ServicesAnimationWrapperProps {
    children: ReactNode;
    className?: string;
}

interface ServiceCardAnimationProps {
    children: ReactNode;
    index: number;
}

// Container animation variants with stagger
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Card animation variants
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as any,
        },
    },
};

// Right side content animation
const rightSideVariants = {
    hidden: {
        opacity: 0,
        x: 30,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as any,
            delay: 0.2,
        },
    },
};

export function ServicesGridAnimation({ children }: ServicesAnimationWrapperProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {children}
        </div>
    );
}

export function ServiceCardAnimation({ children, index }: ServiceCardAnimationProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px", amount: 0.3 }}
            variants={cardVariants}
            className="space-y-5 border-b-4 border-neutral-200 px-6 py-8 lg:px-8 lg:py-10 rounded-t-sm bg-neutral-50"
        >
            {children}
        </motion.div>
    );
}

export function ServicesRightSideAnimation({ children, className = "" }: ServicesAnimationWrapperProps) {
    return (
        <motion.div
            variants={rightSideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={`flex flex-col justify-start ${className}`}
        >
            {children}
        </motion.div>
    );
}

