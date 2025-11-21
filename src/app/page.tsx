'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { SlidersHorizontal, HelpCircle, KeyRound, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const NavButton = ({ href, icon: Icon, title, description, disabled = false }: { href: string, icon: React.ElementType, title: string, description: string, disabled?: boolean }) => (
  <Button
    asChild={!disabled}
    variant="outline"
    className="h-auto w-full justify-start p-4 text-left shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
    disabled={disabled}
  >
    {disabled ? (
       <div className="flex items-center w-full">
        <div className="mr-4 rounded-lg bg-muted p-3">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-muted-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground/80">{description}</p>
        </div>
      </div>
    ) : (
      <Link href={href} className="flex items-center w-full">
        <div className="mr-4 rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </Link>
    )}
  </Button>
);

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <Logo className="h-16 w-16 text-primary" />
          <h1 className="text-center text-4xl font-bold tracking-tight">CoDesignAI</h1>
          <p className="max-w-md text-center text-muted-foreground">
            Welcome to the next generation of analog circuit simulation and optimization.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <NavButton
                href="/optimizer"
                icon={SlidersHorizontal}
                title="Circuit Optimizer v2"
                description="The streamlined, modal-driven optimizer experience."
              />
              <NavButton
                href="/optimizer-v1"
                icon={SlidersHorizontal}
                title="Circuit Optimizer v1"
                description="The original multi-panel optimizer layout."
              />
              <NavButton
                href="#"
                icon={KeyRound}
                title="License Management"
                description="Manage your product license and activation."
                disabled
              />
              <NavButton
                href="#"
                icon={HelpCircle}
                title="Help & Documentation"
                description="Access user guides and support."
                disabled
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
