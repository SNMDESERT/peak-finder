import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mountain,
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
  Award,
  MapPin,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/achievements", label: "Achievements" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About Us" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLandingPage = location === "/" && !isAuthenticated;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              data-testid="link-home-logo"
            >
              <div className="relative">
                <Mountain
                  className={`h-8 w-8 transition-colors ${
                    isScrolled || !isLandingPage
                      ? "text-primary"
                      : "text-white"
                  }`}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full" />
              </div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
                  isScrolled || !isLandingPage
                    ? "text-foreground"
                    : "text-white"
                }`}
              >
                AzMountain
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`font-medium transition-colors ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : isScrolled || !isLandingPage
                      ? "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${
                isScrolled || !isLandingPage
                  ? "text-foreground"
                  : "text-white hover:bg-white/10"
              }`}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage
                        src={user.profileImageUrl || undefined}
                        alt={user.firstName || "User"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.firstName?.[0] || user.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profileImageUrl || undefined}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Level {user.climbingLevel || 1}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      data-testid="link-dashboard"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/achievements">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      data-testid="link-my-achievements"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      My Achievements
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/trips">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      data-testid="link-my-trips"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      My Trips
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={() => (window.location.href = "/api/logout")}
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => (window.location.href = "/api/login")}
                className={`${
                  isScrolled || !isLandingPage
                    ? ""
                    : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
                }`}
                data-testid="button-login"
              >
                Sign In
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isScrolled || !isLandingPage
                      ? "text-foreground"
                      : "text-white hover:bg-white/10"
                  }`}
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-2 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={location === link.href ? "secondary" : "ghost"}
                        className="w-full justify-start text-lg"
                        onClick={() => setIsOpen(false)}
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
