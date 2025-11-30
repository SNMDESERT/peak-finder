import { useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
            {t("privacy.backToHome", "Back to Home")}
          </Button>
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold" data-testid="text-privacy-title">
              {t("privacy.title", "Privacy Policy")}
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-privacy-updated">
            {t("privacy.lastUpdated", "Last updated: November 2025")}
          </p>
        </div>

        <div className="space-y-8">
          <Card data-testid="card-privacy-intro">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.intro", "At Peak Finder, we value your privacy. This policy explains how we collect, use, and protect your information when you use Azerbaijan's first mountain tourism app.")}
              </p>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-collect">
                {t("privacy.sections.collect.title", "Information We Collect")}
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>{t("privacy.sections.collect.accountInfo.label", "Account Information:")}</strong> {t("privacy.sections.collect.accountInfo.text", "Name, email address, and profile picture when you sign up")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>{t("privacy.sections.collect.tripActivity.label", "Trip Activity:")}</strong> {t("privacy.sections.collect.tripActivity.text", "Your completed trips, bookings, and achievement progress")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>{t("privacy.sections.collect.reviewsPhotos.label", "Reviews & Photos:")}</strong> {t("privacy.sections.collect.reviewsPhotos.text", "Content you choose to share about your experiences")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-use">
                {t("privacy.sections.use.title", "How We Use Your Information")}
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.use.personalize", "To provide and personalize your mountain adventure experience")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.use.track", "To track your achievements and climbing progress")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.use.process", "To process trip bookings and send important updates")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.use.improve", "To improve our services and develop new features")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-protect">
                {t("privacy.sections.protect.title", "How We Protect Your Data")}
              </h2>
            </div>
            <Card>
              <CardContent className="p-6 space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.protect.encrypted", "Secure encrypted connections for all data transfers")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.protect.noSell", "We never sell your personal information to third parties")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{t("privacy.sections.protect.delete", "You can delete your account and data at any time")}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold" data-testid="text-section-contact">
                {t("privacy.sections.contact.title", "Contact Us")}
              </h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {t("privacy.sections.contact.text", "Questions about your privacy? Contact us at")}{" "}
                  <a 
                    href="mailto:privacy@azmountain.az" 
                    className="text-primary hover:underline"
                    data-testid="link-privacy-email"
                  >
                    privacy@azmountain.az
                  </a>
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
