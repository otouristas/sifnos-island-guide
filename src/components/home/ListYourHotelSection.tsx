
import { Link } from 'react-router-dom';
import { Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ListYourHotelSection() {
  return (
    <div className="py-20 bg-gradient-to-r from-sifnos-deep-blue to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block p-2 bg-white/15 rounded-lg backdrop-blur-sm">
              <Hotel className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-montserrat font-bold">List Your Hotel on HotelsSifnos</h2>
            <p className="text-lg opacity-95 leading-relaxed">
              Showcase your property to thousands of travelers looking for the perfect Sifnos experience. 
              Choose from our flexible listing options to get the visibility your business deserves.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="bg-white/20 border-0 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-2">Basic</div>
                  <p className="text-white font-bold">Free</p>
                </CardContent>
              </Card>
              <Card className="bg-white/30 border-0 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white text-sifnos-deep-blue px-2 py-1 text-xs font-semibold">
                  POPULAR
                </div>
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-2">Premium</div>
                  <p className="text-white font-bold">€249/yr</p>
                </CardContent>
              </Card>
              <Card className="bg-white/20 border-0 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold mb-2">Pro</div>
                  <p className="text-white font-bold">€499/yr</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-sifnos-deep-blue hover:bg-gray-100">
                <Link to="/pricing">View Plans</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white border-2 bg-sifnos-turquoise/20 text-white hover:bg-sifnos-turquoise/40 hover:text-white hover:border-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-400/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-16 -right-12 w-80 h-80 bg-white/20 rounded-full filter blur-3xl"></div>
            <div className="relative z-10 bg-gradient-to-br from-white/15 to-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="w-full h-32 rounded-lg bg-white/10 border border-white/20"></div>
                  <div className="w-3/4 h-3 rounded bg-white/30"></div>
                  <div className="w-1/2 h-3 rounded bg-white/25"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-32 rounded-lg bg-white/10 border border-white/20"></div>
                  <div className="w-3/4 h-3 rounded bg-white/30"></div>
                  <div className="w-1/2 h-3 rounded bg-white/25"></div>
                </div>
                <div className="col-span-2 flex justify-between items-center pt-2">
                  <div className="space-y-1">
                    <div className="w-20 h-6 rounded bg-white/40"></div>
                    <div className="w-16 h-3 rounded bg-white/25"></div>
                  </div>
                  <div className="w-20 h-8 rounded-lg bg-white/60"></div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                  <div className="w-full h-3 rounded bg-white/30"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                  <div className="w-full h-3 rounded bg-white/30"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-400/50"></div>
                  <div className="w-2/3 h-3 rounded bg-white/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
