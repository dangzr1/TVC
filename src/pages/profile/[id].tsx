import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  MapPin,
  Mail,
  Phone,
  Globe,
  Camera,
  Music,
  Cake,
  Briefcase,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  role: "vendor" | "client";
  avatar: string;
  location: string;
  email: string;
  phone: string;
  website?: string;
  bio: string;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  portfolio?: {
    title: string;
    image: string;
    description: string;
  }[];
  reviews?: {
    id: string;
    author: string;
    authorAvatar?: string;
    rating: number;
    date: string;
    content: string;
  }[];
}

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For demo purposes, we'll use mock data
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get user from conversations if available
        const storedConversations = localStorage.getItem("conversations");
        let userData = null;

        if (storedConversations) {
          const conversations = JSON.parse(storedConversations);
          const conversation = conversations.find(
            (c) => c.participantId === id,
          );

          if (conversation) {
            userData = {
              id: conversation.participantId,
              name: conversation.participantName,
              role: conversation.participantRole.toLowerCase(),
              avatar:
                conversation.participantAvatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.participantName}`,
              location: "New York, NY",
              email: `${conversation.participantName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
              phone: "(555) 123-4567",
              website:
                conversation.participantRole === "Vendor"
                  ? `https://${conversation.participantName.toLowerCase().replace(/\s+/g, "")}.com`
                  : undefined,
              bio:
                conversation.participantRole === "Vendor"
                  ? `Professional ${conversation.participantName.includes("Smith") ? "photographer" : "wedding planner"} with over 8 years of experience. Specializing in ${conversation.participantName.includes("Smith") ? "wedding photography and portraits" : "luxury wedding planning and coordination"}.`
                  : `Looking for the perfect vendors for my upcoming wedding. Planning a ${conversation.participantName.includes("Johnson") ? "summer" : "fall"} wedding with approximately 150 guests.`,
              specialties:
                conversation.participantRole === "Vendor"
                  ? conversation.participantName.includes("Smith")
                    ? [
                        "Wedding Photography",
                        "Engagement Sessions",
                        "Portrait Photography",
                      ]
                    : [
                        "Wedding Planning",
                        "Event Coordination",
                        "Vendor Management",
                      ]
                  : undefined,
              rating:
                conversation.participantRole === "Vendor" ? 4.8 : undefined,
              reviewCount:
                conversation.participantRole === "Vendor" ? 24 : undefined,
              portfolio:
                conversation.participantRole === "Vendor"
                  ? [
                      {
                        title: "Summer Wedding",
                        image:
                          "https://images.unsplash.com/photo-1519741497674-611481863552",
                        description:
                          "Beautiful summer wedding at Sunset Gardens",
                      },
                      {
                        title: "Beach Engagement",
                        image:
                          "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac",
                        description: "Romantic beach engagement session",
                      },
                      {
                        title: "Garden Wedding",
                        image:
                          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
                        description: "Elegant garden wedding with 200 guests",
                      },
                    ]
                  : undefined,
              reviews:
                conversation.participantRole === "Vendor"
                  ? [
                      {
                        id: "rev1",
                        author: "Jessica Thompson",
                        authorAvatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                        rating: 5,
                        date: "2023-05-15",
                        content:
                          "Absolutely amazing! Captured our special day perfectly and was so professional throughout.",
                      },
                      {
                        id: "rev2",
                        author: "Robert Chen",
                        authorAvatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
                        rating: 5,
                        date: "2023-04-22",
                        content:
                          "Exceeded our expectations. The photos are stunning and really captured the emotion of the day.",
                      },
                      {
                        id: "rev3",
                        author: "Amanda Garcia",
                        authorAvatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
                        rating: 4,
                        date: "2023-03-10",
                        content:
                          "Great service and beautiful photos. Would recommend to anyone looking for a wedding photographer.",
                      },
                    ]
                  : undefined,
            };
          }
        }

        // If user not found in conversations, use mock data
        if (!userData) {
          // Generate mock data based on ID
          const isVendor = id?.includes("vendor") || Math.random() > 0.5;
          const names = isVendor
            ? [
                "Michael Smith",
                "Sarah Williams",
                "Alex Rivera",
                "Jennifer Garcia",
                "Daniel Wilson",
              ]
            : [
                "Emily Johnson",
                "David Lee",
                "Jessica Thompson",
                "Robert Chen",
                "Amanda Garcia",
              ];
          const name = names[Math.floor(Math.random() * names.length)];

          userData = {
            id: id || "user1",
            name: name,
            role: isVendor ? "vendor" : "client",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.split(" ")[0]}`,
            location: "New York, NY",
            email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
            phone: "(555) 123-4567",
            website: isVendor
              ? `https://${name.toLowerCase().replace(/\s+/g, "")}.com`
              : undefined,
            bio: isVendor
              ? `Professional ${name.includes("Smith") || name.includes("Rivera") ? "photographer" : "wedding planner"} with over 8 years of experience. Specializing in ${name.includes("Smith") || name.includes("Rivera") ? "wedding photography and portraits" : "luxury wedding planning and coordination"}.`
              : `Looking for the perfect vendors for my upcoming wedding. Planning a ${name.includes("Johnson") ? "summer" : "fall"} wedding with approximately 150 guests.`,
            specialties: isVendor
              ? name.includes("Smith") || name.includes("Rivera")
                ? [
                    "Wedding Photography",
                    "Engagement Sessions",
                    "Portrait Photography",
                  ]
                : [
                    "Wedding Planning",
                    "Event Coordination",
                    "Vendor Management",
                  ]
              : undefined,
            rating: isVendor ? 4.8 : undefined,
            reviewCount: isVendor ? 24 : undefined,
            portfolio: isVendor
              ? [
                  {
                    title: "Summer Wedding",
                    image:
                      "https://images.unsplash.com/photo-1519741497674-611481863552",
                    description: "Beautiful summer wedding at Sunset Gardens",
                  },
                  {
                    title: "Beach Engagement",
                    image:
                      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac",
                    description: "Romantic beach engagement session",
                  },
                  {
                    title: "Garden Wedding",
                    image:
                      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
                    description: "Elegant garden wedding with 200 guests",
                  },
                ]
              : undefined,
            reviews: isVendor
              ? [
                  {
                    id: "rev1",
                    author: "Jessica Thompson",
                    authorAvatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                    rating: 5,
                    date: "2023-05-15",
                    content:
                      "Absolutely amazing! Captured our special day perfectly and was so professional throughout.",
                  },
                  {
                    id: "rev2",
                    author: "Robert Chen",
                    authorAvatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
                    rating: 5,
                    date: "2023-04-22",
                    content:
                      "Exceeded our expectations. The photos are stunning and really captured the emotion of the day.",
                  },
                  {
                    id: "rev3",
                    author: "Amanda Garcia",
                    authorAvatar:
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
                    rating: 4,
                    date: "2023-03-10",
                    content:
                      "Great service and beautiful photos. Would recommend to anyone looking for a wedding photographer.",
                  },
                ]
              : undefined,
          };
        }

        setProfile(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const getSpecialtyIcon = (specialty: string) => {
    if (specialty.toLowerCase().includes("photo"))
      return <Camera className="h-4 w-4" />;
    if (
      specialty.toLowerCase().includes("music") ||
      specialty.toLowerCase().includes("dj")
    )
      return <Music className="h-4 w-4" />;
    if (
      specialty.toLowerCase().includes("cake") ||
      specialty.toLowerCase().includes("catering")
    )
      return <Cake className="h-4 w-4" />;
    return <Briefcase className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-light-gray">
        <DashboardHeader />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-light-gray">
        <DashboardHeader />
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
              <p className="text-gray-500 mb-4">
                The user profile you're looking for doesn't exist or has been
                removed.
              </p>
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <DashboardHeader />
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-1">{profile.name}</h2>
                  <Badge
                    className={`mb-3 ${profile.role === "vendor" ? "bg-purple/10 text-purple" : "bg-pink/10 text-pink"}`}
                  >
                    {profile.role === "vendor" ? "Vendor" : "Client"}
                  </Badge>

                  {profile.role === "vendor" && profile.rating && (
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(profile.rating!) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {profile.rating} ({profile.reviewCount} reviews)
                      </span>
                    </div>
                  )}

                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-purple"
                      >
                        {profile.email}
                      </a>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <a
                        href={`tel:${profile.phone}`}
                        className="hover:text-purple"
                      >
                        {profile.phone}
                      </a>
                    </div>
                    {profile.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-purple"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-3">About</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>

                {profile.specialties && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="flex items-center gap-1 py-1"
                        >
                          {getSpecialtyIcon(specialty)}
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <Button className="w-full bg-purple hover:bg-purple/90">
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="w-full">
                {profile.role === "vendor" && (
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                )}
                {profile.role === "vendor" && profile.reviews && (
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                )}
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              {profile.role === "vendor" && (
                <TabsContent value="portfolio" className="mt-6">
                  {profile.portfolio ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.portfolio.map((item, index) => (
                        <Card
                          key={index}
                          className="overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <CardContent className="p-4">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-gray-500">
                          No portfolio items available
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}

              {profile.role === "vendor" && profile.reviews && (
                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Client Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {profile.reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b pb-6 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  {review.authorAvatar ? (
                                    <AvatarImage
                                      src={review.authorAvatar}
                                      alt={review.author}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {review.author.charAt(0)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">
                                    {review.author}
                                  </h4>
                                  <div className="flex items-center">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                      {review.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-600">
                              {review.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      About {profile.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Bio</h3>
                        <p className="text-gray-600">{profile.bio}</p>
                      </div>

                      {profile.specialties && (
                        <div>
                          <h3 className="font-medium mb-2">Specialties</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="flex items-center gap-1 py-1"
                              >
                                {getSpecialtyIcon(specialty)}
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-2">
                          Contact Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{profile.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <a
                              href={`mailto:${profile.email}`}
                              className="hover:text-purple"
                            >
                              {profile.email}
                            </a>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <a
                              href={`tel:${profile.phone}`}
                              className="hover:text-purple"
                            >
                              {profile.phone}
                            </a>
                          </div>
                          {profile.website && (
                            <div className="flex items-center text-gray-600">
                              <Globe className="h-4 w-4 mr-2" />
                              <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-purple"
                              >
                                {profile.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
