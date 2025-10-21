'use client';

import Link from 'next/link';
import { Globe, Sparkles, Zap, Shield, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn, StaggerChildren, StaggerItem } from '@/components/animations';

export default function Home() {
  const features = [
    {
      title: 'Planetas',
      description:
        'Descubra planetas e suas características do universo Star Wars',
      icon: Globe,
      href: '/planets',
      gradient: 'from-green-500 to-emerald-600',
      count: '60+',
    },
  ];

  const highlights = [
    {
      icon: Zap,
      title: 'Ultra Rápido',
      description: 'Construído com Next.js 15 e otimizado para performance',
    },
    {
      icon: Shield,
      title: 'Type Safe',
      description:
        'Cobertura completa de TypeScript para desenvolvimento robusto',
    },
    {
      icon: Sparkles,
      title: 'UI Moderna',
      description: 'Interface linda com Tailwind CSS e Shadcn/ui',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/0 to-background" />

        <div className="mx-auto max-w-5xl text-center">
          <FadeIn delay={0.1}>
            <Badge variant="secondary" className="mb-4 sm:mb-6">
              <Rocket className="mr-1 h-3 w-3" />
              Powered by SWAPI
            </Badge>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Explore o Universo{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Star Wars
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Uma interface moderna, rápida e bonita para explorar planetas,
              personagens e muito mais da galáxia Star Wars. Construída com as
              mais recentes tecnologias web.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/planets">
                  Explorar Planetas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto"
              >
                <Link href="https://swapi.dev" target="_blank">
                  Sobre SWAPI
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t bg-muted/50 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              O Que Você Pode Explorar
            </h2>
          </FadeIn>

          <StaggerChildren className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.href}>
                  <Link href={feature.href} className="group block h-full">
                    <Card className="h-full transition-all hover:scale-[1.02] hover:shadow-lg">
                      <CardHeader>
                        <div className="mb-2 flex items-center justify-between">
                          <div
                            className={`rounded-lg bg-gradient-to-br ${feature.gradient} p-2 text-white shadow-lg`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <Badge variant="secondary">{feature.count}</Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary">
                          {feature.title}
                        </CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="ghost"
                          className="w-full group-hover:bg-primary/10"
                        >
                          Explorar Agora
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              Por Que Este Explorer?
            </h2>
          </FadeIn>

          <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <StaggerItem
                  key={highlight.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {highlight.description}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      <section className="border-t px-4 py-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
            Construído com Tecnologias Modernas
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {[
              'Next.js 15',
              'TypeScript',
              'React Query',
              'Tailwind CSS',
              'Shadcn/ui',
              'Vitest',
              'Playwright',
            ].map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="px-3 py-1 sm:px-4 sm:py-2"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
