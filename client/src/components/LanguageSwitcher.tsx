import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "landing";
  isScrolled?: boolean;
}

export function LanguageSwitcher({
  variant = "default",
  isScrolled = true,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const isLandingStyle = variant === "landing" && !isScrolled;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${
            isLandingStyle ? "text-white hover:bg-white/10" : "text-foreground"
          }`}
          data-testid="button-language-switcher"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer flex items-center gap-2 ${
              currentLanguage.code === lang.code
                ? "bg-primary/10 text-primary"
                : ""
            }`}
            data-testid={`button-lang-${lang.code}`}
          >
            <span className="text-base">{lang.flag}</span>
            <span>{lang.name}</span>
            {currentLanguage.code === lang.code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
