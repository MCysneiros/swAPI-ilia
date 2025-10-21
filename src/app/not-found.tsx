'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      <FadeIn direction="up" className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-9xl font-extrabold text-primary/20 sm:text-[12rem]">
            404
          </h1>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-6 inline-block"
        >
          <Rocket className="h-16 w-16 text-muted-foreground sm:h-20 sm:w-20" />
        </motion.div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Lost in Space
        </h2>

        <p className="mb-8 max-w-md text-base text-muted-foreground sm:text-lg">
          The page you are looking for has disappeared into hyperspace. It may
          have been destroyed by the Death Star, or perhaps never existed in
          this galaxy.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-sm text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to previous page
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 border-l-4 border-primary/20 pl-4 text-left"
        >
          <p className="text-sm italic text-muted-foreground">
            &ldquo;These are not the droids you are looking for.&rdquo;
          </p>
          <p className="mt-1 text-xs text-muted-foreground">- Obi-Wan Kenobi</p>
        </motion.div>
      </FadeIn>
    </div>
  );
}
