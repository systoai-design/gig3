import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const GuaranteeSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">gig3.</span>
                <span className="text-2xl font-bold text-gray-600">pro</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                High-quality work,<br />
                or your <span className="font-black">money back</span>
              </h2>
              <p className="text-gray-700 text-lg mb-6 max-w-lg">
                On GIG3 Pro, you can bring your vision to life risk-free. Every project with vetted Pro freelancers is backed by our money-back guarantee, so you can accomplish any high-stakes project with total confidence.
              </p>
              <Button
                onClick={() => navigate('/explore')}
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 font-semibold"
              >
                Try now
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full max-w-md bg-gradient-to-br from-blue-500 via-teal-400 to-blue-600 rounded-2xl shadow-2xl transform -rotate-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};