import { Link } from "wouter";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold" data-testid="text-terms-title">
              Terms of Service
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-terms-updated">
            Last updated: November 2025
          </p>
        </div>

        <div className="space-y-8">
          <Card data-testid="card-terms-intro">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                Welcome to AzMountain! By using our platform, you agree to these simple terms 
                that help us maintain a safe and enjoyable experience for all mountain adventurers.
              </p>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-usage">
                Using AzMountain
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You must be at least 18 years old to create an account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Provide accurate information when booking trips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Respect other users and share honest, helpful reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keep your account credentials secure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mountain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-trips">
                Trip Bookings
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Bookings are subject to availability and weather conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Follow all safety guidelines provided by trip leaders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Cancellation policies vary by trip - check details before booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensure you have appropriate fitness level for your chosen difficulty</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-safety">
                Safety & Responsibility
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Mountain activities carry inherent risks - participate at your own discretion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>We recommend appropriate travel and health insurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Follow local regulations and respect the natural environment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-content">
                Your Content
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>You own the photos and reviews you share</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>By posting, you grant us permission to display your content on the platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Do not post harmful, offensive, or copyrighted content</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <Card className="bg-muted/50" data-testid="card-terms-contact">
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Questions about these terms? Contact us at{" "}
                <a 
                  href="mailto:legal@azmountain.az" 
                  className="text-primary hover:underline"
                  data-testid="link-terms-email"
                >
                  legal@azmountain.az
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
