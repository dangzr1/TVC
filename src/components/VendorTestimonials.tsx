import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  isPremium: boolean;
}

const VendorTestimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Wedding Photographer",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "Since upgrading to Premium Top 10, my bookings have increased by 45%. The visibility boost has been incredible for my business!",
      rating: 5,
      isPremium: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Wedding Venue Owner",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "The analytics dashboard helps me understand what couples are looking for. Premium membership has paid for itself many times over.",
      rating: 5,
      isPremium: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Wedding Planner",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      content:
        "Being in the Top 50 has given my business the credibility boost it needed. Clients trust vendors with the premium badge.",
      rating: 4,
      isPremium: true,
    },
  ];

  return (
    <section className="py-16 bg-light-gray">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vendor Testimonials</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our vendors are saying about their experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-purple/10 group-hover:text-purple/20 transition-colors duration-300" />

                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-purple/10">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      {testimonial.isPremium && (
                        <Badge
                          variant="secondary"
                          className="bg-purple/10 text-purple text-xs"
                        >
                          Premium Vendor
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-dark-gray/70">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>

                <p className="text-dark-gray">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorTestimonials;
