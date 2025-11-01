import { Code, Palette, Video, Megaphone, Music, PenTool, Sparkles, Briefcase, Users, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const categories = [
  { name: "Programming & Tech", icon: Code },
  { name: "Graphics & Design", icon: Palette },
  { name: "Digital Marketing", icon: Megaphone },
  { name: "Writing & Translation", icon: Languages },
  { name: "Video & Animation", icon: Video },
  { name: "AI Services", icon: Sparkles },
  { name: "Music & Audio", icon: Music },
  { name: "Business", icon: Users },
  { name: "Consulting", icon: Briefcase },
];

export const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            dragFree: true,
            containScroll: "trimSnaps",
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <CarouselItem key={category.name} className="pl-6 basis-[140px]">
                  <button
                    onClick={() => navigate('/explore')}
                    className="flex flex-col items-center gap-3 px-6 py-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 w-full"
                  >
                    <div className="p-3 rounded-lg bg-gray-50">
                      <Icon className="h-8 w-8 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center whitespace-normal">
                      {category.name}
                    </span>
                  </button>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
