import { Code, Palette, Video, Megaphone, Music, PenTool, Sparkles, Briefcase } from "lucide-react";

const categories = [
  { name: "Programming & Tech", icon: Code, color: "from-blue-500 to-cyan-500" },
  { name: "Graphics & Design", icon: Palette, color: "from-pink-500 to-rose-500" },
  { name: "Video & Animation", icon: Video, color: "from-purple-500 to-indigo-500" },
  { name: "Digital Marketing", icon: Megaphone, color: "from-orange-500 to-amber-500" },
  { name: "Music & Audio", icon: Music, color: "from-green-500 to-emerald-500" },
  { name: "Writing & Translation", icon: PenTool, color: "from-teal-500 to-cyan-500" },
  { name: "AI Services", icon: Sparkles, color: "from-violet-500 to-purple-500" },
  { name: "Business", icon: Briefcase, color: "from-slate-600 to-slate-800" },
];

export const Categories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore by Category
          </h2>
          <p className="text-muted-foreground text-lg">
            Find the perfect service for your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:shadow-large hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {category.name}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
