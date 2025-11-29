import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mountain,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Shield,
  Users,
  Award,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <Mountain className="h-8 w-8 text-primary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
                  </div>
                  <span className="text-xl font-bold">AzMountain</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Discover the breathtaking mountain landscapes of Azerbaijan.
                From the majestic Caucasus peaks to the ancient trails of
                Karabakh, embark on adventures that reward your spirit.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  data-testid="link-social-facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  data-testid="link-social-instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  data-testid="link-social-twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  data-testid="link-social-youtube"
                >
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-4">Explore</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/trips" data-testid="link-footer-trips">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                      Mountain Trips
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/achievements" data-testid="link-footer-achievements">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                      Achievement Badges
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" data-testid="link-footer-reviews">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                      Traveler Reviews
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about" data-testid="link-footer-about">
                    <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm">
                      About Us
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>28 May Street, Baku, Azerbaijan</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>+994 12 555 1234</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>info@azmountain.az</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to get the latest mountain adventures and exclusive
                offers.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  data-testid="input-newsletter-email"
                />
                <Button size="icon" data-testid="button-newsletter-submit">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Verified Trips</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" />
              <span>Local Expert Guides</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4 text-primary" />
              <span>Safe Climbing Practices</span>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AzMountain. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span
                className="hover:text-primary cursor-pointer transition-colors"
                data-testid="link-privacy-policy"
              >
                Privacy Policy
              </span>
              <span
                className="hover:text-primary cursor-pointer transition-colors"
                data-testid="link-terms-of-service"
              >
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
