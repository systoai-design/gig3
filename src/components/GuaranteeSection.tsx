import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle, Award } from "lucide-react";

export const GuaranteeSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-amber-100 to-yellow-50 rounded-[35px] overflow-hidden shadow-xl border border-amber-200">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">gig3.</span>
                <span className="text-2xl font-bold text-primary">pro</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                High-quality work,<br />
                or your <span className="font-black text-primary">money back</span>
              </h2>
              <p className="text-gray-700 text-lg mb-6 max-w-lg">
                On GIG3 Pro, you can bring your vision to life risk-free. Every project with vetted Pro freelancers is backed by our money-back guarantee, so you can accomplish any high-stakes project with total confidence.
              </p>
              <Button
                onClick={() => navigate('/explore')}
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-[35px]"
              >
                Try now
              </Button>
            </div>
            <div className="relative h-64 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-[35px] shadow-2xl transform -rotate-3"></div>
                  <div className="absolute inset-0 flex items-center justify-center transform rotate-3">
                    <div className="bg-white rounded-[35px] p-8 shadow-xl">
                      <Shield className="h-20 w-20 text-primary mx-auto mb-4" />
                      <div className="flex gap-4 justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                        <Award className="h-10 w-10 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};