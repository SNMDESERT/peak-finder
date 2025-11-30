import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Users, Code, Palette, Search, Sparkles, ArrowLeft, Mountain } from "lucide-react";

import huseynPhoto from "@assets/huseyn_1764484494735.jpeg";
import ibrahimPhoto from "@assets/ibrahim_1764484494735.jpeg";
import gulayPhoto from "@assets/gulay_1764484494736.jpeg";
import shabnamPhoto from "@assets/shabnam_1764484494732.jpeg";

interface TeamMember {
  id: string;
  nameKey: string;
  roleKey: string;
  icon: typeof Code;
  photo: string;
  gradient: string;
  iconColor: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "huseyn",
    nameKey: "team.members.huseyn.name",
    roleKey: "team.members.huseyn.role",
    icon: Code,
    photo: huseynPhoto,
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    id: "ibrahim",
    nameKey: "team.members.ibrahim.name",
    roleKey: "team.members.ibrahim.role",
    icon: Palette,
    photo: ibrahimPhoto,
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    id: "gulay",
    nameKey: "team.members.gulay.name",
    roleKey: "team.members.gulay.role",
    icon: Search,
    photo: gulayPhoto,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    id: "shabnam",
    nameKey: "team.members.shabnam.name",
    roleKey: "team.members.shabnam.role",
    icon: Sparkles,
    photo: shabnamPhoto,
    gradient: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-500",
  },
];

export default function Team() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-12 bg-background">
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4" />
                {t("team.backToHome", "Back to Home")}
              </Button>
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary" data-testid="badge-team-title">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {t("team.badge", "Our Team")}
            </Badge>
            <h1
              className="text-4xl lg:text-5xl font-bold mb-4"
              data-testid="text-team-title"
            >
              {t("team.title", "Meet the Team")}
            </h1>
            <p
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              data-testid="text-team-description"
            >
              {t("team.description", "The passionate people behind Peak Finder who are dedicated to bringing you the best mountain tourism experience in Azerbaijan.")}
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Mountain className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => {
            const IconComponent = member.icon;
            return (
              <Card
                key={member.id}
                className={`overflow-hidden border-card-border bg-gradient-to-br ${member.gradient} hover-elevate`}
                data-testid={`card-team-member-${member.id}`}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar
                      className="w-24 h-24 border-4 border-background shadow-lg"
                      data-testid={`avatar-${member.id}`}
                    >
                      <AvatarImage
                        src={member.photo}
                        alt={t(member.nameKey)}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-background">
                        <IconComponent className={`h-10 w-10 ${member.iconColor}`} />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <h3
                        className="text-xl font-bold"
                        data-testid={`text-name-${member.id}`}
                      >
                        {t(member.nameKey)}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="font-medium"
                        data-testid={`badge-role-${member.id}`}
                      >
                        {t(member.roleKey)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-card-border" data-testid="card-hackathon">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground" data-testid="text-hackathon">
              {t("team.hackathonNote", "Built with passion during the hackathon")}
            </span>
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <p className="text-muted-foreground" data-testid="text-made-in">
            {t("team.madeIn", "Made in Azerbaijan")}
          </p>
        </Card>
      </div>
    </div>
  );
}
