import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const variants: Variants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.61, 1, 0.88, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: [0.61, 1, 0.88, 1],
        },
    },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={variants}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
};

export const FadeIn = ({ children, delay = 0, duration = 0.5 }: { children: ReactNode; delay?: number; duration?: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export const SlideIn = ({ children, delay = 0, direction = 'up' }: { children: ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) => {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.21, 1.02, 0.47, 0.98] }}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
    <motion.div
        initial="initial"
        animate="animate"
        className={className}
        variants={{
            animate: {
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: delay
                }
            }
        }}
    >
        {children}
    </motion.div>
);

export const StaggerItem = ({ children }: { children: ReactNode }) => (
    <motion.div
        variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 1.02, 0.47, 0.98] } }
        }}
    >
        {children}
    </motion.div>
);
