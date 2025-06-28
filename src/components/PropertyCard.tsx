
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {property.image_url ? (
          <img 
            src={property.image_url} 
            alt={property.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-blue-600">
                {getPropertyInitial(property.name)}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 truncate">
            {property.name}
          </h3>
          <Badge className={getStatusColor(property.status)}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
        
        {property.address && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.address}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {property.nightly_rate && (
          <div className="mt-2 text-lg font-semibold text-green-600">
            ${property.nightly_rate}/night
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
