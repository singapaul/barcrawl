import { Navigation2, Beer, Landmark } from 'lucide-react';

import { PubsType } from '@/app/schema';
import { Dispatch, SetStateAction } from 'react';
export type RouteStopsProps = {
  locations: PubsType;
  setActiveMarkerId: Dispatch<SetStateAction<string | undefined>>;
};

export const RouteStops = ({
  locations,
  setActiveMarkerId,
}: RouteStopsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-2 p-4 rounded-lg">
      <div className="md:col-span-1">
        <div>
          <div className="flex items-center font-bold">
            <Navigation2 className="w-4 h-4 mr-2" />
            Route Stops
          </div>
        </div>
        <div>
          <div className="space-y-2">
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <div
                  key={location.description}
                  className="p-2 rounded hover:bg-slate-100 cursor-pointer flex items-center"
                  onClick={() => setActiveMarkerId(index.toString())}
                >
                  {location.locationType === 'pub' ? (
                    <Beer className="w-4 h-4 mr-2" />
                  ) : (
                    <Landmark className="w-4 h-4 mr-2" />
                  )}
                  <span>{location.name}</span>
                </div>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
