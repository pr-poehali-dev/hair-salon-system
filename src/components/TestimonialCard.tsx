
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
}

const TestimonialCard = ({ name, rating, comment, image, date }: TestimonialCardProps) => {
  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={image}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-gold fill-gold" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-700 flex-grow">{comment}</p>
    </Card>
  );
};

export default TestimonialCard;
