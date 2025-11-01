import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const services = [
  { 
    title: "Vibe Coding",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    bgColor: "bg-emerald-800"
  },
  { 
    title: "Website Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    bgColor: "bg-teal-800"
  },
  { 
    title: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    bgColor: "bg-rose-800"
  },
  { 
    title: "Software Development",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    bgColor: "bg-amber-800"
  },
  { 
    title: "SEO",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
    bgColor: "bg-teal-700"
  },
  { 
    title: "Architecture & Interior Design",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    bgColor: "bg-pink-800"
  },
];

export const PopularServices = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Popular services
        </h2>

        <Carousel
          opts={{
            dragFree: true,
            containScroll: "trimSnaps",
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {services.map((service, index) => (
              <CarouselItem key={index} className="pl-6 basis-[300px] md:basis-[360px]">
                <button
                  onClick={() => navigate('/explore')}
                  className="w-full group"
                >
                  <div className={`${service.bgColor} rounded-xl overflow-hidden h-[280px] relative transition-transform duration-300 hover:scale-105`}>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <h3 className="text-white text-2xl font-bold">
                        {service.title}
                      </h3>
                    </div>
                    <div className="absolute bottom-0 right-0 w-2/3 h-2/3">
                      <div className="relative w-full h-full rounded-tl-[80px] overflow-hidden bg-gradient-to-br from-white/20 to-white/10 p-4">
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-tl-[60px]"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};